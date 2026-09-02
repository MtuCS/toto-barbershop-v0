"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Check, CreditCard, Loader2, MapPin, Tag, Truck } from "lucide-react"
import { toast } from "sonner"
import { useCartStore } from "@/store/cart-store"
import { useCustomerUserStore } from "@/store/customer-user-store"
import { formatCurrency } from "@/lib/format"
import { SHIPPING_FLAT_FEE } from "@/lib/constants"
import { isValidEmail, isValidPhone } from "@/lib/validation"
import { Button } from "@/components/ui/button"
import { useMounted } from "@/hooks/use-mounted"
import { clientLogger } from "@/lib/logger"

export function CheckoutForm() {
  const router = useRouter()
  const items = useCartStore((s) => s.items)
  const clear = useCartStore((s) => s.clear)
  const storedCoupon = useCartStore((s) => s.couponCode)
  const applyCouponToStore = useCartStore((s) => s.applyCoupon)
  const { user, token, setAuthModalOpen: setAuthOpen } = useCustomerUserStore()
  const mounted = useMounted()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [couponInput, setCouponInput] = useState(storedCoupon ?? "")
  const [coupon, setCoupon] = useState<string | null>(storedCoupon)
  const [discount, setDiscount] = useState(0)
  const [couponError, setCouponError] = useState("")
  const [provinces, setProvinces] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [wards, setWards] = useState<any[]>([])
  const [form, setForm] = useState({ name: "", phone: "", email: "", provinceCode: "", provinceName: "", districtCode: "", districtName: "", wardCode: "", wardName: "", street: "", note: "", payment: "cod" })

  useEffect(() => {
    if (!provinces.length) fetch("https://provinces.open-api.vn/api/p/").then(r=>r.json()).then(setProvinces)
  }, [provinces.length])

  // Đồng bộ profile mới nhất từ DB khi vào trang Checkout
  useEffect(() => {
    if (!token) return
    fetch("/api/users/profile", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const u = data?.user || data
        if (u && u.id) {
          useCustomerUserStore.getState().setUser(u, token)
          setForm((current) => ({
            ...current,
            name: u.name || current.name,
            phone: u.phone || current.phone,
            email: u.email || current.email,
          }))
        }
      })
      .catch(() => {})
  }, [token])

  // Pre-fill name/phone/email ngay khi user thay đổi (kể cả khi phone load chậm)
  useEffect(() => {
    if (!user) return
    setForm((current) => ({
      ...current,
      name: user.name || current.name,
      phone: user.phone || current.phone,
      email: user.email || current.email,
    }))
  }, [user])

  // Pre-fill địa chỉ từ profile (chỉ chạy khi user lần đầu được set)
  useEffect(() => {
    if (!user) return
    const address = user.addresses?.find((item) => item.isDefault) ?? user.addresses?.[0]
    if (!address) return

    setForm((current) => ({
      ...current,
      street: address.street,
      provinceName: address.province,
      districtName: address.district,
      wardName: address.ward,
    }))

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
  }, [user])

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items])
  const prevSubtotal = useRef(subtotal)
  
  useEffect(() => {
    // Chỉ reset mã giảm giá nếu giỏ hàng THỰC SỰ thay đổi sau khi đã load xong (subtotal từ >0 sang giá trị mới)
    if (prevSubtotal.current > 0 && prevSubtotal.current !== subtotal) {
      if (coupon) {
        setCoupon(null)
        setDiscount(0)
        setCouponInput("")
        applyCouponToStore(null)
        toast.info("Giỏ hàng thay đổi, vui lòng áp dụng lại mã giảm giá.")
      }
    } else if (prevSubtotal.current === 0 && subtotal > 0 && coupon && discount === 0) {
      // Tự động kiểm tra lại mã giảm giá khi load trang có subtotal
      fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ code: coupon, subtotal })
      }).then(res => res.json()).then(data => {
        if (data.success) {
          setDiscount(data.discount)
        } else {
          setCoupon(null)
          setDiscount(0)
          applyCouponToStore(null)
          toast.error("Mã giảm giá đã lưu không còn hợp lệ.")
        }
      }).catch(() => {})
    }
    prevSubtotal.current = subtotal;
  }, [subtotal, coupon, applyCouponToStore, discount, token])

  const shipping = subtotal === 0 || form.payment === 'payos' ? 0 : SHIPPING_FLAT_FEE
  const total = Math.max(0, subtotal + shipping - discount)
  const setField = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }))
  
  const applyCoupon = async () => { 
    const value = couponInput.trim().toUpperCase()
    if (!value) return
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ code: value, subtotal })
      })
      const data = await res.json()
      if (data.success) {
        setCoupon(data.code)
        setDiscount(data.discount)
        setCouponError("")
        applyCouponToStore(data.code)  // persist vào cart store
      } else {
        setCoupon(null)
        setDiscount(0)
        setCouponError(data.error || "Mã giảm giá không hợp lệ.")
        applyCouponToStore(null)
      }
    } catch {
      setCoupon(null)
      setDiscount(0)
      setCouponError("Lỗi kết nối. Vui lòng thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!items.length || isSubmitting) return

    if (!form.name.trim()) {
      toast.error("Vui lòng nhập họ và tên người nhận hàng.")
      return
    }
    if (!form.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại nhận hàng.")
      return
    }
    if (!isValidPhone(form.phone)) {
      toast.error("Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 số (ví dụ: 0901234567).")
      return
    }
    if (!form.email.trim()) {
      toast.error("Vui lòng nhập địa chỉ email nhận thông tin đơn hàng.")
      return
    }
    if (!isValidEmail(form.email)) {
      toast.error("Địa chỉ email không đúng định dạng. Vui lòng kiểm tra lại.")
      return
    }
    if (!form.provinceCode) {
      toast.error("Vui lòng chọn Tỉnh/Thành phố nhận hàng.")
      return
    }
    if (!form.districtCode) {
      toast.error("Vui lòng chọn Quận/Huyện nhận hàng.")
      return
    }
    if (!form.wardCode) {
      toast.error("Vui lòng chọn Phường/Xã nhận hàng.")
      return
    }
    if (!form.street.trim()) {
      toast.error("Vui lòng nhập số nhà, tên đường chi tiết.")
      return
    }
    const fullAddress = `${form.street}, ${form.wardName}, ${form.districtName}, ${form.provinceName}`
    const idempotencyKey = crypto.randomUUID()
    setIsSubmitting(true)
    clientLogger.race(`Submitting checkout order`, { idempotencyKey, itemCount: items.length, total })
    try {
      const response = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Request-Id": idempotencyKey,
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
            title: item.title,
            variantName: item.variantName,
          })),
          customer: { name: form.name, phone: form.phone, email: form.email, address: fullAddress, note: form.note },
          email: form.email,
          address: { full: fullAddress, province: form.provinceName, district: form.districtName, ward: form.wardName, street: form.street },
          note: form.note,
          total,
          discount,
          promoCode: coupon ?? undefined,
          paymentMethod: form.payment,
          idempotencyKey
        })
      })
      
      const resReqId = response.headers.get("X-Request-Id") || idempotencyKey

      if (response.status === 202) {
        clientLogger.warn(`Received 202 Accepted (Order is already being processed)`, { reqId: resReqId })
        clear()
        toast.success("Đơn hàng đang được xử lý, bạn sẽ nhận được email ngay!");
        router.push(`/order-success`)
        return;
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        clientLogger.error(`Checkout failed with status ${response.status}`, error, resReqId)
        throw new Error(error.error || "Không thể tạo đơn hàng. Vui lòng thử lại.") 
      }
      
      const order = await response.json()
      clientLogger.info(`Order placed successfully`, { orderCode: order.orderCode, reqId: resReqId })
      clear()
      if (order.checkoutUrl) { window.location.href = order.checkoutUrl; return }
      router.push(`/order-success?code=${order.orderCode}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mounted) return null
  if (!items.length) return <div className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center px-5 text-center"><CreditCard className="size-10 text-primary" /><h1 className="mt-4 font-display text-3xl font-bold uppercase">Chưa có sản phẩm để thanh toán</h1><Button asChild className="mt-6"><Link href="/shop">Quay lại cửa hàng</Link></Button></div>
  if (!user) return (
    <div className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center px-5 text-center">
      <CreditCard className="size-10 text-primary" />
      <h1 className="mt-4 font-display text-3xl font-bold uppercase">Yêu cầu đăng nhập</h1>
      <p className="mt-3 text-neutral-600">Vui lòng đăng nhập vào tài khoản của bạn trước khi tiến hành thanh toán.</p>
      <Button onClick={() => setAuthOpen(true)} className="mt-6">
        Đăng nhập / Đăng ký
      </Button>
    </div>
  )
  return <main className="bg-[#f5f9f7] py-8 text-[#101715] md:py-12"><div className="mx-auto max-w-[1240px] px-5 md:px-8">
    <div className="mb-8 grid grid-cols-3 gap-2 text-center text-[10px] font-bold uppercase tracking-wide sm:text-xs"><Link href="/cart" className="border-b-2 border-primary pb-3">1. Giỏ hàng</Link><span className="border-b-2 border-primary pb-3 text-primary">2. Thanh toán</span><span className="border-b-2 border-black/10 pb-3 text-neutral-400">3. Hoàn tất</span></div>
    <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_380px]"><form id="checkout-form" noValidate onSubmit={submit} className="space-y-5"><div><h1 className="font-display text-4xl font-bold uppercase md:text-5xl">Thanh toán</h1><p className="mt-2 text-sm text-neutral-600">Kiểm tra và điền thông tin để hoàn tất đơn hàng.</p></div>
      <section className="border border-black/10 bg-white p-5"><h2 className="flex items-center gap-2 font-display text-xl font-bold uppercase"><MapPin className="size-5 text-primary" />Thông tin nhận hàng</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">Họ và tên*<input value={form.name} onChange={(e) => setField("name", e.target.value)} className="mt-2 h-11 w-full border border-black/20 px-3 text-sm outline-none focus:border-primary" placeholder="Nguyễn Văn A" /></label><label className="text-sm font-medium">Số điện thoại*<input type="tel" value={form.phone} onChange={(e) => setField("phone", e.target.value)} className="mt-2 h-11 w-full border border-black/20 px-3 text-sm outline-none focus:border-primary" placeholder="09xxxxxxxx" /></label><label className="text-sm font-medium sm:col-span-2">Email nhận xác nhận đơn*<input type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} className="mt-2 h-11 w-full border border-black/20 px-3 text-sm outline-none focus:border-primary" placeholder="you@example.com" /></label>
      
      <div className="sm:col-span-2 space-y-4 pt-2">
        <label className="text-sm font-medium block">Địa chỉ giao hàng*</label>
        <div className="grid gap-3 sm:grid-cols-3">
          <select value={form.provinceCode} className="h-11 w-full border border-black/20 px-3 text-sm outline-none focus:border-primary bg-white" onChange={(e) => { const p = provinces.find(x => x.code == e.target.value); setForm(c => ({...c, provinceCode: p?.code||"", provinceName: p?.name||"", districtCode: "", districtName: "", wardCode: "", wardName: ""})); if(p) { fetch(`https://provinces.open-api.vn/api/p/${p.code}?depth=2`).then(r=>r.json()).then(d=>setDistricts(d.districts)) } else { setDistricts([]); setWards([]) } }}>
            <option value="">Tỉnh/Thành phố</option>
            {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
          </select>
          <select disabled={!form.provinceCode} value={form.districtCode} className="h-11 w-full border border-black/20 px-3 text-sm outline-none focus:border-primary disabled:bg-neutral-100 bg-white" onChange={(e) => { const d = districts.find(x => x.code == e.target.value); setForm(c => ({...c, districtCode: d?.code||"", districtName: d?.name||"", wardCode: "", wardName: ""})); if(d) { fetch(`https://provinces.open-api.vn/api/d/${d.code}?depth=2`).then(r=>r.json()).then(w=>setWards(w.wards)) } else { setWards([]) } }}>
            <option value="">Quận/Huyện</option>
            {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
          </select>
          <select disabled={!form.districtCode} value={form.wardCode} className="h-11 w-full border border-black/20 px-3 text-sm outline-none focus:border-primary disabled:bg-neutral-100 bg-white" onChange={(e) => { const w = wards.find(x => x.code == e.target.value); setForm(c => ({...c, wardCode: w?.code||"", wardName: w?.name||""})) }}>
            <option value="">Phường/Xã</option>
            {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
          </select>
        </div>
        <input value={form.street} onChange={(e) => setField("street", e.target.value)} className="h-11 w-full border border-black/20 px-3 text-sm outline-none focus:border-primary" placeholder="Số nhà, tên đường..." />
      </div>

      <label className="text-sm font-medium sm:col-span-2">Ghi chú (tùy chọn)<textarea value={form.note} onChange={(e) => setField("note", e.target.value)} className="mt-2 min-h-20 w-full border border-black/20 px-3 py-2 text-sm outline-none focus:border-primary" placeholder="Thời gian nhận hàng, lưu ý cho shipper..." /></label></div></section>
      
      <section className="border border-black/10 bg-white p-5">
        <h2 className="flex items-center gap-2 font-display text-xl font-bold uppercase"><CreditCard className="size-5 text-primary" />Thanh toán</h2>
        <div className="pt-2">
            <h3 className="font-display text-lg font-bold uppercase mb-3">Phương thức thanh toán</h3>
            <div className="space-y-2">
                <label className="flex items-center gap-3 border border-black/10 p-3 cursor-pointer hover:bg-black/5">
                    <input type="radio" name="payment" value="cod" checked={form.payment === "cod"} onChange={(e) => setField("payment", e.target.value)} className="size-4" />
                    <span>Thanh toán khi nhận hàng (COD) <span className="text-muted-foreground text-xs ml-1">- Phí vận chuyển 30.000 ₫</span></span>
                </label>
                <label className="flex items-center gap-3 border border-black/10 p-3 cursor-pointer hover:bg-black/5">
                    <input type="radio" name="payment" value="payos" checked={form.payment === "payos"} onChange={(e) => setField("payment", e.target.value)} className="size-4" />
                    <span>Chuyển khoản / Quét mã QR PayOS <span className="text-primary text-xs ml-1 font-bold">- Miễn phí vận chuyển</span></span>
                </label>
            </div>
        </div>
      </section>
      
      </form><aside className="h-fit border border-black/10 bg-white p-5 lg:sticky lg:top-24"><h2 className="font-display text-2xl font-bold uppercase">Tóm tắt đơn hàng</h2><div className="mt-5 max-h-72 space-y-4 overflow-y-auto border-y border-black/10 py-4">{items.map((item) => <div key={item.variantId} className="flex gap-3"><div className="relative size-16 shrink-0 overflow-hidden border border-black/10"><Image src={item.image} alt={item.title} fill sizes="64px" className="object-cover" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{item.title}</p><p className="text-xs text-neutral-500">{item.variantName} × {item.quantity}</p><p className="mt-1 text-sm font-bold">{formatCurrency(item.price * item.quantity)}</p></div></div>)}</div><div className="py-4"><label className="text-xs font-bold uppercase tracking-wide"><Tag className="mr-1 inline size-3.5" />Mã giảm giá</label><div className="mt-2 flex gap-2"><input value={couponInput} onChange={(e) => setCouponInput(e.target.value)} className="min-w-0 flex-1 border border-black/20 px-3 text-sm" placeholder="Nhập mã" /><Button type="button" onClick={applyCoupon}>Áp dụng</Button></div>{couponError ? <p className="mt-2 text-xs text-destructive">{couponError}</p> : coupon ? <p className="mt-2 text-xs text-primary">Đã áp dụng {coupon}</p> : null}</div><dl className="space-y-3 border-t border-black/10 py-4 text-sm"><div className="flex justify-between"><dt>Tạm tính</dt><dd>{formatCurrency(subtotal)}</dd></div><div className="flex justify-between"><dt>Phí vận chuyển</dt><dd>{shipping === 0 ? <span className="text-primary">Miễn phí</span> : formatCurrency(shipping)}</dd></div>{discount ? <div className="flex justify-between text-primary"><dt>Giảm giá</dt><dd>-{formatCurrency(discount)}</dd></div> : null}</dl><div className="flex justify-between border-t border-black/10 pt-4"><strong>Tổng cộng</strong><strong className="font-display text-2xl text-[#d71920]">{formatCurrency(total)}</strong></div><Button type="submit" form="checkout-form" disabled={isSubmitting} className="mt-5 h-12 w-full bg-[#101715] uppercase hover:bg-[#101715]/80">{isSubmitting ? <Loader2 className="animate-spin" /> : <Check />} {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}</Button><div className="mt-4 flex gap-2 text-xs text-neutral-500"><Truck className="mt-0.5 size-4 text-primary shrink-0" />Miễn phí vận chuyển khi thanh toán trước qua PayOS.</div></aside></div>
  </div></main>
}
