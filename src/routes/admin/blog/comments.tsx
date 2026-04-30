import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/blog/comments")({
  head: () => ({ meta: [{ title: "Comments | DigiFalah Admin" }] }),
  component: Comments,
});

function Comments() {
  const [items, setItems] = useState<any[]>([]);

  const load = async () => {
    const { data } = await supabase.from("blog_comments").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const approve = async (id: string) => {
    await supabase.from("blog_comments").update({ approved: true }).eq("id", id);
    toast.success("Approved");
    load();
  };
  const del = async (id: string) => {
    await supabase.from("blog_comments").delete().eq("id", id);
    load();
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-3xl space-y-4">
        <h1 className="font-display text-3xl font-bold">Comments</h1>
        <div className="space-y-3">
          {items.map((c) => (
            <div key={c.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{c.name} {c.approved ? <Badge>Approved</Badge> : <Badge variant="secondary">Pending</Badge>}</div>
                  <div className="text-xs text-muted-foreground">{c.email} • {new Date(c.created_at).toLocaleString()}</div>
                </div>
                <div className="flex gap-1">
                  {!c.approved && <Button size="icon" variant="ghost" onClick={() => approve(c.id)}><Check className="h-4 w-4 text-primary" /></Button>}
                  <Button size="icon" variant="ghost" onClick={() => del(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
              <p className="mt-2 text-sm">{c.content}</p>
            </div>
          ))}
          {items.length === 0 && <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No comments yet.</div>}
        </div>
      </div>
    </AdminLayout>
  );
}
