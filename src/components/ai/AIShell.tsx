import { Link, useRouterState, Outlet } from "@tanstack/react-router";
import { Sparkles, Lightbulb, BookOpen, Search, FileText, Presentation, MessageSquare, FileBadge, Compass, MessagesSquare, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export const aiNav: { to: string; label: string; icon: LucideIcon; desc: string }[] = [
  { to: "/ai", label: "AI Dashboard", icon: LayoutDashboard, desc: "Your AI command center" },
  { to: "/ai/assistant", label: "AI Assistant", icon: MessagesSquare, desc: "Chat with your AI tutor" },
  { to: "/ai/project-advisor", label: "Project Advisor", icon: Lightbulb, desc: "Get tailored project ideas" },
  { to: "/ai/project-explainer", label: "Project Explainer", icon: BookOpen, desc: "Understand any codebase" },
  { to: "/ai/research-assistant", label: "Research Assistant", icon: Compass, desc: "Literature, gaps & methodology" },
  { to: "/ai/document-analyzer", label: "Document Analyzer", icon: FileText, desc: "Summaries, MCQs, viva Qs" },
  { to: "/ai/ppt-generator", label: "PPT Generator", icon: Presentation, desc: "Auto-build slide decks" },
  { to: "/ai/viva-generator", label: "Viva Generator", icon: MessageSquare, desc: "Practice viva questions" },
  { to: "/ai/resume-builder", label: "Resume Builder", icon: FileBadge, desc: "Project → resume bullets" },
  { to: "/ai/career-advisor", label: "Career Advisor", icon: Sparkles, desc: "Plan your career roadmap" },
  { to: "/ai/smart-search", label: "Smart Search", icon: Search, desc: "Semantic project search" },
];

export function AISidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r border-border bg-sidebar p-4 lg:block">
      <div className="mb-4 rounded-xl bg-gradient-primary p-4 text-primary-foreground shadow-glow">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          <p className="font-display text-sm font-bold">AI Studio</p>
        </div>
        <p className="mt-1 text-xs opacity-90">Ten AI-powered tools to supercharge your academic journey.</p>
      </div>
      <nav className="space-y-1">
        {aiNav.map((it) => {
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
    </aside>
  );
}

export function AIShell() {
  return (
    <div className="mx-auto flex max-w-7xl">
      <AISidebar />
      <main className="min-h-[calc(100vh-4rem)] flex-1 px-4 py-8 sm:px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
