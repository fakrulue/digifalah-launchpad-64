import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Trash2, Upload, Loader2, Copy } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/media/")({
  head: () => ({ meta: [{ title: "Media Library | DigiFalah Admin" }] }),
  component: MediaList,
});

function MediaList() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("media_files").select("*").order("created_at", { ascending: false });
    setFiles(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const del = async (file: any) => {
    if (!confirm("Delete this file?")) return;
    await supabase.storage.from("media").remove([file.storage_path]);
    await supabase.from("media_files").delete().eq("id", file.id);
    toast.success("Deleted");
    load();
  };
  const copy = (url: string) => { navigator.clipboard.writeText(url); toast.success("URL copied"); };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Media library</h1>
            <p className="text-sm text-muted-foreground">{files.length} files</p>
          </div>
          <Button asChild><Link to="/admin/media/upload"><Upload className="mr-1 h-4 w-4" /> Upload</Link></Button>
        </div>
        {loading ? (
          <div className="flex h-40 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {files.map((f) => (
              <div key={f.id} className="group relative overflow-hidden rounded-xl border border-border bg-card">
                <img src={f.url} alt={f.alt_text ?? f.filename} className="aspect-square w-full object-cover" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60 opacity-0 transition group-hover:opacity-100">
                  <Button size="sm" variant="secondary" onClick={() => copy(f.url)}><Copy className="mr-1 h-3 w-3" /> URL</Button>
                  <Button size="sm" variant="destructive" onClick={() => del(f)}><Trash2 className="mr-1 h-3 w-3" /> Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
