import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageBits";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — ProjectHub" }] }),
  component: () => (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" subtitle="Last updated: January 2026" />
      <article className="prose prose-lg mx-auto max-w-3xl px-4 py-16 text-muted-foreground sm:px-6">
        <h2>1. Information we collect</h2>
        <p>We collect basic account information (name, email), payment metadata via Razorpay, and usage data to improve the service.</p>
        <h2>2. How we use it</h2>
        <p>To deliver purchased projects, send order confirmations, provide support, and prevent fraud. We never sell your data.</p>
        <h2>3. Cookies</h2>
        <p>We use essential cookies for auth and preference storage. No third-party advertising cookies.</p>
        <h2>4. Your rights</h2>
        <p>You may request export or deletion of your data anytime by emailing privacy@projecthub.example.</p>
        <h2>5. Contact</h2>
        <p>Questions? Email us at hello@projecthub.example.</p>
      </article>
    </>
  ),
});
