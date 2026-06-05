import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Wand2 } from "lucide-react";
import { DashHeader } from "@/components/PageBits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { analyzeDocument } from "@/lib/ai-service";
import { useAI } from "@/lib/ai-context";
import { toast } from "sonner";

export const Route = createFileRoute("/ai/document-analyzer")({
  head: () => ({ meta: [{ title: "AI Document Analyzer — ProjectHub" }] }),
  component: Page,
});

function Page() {
  const { logUsage } = useAI();
  const [file, setFile] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Awaited<ReturnType<typeof analyzeDocument>> | null>(null);

  const submit = async () => {
    if (!file) { toast.error("Upload a file first"); return; }
    setLoading(true);
    try { setData(await analyzeDocument({ name: file })); logUsage("Document Analyzer"); toast.success("Analysis ready"); }
    finally { setLoading(false); }
  };

  return (
    <>
      <DashHeader title="AI Document Analyzer" subtitle="Summarize, explain & extract key Q&A from PDFs, DOCX, PPTs" />
      <div className="mb-6 rounded-2xl border border-border bg-card p-6">
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-border bg-background p-6 hover:border-primary">
          <Upload className="h-6 w-6 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium">{file || "Drop your document here"}</p>
            <p className="text-xs text-muted-foreground">PDF, DOCX, PPT supported</p>
          </div>
          <Input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" className="hidden" onChange={(e) => setFile(e.target.files?.[0]?.name ?? "")} />
        </label>
        <Button onClick={submit} disabled={loading || !file} className="mt-4 w-full bg-gradient-primary"><Wand2 className="mr-2 h-4 w-4" />{loading ? "Analyzing…" : "Analyze Document"}</Button>
      </div>

      {!data ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-border p-12 text-center">
          <FileText className="h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Upload a document to see analysis</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-border bg-card p-6">
          <Accordion type="multiple" defaultValue={["sum"]}>
            <AccordionItem value="sum"><AccordionTrigger>📌 Summary</AccordionTrigger><AccordionContent className="text-sm leading-relaxed">{data.summary}</AccordionContent></AccordionItem>
            <AccordionItem value="exp"><AccordionTrigger>💬 Explanation</AccordionTrigger><AccordionContent className="text-sm leading-relaxed">{data.explanation}</AccordionContent></AccordionItem>
            <AccordionItem value="mcq"><AccordionTrigger>📝 MCQs</AccordionTrigger><AccordionContent>
              <ol className="list-inside list-decimal space-y-2 text-sm">{data.mcqs.map((q, i) => <li key={i}><strong>{q.q}</strong> — <span className="text-muted-foreground">{q.a}</span></li>)}</ol>
            </AccordionContent></AccordionItem>
            <AccordionItem value="viva"><AccordionTrigger>🎓 Viva Questions</AccordionTrigger><AccordionContent>
              <ul className="list-inside list-disc space-y-1 text-sm">{data.viva.map((v, i) => <li key={i}>{v}</li>)}</ul>
            </AccordionContent></AccordionItem>
            <AccordionItem value="kw"><AccordionTrigger>🏷 Keywords</AccordionTrigger><AccordionContent>
              <div className="flex flex-wrap gap-2">{data.keywords.map((k) => <span key={k} className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{k}</span>)}</div>
            </AccordionContent></AccordionItem>
          </Accordion>
        </motion.div>
      )}
    </>
  );
}
