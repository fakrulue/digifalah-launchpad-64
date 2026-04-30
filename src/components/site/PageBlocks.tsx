import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "@tanstack/react-router";

interface Block {
  id: string;
  block_type: string;
  position: number;
  content: any;
  is_visible: boolean;
}

export function PageBlocks({ pageSlug, fallback }: { pageSlug: string; fallback?: React.ReactNode }) {
  const [blocks, setBlocks] = useState<Block[] | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("page_blocks")
        .select("*")
        .eq("page_slug", pageSlug)
        .eq("is_visible", true)
        .order("position", { ascending: true });
      setBlocks((data as Block[]) ?? []);
    })();
  }, [pageSlug]);

  if (blocks === null) return null;
  if (blocks.length === 0) return <>{fallback}</>;

  return (
    <>
      {blocks.map((b) => (
        <BlockRenderer key={b.id} block={b} />
      ))}
    </>
  );
}

function BlockRenderer({ block }: { block: Block }) {
  const c = block.content || {};
  switch (block.block_type) {
    case "hero":
      return (
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-deep via-primary to-emerald-deep py-20 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            {c.eyebrow && <div className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">{c.eyebrow}</div>}
            <h1 className="font-display text-4xl font-bold md:text-6xl">{c.title}</h1>
            {c.subtitle && <p className="mx-auto mt-4 max-w-2xl text-lg opacity-90">{c.subtitle}</p>}
            {c.cta_label && c.cta_url && (
              <Link to={c.cta_url} className="mt-8 inline-block rounded-lg bg-gold px-6 py-3 font-semibold text-emerald-deep hover:opacity-90">
                {c.cta_label}
              </Link>
            )}
          </div>
        </section>
      );
    case "text":
      return (
        <section className="py-12">
          <div className="container mx-auto max-w-3xl px-4">
            {c.heading && <h2 className="font-display text-3xl font-bold">{c.heading}</h2>}
            {c.body && <div className="prose prose-lg mt-4 max-w-none whitespace-pre-wrap text-foreground/90">{c.body}</div>}
          </div>
        </section>
      );
    case "image":
      return (
        <section className="py-8">
          <div className="container mx-auto px-4">
            {c.url && <img src={c.url} alt={c.alt ?? ""} className="mx-auto rounded-2xl" />}
            {c.caption && <p className="mt-2 text-center text-sm text-muted-foreground">{c.caption}</p>}
          </div>
        </section>
      );
    case "cta":
      return (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="rounded-2xl bg-gradient-to-br from-primary to-emerald-deep p-10 text-center text-primary-foreground">
              <h3 className="font-display text-2xl font-bold md:text-3xl">{c.title}</h3>
              {c.subtitle && <p className="mt-2 opacity-90">{c.subtitle}</p>}
              {c.cta_label && c.cta_url && (
                <Link to={c.cta_url} className="mt-6 inline-block rounded-lg bg-gold px-6 py-3 font-semibold text-emerald-deep hover:opacity-90">
                  {c.cta_label}
                </Link>
              )}
            </div>
          </div>
        </section>
      );
    case "features":
      return (
        <section className="py-12">
          <div className="container mx-auto px-4">
            {c.heading && <h2 className="mb-8 text-center font-display text-3xl font-bold">{c.heading}</h2>}
            <div className="grid gap-6 md:grid-cols-3">
              {(c.items ?? []).map((it: any, i: number) => (
                <div key={i} className="rounded-xl border border-border bg-card p-6">
                  <h3 className="font-display text-lg font-bold">{it.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{it.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    case "html":
      return (
        <section className="py-8">
          <div className="container mx-auto px-4" dangerouslySetInnerHTML={{ __html: c.html ?? "" }} />
        </section>
      );
    default:
      return null;
  }
}
