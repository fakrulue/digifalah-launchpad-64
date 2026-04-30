import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface MediaFile {
  id: string;
  url: string;
  filename: string;
  alt_text: string | null;
}

export function MediaPicker({
  value,
  onChange,
  label = "Image",
}: {
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("media_files")
      .select("id,url,filename,alt_text")
      .order("created_at", { ascending: false })
      .limit(60);
    setFiles(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (open) load();
  }, [open]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("media").upload(path, file);
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("media").getPublicUrl(path);
      const { error: insErr, data: ins } = await supabase
        .from("media_files")
        .insert({
          filename: file.name,
          storage_path: path,
          url: pub.publicUrl,
          mime_type: file.type,
          size_bytes: file.size,
        })
        .select()
        .single();
      if (insErr) throw insErr;
      toast.success("Uploaded");
      onChange(ins.url);
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">{label}</div>
      <div className="flex items-start gap-3">
        {value ? (
          <img src={value} alt="" className="h-20 w-20 rounded-md border border-border object-cover" />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-md border border-dashed border-border bg-muted/30">
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="outline" size="sm">Choose from library</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Media library</DialogTitle>
              </DialogHeader>
              <div className="flex items-center gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm hover:bg-muted">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  Upload new
                  <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
                </label>
              </div>
              {loading ? (
                <div className="flex h-40 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>
              ) : (
                <div className="grid max-h-[60vh] grid-cols-4 gap-3 overflow-y-auto">
                  {files.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => { onChange(f.url); setOpen(false); }}
                      className="group relative aspect-square overflow-hidden rounded-md border border-border hover:ring-2 hover:ring-primary"
                    >
                      <img src={f.url} alt={f.alt_text ?? f.filename} className="h-full w-full object-cover" />
                    </button>
                  ))}
                  {files.length === 0 && <div className="col-span-4 py-10 text-center text-sm text-muted-foreground">No media yet — upload your first image.</div>}
                </div>
              )}
            </DialogContent>
          </Dialog>
          {value && (
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>Remove</Button>
          )}
          <Input
            placeholder="Or paste image URL"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-72"
          />
        </div>
      </div>
    </div>
  );
}
