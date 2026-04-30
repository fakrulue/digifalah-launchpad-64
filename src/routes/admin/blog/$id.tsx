import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { slugify } from "@/lib/slug";

export const Route = createFileRoute("/admin/blog/$id")({
  head: () => ({ meta: [{ title: "Edit Post | DigiFalah Admin" }] }),
  component: EditPost,
});

function EditPost() {
  const { id } = Route.useParams();
  const [post, setPost] = useState<any>(null);
  const [cats, setCats] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const [{ data: p }, { data: c }] = await Promise.all([
        supabase.from("blog_posts").select("*").eq("id", id).single(),
        supabase.from("blog_categories").select("*").order("name"),
      ]);
      setPost(p);
      setCats(c ?? []);
    })();
  }, [id]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("blog_posts").update({
      title: post.title,
      slug: slugify(post.slug || post.title),
      excerpt: post.excerpt,
      content: post.content,
      cover_image: post.cover_image,
      category_id: post.category_id || null,
      status: post.status,
      seo_title: post.seo_title,
      seo_description: post.seo_description,
      published_at: post.status === "published" && !post.published_at ? new Date().toISOString() : post.published_at,
    }).eq("id", id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
  };

  if (!post) return <AdminLayout><div className="flex h-40 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mx-auto max-w-3xl space-y-4">
        <Link to="/admin/blog" className="text-xs text-muted-foreground hover:underline">← All posts</Link>
        <h1 className="font-display text-2xl font-bold">Edit post</h1>
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="space-y-1.5"><Label>Title</Label><Input value={post.title ?? ""} onChange={(e) => setPost({ ...post, title: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Slug</Label><Input value={post.slug ?? ""} onChange={(e) => setPost({ ...post, slug: e.target.value })} /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={post.status} onValueChange={(v) => setPost({ ...post, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={post.category_id ?? "none"} onValueChange={(v) => setPost({ ...post, category_id: v === "none" ? null : v })}>
                <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {cats.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5"><Label>Excerpt</Label><Textarea value={post.excerpt ?? ""} onChange={(e) => setPost({ ...post, excerpt: e.target.value })} /></div>
          <MediaPicker value={post.cover_image} onChange={(url) => setPost({ ...post, cover_image: url })} label="Cover image" />
          <div className="space-y-1.5"><Label>Content (markdown)</Label><Textarea rows={16} value={post.content ?? ""} onChange={(e) => setPost({ ...post, content: e.target.value })} className="font-mono text-xs" /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>SEO title</Label><Input value={post.seo_title ?? ""} onChange={(e) => setPost({ ...post, seo_title: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>SEO description</Label><Input value={post.seo_description ?? ""} onChange={(e) => setPost({ ...post, seo_description: e.target.value })} /></div>
          </div>
          <Button onClick={save} disabled={saving}>{saving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />} Save</Button>
        </div>
      </div>
    </AdminLayout>
  );
}
