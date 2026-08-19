"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Phone, MapPin, Mail, Loader2, Save, ShoppingBag, Plus, Trash2, LogOut, Package, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react"
import { useCustomerUserStore } from "@/store/customer-user-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDataStore } from "@/store/data-store"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { toast } from "sonner"
import type { OrderStatus, PaymentStatus } from "@/types"
import { createClient } from "@/utils/supabase/client"

function OrderStepper({ status }: { status: string }) {
  const normStatus = (status || "PENDING").toUpperCase()
  if (normStatus === 'CANCELLED') {
    return (
      <div className="flex items-center text-red-600 font-semibold gap-2 bg-red-50 p-4 rounded-xl border border-red-100">
        <span className="size-2 rounded-full bg-red-600"></span> Đơn hàng đã bị hủy
      </div>
    )
  }

  const steps = [
    { id: 'PENDING', label: 'Chờ xử lý' },
    { id: 'PROCESSING', label: 'Đang chuẩn bị' },
    { id: 'SHIPPED', label: 'Đang giao' },
    { id: 'COMPLETED', label: 'Hoàn thành' },
  ]
  const currentIndex = steps.findIndex(s => s.id === normStatus)

  return (
    <div className="relative mt-8 mb-6 mx-4 flex items-center justify-between">
      {/* Line background */}
      <div className="absolute left-0 top-2.5 -translate-y-1/2 w-full h-1 bg-neutral-200 rounded"></div>
      {/* Active line */}
      <div className="absolute left-0 top-2.5 -translate-y-1/2 h-1 bg-emerald-500 rounded transition-all duration-500" style={{ width: `${(Math.max(0, currentIndex) / (steps.length - 1)) * 100}%` }}></div>
      
      {steps.map((step, index) => {
        const isCompleted = index <= currentIndex;
        return (
          <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
            <div className={`size-5 rounded-full ring-4 ${isCompleted ? 'bg-emerald-500 ring-emerald-50' : 'bg-neutral-300 ring-white'} transition-colors duration-500`}></div>
            <span className={`absolute top-7 whitespace-nowrap text-[10px] sm:text-xs font-semibold ${isCompleted ? 'text-emerald-700' : 'text-neutral-400'}`}>
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, token, setUser, logout } = useCustomerUserStore()
  const allOrders = useDataStore((s) => s.orders)
  const orders = allOrders.filter(o => o.customer.email === user?.email)

  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  })

  // Address Modal State
  const [addressModalOpen, setAddressModalOpen] = useState(false)
  const [provinces, setProvinces] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [wards, setWards] = useState<any[]>([])
  
  const [newAddress, setNewAddress] = useState({
    provinceCode: "", provinceName: "",
    districtCode: "", districtName: "",
    wardCode: "", wardName: "",
    street: "",
    isDefault: false
  })
  const [addingAddress, setAddingAddress] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null)
  const [orderToCancel, setOrderToCancel] = useState<string | number | null>(null)
  const [expandedOrderId, setExpandedOrderId] = useState<string | number | null>(null)

  // Password Modal State
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })
  const [changingPassword, setChangingPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
    const urlParams = new URLSearchParams(window.location.search)
    const tab = urlParams.get('tab')
    if (tab === 'orders') {
      setActiveTab('orders')
    }
  }, [])

  const handleTokenExpired = () => {
    toast.error("Phiên đăng nhập đã hết hạn", {
      description: "Vui lòng đăng nhập lại để tiếp tục.",
      duration: 5000,
    })
    logout()
    router.push("/")
  }

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.status === 401) { handleTokenExpired(); return; }
      if (res.ok) {
        const data = await res.json()
        setFormData({
          name: data.name || "",
          phone: data.phone || ""
        })
        setUser(data, token)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (mounted && !user) router.push("/")
  }, [mounted, user, router])

  useEffect(() => {
    if (user && token) {
      fetchProfile()
      useDataStore.getState().fetchOrders()
    }
  }, [user?.id, token])

  // Realtime: Lắng nghe thay đổi trạng thái đơn hàng từ Supabase
  useEffect(() => {
    if (!user?.id) return;

    const supabase = createClient();

    const channel = supabase
      .channel(`orders-user-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'Order',
          filter: `userId=eq.${user.id}`,
        },
        (payload) => {
          const updated = payload.new as { id: number; status: string; paymentStatus: string };
          useDataStore.getState().setOrderStatusInStore(
            updated.id,
            updated.status.toUpperCase() as OrderStatus,
            updated.paymentStatus.toUpperCase() as PaymentStatus
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id])


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (res.status === 401) { handleTokenExpired(); return; }
      if (res.ok) {
        toast.success("Cập nhật thành công!")
        setUser(data, token)
      } else {
        toast.error(data.error || "Cập nhật thất bại")
      }
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error(err.message || "Lỗi kết nối máy chủ")
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Mật khẩu mới không khớp")
      return
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự")
      return
    }
    
    setChangingPassword(true)
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword })
      })
      const data = await res.json()
      if (res.ok) {
        toast.success("Đổi mật khẩu thành công. Vui lòng đăng nhập lại.")
        setPasswordModalOpen(false)
        logout()
        router.push("/")
      } else {
        toast.error(data.error || "Đổi mật khẩu thất bại")
      }
    } catch (error) {
      console.error(error)
      toast.error("Lỗi kết nối máy chủ")
    } finally {
      setChangingPassword(false)
    }
  }

  // --- Address Logic ---
  const fetchProvinces = async () => {
    const res = await fetch("https://provinces.open-api.vn/api/p/")
    const data = await res.json()
    setProvinces(data)
  }
  const fetchDistricts = async (pCode: string) => {
    const res = await fetch(`https://provinces.open-api.vn/api/p/${pCode}?depth=2`)
    const data = await res.json()
    setDistricts(data.districts)
  }
  const fetchWards = async (dCode: string) => {
    const res = await fetch(`https://provinces.open-api.vn/api/d/${dCode}?depth=2`)
    const data = await res.json()
    setWards(data.wards)
  }

  const openAddressModal = () => {
    setNewAddress({ provinceCode: "", provinceName: "", districtCode: "", districtName: "", wardCode: "", wardName: "", street: "", isDefault: false })
    setDistricts([])
    setWards([])
    fetchProvinces()
    setAddressModalOpen(true)
  }

  const handleAddAddress = async () => {
    setAddingAddress(true)
    try {
      const res = await fetch("/api/users/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          province: newAddress.provinceName,
          district: newAddress.districtName,
          ward: newAddress.wardName,
          street: newAddress.street,
          isDefault: newAddress.isDefault || (!user?.addresses || user.addresses.length === 0)
        })
      })
      if (res.ok) {
        fetchProfile()
        setAddressModalOpen(false)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setAddingAddress(false)
    }
  }

  const handleDeleteAddress = async (id: number) => {
    try {
      const res = await fetch(`/api/users/addresses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) fetchProfile()
    } catch (e) {
      console.error(e)
    } finally {
      setAddressToDelete(null)
    }
  }

  const handleSetDefaultAddress = async (id: number) => {
    try {
      const res = await fetch(`/api/users/addresses/${id}/default`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) fetchProfile()
    } catch (e) {
      console.error(e)
    }
  }

  const handleCancelOrder = async (id: string | number) => {
    const success = await useDataStore.getState().cancelOrder(id.toString(), token || "")
    if (success) {
      toast.success("Đã hủy đơn hàng thành công")
    } else {
      toast.error("Hủy đơn hàng thất bại")
    }
    setOrderToCancel(null)
  }

  if (!mounted || !user) return null

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 md:px-6">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold uppercase tracking-tight">Hồ sơ của tôi</h1>
          <p className="mt-2 text-neutral-500">Quản lý thông tin cá nhân và đơn hàng</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); router.push(`/profile?tab=${v}`); }} className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-2 gap-4 bg-transparent p-0">
          <TabsTrigger value="profile" className="flex h-14 sm:h-16 items-center justify-center gap-2 rounded-2xl border-2 border-transparent bg-neutral-100 text-sm sm:text-base font-bold text-neutral-500 transition-all hover:bg-neutral-200/50 data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-none">
            <User className="size-5 sm:size-6" /> <span className="hidden sm:inline">Thông tin cá nhân</span><span className="sm:hidden">Hồ sơ</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex h-14 sm:h-16 items-center justify-center gap-2 rounded-2xl border-2 border-transparent bg-neutral-100 text-sm sm:text-base font-bold text-neutral-500 transition-all hover:bg-neutral-200/50 data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-none">
            <Package className="size-5 sm:size-6" /> <span className="hidden sm:inline">Đơn hàng của tôi</span><span className="sm:hidden">Đơn hàng</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Thông tin liên hệ */}
            <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
              <h2 className="text-xl font-bold">Thông tin liên hệ</h2>
              <form onSubmit={handleSave} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Email (Không thể thay đổi)</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-neutral-400" />
                    <Input type="email" disabled value={user.email} className="h-12 rounded-xl bg-neutral-100 pl-11 text-neutral-500" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Họ và tên</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-neutral-400" />
                    <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-12 rounded-xl pl-11 focus-visible:ring-primary/20" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Số điện thoại</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-neutral-400" />
                    <Input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="h-12 rounded-xl pl-11 focus-visible:ring-primary/20" />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button type="submit" disabled={saving} className="h-12 rounded-xl w-full sm:w-auto px-8">
                    {saving ? <Loader2 className="mr-2 size-4 animate-spin"/> : <Save className="mr-2 size-4"/>} Lưu thông tin
                  </Button>
                  <Button type="button" variant="outline" className="h-12 rounded-xl w-full sm:w-auto px-8 border-neutral-300" onClick={() => { setPasswordForm({currentPassword: "", newPassword: "", confirmPassword: ""}); setPasswordModalOpen(true); }}>
                    Đổi mật khẩu
                  </Button>
                </div>
              </form>
            </div>

            {/* Sổ địa chỉ */}
            <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Sổ địa chỉ</h2>
                <Button onClick={openAddressModal} variant="outline" size="sm" className="rounded-full h-8">
                  <Plus className="mr-2 size-4"/> Thêm mới
                </Button>
              </div>
              
              <div className="space-y-4 mt-4">
                {(!user.addresses || user.addresses.length === 0) ? (
                  <div className="p-8 text-center text-neutral-400 border border-dashed rounded-xl">Chưa có địa chỉ nào được lưu.</div>
                ) : (
                  user.addresses.map(addr => (
                    <div key={addr.id} className={`p-4 rounded-xl border transition-all ${addr.isDefault ? 'border-primary/50 bg-primary/5' : 'border-neutral-200 hover:border-neutral-300'}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                          <MapPin className={`mt-0.5 size-5 ${addr.isDefault ? 'text-primary' : 'text-neutral-400'}`} />
                          <div>
                            <p className="font-semibold text-neutral-900">{addr.street}</p>
                            <p className="text-sm text-neutral-500 mt-1">{addr.ward}, {addr.district}, {addr.province}</p>
                            {addr.isDefault && <span className="inline-block mt-2 text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">Mặc định</span>}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Button variant="outline" size="sm" onClick={() => setAddressToDelete(addr.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                            <Trash2 className="size-4 mr-2" /> Xóa</Button>
                          {!addr.isDefault && (
                            <Button variant="link" size="sm" onClick={() => handleSetDefaultAddress(addr.id)} className="text-xs h-6 px-2 text-primary hover:text-primary/80">Đặt mặc định</Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="rounded-2xl bg-neutral-50 p-6 shadow-sm ring-1 ring-black/5 md:p-8">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold"><ShoppingBag className="size-5" /> Lịch sử Đơn hàng</h2>
            {orders.length === 0 ? <div className="text-center py-12 text-neutral-500 bg-white rounded-xl border border-dashed">Bạn chưa có đơn hàng nào.</div> : (
              <div className="space-y-6">
                {orders.map(o => (
                  <div key={o.id} className="rounded-xl bg-white p-6 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
                      <div>
                        <p className="font-bold text-lg">Đơn hàng TOTO-DH{o.id.toString().padStart(4, '0')}</p>
                        <p className="text-sm text-neutral-500 mt-1">Ngày đặt: {new Date(o.createdAt).toLocaleDateString("vi-VN", { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="font-bold text-lg text-primary">{o.total.toLocaleString("vi-VN")}đ</p>
                        <div className="flex items-center sm:justify-end gap-2 mt-2">
                          <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${(o.paymentStatus || '').toUpperCase() === 'PAID' ? 'bg-emerald-100 text-emerald-700' : (o.paymentStatus || '').toUpperCase() === 'REFUNDED' ? 'bg-purple-100 text-purple-700' : 'bg-neutral-100 text-neutral-600'}`}>
                            {(o.paymentStatus || '').toUpperCase() === 'PAID' ? 'Đã thanh toán' : (o.paymentStatus || '').toUpperCase() === 'REFUNDED' ? 'Đã hoàn tiền' : 'Chưa thanh toán'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Stepper Progress */}
                    <div className="pt-6 pb-2 w-full max-w-2xl mx-auto">
                      <OrderStepper status={o.status as string} />
                    </div>

                    <div className="mt-4 flex flex-col items-center sm:flex-row sm:justify-end gap-4 border-t border-neutral-100 pt-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setExpandedOrderId(expandedOrderId === o.id ? null : o.id)}
                        className="text-neutral-500 w-full sm:w-auto"
                      >
                        {expandedOrderId === o.id ? 'Thu gọn' : 'Xem chi tiết'}
                        {expandedOrderId === o.id ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                      </Button>
                      {(o.status || 'PENDING').toUpperCase() === 'PENDING' && (
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 w-full sm:w-auto" onClick={() => setOrderToCancel(o.id)}>
                          Hủy đơn
                        </Button>
                      )}
                      {(o.status || '').toUpperCase() === "PENDING" && (o.paymentStatus || '').toUpperCase() === "PAID" && (
                        <p className="text-sm text-amber-600 font-medium italic bg-amber-50 px-4 py-2 rounded-lg text-center w-full sm:w-auto">Đã thanh toán. L/H CSKH để huỷ đơn & hoàn tiền.</p>
                      )}
                    </div>

                    {/* Order Details Accordion */}
                    {expandedOrderId === o.id && (
                      <div className="mt-6 border-t border-neutral-100 pt-6 animate-in slide-in-from-top-2 duration-200">
                        <div className="grid sm:grid-cols-2 gap-8">
                          {/* Left: Products */}
                          <div>
                            <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                              <Package className="w-4 h-4 text-primary" /> Sản phẩm ({o.items?.length || 0})
                            </h3>
                            <div className="space-y-4">
                              {o.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex gap-4 items-start">
                                  <div className="w-16 h-16 rounded-md bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                                    <img src={item.image || "https://placehold.co/100x100"} alt={item.title} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-neutral-900 truncate">{item.title}</p>
                                    <p className="text-xs text-neutral-500 mt-1">{item.variantName}</p>
                                    <div className="flex justify-between items-center mt-2">
                                      <p className="text-sm text-primary font-semibold">{(item.price || 0).toLocaleString("vi-VN")}đ</p>
                                      <p className="text-xs text-neutral-500 font-medium">x{item.quantity || 1}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Right: Shipping & Billing */}
                          <div className="space-y-6">
                            <div>
                              <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" /> Thông tin giao hàng
                              </h3>
                              <div className="bg-neutral-50 rounded-lg p-4 text-sm border border-neutral-100">
                                <p className="font-semibold text-neutral-900 mb-1">{o.customer?.name} - {o.customer?.phone}</p>
                                <p className="text-neutral-600 leading-relaxed">{o.customer?.address}</p>
                                {o.customer?.note && (
                                  <p className="mt-2 text-neutral-500 italic border-t border-neutral-200 pt-2">Ghi chú: {o.customer.note}</p>
                                )}
                              </div>
                            </div>

                            <div>
                              <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                                <ShoppingBag className="w-4 h-4 text-primary" /> Chi tiết thanh toán
                              </h3>
                              <div className="bg-neutral-50 rounded-lg p-4 text-sm space-y-3 border border-neutral-100">
                                <div className="flex justify-between text-neutral-600">
                                  <span>Tạm tính</span>
                                  <span>{(o.subtotal || 0).toLocaleString("vi-VN")}đ</span>
                                </div>
                                <div className="flex justify-between text-neutral-600">
                                  <span>Phí giao hàng</span>
                                  <span>{(o.shippingFee || 0).toLocaleString("vi-VN")}đ</span>
                                </div>
                                {(o.discount || 0) > 0 && (
                                  <div className="flex justify-between text-emerald-600 font-medium">
                                    <span>Giảm giá {o.couponCode ? `(${o.couponCode})` : ''}</span>
                                    <span>-{(o.discount || 0).toLocaleString("vi-VN")}đ</span>
                                  </div>
                                )}
                                <div className="pt-3 border-t border-neutral-200 flex justify-between font-bold text-base">
                                  <span>Tổng cộng</span>
                                  <span className="text-primary">{(o.total || 0).toLocaleString("vi-VN")}đ</span>
                                </div>
                                <div className="pt-3 border-t border-neutral-200 flex justify-between text-neutral-600">
                                  <span>Phương thức</span>
                                  <span className="font-medium uppercase">{o.paymentMethod || 'COD'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={addressModalOpen} onOpenChange={setAddressModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Thêm địa chỉ giao hàng</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tỉnh / Thành phố</label>
              <select 
                className="w-full h-10 px-3 rounded-md border border-neutral-200 outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                value={newAddress.provinceCode}
                onChange={e => {
                  const name = e.target.options[e.target.selectedIndex].text
                  setNewAddress({...newAddress, provinceCode: e.target.value, provinceName: name, districtCode: "", districtName: "", wardCode: "", wardName: ""})
                  if (e.target.value) fetchDistricts(e.target.value)
                }}
              >
                <option value="">Chọn Tỉnh/Thành</option>
                {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Quận / Huyện</label>
              <select 
                disabled={!newAddress.provinceCode}
                className="w-full h-10 px-3 rounded-md border border-neutral-200 outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-neutral-100 bg-white"
                value={newAddress.districtCode}
                onChange={e => {
                  const name = e.target.options[e.target.selectedIndex].text
                  setNewAddress({...newAddress, districtCode: e.target.value, districtName: name, wardCode: "", wardName: ""})
                  if (e.target.value) fetchWards(e.target.value)
                }}
              >
                <option value="">Chọn Quận/Huyện</option>
                {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phường / Xã</label>
              <select 
                disabled={!newAddress.districtCode}
                className="w-full h-10 px-3 rounded-md border border-neutral-200 outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-neutral-100 bg-white"
                value={newAddress.wardCode}
                onChange={e => {
                  const name = e.target.options[e.target.selectedIndex].text
                  setNewAddress({...newAddress, wardCode: e.target.value, wardName: name})
                }}
              >
                <option value="">Chọn Phường/Xã</option>
                {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Số nhà, Tên đường</label>
              <Input 
                placeholder="VD: 123 Đường Lê Lợi"
                value={newAddress.street}
                onChange={e => setNewAddress({...newAddress, street: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddressModalOpen(false)}>Hủy</Button>
            <Button 
              onClick={handleAddAddress} 
              disabled={addingAddress || !newAddress.provinceCode || !newAddress.districtCode || !newAddress.wardCode || !newAddress.street}
            >
              {addingAddress ? "Đang lưu..." : "Lưu địa chỉ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Đổi mật khẩu</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mật khẩu hiện tại</label>
              <div className="relative">
                <Input 
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  className="pr-10"
                />
                <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600">
                  {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mật khẩu mới</label>
              <div className="relative">
                <Input 
                  type={showNewPassword ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  className="pr-10"
                />
                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600">
                  {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Xác nhận mật khẩu mới</label>
              <div className="relative">
                <Input 
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  className="pr-10"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600">
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordModalOpen(false)}>Hủy</Button>
            <Button 
              onClick={handleChangePassword} 
              disabled={changingPassword || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
            >
              {changingPassword ? "Đang xử lý..." : "Cập nhật"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={addressToDelete !== null} onOpenChange={(open) => !open && setAddressToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc muốn xóa địa chỉ này?</AlertDialogTitle>
            <AlertDialogDescription>
              Địa chỉ này sẽ bị xóa khỏi danh sách sổ địa chỉ của bạn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={() => addressToDelete !== null && handleDeleteAddress(addressToDelete)}>
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={orderToCancel !== null} onOpenChange={(open) => !open && setOrderToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc muốn hủy đơn hàng này?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Đơn hàng sẽ bị hủy.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Đóng</AlertDialogCancel>
            <AlertDialogAction onClick={() => orderToCancel !== null && handleCancelOrder(orderToCancel)}>
              Hủy Đơn Hàng
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
