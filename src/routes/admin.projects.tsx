import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { DashHeader } from "@/components/PageBits";
import { projects, getCategory } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/projects")({
  head: () => ({ meta: [{ title: "Manage projects — Admin" }] }),
  component: () => {
    const [q, setQ] = useState("");
    const list = useMemo(() => projects.filter((p) => p.title.toLowerCase().includes(q.toLowerCase())), [q]);
    return (
      <>
        <DashHeader title="Projects" subtitle={`${list.length} of ${projects.length} shown`} action={<Link to="/admin/projects/new"><Button className="bg-gradient-primary"><Plus className="mr-2 h-4 w-4" />Add project</Button></Link>} />
        <div className="mb-4 relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search projects..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
              <tr><th className="px-6 py-3">Project</th><th className="px-6 py-3">Category</th><th className="px-6 py-3">Price</th><th className="px-6 py-3">Downloads</th><th className="px-6 py-3 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.slice(0, 30).map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.thumbnail} alt="" className="h-10 w-14 rounded object-cover" />
                      <span className="line-clamp-1 max-w-xs font-medium">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3"><Badge variant="outline">{getCategory(p.category)?.name}</Badge></td>
                  <td className="px-6 py-3">₹{p.price}</td>
                  <td className="px-6 py-3">{p.downloads}</td>
                  <td className="px-6 py-3 text-right">
                    <Link to="/admin/projects/$id/edit" params={{ id: p.id }}><Button size="sm" variant="ghost"><Edit className="h-4 w-4" /></Button></Link>
                    <Button size="sm" variant="ghost" onClick={() => toast.error("Demo only")}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  },
});
