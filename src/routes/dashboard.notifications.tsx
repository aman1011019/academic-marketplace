import { createFileRoute } from "@tanstack/react-router";
import { Bell, CheckCheck } from "lucide-react";
import { DashHeader } from "@/components/PageBits";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/dashboard/notifications")({
  head: () => ({ meta: [{ title: "Notifications — ProjectHub" }] }),
  component: () => {
    const { notifications, markAllRead } = useStore();
    return (
      <>
        <DashHeader title="Notifications" subtitle="Recent activity on your account." action={<Button variant="outline" size="sm" onClick={markAllRead}><CheckCheck className="mr-2 h-4 w-4" />Mark all read</Button>} />
        <div className="space-y-3">
          {notifications.map((n) => (
            <div key={n.id} className={`flex gap-4 rounded-2xl border border-border p-5 ${n.read ? "bg-card/50" : "bg-card"}`}>
              <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${n.read ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}`}><Bell className="h-5 w-5" /></div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">{n.title}</p>
                  {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                <p className="mt-2 text-xs text-muted-foreground">{formatDistanceToNow(new Date(n.date), { addSuffix: true })}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  },
});
