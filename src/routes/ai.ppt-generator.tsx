import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Presentation, Wand2 } from "lucide-react";
import { DashHeader } from "@/components/PageBits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generatePPT } from "@/lib/ai-service";
import { useAI } from "@/lib/ai-context";
import { toast } from "sonner";

export const Route = createFileRoute("/ai/ppt-generator")({
  head: () => ({ meta: [{ title: "AI PPT Generator — ProjectHub" }] }),
  component: Page,
});

function Page() {
  const { logUsage } = useAI();
  const [form, setForm] = useState({ title: "", abstract: "", docs: "" });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Awaited<ReturnType<typeof generatePPT>> | null>(null);

  const submit = async () => {
    setLoading(true);
    try { setData(await generatePPT(form)); logUsage("PPT Generator"); toast.success("Deck generated"); }
    finally { setLoading(false); }
  };

  return (
    <>
      <DashHeader title="AI PPT Generator" subtitle="Generate complete slide decks with speaker notes" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="grid gap-4">
            <div><Label>Project Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Abstract</Label><Textarea rows={4} value={form.abstract} onChange={(e) => setForm({ ...form, abstract: e.target.value })} /></div>
            <div><Label>Documentation (optional)</Label><Textarea rows={4} value={form.docs} onChange={(e) => setForm({ ...form, docs: e.target.value })} /></div>
            <Button onClick={submit} disabled={loading} className="bg-gradient-primary"><Wand2 className="mr-2 h-4 w-4" />{loading ? "Generating…" : "Generate Slides"}</Button>
          </div>
        </div>
        <div className="lg:col-span-2">
          {!data ? (
            <div className="grid h-full place-items-center rounded-2xl border border-dashed border-border p-12 text-center">
              <Presentation className="h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">Enter project details to generate a deck</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="mb-4 rounded-2xl border border-border bg-card p-5">
                <h3 className="font-display text-base font-semibold">📋 Outline</h3>
                <ol className="mt-2 list-inside list-decimal text-sm text-muted-foreground">{data.outline.map((o) => <li key={o}>{o}</li>)}</ol>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {data.slides.map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="overflow-hidden rounded-xl border border-border bg-gradient-card shadow-soft">
                    <div className="aspect-video bg-gradient-primary p-5 text-primary-foreground">
                      <p className="text-[10px] font-semibold uppercase opacity-80">Slide {i + 1}</p>
                      <h4 className="mt-1 font-display text-base font-bold">{s.title}</h4>
                      <p className="mt-2 whitespace-pre-line text-xs opacity-95">{s.body}</p>
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Speaker Notes</p>
                      <p className="mt-1 text-xs">{s.notes}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
