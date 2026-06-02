import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — ProjectHub" }] }),
  component: Page,
});

function Page() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", pwd: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try { await register(form.name, form.email, form.pwd); nav({ to: "/verify-email" }); }
    catch (err) { toast.error((err as Error).message); }
    finally { setLoading(false); }
  };

  return (
    <section className="grid min-h-[calc(100vh-4rem)] place-items-center bg-gradient-hero px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-elegant">
        <div className="mb-6 text-center">
          <h1 className="font-display text-2xl font-bold">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Join 10,000+ students</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field icon={User} label="Full name" id="name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Ananya Sharma" />
          <Field icon={Mail} label="Email" id="email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="you@university.edu" />
          <Field icon={Lock} label="Password" id="pwd" type="password" value={form.pwd} onChange={(v) => setForm({ ...form, pwd: v })} placeholder="At least 8 characters" />
          <Button type="submit" disabled={loading} className="w-full bg-gradient-primary">
            {loading ? "Creating..." : <>Create account <ArrowRight className="ml-2 h-4 w-4" /></>}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </section>
  );
}

function Field({ icon: Icon, label, id, value, onChange, type = "text", placeholder }: { icon: React.ComponentType<{ className?: string }>; label: string; id: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative mt-1.5">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input id={id} type={type} required value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="pl-9" />
      </div>
    </div>
  );
}
