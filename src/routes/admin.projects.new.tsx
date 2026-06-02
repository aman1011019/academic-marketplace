import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Upload } from "lucide-react";
import { DashHeader } from "@/components/PageBits";
import { categories } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/projects/new")({
  head: () => ({ meta: [{ title: "Add project — Admin" }] }),
  component: ProjectForm,
});

export function ProjectForm({ initial }: { initial?: Partial<{ name: string; category: string; description: string; tech: string; price: string }> } = {}) {
  const nav = useNavigate();
  const [f, setF] = useState({
    name: initial?.name ?? "",
    category: initial?.category ?? categories[0].slug,
    description: initial?.description ?? "",
    tech: initial?.tech ?? "",
    price: initial?.price ?? "499",
  });
  return (
    <>
      <DashHeader title={initial ? "Edit project" : "Add new project"} subtitle="Fill in the project details and upload assets." />
      <form onSubmit={(e) => { e.preventDefault(); toast.success("Project saved"); nav({ to: "/admin/projects" }); }} className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5 rounded-2xl border border-border bg-card p-6">
          <div><Label htmlFor="n">Project name</Label><Input id="n" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className="mt-1.5" /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="c">Category</Label>
              <Select value={f.category} onValueChange={(v) => setF({ ...f, category: v })}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>{categories.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label htmlFor="p">Price (₹)</Label><Input id="p" type="number" required value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} className="mt-1.5" /></div>
          </div>
          <div><Label htmlFor="t">Technologies (comma separated)</Label><Input id="t" value={f.tech} onChange={(e) => setF({ ...f, tech: e.target.value })} placeholder="React, Node.js, MongoDB" className="mt-1.5" /></div>
          <div><Label htmlFor="d">Description / Abstract</Label><Textarea id="d" rows={5} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className="mt-1.5" /></div>
        </div>

        <div className="space-y-4">
          {["Thumbnail", "Preview Images", "ZIP Source Code", "PDF Report", "PPT", "Documentation", "Viva Questions", "Abstract"].map((label) => (
            <div key={label} className="rounded-xl border border-dashed border-border bg-card p-4">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</Label>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Upload className="h-4 w-4" />
                <span>Click to upload</span>
              </div>
            </div>
          ))}
          <div className="flex gap-2"><Button type="submit" className="flex-1 bg-gradient-primary">Save</Button><Button type="button" variant="outline" onClick={() => nav({ to: "/admin/projects" })}>Cancel</Button></div>
        </div>
      </form>
    </>
  );
}
