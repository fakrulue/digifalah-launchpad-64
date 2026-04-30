import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings/keys")({
  head: () => ({ meta: [{ title: "API Keys | DigiFalah Admin" }] }),
  component: ApiKeys,
});

function ApiKeys() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", service: "", masked_value: "" });

  const load = async () => {
    const { data } = await supabase.from("api_keys").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.name.trim() || !form.service.trim()) return;
    const masked = form.masked_value ? `${form.masked_value.slice(0, 4)}…${form.masked_value.slice(-4)}` : null;
    const { error } = await supabase.from("api_keys").insert({ name: form.name, service: form.service, masked_value: masked });
    if (error) return toast.error(error.message);
    setForm({ name: "", service: "", masked_value: "" });
    load();
  };
  const del = async (id: string) => { await supabase.from("api_keys").delete().eq("id", id); load(); };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-2"><Key className="h-6 w-6 text-primary" /><h1 className="font-display text-3xl font-bold">API keys</h1></div>
        <p className="text-sm text-muted-foreground">Track third-party API key labels. Real secret values are stored securely in Lovable Cloud secrets.</p>
        <div className="rounded-xl border border-border bg-card p-4 grid gap-2 sm:grid-cols-4">
          <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Service" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} />
          <Input placeholder="Value (will be masked)" value={form.masked_value} onChange={(e) => setForm({ ...form, masked_value: e.target.value })} />
          <Button onClick={add}><Plus className="mr-1 h-4 w-4" /> Add</Button>
        </div>
        <div className="rounded-xl border border-border bg-card divide-y divide-border">
          {items.map((k) => (
            <div key={k.id} className="flex items-center justify-between p-4">
              <div>
                <div className="font-medium">{k.name} <span className="text-xs text-muted-foreground">· {k.service}</span></div>
                <div className="text-xs font-mono text-muted-foreground">{k.masked_value ?? "—"}</div>
              </div>
              <Button size="icon" variant="ghost" onClick={() => del(k.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
          {items.length === 0 && <div className="p-6 text-center text-sm text-muted-foreground">No keys tracked.</div>}
        </div>
      </div>
    </AdminLayout>
  );
}
