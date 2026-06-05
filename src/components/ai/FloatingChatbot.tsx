import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Minus, Send, Mic, MicOff, Volume2, Paperclip, Trash2, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAI } from "@/lib/ai-context";
import { chatComplete, type ChatMessage } from "@/lib/ai-service";
import { toast } from "sonner";

function renderMarkdown(text: string) {
  // very small markdown: bold, code blocks, inline code, lists
  const parts: { type: "code" | "text"; lang?: string; content: string }[] = [];
  const codeRe = /```(\w+)?\n([\s\S]*?)```/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = codeRe.exec(text))) {
    if (m.index > last) parts.push({ type: "text", content: text.slice(last, m.index) });
    parts.push({ type: "code", lang: m[1], content: m[2] });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ type: "text", content: text.slice(last) });

  return parts.map((p, i) => {
    if (p.type === "code") {
      return (
        <pre key={i} className="my-2 overflow-x-auto rounded-lg bg-foreground/90 p-3 text-xs text-background">
          <code>{p.content}</code>
        </pre>
      );
    }
    const html = p.content
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/`([^`]+)`/g, '<code class="rounded bg-muted px-1 py-0.5 text-xs">$1</code>')
      .replace(/^- (.+)$/gm, "• $1")
      .replace(/\n/g, "<br/>");
    return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
  });
}

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
          className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
        />
      ))}
    </div>
  );
}

export function ChatMessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  const speak = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(msg.content));
  };
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
        isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
      }`}>
        <div className="whitespace-pre-wrap break-words">{renderMarkdown(msg.content)}</div>
        {msg.attachments?.map((a) => (
          <div key={a.name} className="mt-2 rounded-md bg-background/30 px-2 py-1 text-xs">📎 {a.name}</div>
        ))}
        {!isUser && (
          <button onClick={speak} className="mt-1 inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground">
            <Volume2 className="h-3 w-3" /> Listen
          </button>
        )}
      </div>
    </div>
  );
}

export function FloatingChatbot() {
  const { chat, setChat, clearChat } = useAI();
  const [open, setOpen] = useState(false);
  const [min, setMin] = useState(false);
  const [max, setMax] = useState(false);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const recRef = useRef<any>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chat, thinking, open]);

  const send = async (text: string, attachments?: ChatMessage["attachments"]) => {
    const t = text.trim();
    if (!t && !attachments?.length) return;
    const u: ChatMessage = { id: "u" + Date.now(), role: "user", content: t, ts: Date.now(), attachments };
    setChat((prev) => [...prev, u]);
    setInput("");
    setThinking(true);
    try {
      const reply = await chatComplete([...chat, u]);
      setChat((prev) => [...prev, { id: "a" + Date.now(), role: "assistant", content: reply, ts: Date.now() }]);
    } catch {
      toast.error("AI request failed");
    } finally {
      setThinking(false);
    }
  };

  const onMic = () => {
    if (typeof window === "undefined") return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast.error("Voice input not supported in this browser");
      return;
    }
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const r = new SR();
    r.lang = "en-US";
    r.interimResults = false;
    r.onresult = (e: any) => setInput((v) => (v ? v + " " : "") + e.results[0][0].transcript);
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    r.start();
    recRef.current = r;
    setListening(true);
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    void send(`Please analyze: ${files.map((f) => f.name).join(", ")}`, files.map((f) => ({ name: f.name, type: f.type, size: f.size })));
    if (fileRef.current) fileRef.current.value = "";
  };

  const w = max ? "w-[min(900px,95vw)]" : "w-[min(420px,95vw)]";
  const h = max ? "h-[85vh]" : "h-[600px] max-h-[85vh]";

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => { setOpen(true); setMin(false); }}
            className="glass shadow-glow fixed bottom-5 right-5 z-[60] grid h-14 w-14 place-items-center rounded-full bg-gradient-primary text-primary-foreground"
            aria-label="Open AI Assistant"
          >
            <motion.span
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 rounded-full bg-primary/40"
            />
            <Sparkles className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
            className={`fixed bottom-5 right-5 z-[60] flex ${w} ${min ? "h-14" : h} flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-elegant`}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border bg-gradient-primary px-4 py-3 text-primary-foreground">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-background/20 backdrop-blur">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-tight">AI Assistant</p>
                  <p className="text-[10px] opacity-80">Online • Powered by ProjectHub AI</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={clearChat} className="rounded-md p-1.5 hover:bg-background/20" title="Clear chat"><Trash2 className="h-3.5 w-3.5" /></button>
                <button onClick={() => setMax((v) => !v)} className="rounded-md p-1.5 hover:bg-background/20" title={max ? "Restore" : "Maximize"}>
                  {max ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                </button>
                <button onClick={() => setMin((v) => !v)} className="rounded-md p-1.5 hover:bg-background/20" title="Minimize"><Minus className="h-3.5 w-3.5" /></button>
                <button onClick={() => setOpen(false)} className="rounded-md p-1.5 hover:bg-background/20" title="Close"><X className="h-3.5 w-3.5" /></button>
              </div>
            </div>

            {!min && (
              <>
                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto bg-background/40 px-4 py-4">
                  {chat.map((m) => <ChatMessageBubble key={m.id} msg={m} />)}
                  {thinking && (
                    <div className="flex justify-start"><div className="rounded-2xl bg-muted"><TypingIndicator /></div></div>
                  )}
                </div>

                {/* Input */}
                <div className="border-t border-border bg-card p-3">
                  <div className="flex items-end gap-1.5">
                    <input ref={fileRef} type="file" multiple accept=".pdf,.doc,.docx,.ppt,.pptx,image/*" className="hidden" onChange={onFile} />
                    <Button variant="ghost" size="icon" onClick={() => fileRef.current?.click()} title="Attach file"><Paperclip className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={onMic} title="Voice input">
                      {listening ? <MicOff className="h-4 w-4 text-destructive" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(input); } }}
                      placeholder="Ask anything…"
                      rows={1}
                      className="max-h-32 flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                    <Button size="icon" onClick={() => void send(input)} disabled={thinking || !input.trim()} className="bg-gradient-primary">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="mt-1.5 text-center text-[10px] text-muted-foreground">AI may produce inaccurate info — verify important details.</p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
