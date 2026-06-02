import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/store";
import { useNavigate } from "@tanstack/react-router";
import { DashboardShell } from "@/components/Sidebar";

export const Route = createFileRoute("/admin")({
  component: Layout,
});

function Layout() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (!loading) {
      if (!user) nav({ to: "/login" });
      else if (user.role !== "admin") nav({ to: "/dashboard" });
    }
  }, [loading, user, nav]);
  if (!user || user.role !== "admin") return <div className="grid min-h-[60vh] place-items-center text-muted-foreground">Checking admin access...</div>;
  return <DashboardShell admin />;
}
