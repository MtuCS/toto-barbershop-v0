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
            <SectionHeader
              label="Vibes"
              title="Our Shop"
              copy="Không gian mang đậm chất TOTO, nơi những câu chuyện được kể và những kiểu tóc được tạo ra."
            />
          </div>
          <ShopCarousel items={shopItems} />
        </section>
      </MarketingPageShell>
    </section>
  )
}

function SectionHeader({ label, title, copy }: { label: string; title: string; copy: string }) {
  return (
    <div className="max-w-4xl">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#79b8a7]">{label}</p>
      <h2 id="home-our-shop-title" className="mt-4 font-display text-4xl font-bold uppercase leading-[0.92] tracking-tight text-[#f2f5f3] md:text-6xl lg:text-7xl">{title}</h2>
      <p className="mt-5 max-w-2xl text-base leading-7 text-white/60 md:text-lg">{copy}</p>
    </div>
  )
}
