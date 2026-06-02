import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Heart, Download, Check, ShoppingBag, ChevronRight } from "lucide-react";
import { getProject, getReviews, getCategory, projects } from "@/lib/mock-data";
import { useAuth, useStore, openCheckout } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectCard } from "@/components/ProjectCard";
import { toast } from "sonner";

export const Route = createFileRoute("/projects/$id")({
  loader: ({ params }) => {
    const p = getProject(params.id);
    if (!p) throw notFound();
    return { project: p };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.project.title} — ProjectHub` },
      { name: "description", content: loaderData?.project.description ?? "" },
      { property: "og:title", content: loaderData?.project.title ?? "" },
      { property: "og:image", content: loaderData?.project.thumbnail ?? "" },
    ],
  }),
  notFoundComponent: () => (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="text-center"><h1 className="font-display text-2xl">Project not found</h1><Link to="/categories" className="mt-4 inline-block text-primary">← Browse all</Link></div>
    </div>
  ),
  component: Page,
});

function Page() {
  const { project } = Route.useLoaderData();
  const cat = getCategory(project.category);
  const reviews = getReviews(project.id);
  const { toggleWish, isWished, purchase, isPurchased } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const related = projects.filter((p) => p.category === project.category && p.id !== project.id).slice(0, 4);

  const handleBuy = () => {
    if (!user) {
      toast.error("Please sign in to purchase");
      navigate({ to: "/login" });
      return;
    }
    openCheckout({
      amount: project.price,
      name: project.title,
      onSuccess: () => {
        purchase(project.id);
        navigate({ to: "/checkout/success", search: { id: project.id } });
      },
    });
  };

  return (
    <>
      <div className="border-b border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-muted-foreground sm:px-6">
          <Link to="/categories" className="hover:text-foreground">Categories</Link>
          <ChevronRight className="mx-1 inline h-3 w-3" />
          <Link to="/categories/$slug" params={{ slug: project.category }} className="hover:text-foreground">{cat?.name}</Link>
          <ChevronRight className="mx-1 inline h-3 w-3" />
          <span className="text-foreground">{project.title}</span>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          {/* Gallery */}
          <div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden rounded-2xl border border-border bg-card">
              <img src={[project.thumbnail, ...project.images][active]} alt={project.title} className="aspect-[16/10] w-full object-cover" />
            </motion.div>
            <div className="mt-4 grid grid-cols-5 gap-3">
              {[project.thumbnail, ...project.images].map((src, i) => (
                <button key={i} onClick={() => setActive(i)} className={`overflow-hidden rounded-lg border-2 transition ${active === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"}`}>
                  <img src={src} alt="" className="aspect-[4/3] w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Buy panel */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <Badge variant="secondary" className="mb-3">{cat?.name}</Badge>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{project.title}</h1>
            <div className="mt-3 flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-warning text-warning" /><b>{project.rating.toFixed(1)}</b></span>
              <span className="text-muted-foreground">({project.reviewsCount} reviews)</span>
              <span className="text-muted-foreground">·</span>
              <span className="flex items-center gap-1 text-muted-foreground"><Download className="h-4 w-4" />{project.downloads} downloads</span>
            </div>

            <p className="mt-5 text-muted-foreground">{project.description}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {project.technologies.map((t) => <Badge key={t} variant="outline">{t}</Badge>)}
            </div>

            <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-4xl font-bold text-gradient">₹{project.price}</span>
                {project.oldPrice && <span className="text-muted-foreground line-through">₹{project.oldPrice}</span>}
                {project.oldPrice && <Badge className="bg-success text-success-foreground">Save ₹{project.oldPrice - project.price}</Badge>}
              </div>
              <div className="mt-5 flex gap-2">
                {isPurchased(project.id) ? (
                  <Link to="/dashboard/downloads" className="flex-1"><Button size="lg" className="w-full"><Download className="mr-2 h-4 w-4" />Download now</Button></Link>
                ) : (
                  <Button size="lg" onClick={handleBuy} className="flex-1 bg-gradient-primary shadow-elegant">
                    <ShoppingBag className="mr-2 h-4 w-4" />Buy now
                  </Button>
                )}
                <Button size="lg" variant="outline" onClick={() => toggleWish(project.id)}>
                  <Heart className={`h-4 w-4 ${isWished(project.id) ? "fill-destructive text-destructive" : ""}`} />
                </Button>
              </div>
              <ul className="mt-6 space-y-2 text-sm">
                {project.includedFiles.map((f) => (
                  <li key={f} className="flex items-center gap-2"><Check className="h-4 w-4 text-success" />{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-6">
              <div className="prose prose-sm max-w-3xl text-muted-foreground"><p>{project.longDescription}</p></div>
            </TabsContent>
            <TabsContent value="features" className="mt-6">
              <ul className="max-w-2xl space-y-3">
                {project.features.map((f) => (
                  <li key={f} className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-success" /><span>{f}</span></li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6 space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{r.user}</p>
                    <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-warning text-warning" : "text-muted"}`} />)}</div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="mb-8 font-display text-2xl font-bold">Related projects</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p, i) => <ProjectCard key={p.id} project={p} i={i} />)}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
