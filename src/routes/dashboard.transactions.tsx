import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Download as DownloadIcon } from "lucide-react";
import { DashHeader, EmptyState } from "@/components/PageBits";
import { useStore, useAuth } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/dashboard/transactions")({
  head: () => ({ meta: [{ title: "Transactions — ProjectHub" }] }),
  component: Page,
});

function Page() {
  const { transactions } = useStore();
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => transactions.filter((t) => {
    const blob = `${t.id} ${t.projectTitle} ${t.buyerName} ${t.mobile} ${t.college}`.toLowerCase();
    const matchQ = !q || blob.includes(q.toLowerCase());
    const matchS = status === "all" || t.status.toLowerCase() === status;
    return matchQ && matchS;
  }), [transactions, q, status]);

  const exportCSV = () => {
    const headers = ["Transaction ID", "Student Name", "Mobile", "College", "Email", "Project", "Amount", "Status", "Date"];
    const rows = filtered.map((t) => [
      t.id, t.buyerName, t.mobile, t.college, t.email ?? "", t.projectTitle, t.amount, t.status, new Date(t.date).toISOString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `transactions-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <DashHeader
        title="Transaction history"
        subtitle="All your past payments in one place."
        action={
          <Button variant="outline" onClick={exportCSV} disabled={filtered.length === 0}>
            <DownloadIcon className="mr-2 h-4 w-4" />Export CSV
          </Button>
        }
      />

      {transactions.length === 0 ? (
        <EmptyState title="No transactions" body="Your payment history will appear here once you make a purchase." />
      ) : (
        <>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by ID, project, name, mobile, college..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="sm:w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 sm:px-6">Txn ID</th>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Mobile</th>
                    <th className="px-4 py-3">College</th>
                    <th className="px-4 py-3">Project</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((t) => (
                    <tr key={t.id}>
                      <td className="px-4 py-3 font-mono text-xs sm:px-6">{t.id}</td>
                      <td className="px-4 py-3 font-medium">{t.buyerName || user?.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{t.mobile || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{t.college || "—"}</td>
                      <td className="px-4 py-3"><span className="line-clamp-1 max-w-xs">{t.projectTitle}</span></td>
                      <td className="px-4 py-3 font-semibold">₹{t.amount}</td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(t.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <Badge className={
                          t.status === "Completed" ? "bg-success/15 text-success hover:bg-success/15" :
                          t.status === "Pending" ? "bg-warning/15 text-warning hover:bg-warning/15" :
                          "bg-destructive/15 text-destructive hover:bg-destructive/15"
                        }>{t.status}</Badge>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={8} className="px-6 py-10 text-center text-muted-foreground">No transactions match your filters.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
}
