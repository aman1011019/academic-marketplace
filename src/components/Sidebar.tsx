import { Link, useRouterState, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, ShoppingBag, Download, User, KeyRound, Receipt, Heart, Bell, LogOut, Settings as SettingsIcon, FolderKanban, Tag, Users, BarChart3, IndianRupee } from "lucide-react";
import { useAuth } from "@/lib/store";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

const userNav = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/purchases", label: "My Purchases", icon: ShoppingBag },
  { to: "/dashboard/downloads", label: "Download Center", icon: Download },
  { to: "/dashboard/wishlist", label: "Wishlist", icon: Heart },
  { to: "/dashboard/transactions", label: "Transactions", icon: Receipt },
  { to: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { to: "/dashboard/profile", label: "Profile", icon: User },
  { to: "/dashboard/change-password", label: "Change Password", icon: KeyRound },
];

const adminNav = [
  { to: "/admin", label: "Analytics", icon: BarChart3 },
  { to: "/admin/categories", label: "Categories", icon: Tag },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/revenue", label: "Revenue", icon: IndianRupee },
  { to: "/admin/downloads", label: "Downloads", icon: Download },
  { to: "/admin/settings", label: "Site Settings", icon: SettingsIcon },
];

export function Sidebar({ items, title }: { items: { to: string; label: string; icon: LucideIcon }[]; title: string }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { user, logout } = useAuth();
  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-border bg-sidebar p-4 lg:block">
      <div className="mb-6 rounded-xl bg-gradient-primary/10 p-4">
        <p className="text-xs text-muted-foreground">{title}</p>
        <p className="mt-1 font-display text-sm font-semibold">{user?.name}</p>
        <p className="text-xs text-muted-foreground">{user?.email}</p>
      </div>
      <nav className="space-y-1">
        {items.map((it) => {
          const active = path === it.to;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <it.icon className="h-4 w-4" />
              {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="absolute bottom-4 left-4 right-4">
        <Button variant="outline" className="w-full justify-start" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />Sign out
        </Button>
      </div>
    </aside>
  );
}

export function DashboardShell({ admin = false }: { admin?: boolean }) {
  return (
    <div className="mx-auto flex max-w-7xl">
      <Sidebar items={admin ? adminNav : userNav} title={admin ? "Admin Panel" : "Your Dashboard"} />
      <main className="min-h-[calc(100vh-4rem)] flex-1 px-4 py-8 sm:px-6 lg:px-10">
        <Outlet />
      </main>
    </div>
  );
}
