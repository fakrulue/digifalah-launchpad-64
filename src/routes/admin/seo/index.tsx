import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Search, Tag, Map } from "lucide-react";

export const Route = createFileRoute("/admin/seo/")({
  head: () => ({ meta: [{ title: "SEO Dashboard | DigiFalah Admin" }] }),
  component: SeoDash,
});

function SeoDash() {
  const [counts, setCounts] = useState({ keywords: 0, meta: 0, posts: 0 });
  useEffect(() => {
    (async () => {
      const [k, m, p] = await Promise.all([
        supabase.from("seo_keywords").select("*", { count: "exact", head: true }),
        supabase.from("seo_meta").select("*", { count: "exact", head: true }),
        supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("status", "published"),
      ]);
      setCounts({ keywords: k.count ?? 0, meta: m.count ?? 0, posts: p.count ?? 0 });
    })();
  }, []);

  const cards = [
    { label: "Tracked keywords", value: counts.keywords, icon: Tag, to: "/admin/seo/keywords" },
    { label: "Meta tags configured", value: counts.meta, icon: Search, to: "/admin/seo/meta" },
    { label: "Sitemap entries", value: counts.posts + 6, icon: Map, to: "/admin/seo/sitemap" },
  ];

  return (
    <AdminLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        <h1 className="font-display text-3xl font-bold">SEO dashboard</h1>
        <div className="grid gap-4 sm:grid-cols-3">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <Link key={c.label} to={c.to} className="rounded-2xl border border-border bg-card p-6 transition hover:border-primary">
                <Icon className="h-5 w-5 text-primary" />
                <div className="mt-4 font-display text-3xl font-bold">{c.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{c.label}</div>
              </Link>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
