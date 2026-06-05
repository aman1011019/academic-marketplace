import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { FileBadge, Wand2, Copy } from "lucide-react";
import { DashHeader } from "@/components/PageBits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { buildResume } from "@/lib/ai-service";
import { useAI } from "@/lib/ai-context";
import { toast } from "sonner";

export const Route = createFileRoute("/ai/resume-builder")({
  head: () => ({ meta: [{ title: "AI Resume Builder — ProjectHub" }] }),
  component: Page,
});

function Page() {
  const { logUsage } = useAI();
  const [form, setForm] = useState({ name: "", tech: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Awaited<ReturnType<typeof buildResume>> | null>(null);

  const submit = async () => {
    setLoading(true);
    try { setData(await buildResume(form)); logUsage("Resume Builder"); toast.success("Generated"); }
    finally { setLoading(false); }
  };

  const copy = (text: string) => { navigator.clipboard.writeText(text); toast.success("Copied!"); };

  return (
    <>
      <DashHeader title="AI Resume Builder" subtitle="Turn projects into resume-ready content" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="grid gap-4">
            <div><Label>Project Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Technologies</Label><Input value={form.tech} onChange={(e) => setForm({ ...form, tech: e.target.value })} placeholder="React, Node, MongoDB" /></div>
            <div><Label>Description</Label><Textarea rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <Button onClick={submit} disabled={loading} className="bg-gradient-primary"><Wand2 className="mr-2 h-4 w-4" />{loading ? "Generating…" : "Generate"}</Button>
          </div>
        </div>
        <div className="lg:col-span-2">
          {!data ? (
            <div className="grid h-full place-items-center rounded-2xl border border-dashed border-border p-12 text-center">
              <FileBadge className="h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">Fill the form to generate resume content</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <Block title="📄 Resume Bullets" onCopy={() => copy(data.bullets.join("\n"))}>
                <ul className="list-inside list-disc space-y-1.5 text-sm">{data.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
              </Block>
              <Block title="💼 LinkedIn Post" onCopy={() => copy(data.linkedin)}>
                <p className="whitespace-pre-line text-sm leading-relaxed">{data.linkedin}</p>
              </Block>
              <Block title="🌐 Portfolio Description" onCopy={() => copy(data.portfolio)}>
                <p className="text-sm leading-relaxed">{data.portfolio}</p>
              </Block>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}

function Block({ title, children, onCopy }: { title: string; children: React.ReactNode; onCopy: () => void }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-base font-semibold">{title}</h3>
        <Button size="sm" variant="outline" onClick={onCopy}><Copy className="mr-1.5 h-3.5 w-3.5" /> Copy</Button>
      </div>
      {children}
    </div>
  );
}
