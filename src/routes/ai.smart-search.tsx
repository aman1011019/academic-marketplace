import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, Clock } from "lucide-react";
import { DashHeader } from "@/components/PageBits";
import { smartSearch } from "@/lib/ai-service";
import { useAI } from "@/lib/ai-context";
import type { Project } from "@/lib/mock-data";

export const Route = createFileRoute("/ai/smart-search")({
  head: () => ({ meta: [{ title: "AI Smart Search — ProjectHub" }] }),
  component: Page,
});

const trending = ["AI chatbot", "blockchain voting", "IoT smart home", "image classification", "real-time chat"];
const suggested = ["projects with React", "final year ML projects", "low-cost IoT", "DBMS mini project"];

function Page() {
  const { recentSearches, addSearch, logUsage } = useAI();
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Project[]>([]);

  const go = async (term: string) => {
    if (!term.trim()) return;
    setQ(term); setLoading(true);
    try {
      const r = await smartSearch(term);
      setResults(r); addSearch(term); logUsage("Smart Search");
    } finally { setLoading(false); }
  };

  return (
    <>
      <DashHeader title="AI Smart Search" subtitle="Semantic search across all projects" />
      <div className="mb-6 rounded-2xl border border-border bg-card p-6">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") void go(q); }}
            placeholder="Search projects by topic, tech, or domain…"
            className="h-14 w-full rounded-xl border border-border bg-background pl-12 pr-4 text-sm outline-none ring-ring focus:ring-2"
          />
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <Group title="Trending" icon={TrendingUp} items={trending} onPick={go} />
          <Group title="Suggested" icon={Search} items={suggested} onPick={go} />
          <Group title="Recent" icon={Clock} items={recentSearches} onPick={go} empty="No recent searches" />
        </div>
      </div>

      {loading ? (
        <div className="grid place-items-center py-12 text-sm text-muted-foreground">Searching…</div>
      ) : results.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Link to="/projects/$id" params={{ id: p.id }} className="block overflow-hidden rounded-2xl border border-border bg-card shadow-soft hover:-translate-y-1 hover:shadow-elegant">
                <img src={p.thumbnail} alt="" className="aspect-video w-full object-cover" />
                <div className="p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-primary">{p.category}</p>
                  <h3 className="mt-1 line-clamp-1 font-semibold">{p.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.description}</p>
                  <p className="mt-3 text-sm font-bold text-primary">₹{p.price}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : q ? (
        <p className="text-center text-sm text-muted-foreground">No results for "{q}"</p>
      ) : null}
    </>
  );
}

function Group({ title, icon: Icon, items, onPick, empty }: { title: string; icon: any; items: string[]; onPick: (s: string) => void; empty?: string }) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground"><Icon className="h-3.5 w-3.5" /> {title}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.length === 0 ? <span className="text-xs text-muted-foreground">{empty}</span> : items.map((s) => (
          <button key={s} onClick={() => onPick(s)} className="rounded-full border border-border bg-background px-3 py-1 text-xs hover:border-primary hover:bg-accent">{s}</button>
        ))}
      </div>
    </div>
  );
}
