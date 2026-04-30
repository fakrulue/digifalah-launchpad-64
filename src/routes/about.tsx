import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Globe, Users, Zap } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About DigiFalah — Bangladesh Digital Marketing Team" },
      {
        name: "description",
        content:
          "Meet DigiFalah — a bilingual Dhaka-based team of marketers, writers and developers helping Bangladeshi businesses succeed online.",
      },
      { property: "og:title", content: "About DigiFalah" },
      { property: "og:description", content: "Bilingual Dhaka team. Bangla-first marketing. Global ambition." },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  { icon: Heart, title: "Bangla-first", desc: "We write, design and report in the language your customers actually use." },
  { icon: Globe, title: "Globally aware", desc: "We borrow the best playbooks from Silicon Valley and adapt them for Dhaka." },
  { icon: Users, title: "Transparent", desc: "Real reports, no jargon, no inflated metrics. You see exactly what we do." },
  { icon: Zap, title: "AI-augmented", desc: "We use AI to scale output 10x — but every word ships through human editors." },
];

function AboutPage() {
  return (
    <SiteLayout pageSlug="about">
      <section className="bg-gradient-hero py-20 text-primary-foreground">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-gold">About Us</span>
          <h1 className="mt-3 font-display text-5xl font-bold md:text-6xl">
            We're builders, not <span className="text-gradient-gold">consultants.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-primary-foreground/80">
            DigiFalah was founded in Dhaka in 2024 by a small team that was
            tired of agencies that over-promise and under-deliver. We do the
            work, ship the work, and report the work.
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-5xl px-4 py-20">
        <div className="prose prose-lg max-w-none text-foreground">
          <h2 className="font-display text-3xl font-bold">Our story</h2>
          <p className="mt-4 text-muted-foreground">
            "Falah" means success in many languages spoken across South Asia.
            Our mission is simple: digital success for Bangladeshi businesses
            of every size — from a Gulshan boutique to an exporter shipping to
            Europe.
          </p>
          <p className="mt-4 text-muted-foreground">
            We combine the speed of modern AI tools with the local nuance only
            a Dhaka-based team can deliver. Our writers think in Bangla. Our
            ad operators understand bKash. Our developers test on the actual
            phones your customers are using.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-emerald text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-bold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Button asChild size="lg" className="bg-gradient-emerald shadow-soft">
            <Link to="/contact">Work with us</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}