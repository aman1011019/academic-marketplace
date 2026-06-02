import { createFileRoute, notFound } from "@tanstack/react-router";
import { getProject } from "@/lib/mock-data";
import { ProjectForm } from "./admin.projects.new";

export const Route = createFileRoute("/admin/projects/$id/edit")({
  loader: ({ params }) => {
    const p = getProject(params.id);
    if (!p) throw notFound();
    return { p };
  },
  head: () => ({ meta: [{ title: "Edit project — Admin" }] }),
  component: () => {
    const { p } = Route.useLoaderData();
    return <ProjectForm initial={{ name: p.title, category: p.category, description: p.longDescription, tech: p.technologies.join(", "), price: String(p.price) }} />;
  },
});
