import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { IndianRupee, ShoppingBag, Users, Download, TrendingUp } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { DashHeader } from "@/components/PageBits";
import { revenueByMonth, downloadsByCategory, mockOrders } from "@/lib/mock-data";

const COLORS = ["oklch(0.62 0.19 258)", "oklch(0.72 0.16 250)", "oklch(0.78 0.15 70)", "oklch(0.65 0.16 155)", "oklch(0.6 0.22 25)"];

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin analytics — ProjectHub" }] }),
  component: Page,
});

function Page() {
  const totalRev = revenueByMonth.reduce((s, r) => s + r.revenue, 0);
  const totalOrders = revenueByMonth.reduce((s, r) => s + r.orders, 0);
  const stats = [
    { icon: IndianRupee, label: "Revenue", value: `₹${(totalRev / 100000).toFixed(1)}L`, change: "+18.4%", color: "text-primary", bg: "bg-primary/10" },
    { icon: ShoppingBag, label: "Orders", value: totalOrders.toLocaleString(), change: "+12.1%", color: "text-success", bg: "bg-success/10" },
    { icon: Users, label: "Users", value: "3,421", change: "+8.2%", color: "text-warning", bg: "bg-warning/10" },
    { icon: Download, label: "Downloads", value: "14,892", change: "+22.6%", color: "text-destructive", bg: "bg-destructive/10" },
  ];
  return (
    <>
      <DashHeader title="Analytics" subtitle="Performance overview for this year." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div className={`grid h-10 w-10 place-items-center rounded-xl ${s.bg} ${s.color}`}><s.icon className="h-5 w-5" /></div>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-success"><TrendingUp className="h-3 w-3" />{s.change}</span>
            </div>
            <p className="mt-4 font-display text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <h3 className="mb-4 font-display font-semibold">Revenue trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="month" stroke="currentColor" fontSize={12} />
              <YAxis stroke="currentColor" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
              <Line type="monotone" dataKey="revenue" stroke="oklch(0.62 0.19 258)" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 font-display font-semibold">Downloads by category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={downloadsByCategory.slice(0, 5)} dataKey="downloads" nameKey="name" innerRadius={50} outerRadius={90}>
                {downloadsByCategory.slice(0, 5).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 font-display font-semibold">Orders per month</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
              <Bar dataKey="orders" fill="oklch(0.72 0.16 250)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-4 font-display font-semibold">Recent orders</h3>
          <ul className="divide-y divide-border">
            {mockOrders.slice(0, 6).map((o) => (
              <li key={o.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium">{o.projectTitle.slice(0, 36)}...</p>
                  <p className="text-xs text-muted-foreground">{o.user} · {o.id}</p>
                </div>
                <span className="font-semibold">₹{o.amount}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
