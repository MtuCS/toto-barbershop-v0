import type { ReactNode } from "react"
import { SiteHeader } from "@/components/website/site-header"
import { SiteFooter } from "@/components/website/site-footer"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { ScrollToTop } from "@/components/website/scroll-to-top"
import { DataFetcher } from "@/components/website/data-fetcher"
import { SiteAtmosphere } from "@/components/website/site-atmosphere"
import { StickyMobileCta } from "@/components/website/sticky-mobile-cta"
import { LocalBusinessSchema } from "@/components/website/local-business-schema"

export default function WebsiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-x-clip">
      <LocalBusinessSchema />
      <SiteAtmosphere />
      <SiteHeader />
      <main className="relative z-10 flex-1 pt-16">{children}</main>
      <div
        data-home-scene="contact"
        className="relative z-10"
      >
        <SiteFooter />
      </div>
      <CartDrawer />
      <ScrollToTop />
      <StickyMobileCta />
      <DataFetcher />
    </div>
  )
}
