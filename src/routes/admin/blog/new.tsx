import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateBlogPost } from "@/server/ai.functions";
import { Sparkles, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { slugify } from "@/lib/slug";
import { MediaPicker } from "@/components/admin/MediaPicker";

export const Route = createFileRoute("/admin/blog/new")({
  head: () => ({ meta: [{ title: "AI Writer | DigiFalah Admin" }] }),
  component: AIWriter,
});

function AIWriter() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional, helpful");
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const [keywords, setKeywords] = useState("");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<any>(null);
  const [cover, setCover] = useState("");

  const generate = async () => {
    if (!topic.trim()) return toast.error("Enter a topic");
    setGenerating(true);
    try {
      const result = await generateBlogPost({ data: { topic, tone, language, keywords } });
      setDraft(result);
      toast.success("Draft generated");
    } catch (e: any) {
      toast.error(e.message ?? "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const save = async (status: "draft" | "published") => {
    if (!draft) return;
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const slug = slugify(draft.slug || draft.title);
      const { data, error } = await supabase.from("blog_posts").insert({
        author_id: user?.id,
        title: draft.title,
        slug,
        excerpt: draft.excerpt,
        content: draft.content,
        cover_image: cover || null,
        seo_title: draft.seo_title,
        seo_description: draft.seo_description,
        ai_generated: true,
        status,
        published_at: status === "published" ? new Date().toISOString() : null,
      }).select().single();
      if (error) throw error;
      toast.success(`Saved as ${status}`);
      navigate({ to: "/admin/blog/$id", params: { id: data.id } });
    } catch (e: any) {
      toast.error(e.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3 w-3" /> AI Writer
          </div>
          <h1 className="font-display text-3xl font-bold">Generate a blog post</h1>
          <p className="text-sm text-muted-foreground">Powered by Lovable AI Gateway</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <div className="space-y-1.5">
            <Label>Topic</Label>
            <Input placeholder="e.g. SEO tips for Bangladeshi e-commerce stores" value={topic} onChange={(e) => setTopic(e.target.value)} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Language</Label>
              <Select value={language} onValueChange={(v) => setLanguage(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="bn">Bangla</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Tone</Label>
              <Input value={tone} onChange={(e) => setTone(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Target keywords (comma-separated)</Label>
            <Input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="seo bangladesh, digital marketing dhaka" />
          </div>
          <Button onClick={generate} disabled={generating}>
            {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Generate draft
          </Button>
        </div>

        {draft && (
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="space-y-1.5"><Label>Title</Label><Input value={draft.title ?? ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Excerpt</Label><Textarea value={draft.excerpt ?? ""} onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })} /></div>
            <MediaPicker value={cover} onChange={setCover} label="Cover image" />
            <div className="space-y-1.5"><Label>Content (markdown)</Label><Textarea rows={16} value={draft.content ?? ""} onChange={(e) => setDraft({ ...draft, content: e.target.value })} className="font-mono text-xs" /></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>SEO title</Label><Input value={draft.seo_title ?? ""} onChange={(e) => setDraft({ ...draft, seo_title: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>SEO description</Label><Input value={draft.seo_description ?? ""} onChange={(e) => setDraft({ ...draft, seo_description: e.target.value })} /></div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => save("draft")} disabled={saving}><Save className="mr-1 h-4 w-4" /> Save draft</Button>
              <Button onClick={() => save("published")} disabled={saving}>Publish now</Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
