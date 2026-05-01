import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Sparkles, Loader2, CheckCircle2, XCircle, Save } from "lucide-react";
import { toast } from "sonner";
import { testAiConnection } from "@/server/ai.functions";

export const Route = createFileRoute("/admin/settings/ai")({
  head: () => ({ meta: [{ title: "AI Settings | DigiFalah Admin" }] }),
  component: AISettings;
});

const MODELS = [
  { value: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash — fast, balanced (default)" },
  { value: "google/gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite — cheapest, fastest" },
  { value: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro — strongest reasoning" },
  { value: "google/gemini-3-flash-preview", label: "Gemini 3 Flash (preview)" },
  { value: "google/gemini-3.1-pro-preview", label: "Gemini 3.1 Pro (preview)" },
];

const DEFAULT_MODEL = "google/gemini-2.5-flash";

function AISettings() {
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "ai_model")
        .maybeSingle();
      const v = (data?.value as any)?.model;
      if (typeof v === "string" && v.length > 0) setModel(v);
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .upsert(
        { key: "ai_model", value: { model }, is_public: false },
        { onConflict: "key" },
      );
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("AI model saved");
  };

  const test = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const r = await testAiConnection({ data: { model } });
      setTestResult({
        ok: true,
        msg: `OK in ${r.latencyMs}ms — reply: "${(r.reply || "").trim().slice(0, 80)}"`,
      });
      toast.success("Connection verified");
    } catch (e: any) {
      setTestResult({ ok: false, msg: e.message ?? "Test failed" });
      toast.error(e.message ?? "Test failed");
    } finally {
      setTesting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3 w-3" /> Gemini API
          </div>
          <h1 className="font-display text-3xl font-bold">AI configuration</h1>
          <p className="text-sm text-muted-foreground">
            Powered by Lovable AI Gateway. Your <code>LOVABLE_API_KEY</code> is auto-configured —
            no key entry needed. Pick which Gemini model the AI Writer should use.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="space-y-1.5">
            <Label>Active model</Label>
            <Select value={model} onValueChange={setModel} disabled={loading}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {MODELS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Used by the AI Writer when generating blog drafts.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={save} disabled={saving || loading}>
              {saving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />}
              Save
            </Button>
            <Button variant="outline" onClick={test} disabled={testing || loading}>
              {testing ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1 h-4 w-4" />}
              Test connection
            </Button>
          </div>

          {testResult && (
            <div
              className={`flex items-start gap-2 rounded-md border p-3 text-sm ${
                testResult.ok
                  ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300"
                  : "border-destructive/30 bg-destructive/5 text-destructive"
              }`}
            >
              {testResult.ok ? <CheckCircle2 className="mt-0.5 h-4 w-4" /> : <XCircle className="mt-0.5 h-4 w-4" />}
              <span>{testResult.msg}</span>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-4 text-xs text-muted-foreground">
          <strong className="text-foreground">Tip:</strong> Flash models are fastest and cheapest.
          Use Pro only when you need deeper reasoning (long-form research, complex SEO briefs).
        </div>
      </div>
    </AdminLayout>
  );
}