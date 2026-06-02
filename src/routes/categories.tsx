import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import { PageHeader } from "@/components/PageBits";
import { SearchBar } from "@/components/Navbar";
import { categories } from "@/lib/mock-data";
import { motion } from "framer-motion";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "All Categories — ProjectHub" },
      { name: "description", content: "Browse all 14 academic project categories: CSE, AI/ML, MBA, Commerce, Arts and more." },
    ],
  }),
  component: Page,
});

function Page() {
  const [q, setQ] = useState("");
  const list = useMemo(() => categories.filter((c) => c.name.toLowerCase().includes(q.toLowerCase())), [q]);
  return (
    <>
      <PageHeader eyebrow="Browse" title="All categories" subtitle="14 streams, 700+ projects. Pick yours.">
        <div className="max-w-md"><SearchBar value={q} onChange={setQ} placeholder="Search categories..." /></div>
      </PageHeader>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c, i) => {
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[c.icon] ?? Icons.Folder;
            return (
              <motion.div key={c.slug} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}>
                <Link to="/categories/$slug" params={{ slug: c.slug }} className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary hover:shadow-elegant">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary/10 text-primary transition group-hover:bg-gradient-primary group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="mt-5 font-display text-lg font-semibold">{c.name}</h2>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{c.description}</p>
                  <p className="mt-4 text-xs font-medium text-primary">{c.count} projects →</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </>
  );
}
