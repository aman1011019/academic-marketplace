import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/PageBits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact us — ProjectHub" }, { name: "description", content: "Get in touch with the ProjectHub team for custom projects, support or partnerships." }] }),
  component: Page,
});

function Page() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  return (
    <>
      <PageHeader eyebrow="Contact" title="We'd love to hear from you" subtitle="Custom requirements, support questions, partnerships — drop us a line." />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-1">
          {[
            { icon: Mail, title: "Email", body: "hello@projecthub.example" },
            { icon: Phone, title: "Phone", body: "+91 98765 43210" },
            { icon: MapPin, title: "Office", body: "Koramangala, Bengaluru, KA" },
          ].map((it) => (
            <div key={it.title} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary/10 text-primary"><it.icon className="h-5 w-5" /></div>
              <div>
                <p className="font-semibold">{it.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{it.body}</p>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); toast.success("Message sent!"); setForm({ name: "", email: "", subject: "", message: "" }); }} className="space-y-4 rounded-2xl border border-border bg-card p-8 shadow-soft lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label htmlFor="n">Name</Label><Input id="n" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" /></div>
            <div><Label htmlFor="e">Email</Label><Input id="e" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5" /></div>
          </div>
          <div><Label htmlFor="s">Subject</Label><Input id="s" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="mt-1.5" /></div>
          <div><Label htmlFor="m">Message</Label><Textarea id="m" required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-1.5" /></div>
          <Button type="submit" size="lg" className="bg-gradient-primary"><Send className="mr-2 h-4 w-4" />Send message</Button>
        </form>
      </section>
    </>
  );
}
