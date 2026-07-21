import { Hero } from "@/components/website/home/hero"
import { Marquee } from "@/components/website/marquee"
import { QuickInfo } from "@/components/website/home/quick-info"
import { ServicesBento } from "@/components/website/home/services-bento"
import { AboutIntro } from "@/components/website/home/about-intro"
import { LookbookPreview } from "@/components/website/home/lookbook-preview"
import { MerchTeaser } from "@/components/website/home/merch-teaser"
import { GroomingFeatured } from "@/components/website/home/grooming-featured"
import { TrainingTeaser } from "@/components/website/home/training-teaser"
import { SocialSection } from "@/components/website/home/social-section"

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <QuickInfo />
      <ServicesBento />
      <AboutIntro />
      <LookbookPreview />
      <MerchTeaser />
      <GroomingFeatured />
      <TrainingTeaser />
      <SocialSection />
    </>
  )
}
