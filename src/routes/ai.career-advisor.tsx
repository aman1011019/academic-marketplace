import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Wand2 } from "lucide-react";
import { DashHeader } from "@/components/PageBits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { careerAdvisor } from "@/lib/ai-service";
import { useAI } from "@/lib/ai-context";
import { toast } from "sonner";

export const Route = createFileRoute("/ai/career-advisor")({
  head: () => ({ meta: [{ title: "AI Career Advisor — ProjectHub" }] }),
  component: Page,
});

function Page() {
  const { logUsage } = useAI();
  const [form, setForm] = useState({ degree: "", branch: "", skills: "", interests: "" });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Awaited<ReturnType<typeof careerAdvisor>> | null>(null);

  const submit = async () => {
    setLoading(true);
    try { setData(await careerAdvisor(form)); logUsage("Career Advisor"); toast.success("Roadmap ready"); }
    finally { setLoading(false); }
  };

  return (
    <>
      <DashHeader title="AI Career Advisor" subtitle="Personalized careers, certifications & roadmap" />
      <div className="mb-6 grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2 lg:grid-cols-4">
        {(["degree", "branch", "skills", "interests"] as const).map((k) => (
          <div key={k}><Label className="capitalize">{k}</Label><Input value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></div>
        ))}
        <div className="sm:col-span-2 lg:col-span-4">
          <Button onClick={submit} disabled={loading} className="bg-gradient-primary"><Wand2 className="mr-2 h-4 w-4" />{loading ? "Planning…" : "Generate Roadmap"}</Button>
        </div>
      </div>

      {!data ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-border p-12 text-center">
          <Sparkles className="h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Tell us about you to get tailored guidance</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card title="🎯 Careers">{data.careers.map((c) => <Pill key={c}>{c}</Pill>)}</Card>
            <Card title="📜 Certifications">{data.certifications.map((c) => <Pill key={c}>{c}</Pill>)}</Card>
            <Card title="📚 Courses">{data.courses.map((c) => <Pill key={c}>{c}</Pill>)}</Card>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-display text-base font-semibold">🗺 Career Roadmap</h3>
            <div className="relative mt-6 space-y-6 border-l-2 border-primary/30 pl-6">
              {data.roadmap.map((r, i) => (
                <motion.div key={r.stage} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="relative">
                  <span className="absolute -left-[31px] top-1 grid h-5 w-5 place-items-center rounded-full bg-gradient-primary text-[10px] font-bold text-primary-foreground shadow-glow">{i + 1}</span>
                  <p className="font-display text-sm font-semibold text-primary">{r.stage}</p>
                  <ul className="mt-1 list-inside list-disc space-y-0.5 text-sm">{r.items.map((it) => <li key={it}>{it}</li>)}</ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="rounded-2xl border border-border bg-card p-5"><h3 className="mb-3 font-display text-base font-semibold">{title}</h3><div className="flex flex-wrap gap-2">{children}</div></div>;
}
function Pill({ children }: { children: React.ReactNode }) {
  return <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{children}</span>;
}
