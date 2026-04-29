import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import type { Tables } from "@/integrations/supabase/types";
import { Loader2, Inbox } from "lucide-react";

export const Route = createFileRoute("/admin/leads")({
  head: () => ({ meta: [{ title: "Leads | DigiFalah Admin" }] }),
  component: LeadsPage,
});

function LeadsPage() {
  const [leads, setLeads] = useState<Tables<"leads">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      setLeads(data ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <AdminLayout>
      <div className="mx-auto max-w-6xl">
        <h1 className="font-display text-3xl font-bold">Leads</h1>
        <p className="mt-1 text-muted-foreground">All form submissions from your website.</p>

        <div className="mt-8 rounded-2xl border border-border bg-card shadow-soft">
          {loading ? (
            <div className="flex items-center justify-center p-12"><Loader2 className="h-5 w-5 animate-spin" /></div>
          ) : leads.length === 0 ? (
            <div className="p-12 text-center">
              <Inbox className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-muted-foreground">No leads yet. Try submitting the contact form on the website.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/50 text-left">
                <tr>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Phone</th>
                  <th className="p-4 font-medium">Business</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="border-b border-border last:border-0">
                    <td className="p-4 font-medium">{l.name}</td>
                    <td className="p-4 text-muted-foreground">{l.phone}</td>
                    <td className="p-4 text-muted-foreground">{l.business_type ?? "—"}</td>
                    <td className="p-4"><Badge variant="outline">{l.status}</Badge></td>
                    <td className="p-4 text-muted-foreground">{new Date(l.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}