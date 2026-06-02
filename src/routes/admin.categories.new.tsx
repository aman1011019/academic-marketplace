import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { DashHeader } from "@/components/PageBits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/categories/new")({
  head: () => ({ meta: [{ title: "Add category — Admin" }] }),
  component: () => {
    const nav = useNavigate();
    const [f, setF] = useState({ name: "", slug: "", description: "", icon: "Folder" });
    return (
      <>
        <DashHeader title="Add new category" subtitle="Create a new project stream." />
        <form onSubmit={(e) => { e.preventDefault(); toast.success("Category created"); nav({ to: "/admin/categories" }); }} className="max-w-2xl space-y-4 rounded-2xl border border-border bg-card p-6">
          <div><Label htmlFor="n">Name</Label><Input id="n" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className="mt-1.5" /></div>
          <div><Label htmlFor="s">Slug</Label><Input id="s" required value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value })} placeholder="lowercase-with-dashes" className="mt-1.5" /></div>
          <div><Label htmlFor="i">Lucide icon name</Label><Input id="i" value={f.icon} onChange={(e) => setF({ ...f, icon: e.target.value })} className="mt-1.5" /></div>
          <div><Label htmlFor="d">Description</Label><Textarea id="d" rows={3} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className="mt-1.5" /></div>
          <div className="flex gap-2"><Button type="submit" className="bg-gradient-primary">Create</Button><Button type="button" variant="outline" onClick={() => nav({ to: "/admin/categories" })}>Cancel</Button></div>
        </form>
      </>
    );
  },
});
