import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { AtSign, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — ProjectHub" }] }),
  component: Page,
});

function Page() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !pwd) {
      toast.error("Please enter your mobile/email and password");
      return;
    }
    setLoading(true);
    try { await login(identifier.trim(), pwd); nav({ to: "/dashboard" }); }
    catch (err) { toast.error((err as Error).message); }
    finally { setLoading(false); }
  };

  return (
    <section className="grid min-h-[calc(100vh-4rem)] place-items-center bg-gradient-hero px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-elegant">
        <div className="mb-6 text-center">
          <h1 className="font-display text-2xl font-bold">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to access your dashboard</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="id">Mobile Number or Email</Label>
            <div className="relative mt-1.5">
              <AtSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="id" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="10-digit mobile or you@email.com" className="pl-9" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="pwd">Password</Label>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot?</Link>
            </div>
            <div className="relative mt-1.5">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="pwd" type={show ? "text" : "password"} required value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="••••••••" className="pl-9 pr-10" />
              <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={show ? "Hide" : "Show"}>
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-primary">
            {loading ? "Signing in..." : <>Sign in <ArrowRight className="ml-2 h-4 w-4" /></>}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account? <Link to="/register" className="font-medium text-primary hover:underline">Create one</Link>
        </p>
        <p className="mt-4 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
          <b>Demo:</b> sign in with any 10-digit mobile or email. Use an email starting with <code>admin</code> for admin access.
        </p>
      </motion.div>
    </section>
  );
}
