import { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { WhatsAppButton } from "./WhatsAppButton";
import { PageBlocks } from "./PageBlocks";

export function SiteLayout({ children, pageSlug }: { children: ReactNode; pageSlug?: string }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {pageSlug && <PageBlocks pageSlug={pageSlug} />}
        {children}
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </div>
  );
}