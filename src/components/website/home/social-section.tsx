import Image from "next/image"
import Link from "next/link"
import { Instagram } from "lucide-react"
import { lookbookItems } from "@/data/lookbook"
import { defaultSettings } from "@/data/settings"

export function SocialSection() {
  const images = lookbookItems.slice(0, 6)
  return (
    <section className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="flex flex-col items-center gap-3 text-center">
          <Instagram className="size-7 text-primary" />
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight md:text-4xl">
            @totobarber
          </h2>
          <p className="max-w-md text-muted-foreground">
            Theo dõi chúng tôi để cập nhật kiểu tóc, sản phẩm và hậu trường tại tiệm.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-3 gap-2 md:grid-cols-6">
          {images.map((item) => (
            <Link
              key={item.id}
              href={defaultSettings.social.instagram}
              className="group relative aspect-square overflow-hidden rounded-sm border border-border"
              aria-label="Xem trên Instagram"
            >
              <Image src={item.image || "/placeholder.svg"} alt={item.caption} fill sizes="(max-width:768px) 33vw, 16vw" className="object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/50 opacity-0 transition-opacity group-hover:opacity-100">
                <Instagram className="size-6 text-background" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
