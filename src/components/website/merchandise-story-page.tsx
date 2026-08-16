import Image from "next/image"
import Link from "next/link"
import { Cormorant_Garamond } from "next/font/google"
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react"
import type { MerchandiseStory, StoryBlock } from "@/types"
import { MarketingPageShell } from "@/components/website/marketing-page-shell"

const storySerif = Cormorant_Garamond({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  display: "swap",
})

const heroPositions: Record<string, string> = {
  "the-origin": "object-center",
  "workwear-chapter": "object-[50%_54%]",
}

export function MerchandiseStoryPage({
  story,
  nextStory,
}: {
  story: MerchandiseStory
  nextStory: MerchandiseStory
}) {
  return (
    <MarketingPageShell>
      <StoryHero story={story} />

      <article className="border-b border-white/10">
        <section className="mx-auto grid max-w-[1400px] gap-10 px-5 pb-20 pt-20 md:grid-cols-12 md:px-8 md:pb-32 md:pt-28">
          <div className="md:col-span-3">
            <StoryLabel>Manifesto / 01</StoryLabel>
          </div>
          <p
            data-testid="story-manifesto"
            className={`${storySerif.className} max-w-[54rem] text-pretty text-[clamp(2.35rem,4.5vw,4.5rem)] font-medium normal-case leading-[1.08] tracking-[-0.025em] text-[#f2f5f3] md:col-span-8`}
          >
            {story.manifesto}
          </p>
        </section>

        <div className="mx-auto max-w-[1400px] px-5 pb-24 md:px-8 md:pb-36">
          {story.blocks.map((block, index) => (
            <StoryBlockSection
              key={block.id}
              block={block}
              story={story}
              index={index}
            />
          ))}
        </div>
      </article>

      <StoryNavigation story={story} nextStory={nextStory} />
    </MarketingPageShell>
  )
}

function StoryHero({ story }: { story: MerchandiseStory }) {
  return (
    <section
      data-testid="merchandise-story-hero"
      className="border-b border-white/10 bg-[#07110f]"
    >
      <div className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-[1600px] md:grid-cols-12">
        <div className="flex min-w-0 flex-col justify-between px-5 pb-12 pt-10 md:col-span-5 md:min-h-[calc(100dvh-4rem)] md:px-8 md:pb-14 md:pt-14 lg:px-14">
          <div className="flex items-center justify-between gap-5">
            <Link
              href="/merchandise"
              className="inline-flex min-h-11 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/58 transition-colors duration-300 hover:text-[#9bd0c1] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#79b8a7] motion-reduce:transition-none"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Tất cả câu chuyện
            </Link>
            <span className="font-mono text-[10px] tabular-nums tracking-[0.16em] text-[#79b8a7]">
              / {String(story.order).padStart(2, "0")}
            </span>
          </div>

          <div className="mt-20 md:my-auto md:py-16">
            <StoryLabel>TOTO Stories</StoryLabel>
            <h1
              className={`${storySerif.className} mt-6 max-w-[8ch] text-balance text-[clamp(4.25rem,7vw,7.5rem)] font-semibold normal-case leading-[0.82] tracking-[-0.055em] text-[#f2f5f3]`}
            >
              {story.title}
            </h1>
            <p
              className={`${storySerif.className} mt-7 max-w-sm text-pretty text-2xl font-medium italic leading-snug text-[#9bd0c1] md:text-3xl`}
            >
              {story.subtitle}
            </p>
          </div>

          <div className="hidden items-center gap-4 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/35 md:flex">
            Barber culture
            <span className="h-px flex-1 bg-white/12" aria-hidden="true" />
            TOTO / 2026
          </div>
        </div>

        <div
          data-testid="story-hero-media"
          className="relative aspect-[4/3] min-w-0 overflow-hidden bg-[#10231e] md:col-span-7 md:aspect-auto md:min-h-[calc(100dvh-4rem)]"
        >
          <Image
            src={story.heroImage}
            alt={`Hình ảnh mở đầu câu chuyện ${story.title}`}
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 767px) 100vw, 58vw"
            className={`object-cover ${heroPositions[story.slug] ?? "object-center"}`}
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#07110f]/35 to-transparent md:hidden"
          />
        </div>
      </div>
    </section>
  )
}

