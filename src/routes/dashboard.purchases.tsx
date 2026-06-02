import { createFileRoute, Link } from "@tanstack/react-router";
import { DashHeader, EmptyState } from "@/components/PageBits";
import { ProjectCard } from "@/components/ProjectCard";
import { useStore } from "@/lib/store";
import { projects } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/purchases")({
  head: () => ({ meta: [{ title: "My purchases — ProjectHub" }] }),
  component: () => {
    const { purchases } = useStore();
    const list = purchases.map((id) => projects.find((p) => p.id === id)).filter(Boolean);
    return (
      <>
        <DashHeader title="My purchases" subtitle={`${list.length} project${list.length !== 1 ? "s" : ""} purchased`} />
        {list.length === 0 ? (
          <EmptyState title="No purchases yet" body="When you buy a project, it'll show up here." action={<Link to="/categories"><Button className="bg-gradient-primary">Browse projects</Button></Link>} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((p, i) => p && <ProjectCard key={p.id} project={p} i={i} />)}
          </div>
        )}
      </>
    );
  },
});
