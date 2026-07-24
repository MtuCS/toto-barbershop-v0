"use client"

import { useState, useEffect } from "react"
import { useDataStore } from "@/store/data-store"
import { formatCurrency } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Search, Package, MapPin, Phone, User, Calendar, CreditCard, Clock, CheckCircle2, XCircle, Truck, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import type { Order, OrderStatus, PaymentStatus } from "@/types"
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

export function OrderAdminPage() {
  const { orders, updateOrderStatus, fetchOrders } = useDataStore()
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  // Sort orders descending by createdAt
  const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  
  const filteredOrders = sortedOrders.filter(o => 
    o.id.toString().includes(searchQuery) || 
    o.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.customer.phone.includes(searchQuery)
  )

  const handleUpdateStatus = async (orderId: string | number, newStatus: OrderStatus) => {
    setIsUpdating(true)
    try {
      await updateOrderStatus(orderId.toString(), { status: newStatus })
      toast.success("Đã cập nhật trạng thái đơn hàng")
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null)
    } catch (e) {
      toast.error("Lỗi khi cập nhật trạng thái")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleUpdatePaymentStatus = async (orderId: string | number, newPaymentStatus: PaymentStatus) => {
    setIsUpdating(true)
    try {
      await updateOrderStatus(orderId.toString(), { paymentStatus: newPaymentStatus })

      toast.success(`Chuyển trạng thái thanh toán thành ${newPaymentStatus}`)
      setSelectedOrder(prev => prev ? { ...prev, paymentStatus: newPaymentStatus } : null)
    } catch (e) {
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
        <div className="p-4 border-b border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
            <Input 
              placeholder="Tìm theo Mã Đơn, Tên KH hoặc Số Điện Thoại..." 
              className="pl-9 bg-neutral-50/50 border-neutral-200 focus-visible:bg-white"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
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
                        <p className="font-bold text-neutral-900">TOTO-DH{order.id.toString().padStart(4, '0')}</p>
                        <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
                          <Calendar className="size-3" />
                          {new Date(order.createdAt).toLocaleDateString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-medium text-neutral-900">{order.customer.name}</p>
                        <p className="text-xs text-neutral-500 mt-1">{order.customer.phone}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <p className="font-bold text-primary">{formatCurrency(order.total)}</p>
                        <p className="text-[10px] text-neutral-400 uppercase mt-1">{order.paymentMethod}</p>
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
            
            return (
              <>
                <DialogHeader className="p-6 pb-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        Đơn hàng TOTO-DH{selectedOrder.id.toString().padStart(4, '0')}
                      </DialogTitle>
                      <p className="text-sm text-neutral-500 mt-1">
                        Ngày đặt: {new Date(selectedOrder.createdAt).toLocaleString("vi-VN")}
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
                        <span className="text-sm text-neutral-600 mr-2">Phương thức: <strong className="uppercase">{selectedOrder.paymentMethod}</strong></span>
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
                      <h3 className="text-sm font-bold uppercase text-neutral-500 flex items-center gap-2">
                        <Package className="size-4" /> Trạng thái Đơn hàng
                      </h3>
                      
                      <div className="flex flex-col gap-2">
                        {(['PENDING', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED'] as OrderStatus[]).map(status => {
                          const conf = orderStatusMap[status]
                          const isActive = oStatus === status
                          const StatusIcon = conf.icon
                          return (
                            <Button 
                              key={status}
                              variant={isActive ? "default" : "outline"}
                              disabled={isUpdating}
                              onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                              className={`justify-start ${isActive ? conf.bgColor + ' ' + conf.color + ' border-transparent font-bold hover:' + conf.bgColor : 'text-neutral-600 hover:bg-neutral-50'}`}
                            >
                              <StatusIcon className="size-4 mr-2" /> {conf.label}
                              {isActive && <CheckCircle2 className="size-4 ml-auto" />}
                            </Button>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                </div>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
