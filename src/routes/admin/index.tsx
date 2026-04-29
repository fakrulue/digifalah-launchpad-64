import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, Inbox, Image, Database, PenSquare, Upload, Map } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Dashboard | DigiFalah Admin" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const [counts, setCounts] = useState({ leads: 0, posts: 0, media: 0 });

  useEffect(() => {
    (async () => {
      const { count } = await supabase.from("leads").select("*", { count: "exact", head: true });
      setCounts((c) => ({ ...c, leads: count ?? 0 }));
    })();
  }, []);

  const cards = [
    { label: "Total leads", value: counts.leads, icon: Inbox, color: "from-emerald-deep to-primary" },
    { label: "Blog posts", value: counts.posts, icon: FileText, color: "from-primary to-primary" },
    { label: "Media files", value: counts.media, icon: Image, color: "from-primary to-primary" },
    { label: "Storage used", value: "0 MB", icon: Database, color: "from-primary to-emerald-deep" },
  ];

  return (
    <AdminLayout>
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Welcome back 👋</h1>
          <p className="mt-1 text-muted-foreground">Here's what's happening across DigiFalah.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.label} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${c.color} text-primary-foreground`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="font-display text-3xl font-bold">{c.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{c.label}</div>
              </div>
            );
          })}
        </div>

        <div>
          <h2 className="font-display text-xl font-bold">Quick actions</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Button asChild variant="outline" className="h-auto justify-start py-4">
              <Link to="/admin/blog/new"><PenSquare className="mr-2 h-4 w-4" /> New blog post</Link>
            </Button>
            <Button asChild variant="outline" className="h-auto justify-start py-4">
              <Link to="/admin/media/upload"><Upload className="mr-2 h-4 w-4" /> Upload media</Link>
            </Button>
            <Button asChild variant="outline" className="h-auto justify-start py-4">
              <Link to="/admin/seo/sitemap"><Map className="mr-2 h-4 w-4" /> View sitemap</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            <strong>Phase 1 complete.</strong> Blog, AI Writer, Media Manager, SEO tools and Backups are coming next — ask for them when you're ready.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}