import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, IndianRupee, Users as UsersIcon, Download as DownloadIcon } from "lucide-react";
import { DashHeader } from "@/components/PageBits";
import { getProject, getProjectBuyers } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/projects/$id/buyers")({
  loader: ({ params }) => {
    const p = getProject(params.id);
    if (!p) throw notFound();
    return { p };
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.p.title} — Buyers` }] }),
  component: Page,
});

function Page() {
  const { p } = Route.useLoaderData();
  const buyers = getProjectBuyers(p.id);
  const completed = buyers.filter((b) => b.status === "completed");
  const revenue = completed.reduce((s, b) => s + b.amount, 0);

  const stats = [
    { icon: UsersIcon, label: "Total Buyers", value: completed.length.toLocaleString(), color: "text-primary", bg: "bg-primary/10" },
    { icon: IndianRupee, label: "Revenue", value: `₹${revenue.toLocaleString()}`, color: "text-success", bg: "bg-success/10" },
    { icon: DownloadIcon, label: "Downloads", value: p.downloads.toLocaleString(), color: "text-warning", bg: "bg-warning/10" },
  ];

  return (
    <>
      <div className="mb-2">
        <Link to="/admin/projects" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3 w-3" />Back to projects
        </Link>
      </div>
      <DashHeader title={p.title} subtitle="Sales & buyer analytics for this project." />

      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center">
        <img src={p.thumbnail} alt="" className="h-24 w-36 rounded-xl object-cover" />
        <div className="flex-1">
          <p className="font-display font-semibold">{p.title}</p>
          <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
          <p className="mt-2 font-display text-xl font-bold text-gradient">₹{p.price}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className={`grid h-10 w-10 place-items-center rounded-xl ${s.bg} ${s.color}`}><s.icon className="h-5 w-5" /></div>
            <p className="mt-4 font-display text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display font-semibold">Recent purchases</h3>
          <Link to="/admin/orders"><Button variant="outline" size="sm">View all orders</Button></Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 sm:px-6">Order</th>
                  <th className="px-4 py-3">Student name</th>
                  <th className="px-4 py-3">Mobile</th>
                  <th className="px-4 py-3">College</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {buyers.map((o) => (
                  <tr key={o.id}>
                    <td className="px-4 py-3 font-mono text-xs sm:px-6">{o.id}</td>
                    <td className="px-4 py-3 font-medium">{o.user}</td>
                    <td className="px-4 py-3 text-muted-foreground">{o.mobile}</td>
                    <td className="px-4 py-3 text-muted-foreground">{o.college}</td>
                    <td className="px-4 py-3 text-muted-foreground">{o.email}</td>
                    <td className="px-4 py-3 font-semibold">₹{o.amount}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(o.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <Badge className={
                        o.status === "completed" ? "bg-success/15 text-success hover:bg-success/15" :
                        o.status === "pending" ? "bg-warning/15 text-warning hover:bg-warning/15" :
                        "bg-destructive/15 text-destructive hover:bg-destructive/15"
                      }>{o.status}</Badge>
                    </td>
                  </tr>
                ))}
                {buyers.length === 0 && (
                  <tr><td colSpan={8} className="px-6 py-10 text-center text-muted-foreground">No buyers yet for this project.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
