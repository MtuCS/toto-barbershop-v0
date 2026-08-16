"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, ShoppingCart, Zap } from "lucide-react"
import type { Product, ProductVariant } from "@/types"
import { cn } from "@/lib/utils"
import { formatCurrency, discountPercent } from "@/lib/format"
import { useCartStore } from "@/store/cart-store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function ProductCard({ product, priority = false }: { product: Product; featured?: boolean; priority?: boolean }) {
  const addItem = useCartStore((s) => s.addItem)
  const setCartOpen = useCartStore((s) => s.setOpen)
  const router = useRouter()
  const [pickerOpen, setPickerOpen] = useState(false)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<"cart" | "buy" | null>(null)
  const inStockVariants = product.variants.filter((v) => v.stock > 0)
  const soldOut = inStockVariants.length === 0
  const discount = discountPercent(product.basePrice, product.compareAtPrice)

  const completeAction = (variant: ProductVariant, action: "cart" | "buy") => {
    addItem({ variantId: variant.id, productId: product.id, slug: product.slug, title: product.title, variantName: variant.name, image: product.images[0], price: variant.price, maxStock: variant.stock })
    setCartOpen(false)
    if (action === "buy") router.push("/checkout")
    else setConfirmationOpen(true)
  }

  const startAction = (action: "cart" | "buy") => {
    if (soldOut) return
    if (inStockVariants.length === 1) completeAction(inStockVariants[0], action)
    else { setPendingAction(action); setPickerOpen(true) }
  }

  return (
    <div className="group flex flex-col">
      <Link href={`/shop/${product.slug}`} className="relative block overflow-hidden rounded-sm border border-border bg-muted">
        <div className="relative aspect-square"><Image src={product.images[0] || "/placeholder.svg"} alt={product.title} fill priority={priority} sizes="(max-width: 768px) 50vw, 25vw" className={cn("object-cover transition-transform duration-500 group-hover:scale-105", soldOut && "opacity-60 grayscale")} /></div>
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {discount > 0 && !soldOut ? <Badge className="bg-primary text-primary-foreground">-{discount}%</Badge> : null}
          {soldOut ? <Badge variant="secondary">Hết hàng</Badge> : null}
          {product.featured && !soldOut && discount === 0 ? <Badge variant="outline" className="bg-background">Nổi bật</Badge> : null}
        </div>
      </Link>
      <div className="flex flex-1 flex-col pt-3">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">{product.collection}</span>
        <Link href={`/shop/${product.slug}`} className="mt-0.5 font-medium leading-snug hover:text-primary">{product.title}</Link>
        <div className="mt-1 flex items-center gap-2"><span className="font-display text-lg font-bold">{formatCurrency(product.basePrice)}</span>{product.compareAtPrice ? <span className="text-sm text-muted-foreground line-through">{formatCurrency(product.compareAtPrice)}</span> : null}</div>
        <div className="mt-3 grid grid-cols-[1fr_1.35fr] gap-2">
          <Button variant="outline" className="h-10 font-semibold" onClick={() => startAction("cart")} disabled={soldOut} aria-label={`Thêm ${product.title} vào giỏ`}><ShoppingCart className="size-4" /><span className="hidden sm:inline">Giỏ</span></Button>
          <Button className="h-10 bg-primary font-semibold hover:bg-[#2f7a68]" onClick={() => startAction("buy")} disabled={soldOut}><Zap className="size-4" />{soldOut ? "Hết hàng" : "Mua ngay"}</Button>
        </div>
      </div>
      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="sm:max-w-sm"><DialogHeader><DialogTitle>Chọn phiên bản</DialogTitle><DialogDescription>{product.title}</DialogDescription></DialogHeader><div className="flex flex-col gap-2">
          {product.variants.map((variant) => { const out = variant.stock <= 0; return <button key={variant.id} disabled={out} onClick={() => { completeAction(variant, pendingAction ?? "cart"); setPickerOpen(false) }} className="flex items-center justify-between rounded-sm border border-border px-4 py-3 text-left text-sm transition-colors hover:border-primary hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"><span>{variant.name}{out ? <span className="ml-2 text-xs text-muted-foreground">(hết hàng)</span> : null}</span><span className="font-semibold">{formatCurrency(variant.price)}</span></button> })}
        </div></DialogContent>
      </Dialog>
      <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <DialogContent className="sm:max-w-md"><DialogHeader><DialogTitle className="flex items-center gap-2 font-display uppercase"><span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="size-4" /></span>Đã thêm vào giỏ hàng</DialogTitle><DialogDescription>{product.title} đã được thêm vào giỏ hàng của bạn.</DialogDescription></DialogHeader><DialogFooter className="sm:flex-row sm:justify-stretch"><Button variant="outline" className="flex-1" onClick={() => setConfirmationOpen(false)}>Tiếp tục mua sắm</Button><Button asChild className="flex-1" onClick={() => setConfirmationOpen(false)}><Link href="/cart">Đi đến giỏ hàng</Link></Button></DialogFooter></DialogContent>
      </Dialog>
    </div>
  )
}
