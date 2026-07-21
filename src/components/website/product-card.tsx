"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Plus, Check } from "lucide-react"
import { toast } from "sonner"
import type { Product, ProductVariant } from "@/types"
import { cn } from "@/lib/utils"
import { formatCurrency, discountPercent } from "@/lib/format"
import { useCartStore } from "@/store/cart-store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const [pickerOpen, setPickerOpen] = useState(false)

  const inStockVariants = product.variants.filter((v) => v.stock > 0)
  const soldOut = inStockVariants.length === 0
  const discount = discountPercent(product.basePrice, product.compareAtPrice)

  const addVariant = (variant: ProductVariant) => {
    addItem({
      variantId: variant.id,
      productId: product.id,
      slug: product.slug,
      title: product.title,
      variantName: variant.name,
      image: product.images[0],
      price: variant.price,
      maxStock: variant.stock,
    })
    toast.success("Đã thêm vào giỏ", { description: `${product.title} — ${variant.name}` })
  }

  const handleQuickAdd = () => {
    if (soldOut) return
    if (inStockVariants.length === 1) {
      addVariant(inStockVariants[0])
    } else {
      setPickerOpen(true)
    }
  }

  return (
    <div className="group flex flex-col">
      <Link href={`/shop/${product.slug}`} className="relative block overflow-hidden rounded-sm border border-border bg-muted">
        <div className="relative aspect-square">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className={cn(
              "object-cover transition-transform duration-500 group-hover:scale-105",
              soldOut && "opacity-60 grayscale",
            )}
          />
        </div>
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {discount > 0 && !soldOut ? (
            <Badge className="bg-primary text-primary-foreground">-{discount}%</Badge>
          ) : null}
          {soldOut ? <Badge variant="secondary">Hết hàng</Badge> : null}
          {product.featured && !soldOut && discount === 0 ? (
            <Badge variant="outline" className="bg-background">Nổi bật</Badge>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col pt-3">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">{product.collection}</span>
        <Link href={`/shop/${product.slug}`} className="mt-0.5 font-medium leading-snug hover:text-primary">
          {product.title}
        </Link>
        <div className="mt-1 flex items-center gap-2">
          <span className="font-display text-lg font-bold">{formatCurrency(product.basePrice)}</span>
          {product.compareAtPrice ? (
            <span className="text-sm text-muted-foreground line-through">
              {formatCurrency(product.compareAtPrice)}
            </span>
          ) : null}
        </div>

        <Button
          variant={soldOut ? "outline" : "default"}
          className="mt-3 h-10 w-full text-sm font-medium"
          onClick={handleQuickAdd}
          disabled={soldOut}
        >
          {soldOut ? (
            "Hết hàng"
          ) : (
            <>
              <Plus className="size-4" /> Thêm nhanh
            </>
          )}
        </Button>
      </div>

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Chọn phiên bản</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{product.title}</p>
          <div className="flex flex-col gap-2">
            {product.variants.map((variant) => {
              const out = variant.stock <= 0
              return (
                <button
                  key={variant.id}
                  disabled={out}
                  onClick={() => {
                    addVariant(variant)
                    setPickerOpen(false)
                  }}
                  className={cn(
                    "flex items-center justify-between rounded-sm border border-border px-4 py-3 text-left text-sm transition-colors hover:border-primary hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Check className="size-4 text-primary opacity-0" />
                    {variant.name}
                    {out ? <span className="text-xs text-muted-foreground">(hết hàng)</span> : null}
                  </span>
                  <span className="font-semibold">{formatCurrency(variant.price)}</span>
                </button>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
