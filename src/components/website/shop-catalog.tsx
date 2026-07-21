"use client"
import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { products } from "@/data/products"
import { ProductCard } from "@/components/website/product-card"

export function ShopCatalog({ category }: { category?: "grooming" | "merchandise" }) {
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState("featured")
  const list = useMemo(() => products.filter(p => (!category || p.category === category) && `${p.title} ${p.collection}`.toLowerCase().includes(query.toLowerCase())).sort((a,b) => sort === "low" ? a.basePrice-b.basePrice : sort === "high" ? b.basePrice-a.basePrice : Number(b.featured)-Number(a.featured)), [category, query, sort])
  return <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
    <div className="mb-10 flex flex-col gap-3 border-y py-4 md:flex-row md:items-center md:justify-between">
      <label className="flex items-center gap-2 border-b px-2 py-2 md:w-80"><Search className="size-4 text-primary"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Tìm sản phẩm..." className="w-full bg-transparent text-sm outline-none" /></label>
      <select value={sort} onChange={e=>setSort(e.target.value)} className="border bg-background px-4 py-2 text-sm"><option value="featured">Nổi bật</option><option value="low">Giá thấp đến cao</option><option value="high">Giá cao đến thấp</option></select>
    </div>
    {list.length ? <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">{list.map(p=><ProductCard key={p.id} product={p}/>)}</div> : <div className="py-24 text-center text-muted-foreground">Không tìm thấy sản phẩm phù hợp.</div>}
  </section>
}
