import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/settings/users")({
  head: () => ({ meta: [{ title: "Users & Roles | DigiFalah Admin" }] }),
  component: UsersRoles,
});

function UsersRoles() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const [{ data: profs }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("*"),
        supabase.from("user_roles").select("*"),
      ]);
      const merged = (profs ?? []).map((p: any) => ({
        ...p,
        roles: (roles ?? []).filter((r: any) => r.user_id === p.id).map((r: any) => r.role),
      }));
      setRows(merged);
    })();
  }, []);

  return (
    <AdminLayout>
      <div className="mx-auto max-w-3xl space-y-4">
        <h1 className="font-display text-3xl font-bold">Users & roles</h1>
        <p className="text-sm text-muted-foreground">View all registered users. Assign roles via the database for now.</p>
        <div className="rounded-xl border border-border bg-card divide-y divide-border">
          {rows.map((r) => (
            <div key={r.id} className="flex items-center justify-between p-4">
              <div>
                <div className="font-medium">{r.full_name || "Unnamed"}</div>
                <div className="text-xs text-muted-foreground">{r.id}</div>
              </div>
              <div className="flex gap-1">
                {r.roles.length ? r.roles.map((role: string) => <Badge key={role}>{role}</Badge>) : <Badge variant="secondary">no role</Badge>}
              </div>
            </div>
          ))}
          {rows.length === 0 && <div className="p-6 text-center text-sm text-muted-foreground">No users yet.</div>}
        </div>
      </div>
    </AdminLayout>
  );
}
