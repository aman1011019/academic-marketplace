import { createFileRoute, useNavigate, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { DashHeader } from "@/components/PageBits";
import { getCategory } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/categories/$id/edit")({
  loader: ({ params }) => {
    const c = getCategory(params.id);
    if (!c) throw notFound();
    return { c };
  },
  head: () => ({ meta: [{ title: "Edit category — Admin" }] }),
  component: () => {
    const { c } = Route.useLoaderData();
    const nav = useNavigate();
    const [f, setF] = useState({ name: c.name, slug: c.slug, description: c.description, icon: c.icon });
    return (
      <>
        <DashHeader title="Edit category" subtitle={c.name} />
        <form onSubmit={(e) => { e.preventDefault(); toast.success("Category updated"); nav({ to: "/admin/categories" }); }} className="max-w-2xl space-y-4 rounded-2xl border border-border bg-card p-6">
          <div><Label htmlFor="n">Name</Label><Input id="n" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className="mt-1.5" /></div>
          <div><Label htmlFor="s">Slug</Label><Input id="s" required value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value })} className="mt-1.5" /></div>
          <div><Label htmlFor="i">Icon</Label><Input id="i" value={f.icon} onChange={(e) => setF({ ...f, icon: e.target.value })} className="mt-1.5" /></div>
          <div><Label htmlFor="d">Description</Label><Textarea id="d" rows={3} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className="mt-1.5" /></div>
          <div className="flex gap-2"><Button type="submit" className="bg-gradient-primary">Save</Button><Button type="button" variant="outline" onClick={() => nav({ to: "/admin/categories" })}>Cancel</Button></div>
        </form>
      </>
    );
  },
});
