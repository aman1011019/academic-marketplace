import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import { ArrowRight, Sparkles, ShieldCheck, Zap, Award } from "lucide-react";
import { Navbar as _n, SearchBar } from "@/components/Navbar";
import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { categories, projects, testimonials, faqs } from "@/lib/mock-data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ProjectHub — Buy academic projects with source code, reports & PPT" },
      { name: "description", content: "India's largest marketplace for student projects. 700+ ready-to-submit projects across 14 categories. Instant download." },
    ],
  }),
  component: Home,
});

function Home() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    if (!q) return projects.slice(0, 8);
    return projects.filter((p) => p.title.toLowerCase().includes(q.toLowerCase())).slice(0, 8);
  }, [q]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary-glow blur-3xl" />
          <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-primary blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              700+ projects · 14 categories · Instant downloads
            </span>
            <h1 className="mt-6 font-display text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              Academic projects, <span className="text-gradient">done right.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Source code, reports, PPTs and viva questions — everything you need to submit with confidence. Built by students, for students.
            </p>
            <div className="mx-auto mt-10 max-w-xl">
              <SearchBar value={q} onChange={setQ} placeholder="Search for AI, Cyber Security, MBA, IoT..." />
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link to="/categories">
                <Button size="lg" className="bg-gradient-primary shadow-elegant">
                  Browse all categories <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline">How it works</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-4 sm:px-6">
          {[
            { icon: ShieldCheck, label: "100% Original" },
            { icon: Zap, label: "Instant Download" },
            { icon: Award, label: "30-day Support" },
            { icon: Sparkles, label: "Updated Weekly" },
          ].map((it) => (
            <div key={it.label} className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <it.icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">{it.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Top categories */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">Categories</p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">Explore by stream</h2>
            </div>
            <Link to="/categories"><Button variant="ghost">View all <ArrowRight className="ml-1 h-4 w-4" /></Button></Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.slice(0, 8).map((c, i) => {
              const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[c.icon] ?? Icons.Folder;
              return (
                <motion.div
                  key={c.slug}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link to="/categories/$slug" params={{ slug: c.slug }} className="group block rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-primary hover:shadow-elegant">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary/10 text-primary transition group-hover:bg-gradient-primary group-hover:text-primary-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-display font-semibold">{c.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{c.count} projects</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section className="bg-card/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Featured</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">Trending this week</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((p, i) => <ProjectCard key={p.id} project={p} i={i} />)}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Loved by students</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">10,000+ submissions made easier</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-soft"
              >
                <p className="text-sm leading-relaxed">"{t.quote}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-card/30 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">FAQ</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">Questions, answered</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border">
                <AccordionTrigger className="text-left font-medium">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-3xl bg-gradient-primary p-10 text-center shadow-glow sm:p-16">
            <h2 className="font-display text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Ready to crush your submission?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
              Join thousands of students who saved weeks of effort with a ProjectHub project.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/categories"><Button size="lg" variant="secondary">Browse projects</Button></Link>
              <Link to="/register"><Button size="lg" variant="outline" className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10">Create free account</Button></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
