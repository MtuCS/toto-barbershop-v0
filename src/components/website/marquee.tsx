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
    <div className="relative flex overflow-hidden border-y border-border/40 bg-primary text-primary-foreground select-none">
      <div className="marquee-track flex shrink-0 items-center gap-6 py-1 pr-6 md:gap-8 md:py-1.5 md:pr-8 will-change-transform">
        {track.map((_, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center gap-6 md:gap-8"
            aria-hidden={i >= repeat}
          >
            <span className="font-agatho text-sm font-bold uppercase tracking-[0.22em] text-primary-foreground whitespace-nowrap md:text-base">
              TOTO
            </span>
            <div className="relative h-5 w-5 shrink-0 md:h-6 md:w-6">
              <Image
                src="/images/Artboard 1.png"
                alt="ToTo Barbershop Logo"
                fill
                sizes="(max-width: 768px) 20px, 24px"
                className="object-contain scale-105"
                priority={i < 4}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


