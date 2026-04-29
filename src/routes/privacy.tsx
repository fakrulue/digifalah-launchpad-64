import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | DigiFalah" },
      { name: "description", content: "How DigiFalah collects, uses and protects your data." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <SiteLayout>
      <article className="container mx-auto max-w-3xl px-4 py-20">
        <h1 className="font-display text-4xl font-bold md:text-5xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: April 2026</p>

        <div className="prose prose-lg mt-10 max-w-none text-foreground space-y-6">
          <section>
            <h2 className="font-display text-2xl font-bold">What we collect</h2>
            <p className="mt-2 text-muted-foreground">
              When you fill in a contact form, we collect your name, phone, email
              (optional), business type, and any message you provide. We use
              standard analytics (Google Analytics, Meta Pixel) to understand
              site usage.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-bold">How we use your data</h2>
            <p className="mt-2 text-muted-foreground">
              Solely to respond to your inquiry, deliver services you've engaged
              us for, and improve our site. We never sell your data.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-bold">Your rights</h2>
            <p className="mt-2 text-muted-foreground">
              You can request deletion of your data at any time by emailing
              hello@digifalah.com.
            </p>
          </section>
        </div>
      </article>
    </SiteLayout>
  );
}