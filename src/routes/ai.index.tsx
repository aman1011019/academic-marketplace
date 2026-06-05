import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/store";
import { useAI } from "@/lib/ai-context";
import { aiNav } from "@/components/ai/AIShell";
import { DashHeader } from "@/components/PageBits";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export const Route = createFileRoute("/ai/")({
  head: () => ({ meta: [{ title: "AI Dashboard — ProjectHub" }] }),
  component: Page,
});

function Page() {
  const { user } = useAuth();
  const { usage } = useAI();
  const tools = aiNav.filter((t) => t.to !== "/ai");

  // Daily usage last 7 days
  const today = new Date();
  const daily = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today); d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    return { day: d.toLocaleDateString("en", { weekday: "short" }), count: usage.filter((u) => u.date.slice(0, 10) === key).length };
  });
  const byTool = Object.entries(usage.reduce<Record<string, number>>((acc, u) => { acc[u.tool] = (acc[u.tool] || 0) + 1; return acc; }, {}))
    .map(([tool, count]) => ({ tool, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const recent = usage.slice(-6).reverse();

  return (
    <>
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-primary p-8 text-primary-foreground shadow-elegant"
      >
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2"><Sparkles className="h-5 w-5" /><p className="text-xs font-semibold uppercase tracking-widest opacity-90">AI Studio</p></div>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Hello, {user?.name?.split(" ")[0] || "Student"} 👋</h1>
          <p className="mt-2 max-w-xl text-sm opacity-90">Your AI workspace — generate ideas, build decks, ace your viva, and shape your career, all in one place.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/ai/project-advisor"><span className="inline-flex items-center gap-1 rounded-full bg-background/20 px-4 py-2 text-xs font-semibold backdrop-blur hover:bg-background/30">⚡ Suggest a project</span></Link>
            <Link to="/ai/viva-generator"><span className="inline-flex items-center gap-1 rounded-full bg-background/20 px-4 py-2 text-xs font-semibold backdrop-blur hover:bg-background/30">🎓 Practice viva</span></Link>
            <Link to="/ai/resume-builder"><span className="inline-flex items-center gap-1 rounded-full bg-background/20 px-4 py-2 text-xs font-semibold backdrop-blur hover:bg-background/30">📄 Build resume</span></Link>
          </div>
        </div>
      </motion.div>

      {/* Tools Grid */}
      <DashHeader title="AI Tools" subtitle="Pick a tool to get started" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t, i) => (
          <motion.div key={t.to} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Link to={t.to} className="group block h-full rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-elegant">
              <div className="flex items-start justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                  <t.icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold">{t.label}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-base font-semibold">Daily AI Usage</h3>
          <p className="text-xs text-muted-foreground">Last 7 days</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer>
              <LineChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="oklch(0.62 0.19 258)" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-base font-semibold">Most Used Tools</h3>
          <p className="text-xs text-muted-foreground">All-time</p>
          <div className="mt-4 h-56">
            {byTool.length === 0 ? (
              <div className="grid h-full place-items-center text-sm text-muted-foreground">No usage yet — try a tool above ✨</div>
            ) : (
              <ResponsiveContainer>
                <BarChart data={byTool}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="tool" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="oklch(0.72 0.16 250)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h3 className="font-display text-base font-semibold">Recent AI Activity</h3>
        {recent.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No activity yet. Your AI history will appear here.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {recent.map((r, i) => (
              <li key={i} className="flex items-center justify-between py-2.5 text-sm">
                <span className="font-medium">{r.tool}</span>
                <span className="text-xs text-muted-foreground">{new Date(r.date).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
