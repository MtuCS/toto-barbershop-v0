import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AboutIntro() {
  return (
    <section className="border-y border-border bg-foreground text-background">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm md:aspect-[4/3]">
          <Image src="/images/about.png" alt="Câu chuyện Toto" fill sizes="(max-width:768px) 100vw, 45vw" className="object-cover" />
        </div>
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            <span className="h-px w-6 bg-primary" /> Về Toto
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-balance md:text-5xl">
            It’s not just a cut. It’s a culture.
          </h2>
          <p className="mt-5 leading-relaxed text-background/75">
            Toto ra đời từ tình yêu với văn hoá barber và tinh thần streetwear. Chúng tôi tin
            rằng một kiểu tóc đẹp là sự kết hợp giữa tay nghề, gu thẩm mỹ và cá tính riêng của
            mỗi người.
          </p>
          <p className="mt-4 leading-relaxed text-background/75">
            Bên cạnh dịch vụ, Toto còn là học viện đào tạo barber, thương hiệu grooming và
            merchandise mang đậm chất của tiệm.
          </p>
          <Button asChild size="lg" className="mt-8 h-12 px-6 text-sm font-semibold uppercase tracking-wide">
            <Link href="/about">
              Câu chuyện của chúng tôi <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
