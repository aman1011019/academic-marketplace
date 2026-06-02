import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Download } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getProject } from "@/lib/mock-data";
import { z } from "zod";

export const Route = createFileRoute("/checkout/success")({
  validateSearch: z.object({ id: z.string().optional() }),
  head: () => ({ meta: [{ title: "Payment successful — ProjectHub" }] }),
  component: Page,
});

function Page() {
  const { id } = Route.useSearch();
  const project = id ? getProject(id) : undefined;
  return (
    <section className="grid min-h-[calc(100vh-4rem)] place-items-center bg-gradient-hero px-4 py-16">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg rounded-3xl border border-border bg-card p-10 text-center shadow-elegant">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15, type: "spring" }} className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-success/10 text-success">
          <CheckCircle2 className="h-10 w-10" />
        </motion.div>
        <h1 className="mt-6 font-display text-3xl font-bold">Payment successful!</h1>
        <p className="mt-2 text-muted-foreground">Your project is now available in your dashboard.</p>
        {project && (
          <div className="mt-6 rounded-xl border border-border bg-background p-4 text-left">
            <p className="text-xs text-muted-foreground">You purchased</p>
            <p className="mt-1 font-semibold">{project.title}</p>
            <p className="mt-2 font-display text-xl font-bold text-gradient">₹{project.price}</p>
          </div>
        )}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/dashboard/downloads" className="flex-1"><Button className="w-full bg-gradient-primary"><Download className="mr-2 h-4 w-4" />Go to downloads</Button></Link>
          <Link to="/categories" className="flex-1"><Button variant="outline" className="w-full">Browse more</Button></Link>
        </div>
      </motion.div>
    </section>
  );
}
