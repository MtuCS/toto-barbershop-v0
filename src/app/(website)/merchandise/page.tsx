import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react"
import { MarketingPageShell } from "@/components/website/marketing-page-shell"
import { ProductCard } from "@/components/website/product-card"
import { products } from "@/data/products"
import { merchandiseStories } from "@/data/stories"
import { PageHero, SectionTitle } from "@/components/website/page-hero"

export const metadata: Metadata = {
  title: "TOTO Merchandise — More than merchandise",
  description:
    "Khám phá TOTO Merchandise: những thiết kế streetwear được tạo nên từ văn hóa barber, tay nghề và tinh thần của tiệm.",
}

const featuredMerchandise = products
  .filter((product) => product.category === "merchandise")
  .slice(0, 4)

export default function Page() {
  return (
    <MarketingPageShell>
      <section className="relative min-h-[calc(100dvh-4rem)] overflow-hidden bg-[#07110f]">
        <Image
          src="/images/hero-portrait.png"
          alt="Người mẫu mặc thiết kế TOTO Merchandise"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[64%_center] sm:object-[58%_center] lg:object-center"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,17,15,0.2)_0%,rgba(7,17,15,0.18)_38%,rgba(7,17,15,0.94)_100%)] md:bg-[linear-gradient(90deg,rgba(7,17,15,0.96)_0%,rgba(7,17,15,0.83)_35%,rgba(7,17,15,0.18)_70%,rgba(7,17,15,0.12)_100%)]" />
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,transparent_0%,rgba(7,17,15,0.08)_45%,rgba(7,17,15,0.4)_100%)]" />

        <div className="relative mx-auto flex min-h-[calc(100dvh-4rem)] max-w-[1400px] items-end px-5 pb-12 pt-28 md:items-center md:px-8 md:py-24">
          <div className="min-w-0 max-w-[58rem]">
            <div className="flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9bd0c1]">
              <span className="h-px w-9 bg-[#79b8a7]" aria-hidden="true" />
              TOTO Editorial / 2026
            </div>
            <h1 className="mt-6 text-balance font-display font-bold uppercase text-[#f4f5ef]" aria-label="More than merchandise">
              <span className="block text-[clamp(3.6rem,7.6vw,7.8rem)] leading-[0.82] tracking-[-0.045em]">More than</span>
              <span className="mt-1 block whitespace-nowrap text-[clamp(2.65rem,7.25vw,7.45rem)] leading-[0.88] tracking-[-0.045em] sm:mt-2">Merchandise</span>
            </h1>
            <p className="mt-7 max-w-md text-pretty text-base leading-7 text-white/72 md:text-lg md:leading-8">
              Một thái độ sống được may thành hình — đi từ chiếc ghế barber ra ngoài đường phố.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Link href="/shop/merchandise" className="inline-flex min-h-12 items-center gap-3 bg-[#f4f5ef] px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#07110f] transition-[background-color,transform] duration-300 ease-out hover:-translate-y-0.5 hover:bg-white active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4f5ef] motion-reduce:transform-none motion-reduce:transition-none">
                Khám phá bộ sưu tập
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
              {/* <Link href="#manifesto" className="inline-flex min-h-11 items-center gap-3 border-b border-white/45 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-300 hover:border-[#9bd0c1] hover:text-[#9bd0c1] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9bd0c1] motion-reduce:transition-none">
                Đọc câu chuyện
                <ArrowDown className="size-4" aria-hidden="true" />
              </Link> */}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 right-0 hidden items-center gap-4 border-l border-t border-white/15 bg-[#07110f]/75 px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/55 backdrop-blur-sm lg:flex">
          Designed in the shop
          <span className="h-px w-12 bg-[#79b8a7]/70" aria-hidden="true" />
          Worn in the street
        </div>
      </section>

      {/* <section id="manifesto" className="scroll-mt-24 border-b border-white/10 px-5 pb-24 pt-20 md:px-8 md:pb-36 md:pt-32">
        <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4">
            <p className="flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#79b8a7]">
              <span className="h-px w-9 bg-[#2f7a68]" aria-hidden="true" />
              Manifesto
            </p>
            <p className="mt-5 max-w-xs text-sm leading-6 text-white/50">
              Không chỉ là quần áo. Đây là cách văn hóa của tiệm tiếp tục sống khi bạn bước ra phố.
            </p>
          </div>

          <div className="min-w-0 md:col-span-8">
            <h2 className="max-w-5xl text-balance font-display text-[clamp(3rem,6.4vw,6.8rem)] font-bold uppercase leading-[0.88] tracking-[-0.035em] text-[#f2f5f3]">
              Born in the shop.
              <span className="block text-[#79b8a7]">Made for the street.</span>
            </h2>
            <div className="mt-10 grid gap-7 border-t border-white/15 pt-7 text-sm leading-7 text-white/62 sm:grid-cols-2 md:mt-14">
              <p>TOTO Merchandise sinh ra từ những cuộc trò chuyện, âm nhạc và nhịp làm việc bên chiếc ghế barber.</p>
              <p>Form dáng rõ ràng, chất liệu bền và chi tiết vừa đủ — những món đồ được tạo ra để mặc lâu, không chạy theo một mùa ngắn ngủi.</p>
            </div>
          </div>
        </div>
      </section> */}

      <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-24">
        <SectionTitle label="Manifesto" title="Born in the shop. Made for the street." theme="dark" />
        <div className="mt-14 space-y-20 md:space-y-28">
          {merchandiseStories.map((story, index) => (
            <Link href={`/merchandise/${story.slug}`} key={story.id} className="group grid items-center gap-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#79b8a7] md:grid-cols-12 md:gap-12">
              <div className={`relative aspect-[4/3] overflow-hidden border border-white/10 bg-black/30 md:col-span-7 ${index % 2 ? "md:order-2" : ""}`}>
                <Image src={story.heroImage} alt={story.title} fill sizes="(max-width: 767px) 100vw, 58vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.025] motion-reduce:transition-none" />
              </div>
              <div className="md:col-span-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#79b8a7]">Collection {String(index + 1).padStart(2, "0")}</p>
                <h2 className="mt-3 font-serif text-5xl font-medium uppercase leading-[0.9] text-[#f2f5f3] md:text-7xl">{story.title}</h2>
                <p className="mt-5 leading-7 text-white/60">{story.manifesto}</p>
                <span className="mt-7 inline-flex min-h-11 items-center gap-3 border-b border-[#2f7a68] py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-colors group-hover:text-[#79b8a7]">
                  Đọc câu chuyện
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* <section aria-labelledby="featured-products-title" className="bg-[#f3f5f1] px-5 pb-24 pt-20 text-[#101715] md:px-8 md:pb-32 md:pt-28">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-6 border-b-2 border-[#101715] pb-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#2f7a68]">TOTO Supply / Selected pieces</p>
              <h2 id="featured-products-title" className="mt-3 text-balance font-display text-[clamp(2.8rem,5vw,5rem)] font-bold uppercase leading-none tracking-[-0.025em]">Mặc tinh thần của tiệm</h2>
            </div>
            <Link href="/shop/merchandise" className="inline-flex min-h-11 w-fit items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] text-[#13443b] transition-colors hover:text-[#07110f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#13443b] md:col-span-4 md:justify-self-end">
              Xem tất cả sản phẩm
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-9 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {featuredMerchandise.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 2} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-[#79b8a7]/20 bg-[#103d34] px-5 py-20 md:px-8 md:py-28">
        <div aria-hidden="true" className="absolute -right-40 -top-56 size-[38rem] rounded-full border border-[#79b8a7]/20" />
        <div className="relative mx-auto grid max-w-[1400px] gap-10 md:grid-cols-12 md:items-end">
          <div className="min-w-0 md:col-span-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#9bd0c1]">TOTO Merchandise</p>
            <h2 className="mt-4 max-w-4xl text-balance font-display text-[clamp(3.2rem,6.3vw,6.7rem)] font-bold uppercase leading-[0.87] tracking-[-0.035em]">Wear the attitude.</h2>
          </div>
          <div className="md:col-span-4 md:justify-self-end">
            <p className="mb-6 max-w-sm text-sm leading-6 text-white/60">Những thiết kế mang dấu ấn barber culture, sẵn sàng đi cùng bạn từ tiệm ra phố.</p>
            <Link href="/shop/merchandise" className="inline-flex min-h-12 items-center gap-3 bg-[#f4f5ef] px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#07110f] transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-white active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transform-none motion-reduce:transition-none">
              Shop Merchandise
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section> */}
    </MarketingPageShell>
  )
}
