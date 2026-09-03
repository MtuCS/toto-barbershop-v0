"use client"

import React, { useEffect, useState, use } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  AlertCircle, 
  Clock, 
  CreditCard, 
  ShoppingBag, 
  XCircle, 
  Loader2, 
  Package, 
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

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
  payosOrderCode: string | null
  status: string
  paymentStatus: string
  paymentMethod: string
  total: number
  discount: number
  shippingFee: number
  createdAt: string
  isExpired: boolean
  expiresAt: string
  customerName: string
  items: OrderItem[]
}

export default function OrderCancelledPage({
  params,
}: {
  params: Promise<{ orderCode: string }>
}) {
  const resolvedParams = use(params)
  const orderCode = resolvedParams.orderCode

  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [selectedReason, setSelectedReason] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  const CANCELLATION_REASONS = [
    "Đổi ý, không muốn mua nữa",
    "Tìm được giá tốt hơn ở nơi khác",
    "Đặt nhầm sản phẩm/số lượng",
    "Muốn đổi sang phương thức thanh toán khác",
    "Lỗi kỹ thuật, không thanh toán được",
  ]

  // Tải chi tiết đơn hàng theo orderCode (Public Endpoint)
  const fetchOrder = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/orders/by-code/${encodeURIComponent(orderCode)}`)
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || "Không thể tìm thấy thông tin đơn hàng.")
      }
      const data: OrderDetail = await res.json()
      setOrder(data)

      // Tính thời gian còn lại
      if (data.expiresAt && (data.status || "").toUpperCase() === "PENDING") {
        const remainingSec = Math.max(0, Math.floor((new Date(data.expiresAt).getTime() - Date.now()) / 1000))
        setTimeLeft(remainingSec)
      }
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu đơn hàng.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (orderCode) {
      fetchOrder()
    }
  }, [orderCode])

  // Đếm ngược 15 phút
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [timeLeft])

  // Xử lý tạo lại link thanh toán PayOS
  const handleRetryPayment = async () => {
    if (!order) return
    if (timeLeft !== null && timeLeft <= 0) {
      toast.error("Đơn hàng đã hết hạn thanh toán (quá 15 phút). Vui lòng đặt đơn hàng mới.")
      return
    }

    setIsRetrying(true)
    try {
      const res = await fetch(`/api/orders/by-code/${encodeURIComponent(order.orderCode)}/retry-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Không thể tạo lại liên kết thanh toán PayOS.")
      }

      if (data.checkoutUrl) {
        toast.success("Đang chuyển hướng sang cổng thanh toán PayOS...")
        window.location.href = data.checkoutUrl
        return
      }
      throw new Error("Không nhận được đường dẫn thanh toán từ máy chủ.")
    } catch (err: any) {
      toast.error(err.message || "Lỗi tạo lại link thanh toán.")
      setIsRetrying(false)
    }
  }

  // Xử lý khách hủy đơn hàng (reasonToSubmit là tùy chọn, có thể null nếu khách bấm Bỏ qua)
  const handleCancelOrder = async (reasonToSubmit: string | null = null) => {
    if (!order) return
    setIsCancelling(true)
    try {
      const res = await fetch(`/api/orders/by-code/${encodeURIComponent(order.orderCode)}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reasonToSubmit || undefined })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Không thể hủy đơn hàng.")
      }

      toast.success("Đã hủy đơn hàng thành công và hoàn trả kho hàng.")
      setShowCancelDialog(false)
      setSelectedReason(null)
      fetchOrder()
    } catch (err: any) {
      toast.error(err.message || "Lỗi hủy đơn hàng.")
    } finally {
      setIsCancelling(false)
    }
  }

  const formatMinutesSeconds = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  if (loading) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-5 py-16 text-center">
        <Loader2 className="size-10 animate-spin text-primary" />
        <p className="mt-4 text-sm font-medium text-neutral-600">Đang tải thông tin đơn hàng...</p>
      </main>
    )
  }

  if (error || !order) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-5 py-16 text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-red-50 text-red-600 ring-8 ring-red-500/10">
          <XCircle className="size-8" />
        </div>
        <h1 className="font-display text-2xl font-bold uppercase text-neutral-900">Không tìm thấy đơn hàng</h1>
        <p className="mt-2 text-sm text-neutral-600 max-w-md">{error || "Mã đơn hàng không hợp lệ hoặc không tồn tại trên hệ thống."}</p>
        <div className="mt-6 flex gap-3">
          <Button asChild variant="outline">
            <Link href="/" className="gap-2">
              <ArrowLeft className="size-4" /> Về trang chủ
            </Link>
          </Button>
          <Button asChild>
            <Link href="/shop" className="gap-2">
              <ShoppingBag className="size-4" /> Mua sắm tiếp
            </Link>
          </Button>
        </div>
      </main>
    )
  }

  const isCancelled = (order.status || "").toUpperCase() === "CANCELLED"
  const isExpired = order.isExpired || (timeLeft !== null && timeLeft <= 0)
  const isPaid = (order.paymentStatus || "").toUpperCase() === "PAID"

  return (
    <main className="bg-[#f5f9f7] py-10 md:py-16 text-[#101715]">
      <div className="mx-auto max-w-2xl px-5">
        
        {/* Header Thông báo */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 md:p-8 shadow-sm text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-amber-50 text-amber-600 ring-8 ring-amber-500/10">
            {isCancelled ? (
              <XCircle className="size-8 text-red-500" />
            ) : isPaid ? (
              <CheckCircle2 className="size-8 text-emerald-600" />
            ) : (
              <AlertCircle className="size-8 text-amber-600" />
            )}
          </div>

          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
            Trạng thái thanh toán
          </span>

          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold uppercase text-neutral-900">
            {isCancelled
              ? "Đơn Hàng Đã Bị Hủy"
              : isPaid
              ? "Đơn Hàng Đã Thanh Toán"
              : "Chưa Hoàn Tất Thanh Toán"}
          </h1>

          <p className="mt-3 text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
            {isCancelled ? (
              "Đơn hàng này đã được hủy và sản phẩm đã được hoàn trả lại kho."
            ) : isPaid ? (
              "Đơn hàng đã được thanh toán thành công. Chúng tôi đang đóng gói và chuẩn bị gửi hàng cho bạn."
            ) : isExpired ? (
              "Đơn hàng đã hết thời gian giữ chỗ thanh toán (15 phút). Vui lòng đặt lại đơn mới."
            ) : (
              "Giao dịch qua PayOS đã bị hủy hoặc chưa hoàn tất. Bạn có thể chọn quét lại mã QR để thanh toán ngay, hoặc hủy đơn hàng nếu đổi ý."
            )}
          </p>

          {/* Đếm ngược 15 phút (Nếu đang PENDING) */}
          {!isCancelled && !isPaid && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium">
              <Clock className="size-3.5 text-amber-600" />
              {isExpired ? (
                <span className="text-red-600 font-semibold">Đã hết hạn giữ chỗ (quá 15 phút)</span>
              ) : (
                <span className="text-neutral-700">
                  Thời gian giữ đơn còn lại:{" "}
                  <strong className="font-mono text-amber-700 text-sm font-bold">
                    {timeLeft !== null ? formatMinutesSeconds(timeLeft) : "--:--"}
                  </strong>
                </span>
              )}
            </div>
          )}

          {/* Nút hành động */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            {!isCancelled && !isPaid && !isExpired && (
              <>
                <Button
                  onClick={handleRetryPayment}
                  disabled={isRetrying || isCancelling}
                  className="h-12 w-full sm:w-auto px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md flex items-center justify-center gap-2"
                >
                  {isRetrying ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Đang tạo mã QR...
                    </>
                  ) : (
                    <>
                      <CreditCard className="size-4" /> Thanh toán lại qua PayOS
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setShowCancelDialog(true)}
                  disabled={isRetrying || isCancelling}
                  className="h-12 w-full sm:w-auto px-5 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-semibold"
                >
                  Hủy đơn hàng
                </Button>
              </>
            )}

            {(isCancelled || isExpired || isPaid) && (
              <Button asChild className="h-12 w-full sm:w-auto px-8 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold">
                <Link href="/shop" className="flex items-center gap-2">
                  <ShoppingBag className="size-4" /> Quay lại cửa hàng
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Thông tin chi tiết đơn hàng */}
        <div className="mt-6 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between border-b border-neutral-100 pb-4 gap-2">
            <div>
              <p className="text-xs text-neutral-500 uppercase font-semibold">Mã đơn hàng</p>
              <p className="font-mono text-base font-bold text-neutral-900">#{order.orderCode}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-500 uppercase font-semibold">Khách hàng</p>
              <p className="text-sm font-semibold text-neutral-800">{order.customerName}</p>
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="divide-y divide-neutral-100 py-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-3.5">
                <div className="relative size-14 rounded-lg bg-neutral-100 overflow-hidden border border-neutral-200 shrink-0 flex items-center justify-center">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : (
                    <Package className="size-6 text-neutral-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-neutral-900 truncate">{item.title}</p>
                  {item.variantName && (
                    <p className="text-xs text-neutral-500">{item.variantName}</p>
                  )}
                  <p className="text-xs text-neutral-500 mt-1">Số lượng: x{item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">
                    {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Tổng tiền */}
          <div className="border-t border-neutral-100 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>Tạm tính</span>
              <span>{(order.total - order.shippingFee + order.discount).toLocaleString("vi-VN")}đ</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Giảm giá</span>
                <span>-{order.discount.toLocaleString("vi-VN")}đ</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-600">
              <span>Phí vận chuyển</span>
              <span>{order.shippingFee === 0 ? "Miễn phí" : `${order.shippingFee.toLocaleString("vi-VN")}đ`}</span>
            </div>
            <div className="flex justify-between border-t border-neutral-100 pt-3 text-base font-bold text-neutral-900">
              <span>Tổng thanh toán</span>
              <span className="text-primary text-lg">{order.total.toLocaleString("vi-VN")}đ</span>
            </div>
          </div>
        </div>

      </div>

      {/* Modal Xác nhận hủy đơn với tùy chọn lý do nhanh (không bắt buộc) */}
      <AlertDialog open={showCancelDialog} onOpenChange={(open) => {
        if (!isCancelling) {
          setShowCancelDialog(open)
          if (!open) setSelectedReason(null)
        }
      }}>
        <AlertDialogContent className="max-w-md p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-display uppercase tracking-tight text-neutral-900">
              Hủy Đơn Hàng #{order.orderCode}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-600 text-sm">
              Rất tiếc vì bạn hủy đơn. Cho chúng tôi biết lý do (không bắt buộc) để ToTo cải thiện dịch vụ:
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Danh sách lý do nhanh */}
          <div className="mt-3 space-y-2">
            {CANCELLATION_REASONS.map((r) => {
              const isSelected = selectedReason === r
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedReason(isSelected ? null : r)}
                  className={`w-full flex items-center justify-between text-left px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm transition-all ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold shadow-xs"
                      : "border-neutral-200 hover:bg-neutral-50 text-neutral-700 hover:border-neutral-300"
                  }`}
                >
                  <span>{r}</span>
                  {isSelected && <Check className="size-4 text-emerald-600 shrink-0" />}
                </button>
              )
            })}
          </div>

          <AlertDialogFooter className="mt-6 flex flex-col-reverse sm:flex-row items-center gap-2">
            <AlertDialogCancel
              disabled={isCancelling}
              className="h-10 w-full sm:w-auto text-neutral-600 border-neutral-200 hover:bg-neutral-100"
            >
              Giữ lại đơn
            </AlertDialogCancel>

            {/* Nút Bỏ qua, hủy luôn: Không ép khách chọn lý do */}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleCancelOrder(null)}
              disabled={isCancelling}
              className="h-10 w-full sm:w-auto border-neutral-300 text-neutral-700 hover:bg-neutral-100 font-medium"
            >
              {isCancelling && !selectedReason ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-1.5" /> Đang hủy...
                </>
              ) : (
                "Bỏ qua, hủy luôn"
              )}
            </Button>

            {/* Nút Xác nhận hủy với lý do */}
            <Button
              type="button"
              onClick={() => handleCancelOrder(selectedReason)}
              disabled={isCancelling}
              className="h-10 w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              {isCancelling && selectedReason ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-1.5" /> Đang hủy...
                </>
              ) : (
                "Xác nhận hủy"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
