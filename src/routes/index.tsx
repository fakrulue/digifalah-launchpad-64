import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Search, PenLine, Megaphone, Target, Layout, BarChart3, Star, CheckCircle2, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/site/LeadForm";
import heroBg from "@/assets/hero-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DigiFalah — AI-Powered Digital Marketing Agency in Bangladesh" },
      {
        name: "description",
        content:
          "SEO, AI blog writing, social media & paid ads for Bangladeshi businesses. Bangla-first content, Dhaka team, bKash/Nagad billing. Get a free audit today.",
      },
      { property: "og:title", content: "DigiFalah — Bangladesh's AI Marketing Partner" },
      { property: "og:description", content: "Grow online with Bangla-first SEO, content & ads." },
    ],
  }),
  component: Index,
});

const SERVICES = [
  { icon: Search, title: "SEO & Local Search", desc: "Rank for ‘ঢাকা’ and English keywords. Technical + on-page + Google Business." },
  { icon: PenLine, title: "AI Blog Writing", desc: "Bangla & English content at scale, edited by humans, optimized for search." },
  { icon: Megaphone, title: "Social Media", desc: "Facebook, Instagram & TikTok management with locally-relevant creative." },
  { icon: Target, title: "Paid Ads", desc: "Meta Ads & Google Ads optimized for Bangladesh CPM and conversion rates." },
  { icon: Layout, title: "Web Design", desc: "Fast, mobile-first sites that load on 3G and convert visitors into customers." },
  { icon: BarChart3, title: "Analytics", desc: "GA4, Meta Pixel, server-side tracking. Know exactly what's working." },
];

const STATS = [
  { value: "120+", label: "Clients served" },
  { value: "4.2x", label: "Avg. ROAS" },
  { value: "৳18Cr+", label: "Revenue generated" },
  { value: "97%", label: "Client retention" },
];

const TRUST = [
  "bKash & Nagad billing accepted",
  "Bangla-first AI content engine",
  "Dhaka-based bilingual team",
  "Transparent monthly reporting",
  "No long-term contracts",
  "Free initial audit, no strings",
];

const TESTIMONIALS = [
  { name: "Tahmina A.", role: "Founder, Dhaka Boutique", text: "Our online sales doubled in 4 months. The Bangla content actually sounds like us, not a robot." },
  { name: "Imran H.", role: "CEO, EduBangla", text: "Finally an agency that understands the Bangladesh market. Real reports, real results." },
  { name: "Sadia R.", role: "Marketing Lead, FoodHub BD", text: "Their paid ads team cut our CPA by 60%. Transparent, professional, fast." },
];

function Index() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
        <div
          className="absolute inset-0 opacity-50"
          style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-deep/40 via-transparent to-emerald-deep" aria-hidden />

        <div className="container relative mx-auto grid max-w-7xl gap-12 px-4 py-24 lg:grid-cols-[1.2fr_1fr] lg:py-32">
          <div className="flex flex-col justify-center">
            <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-gold/30 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-gold backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Bangladesh's AI marketing partner
            </span>
            <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Grow your business
              <br />
              with <span className="text-gradient-gold">Digital Falah.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/80">
              We help Bangladeshi businesses win online with AI-powered SEO,
              Bangla-first content, and high-ROI paid ads. From Dhaka to the world.
            </p>
            <p className="mt-2 font-bangla text-base text-gold">
              বাংলাদেশের ব্যবসার জন্য তৈরি ডিজিটাল মার্কেটিং
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gradient-gold text-emerald-deep shadow-gold hover:opacity-95">
                <Link to="/contact">
                  Get Free Audit <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/5 text-primary-foreground backdrop-blur hover:bg-white/10"
              >
                <Link to="/services">View Our Work</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-background/95 p-6 text-foreground shadow-elegant backdrop-blur md:p-8">
            <h3 className="font-display text-2xl font-bold">Get a free 15-min audit</h3>
            <p className="mt-1 text-sm text-muted-foreground">No obligation. Bangla or English call.</p>
            <div className="mt-6">
              <LeadForm source="hero" compact />
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-border bg-surface">
        <div className="container mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-12 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-4xl font-bold text-primary md:text-5xl">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="container mx-auto max-w-7xl px-4 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">What we do</span>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            Everything you need to grow online.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Six core services. One bilingual team. Built for the Bangladesh market.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/30 hover:shadow-elegant"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-emerald text-primary-foreground shadow-soft">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                <div className="absolute -bottom-1 -right-1 h-24 w-24 rounded-full bg-gold/0 blur-2xl transition-all group-hover:bg-gold/10" />
              </div>
            );
          })}
        </div>
      </section>

      {/* WHY DIGIFALAH */}
      <section className="bg-emerald-deep text-primary-foreground">
        <div className="container mx-auto grid max-w-7xl gap-12 px-4 py-24 lg:grid-cols-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gold">Why DigiFalah</span>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
              Built for <span className="text-gradient-gold">Bangladesh.</span>
              <br />Trusted worldwide.
            </h2>
            <p className="mt-6 text-primary-foreground/70">
              We're not a generic global agency. We understand bKash funnels,
              Bangla search behavior, Dhaka delivery realities, and what makes a
              Bangladeshi customer actually click "Buy".
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {TRUST.map((t) => (
              <li key={t} className="flex items-start gap-3 rounded-xl bg-white/5 p-4 backdrop-blur">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <span className="text-sm">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container mx-auto max-w-7xl px-4 py-24">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">What clients say</span>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            Real businesses. Real growth.
          </h2>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-2xl border border-border bg-card p-8 shadow-soft">
              <div className="flex gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-foreground">"{t.text}"</p>
              <div className="mt-6 border-t border-border pt-4">
                <div className="font-bold">{t.name}</div>
                <div className="text-sm text-muted-foreground">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto max-w-7xl px-4 pb-24">
        <div className="overflow-hidden rounded-3xl bg-gradient-emerald p-12 text-center text-primary-foreground shadow-elegant md:p-20">
          <h2 className="mx-auto max-w-2xl font-display text-4xl font-bold md:text-5xl">
            Ready to grow with <span className="text-gradient-gold">DigiFalah?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Let's talk. 15 minutes, no pitch deck, just honest advice for your business.
          </p>
          <Button asChild size="lg" className="mt-8 bg-gradient-gold text-emerald-deep shadow-gold hover:opacity-95">
            <Link to="/contact">
              Book Your Free Audit <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
