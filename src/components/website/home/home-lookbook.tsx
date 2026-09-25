import { ShopCarousel } from "@/components/website/lookbook/shop-carousel"
import { getLookbooks } from "@/lib/api"

export async function HomeLookbook() {
  const lookbookItems = await getLookbooks()
  const shopItems = lookbookItems.filter((item) => item.category === "Shop")

  return (
    <section
      data-home-scene="our-shop"
      aria-labelledby="home-our-shop-title"
      className="home-our-shop-scene relative isolate overflow-hidden bg-[#07110f] px-5 py-12 text-[#f2f5f3] md:px-8 md:py-20 lg:px-10 xl:px-14"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[34rem] -top-[56rem] size-[78rem] rounded-full border border-[#2f7a68]/25"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[34rem] top-[38%] size-[76rem] rounded-full border border-[#2f7a68]/20"
      />

      <div className="home-scene-inner relative mx-auto flex h-full max-w-[1400px] flex-col justify-center">
        <div className="w-full">
          <p className="home-section-eyebrow flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#79b8a7]">
            <span
              className="h-px w-10 origin-left bg-[#79b8a7]/70"
              aria-hidden="true"
            />
            Vibes
          </p>
          <h2
            id="home-our-shop-title"
            className="home-section-title mt-2 text-center font-sans text-[clamp(2.5rem,5vw,4.25rem)] font-bold leading-[1.05] tracking-[-0.04em] text-[#f2f5f3]"
          >
            Không gian tiệm
          </h2>
        </div>

        <div className="mt-8 md:mt-12">
          <ShopCarousel items={shopItems} />
        </div>
      </div>
    </section>
  )
}
