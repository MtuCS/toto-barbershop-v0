"use client"

import { Suspense } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ProductCard } from "@/components/website/product-card"
import { ShopCatalog } from "@/components/website/shop-catalog"
import { ShopFaq } from "@/components/website/shop-faq"
import { ShopGroomingGuide } from "@/components/website/shop-grooming-guide"
import { ShopHero } from "@/components/website/shop-hero"
import { useDataStore } from "@/store/data-store"
import type { ProductCategory } from "@/types"

const featuredRows: { category: ProductCategory; eyebrow: string; title: string; href: string }[] = [
  { category: "merchandise", eyebrow: "TOTO Supply", title: "TOTO Merchandise", href: "/shop/merchandise" },
  { category: "grooming", eyebrow: "TOTO Grooming", title: "Grooming essentials", href: "/shop/grooming" },
]

export function ShopLanding() {
  const products = useDataStore((state) => state.products)

  return (
    <div className="bg-[#f5f9f7]">
      <ShopHero />
      {featuredRows.map((row) => (
        <section key={row.category} className="py-16 text-[#101715] md:py-20">
          <div className="mx-auto max-w-[1400px] px-5 md:px-8">
            <div className="flex items-end justify-between gap-5 border-b-2 border-[#101715] pb-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">{row.eyebrow}</p>
                <h2 className="mt-2 font-display text-4xl font-bold uppercase leading-none md:text-6xl">{row.title}</h2>
              </div>
              <Link href={row.href} className="inline-flex min-h-11 items-center gap-2 border border-[#101715] px-4 text-xs font-bold uppercase tracking-[0.1em] transition-colors hover:bg-[#101715] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                Xem tất cả <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
              {products
                .filter((product) => product.category === row.category)
                .slice(0, 4)
                .map((product, index) => <ProductCard key={product.id} product={product} priority={index < 4} />)}
            </div>
          </div>
        </section>
      ))}
      <Suspense fallback={null}><ShopCatalog /></Suspense>
      <ShopFaq />
      <ShopGroomingGuide />
    </div>
  )
}