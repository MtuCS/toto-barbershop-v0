"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Phone, MapPin, Mail, Loader2, Save, ShoppingBag, Plus, Trash2, LogOut } from "lucide-react"
import { useCustomerUserStore } from "@/store/customer-user-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDataStore } from "@/store/data-store"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

export default function ProfilePage() {
  const router = useRouter()
  const { user, token, setUser } = useCustomerUserStore()
  const allOrders = useDataStore((s) => s.orders)
  const orders = allOrders.filter(o => o.customer.email === user?.email)

  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

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

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !user) router.push("/")
  }, [mounted, user, router])

  useEffect(() => {
    if (user && token) fetchProfile()
  }, [user?.id, token])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` }
      })
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (res.ok) {
        setSuccessMsg("Cập nhật thông tin thành công!")
        setUser(data, token)
      } else {
        setErrorMsg(data.error || "Cập nhật thất bại")
      }
    } catch (err: any) {
      console.error("Save error:", err);
      setErrorMsg(err.message || "Lỗi kết nối máy chủ")
    } finally {
      setSaving(false)
      setTimeout(() => setSuccessMsg(""), 3000)
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
    if (!confirm("Bạn có chắc muốn xóa địa chỉ này?")) return
    try {
      const res = await fetch(`/api/users/addresses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) fetchProfile()
    } catch (e) {
      console.error(e)
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

  if (!mounted || !user) return null

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 md:px-6">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold uppercase tracking-tight">Hồ sơ của tôi</h1>
          <p className="mt-2 text-neutral-500">Quản lý thông tin cá nhân và sổ địa chỉ</p>
        </div>
        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" onClick={() => { useCustomerUserStore.getState().logout(); router.push('/') }}>
          <LogOut className="size-4 mr-2" /> Đăng xuất
        </Button>
      </div>

      <div className="grid gap-10 md:grid-cols-[1fr_350px] lg:gap-16">
        <div className="space-y-8">
          {/* Thông tin liên hệ */}
          <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
            <h2 className="text-xl font-bold">Thông tin liên hệ</h2>
            {errorMsg && <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{errorMsg}</div>}
            {successMsg && <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-600">{successMsg}</div>}
            
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
                  <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-12 rounded-xl pl-11" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Số điện thoại</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-neutral-400" />
                  <Input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="h-12 rounded-xl pl-11" />
                </div>
              </div>
              <Button type="submit" disabled={saving} className="h-12 rounded-xl w-full sm:w-auto px-8">
                {saving ? <Loader2 className="mr-2 size-4 animate-spin"/> : <Save className="mr-2 size-4"/>} Lưu thông tin
              </Button>
            </form>
          </div>

          {/* Sổ địa chỉ */}
          <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Sổ địa chỉ</h2>
              <Button onClick={openAddressModal} variant="outline" size="sm" className="rounded-full">
                <Plus className="mr-2 size-4"/> Thêm địa chỉ mới
              </Button>
            </div>
            
            <div className="space-y-4 mt-4">
              {(!user.addresses || user.addresses.length === 0) ? (
                <div className="p-8 text-center text-neutral-400 border border-dashed rounded-xl">Chưa có địa chỉ nào được lưu.</div>
              ) : (
                user.addresses.map(addr => (
                  <div key={addr.id} className={`p-4 rounded-xl border ${addr.isDefault ? 'border-primary bg-primary/5' : 'border-neutral-200'}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <MapPin className={`mt-0.5 size-5 ${addr.isDefault ? 'text-primary' : 'text-neutral-400'}`} />
                        <div>
                          <p className="font-semibold">{addr.street}</p>
                          <p className="text-sm text-neutral-600 mt-1">{addr.ward}, {addr.district}, {addr.province}</p>
                          {addr.isDefault && <span className="inline-block mt-2 text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">Mặc định</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!addr.isDefault && (
                          <Button variant="ghost" size="sm" onClick={() => handleSetDefaultAddress(addr.id)} className="text-xs h-8">Đặt làm mặc định</Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteAddress(addr.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50 size-8"><Trash2 className="size-4"/></Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Cột phải */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-neutral-50 p-6 shadow-sm ring-1 ring-black/5">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-bold"><ShoppingBag className="size-5" /> Đơn hàng gần đây</h2>
            {orders.length === 0 ? <div className="text-center py-6 text-sm text-neutral-500">Bạn chưa có đơn hàng nào.</div> : (
              <div className="space-y-4">
                {orders.slice(0, 5).map(o => (
                  <div key={o.id} className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm border border-neutral-100">
                    <div>
                      <p className="font-bold text-sm">{o.code}</p>
                      <p className="text-xs text-neutral-500">{new Date(o.createdAt).toLocaleDateString("vi-VN")}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-primary">{o.total.toLocaleString("vi-VN")}đ</p>
                      <p className="text-[10px] uppercase font-bold text-emerald-600">{o.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

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
    </div>
  )
}
