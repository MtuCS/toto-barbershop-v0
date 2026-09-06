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
            {/* <span className="font-akira text-lg font-bold uppercase tracking-[0.15em] text-primary-foreground whitespace-nowrap md:text-xl"> */}
            <span className="font-agatho text-xl font-bold uppercase tracking-[0.2em] text-primary-foreground whitespace-nowrap md:text-2xl">
              TOTO
            </span>
            <div className="relative h-11 w-11 shrink-0 md:h-14 md:w-14">
              <Image
                src="/images/Artboard 1.png"
                alt="ToTo Barbershop Logo"
                fill
                sizes="(max-width: 768px) 44px, 56px"
                className="object-contain scale-[1.3]"
                priority={i < 4}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


