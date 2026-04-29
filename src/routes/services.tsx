import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, PenLine, Megaphone, Target, Layout, BarChart3, ArrowRight, CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — SEO, AI Content & Paid Ads | DigiFalah" },
      {
        name: "description",
        content:
          "Full-service digital marketing for Bangladesh: SEO, AI blog writing in Bangla & English, social media, Meta & Google Ads, and conversion-focused web design.",
      },
      { property: "og:title", content: "Services — DigiFalah" },
      { property: "og:description", content: "SEO, content, ads & web design for Bangladeshi brands." },
    ],
  }),
  component: ServicesPage,
});

const SERVICES = [
  {
    icon: Search,
    title: "SEO & Local Search",
    desc: "We rank Bangladeshi businesses for the searches that actually drive revenue.",
    points: [
      "Technical audit & Core Web Vitals fix",
      "Bangla + English keyword research",
      "Google Business Profile optimization",
      "Local citations & link building",
    ],
  },
  {
    icon: PenLine,
    title: "AI Blog Writing",
    desc: "Publish 4–20 SEO articles per month, written by AI, polished by humans.",
    points: [
      "Bangla, English, or bilingual posts",
      "On-brand tone, edited by experts",
      "Optimized for keyword + intent",
      "Featured images included",
    ],
  },
  {
    icon: Megaphone,
    title: "Social Media Management",
    desc: "Daily posting, community management, and creative that converts.",
    points: [
      "Facebook, Instagram, TikTok",
      "Bangla-first creative direction",
      "Reels & short-form video",
      "Monthly performance reports",
    ],
  },
  {
    icon: Target,
    title: "Paid Advertising",
    desc: "Meta Ads & Google Ads built for Bangladesh CPMs and conversion patterns.",
    points: [
      "Full-funnel campaign architecture",
      "Server-side conversion tracking",
      "Creative testing framework",
      "Weekly optimization & reports",
    ],
  },
  {
    icon: Layout,
    title: "Web Design & Development",
    desc: "Fast, mobile-first sites that work on 3G and convert visitors to customers.",
    points: [
      "Mobile-first responsive design",
      "<2s load time on 3G",
      "bKash & SSLCommerz integration",
      "SEO-ready out of the box",
    ],
  },
  {
    icon: BarChart3,
    title: "Analytics & Tracking",
    desc: "Know exactly what's working. Real attribution, real ROI, real reports.",
    points: [
      "GA4 + Meta Pixel setup",
      "Server-side / Conversions API",
      "Custom dashboards (Looker Studio)",
      "Monthly insight reports",
    ],
  },
];

function ServicesPage() {
  return (
    <SiteLayout>
      <section className="bg-gradient-hero py-20 text-primary-foreground">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-gold">Our Services</span>
          <h1 className="mt-3 font-display text-5xl font-bold md:text-6xl">
            Marketing that <span className="text-gradient-gold">moves the needle.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-primary-foreground/80">
            Six core services. One bilingual team. Built specifically for the
            Bangladesh market and global ambition.
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-8 lg:grid-cols-2">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="rounded-2xl border border-border bg-card p-8 shadow-soft">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-emerald text-primary-foreground shadow-soft">
                  <Icon className="h-7 w-7" />
                </div>
                <h2 className="font-display text-2xl font-bold">{s.title}</h2>
                <p className="mt-2 text-muted-foreground">{s.desc}</p>
                <ul className="mt-6 space-y-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-16 rounded-2xl bg-gradient-emerald p-12 text-center text-primary-foreground shadow-elegant">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Not sure which service fits?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
            Tell us your goal. We'll recommend the right mix — or honestly tell you if you don't need us yet.
          </p>
          <Button asChild size="lg" className="mt-6 bg-gradient-gold text-emerald-deep shadow-gold">
            <Link to="/contact">Talk to a Strategist <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}