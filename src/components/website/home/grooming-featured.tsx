"use client"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { useDataStore } from "@/store/data-store"
import { SectionHeading } from "@/components/shared/section-heading"
import { ProductCard } from "@/components/website/product-card"
import { Button } from "@/components/ui/button"

export function GroomingFeatured() {
  const products = useDataStore((s) => s.products)
  const items = products
    .filter((p) => p.category === "grooming" && p.status === "active")
    .slice(0, 4)

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          eyebrow="Grooming"
          title="Chăm sóc chuẩn đàn ông"
          description="Pomade, sáp, dầu gội và bộ kit — mang trải nghiệm barber về nhà."
        />
        <Button asChild variant="outline" className="shrink-0">
          <Link href="/shop/grooming">
            Tất cả grooming <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
