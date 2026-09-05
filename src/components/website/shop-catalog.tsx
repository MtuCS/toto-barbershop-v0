"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { ProductCard } from "@/components/website/product-card"
import { cn } from "@/lib/utils"
import { useDataStore } from "@/store/data-store"
import type { ProductCategory } from "@/types"
import { getParentCategory, PRODUCT_CATEGORY_PARENTS } from "@/lib/product-taxonomy"

type CatalogCategory = ProductCategory | "all"

type ShopCatalogProps = {
  category?: ProductCategory
  title?: string
  showCategoryFilter?: boolean
}

export function ShopCatalog({
  category,
  title = "Tất cả sản phẩm",
  showCategoryFilter = true,
}: ShopCatalogProps) {
  const products = useDataStore((state) => state.products)
  const categories = useDataStore((state) => state.categories)
  const searchParams = useSearchParams()
  const [activeCategory, setActiveCategory] = useState<CatalogCategory>(category ?? "all")
  const [activeSubcategory, setActiveSubcategory] = useState(
    () => searchParams.get("category") ?? "all",
  )
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState("featured")
  const activeParent = activeCategory === "all" ? null : activeCategory
  const subcategories = useMemo(
    () => categories.filter(item => item.parent === activeParent),
    [activeParent, categories],
  )

  const list = useMemo(
    () =>
      products
        .filter(
          (product) =>
            (activeCategory === "all" || getParentCategory(product.category, categories) === activeCategory) &&
            (activeSubcategory === "all" || product.category === activeSubcategory) &&
            `${product.title} ${product.collection}`.toLowerCase().includes(query.toLowerCase()),
        )
        .sort((a, b) =>
          sort === "low"
            ? a.basePrice - b.basePrice
            : sort === "high"
              ? b.basePrice - a.basePrice
              : Number(b.featured) - Number(a.featured),
        ),
    [activeCategory, activeSubcategory, categories, products, query, sort],
  )

  return (
    <section id="all-products" className="bg-[#f5f9f7] py-16 text-[#101715] md:py-24">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="flex items-end justify-between gap-5 border-b-2 border-[#101715] pb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
              TOTO Supply
            </p>
            <h2 className="mt-2 font-display text-4xl font-bold uppercase leading-none md:text-6xl">
              {title}
            </h2>
          </div>
          <p className="hidden text-sm text-neutral-500 md:block">{list.length} sản phẩm</p>
        </div>

        {showCategoryFilter ? (
          <div className="mt-5 flex flex-wrap gap-2" aria-label="Lọc theo ngành hàng">
            {(["all", "grooming", "merchandise"] as CatalogCategory[]).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setActiveCategory(value)
                  setActiveSubcategory("all")
                }}
                className={cn(
                  "min-h-11 border px-4 text-xs font-bold uppercase tracking-[0.12em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  activeCategory === value
                    ? "border-[#101715] bg-[#101715] text-white"
                    : "border-black/20 bg-white hover:border-[#101715]",
                )}
              >
                {value === "all" ? "Tất cả" : PRODUCT_CATEGORY_PARENTS.find(item => item.value === value)?.label}
              </button>
            ))}
          </div>
        ) : null}

        {activeParent && subcategories.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2" aria-label="Lọc theo danh mục con">
            <button
              type="button"
              onClick={() => setActiveSubcategory("all")}
              className={cn(
                "min-h-10 rounded-full border px-4 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                activeSubcategory === "all"
                  ? "border-primary bg-primary text-white"
                  : "border-black/20 bg-white hover:border-primary",
              )}
            >
              Tất cả {PRODUCT_CATEGORY_PARENTS.find(item => item.value === activeParent)?.label.toLowerCase()}
            </button>
            {subcategories.map((subcategory) => (
              <button
                key={subcategory.slug}
                type="button"
                onClick={() => setActiveSubcategory(subcategory.slug)}
                className={cn(
                  "min-h-10 rounded-full border px-4 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  activeSubcategory === subcategory.slug
                    ? "border-primary bg-primary text-white"
                    : "border-black/20 bg-white hover:border-primary",
                )}
              >
                {subcategory.name}
              </button>
            ))}
          </div>
        ) : null}

        <div className="mt-7 flex flex-col gap-4 border-y border-black/10 py-4 md:flex-row md:items-center md:justify-between">
          <label className="flex min-h-11 items-center gap-3 border-b border-black/25 px-2 md:w-80">
            <Search className="size-4 text-primary" aria-hidden="true" />
            <span className="sr-only">Tìm sản phẩm</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm sản phẩm..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-500"
            />
          </label>
          <label className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-600">
            Sắp xếp
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="min-h-11 border border-black/20 bg-white px-4 text-sm font-normal normal-case tracking-normal text-[#101715] outline-none focus:border-primary"
            >
              <option value="featured">Nổi bật</option>
              <option value="low">Giá thấp đến cao</option>
              <option value="high">Giá cao đến thấp</option>
            </select>
          </label>
        </div>

        {list.length ? (
          <div className="mt-9 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
            {list.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="mt-9 border border-dashed border-black/20 py-24 text-center text-neutral-500">
            Không tìm thấy sản phẩm phù hợp.
          </div>
        )}
      </div>
    </section>
  )
}
