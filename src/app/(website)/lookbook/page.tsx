import Image from "next/image"
import { getLookbooks } from "@/lib/api"
import { MarketingPageShell } from "@/components/website/marketing-page-shell"
import { PageHero } from "@/components/website/page-hero"
import { ShopCarousel } from "./shop-carousel"

export default async function Page() {
  const lookbookItems = await getLookbooks()
  const shopItems = lookbookItems.filter((item) => item.category === "Shop")
  const hairItems = lookbookItems.filter((item) => item.category !== "Shop")

  return (
    <MarketingPageShell>
      <PageHero
        eyebrow="Lookbook"
        title="Cuts. Faces. Stories."
        description="Những cá tính đi qua chiếc ghế TOTO."
        image="/images/lookbook-11.png"
        variant="media"
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8">
          <SectionHeader
            label="Vibes"
            title="Our Shop"
            copy="Không gian mang đậm chất TOTO, nơi những câu chuyện được kể và những kiểu tóc được tạo ra."
          />
        </div>
        <ShopCarousel items={shopItems} />
      </section>

      <section className="border-t border-white/10 py-16 md:py-24">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8">
          <SectionHeader
            // label="Selected work"
            label=""
            title="Những kiểu tóc nổi bật"
            copy="Những tác phẩm được thực hiện tại TOTO, từ các thiết kế texture, fade đến màu sắc cá tính."
          />
          <div className="mt-12 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
            {hairItems.map((item) => (
              <figure key={item.id} className="group relative aspect-square overflow-hidden rounded-sm bg-black/30">
                <Image
                  src={item.image}
                  alt={item.title || "Lookbook"}
                  fill
                  sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transition-none"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-[#07110f]/88 p-4 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#79b8a7]">{item.category}</span>
                  <p className="mt-1 text-sm font-medium text-white">{item.title}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </MarketingPageShell>
  )
}

function SectionHeader({ label, title, copy }: { label: string; title: string; copy: string }) {
  return (
    <div className="max-w-4xl">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#79b8a7]">{label}</p>
      <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.92] tracking-tight text-[#f2f5f3] md:text-6xl lg:text-7xl">{title}</h2>
      <p className="mt-5 max-w-2xl text-base leading-7 text-white/60 md:text-lg">{copy}</p>
    </div>
  )
}
