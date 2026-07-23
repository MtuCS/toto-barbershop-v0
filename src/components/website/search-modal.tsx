"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)

    if (!val.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/products/search?q=${encodeURIComponent(val)}`)
      if (res.ok) {
        const data = await res.json()
        setResults(data)
      }
    } catch (err) {
      console.error("Search failed", err)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-20 backdrop-blur-sm">
      <div className="relative w-full max-w-xl rounded-xl border border-border bg-background p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        >
          <X className="size-5" />
        </button>

        <h3 className="mb-4 text-lg font-bold uppercase tracking-wider">Tìm kiếm sản phẩm</h3>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Nhập tên sản phẩm, sáp, áo thun..."
            value={query}
            onChange={handleSearch}
            className="pl-10"
            autoFocus
          />
        </div>

        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <p className="py-4 text-center text-sm text-muted-foreground">Đang tìm kiếm...</p>
          ) : results.length > 0 ? (
            <div className="flex flex-col gap-3">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop`}
                  onClick={onClose}
                  className="flex items-center gap-4 rounded-lg p-2 hover:bg-muted/50 transition-colors"
                >
                  <div className="relative size-12 overflow-hidden rounded border border-border">
                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{product.name}</h4>
                    <p className="text-xs text-muted-foreground">{product.category} • {product.price.toLocaleString("vi-VN")} ₫</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : query ? (
            <p className="py-4 text-center text-sm text-muted-foreground">Không tìm thấy sản phẩm phù hợp.</p>
          ) : (
            <p className="py-4 text-center text-xs text-muted-foreground uppercase tracking-wider">Gõ từ khóa để tìm kiếm sản phẩm ToTo</p>
          )}
        </div>
      </div>
    </div>
  )
}
