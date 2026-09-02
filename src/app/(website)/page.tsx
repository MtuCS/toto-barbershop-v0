import { Hero } from "@/components/website/home/hero"
import { Marquee } from "@/components/website/marquee"
import { VisualVideo } from "@/components/website/home/visual-video"
import { QuickInfo } from "@/components/website/home/quick-info"
import { ServicesBento } from "@/components/website/home/services-bento"
import { HomeTestimonials } from "@/components/website/home/home-testimonials"
import { HomeLookbook } from "@/components/website/home/home-lookbook"
import { HomeValues } from "@/components/website/home/home-values"
import { FaqAccordion } from "@/components/website/faq-accordion"

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
      <FaqAccordion />

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

