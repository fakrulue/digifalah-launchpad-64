import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/seo/meta")({
  head: () => ({ meta: [{ title: "Meta Manager | DigiFalah Admin" }] }),
  component: MetaManager,
});

const PAGES = ["home", "about", "services", "pricing", "contact", "blog"];

function MetaManager() {
  const [active, setActive] = useState("home");
  const [data, setData] = useState<any>({ page_slug: "home", title: "", description: "", og_image: "", canonical_url: "", no_index: false });

  useEffect(() => {
    (async () => {
      const { data: row } = await supabase.from("seo_meta").select("*").eq("page_slug", active).maybeSingle();
      setData(row ?? { page_slug: active, title: "", description: "", og_image: "", canonical_url: "", no_index: false });
    })();
  }, [active]);

  const save = async () => {
    const { error } = await supabase.from("seo_meta").upsert({ ...data, page_slug: active }, { onConflict: "page_slug" });
    if (error) return toast.error(error.message);
    toast.success("Saved");
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="font-display text-3xl font-bold">Meta manager</h1>
        <div className="flex flex-wrap gap-2">
          {PAGES.map((p) => (
            <Button key={p} variant={active === p ? "default" : "outline"} size="sm" onClick={() => setActive(p)}>{p}</Button>
          ))}
        </div>
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="space-y-1.5"><Label>Title</Label><Input value={data.title ?? ""} onChange={(e) => setData({ ...data, title: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Description</Label><Textarea value={data.description ?? ""} onChange={(e) => setData({ ...data, description: e.target.value })} /></div>
          <MediaPicker value={data.og_image} onChange={(v) => setData({ ...data, og_image: v })} label="OG image" />
          <div className="space-y-1.5"><Label>Canonical URL</Label><Input value={data.canonical_url ?? ""} onChange={(e) => setData({ ...data, canonical_url: e.target.value })} /></div>
          <div className="flex items-center gap-3"><Switch checked={data.no_index} onCheckedChange={(v) => setData({ ...data, no_index: v })} /><Label>No-index this page</Label></div>
          <Button onClick={save}><Save className="mr-1 h-4 w-4" /> Save</Button>
        </div>
      </div>
    </AdminLayout>
  );
}
