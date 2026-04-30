import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { LeadForm } from "@/components/site/LeadForm";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact DigiFalah — Get Your Free Marketing Audit" },
      {
        name: "description",
        content:
          "Talk to DigiFalah. Free 15-minute audit, no obligation. WhatsApp, phone or email — Bangla or English.",
      },
      { property: "og:title", content: "Contact DigiFalah" },
      { property: "og:description", content: "Get your free marketing audit." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteLayout pageSlug="contact">
      <section className="bg-gradient-hero py-20 text-primary-foreground">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-gold">Get in touch</span>
          <h1 className="mt-3 font-display text-5xl font-bold md:text-6xl">
            Let's grow your <span className="text-gradient-gold">business.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-primary-foreground/80">
            Tell us about your goals. We'll get back within 24 hours with honest, actionable advice.
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-soft md:p-12">
            <h2 className="font-display text-3xl font-bold">Get a free audit</h2>
            <p className="mt-2 text-muted-foreground">
              No obligations. Just an honest review of where you stand and where to go next.
            </p>
            <div className="mt-8">
              <LeadForm source="contact-page" />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="font-display text-3xl font-bold">Or reach us directly</h2>

            <a
              href="https://wa.me/8801700000000"
              target="_blank"
              rel="noopener"
              className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-white">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <div className="font-bold">WhatsApp (fastest)</div>
                <div className="text-sm text-muted-foreground">+880 1700-000000</div>
              </div>
            </a>

            <a href="tel:+8801700000000" className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-emerald text-primary-foreground">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <div className="font-bold">Call us</div>
                <div className="text-sm text-muted-foreground">+880 1700-000000</div>
              </div>
            </a>

            <a href="mailto:hello@digifalah.com" className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-emerald text-primary-foreground">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <div className="font-bold">Email</div>
                <div className="text-sm text-muted-foreground">hello@digifalah.com</div>
              </div>
            </a>

            <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-emerald text-primary-foreground">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <div className="font-bold">Office</div>
                <div className="text-sm text-muted-foreground">Gulshan, Dhaka, Bangladesh</div>
                <div className="mt-1 text-xs text-muted-foreground">Sun–Thu · 10am – 7pm</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}