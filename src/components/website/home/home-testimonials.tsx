import { Star } from "lucide-react"
import { GoogleReviewsShowcase } from "@/components/website/google-reviews-showcase"

export function HomeTestimonials() {
  return (
    <section
      data-home-scene="testimonials"
      aria-labelledby="home-testimonials-title"
      data-testid="home-testimonials-scene"
      className="home-testimonials-scene relative isolate overflow-hidden bg-[#0b1b18] px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-10 lg:py-8 xl:py-10 text-[#f2f5f3] flex flex-col justify-center"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[18rem] top-0 size-[48rem] -translate-y-1/2 rounded-full border border-[#2f7a68]/20 md:-right-[24rem] md:size-[60rem] lg:-right-[28rem] lg:size-[72rem]"
      />

      <div className="home-scene-inner relative mx-auto flex w-full max-w-[1400px] flex-col justify-center">
        <div className="home-testimonials-heading flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6">
          <div className="max-w-2xl">
            <p className="home-section-eyebrow text-xs font-semibold uppercase tracking-[0.2em] text-[#79b8a7]">
              Đánh giá thực tế từ khách hàng
            </p>
            <h2
              id="home-testimonials-title"
              className="home-section-title mt-2 text-2xl font-bold uppercase tracking-tight text-[#f2f5f3] sm:text-3xl md:text-4xl lg:text-5xl leading-tight"
            >
              ToTo qua lời kể của anh em
            </h2>
            <p className="home-section-description mt-2 max-w-2xl text-xs sm:text-sm md:text-base leading-relaxed text-white/75">
              Những chia sẻ chân thật từ những người anh em đã đồng hành cùng ToTo qua từng góc kéo và tin dùng sáp vuốt tóc của tiệm.
            </p>
          </div>

          {/* Google Reviews Badge */}
          <a
            href="https://www.google.com/maps/place/Toto+babershop/@10.793289,106.644723,17z/data=!4m6!3m5!1s0x317529fab862286b:0x558f62689c90fdae!8m2!3d10.793289!4d106.644723!16s%2Fg%2F11sy6vhbxb?entry=ttu"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-xl border border-white/15 bg-[#07110f]/90 px-3.5 py-2 shadow-lg backdrop-blur-md transition-all hover:border-[#79b8a7]/60 hover:bg-[#07110f] shrink-0"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-white/10 text-base font-black text-[#79b8a7]">
              G
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-bold text-white">4.1 / 5.0</span>
                <div className="flex gap-0.5 text-[#F5FF00]">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="size-3 fill-[#F5FF00]" />
                  ))}
                  <Star className="size-3 fill-[#F5FF00]/40 text-[#F5FF00]" />
                </div>
              </div>
              <p className="text-[10px] sm:text-[11px] text-white/60">73 đánh giá trên Google Maps</p>
            </div>
          </a>
        </div>

        {/* Real Live Google Reviews Showcase */}
        <div className="mt-5 md:mt-6">
          <GoogleReviewsShowcase />
        </div>
      </div>
    </section>
  )
}
