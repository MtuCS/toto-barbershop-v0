"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Minus, Plus, ShoppingCart, Zap, ZapOff } from "lucide-react"
import type { Product } from "@/types"
import { formatCurrency } from "@/lib/format"
import { useCartStore } from "@/store/cart-store"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProductCard } from "@/components/website/product-card"

export function ProductDetail({ product, relatedProducts = [] }: { product: Product; relatedProducts?: Product[] }) {
  const [variantId, setVariantId] = useState(product.variants.find((variant) => variant.stock > 0)?.id ?? product.variants[0].id)
  const [quantity, setQuantity] = useState(1)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const variant = product.variants.find((item) => item.id === variantId)!
  const addItem = useCartStore((s) => s.addItem)
  const setCartOpen = useCartStore((s) => s.setOpen)
  const router = useRouter()
  const addSelected = (action: "cart" | "buy") => {
    if (!variant.stock) return
    addItem({ variantId: variant.id, productId: product.id, slug: product.slug, title: product.title, variantName: variant.name, image: product.images[0], price: variant.price, maxStock: variant.stock }, quantity)
    setCartOpen(false)
    if (action === "buy") router.push("/checkout")
    else setConfirmationOpen(true)
  }
  return <>
    <section className="bg-[#f5f9f7] py-8 text-[#101715] md:py-12"><div className="mx-auto max-w-[1400px] px-5 md:px-8">
      <Link href="/shop" className="mb-7 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-neutral-600 transition-colors hover:text-primary"><ArrowLeft className="size-4" />Quay lại cửa hàng</Link>
      <div className="grid gap-10 md:grid-cols-2 md:gap-14">
        <div className="grid gap-3 sm:grid-cols-2">{product.images.map((src, index) => <div key={src} className={`relative aspect-square overflow-hidden rounded-sm border border-black/10 bg-white ${index === 0 ? "sm:col-span-2" : ""}`}><Image src={src} alt={`${product.title} ${index + 1}`} fill priority={index === 0} sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" /></div>)}</div>
        <div className="md:sticky md:top-24 md:self-start"><p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">{product.collection}</p><h1 className="mt-3 font-display text-5xl font-bold uppercase leading-none md:text-6xl">{product.title}</h1><p className="mt-5 text-2xl font-bold text-[#d71920]">{formatCurrency(variant.price)}</p><p className="mt-6 leading-7 text-neutral-600">{product.description}</p>
          <div className="mt-8"><p className="mb-3 text-sm font-semibold">Chọn phiên bản</p><div className="flex flex-wrap gap-2">{product.variants.map((item) => <button key={item.id} type="button" disabled={!item.stock} onClick={() => { setVariantId(item.id); setQuantity(1) }} className={`min-h-11 border px-4 py-3 text-sm transition-colors ${variantId === item.id ? "border-primary bg-primary text-white" : "border-black/20 bg-white hover:border-primary"} disabled:cursor-not-allowed disabled:opacity-35`}>{item.name}</button>)}</div></div>
          <div className="mt-6 flex items-center gap-4"><span className="text-sm font-semibold">Số lượng</span><div className="flex items-center border border-black/20 bg-white"><button type="button" aria-label="Giảm số lượng" className="flex size-10 items-center justify-center" onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus className="size-4" /></button><span className="w-10 text-center text-sm">{quantity}</span><button type="button" aria-label="Tăng số lượng" className="flex size-10 items-center justify-center disabled:opacity-40" disabled={quantity >= variant.stock} onClick={() => setQuantity((value) => Math.min(variant.stock, value + 1))}><Plus className="size-4" /></button></div><span className="text-xs text-primary">Còn {variant.stock} sản phẩm</span></div>
          <div className="mt-7 grid grid-cols-2 gap-3">{variant.stock === 0 ? (<><Button size="lg" variant="outline" className="h-14 uppercase opacity-50 cursor-not-allowed" disabled><ShoppingCart />Hết hàng</Button><Button size="lg" className="h-14 uppercase cursor-not-allowed bg-neutral-300 text-neutral-500 hover:bg-neutral-300" disabled><ZapOff />Hết hàng</Button></>) : (<><Button size="lg" variant="outline" className="h-14 uppercase" onClick={() => addSelected("cart")}><ShoppingCart />Thêm giỏ</Button><Button size="lg" className="h-14 bg-primary uppercase hover:bg-[#2f7a68]" onClick={() => addSelected("buy")}><Zap />Mua ngay</Button></>)}</div>
          <div className="mt-8 grid grid-cols-3 border-y border-black/10 py-5 text-center text-[10px] uppercase tracking-wide sm:text-xs"><span>Giao toàn quốc</span><span>Đổi trong 7 ngày</span><span>Chính hãng 100%</span></div>
        </div>
      </div>
    </div></section>
    {relatedProducts.length > 0 ? <section className="bg-white py-14 text-[#101715] md:py-20"><div className="mx-auto max-w-[1400px] px-5 md:px-8"><div className="border-b-2 border-[#101715] pb-4"><p className="text-xs font-bold uppercase tracking-[.2em] text-primary">Cùng chủng loại {product.collection}</p><h2 className="mt-2 font-display text-3xl font-bold uppercase md:text-5xl">Sản phẩm liên quan</h2></div><div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-4 md:gap-x-6">{relatedProducts.map((item) => <ProductCard key={item.id} product={item} />)}</div></div></section> : null}
    <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}><DialogContent className="sm:max-w-md"><DialogHeader><DialogTitle className="flex items-center gap-2 font-display uppercase"><span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="size-4" /></span>Đã thêm vào giỏ hàng</DialogTitle><DialogDescription>{product.title} đã được thêm vào giỏ hàng của bạn.</DialogDescription></DialogHeader><DialogFooter className="sm:flex-row sm:justify-stretch"><Button variant="outline" className="flex-1" onClick={() => setConfirmationOpen(false)}>Tiếp tục mua sắm</Button><Button asChild className="flex-1" onClick={() => setConfirmationOpen(false)}><Link href="/cart">Đi đến giỏ hàng</Link></Button></DialogFooter></DialogContent></Dialog>
  </>
}
