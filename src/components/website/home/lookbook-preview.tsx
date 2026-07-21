import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { lookbookItems } from "@/data/lookbook"
import { SectionHeading } from "@/components/shared/section-heading"
import { Button } from "@/components/ui/button"

export function LookbookPreview() {
  const items = lookbookItems.filter((i) => i.published).slice(0, 6)

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading eyebrow="Lookbook" title="Phong cách Toto" description="Những kiểu tóc và khoảnh khắc tại tiệm." />
        <Button asChild variant="outline" className="shrink-0">
          <Link href="/lookbook">
            Xem lookbook <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {items.map((item, i) => (
          <Link
            key={item.id}
            href="/lookbook"
            className="group relative aspect-[3/4] overflow-hidden rounded-sm border border-border"
          >
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.caption}
              fill
              sizes="(max-width:768px) 50vw, 16vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-foreground/70 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-xs font-medium text-background">{item.caption}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
