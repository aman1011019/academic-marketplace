import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/verify-email")({
  head: () => ({ meta: [{ title: "Verify email — ProjectHub" }] }),
  component: Page,
});

function Page() {
  return (
    <section className="grid min-h-[calc(100vh-4rem)] place-items-center bg-gradient-hero px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-elegant">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground">
          <Mail className="h-7 w-7" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold">Check your inbox</h1>
        <p className="mt-2 text-sm text-muted-foreground">We've sent you a verification link. Click it to activate your account.</p>
        <div className="mt-6 flex flex-col gap-2">
          <Link to="/dashboard"><Button className="w-full bg-gradient-primary">I've verified — continue</Button></Link>
          <Button variant="ghost">Resend email</Button>
        </div>
      </div>
    </section>
  );
}
