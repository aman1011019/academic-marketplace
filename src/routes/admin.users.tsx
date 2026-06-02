import { createFileRoute } from "@tanstack/react-router";
import { DashHeader } from "@/components/PageBits";
import { mockUsers } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ban } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Manage users — Admin" }] }),
  component: () => (
    <>
      <DashHeader title="Users" subtitle={`${mockUsers.length} registered users`} />
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr><th className="px-6 py-3">User</th><th className="px-6 py-3">Role</th><th className="px-6 py-3">Purchases</th><th className="px-6 py-3">Joined</th><th className="px-6 py-3">Status</th><th className="px-6 py-3 text-right">Action</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockUsers.map((u) => (
              <tr key={u.id}>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-primary text-xs font-bold text-primary-foreground">{u.name[0]}</div>
                    <div><p className="font-medium">{u.name}</p><p className="text-xs text-muted-foreground">{u.email}</p></div>
                  </div>
                </td>
                <td className="px-6 py-3"><Badge variant={u.role === "admin" ? "default" : "secondary"}>{u.role}</Badge></td>
                <td className="px-6 py-3">{u.purchases}</td>
                <td className="px-6 py-3 text-muted-foreground">{new Date(u.joined).toLocaleDateString()}</td>
                <td className="px-6 py-3"><Badge className={u.status === "active" ? "bg-success/15 text-success hover:bg-success/15" : "bg-destructive/15 text-destructive hover:bg-destructive/15"}>{u.status}</Badge></td>
                <td className="px-6 py-3 text-right"><Button size="sm" variant="ghost" onClick={() => toast.error("Demo only")}><Ban className="h-4 w-4" /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ),
});
