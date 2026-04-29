import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Affordable Digital Marketing Packages | DigiFalah" },
      {
        name: "description",
        content:
          "Transparent monthly digital marketing pricing for Bangladeshi businesses. Starter, Growth, and Scale packages — bKash & Nagad accepted.",
      },
      { property: "og:title", content: "DigiFalah Pricing" },
      { property: "og:description", content: "Transparent monthly packages. bKash & Nagad accepted." },
    ],
  }),
  component: PricingPage,
});

const PLANS = [
  {
    name: "Starter",
    price: "৳15,000",
    period: "/month",
    desc: "For small businesses getting started online.",
    features: [
      "4 AI-written blog posts",
      "Basic SEO optimization",
      "12 social media posts",
      "Monthly performance report",
      "Email support",
    ],
    highlight: false,
  },
  {
    name: "Growth",
    price: "৳40,000",
    period: "/month",
    desc: "Most popular — for businesses ready to scale.",
    features: [
      "12 AI + human-edited posts",
      "Full SEO (technical + on-page)",
      "30 social posts + Reels",
      "Meta Ads management (up to ৳50k spend)",
      "Bi-weekly strategy calls",
      "Priority WhatsApp support",
    ],
    highlight: true,
  },
  {
    name: "Scale",
    price: "Custom",
    period: "",
    desc: "For brands with serious growth ambitions.",
    features: [
      "Unlimited content production",
      "Full SEO + technical dev",
      "Daily social + paid creative",
      "Multi-channel paid ads",
      "Dedicated account manager",
      "24/7 priority support",
    ],
    highlight: false,
  },
];

function PricingPage() {
  return (
    <SiteLayout>
      <section className="bg-gradient-hero py-20 text-primary-foreground">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-gold">Pricing</span>
          <h1 className="mt-3 font-display text-5xl font-bold md:text-6xl">
            Simple, <span className="text-gradient-gold">transparent</span> pricing.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-primary-foreground/80">
            Pay monthly. No long-term contracts. bKash, Nagad and bank transfer accepted.
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-card p-8 transition-shadow",
                plan.highlight
                  ? "border-primary shadow-elegant ring-2 ring-primary/20"
                  : "border-border shadow-soft hover:shadow-elegant"
              )}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-gradient-gold px-3 py-1 text-xs font-bold text-emerald-deep shadow-gold">
                  <Sparkles className="h-3 w-3" /> MOST POPULAR
                </div>
              )}
              <h3 className="font-display text-2xl font-bold">{plan.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{plan.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-5xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                size="lg"
                className={cn(
                  "mt-8",
                  plan.highlight
                    ? "bg-gradient-emerald shadow-soft"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                <Link to="/contact">Get Started</Link>
              </Button>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          All plans include a free 30-day cancellation window. No setup fees.
        </p>
      </section>
    </SiteLayout>
  );
}