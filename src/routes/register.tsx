import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, ArrowRight, Phone, GraduationCap, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — ProjectHub" }] }),
  component: Page,
});

type Errors = Partial<Record<"name" | "mobile" | "college" | "email" | "password" | "confirm", string>>;

function Page() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", mobile: "", college: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = <K extends keyof typeof form>(k: K, v: string) => {
    setForm({ ...form, [k]: v });
    if (errors[k]) setErrors({ ...errors, [k]: undefined });
  };

  const validate = (): boolean => {
    const e: Errors = {};
    if (form.name.trim().length < 3) e.name = "Full name must be at least 3 characters";
    if (!/^\d{10}$/.test(form.mobile)) e.mobile = "Mobile number must be exactly 10 digits";
    if (form.college.trim().length < 2) e.college = "College name is required";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address";
    if (form.password.length < 8) e.password = "Password must be at least 8 characters";
    if (form.confirm !== form.password) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register({
        name: form.name.trim(),
        mobile: form.mobile,
        college: form.college.trim(),
        email: form.email.trim() || undefined,
        password: form.password,
      });
      nav({ to: "/dashboard" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid min-h-[calc(100vh-4rem)] place-items-center bg-gradient-hero px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-elegant">
        <div className="mb-6 text-center">
          <h1 className="font-display text-2xl font-bold">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Join 10,000+ students</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <Field icon={User} label="Full name" id="name" value={form.name} onChange={(v) => set("name", v)} placeholder="Ananya Sharma" error={errors.name} required />
          <Field
            icon={Phone}
            label="Mobile number"
            id="mobile"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={form.mobile}
            onChange={(v) => set("mobile", v.replace(/\D/g, ""))}
            placeholder="10-digit mobile number"
            error={errors.mobile}
            required
          />
          <Field icon={GraduationCap} label="College name" id="college" value={form.college} onChange={(v) => set("college", v)} placeholder="ABC Engineering College" error={errors.college} required />
          <Field icon={Mail} label="Email address" id="email" type="email" value={form.email} onChange={(v) => set("email", v)} placeholder="you@university.edu (optional)" error={errors.email} optional />

          <PasswordField
            label="Password"
            id="password"
            value={form.password}
            onChange={(v) => set("password", v)}
            placeholder="At least 8 characters"
            error={errors.password}
            show={show}
            toggle={() => setShow((s) => !s)}
          />
          <PasswordField
            label="Confirm password"
            id="confirm"
            value={form.confirm}
            onChange={(v) => set("confirm", v)}
            placeholder="Re-enter your password"
            error={errors.confirm}
            show={showConfirm}
            toggle={() => setShowConfirm((s) => !s)}
          />

          <Button type="submit" disabled={loading} className="w-full bg-gradient-primary">
            {loading ? "Creating account..." : <>Create account <ArrowRight className="ml-2 h-4 w-4" /></>}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </section>
  );
}

function Field({
  icon: Icon, label, id, value, onChange, type = "text", placeholder, error, required, optional, inputMode, maxLength,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; id: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; error?: string; required?: boolean; optional?: boolean;
  inputMode?: "text" | "numeric" | "tel" | "email"; maxLength?: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}{required && <span className="ml-0.5 text-destructive">*</span>}</Label>
        {optional && <span className="text-xs text-muted-foreground">Optional</span>}
      </div>
      <div className="relative mt-1.5">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          inputMode={inputMode}
          maxLength={maxLength}
          aria-invalid={!!error}
          className={`pl-9 ${error ? "border-destructive focus-visible:ring-destructive/40" : ""}`}
        />
      </div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function PasswordField({ label, id, value, onChange, placeholder, error, show, toggle }: {
  label: string; id: string; value: string; onChange: (v: string) => void;
  placeholder?: string; error?: string; show: boolean; toggle: () => void;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}<span className="ml-0.5 text-destructive">*</span></Label>
      <div className="relative mt-1.5">
        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-invalid={!!error}
          className={`pl-9 pr-10 ${error ? "border-destructive focus-visible:ring-destructive/40" : ""}`}
        />
        <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={show ? "Hide password" : "Show password"}>
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
