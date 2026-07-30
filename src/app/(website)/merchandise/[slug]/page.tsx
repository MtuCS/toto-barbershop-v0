import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MerchandiseStoryPage } from "@/components/website/merchandise-story-page"
import { getStoryBySlug, merchandiseStories } from "@/data/stories"

type StoryPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: StoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const story = getStoryBySlug(slug)

  if (!story) return {}

  return {
    title: `${story.title} — TOTO Merchandise`,
    description: story.manifesto,
    openGraph: {
      title: `${story.title} — TOTO Merchandise`,
      description: story.subtitle,
      images: [{ url: story.heroImage }],
    },
  }
}

export default async function Page({ params }: StoryPageProps) {
  const { slug } = await params
  const story = getStoryBySlug(slug)

  if (!story) notFound()

  const storyIndex = merchandiseStories.findIndex(
    (item) => item.slug === story.slug,
  )
  const nextStory =
    merchandiseStories[(storyIndex + 1) % merchandiseStories.length]

  return <MerchandiseStoryPage story={story} nextStory={nextStory} />
}