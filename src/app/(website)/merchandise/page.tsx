import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { merchandiseStories } from "@/data/stories"
import { MarketingPageShell } from "@/components/website/marketing-page-shell"
import { PageHero, SectionTitle } from "@/components/website/page-hero"

export default function Page() {
  return (
    <MarketingPageShell>
      <PageHero
        eyebrow="TOTO Editorial"
        title="More than merchandise"
        description="Một thái độ sống được may thành hình."
        image="/images/merch-story-hero.jpg"
        variant="split"
      />

      <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-24">
        <SectionTitle label="Manifesto" title="Born in the shop. Made for the street." copy="TOTO Merchandise sinh ra từ những cuộc trò chuyện, âm nhạc và kỹ nghệ bên chiếc ghế barber." theme="dark" />
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

      <section className="border-y border-[#79b8a7]/15 bg-[#13443b] px-5 py-16 text-center text-white">
        <h2 className="font-display text-4xl font-bold uppercase md:text-5xl">Mang tinh thần TOTO cùng bạn</h2>
        <Link href="/shop/merchandise" className="mt-7 inline-flex min-h-12 items-center gap-3 bg-[#f5f9f7] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#101715] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
          Shop merchandise
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      </section>
    </MarketingPageShell>
  )
}
