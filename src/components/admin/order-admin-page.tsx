"use client"

import { useState, useEffect } from "react"
import { useDataStore } from "@/store/data-store"
import { formatCurrency } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Search, Package, MapPin, Phone, User, Calendar, CreditCard, Clock, CheckCircle2, XCircle, Truck, Mail, AlertTriangle, History, ArrowRight, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import type { Order, OrderStatus, PaymentStatus, OrderStatusHistory } from "@/types"
import Image from "next/image"

const orderStatusMap: Record<string, { label: string; icon: any; color: string; bgColor: string }> = {
  PENDING: { label: "Chờ xử lý", icon: Clock, color: "text-amber-700", bgColor: "bg-amber-100" },
  PROCESSING: { label: "Đang chuẩn bị", icon: Package, color: "text-blue-700", bgColor: "bg-blue-100" },
  SHIPPED: { label: "Đang giao", icon: Truck, color: "text-purple-700", bgColor: "bg-purple-100" },
  DELIVERY_FAILED: { label: "Giao thất bại", icon: AlertTriangle, color: "text-rose-700", bgColor: "bg-rose-100" },
  COMPLETED: { label: "Hoàn thành", icon: CheckCircle2, color: "text-emerald-700", bgColor: "bg-emerald-100" },
  CANCELLED: { label: "Đã hủy", icon: XCircle, color: "text-red-700", bgColor: "bg-red-100" },
}

const paymentStatusMap: Record<string, { label: string; color: string; bgColor: string }> = {
  UNPAID: { label: "Chờ thanh toán online", color: "text-neutral-700", bgColor: "bg-neutral-100" },
  PAID: { label: "Đã thanh toán online", color: "text-emerald-700", bgColor: "bg-emerald-100" },
  COD_UNPAID: { label: "COD - Chưa thu tiền", color: "text-amber-800", bgColor: "bg-amber-100" },
  COD_COLLECTED: { label: "COD - Đã thu tiền", color: "text-emerald-800", bgColor: "bg-emerald-100" },
  REFUNDED: { label: "Đã hoàn tiền", color: "text-purple-700", bgColor: "bg-purple-100" },
}

const VALID_TRANSITIONS: Record<string, OrderStatus[]> = {
  PENDING: ['PROCESSING', 'SHIPPED', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'COMPLETED', 'CANCELLED'],
  SHIPPED: ['COMPLETED', 'CANCELLED', 'DELIVERY_FAILED'],
  DELIVERY_FAILED: ['SHIPPED', 'CANCELLED'],
  COMPLETED: [], // Trạng thái cuối
  CANCELLED: [], // Trạng thái cuối
}

function getValidTransitions(currentStatus: string): OrderStatus[] {
  return VALID_TRANSITIONS[currentStatus.toUpperCase()] || []
}

