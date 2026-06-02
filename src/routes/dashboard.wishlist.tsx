import { createFileRoute, Link } from "@tanstack/react-router";
import { DashHeader, EmptyState } from "@/components/PageBits";
import { ProjectCard } from "@/components/ProjectCard";
import { useStore } from "@/lib/store";
import { projects } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — ProjectHub" }] }),
  component: () => {
    const { wishlist } = useStore();
    const list = wishlist.map((id) => projects.find((p) => p.id === id)).filter(Boolean);
    return (
      <>
        <DashHeader title="Wishlist" subtitle={`${list.length} saved project${list.length !== 1 ? "s" : ""}`} />
        {list.length === 0 ? (
          <EmptyState title="Your wishlist is empty" body="Tap the heart on any project to save it for later." action={<Link to="/categories"><Button className="bg-gradient-primary">Explore</Button></Link>} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((p, i) => p && <ProjectCard key={p.id} project={p} i={i} />)}
          </div>
        )}
      </>
    );
  },
});
