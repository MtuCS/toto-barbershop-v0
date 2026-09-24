import { MarketingPageShell } from "@/components/website/marketing-page-shell"
import { ShopCarousel } from "@/components/website/lookbook/shop-carousel"
import { getLookbooks } from "@/lib/api"

export async function HomeLookbook() {
  const lookbookItems = await getLookbooks()
  const shopItems = lookbookItems.filter((item) => item.category === "Shop")

  return (
    <section data-home-scene="our-shop" aria-labelledby="home-our-shop-title">
      <MarketingPageShell>
        <section className="pb-12 pt-6 md:pb-20 md:pt-10">
          <div className="mx-auto max-w-[1400px] px-5 md:px-8">
            <div className="max-w-4xl text-left">
              <p className="home-section-eyebrow inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#79b8a7]">
                <span
                  className="h-px w-10 origin-left bg-[#79b8a7]/70"
                  aria-hidden="true"
                />
                Vibes
              </p>
              <h2 id="home-our-shop-title" className="home-section-title mt-2 font-sans text-[clamp(2.5rem,5vw,4.25rem)] font-bold leading-[1.05] tracking-[-0.04em] text-[#f2f5f3]">
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
