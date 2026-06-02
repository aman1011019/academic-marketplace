import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashHeader } from "@/components/PageBits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/change-password")({
  head: () => ({ meta: [{ title: "Change password — ProjectHub" }] }),
  component: () => {
    const [f, setF] = useState({ current: "", next: "", confirm: "" });
    return (
      <>
        <DashHeader title="Change password" subtitle="Use a strong password to keep your account safe." />
        <form onSubmit={(e) => { e.preventDefault(); if (f.next !== f.confirm) return toast.error("Passwords don't match"); toast.success("Password changed"); setF({ current: "", next: "", confirm: "" }); }} className="max-w-md space-y-4 rounded-2xl border border-border bg-card p-6">
          <div><Label htmlFor="c">Current password</Label><Input id="c" type="password" required value={f.current} onChange={(e) => setF({ ...f, current: e.target.value })} className="mt-1.5" /></div>
          <div><Label htmlFor="n">New password</Label><Input id="n" type="password" required value={f.next} onChange={(e) => setF({ ...f, next: e.target.value })} className="mt-1.5" /></div>
          <div><Label htmlFor="cf">Confirm new password</Label><Input id="cf" type="password" required value={f.confirm} onChange={(e) => setF({ ...f, confirm: e.target.value })} className="mt-1.5" /></div>
          <Button type="submit" className="bg-gradient-primary">Update password</Button>
        </form>
      </>
    );
  },
});
