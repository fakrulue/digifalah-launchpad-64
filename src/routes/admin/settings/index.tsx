import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings/")({
  head: () => ({ meta: [{ title: "Settings | DigiFalah Admin" }] }),
  component: GeneralSettings,
});

function GeneralSettings() {
  const [vals, setVals] = useState<Record<string, any>>({
    site_name: "DigiFalah",
    tagline: "Bangladesh's AI-powered digital marketing agency",
    contact_email: "hello@digifalah.com",
    whatsapp: "",
    address: "",
  });

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_settings").select("*").in("key", Object.keys(vals));
      const next = { ...vals };
      (data ?? []).forEach((r: any) => { next[r.key] = r.value?.value ?? r.value; });
      setVals(next);
    })();
  }, []);

  const save = async () => {
    const rows = Object.entries(vals).map(([key, value]) => ({ key, value: { value }, is_public: true }));
    const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
    if (error) return toast.error(error.message);
    toast.success("Saved");
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="font-display text-3xl font-bold">General settings</h1>
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          {Object.entries(vals).map(([k, v]) => (
            <div key={k} className="space-y-1.5">
              <Label className="capitalize">{k.replace(/_/g, " ")}</Label>
              {k === "address" ? (
                <Textarea value={v ?? ""} onChange={(e) => setVals({ ...vals, [k]: e.target.value })} />
              ) : (
                <Input value={v ?? ""} onChange={(e) => setVals({ ...vals, [k]: e.target.value })} />
              )}
            </div>
          ))}
          <Button onClick={save}><Save className="mr-1 h-4 w-4" /> Save</Button>
        </div>
      </div>
    </AdminLayout>
  );
}
