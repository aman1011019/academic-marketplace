import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { useAI } from "@/lib/ai-context";
import { chatComplete, type ChatMessage } from "@/lib/ai-service";
import { ChatMessageBubble, TypingIndicator } from "@/components/ai/FloatingChatbot";
import { Button } from "@/components/ui/button";
import { DashHeader } from "@/components/PageBits";

export const Route = createFileRoute("/ai/assistant")({
  head: () => ({ meta: [{ title: "AI Assistant — ProjectHub" }] }),
  component: Page,
});

function Page() {
  const { chat, setChat, logUsage } = useAI();
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" }); }, [chat, thinking]);

  const send = async () => {
    const t = input.trim(); if (!t) return;
    const u: ChatMessage = { id: "u" + Date.now(), role: "user", content: t, ts: Date.now() };
    setChat((p) => [...p, u]);
    setInput(""); setThinking(true);
    logUsage("AI Assistant");
    try {
      const reply = await chatComplete([...chat, u]);
      setChat((p) => [...p, { id: "a" + Date.now(), role: "assistant", content: reply, ts: Date.now() }]);
    } finally { setThinking(false); }
  };

  const suggestions = ["Suggest an AI project for CSE", "Explain MERN stack", "How do I write a strong abstract?", "Compare SQL vs NoSQL"];

  return (
    <>
      <DashHeader title="AI Assistant" subtitle="Your always-on academic tutor" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-[70vh] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div ref={ref} className="flex-1 overflow-y-auto bg-background/40 p-6">
          {chat.map((m) => <ChatMessageBubble key={m.id} msg={m} />)}
          {thinking && <div className="flex justify-start"><div className="rounded-2xl bg-muted"><TypingIndicator /></div></div>}
          {chat.length <= 1 && (
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {suggestions.map((s) => (
                <button key={s} onClick={() => setInput(s)} className="flex items-center gap-2 rounded-xl border border-dashed border-border bg-card p-3 text-left text-sm hover:border-primary hover:bg-accent">
                  <Sparkles className="h-4 w-4 text-primary" /> {s}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="border-t border-border p-3">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(); } }}
              rows={1}
              placeholder="Ask anything…"
              className="max-h-32 flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <Button onClick={send} disabled={thinking || !input.trim()} className="bg-gradient-primary"><Send className="mr-1 h-4 w-4" /> Send</Button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
