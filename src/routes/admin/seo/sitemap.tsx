import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Copy, Map } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/seo/sitemap")({
  head: () => ({ meta: [{ title: "Sitemap | DigiFalah Admin" }] }),
  component: Sitemap,
});

function Sitemap() {
  const [urls, setUrls] = useState<string[]>([]);
  useEffect(() => {
    (async () => {
      const base = ["/", "/about", "/services", "/pricing", "/contact", "/blog", "/privacy", "/terms"];
      const { data } = await supabase.from("blog_posts").select("slug").eq("status", "published");
      setUrls([...base, ...(data ?? []).map((p) => `/blog/${p.slug}`)]);
    })();
  }, []);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>https://digifalah.com${u}</loc></url>`).join("\n")}\n</urlset>`;

  return (
    <AdminLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-2"><Map className="h-6 w-6 text-primary" /><h1 className="font-display text-3xl font-bold">Sitemap</h1></div>
        <p className="text-sm text-muted-foreground">{urls.length} URLs included.</p>
        <Button variant="outline" onClick={() => { navigator.clipboard.writeText(xml); toast.success("Copied"); }}><Copy className="mr-1 h-4 w-4" /> Copy XML</Button>
        <pre className="overflow-auto rounded-xl border border-border bg-card p-4 text-xs">{xml}</pre>
      </div>
    </AdminLayout>
  );
}
