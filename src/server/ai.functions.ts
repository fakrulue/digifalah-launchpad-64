import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
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
