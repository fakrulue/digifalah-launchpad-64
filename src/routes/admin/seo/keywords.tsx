import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/seo/keywords")({
  head: () => ({ meta: [{ title: "Keywords | DigiFalah Admin" }] }),
  component: Keywords,
});

function Keywords() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ keyword: "", target_url: "", search_volume: "", current_rank: "" });

  const load = async () => {
    const { data } = await supabase.from("seo_keywords").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.keyword.trim()) return;
    const { error } = await supabase.from("seo_keywords").insert({
      keyword: form.keyword,
      target_url: form.target_url || null,
      search_volume: form.search_volume ? parseInt(form.search_volume) : null,
      current_rank: form.current_rank ? parseInt(form.current_rank) : null,
    });
    if (error) return toast.error(error.message);
    setForm({ keyword: "", target_url: "", search_volume: "", current_rank: "" });
    load();
  };
  const del = async (id: string) => { await supabase.from("seo_keywords").delete().eq("id", id); load(); };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        <h1 className="font-display text-3xl font-bold">Keyword tracker</h1>
        <div className="rounded-xl border border-border bg-card p-4 grid gap-2 sm:grid-cols-5">
          <Input placeholder="Keyword" value={form.keyword} onChange={(e) => setForm({ ...form, keyword: e.target.value })} className="sm:col-span-2" />
          <Input placeholder="Target URL" value={form.target_url} onChange={(e) => setForm({ ...form, target_url: e.target.value })} />
          <Input placeholder="Volume" type="number" value={form.search_volume} onChange={(e) => setForm({ ...form, search_volume: e.target.value })} />
          <div className="flex gap-2">
            <Input placeholder="Rank" type="number" value={form.current_rank} onChange={(e) => setForm({ ...form, current_rank: e.target.value })} />
            <Button onClick={add}><Plus className="h-4 w-4" /></Button>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Keyword</TableHead><TableHead>Target</TableHead><TableHead>Volume</TableHead><TableHead>Rank</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {items.map((k) => (
                <TableRow key={k.id}>
                  <TableCell className="font-medium">{k.keyword}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{k.target_url}</TableCell>
                  <TableCell>{k.search_volume ?? "—"}</TableCell>
                  <TableCell>{k.current_rank ?? "—"}</TableCell>
                  <TableCell><Button size="icon" variant="ghost" onClick={() => del(k.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                </TableRow>
              ))}
              {items.length === 0 && <TableRow><TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">No keywords tracked yet.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
