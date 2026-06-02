import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageBits";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms & Conditions — ProjectHub" }] }),
  component: () => (
    <>
      <PageHeader eyebrow="Legal" title="Terms & Conditions" subtitle="Last updated: January 2026" />
      <article className="prose prose-lg mx-auto max-w-3xl px-4 py-16 text-muted-foreground sm:px-6">
        <h2>1. License</h2>
        <p>Purchased projects are licensed for personal academic submission. Redistribution or resale is strictly prohibited.</p>
        <h2>2. Payment & Refunds</h2>
        <p>All payments are processed via Razorpay. Refunds are issued only if delivered files are corrupted or fundamentally broken, within 7 days of purchase.</p>
        <h2>3. Plagiarism</h2>
        <p>Projects are original at the time of sale. We recommend customising before submission. ProjectHub is not responsible for academic outcomes.</p>
        <h2>4. Support</h2>
        <p>30 days of email support is included with every purchase. Custom development is billed separately.</p>
        <h2>5. Governing law</h2>
        <p>These terms are governed by the laws of India. Jurisdiction: Bengaluru, Karnataka.</p>
      </article>
    </>
  ),
});
