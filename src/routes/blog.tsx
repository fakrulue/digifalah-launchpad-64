import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Digital Marketing Insights for Bangladesh | DigiFalah" },
      {
        name: "description",
        content:
          "Digital marketing tips, SEO guides and growth playbooks for Bangladeshi businesses. In Bangla and English.",
      },
      { property: "og:title", content: "DigiFalah Blog" },
      { property: "og:description", content: "SEO, ads & content insights for the Bangladesh market." },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <SiteLayout pageSlug="blog">
      <section className="bg-gradient-hero py-20 text-primary-foreground">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-gold">Insights</span>
          <h1 className="mt-3 font-display text-5xl font-bold md:text-6xl">
            The <span className="text-gradient-gold">DigiFalah</span> Blog
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-primary-foreground/80">
            Practical digital marketing playbooks for Bangladeshi businesses.
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-4xl px-4 py-24 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-emerald text-primary-foreground shadow-soft">
          <BookOpen className="h-7 w-7" />
        </div>
        <h2 className="mt-6 font-display text-3xl font-bold">Articles coming soon</h2>
        <p className="mt-3 text-muted-foreground">
          We're publishing our first batch of AI-assisted, expert-edited
          guides. Want to be notified when they go live?
        </p>
        <Button asChild size="lg" className="mt-6 bg-gradient-emerald shadow-soft">
          <Link to="/contact">Notify me <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </section>
    </SiteLayout>
  );
}