function getPaymentTransitionInfo(
  orderStatus: string,
  currentPaymentStatus: string,
  targetPaymentStatus: string,
  paymentMethod?: string
): { isValid: boolean; tooltip: string } {
  const oStatus = (orderStatus || 'PENDING').toUpperCase();
  const currentP = (currentPaymentStatus || 'UNPAID').toUpperCase();
  const targetP = (targetPaymentStatus || 'UNPAID').toUpperCase();
  const method = (paymentMethod || 'COD').toUpperCase();

  if (currentP === targetP) {
    return { isValid: false, tooltip: "Trạng thái thanh toán hiện tại" };
  }

  // =================================================================
  // CÁC QUY TẮC TOÀN CỤC (GLOBAL INVARIANTS)
  // =================================================================

  // A. Không thể REFUND nếu chưa từng thu tiền
  if (targetP === 'REFUNDED' && (currentP === 'UNPAID' || currentP === 'COD_UNPAID')) {
    return { 
      isValid: false, 
      tooltip: `Không thể hoàn tiền cho đơn hàng chưa từng phát sinh thanh toán (${currentP}).` 
    };
  }

  // B. Không thể revert đơn đã thu tiền về chưa thanh toán
  if ((currentP === 'PAID' || currentP === 'COD_COLLECTED') && (targetP === 'UNPAID' || targetP === 'COD_UNPAID')) {
    return { 
      isValid: false, 
      tooltip: `Không thể chuyển ngược đơn đã thu tiền (${currentP}) về trạng thái chưa thanh toán.` 
    };
  }

  // C. Đã REFUNDED thì khóa vĩnh viễn
  if (currentP === 'REFUNDED') {
    return { isValid: false, tooltip: 'Đơn hàng đã hoàn tiền (kết thúc), không thể thay đổi thêm.' };
  }

  // =================================================================
  // CÁC QUY TẮC THEO TRẠNG THÁI ĐƠN HÀNG
  // =================================================================

  // 1. Đơn hàng CANCELLED (Đã hủy)
  if (oStatus === 'CANCELLED') {
    if (targetP === 'PAID' || targetP === 'COD_COLLECTED') {
      return { 
        isValid: false, 
        tooltip: `Đơn hàng đã Hủy (CANCELLED), không thể ghi nhận thu tiền (${targetP}).` 
      };
    }
  }

  // 2. Đơn hàng COMPLETED (Hoàn thành)
  if (oStatus === 'COMPLETED') {
    if (currentP === 'COD_UNPAID' && targetP !== 'COD_COLLECTED') {
      return { isValid: false, tooltip: 'Đơn COD đã hoàn thành nhưng chưa thu tiền, chỉ có thể đổi sang "Đã thu tiền COD".' };
    }
  }

  // 3. Đơn hàng chưa xuất giao hoặc giao thất bại
  if (oStatus === 'PENDING' || oStatus === 'PROCESSING' || oStatus === 'DELIVERY_FAILED') {
    if (method === 'COD' && targetP === 'COD_COLLECTED') {
      return { 
        isValid: false, 
        tooltip: `Chỉ có thể xác nhận thu tiền COD khi đơn đang giao hoặc đã hoàn thành. Hiện tại đang là "${oStatus}".` 
      };
    }
  }

  // 4. Kiểm tra tính tương thích phương thức COD vs NON-COD
  if (method === 'COD' && targetP === 'PAID') {
    return { isValid: false, tooltip: 'Đơn COD dùng trạng thái "COD - Đã thu tiền".' };
  }
  if (method !== 'COD' && (targetP === 'COD_COLLECTED' || targetP === 'COD_UNPAID')) {
    return { isValid: false, tooltip: 'Đơn không phải COD, không thể dùng trạng thái COD.' };
  }

  return { isValid: true, tooltip: `Chuyển sang ${targetP}` };
}

function getPageNumbers(current: number, total: number): number[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, -1, total]
  }
  if (current >= total - 3) {
    return [1, -1, total - 4, total - 3, total - 2, total - 1, total]
  }
  return [1, -1, current - 1, current, current + 1, -1, total]
}

