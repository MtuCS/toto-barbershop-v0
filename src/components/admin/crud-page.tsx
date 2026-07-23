"use client"
import Image from "next/image"
import { MoreHorizontal, Plus, Search, X, Edit, Trash2 } from "lucide-react"
import { useDataStore } from "@/store/data-store"
import { formatCurrency } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

const labels: Record<string, string> = { products: "Sản phẩm", categories: "Danh mục", services: "Dịch vụ", training: "Đào tạo", "merchandise-stories": "Merchandise stories", lookbook: "Lookbook", orders: "Đơn hàng", customers: "Khách hàng", media: "Media", settings: "Cài đặt" }
type Row = Record<string, any>

function generateDefaultForm(section: string) {
  switch (section) {
    case "products": return { name: "", price: 0, category: "", type: "", image: "" }
    case "categories": return { name: "", slug: "" }
    case "services": return { title: "", duration: "", price: 0, category: "" }
    case "training": return { title: "", duration: "", price: 0 }
    case "merchandise-stories": return { title: "", excerpt: "", image: "" }
    case "lookbook": return { title: "", category: "", image: "" }
    default: return { name: "" }
  }
}

export function CrudPage({ section }: { section: string }) {
  const d = useDataStore()
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Row | null>(null)
  const [formData, setFormData] = useState<Row>({})

  let rows: Row[] = []
  if (section === "products") rows = d.products
  if (section === "categories") rows = d.categories
  if (section === "services") rows = d.services
  if (section === "training") rows = [...d.courses, ...d.leads]
  if (section === "merchandise-stories") rows = d.stories
  if (section === "lookbook") rows = d.lookbook
  if (section === "orders") rows = d.orders
  if (section === "media") rows = d.media
  if (section === "customers") {
    const map = new Map<string, Row & { totalOrders: number; totalSpent: number }>()
    d.orders.forEach((o) => {
      const row = map.get(o.customer.email) ?? { id: o.customer.email, name: o.customer.name, email: o.customer.email, totalOrders: 0, totalSpent: 0 }
      row.totalOrders += 1; row.totalSpent += o.total; map.set(o.customer.email, row)
    })
    rows = [...map.values()]
  }

  // Filter rows
  const filtered = rows.filter(r => {
    const text = String(r.title ?? r.name ?? r.code ?? r.email ?? "").toLowerCase()
    return text.includes(search.toLowerCase())
  })

  const handleAdd = () => {
    setEditingItem(null)
    setFormData(generateDefaultForm(section))
    setModalOpen(true)
  }

  const handleEdit = (item: Row) => {
    setEditingItem(item)
    setFormData({ ...item })
    setModalOpen(true)
  }

  const handleDelete = (item: Row) => {
    if (!confirm("Bạn có chắc chắn muốn xóa?")) return
    if (section === "products") d.deleteProduct(item.id)
    if (section === "categories") d.deleteCategory(item.id)
    if (section === "services") d.deleteService(item.id)
    if (section === "training") d.deleteCourse(item.id) // Simplification
    if (section === "merchandise-stories") d.deleteStory(item.id)
    if (section === "lookbook") d.deleteLookbook(item.id)
  }

  const handleSave = () => {
    if (section === "products") d.upsertProduct(formData as any)
    if (section === "categories") d.upsertCategory(formData as any)
    if (section === "services") d.upsertService(formData as any)
    if (section === "training") d.upsertCourse(formData as any)
    if (section === "merchandise-stories") d.upsertStory(formData as any)
    if (section === "lookbook") d.upsertLookbook(formData as any)
    
    setModalOpen(false)
  }

  const handleChange = (key: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  if (section === "settings") {
    return (
      <div>
        <header className="flex items-end justify-between">
          <div><p className="text-xs font-bold uppercase tracking-widest text-primary">Quản trị nội dung</p><h1 className="mt-2 font-display text-4xl font-bold uppercase">Cài đặt</h1></div>
        </header>
        <div className="mt-8 grid max-w-3xl gap-5 border bg-white p-6 sm:grid-cols-2">
          <Field label="Tên doanh nghiệp" value={d.settings.business.name}/>
          <Field label="Điện thoại" value={d.settings.contact.phone}/>
          <Field label="Địa chỉ" value={d.settings.contact.address} wide/>
          <Button className="sm:col-span-2">Lưu thay đổi</Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <header className="flex items-end justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Quản trị nội dung</p>
          <h1 className="mt-2 font-display text-4xl font-bold uppercase">{labels[section] ?? section}</h1>
        </div>
        {section !== "settings" && section !== "orders" && section !== "customers" && (
          <Button onClick={handleAdd}><Plus className="mr-2 size-4" />Thêm mới</Button>
        )}
      </header>
      
      <div className="mt-8 border bg-white">
        <div className="flex items-center gap-2 border-b p-4">
          <Search className="size-4 text-neutral-400"/>
          <input 
            placeholder="Tìm kiếm..." 
            className="flex-1 outline-none"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
              <tr>
                <th className="p-4">Tên / Mã</th>
                <th>Loại</th>
                <th>Trạng thái</th>
                <th>Giá trị</th>
                <th/>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? filtered.slice(0, 50).map((r, i) => (
                <tr key={String(r.id ?? i)} className="border-t">
                  <td className="p-4 font-medium">
                    <div className="flex items-center gap-3">
                      {typeof r.image === "string" && (
                        <div className="relative size-10 bg-neutral-100 overflow-hidden rounded-md">
                          <Image src={r.image} alt="" fill className="object-cover"/>
                        </div>
                      )}
                      {String(r.title ?? r.name ?? r.code ?? r.email ?? `Bản ghi ${i+1}`)}
                    </div>
                  </td>
                  <td>{String(r.category ?? r.level ?? r.type ?? "—")}</td>
                  <td><span className="bg-emerald-50 px-2 py-1 text-xs text-primary">{String(r.status ?? "active")}</span></td>
                  <td>{typeof r.price === "number" ? formatCurrency(r.price) : typeof r.total === "number" ? formatCurrency(r.total) : typeof r.totalSpent === "number" ? formatCurrency(r.totalSpent) : "—"}</td>
                  <td>
                    {section !== "orders" && section !== "customers" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger aria-label="Tác vụ" className="p-2 hover:bg-neutral-100 rounded-full outline-none">
                          <MoreHorizontal className="size-4"/>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(r)}>
                            <Edit className="mr-2 size-4" /> Sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(r)} className="text-red-600 focus:bg-red-50">
                            <Trash2 className="mr-2 size-4" /> Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="p-16 text-center text-neutral-400">Không tìm thấy dữ liệu.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Sửa" : "Thêm mới"} {labels[section]?.toLowerCase()}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {Object.keys(formData).map((key) => {
              if (key === "id" || key === "createdAt" || key === "updatedAt") return null
              return (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-medium capitalize">{key}</label>
                  <Input 
                    value={formData[key] || ""} 
                    onChange={e => handleChange(key, typeof formData[key] === "number" ? Number(e.target.value) : e.target.value)}
                    type={typeof formData[key] === "number" ? "number" : "text"}
                  />
                </div>
              )
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Hủy</Button>
            <Button onClick={handleSave}>Lưu lại</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Field({label,value,wide}:{label:string;value:string;wide?:boolean}){return <label className={`text-sm ${wide ? "sm:col-span-2" : ""}`}>{label}<input defaultValue={value} className="mt-2 w-full border px-3 py-2"/></label>}
