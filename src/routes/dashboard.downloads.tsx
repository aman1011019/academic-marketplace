import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, FileArchive, FileText, Presentation, FileQuestion } from "lucide-react";
import { DashHeader, EmptyState } from "@/components/PageBits";
import { useStore } from "@/lib/store";
import { projects } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const fileMeta = [
  { name: "Source Code (ZIP)", size: "12.4 MB", icon: FileArchive },
  { name: "Project Report (PDF)", size: "3.1 MB", icon: FileText },
  { name: "Presentation (PPT)", size: "5.7 MB", icon: Presentation },
  { name: "Viva Questions", size: "420 KB", icon: FileQuestion },
];

function startDownload(fileName: string, projectTitle: string) {
  const id = `dl-${Date.now()}`;
  const date = new Date().toLocaleString();
  toast.loading(`Downloading ${fileName}...`, { id, description: projectTitle });
  setTimeout(() => {
    toast.loading("Download started", { id, description: `${fileName} · ${projectTitle}` });
  }, 600);
  setTimeout(() => {
    toast.success("Downloaded successfully", { id, description: `${fileName} · ${projectTitle} · ${date}` });
  }, 1600);
}

export const Route = createFileRoute("/dashboard/downloads")({
  head: () => ({ meta: [{ title: "Download center — ProjectHub" }] }),
  component: () => {
    const { purchases } = useStore();
    const list = purchases.map((id) => projects.find((p) => p.id === id)).filter(Boolean);
    return (
      <>
        <DashHeader title="Download center" subtitle="All files from your purchased projects." />
        {list.length === 0 ? (
          <EmptyState title="Nothing to download yet" body="Purchased projects unlock your file library." action={<Link to="/categories"><Button className="bg-gradient-primary">Browse projects</Button></Link>} />
        ) : (
          <div className="space-y-4">
            {list.map((p) => p && (
              <div key={p.id} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-start gap-4">
                  <img src={p.thumbnail} alt="" className="h-16 w-24 rounded-lg object-cover" />
                  <div className="flex-1">
                    <h3 className="font-display font-semibold">{p.title}</h3>
                    <p className="text-xs text-muted-foreground">Purchased · {p.includedFiles.length} files</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {fileMeta.map((f) => (
                    <div key={f.name} className="flex items-center gap-3 rounded-lg border border-border p-3">
                      <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary"><f.icon className="h-4 w-4" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium">{f.name}</p>
                        <p className="text-xs text-muted-foreground">{f.size}</p>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => startDownload(f.name, p.title)} aria-label={`Download ${f.name}`}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    );
  },
});
