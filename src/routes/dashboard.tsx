import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/store";
import { useNavigate } from "@tanstack/react-router";
import { DashboardShell } from "@/components/Sidebar";

export const Route = createFileRoute("/dashboard")({
  component: Layout,
});

function Layout() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (!loading && !user) nav({ to: "/login" });
  }, [loading, user, nav]);
  if (!user) return <div className="grid min-h-[60vh] place-items-center text-muted-foreground">Redirecting to sign in...</div>;
  return <DashboardShell />;
}
