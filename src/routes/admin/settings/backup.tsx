import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Database, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings/backup")({
  head: () => ({ meta: [{ title: "Backups | DigiFalah Admin" }] }),
  component: Backups,
});

function Backups() {
  const [items, setItems] = useState<any[]>([]);
  const [running, setRunning] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("backups").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const run = async () => {
    setRunning(true);
    try {
      const dump: any = {};
      const results = await Promise.all([
        supabase.from("page_blocks").select("*"),
        supabase.from("blog_posts").select("*"),
        supabase.from("blog_categories").select("*"),
        supabase.from("leads").select("*"),
        supabase.from("media_files").select("*"),
        supabase.from("seo_keywords").select("*"),
        supabase.from("seo_meta").select("*"),
        supabase.from("site_settings").select("*"),
      ]);
      const keys = ["page_blocks","blog_posts","blog_categories","leads","media_files","seo_keywords","seo_meta","site_settings"];
      results.forEach((r, i) => { dump[keys[i]] = r.data; });
      const blob = new Blob([JSON.stringify(dump, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const filename = `digifalah-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.href = url; a.download = filename; a.click();
      URL.revokeObjectURL(url);
      await supabase.from("backups").insert({ filename, backup_type: "database", size_bytes: blob.size, status: "completed" });
      toast.success("Backup downloaded");
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setRunning(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-2"><Database className="h-6 w-6 text-primary" /><h1 className="font-display text-3xl font-bold">Backups</h1></div>
        <Button onClick={run} disabled={running}>
          {running ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Download className="mr-1 h-4 w-4" />}
          Run database backup
        </Button>
        <div className="rounded-xl border border-border bg-card divide-y divide-border">
          {items.map((b) => (
            <div key={b.id} className="flex items-center justify-between p-4">
              <div>
                <div className="font-medium">{b.filename}</div>
                <div className="text-xs text-muted-foreground">{new Date(b.created_at).toLocaleString()} • {b.size_bytes ? `${(b.size_bytes / 1024).toFixed(1)} KB` : ""}</div>
              </div>
              <span className="text-xs text-primary">{b.status}</span>
            </div>
          ))}
          {items.length === 0 && <div className="p-6 text-center text-sm text-muted-foreground">No backups yet.</div>}
        </div>
      </div>
    </AdminLayout>
  );
}
