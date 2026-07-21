"use client"
import Image from "next/image"
import { MoreHorizontal, Plus, Search } from "lucide-react"
import { useDataStore } from "@/store/data-store"
import { formatCurrency } from "@/lib/format"
import { Button } from "@/components/ui/button"

const labels: Record<string, string> = { products: "Sản phẩm", categories: "Danh mục", services: "Dịch vụ", training: "Đào tạo", "merchandise-stories": "Merchandise stories", lookbook: "Lookbook", orders: "Đơn hàng", customers: "Khách hàng", media: "Media", settings: "Cài đặt" }
type Row = Record<string, unknown>

export function CrudPage({ section }: { section: string }) {
  const d = useDataStore()
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
  if (section === "settings") return <div><Header section={section}/><div className="mt-8 grid max-w-3xl gap-5 border bg-white p-6 sm:grid-cols-2"><Field label="Tên doanh nghiệp" value={d.settings.business.name}/><Field label="Điện thoại" value={d.settings.contact.phone}/><Field label="Địa chỉ" value={d.settings.contact.address} wide/><Button className="sm:col-span-2">Lưu thay đổi mock</Button></div></div>
  return <div><Header section={section}/><div className="mt-8 border bg-white"><div className="flex items-center gap-2 border-b p-4"><Search className="size-4 text-neutral-400"/><input placeholder="Tìm kiếm..." className="flex-1 outline-none"/></div><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-neutral-50 text-xs uppercase text-neutral-500"><tr><th className="p-4">Tên / Mã</th><th>Loại</th><th>Trạng thái</th><th>Giá trị</th><th/></tr></thead><tbody>{rows.length ? rows.slice(0,20).map((r,i)=><tr key={String(r.id ?? i)} className="border-t"><td className="p-4 font-medium"><div className="flex items-center gap-3">{typeof r.image === "string" && <div className="relative size-10 bg-neutral-100"><Image src={r.image} alt="" fill className="object-cover"/></div>}{String(r.title ?? r.name ?? r.code ?? r.email ?? `Bản ghi ${i+1}`)}</div></td><td>{String(r.category ?? r.level ?? r.type ?? "—")}</td><td><span className="bg-emerald-50 px-2 py-1 text-xs text-primary">{String(r.status ?? "active")}</span></td><td>{typeof r.price === "number" ? formatCurrency(r.price) : typeof r.total === "number" ? formatCurrency(r.total) : typeof r.totalSpent === "number" ? formatCurrency(r.totalSpent) : "—"}</td><td><button aria-label="Tác vụ"><MoreHorizontal className="size-4"/></button></td></tr>) : <tr><td colSpan={5} className="p-16 text-center text-neutral-400">Chưa có dữ liệu.</td></tr>}</tbody></table></div></div></div>
}
function Header({section}:{section:string}){return <header className="flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-primary">Quản trị nội dung</p><h1 className="mt-2 font-display text-4xl font-bold uppercase">{labels[section] ?? section}</h1></div>{section !== "settings" && <Button><Plus/>Thêm mới</Button>}</header>}
function Field({label,value,wide}:{label:string;value:string;wide?:boolean}){return <label className={`text-sm ${wide ? "sm:col-span-2" : ""}`}>{label}<input defaultValue={value} className="mt-2 w-full border px-3 py-2"/></label>}
