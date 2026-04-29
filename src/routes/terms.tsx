import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | DigiFalah" },
      { name: "description", content: "Terms governing use of DigiFalah's website and services." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <SiteLayout>
      <article className="container mx-auto max-w-3xl px-4 py-20">
        <h1 className="font-display text-4xl font-bold md:text-5xl">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: April 2026</p>

        <div className="prose prose-lg mt-10 max-w-none text-foreground space-y-6">
          <section>
            <h2 className="font-display text-2xl font-bold">Use of services</h2>
            <p className="mt-2 text-muted-foreground">
              By engaging DigiFalah, you agree to provide accurate information,
              cooperate in good faith, and pay agreed fees on time. We commit
              to deliver services described in your service agreement with
              reasonable skill and care.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-bold">Cancellation</h2>
            <p className="mt-2 text-muted-foreground">
              All plans include a 30-day cancellation window. Cancel anytime
              with 30 days' notice — no penalties.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-bold">Liability</h2>
            <p className="mt-2 text-muted-foreground">
              Our liability is limited to the fees paid in the most recent
              month. We are not liable for indirect or consequential losses.
            </p>
          </section>
        </div>
      </article>
    </SiteLayout>
  );
}