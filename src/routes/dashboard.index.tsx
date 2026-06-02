import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ShoppingBag, Download, Heart, Receipt, TrendingUp } from "lucide-react";
import { DashHeader } from "@/components/PageBits";
import { useAuth, useStore } from "@/lib/store";
import { projects } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({ meta: [{ title: "Dashboard — ProjectHub" }] }),
  component: Page,
});

function Page() {
  const { user } = useAuth();
  const { purchases, wishlist } = useStore();
  const stats = [
    { icon: ShoppingBag, label: "Purchases", value: purchases.length, color: "text-primary", bg: "bg-primary/10" },
    { icon: Download, label: "Downloads", value: purchases.length * 4, color: "text-success", bg: "bg-success/10" },
    { icon: Heart, label: "Wishlist", value: wishlist.length, color: "text-destructive", bg: "bg-destructive/10" },
    { icon: Receipt, label: "Total spent", value: "₹" + purchases.reduce((s, id) => s + (projects.find((p) => p.id === id)?.price ?? 0), 0), color: "text-warning", bg: "bg-warning/10" },
  ];
  const recent = purchases.map((id) => projects.find((p) => p.id === id)).filter(Boolean).slice(0, 4);
  return (
    <>
      <DashHeader title={`Hi, ${user?.name?.split(" ")[0]} 👋`} subtitle="Here's a snapshot of your activity." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className={`grid h-10 w-10 place-items-center rounded-xl ${s.bg} ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-2xl font-bold font-display">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Recent purchases</h2>
          <Link to="/dashboard/purchases"><Button variant="ghost" size="sm">View all</Button></Link>
        </div>
        {recent.length === 0 ? (
          <div className="grid place-items-center py-10 text-center">
            <TrendingUp className="h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-muted-foreground">No purchases yet. <Link to="/categories" className="text-primary hover:underline">Browse projects →</Link></p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {recent.map((p) => p && (
              <li key={p.id} className="flex items-center gap-4 py-4">
                <img src={p.thumbnail} alt="" className="h-14 w-20 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <Link to="/projects/$id" params={{ id: p.id }} className="line-clamp-1 font-medium hover:text-primary">{p.title}</Link>
                  <p className="text-xs text-muted-foreground">₹{p.price}</p>
                </div>
                <Link to="/dashboard/downloads"><Button size="sm" variant="outline"><Download className="mr-1.5 h-4 w-4" />Download</Button></Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
