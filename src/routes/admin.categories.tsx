import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Edit, Trash2 } from "lucide-react";
import { DashHeader } from "@/components/PageBits";
import { categories } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/categories")({
  head: () => ({ meta: [{ title: "Manage categories — Admin" }] }),
  component: () => (
    <>
      <DashHeader title="Categories" subtitle={`${categories.length} categories`} action={<Link to="/admin/categories/new"><Button className="bg-gradient-primary"><Plus className="mr-2 h-4 w-4" />Add category</Button></Link>} />
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr><th className="px-6 py-3">Name</th><th className="px-6 py-3">Slug</th><th className="px-6 py-3">Projects</th><th className="px-6 py-3 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.map((c) => (
              <tr key={c.slug}>
                <td className="px-6 py-4 font-medium">{c.name}</td>
                <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{c.slug}</td>
                <td className="px-6 py-4">{c.count}</td>
                <td className="px-6 py-4 text-right">
                  <Link to="/admin/categories/$id/edit" params={{ id: c.slug }}>
                    <Button size="sm" variant="ghost"><Edit className="h-4 w-4" /></Button>
                  </Link>
                  <Button size="sm" variant="ghost" onClick={() => toast.error("Demo only")}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ),
});
