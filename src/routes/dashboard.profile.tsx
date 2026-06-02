import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashHeader } from "@/components/PageBits";
import { useAuth } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/profile")({
  head: () => ({ meta: [{ title: "Profile — ProjectHub" }] }),
  component: () => {
    const { user } = useAuth();
    const [form, setForm] = useState({ name: user?.name ?? "", email: user?.email ?? "", phone: "", college: "", bio: "" });
    return (
      <>
        <DashHeader title="My Profile" subtitle="Update your personal information." />
        <form onSubmit={(e) => { e.preventDefault(); toast.success("Profile updated"); }} className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-primary font-display text-3xl font-bold text-primary-foreground shadow-glow">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <p className="mt-4 font-display font-semibold">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
            <Button type="button" variant="outline" className="mt-4 w-full">Change photo</Button>
          </div>
          <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label htmlFor="n">Full name</Label><Input id="n" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" /></div>
              <div><Label htmlFor="e">Email</Label><Input id="e" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5" /></div>
              <div><Label htmlFor="p">Phone</Label><Input id="p" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 ..." className="mt-1.5" /></div>
              <div><Label htmlFor="c">College</Label><Input id="c" value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} className="mt-1.5" /></div>
            </div>
            <div><Label htmlFor="b">Bio</Label><Textarea id="b" rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell us about yourself..." className="mt-1.5" /></div>
            <Button type="submit" className="bg-gradient-primary">Save changes</Button>
          </div>
        </form>
      </>
    );
  },
});
