import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, Star, Download } from "lucide-react";
import type { Project } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function ProjectCard({ project, i = 0 }: { project: Project; i?: number }) {
  const { toggleWish, isWished } = useStore();
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: i * 0.04 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-elegant"
    >
      <Link to="/projects/$id" params={{ id: project.id }} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={project.thumbnail}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition group-hover:opacity-100" />
        </div>
      </Link>
      <button
        onClick={(e) => { e.preventDefault(); toggleWish(project.id); }}
        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/90 backdrop-blur transition hover:scale-110"
        aria-label="Wishlist"
      >
        <Heart className={`h-4 w-4 ${isWished(project.id) ? "fill-destructive text-destructive" : ""}`} />
      </button>
      <div className="p-5">
        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
          <span className="font-medium text-foreground">{project.rating.toFixed(1)}</span>
          <span>·</span>
          <span>{project.reviewsCount} reviews</span>
          <span className="ml-auto inline-flex items-center gap-1">
            <Download className="h-3.5 w-3.5" />{project.downloads}
          </span>
        </div>
        <Link to="/projects/$id" params={{ id: project.id }}>
          <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug transition group-hover:text-primary">
            {project.title}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-xl font-bold text-gradient">₹{project.price}</span>
              {project.oldPrice && (
                <span className="text-xs text-muted-foreground line-through">₹{project.oldPrice}</span>
              )}
            </div>
          </div>
          <Link to="/projects/$id" params={{ id: project.id }}>
            <Button size="sm" variant="outline">View</Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="aspect-[16/10] animate-pulse bg-muted" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="h-8 w-24 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
