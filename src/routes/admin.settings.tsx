import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashHeader } from "@/components/PageBits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Site settings — Admin" }] }),
  component: () => {
    const [f, setF] = useState({ siteName: "ProjectHub", supportEmail: "hello@projecthub.example", footerNote: "Built for students, by students.", maintenance: false, allowSignups: true });
    return (
      <>
        <DashHeader title="Site settings" subtitle="Configure your storefront." />
        <form onSubmit={(e) => { e.preventDefault(); toast.success("Settings saved"); }} className="max-w-2xl space-y-5 rounded-2xl border border-border bg-card p-6">
          <div><Label htmlFor="s">Site name</Label><Input id="s" value={f.siteName} onChange={(e) => setF({ ...f, siteName: e.target.value })} className="mt-1.5" /></div>
          <div><Label htmlFor="se">Support email</Label><Input id="se" type="email" value={f.supportEmail} onChange={(e) => setF({ ...f, supportEmail: e.target.value })} className="mt-1.5" /></div>
          <div><Label htmlFor="fn">Footer note</Label><Textarea id="fn" value={f.footerNote} onChange={(e) => setF({ ...f, footerNote: e.target.value })} className="mt-1.5" /></div>
          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div><p className="font-medium">Maintenance mode</p><p className="text-xs text-muted-foreground">Show a maintenance page to visitors.</p></div>
            <Switch checked={f.maintenance} onCheckedChange={(v) => setF({ ...f, maintenance: v })} />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div><p className="font-medium">Allow new signups</p><p className="text-xs text-muted-foreground">Disable to pause new registrations.</p></div>
            <Switch checked={f.allowSignups} onCheckedChange={(v) => setF({ ...f, allowSignups: v })} />
          </div>
          <Button type="submit" className="bg-gradient-primary">Save settings</Button>
        </form>
      </>
    );
  },
});
