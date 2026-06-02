import { createFileRoute } from "@tanstack/react-router";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { DashHeader } from "@/components/PageBits";
import { downloadsByCategory } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/downloads")({
  head: () => ({ meta: [{ title: "Download analytics — Admin" }] }),
  component: () => (
    <>
      <DashHeader title="Download analytics" subtitle="Downloads grouped by category." />
      <div className="rounded-2xl border border-border bg-card p-6">
        <ResponsiveContainer width="100%" height={420}>
          <BarChart data={downloadsByCategory} layout="vertical" margin={{ left: 100 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis type="number" fontSize={12} />
            <YAxis type="category" dataKey="name" fontSize={12} width={140} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
            <Bar dataKey="downloads" fill="oklch(0.72 0.16 250)" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  ),
});
