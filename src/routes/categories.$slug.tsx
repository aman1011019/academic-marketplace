import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/PageBits";
import { SearchBar } from "@/components/Navbar";
import { ProjectCard } from "@/components/ProjectCard";
import { getCategory, getProjectsByCategory } from "@/lib/mock-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export const Route = createFileRoute("/categories/$slug")({
  loader: ({ params }) => {
    const cat = getCategory(params.slug);
    if (!cat) throw notFound();
    return { cat };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.cat.name} Projects — ProjectHub` },
      { name: "description", content: loaderData?.cat.description ?? "" },
    ],
  }),
  notFoundComponent: () => (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="text-center">
        <h1 className="font-display text-2xl">Category not found</h1>
        <Link to="/categories" className="mt-4 inline-block text-primary">← Back to categories</Link>
      </div>
    </div>
  ),
  component: Page,
});

function Page() {
  const { cat } = Route.useLoaderData();
  const all = useMemo(() => getProjectsByCategory(cat.slug), [cat.slug]);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"popular" | "newest" | "price-asc" | "price-desc">("popular");
  const [price, setPrice] = useState<[number]>([1500]);

  const filtered = useMemo(() => {
    let r = all.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()) && p.price <= price[0]);
    if (sort === "newest") r = [...r].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    if (sort === "popular") r = [...r].sort((a, b) => b.popularity - a.popularity);
    if (sort === "price-asc") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") r = [...r].sort((a, b) => b.price - a.price);
    return r;
  }, [all, q, sort, price]);

  return (
    <>
      <PageHeader eyebrow={<>
        <Link to="/categories" className="hover:text-foreground">Categories</Link>
        <ChevronRight className="mx-1 inline h-3 w-3" />
        {cat.name}
      </> as unknown as string} title={cat.name} subtitle={cat.description} />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-6 rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-20 lg:self-start">
            <div className="flex items-center gap-2 font-display font-semibold">
              <SlidersHorizontal className="h-4 w-4 text-primary" />Filters
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Search</p>
              <SearchBar value={q} onChange={setQ} placeholder="Search in category..." />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium">Max price</span>
                <span className="text-primary">₹{price[0]}</span>
              </div>
              <Slider value={price} onValueChange={(v) => setPrice([v[0]])} min={299} max={1500} step={100} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Sort by</p>
              <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most popular</SelectItem>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="price-asc">Price: Low → High</SelectItem>
                  <SelectItem value="price-desc">Price: High → Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">Showing <span className="font-semibold text-foreground">{filtered.length}</span> of {all.length}</p>
          </aside>

          <div>
            {filtered.length === 0 ? (
              <div className="grid h-96 place-items-center rounded-2xl border border-dashed border-border">
                <p className="text-muted-foreground">No projects match your filters.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((p, i) => <ProjectCard key={p.id} project={p} i={i} />)}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
