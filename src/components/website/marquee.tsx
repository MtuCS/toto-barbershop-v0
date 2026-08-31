import Image from "next/image"

interface MarqueeProps {
  repeat?: number
}

export function Marquee({ repeat = 12 }: MarqueeProps) {
  // Create first half of items
  const singleTrack = Array.from({ length: repeat })
  // Duplicated track so the infinite loop translateX(-50%) has no visible seam
  const track = [...singleTrack, ...singleTrack]

  return (
    <div className="relative flex overflow-hidden border-y border-border bg-primary text-primary-foreground select-none">
      <div className="marquee-track flex shrink-0 items-center gap-8 py-3.5 pr-8 md:gap-12 md:py-4 md:pr-12 will-change-transform">
        {track.map((_, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center gap-8 md:gap-12"
            aria-hidden={i >= repeat}
          >
            <span className="font-display text-xl font-bold uppercase tracking-[0.25em] text-primary-foreground whitespace-nowrap md:text-2xl">
              TOTO
            </span>
            <div className="relative h-8 w-8 shrink-0 md:h-10 md:w-10">
              <Image
                src="/images/T_logo.png"
                alt="ToTo Barbershop Logo"
                fill
                sizes="(max-width: 768px) 32px, 40px"
                className="object-contain brightness-0 invert scale-125"
                priority={i < 4}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


