import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, BookOpen, Wand2 } from "lucide-react";
import { DashHeader } from "@/components/PageBits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { explainProject } from "@/lib/ai-service";
import { useAI } from "@/lib/ai-context";
import { projects } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/ai/project-explainer")({
  head: () => ({ meta: [{ title: "AI Project Explainer — ProjectHub" }] }),
  component: Page,
});

function Page() {
  const { logUsage } = useAI();
  const [selected, setSelected] = useState("");
  const [file, setFile] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Awaited<ReturnType<typeof explainProject>> | null>(null);

  const submit = async () => {
    setLoading(true);
    try {
      const d = await explainProject({ title: selected, file });
      setData(d); logUsage("Project Explainer"); toast.success("Project explained");
    } finally { setLoading(false); }
  };

  return (
    <>
      <DashHeader title="AI Project Explainer" subtitle="Understand any project's architecture instantly" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-1">
          <Label>Select Project</Label>
          <select value={selected} onChange={(e) => setSelected(e.target.value)} className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
            <option value="">— pick one —</option>
            {projects.slice(0, 20).map((p) => <option key={p.id} value={p.title}>{p.title}</option>)}
          </select>
          <div className="my-4 text-center text-xs text-muted-foreground">— or —</div>
          <Label>Upload Project File</Label>
          <label className="mt-1 flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border bg-background px-3 py-3 text-sm hover:border-primary">
            <Upload className="h-4 w-4" />
            <span className="truncate text-muted-foreground">{file || "Choose .zip, .pdf, .docx"}</span>
            <Input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0]?.name ?? "")} />
          </label>
          <Button onClick={submit} disabled={loading || (!selected && !file)} className="mt-5 w-full bg-gradient-primary">
            <Wand2 className="mr-2 h-4 w-4" /> {loading ? "Analyzing…" : "Explain Project"}
          </Button>
        </div>
        <div className="lg:col-span-2">
          {!data ? (
            <div className="grid h-full place-items-center rounded-2xl border border-dashed border-border p-12 text-center">
              <BookOpen className="h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">Select a project or upload files to begin</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card p-6">
              <Tabs defaultValue="overview">
                <TabsList className="w-full flex-wrap justify-start">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="arch">Architecture</TabsTrigger>
                  <TabsTrigger value="flow">Workflow</TabsTrigger>
                  <TabsTrigger value="stack">Tech Stack</TabsTrigger>
                  <TabsTrigger value="db">Database</TabsTrigger>
                  <TabsTrigger value="api">API</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="text-sm leading-relaxed">{data.overview}</TabsContent>
                <TabsContent value="arch" className="text-sm leading-relaxed">{data.architecture}</TabsContent>
                <TabsContent value="flow" className="text-sm leading-relaxed">{data.workflow}</TabsContent>
                <TabsContent value="stack"><div className="flex flex-wrap gap-2">{data.stack.map((s) => <span key={s} className="rounded-md bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{s}</span>)}</div></TabsContent>
                <TabsContent value="db" className="text-sm leading-relaxed">{data.database}</TabsContent>
                <TabsContent value="api" className="text-sm leading-relaxed">{data.api}</TabsContent>
              </Tabs>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
