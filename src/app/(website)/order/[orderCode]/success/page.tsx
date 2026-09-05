"use client"

import React, { useEffect, useState, use } from "react"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle2, ShoppingBag, Package, Home, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCustomerUserStore } from "@/store/customer-user-store"

interface OrderItem {
  id: number
  productId: number
  quantity: number
  price: number
  title: string
  variantName: string
  image: string | null
}

interface OrderDetail {
  id: number
  orderCode: string
  status: string
  paymentStatus: string
  paymentMethod: string
  total: number
  discount: number
  shippingFee: number
  createdAt: string
  customerName: string
  items: OrderItem[]
}

export default function OrderSuccessPage({
  params,
}: {
  params: Promise<{ orderCode: string }>
}) {
  const resolvedParams = use(params)
  const orderCode = resolvedParams.orderCode
  const { user } = useCustomerUserStore()

  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderCode) return
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/by-code/${encodeURIComponent(orderCode)}`)
        if (res.ok) {
          const data = await res.json()
          setOrder(data)
        }
      } catch (err) {
        console.error("Lỗi tải chi tiết đơn hàng:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [orderCode])

  return (
    <main className="mx-auto flex min-h-[75vh] max-w-2xl flex-col items-center justify-center px-5 py-12 md:py-16 text-center text-[#101715]">
      {/* Icon Badge */}
      <div className="mb-5 flex size-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-500/10 animate-in zoom-in-50 duration-500">
        <CheckCircle2 className="size-10 text-primary" />
      </div>

      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
        Thanh toán thành công
      </p>

      <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-neutral-900">
        Cảm Ơn Bạn Đã Đặt Hàng!
      </h1>

      <p className="mt-3 text-sm md:text-base text-neutral-600 leading-relaxed max-w-md">
        Đơn hàng của bạn đã được ghi nhận và thanh toán thành công qua PayOS. Chúng tôi đang nhanh chóng đóng gói và bàn giao cho đơn vị vận chuyển.
      </p>

      {/* Chi tiết đơn hàng */}
      <div className="mt-6 w-full rounded-2xl border border-neutral-200/80 bg-white p-6 text-left shadow-sm">
        <div className="flex flex-wrap items-center justify-between border-b border-neutral-100 pb-3 gap-2">
          <div>
            <span className="text-xs text-neutral-500 font-semibold uppercase">Mã đơn hàng</span>
            <p className="font-mono text-base font-bold text-neutral-900">#{order?.orderCode || orderCode}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-neutral-500 font-semibold uppercase">Trạng thái</span>
            <p className="text-xs font-bold uppercase text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full mt-0.5">
              Đã thanh toán
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-8 flex justify-center items-center">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : order ? (
          <div className="mt-3">
            <div className="divide-y divide-neutral-100 max-h-56 overflow-y-auto pr-1">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3.5 py-3">
                  <div className="relative size-12 rounded-lg bg-neutral-100 overflow-hidden border border-neutral-200 shrink-0 flex items-center justify-center">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <Package className="size-5 text-neutral-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-neutral-900 truncate">{item.title}</p>
                    {item.variantName && (
                      <p className="text-[11px] text-neutral-500">{item.variantName}</p>
                    )}
                    <p className="text-[11px] text-neutral-500">x{item.quantity}</p>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-primary">
                    {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-100 pt-3 flex justify-between items-center text-sm font-bold text-neutral-900">
              <span>Tổng thanh toán</span>
              <span className="text-primary text-base sm:text-lg">{order.total.toLocaleString("vi-VN")}đ</span>
            </div>
          </div>
        ) : null}
      </div>

      {/* Điều hướng */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md">
        <Button
          asChild
          variant="outline"
          className="h-12 w-full sm:w-1/2 rounded-xl border-neutral-300 hover:bg-neutral-100 text-neutral-800 font-semibold"
        >
          <Link href="/shop" className="flex items-center justify-center gap-2">
            <ShoppingBag className="size-4" /> Tiếp tục mua sắm
          </Link>
        </Button>

        {user ? (
          <Button
            asChild
            className="h-12 w-full sm:w-1/2 rounded-xl bg-primary hover:bg-[#2f7a68] text-white font-semibold shadow-md"
          >
            <Link href="/profile?tab=orders" className="flex items-center justify-center gap-2">
              <Package className="size-4" /> Quản lý đơn hàng
            </Link>
          </Button>
        ) : (
          <Button
            asChild
            className="h-12 w-full sm:w-1/2 rounded-xl bg-primary hover:bg-[#2f7a68] text-white font-semibold shadow-md"
          >
            <Link href="/" className="flex items-center justify-center gap-2">
              <Home className="size-4" /> Về trang chủ
            </Link>
          </Button>
        )}
      </div>
    </main>
  )
}
