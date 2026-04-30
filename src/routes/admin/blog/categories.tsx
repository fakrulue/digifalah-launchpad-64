import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { slugify } from "@/lib/slug";

export const Route = createFileRoute("/admin/blog/categories")({
  head: () => ({ meta: [{ title: "Categories | DigiFalah Admin" }] }),
  component: Categories,
});

function Categories() {
  const [cats, setCats] = useState<any[]>([]);
  const [name, setName] = useState("");

  const load = async () => {
    const { data } = await supabase.from("blog_categories").select("*").order("name");
    setCats(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!name.trim()) return;
    const { error } = await supabase.from("blog_categories").insert({ name, slug: slugify(name) });
    if (error) return toast.error(error.message);
    setName("");
    load();
  };
  const del = async (id: string) => {
    const { error } = await supabase.from("blog_categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="font-display text-3xl font-bold">Blog categories</h1>
        <div className="flex gap-2">
          <Input placeholder="New category name" value={name} onChange={(e) => setName(e.target.value)} />
          <Button onClick={add}><Plus className="mr-1 h-4 w-4" /> Add</Button>
        </div>
        <div className="rounded-xl border border-border bg-card divide-y divide-border">
          {cats.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-3">
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-muted-foreground">/{c.slug}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => del(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
          {cats.length === 0 && <div className="p-6 text-center text-sm text-muted-foreground">No categories yet.</div>}
        </div>
      </div>
    </AdminLayout>
  );
}
