import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Wand2, Eye, EyeOff } from "lucide-react";
import { DashHeader } from "@/components/PageBits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateViva } from "@/lib/ai-service";
import { useAI } from "@/lib/ai-context";
import { toast } from "sonner";

export const Route = createFileRoute("/ai/viva-generator")({
  head: () => ({ meta: [{ title: "AI Viva Generator — ProjectHub" }] }),
  component: Page,
});

type Section = "technical" | "theory" | "practical" | "hr";

function Page() {
  const { logUsage } = useAI();
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Awaited<ReturnType<typeof generateViva>> | null>(null);
  const [show, setShow] = useState<Record<string, boolean>>({});

  const submit = async () => {
    setLoading(true);
    try { setData(await generateViva(topic)); logUsage("Viva Generator"); toast.success("Viva ready"); }
    finally { setLoading(false); }
  };

  const sections: { key: Section; title: string; emoji: string }[] = [
    { key: "technical", title: "Technical", emoji: "⚙️" },
    { key: "theory", title: "Theory", emoji: "📘" },
    { key: "practical", title: "Practical", emoji: "🛠" },
    { key: "hr", title: "HR", emoji: "🤝" },
  ];

  return (
    <>
      <DashHeader title="AI Viva Generator" subtitle="Practice viva questions across categories" />
      <div className="mb-6 rounded-2xl border border-border bg-card p-6">
        <div className="flex gap-2">
          <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Project topic (optional)" />
          <Button onClick={submit} disabled={loading} className="bg-gradient-primary"><Wand2 className="mr-2 h-4 w-4" />{loading ? "Generating…" : "Generate"}</Button>
        </div>
      </div>

      {!data ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-border p-12 text-center">
          <MessageSquare className="h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Generate questions to start practicing</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {sections.map((s) => (
            <motion.div key={s.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-display text-base font-semibold">{s.emoji} {s.title}</h3>
              <div className="mt-4 space-y-3">
                {data[s.key].map((q, i) => {
                  const k = `${s.key}-${i}`;
                  return (
                    <div key={k} className="rounded-xl border border-border bg-background p-4">
                      <p className="text-sm font-medium">{q.q}</p>
                      <button onClick={() => setShow((p) => ({ ...p, [k]: !p[k] }))}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                        {show[k] ? <><EyeOff className="h-3 w-3" /> Hide answer</> : <><Eye className="h-3 w-3" /> Show answer</>}
                      </button>
                      {show[k] && <p className="mt-2 rounded-md bg-muted p-3 text-sm">{q.a}</p>}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}
