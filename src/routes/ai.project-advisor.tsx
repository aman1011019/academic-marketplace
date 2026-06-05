import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Wand2 } from "lucide-react";
import { DashHeader } from "@/components/PageBits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { recommendProjects } from "@/lib/ai-service";
import { useAI } from "@/lib/ai-context";
import { toast } from "sonner";

export const Route = createFileRoute("/ai/project-advisor")({
  head: () => ({ meta: [{ title: "AI Project Advisor — ProjectHub" }] }),
  component: Page,
});

function Page() {
  const { logUsage } = useAI();
  const [form, setForm] = useState({ branch: "", semester: "", interests: "", level: "Intermediate" });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Awaited<ReturnType<typeof recommendProjects>>>([]);

  const submit = async () => {
    setLoading(true);
    try {
      const r = await recommendProjects(form);
      setResults(r);
      logUsage("Project Advisor");
      toast.success("Generated recommendations");
    } catch { toast.error("Failed to generate"); } finally { setLoading(false); }
  };

  return (
    <>
      <DashHeader title="AI Project Advisor" subtitle="Get personalized project ideas in seconds" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-1">
          <div className="grid gap-4">
            <div><Label>Branch</Label><Input value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} placeholder="e.g. CSE" /></div>
            <div><Label>Semester</Label><Input value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} placeholder="e.g. 7" /></div>
            <div><Label>Interests</Label><Input value={form.interests} onChange={(e) => setForm({ ...form, interests: e.target.value })} placeholder="AI, web, IoT…" /></div>
            <div>
              <Label>Skill Level</Label>
              <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
              </select>
            </div>
            <Button onClick={submit} disabled={loading} className="bg-gradient-primary"><Wand2 className="mr-2 h-4 w-4" /> {loading ? "Generating…" : "Generate Ideas"}</Button>
          </div>
        </div>
        <div className="lg:col-span-2">
          {results.length === 0 ? (
            <div className="grid h-full place-items-center rounded-2xl border border-dashed border-border p-12 text-center">
              <Lightbulb className="h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">Fill in your details to get tailored project ideas</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {results.map((r, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="font-display text-base font-semibold">{r.title}</h3>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">{r.difficulty}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">⏱ {r.time}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {r.tech.map((t) => <span key={t} className="rounded-md bg-accent px-2 py-0.5 text-xs">{t}</span>)}
                  </div>
                  <div className="mt-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Learning Outcomes</p>
                    <ul className="mt-1 list-inside list-disc text-sm">
                      {r.outcomes.map((o) => <li key={o}>{o}</li>)}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
