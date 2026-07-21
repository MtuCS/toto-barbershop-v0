import { Scissors } from "lucide-react"

interface MarqueeProps {
  items?: string[]
}

const DEFAULT_ITEMS = [
  "BARBER",
  "CULTURE",
  "CRAFT",
  "GROOMING",
  "STREETWEAR",
  "TRAINING",
  "CHARACTER",
]

export function Marquee({ items = DEFAULT_ITEMS }: MarqueeProps) {
  // Duplicated track so the infinite loop has no visible seam.
  const track = [...items, ...items]
  return (
    <div className="relative flex overflow-hidden border-y border-border bg-primary text-primary-foreground">
      <div className="marquee-track flex shrink-0 items-center gap-8 py-4 pr-8">
        {track.map((item, i) => (
          <div key={i} className="flex items-center gap-8" aria-hidden={i >= items.length}>
            <span className="font-display text-lg font-semibold uppercase tracking-[0.2em] whitespace-nowrap md:text-2xl">
              {item}
            </span>
            <Scissors className="size-4 shrink-0 opacity-70" />
          </div>
        ))}
      </div>
    </div>
  )
}
