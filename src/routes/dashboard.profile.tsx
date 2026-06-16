import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashHeader } from "@/components/PageBits";
import { useAuth } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, GraduationCap, Mail, User as UserIcon, Pencil, Save, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/profile")({
  head: () => ({ meta: [{ title: "Profile — ProjectHub" }] }),
  component: Page,
});

function Page() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", mobile: "", college: "", email: "" });

  useEffect(() => {
    if (user) setForm({ name: user.name ?? "", mobile: user.mobile ?? "", college: user.college ?? "", email: user.email ?? "" });
  }, [user]);

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 3) return toast.error("Full name must be at least 3 characters");
    if (!/^\d{10}$/.test(form.mobile)) return toast.error("Mobile number must be exactly 10 digits");
    if (!form.college.trim()) return toast.error("College name is required");
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return toast.error("Enter a valid email");
    updateProfile({
      name: form.name.trim(),
      mobile: form.mobile,
      college: form.college.trim(),
      email: form.email.trim() || undefined,
    });
    setEditing(false);
    toast.success("Profile updated");
  };

  return (
    <>
      <DashHeader
        title="My Profile"
        subtitle="Manage your personal information."
        action={
          editing ? (
            <Button variant="outline" onClick={() => setEditing(false)}><X className="mr-2 h-4 w-4" />Cancel</Button>
          ) : (
            <Button className="bg-gradient-primary" onClick={() => setEditing(true)}><Pencil className="mr-2 h-4 w-4" />Edit profile</Button>
          )
        }
      />
      <form onSubmit={onSave} className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-primary font-display text-3xl font-bold text-primary-foreground shadow-glow">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <p className="mt-4 font-display font-semibold">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.email || user?.mobile}</p>
        </div>

        <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldOrText icon={UserIcon} label="Full name" editing={editing} value={form.name} display={user?.name} onChange={(v) => setForm({ ...form, name: v })} />
            <FieldOrText icon={Phone} label="Mobile number" editing={editing} value={form.mobile} display={user?.mobile || "—"} onChange={(v) => setForm({ ...form, mobile: v.replace(/\D/g, "") })} maxLength={10} inputMode="numeric" />
            <FieldOrText icon={GraduationCap} label="College name" editing={editing} value={form.college} display={user?.college || "—"} onChange={(v) => setForm({ ...form, college: v })} />
            <FieldOrText icon={Mail} label="Email address" editing={editing} value={form.email} display={user?.email || "—"} onChange={(v) => setForm({ ...form, email: v })} optional />
          </div>
          {editing && (
            <Button type="submit" className="bg-gradient-primary"><Save className="mr-2 h-4 w-4" />Save changes</Button>
          )}
        </div>
      </form>
    </>
  );
}

function FieldOrText({ icon: Icon, label, editing, value, display, onChange, maxLength, inputMode, optional }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; editing: boolean; value: string; display?: string; onChange: (v: string) => void;
  maxLength?: number; inputMode?: "text" | "numeric" | "tel" | "email"; optional?: boolean;
}) {
  return (
    <div>
      <Label className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />{label}{optional && <span className="text-[10px] normal-case text-muted-foreground">(optional)</span>}
      </Label>
      {editing ? (
        <Input value={value} onChange={(e) => onChange(e.target.value)} maxLength={maxLength} inputMode={inputMode} className="mt-1.5" />
      ) : (
        <p className="mt-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium">{display || "—"}</p>
      )}
    </div>
  );
}
