import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { ArrowUp, ArrowDown, Trash2, Plus, Save, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/builder/$slug")({
  head: ({ params }) => ({ meta: [{ title: `Edit ${params.slug} | Visual Builder` }] }),
  component: PageEditor,
});

type BlockType = "hero" | "text" | "image" | "cta" | "features" | "html";

interface Block {
  id: string;
  page_slug: string;
  block_type: BlockType;
  position: number;
  content: any;
  is_visible: boolean;
}

const BLOCK_TEMPLATES: Record<BlockType, any> = {
  hero: { eyebrow: "", title: "Hero title", subtitle: "Subtitle", cta_label: "Get started", cta_url: "/contact" },
  text: { heading: "Section heading", body: "Write your content here..." },
  image: { url: "", alt: "", caption: "" },
  cta: { title: "Ready to grow?", subtitle: "Talk to us today.", cta_label: "Contact us", cta_url: "/contact" },
  features: { heading: "Why us", items: [{ title: "Feature 1", description: "..." }, { title: "Feature 2", description: "..." }, { title: "Feature 3", description: "..." }] },
  html: { html: "<p>Custom HTML</p>" },
};

function PageEditor() {
  const { slug } = Route.useParams();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("page_blocks")
      .select("*")
      .eq("page_slug", slug)
      .order("position", { ascending: true });
    if (error) toast.error(error.message);
    setBlocks((data as Block[]) ?? []);
    setLoading(false);
    setDirty(false);
  };

  useEffect(() => { load(); }, [slug]);

  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: `tmp-${Date.now()}`,
      page_slug: slug,
      block_type: type,
      position: blocks.length,
      content: structuredClone(BLOCK_TEMPLATES[type]),
      is_visible: true,
    };
    setBlocks([...blocks, newBlock]);
    setDirty(true);
  };

  const updateBlock = (id: string, patch: Partial<Block>) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)));
    setDirty(true);
  };

  const updateContent = (id: string, content: any) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, content } : b)));
    setDirty(true);
  };

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...blocks];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setBlocks(next.map((b, i) => ({ ...b, position: i })));
    setDirty(true);
  };

  const remove = (id: string) => {
    if (!confirm("Delete this block?")) return;
    setBlocks(blocks.filter((b) => b.id !== id).map((b, i) => ({ ...b, position: i })));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      // Delete existing blocks for this page, then insert all
      const { error: delErr } = await supabase.from("page_blocks").delete().eq("page_slug", slug);
      if (delErr) throw delErr;
      if (blocks.length > 0) {
        const payload = blocks.map((b, i) => ({
          page_slug: slug,
          block_type: b.block_type,
          position: i,
          content: b.content,
          is_visible: b.is_visible,
        }));
        const { error: insErr } = await supabase.from("page_blocks").insert(payload);
        if (insErr) throw insErr;
      }
      toast.success("Page saved");
      await load();
    } catch (e: any) {
      toast.error(e.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <Link to="/admin/builder" className="text-xs text-muted-foreground hover:underline">← All pages</Link>
            <h1 className="font-display text-2xl font-bold capitalize">Editing: {slug}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <a href={slug === "home" ? "/" : `/${slug}`} target="_blank" rel="noreferrer">
                <Eye className="mr-1 h-4 w-4" /> Preview
              </a>
            </Button>
            <Button onClick={save} disabled={!dirty || saving} size="sm">
              {saving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />}
              Save
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : (
          <>
            <div className="space-y-4">
              {blocks.map((b, idx) => (
                <BlockEditor
                  key={b.id}
                  block={b}
                  onChange={(c) => updateContent(b.id, c)}
                  onToggleVisible={(v) => updateBlock(b.id, { is_visible: v })}
                  onUp={() => move(idx, -1)}
                  onDown={() => move(idx, 1)}
                  onDelete={() => remove(b.id)}
                  isFirst={idx === 0}
                  isLast={idx === blocks.length - 1}
                />
              ))}
              {blocks.length === 0 && (
                <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                  No blocks yet — add your first block below.
                </div>
              )}
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <div className="mb-2 text-sm font-semibold">Add a block</div>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(BLOCK_TEMPLATES) as BlockType[]).map((t) => (
                  <Button key={t} variant="outline" size="sm" onClick={() => addBlock(t)}>
                    <Plus className="mr-1 h-3 w-3" /> {t}
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

function BlockEditor({
  block, onChange, onToggleVisible, onUp, onDown, onDelete, isFirst, isLast,
}: {
  block: Block;
  onChange: (c: any) => void;
  onToggleVisible: (v: boolean) => void;
  onUp: () => void;
  onDown: () => void;
  onDelete: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const c = block.content || {};
  const set = (key: string, v: any) => onChange({ ...c, [key]: v });

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold uppercase text-primary">{block.block_type}</span>
          <Switch checked={block.is_visible} onCheckedChange={onToggleVisible} />
          <span className="text-xs text-muted-foreground">{block.is_visible ? "Visible" : "Hidden"}</span>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={onUp} disabled={isFirst}><ArrowUp className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={onDown} disabled={isLast}><ArrowDown className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={onDelete}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </div>
      </div>

      <div className="space-y-3">
        {block.block_type === "hero" && (
          <>
            <Field label="Eyebrow"><Input value={c.eyebrow ?? ""} onChange={(e) => set("eyebrow", e.target.value)} /></Field>
            <Field label="Title"><Input value={c.title ?? ""} onChange={(e) => set("title", e.target.value)} /></Field>
            <Field label="Subtitle"><Textarea value={c.subtitle ?? ""} onChange={(e) => set("subtitle", e.target.value)} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="CTA label"><Input value={c.cta_label ?? ""} onChange={(e) => set("cta_label", e.target.value)} /></Field>
              <Field label="CTA URL"><Input value={c.cta_url ?? ""} onChange={(e) => set("cta_url", e.target.value)} /></Field>
            </div>
          </>
        )}
        {block.block_type === "text" && (
          <>
            <Field label="Heading"><Input value={c.heading ?? ""} onChange={(e) => set("heading", e.target.value)} /></Field>
            <Field label="Body"><Textarea rows={6} value={c.body ?? ""} onChange={(e) => set("body", e.target.value)} /></Field>
          </>
        )}
        {block.block_type === "image" && (
          <>
            <MediaPicker value={c.url} onChange={(url) => set("url", url)} label="Image" />
            <Field label="Alt text"><Input value={c.alt ?? ""} onChange={(e) => set("alt", e.target.value)} /></Field>
            <Field label="Caption"><Input value={c.caption ?? ""} onChange={(e) => set("caption", e.target.value)} /></Field>
          </>
        )}
        {block.block_type === "cta" && (
          <>
            <Field label="Title"><Input value={c.title ?? ""} onChange={(e) => set("title", e.target.value)} /></Field>
            <Field label="Subtitle"><Input value={c.subtitle ?? ""} onChange={(e) => set("subtitle", e.target.value)} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="CTA label"><Input value={c.cta_label ?? ""} onChange={(e) => set("cta_label", e.target.value)} /></Field>
              <Field label="CTA URL"><Input value={c.cta_url ?? ""} onChange={(e) => set("cta_url", e.target.value)} /></Field>
            </div>
          </>
        )}
        {block.block_type === "features" && (
          <>
            <Field label="Heading"><Input value={c.heading ?? ""} onChange={(e) => set("heading", e.target.value)} /></Field>
            <div className="space-y-2">
              {(c.items ?? []).map((it: any, i: number) => (
                <div key={i} className="rounded-md border border-border p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold">Feature {i + 1}</span>
                    <Button variant="ghost" size="sm" onClick={() => set("items", c.items.filter((_: any, j: number) => j !== i))}>Remove</Button>
                  </div>
                  <Input className="mb-2" placeholder="Title" value={it.title ?? ""} onChange={(e) => {
                    const items = [...c.items]; items[i] = { ...items[i], title: e.target.value }; set("items", items);
                  }} />
                  <Textarea placeholder="Description" value={it.description ?? ""} onChange={(e) => {
                    const items = [...c.items]; items[i] = { ...items[i], description: e.target.value }; set("items", items);
                  }} />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => set("items", [...(c.items ?? []), { title: "", description: "" }])}>
                <Plus className="mr-1 h-3 w-3" /> Add feature
              </Button>
            </div>
          </>
        )}
        {block.block_type === "html" && (
          <Field label="HTML"><Textarea rows={8} value={c.html ?? ""} onChange={(e) => set("html", e.target.value)} className="font-mono text-xs" /></Field>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
