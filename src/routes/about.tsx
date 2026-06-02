import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageBits";
import { Users, Target, Sparkles, Shield } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — ProjectHub" }, { name: "description", content: "Our mission: make academic submissions stress-free with quality, original projects." }] }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader eyebrow="About us" title="Building the largest student project library in India" subtitle="ProjectHub helps final-year students submit with confidence — with original, well-documented, professor-approved projects." />
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="prose prose-lg max-w-none text-muted-foreground">
          <p>Founded in 2023 by a group of CS and MBA graduates, ProjectHub started as a small Telegram group sharing well-built final-year projects. Today, we serve over 50,000 students across 200+ colleges with a library of 700+ original projects across CSE, AI/ML, MBA, Commerce, Arts, and more.</p>
          <p>Every project on our platform is built by experienced practitioners and reviewed by our QA team before going live. We obsess over documentation, viva preparation, and code quality — because we know how much your final submission matters.</p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Users, k: "50,000+", v: "Happy students" },
            { icon: Target, k: "700+", v: "Original projects" },
            { icon: Sparkles, k: "14", v: "Streams covered" },
            { icon: Shield, k: "4.9★", v: "Average rating" },
          ].map((s) => (
            <div key={s.v} className="rounded-2xl border border-border bg-card p-6 text-center">
              <s.icon className="mx-auto h-7 w-7 text-primary" />
              <p className="mt-3 font-display text-3xl font-bold text-gradient">{s.k}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.v}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
