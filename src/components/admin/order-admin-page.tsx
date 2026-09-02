"use client"

import { useState, useEffect } from "react"
import { useDataStore } from "@/store/data-store"
import { formatCurrency } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Search, Package, MapPin, Phone, User, Calendar, CreditCard, Clock, CheckCircle2, XCircle, Truck, Mail, AlertTriangle, History, ArrowRight } from "lucide-react"
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
  COMPLETED: { label: "Hoàn thành", icon: CheckCircle2, color: "text-emerald-700", bgColor: "bg-emerald-100" },
  CANCELLED: { label: "Đã hủy", icon: XCircle, color: "text-red-700", bgColor: "bg-red-100" },
}

const paymentStatusMap: Record<string, { label: string; color: string; bgColor: string }> = {
  UNPAID: { label: "Chưa TT", color: "text-neutral-700", bgColor: "bg-neutral-100" },
  PAID: { label: "Đã TT", color: "text-emerald-700", bgColor: "bg-emerald-100" },
  REFUNDED: { label: "Hoàn tiền", color: "text-purple-700", bgColor: "bg-purple-100" },
}

const VALID_TRANSITIONS: Record<string, OrderStatus[]> = {
  PENDING: ['PROCESSING', 'SHIPPED', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'COMPLETED', 'CANCELLED'],
  SHIPPED: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [], // Trạng thái cuối
  CANCELLED: [],  // Trạng thái cuối
}

function getValidTransitions(currentStatus: string): OrderStatus[] {
  return VALID_TRANSITIONS[currentStatus.toUpperCase()] || []
}

export function OrderAdminPage() {
  const { orders, updateOrderStatus, fetchOrderHistory, fetchOrders } = useDataStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("ALL")
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>("ALL")
  const [filterPaymentMethod, setFilterPaymentMethod] = useState<string>("ALL")
  const [filterFrom, setFilterFrom] = useState("")
  const [filterTo, setFilterTo] = useState("")

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [orderHistory, setOrderHistory] = useState<OrderStatusHistory[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  // State popup xác nhận hủy đơn
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [cancelReasonInput, setCancelReasonInput] = useState("")

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

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

  // Format ngày theo múi giờ Việt Nam để tránh bug ngày 23:59 UTC
  const formatDateVN = (dateStr: string | Date, opts?: Intl.DateTimeFormatOptions) => {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
    return date.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", ...opts })
  }

  // Sort orders descending by createdAt
  const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  
  const filteredOrders = sortedOrders.filter(o => {
    const q = searchQuery.toLowerCase().trim();
    const customerName = (o.customer?.name || '').toLowerCase();
    const customerPhone = (o.customer?.phone || '');
    const orderCode = (o as any).orderCode?.toLowerCase() || `toto-dh${o.id.toString().padStart(4, '0')}`;
    const legacyCode = (o.code || '').toLowerCase();

    const matchSearch = !q || 
      o.id.toString().includes(q) || 
      orderCode.includes(q) ||
      legacyCode.includes(q) ||
      customerName.includes(q) || 
      customerPhone.includes(q);
    
    const matchStatus = filterStatus === "ALL" || (o.status || '').toUpperCase() === filterStatus.toUpperCase();
    const matchPaymentStatus = filterPaymentStatus === "ALL" || (o.paymentStatus || '').toUpperCase() === filterPaymentStatus.toUpperCase();
    const matchPaymentMethod = filterPaymentMethod === "ALL" || (o.paymentMethod || '').toLowerCase() === filterPaymentMethod.toLowerCase();
    
    // So sánh ngày theo VN timezone
    const orderDateVN = new Date(new Date(o.createdAt).toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }))
    const matchFrom = !filterFrom || orderDateVN >= new Date(filterFrom)
    const matchTo = !filterTo || orderDateVN <= new Date(filterTo + "T23:59:59")
    
    return matchSearch && matchStatus && matchPaymentStatus && matchPaymentMethod && matchFrom && matchTo
  })

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
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="h-9 border border-neutral-200 rounded-md bg-neutral-50 px-3 text-sm text-neutral-700 focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="ALL">Tất cả đơn hàng</option>
            {Object.entries(orderStatusMap).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
          <select
            value={filterPaymentStatus}
            onChange={e => setFilterPaymentStatus(e.target.value)}
            className="h-9 border border-neutral-200 rounded-md bg-neutral-50 px-3 text-sm text-neutral-700 focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="ALL">Tất cả thanh toán</option>
            {Object.entries(paymentStatusMap).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
          <select
            value={filterPaymentMethod}
            onChange={e => setFilterPaymentMethod(e.target.value)}
            className="h-9 border border-neutral-200 rounded-md bg-neutral-50 px-3 text-sm text-neutral-700 focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="ALL">Tất cả phương thức</option>
            <option value="COD">COD (Nhận hàng)</option>
            <option value="PAYOS">PayOS / CK</option>
          </select>
          <div className="flex items-center gap-2 text-sm text-neutral-600 bg-neutral-50 border border-neutral-200 rounded-md h-9 px-2 overflow-hidden">
            <span className="text-neutral-400"><Calendar className="size-4" /></span>
            <input type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)}
              className="bg-transparent focus:outline-none w-[110px]" />
            <span className="text-neutral-300">-</span>
            <input type="date" value={filterTo} onChange={e => setFilterTo(e.target.value)}
              className="bg-transparent focus:outline-none w-[110px]" />
          </div>
          {(filterStatus !== 'ALL' || filterPaymentStatus !== 'ALL' || filterPaymentMethod !== 'ALL' || filterFrom || filterTo || searchQuery) && (
            <button onClick={() => { setFilterStatus('ALL'); setFilterPaymentStatus('ALL'); setFilterPaymentMethod('ALL'); setFilterFrom(''); setFilterTo(''); setSearchQuery('') }}
              className="text-xs text-primary hover:underline whitespace-nowrap px-2">Xoá lọc</button>
          )}
        </div>
        <p className="text-xs text-neutral-400">
          Hiển thị {filteredOrders.length} / {orders.length} đơn hàng
        </p>
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
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-400">
                    Không tìm thấy đơn hàng nào phù hợp
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
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
                        <p className="text-sm mt-1 flex items-center gap-2 text-neutral-600"><Phone className="size-3.5"/> {selectedOrder.customer.phone}</p>
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
                      
                      <div className="flex flex-wrap gap-2">
                        {(['UNPAID', 'PAID', 'REFUNDED'] as PaymentStatus[]).map(status => (
                          <Button 
                            key={status}
                            variant={pStatus === status ? "default" : "outline"}
                            size="sm"
                            disabled={isUpdating}
                            onClick={() => handleUpdatePaymentStatus(selectedOrder.id, status)}
                            className={pStatus === status ? paymentStatusMap[status].bgColor + ' ' + paymentStatusMap[status].color + ' border-transparent' : ''}
                          >
                            {paymentStatusMap[status].label}
                          </Button>
                        ))}
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
                          return (['PENDING', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED'] as OrderStatus[]).map(status => {
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
