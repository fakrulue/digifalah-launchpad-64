import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PenSquare, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/blog/")({
  head: () => ({ meta: [{ title: "All Posts | DigiFalah Admin" }] }),
  component: PostsList,
});

function PostsList() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setPosts(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const del = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Blog posts</h1>
            <p className="text-sm text-muted-foreground">Manage your articles</p>
          </div>
          <Button asChild><Link to="/admin/blog/new"><Plus className="mr-1 h-4 w-4" /> New (AI Writer)</Link></Button>
        </div>
        {loading ? (
          <div className="flex h-40 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : (
          <div className="rounded-xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>AI</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.title}</TableCell>
                    <TableCell><Badge variant={p.status === "published" ? "default" : "secondary"}>{p.status}</Badge></TableCell>
                    <TableCell>{p.ai_generated ? "✨" : "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="icon"><Link to="/admin/blog/$id" params={{ id: p.id }}><PenSquare className="h-4 w-4" /></Link></Button>
                      <Button variant="ghost" size="icon" onClick={() => del(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
                {posts.length === 0 && <TableRow><TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">No posts yet — create one with the AI Writer.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
