import { Suspense } from "react"
import { MarketingPageShell } from "@/components/website/marketing-page-shell"
import { PageHero } from "@/components/website/page-hero"
import { ShopCatalog } from "@/components/website/shop-catalog"

export default function Page() {
  return (
    <MarketingPageShell>
      <PageHero
        eyebrow="Grooming"
        title="Finish like a barber"
        description="Những sản phẩm chúng tôi dùng mỗi ngày tại ghế cắt."
        image="/images/grooming-kit.png"
        imageClassName="object-contain"
        variant="compact"
      />
      <Suspense fallback={null}><ShopCatalog category="grooming" title="Grooming" showCategoryFilter={false} /></Suspense>
    </MarketingPageShell>
  )
}
