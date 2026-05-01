import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const DEFAULT_MODEL = "google/gemini-2.5-flash";

async function getConfiguredModel(): Promise<string> {
  try {
    const { data } = await supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", "ai_model")
      .maybeSingle();
    const v = (data?.value as any)?.model;
    return typeof v === "string" && v.length > 0 ? v : DEFAULT_MODEL;
  } catch {
    return DEFAULT_MODEL;
  }
}

const inputSchema = z.object({
  topic: z.string().min(3).max(300),
  tone: z.string().optional(),
  language: z.enum(["en", "bn"]).default("en"),
  keywords: z.string().optional(),
});

export const generateBlogPost = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

    const langInstruction =
      data.language === "bn"
        ? "Write in natural, professional Bangla."
        : "Write in clear, engaging English.";

    const sys = `You are an expert SEO blog writer for DigiFalah, a Bangladesh digital marketing agency. ${langInstruction} Output strict JSON with keys: title, slug, excerpt, content (markdown), seo_title, seo_description.`;

    const user = `Write a 700-word SEO blog post.
Topic: ${data.topic}
Tone: ${data.tone ?? "professional, helpful"}
Target keywords: ${data.keywords ?? "(infer from topic)"}

Rules:
- title: under 70 chars
- slug: lowercase-kebab-case
- excerpt: under 160 chars
- content: markdown with ## headings, bullet points, and a call-to-action ending
- seo_title: under 60 chars
- seo_description: under 155 chars
Return ONLY valid JSON, no commentary.`;

    const model = await getConfiguredModel();
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: sys },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`AI gateway error ${res.status}: ${text.slice(0, 200)}`);
    }
    const json = await res.json();
    const content = json.choices?.[0]?.message?.content ?? "{}";
    try {
      return JSON.parse(content);
    } catch {
      throw new Error("AI returned non-JSON response");
    }
  });

export const testAiConnection = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ model: z.string().min(3).max(100) }).parse(data),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY missing");
    const start = Date.now();
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: data.model,
        messages: [
          { role: "system", content: "Reply with the single word: pong" },
          { role: "user", content: "ping" },
        ],
      }),
    });
    const ms = Date.now() - start;
    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) throw new Error("Rate limited (429). Try again in a moment.");
      if (res.status === 402) throw new Error("Out of credits (402). Add credits in Settings → Workspace → Usage.");
      throw new Error(`Gateway ${res.status}: ${text.slice(0, 200)}`);
    }
    const json = await res.json();
    const reply = json.choices?.[0]?.message?.content ?? "";
    return { ok: true, model: data.model, latencyMs: ms, reply };
  });
