import { createFileRoute } from "@tanstack/react-router";
import { AIShell } from "@/components/ai/AIShell";

export const Route = createFileRoute("/ai")({
  head: () => ({ meta: [{ title: "AI Studio — ProjectHub" }] }),
  component: AIShell,
});
