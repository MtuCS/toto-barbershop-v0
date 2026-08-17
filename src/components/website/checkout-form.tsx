"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, CreditCard, Loader2, MapPin, Tag, Truck } from "lucide-react"
import { toast } from "sonner"
import { useCartStore } from "@/store/cart-store"
import { useCustomerUserStore } from "@/store/customer-user-store"
import { formatCurrency } from "@/lib/format"
import { FREE_SHIPPING_THRESHOLD, MOCK_COUPONS, SHIPPING_FLAT_FEE } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { useMounted } from "@/hooks/use-mounted"

export function CheckoutForm() {
  const router = useRouter()
  const items = useCartStore((s) => s.items)
  const clear = useCartStore((s) => s.clear)
  const { user, token } = useCustomerUserStore()
  const mounted = useMounted()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [couponInput, setCouponInput] = useState("")
  const [coupon, setCoupon] = useState<string | null>(null)
  const [couponError, setCouponError] = useState("")
  const [provinces, setProvinces] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [wards, setWards] = useState<any[]>([])
  const [form, setForm] = useState({ name: "", phone: "", email: "", provinceCode: "", provinceName: "", districtCode: "", districtName: "", wardCode: "", wardName: "", street: "", note: "", payment: "cod" })

  useEffect(() => {
    if (!provinces.length) fetch("https://provinces.open-api.vn/api/p/").then(r=>r.json()).then(setProvinces)
  }, [provinces.length])

  useEffect(() => {
    if (!user) return
    const timeout = window.setTimeout(() => {
      const address = user.addresses?.find((item) => item.isDefault) ?? user.addresses?.[0]
      if (address) {
        setForm((current) => ({ ...current, name: user.name || current.name, phone: user.phone || current.phone, email: user.email || current.email, street: address.street, provinceName: address.province, districtName: address.district, wardName: address.ward }))
        fetch("https://provinces.open-api.vn/api/p/").then(r=>r.json()).then(provs => {
          setProvinces(provs)
          const p = provs.find((x:any) => x.name === address.province)
          if(p) {
            setForm(c => ({...c, provinceCode: p.code}))
            fetch(`https://provinces.open-api.vn/api/p/${p.code}?depth=2`).then(r=>r.json()).then(data => {
              setDistricts(data.districts)
              const d = data.districts.find((x:any) => x.name === address.district)
              if(d) {
                setForm(c => ({...c, districtCode: d.code}))
                fetch(`https://provinces.open-api.vn/api/d/${d.code}?depth=2`).then(r=>r.json()).then(wData => {
                  setWards(wData.wards)
                  const w = wData.wards.find((x:any) => x.name === address.ward)
                  if(w) setForm(c => ({...c, wardCode: w.code}))
                })
              }
            })
          }
        })
      } else {
        setForm((current) => ({ ...current, name: user.name || current.name, phone: user.phone || current.phone, email: user.email || current.email }))
      }
    }, 0)
    return () => window.clearTimeout(timeout)
  }, [user])

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items])
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_FEE
  const discount = coupon ? (() => { const rule = MOCK_COUPONS[coupon]; return rule.type === "percent" ? Math.round(subtotal * rule.value / 100) : rule.value })() : 0
  const total = Math.max(0, subtotal + shipping - discount)
  const setField = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }))
  const applyCoupon = () => { const value = couponInput.trim().toUpperCase(); if (MOCK_COUPONS[value]) { setCoupon(value); setCouponError("") } else { setCoupon(null); setCouponError("Mã giảm giá không hợp lệ.") } }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!items.length || isSubmitting) return
    if (!form.provinceName || !form.districtName || !form.wardName || !form.street) { toast.error("Vui lòng nhập đầy đủ địa chỉ giao hàng"); return }
    const fullAddress = `${form.street}, ${form.wardName}, ${form.districtName}, ${form.provinceName}`
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/orders/checkout", { method: "POST", headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ items: items.map((item) => ({ productId: item.productId, variantId: item.variantId, quantity: item.quantity, price: item.price })), customer: { name: form.name, phone: form.phone, email: form.email, address: fullAddress, note: form.note }, email: form.email, address: fullAddress, note: form.note, total, discount, promoCode: coupon ?? undefined, paymentMethod: form.payment, idempotencyKey: crypto.randomUUID() }) })
      if (!response.ok) { const error = await response.json().catch(() => ({})); throw new Error(error.error || "Không thể tạo đơn hàng. Vui lòng thử lại.") }
      const order = await response.json()
      clear()
      if (order.checkoutUrl) { window.location.href = order.checkoutUrl; return }
      router.push(`/order-success?code=${order.id}`)
    } catch (error) { toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra") } finally { setIsSubmitting(false) }
  }

  if (!mounted) return null
  if (!items.length) return <div className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center px-5 text-center"><CreditCard className="size-10 text-primary" /><h1 className="mt-4 font-display text-3xl font-bold uppercase">Chưa có sản phẩm để thanh toán</h1><Button asChild className="mt-6"><Link href="/shop">Quay lại cửa hàng</Link></Button></div>
  return <main className="bg-[#f5f9f7] py-8 text-[#101715] md:py-12"><div className="mx-auto max-w-[1240px] px-5 md:px-8">
    <div className="mb-8 grid grid-cols-3 gap-2 text-center text-[10px] font-bold uppercase tracking-wide sm:text-xs"><Link href="/cart" className="border-b-2 border-primary pb-3">1. Giỏ hàng</Link><span className="border-b-2 border-primary pb-3 text-primary">2. Thanh toán</span><span className="border-b-2 border-black/10 pb-3 text-neutral-400">3. Hoàn tất</span></div>
    <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_380px]"><form id="checkout-form" onSubmit={submit} className="space-y-5"><div><h1 className="font-display text-4xl font-bold uppercase md:text-5xl">Thanh toán</h1><p className="mt-2 text-sm text-neutral-600">Điền thông tin để hoàn tất đơn hàng. Bạn không cần đăng nhập.</p></div>
      <section className="border border-black/10 bg-white p-5"><h2 className="flex items-center gap-2 font-display text-xl font-bold uppercase"><MapPin className="size-5 text-primary" />Thông tin nhận hàng</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">Họ và tên*<input required value={form.name} onChange={(e) => setField("name", e.target.value)} className="mt-2 h-11 w-full border border-black/20 px-3 text-sm outline-none focus:border-primary" placeholder="Nguyễn Văn A" /></label><label className="text-sm font-medium">Số điện thoại*<input required type="tel" value={form.phone} onChange={(e) => setField("phone", e.target.value)} className="mt-2 h-11 w-full border border-black/20 px-3 text-sm outline-none focus:border-primary" placeholder="09xxxxxxxx" /></label><label className="text-sm font-medium sm:col-span-2">Email nhận xác nhận đơn*<input required type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} className="mt-2 h-11 w-full border border-black/20 px-3 text-sm outline-none focus:border-primary" placeholder="you@example.com" /></label>
      
      <div className="sm:col-span-2 space-y-4 pt-2">
        <label className="text-sm font-medium block">Địa chỉ giao hàng*</label>
        <div className="grid gap-3 sm:grid-cols-3">
          <select required value={form.provinceCode} className="h-11 w-full border border-black/20 px-3 text-sm outline-none focus:border-primary bg-white" onChange={(e) => { const p = provinces.find(x => x.code == e.target.value); setForm(c => ({...c, provinceCode: p?.code||"", provinceName: p?.name||"", districtCode: "", districtName: "", wardCode: "", wardName: ""})); if(p) { fetch(`https://provinces.open-api.vn/api/p/${p.code}?depth=2`).then(r=>r.json()).then(d=>setDistricts(d.districts)) } else { setDistricts([]); setWards([]) } }}>
            <option value="">Tỉnh/Thành phố</option>
            {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
          </select>
          <select required disabled={!form.provinceCode} value={form.districtCode} className="h-11 w-full border border-black/20 px-3 text-sm outline-none focus:border-primary disabled:bg-neutral-100 bg-white" onChange={(e) => { const d = districts.find(x => x.code == e.target.value); setForm(c => ({...c, districtCode: d?.code||"", districtName: d?.name||"", wardCode: "", wardName: ""})); if(d) { fetch(`https://provinces.open-api.vn/api/d/${d.code}?depth=2`).then(r=>r.json()).then(w=>setWards(w.wards)) } else { setWards([]) } }}>
            <option value="">Quận/Huyện</option>
            {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
          </select>
          <select required disabled={!form.districtCode} value={form.wardCode} className="h-11 w-full border border-black/20 px-3 text-sm outline-none focus:border-primary disabled:bg-neutral-100 bg-white" onChange={(e) => { const w = wards.find(x => x.code == e.target.value); setForm(c => ({...c, wardCode: w?.code||"", wardName: w?.name||""})) }}>
            <option value="">Phường/Xã</option>
            {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
          </select>
        </div>
        <input required value={form.street} onChange={(e) => setField("street", e.target.value)} className="h-11 w-full border border-black/20 px-3 text-sm outline-none focus:border-primary" placeholder="Số nhà, tên đường..." />
      </div>

      <label className="text-sm font-medium sm:col-span-2">Ghi chú (tùy chọn)<textarea value={form.note} onChange={(e) => setField("note", e.target.value)} className="mt-2 min-h-20 w-full border border-black/20 px-3 py-2 text-sm outline-none focus:border-primary" placeholder="Thời gian nhận hàng, lưu ý cho shipper..." /></label></div></section>
      <section className="border border-black/10 bg-white p-5"><h2 className="flex items-center gap-2 font-display text-xl font-bold uppercase"><Truck className="size-5 text-primary" />Giao hàng</h2><div className="mt-4 border border-primary bg-primary/5 p-4 text-sm"><strong>Tiêu chuẩn (1–3 ngày)</strong><p className="mt-1 text-neutral-600">{shipping ? formatCurrency(shipping) : "Miễn phí vận chuyển"}</p></div></section>
      <section className="border border-black/10 bg-white p-5"><h2 className="flex items-center gap-2 font-display text-xl font-bold uppercase"><CreditCard className="size-5 text-primary" />Thanh toán</h2><div className="mt-4 grid gap-3"><label className={`flex cursor-pointer items-center gap-3 border p-4 ${form.payment === "cod" ? "border-primary bg-primary/5" : "border-black/15"}`}><input checked={form.payment === "cod"} onChange={() => setField("payment", "cod")} type="radio" name="payment" /><span><strong>Thanh toán khi nhận hàng (COD)</strong><small className="mt-1 block text-neutral-500">Thanh toán tiền mặt cho shipper.</small></span></label><label className={`flex cursor-pointer items-center gap-3 border p-4 ${form.payment === "payos" ? "border-primary bg-primary/5" : "border-black/15"}`}><input checked={form.payment === "payos"} onChange={() => setField("payment", "payos")} type="radio" name="payment" /><span><strong>Chuyển khoản / VietQR</strong><small className="mt-1 block text-neutral-500">Bạn sẽ được chuyển đến trang thanh toán an toàn.</small></span></label></div></section>
    </form><aside className="h-fit border border-black/10 bg-white p-5 lg:sticky lg:top-24"><h2 className="font-display text-2xl font-bold uppercase">Đơn hàng của bạn</h2><div className="mt-5 max-h-72 space-y-4 overflow-y-auto border-y border-black/10 py-4">{items.map((item) => <div key={item.variantId} className="flex gap-3"><div className="relative size-16 shrink-0 overflow-hidden border border-black/10"><Image src={item.image} alt={item.title} fill sizes="64px" className="object-cover" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{item.title}</p><p className="text-xs text-neutral-500">{item.variantName} × {item.quantity}</p><p className="mt-1 text-sm font-bold">{formatCurrency(item.price * item.quantity)}</p></div></div>)}</div><div className="py-4"><label className="text-xs font-bold uppercase tracking-wide"><Tag className="mr-1 inline size-3.5" />Mã giảm giá</label><div className="mt-2 flex gap-2"><input value={couponInput} onChange={(e) => setCouponInput(e.target.value)} className="min-w-0 flex-1 border border-black/20 px-3 text-sm" placeholder="Nhập mã" /><Button type="button" onClick={applyCoupon}>Áp dụng</Button></div>{couponError ? <p className="mt-2 text-xs text-destructive">{couponError}</p> : coupon ? <p className="mt-2 text-xs text-primary">Đã áp dụng {coupon}</p> : null}</div><dl className="space-y-3 border-t border-black/10 py-4 text-sm"><div className="flex justify-between"><dt>Tạm tính</dt><dd>{formatCurrency(subtotal)}</dd></div><div className="flex justify-between"><dt>Phí vận chuyển</dt><dd>{shipping ? formatCurrency(shipping) : "Miễn phí"}</dd></div>{discount ? <div className="flex justify-between text-primary"><dt>Giảm giá</dt><dd>-{formatCurrency(discount)}</dd></div> : null}</dl><div className="flex justify-between border-t border-black/10 pt-4"><strong>Tổng cộng</strong><strong className="font-display text-2xl text-[#d71920]">{formatCurrency(total)}</strong></div><Button type="submit" form="checkout-form" disabled={isSubmitting} className="mt-5 h-12 w-full bg-[#101715] uppercase hover:bg-[#101715]/80">{isSubmitting ? <Loader2 className="animate-spin" /> : <Check />} {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}</Button><Link href="/cart" className="mt-4 block text-center text-xs text-neutral-500 hover:text-primary">← Quay lại giỏ hàng</Link></aside></div>
  </div></main>
}
