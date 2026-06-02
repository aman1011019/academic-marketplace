import { createFileRoute } from "@tanstack/react-router";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { DashHeader } from "@/components/PageBits";
import { revenueByMonth } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/revenue")({
  head: () => ({ meta: [{ title: "Revenue analytics — Admin" }] }),
  component: () => {
    const total = revenueByMonth.reduce((s, r) => s + r.revenue, 0);
    const avg = Math.round(total / revenueByMonth.length);
    return (
      <>
        <DashHeader title="Revenue analytics" subtitle="Monthly performance overview." />
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Stat label="Total revenue" value={`₹${(total / 100000).toFixed(2)}L`} />
          <Stat label="Avg per month" value={`₹${(avg / 1000).toFixed(1)}K`} />
          <Stat label="Best month" value="Dec — ₹1.28L" />
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 font-display font-semibold">Revenue over time</h3>
          <ResponsiveContainer width="100%" height={360}>
            <AreaChart data={revenueByMonth}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.62 0.19 258)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="oklch(0.62 0.19 258)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="oklch(0.62 0.19 258)" strokeWidth={3} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </>
    );
  },
});

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold text-gradient">{value}</p>
    </div>
  );
}
