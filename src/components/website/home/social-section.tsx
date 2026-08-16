import Link from "next/link"
import { Cormorant_Garamond } from "next/font/google"
import { Facebook, Instagram } from "lucide-react"
import CircularText from "@/components/ui/circular-text"
import FloatingLines from "@/components/ui/floating-lines"
import { defaultSettings } from "@/data/settings"

const socialScript = Cormorant_Garamond({
  subsets: ["latin"],
  weight: "500",
  style: "italic",
  display: "swap",
})

export function SocialSection() {
  return (
    <section
      aria-labelledby="home-social-title"
      className="relative isolate overflow-hidden border-t border-white/10 bg-[#07110f] text-[#f2f5f3]"
    >
      <div className="relative h-full min-h-[70dvh] w-full overflow-hidden px-4 py-14 sm:px-6 md:px-8 md:py-16 lg:min-h-0">
        <FloatingLines
          linesGradient={["#0e2c26", "#13443b", "#2f7a68", "#5f9e8d"]}
          enabledWaves={["top", "middle", "bottom"]}
          lineCount={[8, 12, 10]}
          lineDistance={[7, 5, 6]}
          topWavePosition={{ x: 8.5, y: 0.75, rotate: -0.35 }}
          middleWavePosition={{ x: 3.8, y: -0.05, rotate: 0.2 }}
          bottomWavePosition={{ x: 1.6, y: -0.75, rotate: -0.65 }}
          animationSpeed={0.3}
          interactive={false}
          parallax={false}
          mixBlendMode="screen"
        />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1180px] flex-col justify-center">
          <h2 id="home-social-title" className="sr-only">
            Follow us on
          </h2>
          <div className="mb-6 flex w-full justify-center md:mb-8">
            <CircularText
              text="FOLLOW*US*ON*"
              spinDuration={20}
              onHover="speedUp"
              className={socialScript.className}
            />
          </div>

          <div className="grid w-full md:grid-cols-2">
            <Link
              href={defaultSettings.social.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Theo dõi Toto Barbershop trên Instagram"
              className="group flex min-h-52 flex-col items-center justify-center gap-5 px-4 py-10 text-center transition-opacity duration-300 hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#79b8a7] active:scale-[0.99] md:min-h-64"
            >
              <Instagram
                aria-hidden="true"
                className="size-9 text-white transition-transform duration-300 group-hover:-translate-y-1"
                strokeWidth={1.5}
              />
              <span className="font-display text-[clamp(1.75rem,3.2vw,3.5rem)] font-bold uppercase leading-none tracking-[-0.035em] text-[#f2f5f3]">
                @totobarbershop_
              </span>
            </Link>

            <Link
              href={defaultSettings.social.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Theo dõi Toto Barbershop trên Facebook"
              className="group flex min-h-52 flex-col items-center justify-center gap-5 px-4 py-10 text-center transition-opacity duration-300 hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#79b8a7] active:scale-[0.99] md:min-h-64"
            >
              <Facebook
                aria-hidden="true"
                className="size-9 text-white transition-transform duration-300 group-hover:-translate-y-1"
                strokeWidth={1.5}
              />
              <span className="font-display text-[clamp(1.75rem,3.2vw,3.5rem)] font-bold uppercase leading-none tracking-[-0.035em] text-[#f2f5f3]">
                Toto Barbershop
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}