function StoryBlockSection({
  block,
  story,
  index,
}: {
  block: StoryBlock
  story: MerchandiseStory
  index: number
}) {
  const number = String(index + 2).padStart(2, "0")

  if (block.type === "quote" && block.body) {
    return (
      <section className="relative my-24 overflow-hidden border-y border-[#79b8a7]/22 py-16 md:my-36 md:py-24">
        <span
          aria-hidden="true"
          className={`${storySerif.className} absolute -top-8 left-0 text-[12rem] font-medium leading-none text-[#79b8a7]/10 md:text-[17rem]`}
        >
          “
        </span>
        <div className="relative grid gap-8 md:grid-cols-12">
          <div className="md:col-span-3">
            <StoryLabel>Point of view / {number}</StoryLabel>
          </div>
          <blockquote
            data-testid="story-quote"
            className={`${storySerif.className} max-w-[56rem] text-pretty text-[clamp(2.65rem,5.4vw,5.6rem)] font-medium italic normal-case leading-[0.98] tracking-[-0.035em] text-[#79b8a7] md:col-span-8`}
          >
            {block.body}
          </blockquote>
        </div>
      </section>
    )
  }

  if (block.type === "image" && block.image) {
    return (
      <section className="my-24 md:my-36">
        <div className="mb-5 flex items-center justify-between gap-4">
          <StoryLabel>Field notes / {number}</StoryLabel>
          <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
        </div>
        <div className="relative aspect-[4/3] overflow-hidden bg-[#10231e] md:aspect-[16/9]">
          <Image
            src={block.image}
            alt={block.heading ?? `Hình ảnh trong câu chuyện ${story.title}`}
            fill
            sizes="(max-width: 1439px) 100vw, 1400px"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] hover:scale-[1.015] motion-reduce:transform-none motion-reduce:transition-none"
          />
        </div>
      </section>
    )
  }

  if (block.type === "gallery" && block.images?.length) {
    return (
      <section className="my-24 md:my-36">
        <div className="mb-7 grid gap-4 md:grid-cols-12">
          <div className="md:col-span-3">
            <StoryLabel>Material study / {number}</StoryLabel>
          </div>
          {block.heading ? (
            <h2
              className={`${storySerif.className} text-balance text-4xl font-semibold normal-case leading-none tracking-[-0.025em] text-[#f2f5f3] md:col-span-8 md:text-6xl`}
            >
              {block.heading}
            </h2>
          ) : null}
        </div>
        <div className="grid gap-4 md:grid-cols-12 md:gap-5">
          {block.images.map((image, imageIndex) => (
            <div
              key={image}
              className={`relative aspect-[4/3] overflow-hidden bg-[#10231e] ${
                imageIndex % 2 === 0
                  ? "md:col-span-7 md:aspect-[7/6]"
                  : "md:col-span-5 md:aspect-[5/6]"
              }`}
            >
              <Image
                src={image}
                alt={`Chi tiết ${imageIndex + 1} của ${story.title}`}
                fill
                sizes="(max-width: 767px) 100vw, 58vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] hover:scale-[1.02] motion-reduce:transform-none motion-reduce:transition-none"
              />
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="my-24 grid gap-8 border-t border-white/10 pt-8 md:my-36 md:grid-cols-12 md:gap-6 md:pt-10">
      <div className="md:col-span-3">
        <StoryLabel>Chapter / {number}</StoryLabel>
      </div>
      <div className="md:col-span-8">
        {block.heading ? (
          <h2
            className={`${storySerif.className} max-w-3xl text-balance text-[clamp(2.75rem,4.7vw,4.9rem)] font-semibold normal-case leading-[0.98] tracking-[-0.03em] text-[#f2f5f3]`}
          >
            {block.heading}
          </h2>
        ) : null}
        {block.body ? (
          <p className="mt-7 max-w-[65ch] text-pretty text-base leading-8 text-white/62 md:text-lg md:leading-9">
            {block.body}
          </p>
        ) : null}
      </div>
    </section>
  )
}

function StoryNavigation({
  story,
  nextStory,
}: {
  story: MerchandiseStory
  nextStory: MerchandiseStory
}) {
  return (
    <section
      aria-labelledby="story-navigation-title"
      className="bg-[#103d34] px-5 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <StoryLabel>Continue reading</StoryLabel>
          <h2
            id="story-navigation-title"
            className={`${storySerif.className} mt-5 max-w-3xl text-balance text-[clamp(3.4rem,6.7vw,7rem)] font-semibold normal-case leading-[0.84] tracking-[-0.045em]`}
          >
            {nextStory.title}
          </h2>
          <Link
            href={`/merchandise/${nextStory.slug}`}
            className="group mt-8 inline-flex min-h-11 items-center gap-3 border-b border-[#79b8a7] py-2 text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-300 hover:text-[#9bd0c1] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9bd0c1] motion-reduce:transition-none"
          >
            Câu chuyện tiếp theo
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none"
              aria-hidden="true"
            />
          </Link>
        </div>

        <div className="border-t border-white/18 pt-7 md:col-span-5 md:border-l md:border-t-0 md:pl-10 md:pt-0">
          <p className="max-w-sm text-sm leading-7 text-white/58">
            Mang tinh thần của “{story.title}” vào những món đồ được thiết kế
            từ văn hóa của tiệm.
          </p>
          <Link
            href="/shop/merchandise"
            className="mt-7 inline-flex min-h-12 items-center gap-3 bg-[#f2f5f3] px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#07110f] transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-white active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transform-none motion-reduce:transition-none"
          >
            Shop Merchandise
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function StoryLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#79b8a7]">
      <span className="h-px w-7 bg-[#2f7a68]" aria-hidden="true" />
      {children}
    </p>
  )
}
