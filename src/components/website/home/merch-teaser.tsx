import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MerchTeaser() {
  return (
    <section className="relative border-y border-border">
      <div className="relative min-h-[70vh] overflow-hidden">
        <Image
          src="/images/merch-story-hero.png"
          alt="Toto Merchandise"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/60 to-foreground/20" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
            <div className="max-w-xl text-background">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-background/80">
                <span className="h-px w-6 bg-primary" /> Merchandise
              </span>
              <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.9] tracking-tight text-balance md:text-6xl">
                Mặc lên tinh thần của tiệm
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-background/80">
                Bộ sưu tập streetwear giới hạn — tee, hoodie, cap và phụ kiện. Một câu chuyện
                về văn hoá barber, không chỉ là quần áo.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="h-12 px-6 text-sm font-semibold uppercase tracking-wide">
                  <Link href="/merchandise">
                    Xem câu chuyện <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 border-background/40 bg-transparent px-6 text-sm font-semibold uppercase tracking-wide text-background hover:bg-background hover:text-foreground"
                >
                  <Link href="/shop/merchandise">Mua ngay</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
