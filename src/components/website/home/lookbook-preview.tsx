import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { lookbookItems } from "@/data/lookbook"
import { SectionHeading } from "@/components/shared/section-heading"
import { Button } from "@/components/ui/button"

export function LookbookPreview() {
  const items = lookbookItems.filter((i) => i.published).slice(0, 4)

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading eyebrow="Lookbook" title="Tác phẩm nổi bật" description="" />
        <Button asChild variant="outline" className="shrink-0">
          <Link href="/lookbook">
            Xem lookbook <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
        {items.map((item) => (
          <Link
            key={item.id}
            href="/lookbook"
            aria-label={`Xem tác phẩm ${item.caption} trong lookbook`}
            className="group relative aspect-[4/5] overflow-hidden rounded-md"
          >
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.caption}
              fill
              sizes="(max-width: 767px) 50vw, 25vw"
              className="object-cover object-center transition-transform duration-700 ease-out motion-reduce:transition-none group-hover:scale-[1.025]"
            />
          </Link>
        ))}
      </div>
    </section>
  )
}
