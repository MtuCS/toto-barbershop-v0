import type { ReactNode } from "react"
import { SiteHeader } from "@/components/website/site-header"
import { SiteFooter } from "@/components/website/site-footer"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { ScrollToTop } from "@/components/website/scroll-to-top"

export default function WebsiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 pt-16">{children}</main>
      <SiteFooter />
      <CartDrawer />
      <ScrollToTop />
    </div>
  )
}
