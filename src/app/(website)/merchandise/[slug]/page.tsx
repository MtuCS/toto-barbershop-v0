import Image from "next/image"
import { notFound } from "next/navigation"
import { getStoryBySlug } from "@/data/stories"
import { MarketingPageShell } from "@/components/website/marketing-page-shell"
import { PageHero } from "@/components/website/page-hero"

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const story = getStoryBySlug(slug)
  if (!story) notFound()

  return (
    <MarketingPageShell>
      <PageHero
        eyebrow="TOTO Stories"
        title={story.title}
        description={story.subtitle}
        image={story.heroImage}
        imageClassName={slug === "workwear-chapter" ? "object-contain" : undefined}
        variant="media"
      />
      <article className="mx-auto max-w-5xl px-5 py-16 md:px-8 md:py-24">
        <p className="mx-auto max-w-4xl font-serif text-4xl font-medium uppercase leading-[1.02] text-[#f2f5f3] md:text-6xl">{story.manifesto}</p>
        <div className="mt-20 md:mt-28">
          {story.blocks.map((block) => (
            <section key={block.id} className="my-16 md:my-24">
              {block.heading ? <h2 className="font-display text-4xl font-bold uppercase text-[#f2f5f3] md:text-5xl">{block.heading}</h2> : null}
              {block.body ? (
                <p className={block.type === "quote" ? "max-w-4xl border-l border-[#79b8a7] pl-6 font-serif text-4xl font-medium uppercase leading-tight text-[#79b8a7] md:text-6xl" : "mt-5 max-w-2xl leading-8 text-white/65"}>{block.body}</p>
              ) : null}
              {block.image ? (
                <div className="relative mt-8 aspect-[4/3] overflow-hidden border border-white/10 md:aspect-[16/9]">
                  <Image src={block.image} alt={block.heading || story.title} fill sizes="(max-width: 1023px) 100vw, 1024px" className="object-cover" />
                </div>
              ) : null}
              {block.images ? (
                <div className="mt-8 grid grid-cols-2 gap-3">
                  {block.images.map((image, index) => (
                    <div key={image} className="relative aspect-square overflow-hidden border border-white/10">
                      <Image src={image} alt={`${story.title} ${index + 1}`} fill sizes="(max-width: 767px) 50vw, 512px" className="object-cover" />
                    </div>
                  ))}
                </div>
              ) : null}
            </section>
          ))}
        </div>
      </article>
    </MarketingPageShell>
  )
}
