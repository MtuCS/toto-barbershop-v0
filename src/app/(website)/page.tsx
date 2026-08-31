import { Hero } from "@/components/website/home/hero"
import { Marquee } from "@/components/website/marquee"
import { VisualVideo } from "@/components/website/home/visual-video"
import { QuickInfo } from "@/components/website/home/quick-info"
import { ServicesBento } from "@/components/website/home/services-bento"
import { HomeTestimonials } from "@/components/website/home/home-testimonials"
import { HomeLookbook } from "@/components/website/home/home-lookbook"
import { HomeValues } from "@/components/website/home/home-values"
import { AboutIntro } from "@/components/website/home/about-intro"
import { LookbookPreview } from "@/components/website/home/lookbook-preview"
import { MerchTeaser } from "@/components/website/home/merch-teaser"
import { GroomingFeatured } from "@/components/website/home/grooming-featured"
import { TrainingTeaser } from "@/components/website/home/training-teaser"
import { SocialSection } from "@/components/website/home/social-section"

export default function HomePage() {
  return (
    <>

      <div data-home-scene="campaign">
        <Marquee />
        <VisualVideo />
      </div>
      <Hero />
      {/* <QuickInfo /> */}
      <ServicesBento />
      <HomeValues />
      <HomeTestimonials />
      <HomeLookbook />

      {/* Tạm thời ẩn các scene theo yêu cầu */}
      {/* <MerchTeaser /> */}
      {/* <AboutIntro /> */}
      {/* <LookbookPreview /> */}
      {/* <GroomingFeatured /> */}
      {/* <TrainingTeaser /> */}
      {/* <SocialSection /> */}
    </>
  )
}

