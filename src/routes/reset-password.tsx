import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset password — ProjectHub" }] }),
  component: Page,
});

function Page() {
  const nav = useNavigate();
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  return (
    <section className="grid min-h-[calc(100vh-4rem)] place-items-center bg-gradient-hero px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-elegant">
        <h1 className="font-display text-2xl font-bold">Set a new password</h1>
        <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); if (pwd !== confirm) return toast.error("Passwords don't match"); toast.success("Password updated"); nav({ to: "/login" }); }}>
          <div>
            <Label htmlFor="pwd">New password</Label>
            <Input id="pwd" type="password" required value={pwd} onChange={(e) => setPwd(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="confirm">Confirm password</Label>
            <Input id="confirm" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-1.5" />
          </div>
          <Button type="submit" className="w-full bg-gradient-primary">Update password</Button>
        </form>
      </div>
    </section>
  );
}
