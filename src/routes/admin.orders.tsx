import { createFileRoute } from "@tanstack/react-router";
import { DashHeader } from "@/components/PageBits";
import { mockOrders } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({ meta: [{ title: "Manage orders — Admin" }] }),
  component: () => (
    <>
      <DashHeader title="Orders" subtitle={`${mockOrders.length} total orders`} />
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr><th className="px-6 py-3">Order ID</th><th className="px-6 py-3">Customer</th><th className="px-6 py-3">Project</th><th className="px-6 py-3">Amount</th><th className="px-6 py-3">Date</th><th className="px-6 py-3">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockOrders.map((o) => (
              <tr key={o.id}>
                <td className="px-6 py-3 font-mono text-xs">{o.id}</td>
                <td className="px-6 py-3"><p className="font-medium">{o.user}</p><p className="text-xs text-muted-foreground">{o.email}</p></td>
                <td className="px-6 py-3 max-w-xs"><span className="line-clamp-1">{o.projectTitle}</span></td>
                <td className="px-6 py-3 font-semibold">₹{o.amount}</td>
                <td className="px-6 py-3 text-muted-foreground">{new Date(o.date).toLocaleDateString()}</td>
                <td className="px-6 py-3">
                  <Badge className={
                    o.status === "completed" ? "bg-success/15 text-success hover:bg-success/15" :
                    o.status === "pending" ? "bg-warning/15 text-warning hover:bg-warning/15" :
                    "bg-destructive/15 text-destructive hover:bg-destructive/15"
                  }>{o.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ),
});
