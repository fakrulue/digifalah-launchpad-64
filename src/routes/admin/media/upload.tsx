import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/media/upload")({
  head: () => ({ meta: [{ title: "Upload Media | DigiFalah Admin" }] }),
  component: UploadPage,
});

function UploadPage() {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files ?? []);
    if (!list.length) return;
    setUploading(true);
    let done = 0;
    for (const file of list) {
      try {
        const ext = file.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage.from("media").upload(path, file);
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from("media").getPublicUrl(path);
        const { error: insErr } = await supabase.from("media_files").insert({
          filename: file.name, storage_path: path, url: pub.publicUrl,
          mime_type: file.type, size_bytes: file.size,
        });
        if (insErr) throw insErr;
        done++; setProgress(Math.round((done / list.length) * 100));
      } catch (err: any) {
        toast.error(`${file.name}: ${err.message ?? "upload failed"}`);
      }
    }
    setUploading(false);
    if (done > 0) {
      toast.success(`Uploaded ${done} file(s)`);
      navigate({ to: "/admin/media" });
    }
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="font-display text-3xl font-bold">Upload media</h1>
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card p-12 text-center hover:border-primary">
          {uploading ? <Loader2 className="h-10 w-10 animate-spin text-primary" /> : <Upload className="h-10 w-10 text-muted-foreground" />}
          <div className="mt-4 font-medium">{uploading ? `Uploading… ${progress}%` : "Click to choose files"}</div>
          <div className="mt-1 text-xs text-muted-foreground">Images, PDFs, videos — multi-select supported</div>
          <input type="file" multiple className="hidden" onChange={handle} disabled={uploading} />
        </label>
      </div>
    </AdminLayout>
  );
}
