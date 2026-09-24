import { MarketingPageShell } from "@/components/website/marketing-page-shell"
import { ShopCarousel } from "@/components/website/lookbook/shop-carousel"
import { getLookbooks } from "@/lib/api"

export async function HomeLookbook() {
  const lookbookItems = await getLookbooks()
  const shopItems = lookbookItems.filter((item) => item.category === "Shop")

  return (
    <section data-home-scene="our-shop" aria-label="Không gian tiệm ToTo Barbershop">
      <MarketingPageShell>
        <section className="py-8 md:py-12">
          <ShopCarousel items={shopItems} />
        </section>
      </MarketingPageShell>
    </section>
  )
}
