import { MarketingPageShell } from "@/components/website/marketing-page-shell"
import { ShopCarousel } from "@/components/website/lookbook/shop-carousel"
import { getLookbooks } from "@/lib/api"

export async function HomeLookbook() {
  const lookbookItems = await getLookbooks()
  const shopItems = lookbookItems.filter((item) => item.category === "Shop")

  return (
    <section data-home-scene="our-shop" aria-labelledby="home-our-shop-title">
      <MarketingPageShell>
        <section className="pb-16 pt-10 md:pb-24 md:pt-16">
          <div className="mx-auto max-w-[1400px] px-5 md:px-8">
            <div className="max-w-4xl">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#79b8a7]">Vibes</p>
              <h2 id="home-our-shop-title" className="mt-4 font-display text-4xl font-bold uppercase leading-tight tracking-tight text-[#f2f5f3] md:text-6xl lg:text-7xl">
                Không gian tiệm
              </h2>
            </div>
          </div>
          <ShopCarousel items={shopItems} />
        </section>
      </MarketingPageShell>
    </section>
  )
}
