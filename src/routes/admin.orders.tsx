import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Download as DownloadIcon } from "lucide-react";
import { DashHeader } from "@/components/PageBits";
import { mockOrders, projects, COLLEGES } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({ meta: [{ title: "Buyer information — Admin" }] }),
  component: Page,
});

function Page() {
  const [q, setQ] = useState("");
  const [project, setProject] = useState("all");
  const [college, setCollege] = useState("all");
  const [date, setDate] = useState("");

  const filtered = useMemo(() => mockOrders.filter((o) => {
    const blob = `${o.user} ${o.email} ${o.mobile} ${o.college} ${o.projectTitle} ${o.id}`.toLowerCase();
    if (q && !blob.includes(q.toLowerCase())) return false;
    if (project !== "all" && o.projectId !== project) return false;
    if (college !== "all" && o.college !== college) return false;
    if (date && !o.date.startsWith(date)) return false;
    return true;
  }), [q, project, college, date]);

  const exportCSV = () => {
    const headers = ["Order ID", "Student Name", "Mobile", "College", "Email", "Project", "Amount", "Status", "Date"];
    const rows = filtered.map((o) => [o.id, o.user, o.mobile, o.college, o.email, o.projectTitle, o.amount, o.status, new Date(o.date).toISOString()]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `buyers-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <DashHeader
        title="Buyers & Orders"
        subtitle={`${filtered.length} of ${mockOrders.length} orders shown`}
        action={<Button variant="outline" onClick={exportCSV}><DownloadIcon className="mr-2 h-4 w-4" />Export CSV</Button>}
      />

      <div className="mb-4 grid gap-3 lg:grid-cols-[1fr_200px_220px_180px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search name, mobile, email, college..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <Select value={project} onValueChange={setProject}>
          <SelectTrigger><SelectValue placeholder="All projects" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All projects</SelectItem>
            {projects.slice(0, 36).map((p) => <SelectItem key={p.id} value={p.id}>{p.title.slice(0, 40)}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={college} onValueChange={setCollege}>
          <SelectTrigger><SelectValue placeholder="All colleges" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All colleges</SelectItem>
            {COLLEGES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
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
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td className="px-4 py-3 font-mono text-xs sm:px-6">{o.id}</td>
                  <td className="px-4 py-3 font-medium">{o.user}</td>
                  <td className="px-4 py-3 text-muted-foreground">{o.mobile}</td>
                  <td className="px-4 py-3 text-muted-foreground">{o.college}</td>
                  <td className="px-4 py-3 text-muted-foreground">{o.email}</td>
                  <td className="px-4 py-3 max-w-xs"><span className="line-clamp-1">{o.projectTitle}</span></td>
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
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="px-6 py-10 text-center text-muted-foreground">No orders match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
