import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative border-b border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:px-6 lg:grid-cols-12 lg:gap-6 lg:py-20">
        {/* Left copy — asymmetric */}
        <div className="flex flex-col justify-center lg:col-span-5">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Est. Sài Gòn
          </span>
          {/* <h1 className="mt-5 font-display text-5xl font-bold uppercase leading-[0.9] tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Barber.
            <br />
            Culture.
            <br />
            <span className="text-primary">Craft.</span>
          </h1> */}
          <h1 className="mt-5 mb-8 font-display text-6xl font-bold uppercase leading-[0.9] tracking-tight text-foreground sm:text-7xl md:text-8xl lg:text-[8rem]">
            Barber.
            <br />
            Culture.
            <br />
            <span className="text-accent">Craft.</span>
          </h1>
          <p className="mt-6 max-w-md text-pretty leading-relaxed text-muted-foreground">
            Tiệm cắt tóc chuẩn barber, học viện đào tạo, grooming và merchandise mang tinh
            thần streetwear của Toto.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-12 px-6 text-sm font-semibold uppercase tracking-wide">
              <Link href="/services">
                Khám phá dịch vụ <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-6 text-sm font-semibold uppercase tracking-wide">
              <Link href="/shop">Vào Shop</Link>
            </Button>
          </div>
          <div className="mt-10 flex items-center gap-6">
            <div>
              <p className="font-display text-3xl font-bold">12K+</p>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Khách hàng</p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div>
              <div className="flex items-center gap-1">
                <span className="font-display text-3xl font-bold">4.9</span>
                <Star className="size-5 fill-primary text-primary" />
              </div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Đánh giá</p>
            </div>
          </div>
        </div>

        {/* Right images — asymmetric collage */}
        <div className="grid grid-cols-2 gap-3 lg:col-span-7">
          <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-sm border border-border">
            <Image src="/images/hero.png" alt="Toto Barbershop" fill priority sizes="(max-width:1024px) 100vw, 55vw" className="object-cover" />
          </div>
          <div className="relative aspect-square overflow-hidden rounded-sm border border-border">
            <Image src="/images/barber-1.png" alt="Barber tại Toto" fill sizes="28vw" className="object-cover" />
          </div>
          <div className="relative aspect-square overflow-hidden rounded-sm border border-border">
            <Image src="/images/interior.png" alt="Không gian tiệm" fill sizes="28vw" className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  )
}
