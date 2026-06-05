import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Compass, Wand2 } from "lucide-react";
import { DashHeader } from "@/components/PageBits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { researchAssistant } from "@/lib/ai-service";
import { useAI } from "@/lib/ai-context";
import { toast } from "sonner";

export const Route = createFileRoute("/ai/research-assistant")({
  head: () => ({ meta: [{ title: "AI Research Assistant — ProjectHub" }] }),
  component: Page,
});

function Page() {
  const { logUsage } = useAI();
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Awaited<ReturnType<typeof researchAssistant>> | null>(null);

  const submit = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try { setData(await researchAssistant(topic)); logUsage("Research Assistant"); toast.success("Research generated"); }
    finally { setLoading(false); }
  };

  return (
    <>
      <DashHeader title="AI Research Assistant" subtitle="Ideas, literature, gaps, methodology" />
      <div className="mb-6 rounded-2xl border border-border bg-card p-6">
        <Label>Research Topic</Label>
        <div className="mt-2 flex gap-2">
          <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Federated learning for healthcare" />
          <Button onClick={submit} disabled={loading || !topic.trim()} className="bg-gradient-primary"><Wand2 className="mr-2 h-4 w-4" />{loading ? "Researching…" : "Generate"}</Button>
        </div>
      </div>

      {!data ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-border p-12 text-center">
          <Compass className="h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Enter a topic to get research scaffolding</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4 lg:grid-cols-2">
          <Section title="💡 Research Ideas">{data.ideas.map((x, i) => <li key={i}>{x}</li>)}</Section>
          <Section title="📚 Literature Review"><p>{data.literature}</p></Section>
          <Section title="🔍 Research Gap"><p>{data.gap}</p></Section>
          <Section title="🧪 Methodology"><p>{data.methodology}</p></Section>
          <Section title="📑 References" className="lg:col-span-2">{data.references.map((x, i) => <li key={i}>{x}</li>)}</Section>
        </motion.div>
      )}
    </>
  );
}

function Section({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-5 ${className}`}>
      <h3 className="font-display text-base font-semibold">{title}</h3>
      <div className="mt-3 space-y-2 text-sm leading-relaxed">
        {typeof children === "string" ? children : Array.isArray(children) ? <ul className="list-inside list-disc space-y-1">{children}</ul> : children}
      </div>
    </div>
  );
}
