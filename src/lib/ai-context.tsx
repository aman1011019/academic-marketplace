import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { ChatMessage } from "./ai-service";

type Usage = { tool: string; date: string }[];

type AICtx = {
  chat: ChatMessage[];
  setChat: (m: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
  clearChat: () => void;
  usage: Usage;
  logUsage: (tool: string) => void;
  recentSearches: string[];
  addSearch: (q: string) => void;
  results: Record<string, unknown>;
  saveResult: (key: string, value: unknown) => void;
};

const Ctx = createContext<AICtx>({} as AICtx);

const seed: ChatMessage[] = [
  { id: "m0", role: "assistant", content: "👋 Hi! I'm your AI Assistant. Ask me about projects, careers, or anything academic.", ts: Date.now() },
];

export function AIProvider({ children }: { children: ReactNode }) {
  const [chat, setChat] = useState<ChatMessage[]>(seed);
  const [usage, setUsage] = useState<Usage>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [results, setResults] = useState<Record<string, unknown>>({});

  useEffect(() => {
    try {
      const c = localStorage.getItem("ai_chat");
      const u = localStorage.getItem("ai_usage");
      const r = localStorage.getItem("ai_recent");
      if (c) setChat(JSON.parse(c));
      if (u) setUsage(JSON.parse(u));
      if (r) setRecentSearches(JSON.parse(r));
    } catch {}
  }, []);
  useEffect(() => { localStorage.setItem("ai_chat", JSON.stringify(chat.slice(-50))); }, [chat]);
  useEffect(() => { localStorage.setItem("ai_usage", JSON.stringify(usage.slice(-200))); }, [usage]);
  useEffect(() => { localStorage.setItem("ai_recent", JSON.stringify(recentSearches.slice(0, 10))); }, [recentSearches]);

  return (
    <Ctx.Provider
      value={{
        chat,
        setChat: (m) => setChat(typeof m === "function" ? (m as (p: ChatMessage[]) => ChatMessage[]) : () => m),
        clearChat: () => setChat(seed),
        usage,
        logUsage: (tool) => setUsage((u) => [...u, { tool, date: new Date().toISOString() }]),
        recentSearches,
        addSearch: (q) => setRecentSearches((r) => [q, ...r.filter((x) => x !== q)].slice(0, 10)),
        results,
        saveResult: (key, value) => setResults((r) => ({ ...r, [key]: value })),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useAI = () => useContext(Ctx);
