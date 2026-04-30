import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Wand2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/admin/builder/")({
  head: () => ({ meta: [{ title: "Visual Builder | DigiFalah Admin" }] }),
  component: BuilderIndex,
});

const PAGES = [
  { slug: "home", label: "Home", path: "/" },
  { slug: "about", label: "About", path: "/about" },
  { slug: "services", label: "Services", path: "/services" },
  { slug: "pricing", label: "Pricing", path: "/pricing" },
  { slug: "contact", label: "Contact", path: "/contact" },
  { slug: "blog", label: "Blog landing", path: "/blog" },
];

function BuilderIndex() {
  return (
    <AdminLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Wand2 className="h-3 w-3" /> Visual Builder
          </div>
          <h1 className="font-display text-3xl font-bold">Edit your pages</h1>
          <p className="mt-1 text-muted-foreground">
            Pick a page, add or rearrange content blocks (hero, text, image, CTA, features). Changes go live immediately.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {PAGES.map((p) => (
            <Link
              key={p.slug}
              to="/admin/builder/$slug"
              params={{ slug: p.slug }}
              className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 transition hover:border-primary hover:shadow-soft"
            >
              <div>
                <div className="font-display text-lg font-bold">{p.label}</div>
                <div className="text-xs text-muted-foreground">{p.path}</div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
