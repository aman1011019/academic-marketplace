import { createFileRoute } from "@tanstack/react-router";
import { DashHeader, EmptyState } from "@/components/PageBits";
import { useStore } from "@/lib/store";
import { projects } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/dashboard/transactions")({
  head: () => ({ meta: [{ title: "Transactions — ProjectHub" }] }),
  component: () => {
    const { purchases } = useStore();
    const txs = purchases.map((id, i) => {
      const p = projects.find((x) => x.id === id);
      return p && { id: `TXN${Date.now().toString().slice(-6)}${i}`, project: p.title, amount: p.price, date: new Date(Date.now() - i * 86400000).toLocaleDateString(), status: "Completed" };
    }).filter(Boolean);

    return (
      <>
        <DashHeader title="Transaction history" subtitle="All your past payments in one place." />
        {txs.length === 0 ? (
          <EmptyState title="No transactions" body="Your payment history will appear here once you make a purchase." />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                <tr><th className="px-6 py-3">Txn ID</th><th className="px-6 py-3">Project</th><th className="px-6 py-3">Amount</th><th className="px-6 py-3">Date</th><th className="px-6 py-3">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {txs.map((t) => t && (
                  <tr key={t.id}>
                    <td className="px-6 py-4 font-mono text-xs">{t.id}</td>
                    <td className="px-6 py-4 font-medium">{t.project}</td>
                    <td className="px-6 py-4">₹{t.amount}</td>
                    <td className="px-6 py-4 text-muted-foreground">{t.date}</td>
                    <td className="px-6 py-4"><Badge className="bg-success/15 text-success hover:bg-success/15">{t.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    );
  },
});
