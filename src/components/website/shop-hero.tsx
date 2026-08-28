"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const slides = [
  {
    label: "Grooming",
    title: "Finish like a barber",
    copy: "Pomade, clay và chăm sóc tóc được chọn bởi đội ngũ TOTO.",
    image: "/images/grooming-kit.png",
    href: "/shop/grooming",
    cta: "Khám phá Grooming",
    imageClassName: "object-contain",
  },
  {
    label: "TOTO Merchandise",
    title: "Wear the attitude",
    copy: "Streetwear sinh ra từ văn hóa barber và nhịp sống đường phố.",
    image: "/images/merch-lifestyle.png",
    href: "/shop/merchandise",
    cta: "Khám phá Merchandise",
    imageClassName: "object-cover",
  },
]

export function ShopHero() {
  const [active, setActive] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReducedMotion(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % slides.length),
      3000,
    )
    return () => window.clearInterval(timer)
  }, [reducedMotion])

  const slide = slides[active]

  return (
    <section
      className="relative isolate min-h-[min(680px,calc(100vh-4rem))] overflow-hidden bg-[#07110f] text-white"
      aria-roledescription="carousel"
      aria-label="Khám phá TOTO Shop"
    >
      {slides.map((item, index) => (
        <div
          key={item.href}
          aria-hidden={index !== active}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none",
            index === active ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src={item.image}
            alt=""
            fill
            priority
            loading="eager"
            sizes="100vw"
            className={cn("scale-105", item.imageClassName)}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/20" />
      <div className="relative mx-auto flex min-h-[inherit] max-w-[1400px] items-end px-5 pb-14 pt-28 md:px-8 md:pb-20">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#9bd0bd]">{slide.label}</p>
          <h1 className="mt-5 font-display text-6xl font-bold uppercase leading-[0.85] md:text-8xl">
            {slide.title}
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-white/75">{slide.copy}</p>
          <Link
            href={slide.href}
            className="mt-8 inline-flex min-h-12 items-center gap-3 bg-white px-5 text-xs font-bold uppercase tracking-[0.12em] text-[#101715] transition-colors hover:bg-[#dce9e4] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            {slide.cta} <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="absolute bottom-8 left-5 flex gap-2 md:left-8">
        {slides.map((item, index) => (
          <button
            key={item.href}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Xem slide ${index + 1}: ${item.label}`}
            aria-current={index === active ? "true" : undefined}
            className={cn(
              "min-h-11 min-w-11 p-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
              index === active ? "" : "opacity-60 hover:opacity-100",
            )}
          >
            <span className={cn("block h-1 w-8 transition-colors", index === active ? "bg-white" : "bg-white/45")} />
          </button>
        ))}
      </div>
    </section>
  )
}