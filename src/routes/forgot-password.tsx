import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot password — ProjectHub" }] }),
  component: Page,
});

function Page() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <section className="grid min-h-[calc(100vh-4rem)] place-items-center bg-gradient-hero px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-elegant">
        <h1 className="font-display text-2xl font-bold">Forgot password?</h1>
        <p className="mt-2 text-sm text-muted-foreground">Enter your email and we'll send a reset link.</p>
        {sent ? (
          <div className="mt-6 rounded-lg bg-success/10 p-4 text-sm text-success">
            Reset link sent to <b>{email}</b>. Check your inbox.
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success("Email sent"); setSent(true); }}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@university.edu" className="mt-1.5" />
            </div>
            <Button type="submit" className="w-full bg-gradient-primary">Send reset link</Button>
          </form>
        )}
        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="text-primary hover:underline">← Back to sign in</Link>
        </p>
      </div>
    </section>
  );
}
