"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react"
import { useMemo, useState } from "react"
import { useCartStore } from "@/store/cart-store"
import { useDataStore } from "@/store/data-store"
import { formatCurrency } from "@/lib/format"
import { FREE_SHIPPING_THRESHOLD, MOCK_COUPONS, SHIPPING_FLAT_FEE } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/website/product-card"

export function CartPage() {
  const items = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const clearCart = useCartStore((s) => s.clearCart)
  const products = useDataStore((s) => s.products)
  const [couponInput, setCouponInput] = useState("")
  const [coupon, setCoupon] = useState<string | null>(null)
  const [couponError, setCouponError] = useState("")
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_FEE
  const discount = coupon ? (() => { const rule = MOCK_COUPONS[coupon]; return rule.type === "percent" ? Math.round(subtotal * rule.value / 100) : rule.value })() : 0
  const total = Math.max(0, subtotal + shipping - discount)
  const suggestions = useMemo(() => {
    const collection = items[0]?.slug && products.find((product) => product.slug === items[0]?.slug)?.collection
    return products.filter((product) => !items.some((item) => item.productId === product.id) && (!collection || product.collection === collection)).slice(0, 4)
  }, [items, products])
  const applyCoupon = () => { const value = couponInput.trim().toUpperCase(); if (MOCK_COUPONS[value]) { setCoupon(value); setCouponError("") } else { setCoupon(null); setCouponError("Mã giảm giá không hợp lệ.") } }

  return <section className="bg-[#f5f9f7] py-8 text-[#101715] md:py-12"><div className="mx-auto max-w-[1400px] px-5 md:px-8">
    <div className="mb-8 flex items-end justify-between border-b-2 border-[#101715] pb-5"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-primary">TOTO Supply</p><h1 className="mt-2 font-display text-4xl font-bold uppercase md:text-6xl">Giỏ hàng của bạn</h1></div><span className="hidden text-sm text-neutral-500 md:block">{items.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm</span></div>
    {!items.length ? <div className="flex min-h-80 flex-col items-center justify-center border border-dashed border-black/20 bg-white px-6 text-center"><ShoppingBag className="size-10 text-primary" /><h2 className="mt-4 font-display text-2xl font-bold uppercase">Giỏ hàng đang trống</h2><p className="mt-2 max-w-sm text-sm text-neutral-600">Khám phá grooming và merchandise được tuyển chọn tại TOTO.</p><Button asChild className="mt-6"><Link href="/shop">Tiếp tục mua sắm</Link></Button></div> : <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="overflow-hidden border border-black/10 bg-white"><div className="divide-y divide-black/10">{items.map((item) => <article key={item.variantId} className="flex gap-4 p-4 sm:gap-5 sm:p-5"><Link href={`/shop/${item.slug}`} className="relative size-24 shrink-0 overflow-hidden border border-black/10 bg-muted sm:size-28"><Image src={item.image || "/placeholder.svg"} alt={item.title} fill sizes="112px" className="object-cover" /></Link><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div><Link href={`/shop/${item.slug}`} className="font-semibold hover:text-primary">{item.title}</Link><p className="mt-1 text-xs text-neutral-500">{item.variantName}</p></div><button type="button" onClick={() => removeItem(item.variantId)} className="p-1 text-neutral-400 hover:text-destructive" aria-label={`Xóa ${item.title}`}><Trash2 className="size-4" /></button></div><div className="mt-5 flex items-end justify-between gap-3"><div className="flex items-center border border-black/20"><button type="button" className="flex size-9 items-center justify-center" onClick={() => updateQuantity(item.variantId, item.quantity - 1)} aria-label="Giảm số lượng"><Minus className="size-4" /></button><span className="w-9 text-center text-sm">{item.quantity}</span><button type="button" className="flex size-9 items-center justify-center disabled:opacity-40" onClick={() => updateQuantity(item.variantId, item.quantity + 1)} disabled={item.quantity >= item.maxStock} aria-label="Tăng số lượng"><Plus className="size-4" /></button></div><strong className="text-primary">{formatCurrency(item.price * item.quantity)}</strong></div></div></article>)}</div><div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/10 bg-neutral-50 px-5 py-4 text-sm"><Link href="/shop" className="font-semibold text-primary hover:underline">← Tiếp tục mua sắm</Link><button type="button" className="text-destructive hover:underline" onClick={clearCart}>Xóa giỏ hàng</button></div></div>
      <aside className="h-fit border border-black/10 bg-white p-5 lg:sticky lg:top-24"><h2 className="font-display text-2xl font-bold uppercase">Tóm tắt đơn hàng</h2><div className="mt-5 border-y border-black/10 py-4"><label className="text-xs font-bold uppercase tracking-wide">Mã giảm giá</label><div className="mt-2 flex gap-2"><input value={couponInput} onChange={(event) => setCouponInput(event.target.value)} placeholder="Nhập mã giảm giá" className="min-w-0 flex-1 border border-black/20 px-3 text-sm outline-none focus:border-primary" /><Button type="button" onClick={applyCoupon}>Áp dụng</Button></div>{couponError ? <p className="mt-2 text-xs text-destructive">{couponError}</p> : null}{coupon ? <p className="mt-2 text-xs text-primary">Đã áp dụng mã {coupon}</p> : null}</div><dl className="space-y-3 py-5 text-sm"><div className="flex justify-between"><dt>Tạm tính</dt><dd>{formatCurrency(subtotal)}</dd></div><div className="flex justify-between"><dt>Phí vận chuyển</dt><dd>{shipping ? formatCurrency(shipping) : <span className="text-primary">Miễn phí</span>}</dd></div>{discount ? <div className="flex justify-between text-primary"><dt>Giảm giá</dt><dd>-{formatCurrency(discount)}</dd></div> : null}</dl><div className="flex items-end justify-between border-t border-black/10 pt-4"><span className="font-semibold">Thành tiền</span><strong className="font-display text-2xl text-[#d71920]">{formatCurrency(total)}</strong></div><Button asChild className="mt-5 h-12 w-full bg-[#101715] uppercase hover:bg-[#101715]/80"><Link href="/checkout">Tiến hành thanh toán →</Link></Button><div className="mt-4 flex gap-2 text-xs text-neutral-500"><Truck className="mt-0.5 size-4 text-primary" />{subtotal < FREE_SHIPPING_THRESHOLD ? `Mua thêm ${formatCurrency(FREE_SHIPPING_THRESHOLD - subtotal)} để được miễn phí vận chuyển.` : "Đơn hàng của bạn được miễn phí vận chuyển."}</div></aside>
    </div>}
    {suggestions.length ? <section className="mt-14"><h2 className="border-b-2 border-[#101715] pb-4 font-display text-3xl font-bold uppercase">Có thể bạn cũng thích</h2><div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-4 md:gap-x-6">{suggestions.map((product) => <ProductCard key={product.id} product={product} />)}</div></section> : null}
  </div></section>
}