export function OrderAdminPage() {
  const { orders: rawOrders, orderPagination, updateOrderStatus, fetchOrderHistory, fetchOrders, markCodCollected, blockPhone } = useDataStore()
  const orders: Order[] = Array.isArray(rawOrders) 
    ? rawOrders 
    : (Array.isArray((rawOrders as any)?.data) ? (rawOrders as any).data : [])

  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("ALL")
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>("ALL")
  const [filterPaymentMethod, setFilterPaymentMethod] = useState<string>("ALL")
  const [filterFrom, setFilterFrom] = useState("")
  const [filterTo, setFilterTo] = useState("")

  // State phân trang server-side
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [isFetching, setIsFetching] = useState(false)

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [orderHistory, setOrderHistory] = useState<OrderStatusHistory[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  // State popup xác nhận hủy đơn
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [cancelReasonInput, setCancelReasonInput] = useState("")

  // Gọi API phân trang và lọc server-side (Debounce ô tìm kiếm 300ms)
  useEffect(() => {
    let isMounted = true
    setIsFetching(true)
    const timer = setTimeout(() => {
      fetchOrders({
        page,
        pageSize,
        search: searchQuery.trim() || undefined,
        status: filterStatus !== "ALL" ? filterStatus : undefined,
        paymentStatus: filterPaymentStatus !== "ALL" ? filterPaymentStatus : undefined,
        paymentMethod: filterPaymentMethod !== "ALL" ? filterPaymentMethod : undefined,
        startDate: filterFrom || undefined,
        endDate: filterTo || undefined,
      }).finally(() => {
        if (isMounted) setIsFetching(false)
      })
    }, searchQuery ? 300 : 0)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [page, pageSize, searchQuery, filterStatus, filterPaymentStatus, filterPaymentMethod, filterFrom, filterTo, fetchOrders])

  // Load audit history khi chọn đơn hàng
  useEffect(() => {
    if (selectedOrder?.id) {
      setLoadingHistory(true)
      fetchOrderHistory(selectedOrder.id)
        .then(history => setOrderHistory(history))
        .catch(() => setOrderHistory([]))
        .finally(() => setLoadingHistory(false))
    } else {
      setOrderHistory([])
    }
  }, [selectedOrder?.id, fetchOrderHistory])

  // Format ngày theo múi giờ Việt Nam
  const formatDateVN = (dateStr: string | Date, opts?: Intl.DateTimeFormatOptions) => {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
    return date.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", ...opts })
  }

  const totalCount = orderPagination?.total ?? orders.length
  const totalPages = orderPagination?.totalPages ?? (Math.ceil(totalCount / pageSize) || 1)
  const fromItem = totalCount === 0 ? 0 : (page - 1) * pageSize + 1
  const toItem = Math.min(page * pageSize, totalCount)

  const paymentMethodLabel: Record<string, string> = {
    cod: 'COD (Nhận hàng)',
    payos: 'PayOS / Chuyển khoản',
  }

  const handleStatusClick = (newStatus: OrderStatus) => {
    if (!selectedOrder) return
    const currentStatus = (selectedOrder.status || 'PENDING').toUpperCase()
    
    // Nếu bấm đúng trạng thái hiện tại thì không làm gì
    if (currentStatus === newStatus) return

    // Kiểm tra state machine
    const validTransitions = getValidTransitions(currentStatus)
    if (!validTransitions.includes(newStatus)) {
      toast.error(`Không thể chuyển trạng thái từ "${orderStatusMap[currentStatus]?.label || currentStatus}" sang "${orderStatusMap[newStatus]?.label || newStatus}"`)
      return
    }

    // Nếu chuyển sang CANCELLED -> mở popup hủy đơn
    if (newStatus === 'CANCELLED') {
      setCancelReasonInput("")
      setCancelModalOpen(true)
      return
    }

    // Chuyển trạng thái thông thường
    executeStatusUpdate(newStatus)
  }

  const executeStatusUpdate = async (newStatus: OrderStatus, customPaymentStatus?: PaymentStatus, reason?: string) => {
    if (!selectedOrder) return
    setIsUpdating(true)
    try {
      const payload: { status: string; paymentStatus?: string; cancelReason?: string } = {
        status: newStatus,
        ...(customPaymentStatus ? { paymentStatus: customPaymentStatus } : {}),
        ...(reason ? { cancelReason: reason } : {})
      }

      const success = await updateOrderStatus(selectedOrder.id.toString(), payload)
      if (success) {
        setSelectedOrder(prev => prev ? { 
          ...prev, 
          status: newStatus, 
          ...(customPaymentStatus ? { paymentStatus: customPaymentStatus } : {}) 
        } : null)
        
        // Refresh audit log
        fetchOrderHistory(selectedOrder.id).then(h => setOrderHistory(h)).catch(() => {})
      }
    } catch {
      toast.error("Lỗi khi cập nhật trạng thái")
    } finally {
      setIsUpdating(false)
      setCancelModalOpen(false)
    }
  }

  const handleUpdatePaymentStatus = async (orderId: string | number, newPaymentStatus: PaymentStatus) => {
    setIsUpdating(true)
    try {
      const success = await updateOrderStatus(orderId.toString(), { paymentStatus: newPaymentStatus })
      if (success) {
        setSelectedOrder(prev => prev ? { ...prev, paymentStatus: newPaymentStatus } : null)
        fetchOrderHistory(orderId).then(h => setOrderHistory(h)).catch(() => {})
      }
    } catch {
      toast.error("Lỗi khi cập nhật thanh toán")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
        <div>
          <h1 className="text-2xl font-bold tracking-tight uppercase font-display flex items-center gap-2">
            <Package className="size-6 text-primary" /> Quản lý Đơn hàng
          </h1>
          <p className="text-neutral-500 mt-1">Quản lý và theo dõi trạng thái giao hàng, thanh toán</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
      <div className="p-4 border-b border-neutral-100 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
            <Input 
              placeholder="Mã đơn, Tên KH, SĐT..." 
              className="pl-9 h-9 bg-neutral-50/50 border-neutral-200 focus-visible:bg-white"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value)
                setPage(1)
              }}
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => {
              setFilterStatus(e.target.value)
              setPage(1)
            }}
            className="h-9 border border-neutral-200 rounded-md bg-neutral-50 px-3 text-sm text-neutral-700 focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="ALL">Tất cả đơn hàng</option>
            {Object.entries(orderStatusMap).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
          <select
            value={filterPaymentStatus}
            onChange={e => {
              setFilterPaymentStatus(e.target.value)
              setPage(1)
            }}
            className="h-9 border border-neutral-200 rounded-md bg-neutral-50 px-3 text-sm text-neutral-700 focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="ALL">Tất cả thanh toán</option>
            {Object.entries(paymentStatusMap).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
          <select
            value={filterPaymentMethod}
            onChange={e => {
              setFilterPaymentMethod(e.target.value)
              setPage(1)
            }}
            className="h-9 border border-neutral-200 rounded-md bg-neutral-50 px-3 text-sm text-neutral-700 focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="ALL">Tất cả phương thức</option>
            <option value="COD">COD (Nhận hàng)</option>
            <option value="PAYOS">PayOS / CK</option>
          </select>
          <div className="flex items-center gap-2 text-sm text-neutral-600 bg-neutral-50 border border-neutral-200 rounded-md h-9 px-2 overflow-hidden">
            <span className="text-neutral-400"><Calendar className="size-4" /></span>
            <input type="date" value={filterFrom} onChange={e => { setFilterFrom(e.target.value); setPage(1); }}
              className="bg-transparent focus:outline-none w-[110px]" />
            <span className="text-neutral-300">-</span>
            <input type="date" value={filterTo} onChange={e => { setFilterTo(e.target.value); setPage(1); }}
              className="bg-transparent focus:outline-none w-[110px]" />
          </div>
          {(filterStatus !== 'ALL' || filterPaymentStatus !== 'ALL' || filterPaymentMethod !== 'ALL' || filterFrom || filterTo || searchQuery) && (
            <button onClick={() => { 
              setFilterStatus('ALL'); 
              setFilterPaymentStatus('ALL'); 
              setFilterPaymentMethod('ALL'); 
              setFilterFrom(''); 
              setFilterTo(''); 
              setSearchQuery('');
              setPage(1);
            }}
              className="text-xs text-primary hover:underline whitespace-nowrap px-2">Xoá lọc</button>
          )}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-neutral-500">
            Hiển thị {fromItem} - {toItem} trên tổng <strong className="text-neutral-800">{totalCount}</strong> đơn hàng
          </p>
          {isFetching && (
            <span className="flex items-center gap-1.5 text-xs text-primary">
              <Loader2 className="size-3.5 animate-spin" /> Đang tải dữ liệu...
            </span>
          )}
        </div>
      </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50/80 text-neutral-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Đơn hàng</th>
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4 text-right">Tổng tiền</th>
                <th className="px-6 py-4 text-center">Thanh toán</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {!Array.isArray(orders) || orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-400">
                    Không tìm thấy đơn hàng nào phù hợp với bộ lọc
                  </td>
                </tr>
              ) : (
                orders.map(order => {
                  const oStatus = (order.status || 'PENDING').toUpperCase()
                  const pStatus = (order.paymentStatus || 'UNPAID').toUpperCase()
                  const StatusIcon = orderStatusMap[oStatus]?.icon || Clock
                  
                  return (
                    <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-bold text-neutral-900" title={`Mã đơn: ${(order as any).orderCode || `TOTO-DH${order.id.toString().padStart(4, '0')}`}`}>
                          {(order as any).orderCode || `TOTO-DH${order.id.toString().padStart(4, '0')}`}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1" title="Ngày đặt hàng">
                          <Calendar className="size-3" />
                          {formatDateVN(order.createdAt, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-medium text-neutral-900">{order.customer.name}</p>
                        <p className="text-xs text-neutral-500 mt-1">{order.customer.phone}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <p className="font-bold text-primary">{formatCurrency(order.total)}</p>
                        <p className="text-[10px] text-neutral-400 mt-1" title={order.paymentMethod}>
                          {paymentMethodLabel[order.paymentMethod?.toLowerCase()] || order.paymentMethod?.toUpperCase()}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${paymentStatusMap[pStatus]?.bgColor} ${paymentStatusMap[pStatus]?.color}`}>
                          {paymentStatusMap[pStatus]?.label || pStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-bold ${orderStatusMap[oStatus]?.bgColor} ${orderStatusMap[oStatus]?.color}`}>
                          <StatusIcon className="size-3.5" />
                          {orderStatusMap[oStatus]?.label || oStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Button variant="secondary" size="sm" onClick={() => setSelectedOrder(order)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                          Xem chi tiết
                        </Button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Thanh Điều Hướng Phân Trang (Server-Side Pagination Controls) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-neutral-100 bg-white">
          <div className="flex items-center gap-3 text-xs sm:text-sm text-neutral-600">
            <span>
              Hiển thị <strong className="text-neutral-900 font-semibold">{fromItem} - {toItem}</strong> trên tổng <strong className="text-neutral-900 font-semibold">{totalCount}</strong> đơn
            </span>
            <span className="text-neutral-300">|</span>
            <div className="flex items-center gap-1.5">
              <span>Mỗi trang:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setPage(1)
                }}
                className="h-8 border border-neutral-200 rounded px-2 text-xs text-neutral-700 bg-neutral-50 cursor-pointer focus:outline-none focus:border-primary font-medium"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isFetching}
              className="h-8 px-2.5 text-xs gap-1 border-neutral-200 text-neutral-700 hover:bg-neutral-50"
            >
              <ChevronLeft className="size-3.5" /> Trước
            </Button>

            {/* Các số trang */}
            {getPageNumbers(page, totalPages).map((p, idx) => {
              if (p === -1) {
                return (
                  <span key={`dots-${idx}`} className="px-1.5 text-xs text-neutral-400">
                    ...
                  </span>
                )
              }
              return (
                <Button
                  key={p}
                  variant={page === p ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(p)}
                  disabled={isFetching}
                  className={`h-8 w-8 p-0 text-xs font-medium ${
                    page === p
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  {p}
                </Button>
              )
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || isFetching}
              className="h-8 px-2.5 text-xs gap-1 border-neutral-200 text-neutral-700 hover:bg-neutral-50"
            >
              Sau <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0">
          {selectedOrder && (() => {
            const oStatus = (selectedOrder.status || 'PENDING').toUpperCase() as OrderStatus
            const pStatus = (selectedOrder.paymentStatus || 'UNPAID').toUpperCase() as PaymentStatus
            const isTerminal = oStatus === 'COMPLETED' || oStatus === 'CANCELLED'
            
            return (
              <>
                <DialogHeader className="p-6 pb-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        {(selectedOrder as any).orderCode || `TOTO-DH${selectedOrder.id.toString().padStart(4, '0')}`}
                      </DialogTitle>
                      <p className="text-sm text-neutral-500 mt-1">
                        Ngày đặt: {formatDateVN(selectedOrder.createdAt)}
                      </p>
                    </div>
                  </div>
                </DialogHeader>

                <div className="p-6 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                      <h3 className="text-sm font-bold uppercase text-neutral-500 flex items-center gap-2">
                        <User className="size-4" /> Khách hàng
                      </h3>
                      <div>
                        <p className="font-semibold">{selectedOrder.customer.name}</p>
                        <div className="mt-1 flex items-center justify-between flex-wrap gap-2 text-sm text-neutral-600">
                          <span className="flex items-center gap-2"><Phone className="size-3.5"/> {selectedOrder.customer.phone}</span>
                          {selectedOrder.customer.phone && (
                            <button
                              type="button"
                              onClick={async () => {
                                if (confirm(`Bạn có chắc chắn muốn CHẶN số điện thoại ${selectedOrder.customer.phone} khỏi phương thức COD không?`)) {
                                  await blockPhone(selectedOrder.customer.phone, `Khách bom hàng đơn #${selectedOrder.id}`);
                                }
                              }}
                              className="text-[11px] font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-2 py-0.5 rounded transition-colors"
                              title="Chặn số điện thoại này đặt đơn COD trong tương lai"
                            >
                              ⛔ Chặn COD (Blacklist)
                            </button>
                          )}
                        </div>
                        <p className="text-sm mt-1 flex items-center gap-2 text-neutral-600"><Mail className="size-3.5"/> {selectedOrder.customer.email}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                      <h3 className="text-sm font-bold uppercase text-neutral-500 flex items-center gap-2">
                        <MapPin className="size-4" /> Giao hàng tới
                      </h3>
                      <div>
                        <p className="text-sm text-neutral-700 leading-relaxed">{String(selectedOrder.shippingAddress || selectedOrder.customer.address)}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold uppercase text-neutral-500 mb-4">Sản phẩm đã đặt</h3>
                    <div className="border border-neutral-100 rounded-xl overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-neutral-50">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold text-neutral-600">Sản phẩm</th>
                            <th className="px-4 py-3 text-center font-semibold text-neutral-600">SL</th>
                            <th className="px-4 py-3 text-right font-semibold text-neutral-600">Thành tiền</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {selectedOrder.items.map((item, idx) => (
                            <tr key={idx}>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  {item.image && (
                                    <div className="size-10 rounded-md bg-neutral-100 overflow-hidden relative shrink-0">
                                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-semibold text-neutral-900">{item.title}</p>
                                    <p className="text-xs text-neutral-500 mt-0.5">{item.variantName}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center font-medium">{item.quantity}</td>
                              <td className="px-4 py-3 text-right font-semibold">{formatCurrency(item.price * item.quantity)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-neutral-50/50">
                          <tr>
                            <td colSpan={2} className="px-4 py-3 text-right font-medium text-neutral-600">Tổng cộng</td>
                            <td className="px-4 py-3 text-right font-bold text-lg text-primary">{formatCurrency(selectedOrder.total)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-neutral-100 pt-8">
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold uppercase text-neutral-500 flex items-center gap-2">
                        <CreditCard className="size-4" /> Thanh toán
                      </h3>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-neutral-600 mr-2">Phương thức: <strong>{paymentMethodLabel[selectedOrder.paymentMethod?.toLowerCase()] || selectedOrder.paymentMethod?.toUpperCase()}</strong></p>
                      </div>
                      
                      {/* Nút hành động chuyên biệt cho đơn COD */}
                      {selectedOrder.paymentMethod?.toLowerCase() === 'cod' && pStatus === 'COD_UNPAID' && (
                        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-900">Thu tiền mặt khi nhận hàng:</span>
                            <span className="text-sm font-bold text-primary">{formatCurrency(selectedOrder.total)}</span>
                          </div>
                          <Button 
                            size="sm"
                            disabled={isUpdating || (oStatus !== 'SHIPPED' && oStatus !== 'COMPLETED')}
                            title={oStatus !== 'SHIPPED' && oStatus !== 'COMPLETED' ? 'Chỉ có thể xác nhận thu tiền khi đơn hàng đang giao (SHIPPED) hoặc đã hoàn thành (COMPLETED)' : 'Xác nhận khách đã thanh toán tiền mặt'}
                            onClick={async () => {
                              setIsUpdating(true)
                              const ok = await markCodCollected(selectedOrder.id)
                              if (ok) {
                                setSelectedOrder(prev => prev ? { ...prev, paymentStatus: 'COD_COLLECTED' } : null)
                                fetchOrderHistory(selectedOrder.id).then(h => setOrderHistory(h)).catch(() => {})
                              }
                              setIsUpdating(false)
                            }}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 shadow-xs transition-all"
                          >
                            <CheckCircle2 className="size-4 mr-1.5" /> Xác nhận đã thu tiền COD
                          </Button>
                          {oStatus !== 'SHIPPED' && oStatus !== 'COMPLETED' && (
                            <p className="text-[11px] text-amber-700 leading-tight">
                              * Nút này chỉ khả dụng khi trạng thái đơn hàng là <strong>Đang giao</strong> hoặc <strong>Hoàn thành</strong>.
                            </p>
                          )}
                        </div>
                      )}

                      {selectedOrder.paymentMethod?.toLowerCase() === 'cod' && pStatus === 'COD_COLLECTED' && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-semibold">
                          <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                          <span>Đã thu tiền mặt {formatCurrency(selectedOrder.total)} thành công.</span>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 pt-1">
                        {(selectedOrder.paymentMethod?.toLowerCase() === 'cod' 
                          ? ['COD_UNPAID', 'COD_COLLECTED', 'REFUNDED'] 
                          : ['UNPAID', 'PAID', 'REFUNDED']
                        ).map(status => {
                          const isCurrent = pStatus === status;
                          const transInfo = getPaymentTransitionInfo(
                            oStatus,
                            pStatus,
                            status,
                            selectedOrder.paymentMethod
                          );
                          const isDisabled = isUpdating || isCurrent || !transInfo.isValid;

                          return (
                            <Button 
                              key={status}
                              variant={isCurrent ? "default" : "outline"}
                              size="sm"
                              disabled={isDisabled}
                              title={isCurrent ? "Trạng thái thanh toán hiện tại" : transInfo.tooltip}
                              onClick={() => handleUpdatePaymentStatus(selectedOrder.id, status as PaymentStatus)}
                              className={
                                isCurrent 
                                  ? paymentStatusMap[status]?.bgColor + ' ' + paymentStatusMap[status]?.color + ' border-transparent font-bold cursor-default shadow-xs' 
                                  : transInfo.isValid
                                    ? 'hover:bg-neutral-100 font-medium cursor-pointer'
                                    : 'opacity-30 text-neutral-400 bg-neutral-50/50 cursor-not-allowed border-dashed'
                              }
                            >
                              {paymentStatusMap[status]?.label || status}
                            </Button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold uppercase text-neutral-500 flex items-center gap-2">
                          <Package className="size-4" /> Trạng thái Đơn hàng
                        </h3>
                        {isTerminal && (
                          <span className="text-[11px] font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                            Trạng thái kết thúc
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {(() => {
                          const validTransitions = getValidTransitions(oStatus);
                          return (['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERY_FAILED', 'COMPLETED', 'CANCELLED'] as OrderStatus[]).map(status => {
                            const conf = orderStatusMap[status]
                            const isActive = oStatus === status
                            const isValid = validTransitions.includes(status)
                            const StatusIcon = conf.icon
                            const isDisabled = isUpdating || isActive || !isValid

                            let tooltip = ""
                            if (isActive) tooltip = "Trạng thái hiện tại của đơn hàng"
                            else if (isTerminal) tooltip = "Đơn hàng đã kết thúc, không thể đổi trạng thái"
                            else if (!isValid) tooltip = `Không thể chuyển từ "${orderStatusMap[oStatus]?.label}" sang "${conf.label}"`

                            return (
                              <Button 
                                key={status}
                                variant={isActive ? "default" : "outline"}
                                disabled={isDisabled}
                                title={tooltip}
                                onClick={() => handleStatusClick(status)}
                                className={`justify-start transition-all ${
                                  isActive 
                                    ? conf.bgColor + ' ' + conf.color + ' border-transparent font-bold cursor-default shadow-xs' 
                                    : isValid
                                      ? 'text-neutral-700 hover:bg-neutral-100 hover:border-neutral-300 font-medium cursor-pointer'
                                      : 'opacity-30 text-neutral-400 bg-neutral-50/50 cursor-not-allowed border-dashed'
                                }`}
                              >
                                <StatusIcon className="size-4 mr-2 shrink-0" /> {conf.label}
                                {isActive && <CheckCircle2 className="size-4 ml-auto text-current" />}
                              </Button>
                            )
                          })
                        })()}
                      </div>

                      {Boolean(selectedOrder.deliveryAttempts && selectedOrder.deliveryAttempts > 0) && (
                        <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex items-center gap-2">
                          <AlertTriangle className="size-4 shrink-0 text-amber-600" />
                          <span>Số lần thử giao: <strong>{selectedOrder.deliveryAttempts} lần</strong>.</span>
                        </div>
                      )}

                      {oStatus === 'DELIVERY_FAILED' && (
                        <div className="text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-lg p-2.5 flex items-center gap-2">
                          <AlertTriangle className="size-4 shrink-0 text-rose-600" />
                          <span>Đơn hàng <strong>Giao thất bại</strong>. Bạn có thể bấm <strong>Đang giao</strong> để shipper giao lại, hoặc <strong>Đã hủy</strong> nếu không thể phát hàng. (Từ 2 đơn thất bại trở lên, hệ thống sẽ tự động chặn COD của SĐT này).</span>
                        </div>
                      )}

                      {oStatus === 'COMPLETED' && (
                        <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex items-center gap-2">
                          <CheckCircle2 className="size-4 shrink-0" />
                          <span>Đơn hàng đã <strong>Hoàn thành</strong> (Trạng thái kết thúc, doanh thu đã ghi nhận).</span>
                        </div>
                      )}

                      {oStatus === 'CANCELLED' && (
                        <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg p-2.5 flex items-center gap-2">
                          <XCircle className="size-4 shrink-0" />
                          <span>Đơn hàng đã <strong>Hủy</strong> (Trạng thái kết thúc, kho đã hoàn trả).</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Lịch sử thay đổi trạng thái (Audit Log) */}
                  <div className="border-t border-neutral-100 pt-8 space-y-4">
                    <h3 className="text-sm font-bold uppercase text-neutral-500 flex items-center gap-2">
                      <History className="size-4" /> Lịch sử thay đổi trạng thái {orderHistory.length > 0 && `(${orderHistory.length})`}
                    </h3>
                    
                    {loadingHistory ? (
                      <p className="text-xs text-neutral-400 italic">Đang tải lịch sử thay đổi...</p>
                    ) : orderHistory.length === 0 ? (
                      <p className="text-xs text-neutral-400 italic">Chưa có lịch sử thay đổi trạng thái nào.</p>
                    ) : (
                      <div className="space-y-2.5">
                        {orderHistory.map((item) => {
                          const oldConf = orderStatusMap[item.oldStatus?.toUpperCase()] || { label: item.oldStatus, color: 'text-neutral-600', bgColor: 'bg-neutral-100' };
                          const newConf = orderStatusMap[item.newStatus?.toUpperCase()] || { label: item.newStatus, color: 'text-neutral-600', bgColor: 'bg-neutral-100' };
                          return (
                            <div key={item.id} className="text-xs bg-neutral-50/80 border border-neutral-100 rounded-xl p-3 flex flex-col gap-1.5">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5 font-bold">
                                  <span className={`px-2 py-0.5 rounded text-[11px] ${oldConf.bgColor} ${oldConf.color}`}>{oldConf.label}</span>
                                  <ArrowRight className="size-3 text-neutral-400" />
                                  <span className={`px-2 py-0.5 rounded text-[11px] ${newConf.bgColor} ${newConf.color}`}>{newConf.label}</span>
                                </div>
                                <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                                  <Clock className="size-3" />
                                  {formatDateVN(item.changedAt, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center justify-between gap-2 text-neutral-600 mt-0.5">
                                <span>Người thực hiện: <strong className="text-neutral-800">{item.changedBy}</strong></span>
                                {item.note && <span className="text-neutral-500 italic bg-white px-2 py-0.5 rounded border border-neutral-100">&quot;{item.note}&quot;</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>

      {/* Modal xác nhận hủy đơn & nhắc nhở hoàn tiền */}
      <Dialog open={cancelModalOpen} onOpenChange={(open) => !open && setCancelModalOpen(false)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-red-600 flex items-center gap-2">
              <AlertTriangle className="size-5" /> Xác nhận hủy đơn hàng
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {selectedOrder && (selectedOrder.paymentStatus || '').toUpperCase() === 'PAID' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 space-y-2">
                <p className="text-sm font-bold flex items-center gap-1.5">
                  <AlertTriangle className="size-4 text-amber-600 shrink-0" />
                  Cảnh báo: Đơn hàng đã thanh toán thành công!
                </p>
                <p className="text-xs leading-relaxed">
                  Đơn này đã được thanh toán <strong>{formatCurrency(selectedOrder.total)}</strong> qua <strong>{paymentMethodLabel[selectedOrder.paymentMethod?.toLowerCase()] || selectedOrder.paymentMethod?.toUpperCase()}</strong>. Bạn có muốn đánh dấu đơn hàng cần <strong>Hoàn tiền (REFUNDED)</strong> để quản lý việc hoàn tiền cho khách không?
                </p>
              </div>
            )}

            <div>
              <label className="text-xs font-bold uppercase text-neutral-600 block mb-1.5">
                Lý do hủy đơn hàng (sẽ gửi email báo khách & lưu audit log):
              </label>
              <Textarea 
                placeholder="VD: Khách hàng yêu cầu hủy, hết hàng trong kho, sai thông tin giao hàng..."
                value={cancelReasonInput}
                onChange={(e) => setCancelReasonInput(e.target.value)}
                className="text-sm min-h-[80px]"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2 border-t border-neutral-100">
            <Button variant="ghost" size="sm" onClick={() => setCancelModalOpen(false)} disabled={isUpdating}>
              Bỏ qua
            </Button>
            
            {selectedOrder && (selectedOrder.paymentStatus || '').toUpperCase() === 'PAID' ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={isUpdating}
                  onClick={() => executeStatusUpdate('CANCELLED', undefined, cancelReasonInput || 'Admin hủy đơn (chưa hoàn tiền)')}
                  className="text-neutral-700"
                >
                  Chỉ Hủy đơn (Chưa hoàn tiền)
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  disabled={isUpdating}
                  onClick={() => executeStatusUpdate('CANCELLED', 'REFUNDED', cancelReasonInput || 'Admin hủy đơn & Đánh dấu hoàn tiền')}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                  Hủy đơn + Đánh dấu Hoàn tiền
                </Button>
              </>
            ) : (
              <Button 
                variant="destructive" 
                size="sm"
                disabled={isUpdating}
                onClick={() => executeStatusUpdate('CANCELLED', undefined, cancelReasonInput || 'Admin hủy đơn hàng')}
                className="bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                Xác nhận Hủy đơn
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
