import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Download } from "lucide-react";
import { DashHeader, EmptyState } from "@/components/PageBits";
import { useStore } from "@/lib/store";
import { projects, getCategory, categories } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/dashboard/purchases")({
  head: () => ({ meta: [{ title: "My purchases — ProjectHub" }] }),
  component: Page,
});

function Page() {
  const { transactions, purchases } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");

  // Build rows from transactions; fallback to legacy purchases array
  const rows = useMemo(() => {
    const fromTxn = transactions.map((t) => {
      const p = projects.find((x) => x.id === t.projectId);
      return p && { project: p, txnId: t.id, amount: t.amount, date: t.date, status: t.status };
    }).filter(Boolean) as { project: typeof projects[number]; txnId: string; amount: number; date: string; status: string }[];

    const txnIds = new Set(fromTxn.map((r) => r.project.id));
    const legacy = purchases.filter((id) => !txnIds.has(id)).map((id) => {
      const p = projects.find((x) => x.id === id);
      return p && { project: p, txnId: "—", amount: p.price, date: new Date().toISOString(), status: "Completed" };
    }).filter(Boolean) as typeof fromTxn;

    return [...fromTxn, ...legacy];
  }, [transactions, purchases]);

  const filtered = rows.filter((r) => {
    const matchQ = !q || r.project.title.toLowerCase().includes(q.toLowerCase());
    const matchCat = cat === "all" || r.project.category === cat;
    return matchQ && matchCat;
  });

  return (
    <>
      <DashHeader title="My purchases" subtitle={`${rows.length} project${rows.length !== 1 ? "s" : ""} purchased`} />

      {rows.length === 0 ? (
        <EmptyState title="No purchases yet" body="When you buy a project, it'll show up here." action={<Link to="/categories"><Button className="bg-gradient-primary">Browse projects</Button></Link>} />
      ) : (
        <>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search purchases..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
            </div>
            <Select value={cat} onValueChange={setCat}>
              <SelectTrigger className="sm:w-56"><SelectValue placeholder="All categories" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 sm:px-6">Project</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Purchase date</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right sm:px-6">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((r) => (
                    <tr key={r.project.id + r.txnId}>
                      <td className="px-4 py-3 sm:px-6">
                        <div className="flex items-center gap-3">
                          <img src={r.project.thumbnail} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" />
                          <Link to="/projects/$id" params={{ id: r.project.id }} className="line-clamp-2 max-w-xs font-medium hover:text-primary">{r.project.title}</Link>
                        </div>
                      </td>
                      <td className="px-4 py-3"><Badge variant="outline">{getCategory(r.project.category)?.name}</Badge></td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(r.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 font-semibold">₹{r.amount}</td>
                      <td className="px-4 py-3"><Badge className="bg-success/15 text-success hover:bg-success/15">{r.status}</Badge></td>
                      <td className="px-4 py-3 text-right sm:px-6">
                        <Link to="/dashboard/downloads"><Button size="sm" variant="outline"><Download className="mr-1.5 h-3.5 w-3.5" />Download</Button></Link>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">No purchases match your filters.</td></tr>
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
