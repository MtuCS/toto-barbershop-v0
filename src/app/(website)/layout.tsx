import type { ReactNode } from "react"
import { SiteHeader } from "@/components/website/site-header"
import { SiteFooter } from "@/components/website/site-footer"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { FloatingContactButtons } from "@/components/website/floating-contact-buttons"
import { DataFetcher } from "@/components/website/data-fetcher"
import { SiteAtmosphere } from "@/components/website/site-atmosphere"
import { LocalBusinessSchema } from "@/components/website/local-business-schema"

export default function WebsiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-x-clip bg-[#07110f]">
      <LocalBusinessSchema />
      <SiteAtmosphere />
      <SiteHeader />
      <main className="relative z-10 flex-1 bg-[#07110f] pt-16">{children}</main>
      <div
        data-home-scene="contact"
        className="relative z-10 bg-[#050c0a]"
      >
        <SiteFooter />
      </div>
      <CartDrawer />
      <FloatingContactButtons />
      <DataFetcher />
    </div>
  )
}

