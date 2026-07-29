import { Suspense } from "react"
import { MarketingPageShell } from "@/components/website/marketing-page-shell"
import { PageHero } from "@/components/website/page-hero"
import { ShopCatalog } from "@/components/website/shop-catalog"

export default function Page() {
  return (
    <MarketingPageShell>
      <PageHero
        eyebrow="TOTO Merchandise"
        title="Wear the attitude"
        description="Đồ mặc bền bỉ, thực dụng, sinh ra từ văn hóa barber."
        image="/images/merch-lifestyle.png"
        variant="compact"
      />
      <Suspense fallback={null}><ShopCatalog category="merchandise" title="TOTO Merchandise" showCategoryFilter={false} /></Suspense>
    </MarketingPageShell>
  )
}
