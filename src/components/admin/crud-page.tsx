"use client"
import Image from "next/image"
import { MoreHorizontal, Plus, Search, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { useDataStore } from "@/store/data-store"
import { useAuthStore } from "@/store/auth-store"
import { formatCurrency } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { useState, useMemo } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import type { Product, ProductVariant } from "@/types"

// ============================================================================
// Config: Section labels
// ============================================================================
const labels: Record<string, string> = {
  products: "Sản phẩm",
  categories: "Danh mục",
  services: "Dịch vụ",
  training: "Đào tạo",
  "merchandise-stories": "Câu chuyện sản phẩm",
  lookbook: "Lookbook",
  orders: "Đơn hàng",
  customers: "Khách hàng",
  staff: "Nhân viên",
  media: "Tệp media",
  settings: "Cài đặt",
}

// Config: Vietnamese field labels
const fieldLabels: Record<string, string> = {
  name: "Tên",
  email: "Email",
  password: "Mật khẩu",
  phone: "Số điện thoại",
  role: "Vai trò",
  title: "Tiêu đề",
  price: "Giá (VNĐ)",
  basePrice: "Giá cơ bản (VNĐ)",
  category: "Danh mục",
  collection: "Bộ sưu tập",
  type: "Loại",
  image: "Hình ảnh (URL)",
  images: "Hình ảnh",
  slug: "Đường dẫn (slug)",
  duration: "Thời gian",
  excerpt: "Mô tả ngắn",
  description: "Mô tả chi tiết",
  status: "Trạng thái",
  featured: "Nổi bật",
  level: "Cấp độ",
  summary: "Tóm tắt",
  caption: "Chú thích",
  subtitle: "Phụ đề",
  heroImage: "Ảnh bìa",
  manifesto: "Tuyên ngôn",
  published: "Trạng thái hiển thị",
  order: "Thứ tự",
  url: "Đường dẫn file (URL)",
  size: "Kích thước",
  parent: "Danh mục cha",
  productCount: "Số lượng sản phẩm",
}

// ============================================================================
// Config: Product variant rules by product type
// ============================================================================
type VariantDimension = { key: string; label: string; options: string[] }

const PRODUCT_TYPES: { value: string; label: string; dimensions: VariantDimension[] }[] = [
  {
    value: "grooming",
    label: "Sản phẩm chăm sóc tóc (Pomade, Clay, ...)",
    dimensions: [
      { key: "volume", label: "Dung tích / Trọng lượng", options: ["50g", "100g", "150g", "250ml", "500ml"] },
    ],
  },
  {
    value: "fashion-top",
    label: "Áo (Thun, Khoác, Hoodie,...)",
    dimensions: [
      { key: "size", label: "Size", options: ["S", "M", "L", "XL", "2XL"] },
      { key: "color", label: "Màu sắc", options: ["Đen", "Trắng", "Xám", "Navy", "Be"] },
    ],
  },
  {
    value: "fashion-bottom",
    label: "Quần (Jeans, Shorts, Jogger,...)",
    dimensions: [
      { key: "size", label: "Size (lưng)", options: ["28", "29", "30", "31", "32", "33", "34"] },
      { key: "color", label: "Màu sắc", options: ["Đen", "Xanh đậm", "Xanh nhạt", "Xám", "Be"] },
    ],
  },
  {
    value: "cap",
    label: "Mũ / Nón",
    dimensions: [
      { key: "size", label: "Size", options: ["One-size", "S/M", "L/XL"] },
      { key: "color", label: "Màu sắc", options: ["Đen", "Trắng", "Nâu", "Xanh Navy", "Camo"] },
    ],
  },
  {
    value: "shoes",
    label: "Giày / Dép / Sandal",
    dimensions: [
      { key: "size", label: "Số đo (EU)", options: ["38", "39", "40", "41", "42", "43", "44"] },
      { key: "color", label: "Màu sắc", options: ["Đen", "Trắng", "Nâu"] },
    ],
  },
  {
    value: "necklace",
    label: "Vòng cổ / Dây chuyền",
    dimensions: [
      { key: "length", label: "Độ dài (cm)", options: ["40cm", "45cm", "50cm", "55cm", "60cm"] },
    ],
  },
  {
    value: "bracelet",
    label: "Vòng tay",
    dimensions: [
      { key: "size", label: "Chu vi cổ tay (cm)", options: ["14cm", "15cm", "16cm", "17cm", "18cm", "19cm"] },
    ],
  },
  {
    value: "ring",
    label: "Nhẫn",
    dimensions: [
      { key: "size", label: "Size nhẫn (mm)", options: ["14", "15", "16", "17", "18", "19", "20"] },
    ],
  },
  {
    value: "bag",
    label: "Túi / Balo",
    dimensions: [
      { key: "color", label: "Màu sắc", options: ["Đen", "Nâu", "Xanh Navy", "Olive", "Xám"] },
    ],
  },
  {
    value: "accessory",
    label: "Phụ kiện khác (Thắt lưng, Ví,...)",
    dimensions: [
      { key: "color", label: "Màu sắc / Chất liệu", options: ["Đen", "Nâu", "Bạc", "Vàng"] },
    ],
  },
]

// ============================================================================
// Utility: cross-join variant dimensions
// ============================================================================
function cartesianProduct(arrays: string[][]): string[][] {
  return arrays.reduce<string[][]>(
    (acc, arr) => acc.flatMap(prev => arr.map(next => [...prev, next])),
    [[]]
  )
}

function getOptionsKey(opts: Record<string, any>) {
  const clean: any = {}
  if (opts.size) clean.size = opts.size
  if (opts.color) clean.color = opts.color
  // add any other keys
  Object.keys(opts).forEach(k => { if (opts[k]) clean[k] = opts[k] })
  return Object.entries(clean).sort((a, b) => a[0].localeCompare(b[0])).map(x => `${x[0]}=${x[1]}`).join('|')
}

function generateVariants(
  selectedOptions: Record<string, string[]>,
  dimensions: VariantDimension[],
  variantPrices: Record<string, number>,
  variantStocks: Record<string, number>,
  basePrice: number,
  initialVariants: ProductVariant[] = []
): ProductVariant[] {
  const activeDimensions = dimensions.filter(d => (selectedOptions[d.key]?.length ?? 0) > 0)
  if (activeDimensions.length === 0) return []
  const optionArrays = activeDimensions.map(d => selectedOptions[d.key])
  const combinations = cartesianProduct(optionArrays)
  
  return combinations.map(combo => {
    const optionMap: Record<string, string> = {}
    activeDimensions.forEach((d, i) => { optionMap[d.key] = combo[i] })
    
    const optKey = getOptionsKey(optionMap)
    const existing = initialVariants.find(v => {
      const eOpts = v.options || { size: v.size, color: v.color }
      return getOptionsKey(eOpts) === optKey
    })

    const variantName = existing?.name || combo.join(" / ")
    return {
      id: existing?.id || `variant-${Math.random().toString(36).slice(2, 9)}`,
      name: variantName,
      options: optionMap,
      price: variantPrices[variantName] ?? existing?.price ?? basePrice,
      stock: variantStocks[variantName] ?? existing?.stock ?? 0,
      sku: existing?.sku || `SKU-${combo.join("-").toUpperCase().replace(/\s/g, "")}`,
    }
  })
}

// ============================================================================
// Product Form Component (smart variant builder)
// ============================================================================
function ProductForm({ initial, onSave, onCancel }: {
  initial: Partial<Product>
  onSave: (p: Product) => void
  onCancel: () => void
}) {
  const { categories: allCategories } = useDataStore()

  // Basic fields
  const [title, setTitle] = useState(initial.title ?? "")
  const [description, setDescription] = useState(initial.description ?? "")
  const [basePrice, setBasePrice] = useState(initial.basePrice ?? 0)
  const [compareAtPrice, setCompareAtPrice] = useState((initial as any).compareAtPrice ?? 0)
  const [status, setStatus] = useState<"active"|"draft"|"archived">(initial.status ?? "active")
  const [featured, setFeatured] = useState(initial.featured ?? false)
  const [categoryId, setCategoryId] = useState(initial.category ?? "")
  const defaultVar = initial.variants?.[0]
  const [sku, setSku] = useState((initial as any).sku ?? defaultVar?.sku ?? "")
  const [weight, setWeight] = useState((initial as any).weight ?? (defaultVar as any)?.weight ?? 0)
  const [stock, setStock] = useState((initial as any).stock ?? defaultVar?.stock ?? 0)

  // Images (multiple)
  const [images, setImages] = useState<string[]>(initial.images ?? [])
  const [urlInput, setUrlInput] = useState("")
  const [uploadingImage, setUploadingImage] = useState(false)

  const [collection, setCollection] = useState(initial.collection ?? "")
  const [productType, setProductType] = useState(() => {
    if (PRODUCT_TYPES.some(t => t.value === initial.collection)) return initial.collection;
    if (initial.variants && initial.variants.length > 0) {
      const opts = initial.variants[0].options || { size: initial.variants[0].size, color: initial.variants[0].color }
      if (opts.size && opts.color) return "fashion-top"
      if (opts.size && !opts.color) {
        if (opts.size.includes("g") || opts.size.includes("ml")) return "grooming"
        if (opts.size === "One-size" || opts.size.includes("/")) return "cap"
        return "fashion-bottom"
      }
      if (opts.color && !opts.size) return "fashion-top" // color-only defaults to fashion-top layout
    }
    return ""
  })
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>(() => {
    const opts: Record<string, string[]> = {}
    initial.variants?.forEach(v => {
      const options: any = v.options || {}
      if (v.size && !options.size) options.size = v.size
      if (v.color && !options.color) options.color = v.color
      Object.entries(options).forEach(([k, val]) => {
        if (!opts[k]) opts[k] = []
        if (typeof val === 'string' && !opts[k].includes(val)) opts[k].push(val)
      })
    })
    return opts
  })
  const [customOptionInputs, setCustomOptionInputs] = useState<Record<string, string>>({})
  const [variantPrices, setVariantPrices] = useState<Record<string, number>>(() => {
    const p: Record<string, number> = {}; initial.variants?.forEach(v => { p[v.name] = v.price }); return p
  })
  const [variantStocks, setVariantStocks] = useState<Record<string, number>>(() => {
    const s: Record<string, number> = {}; initial.variants?.forEach(v => { s[v.name] = v.stock }); return s
  })
  const [variantSkus, setVariantSkus] = useState<Record<string, string>>(() => {
    const s: Record<string, string> = {}; initial.variants?.forEach(v => { s[v.name] = v.sku ?? "" }); return s
  })
  const [variantOpen, setVariantOpen] = useState(true)

  const typeConfig = PRODUCT_TYPES.find(t => t.value === productType)
  const hasVariants = (typeConfig?.dimensions?.length ?? 0) > 0

  const generatedVariants = useMemo(() => {
    if (!typeConfig) return []
    return generateVariants(selectedOptions, typeConfig.dimensions, variantPrices, variantStocks, basePrice, initial.variants as ProductVariant[])
  }, [selectedOptions, variantPrices, variantStocks, basePrice, typeConfig, initial.variants])

  const addImageFromFile = async (file: File) => {
    setUploadingImage(true)
    try {
      const token = typeof window !== "undefined" ? useAuthStore.getState().session?.token : null
      if (token) {
        const formData = new FormData()
        formData.append("image", file)
        const res = await fetch("/api/upload/image", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        })
        if (res.ok) {
          const data = await res.json()
          setImages(prev => [...prev, data.url])
          setUploadingImage(false)
          return
        }
      }
    } catch { /* fall through to base64 */ }
    // Fallback: base64
    const reader = new FileReader()
    reader.onload = ev => {
      setImages(prev => [...prev, ev.target?.result as string])
      setUploadingImage(false)
    }
    reader.readAsDataURL(file)
  }

  const addImageFromUrl = () => {
    const url = urlInput.trim()
    if (!url) return
    setImages(prev => [...prev, url])
    setUrlInput("")
  }

  const removeImage = (idx: number) => setImages(prev => prev.filter((_, i) => i !== idx))

  const moveImageFirst = (idx: number) => {
    setImages(prev => {
      const next = [...prev]
      const [item] = next.splice(idx, 1)
      next.unshift(item)
      return next
    })
  }

  const toggleOption = (dimKey: string, val: string) => {
    setSelectedOptions(prev => {
      const existing = prev[dimKey] ?? []
      return { ...prev, [dimKey]: existing.includes(val) ? existing.filter(v => v !== val) : [...existing, val] }
    })
  }

  const addCustomOption = (dimKey: string) => {
    const val = customOptionInputs[dimKey]?.trim()
    if (!val) return
    setSelectedOptions(prev => ({ ...prev, [dimKey]: [...(prev[dimKey] ?? []), val] }))
    setCustomOptionInputs(prev => ({ ...prev, [dimKey]: "" }))
  }

  const handleSave = () => {
    if (!title.trim()) { toast.error("Vui lòng nhập tên sản phẩm."); return }
    if (!categoryId) { toast.error("Vui lòng chọn danh mục sản phẩm."); return }

    const finalVariants: ProductVariant[] = generatedVariants.length > 0
      ? generatedVariants.map(v => ({ ...v, sku: variantSkus[v.name] || v.sku }))
      : initial.variants ?? []

    onSave({
      ...(initial as Product),
      id: initial.id,
      title,
      slug: initial.slug || title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/gi, "-").toLowerCase(),
      description,
      basePrice,
      compareAtPrice,
      images,
      status,
      featured,
      category: categoryId as any,
      collection,
      variants: finalVariants,
      tags: initial.tags ?? [],
      rating: initial.rating ?? 0,
      reviewCount: initial.reviewCount ?? 0,
      createdAt: initial.createdAt ?? new Date().toISOString(),
      sku,
      weight: weight > 0 ? weight : undefined,
      stock: !hasVariants ? stock : undefined,
    } as any)
  }

  const groomingCats = allCategories.filter(c => c.parent === "grooming")
  const merchCats = allCategories.filter(c => c.parent === "merchandise")

  return (
    <div className="flex flex-col gap-6 py-2">

      {/* ── 1. Thông tin cơ bản ── */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 border-b pb-2">Thông tin cơ bản</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-neutral-600">Tên sản phẩm *</label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="VD: TOTO Classic Heavyweight Tee" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-600">Danh mục *</label>
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full h-10 px-3 rounded-md border text-sm outline-none bg-white focus:border-primary">
              <option value="">— Chọn danh mục —</option>
              {groomingCats.length > 0 && (
                <optgroup label="🧴 Grooming">
                  {groomingCats.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
                </optgroup>
              )}
              {merchCats.length > 0 && (
                <optgroup label="👕 Merchandise">
                  {merchCats.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
                </optgroup>
              )}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-600">Trạng thái</label>
            <select value={status} onChange={e => setStatus(e.target.value as any)} className="w-full h-10 px-3 rounded-md border text-sm outline-none bg-white focus:border-primary">
              <option value="active">Đang bán (Active)</option>
              <option value="draft">Nháp (Draft)</option>
              <option value="archived">Lưu trữ (Archived)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-600">Giá bán (VNĐ) *</label>
            <Input type="number" value={basePrice} onChange={e => setBasePrice(Number(e.target.value))} min={0} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-600">
              Giá gốc — để gạch ngang
              <span className="ml-1 text-neutral-400 font-normal text-xs">(bỏ trống nếu không sale)</span>
            </label>
            <Input type="number" value={compareAtPrice || ""} placeholder="VD: 480000" onChange={e => setCompareAtPrice(Number(e.target.value))} min={0} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-600">Mã SKU</label>
            <Input value={sku} onChange={e => setSku(e.target.value)} placeholder="VD: TOTO-TEE-BLK" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-600">
              Cân nặng (gram)
              <span className="ml-1 text-neutral-400 font-normal text-xs">— tính phí ship</span>
            </label>
            <Input type="number" value={weight || ""} placeholder="VD: 250" onChange={e => setWeight(Number(e.target.value))} min={0} />
          </div>

          <div className="sm:col-span-2 flex items-center gap-2">
            <input type="checkbox" id="featured-cb" checked={featured} onChange={e => setFeatured(e.target.checked)} className="size-4" />
            <label htmlFor="featured-cb" className="text-sm font-medium cursor-pointer">Đánh dấu là sản phẩm nổi bật</label>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-600">Mô tả sản phẩm</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            className="w-full border px-3 py-2 rounded-md text-sm outline-none focus:border-primary resize-none"
            placeholder="Mô tả ngắn gọn về sản phẩm, chất liệu, công dụng..."
          />
        </div>
      </section>

      {/* ── 2. Hình ảnh ── */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 border-b pb-2">Hình ảnh sản phẩm</h3>

        {images.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative group">
                <img src={img} alt="" className={`h-20 w-20 object-cover rounded-lg border-2 ${idx === 0 ? "border-primary" : "border-neutral-200"}`} />
                {idx === 0 && <span className="absolute top-0.5 left-0.5 text-[9px] bg-primary text-white px-1 rounded">Chính</span>}
                <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  {idx !== 0 && (
                    <button type="button" onClick={() => moveImageFirst(idx)} title="Đặt làm ảnh chính" className="text-white text-xs bg-white/20 rounded px-1 py-0.5 hover:bg-white/40">⭐</button>
                  )}
                  <button type="button" onClick={() => removeImage(idx)} className="text-white text-xs bg-red-500/70 rounded px-1 py-0.5 hover:bg-red-600">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div>
          <input type="file" accept="image/*" multiple className="hidden" id="product-multi-upload"
            onChange={async e => {
              const files = Array.from(e.target.files ?? [])
              for (const file of files) await addImageFromFile(file)
              e.target.value = ""
            }}
          />
          <label htmlFor="product-multi-upload" className="flex items-center justify-center gap-2 w-full h-20 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors text-sm text-neutral-500">
            {uploadingImage ? <span className="animate-pulse">⏳ Đang tải ảnh lên...</span> : <>📁 Nhấn để chọn ảnh từ máy tính (có thể chọn nhiều)</>}
          </label>
        </div>

        <div className="flex gap-2">
          <Input value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder="Hoặc dán link ảnh URL..." onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addImageFromUrl())} />
          <Button type="button" variant="outline" onClick={addImageFromUrl} className="shrink-0">Thêm URL</Button>
        </div>
        {images.length > 0 && <p className="text-xs text-neutral-400">💡 Hover ảnh → nhấn ⭐ để đặt làm ảnh chính</p>}
      </section>

      {/* ── 3. Loại sản phẩm & Biến thể ── */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 border-b pb-2">Loại & Biến thể</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-600">Bộ sưu tập (Phân loại hiển thị) *</label>
            <Input value={collection} onChange={e => setCollection(e.target.value)} placeholder="VD: jacket, pomade, tee..." />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-600">Kiểu biến thể (Kích thước / Màu sắc)</label>
            <select
              value={productType}
              onChange={e => { setProductType(e.target.value); setSelectedOptions({}) }}
              className="w-full border px-3 py-2 rounded-md text-sm outline-none bg-white focus:border-primary"
            >
              <option value="">— Không có biến thể / Tùy chỉnh —</option>
              {PRODUCT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
        </div>

        {/* Stock for single-variant products */}
        {productType && !hasVariants && (
          <div className="space-y-1.5 p-4 border rounded-xl bg-blue-50/50">
            <label className="text-xs font-semibold text-neutral-600">Số lượng tồn kho</label>
            <Input type="number" value={stock} onChange={e => setStock(Number(e.target.value))} min={0} className="w-32" />
          </div>
        )}

        {/* Variant builder */}
        {typeConfig && hasVariants && (
          <div className="border rounded-xl overflow-hidden">
            <button type="button" onClick={() => setVariantOpen(v => !v)}
              className="flex w-full items-center justify-between bg-neutral-50 px-4 py-3 text-sm font-semibold hover:bg-neutral-100 transition-colors">
              <span>⚙️ Cấu hình biến thể ({generatedVariants.length > 0 ? `${generatedVariants.length} biến thể` : "chưa cấu hình"})</span>
              {variantOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>

            {variantOpen && (
              <div className="p-4 space-y-5">
                <div className="text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2">
                  💡 Tồn kho sẽ được khai báo trong bảng biến thể bên dưới, theo từng biến thể riêng.
                </div>

                {typeConfig.dimensions.map(dim => (
                  <div key={dim.key} className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">{dim.label}</label>
                    <div className="flex flex-wrap gap-2">
                      {dim.options.map(opt => {
                        const active = selectedOptions[dim.key]?.includes(opt)
                        return (
                          <button key={opt} type="button" onClick={() => toggleOption(dim.key, opt)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${active ? "bg-primary text-white border-primary" : "bg-white text-neutral-600 hover:border-primary"}`}>
                            {opt}
                          </button>
                        )
                      })}
                      {(selectedOptions[dim.key] ?? []).filter(v => !dim.options.includes(v)).map(opt => (
                        <button key={opt} type="button" onClick={() => toggleOption(dim.key, opt)}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold border bg-primary text-white border-primary">
                          {opt} ✕
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-1">
                      <Input value={customOptionInputs[dim.key] ?? ""} onChange={e => setCustomOptionInputs(prev => ({ ...prev, [dim.key]: e.target.value }))}
                        placeholder={`Thêm ${dim.label.toLowerCase()} tùy chỉnh...`} className="h-8 text-xs"
                        onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addCustomOption(dim.key))} />
                      <Button type="button" size="sm" variant="outline" onClick={() => addCustomOption(dim.key)} className="h-8 text-xs px-3">Thêm</Button>
                    </div>
                  </div>
                ))}

                {generatedVariants.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
                      Bảng biến thể ({generatedVariants.length} biến thể)
                    </p>
                    <div className="overflow-x-auto border rounded-lg">
                      <table className="w-full text-xs">
                        <thead className="bg-neutral-50">
                          <tr>
                            <th className="px-3 py-2 text-left font-semibold text-neutral-600">Biến thể</th>
                            <th className="px-3 py-2 text-left font-semibold text-neutral-600">Giá (VNĐ)</th>
                            <th className="px-3 py-2 text-left font-semibold text-neutral-600">Tồn kho</th>
                            <th className="px-3 py-2 text-left font-semibold text-neutral-600">SKU</th>
                          </tr>
                        </thead>
                        <tbody>
                          {generatedVariants.map((v, i) => (
                            <tr key={v.name} className={i % 2 === 0 ? "bg-white" : "bg-neutral-50/50"}>
                              <td className="px-3 py-2 font-medium whitespace-nowrap">{v.name}</td>
                              <td className="px-3 py-2">
                                <input type="number" value={variantPrices[v.name] ?? basePrice}
                                  onChange={e => setVariantPrices(prev => ({ ...prev, [v.name]: Number(e.target.value) }))}
                                  className="w-28 border rounded px-2 py-1 outline-none focus:border-primary" />
                              </td>
                              <td className="px-3 py-2">
                                <input type="number" value={variantStocks[v.name] ?? 0}
                                  onChange={e => setVariantStocks(prev => ({ ...prev, [v.name]: Number(e.target.value) }))}
                                  className="w-20 border rounded px-2 py-1 outline-none focus:border-primary" />
                              </td>
                              <td className="px-3 py-2">
                                <input type="text" value={variantSkus[v.name] ?? v.sku}
                                  onChange={e => setVariantSkus(prev => ({ ...prev, [v.name]: e.target.value }))}
                                  className="w-32 border rounded px-2 py-1 outline-none focus:border-primary font-mono text-xs" />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {generatedVariants.length === 0 && (
                  <p className="text-xs text-neutral-400 text-center py-4 border rounded-lg bg-neutral-50">
                    👆 Chọn ít nhất một giá trị ở trên để tự động sinh biến thể
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>Hủy bỏ</Button>
        <Button type="button" onClick={handleSave}>Lưu lại</Button>
      </div>
    </div>
  )
}

// ============================================================================
// Generic form for other sections
// ============================================================================
const EXCLUDED_KEYS = ["id", "createdAt", "updatedAt", "slug", "images", "variants", "tags", "blocks", "gallery", "relatedProductIds", "timeline", "items", "process", "modules", "roadmap", "benefits", "audience", "productCount"]

function generateDefaultForm(section: string) {
  switch (section) {
    case "categories": return { name: "", slug: "", parent: "", description: "" }
    case "services": return { name: "", duration: "", price: 0, category: "" }
    case "training": return { title: "", duration: "", price: 0 }
    case "merchandise-stories": return { title: "", subtitle: "", manifesto: "", heroImage: "", status: "draft", order: 1 }
    case "lookbook": return { caption: "", category: "", image: "", featured: false, published: true, order: 1 }
    case "customers": return { name: "", email: "", password: "", phone: "", role: "CUSTOMER" }
    case "staff": return { name: "", email: "", password: "", phone: "", role: "ADMIN" }
    default: return { name: "" }
  }
}

type Row = Record<string, any>

// ============================================================================
// Main CrudPage Component
// ============================================================================
export function CrudPage({ section }: { section: string }) {
  const d = useDataStore()
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Row | null>(null)
  const [formData, setFormData] = useState<Row>({})
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [itemToDelete, setItemToDelete] = useState<Row | null>(null)

  let rows: Row[] = []
  if (section === "products") rows = d.products
  if (section === "categories") rows = d.categories
  if (section === "services") rows = d.services
  if (section === "training") rows = [...d.courses, ...d.leads]
  if (section === "merchandise-stories") rows = d.stories
  if (section === "lookbook") rows = d.lookbook
  if (section === "orders") rows = d.orders
  if (section === "media") rows = d.media
  if (section === "customers" || section === "staff") {
    const customerMap = new Map();
    d.customers.forEach(c => {
      customerMap.set(c.email, { ...c, totalOrders: 0, totalSpent: 0 });
    });
    d.orders.forEach(o => {
      if (o.customer?.email && customerMap.has(o.customer.email)) {
        const c = customerMap.get(o.customer.email);
        c.totalOrders += 1;
        c.totalSpent += o.total;
      }
    });
    
    if (section === "customers") {
      rows = Array.from(customerMap.values()).filter(c => c.role === 'CUSTOMER');
    } else {
      rows = Array.from(customerMap.values()).filter(c => c.role !== 'CUSTOMER');
    }
  }

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

  const confirmDelete = async (item: Row) => {
    if (section === "products") await d.deleteProduct(item.id)
    if (section === "categories") await d.deleteCategory(item.id)
    if (section === "services") await d.deleteService(item.id)
    if (section === "training") d.deleteCourse(item.id)
    if (section === "merchandise-stories") d.deleteStory(item.id)
    if (section === "lookbook") d.deleteLookbook(item.id)
    setItemToDelete(null)
  }

  const handleSaveGeneric = async () => {
    if (section === "customers" || section === "staff") {
      await d.createUser(formData)
    } else if (section === "orders") {
      await d.updateOrderStatus(formData.id, { status: formData.status, paymentStatus: formData.paymentStatus })
    }
    if (section === "categories") await d.upsertCategory(formData as any)
    if (section === "services") await d.upsertService(formData as any)
    if (section === "training") d.upsertCourse(formData as any)
    if (section === "merchandise-stories") d.upsertStory(formData as any)
    if (section === "lookbook") d.upsertLookbook(formData as any)
    setModalOpen(false)
  }

  const handleChange = (key: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  if (section === "settings") {
    return (
      <div>
        <header className="flex items-end justify-between">
          <div><p className="text-xs font-bold uppercase tracking-widest text-primary">Quản trị nội dung</p><h1 className="mt-2 font-display text-4xl font-bold uppercase">Cài đặt</h1></div>
        </header>
        <div className="mt-8 grid max-w-3xl gap-5 border bg-white p-6 sm:grid-cols-2">
          <Field label="Tên doanh nghiệp" value={d.settings.business.name} />
          <Field label="Điện thoại" value={d.settings.contact.phone} />
          <Field label="Địa chỉ" value={d.settings.contact.address} wide />
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
        {section !== "settings" && section !== "orders" && (
          <Button onClick={handleAdd}><Plus className="mr-2 size-4" />Thêm mới</Button>
        )}
      </header>

      <div className="mt-8 border bg-white">
        <div className="flex items-center gap-2 border-b p-4">
          <Search className="size-4 text-neutral-400" />
          <input placeholder="Tìm kiếm..." className="flex-1 outline-none" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
              <tr>
                <th className="p-4">Tên / Mã</th>
                <th>Loại</th>
                <th>{section === "media" ? "" : section === "categories" ? "Mô tả" : "Trạng thái"}</th>
                {section !== "merchandise-stories" && <th>{section === "categories" ? "Số lượng SP" : section === "media" ? "Kích thước" : section === "lookbook" ? "Thứ tự" : "Giá trị"}</th>}
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.length ? filtered.slice((page - 1) * pageSize, page * pageSize).map((r, i) => (
                <tr key={String(r.id ?? i)} className="border-t">
                  <td className="p-4 font-medium">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        {(typeof r.image === "string" || (Array.isArray(r.images) && r.images[0])) && (
                          <div className="relative size-10 bg-neutral-100 overflow-hidden rounded-md">
                            <Image src={typeof r.image === "string" ? r.image : r.images[0]} alt="" fill className="object-cover" />
                          </div>
                        )}
                        {String(r.title ?? r.name ?? r.caption ?? r.code ?? r.email ?? `Bản ghi ${i + 1}`)}
                      </div>
                      {r.slug && <span className="text-xs text-neutral-400 font-normal">{r.slug}</span>}
                    </div>
                  </td>
                  <td>{String(section === "orders" ? r.paymentMethod : section === "merchandise-stories" ? "Bài viết" : (r.role ?? r.category ?? r.parent ?? r.collection ?? r.level ?? r.type ?? "—"))}</td>
                  <td>
                    {section === "media" ? "—" : section === "categories" ? (
                      <span className="text-xs text-neutral-500 line-clamp-2">{r.description ?? "—"}</span>
                    ) : (
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${r.status === "active" || r.status === "published" || r.status === "COMPLETED" || r.published === true ? "bg-emerald-50 text-emerald-700" : (r.status === "PENDING" || r.status === "pending") ? "bg-amber-50 text-amber-700" : (r.status === "CANCELLED" || r.published === false) ? "bg-red-50 text-red-700" : "bg-neutral-100 text-neutral-500"}`}>
                          {r.status === "active" ? ((section === "customers" || section === "staff") ? "Đang HĐ" : "Đang bán") : 
                           r.status === "draft" ? "Nháp" : 
                           (r.status === "published" || r.published === true) ? "Hiển thị" : 
                           r.published === false ? "Ẩn" :
                           (r.status === "pending" || r.status === "PENDING") ? "Chờ xử lý" : 
                           r.status === "PROCESSING" ? "Đang chuẩn bị" :
                           r.status === "SHIPPED" ? "Đang giao" :
                           r.status === "CANCELLED" ? "Đã hủy" :
                           (r.status === "completed" || r.status === "COMPLETED") ? "Hoàn thành" : String(r.status ?? "—")}
                        </span>
                        {section === "orders" && (
                          <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${r.paymentStatus === "PAID" ? "bg-emerald-100 text-emerald-800" : r.paymentStatus === "REFUNDED" ? "bg-purple-100 text-purple-800" : "bg-neutral-100 text-neutral-600"}`}>
                            {r.paymentStatus === "PAID" ? "Đã thanh toán" : r.paymentStatus === "REFUNDED" ? "Đã hoàn tiền" : "Chưa thanh toán"}
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  {section !== "merchandise-stories" && <td>
                    {section === "lookbook" ? (r.order ?? "—") :
                     section === "categories" ? (r.productCount ?? 0) :
                     section === "media" ? (typeof r.size === "string" ? r.size : "—") :
                     typeof r.totalSpent === "number" ? formatCurrency(r.totalSpent) : typeof r.price === "number" ? formatCurrency(r.price) : typeof r.basePrice === "number" ? formatCurrency(r.basePrice) : typeof r.total === "number" ? formatCurrency(r.total) : "—"}
                  </td>}
                  <td>
                    {section !== "customers" && section !== "staff" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger aria-label="Tác vụ" className="p-2 hover:bg-neutral-100 rounded-full outline-none">
                          <MoreHorizontal className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(r)}>
                            <Edit className="mr-2 size-4" /> Chỉnh sửa
                          </DropdownMenuItem>
                          {section !== "orders" && (
                            <DropdownMenuItem onClick={() => setItemToDelete(r)} variant="destructive">
                              <Trash2 className="mr-2 size-4" /> Xóa
                            </DropdownMenuItem>
                          )}
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
        {/* Pagination controls */}
        {filtered.length > pageSize && (
          <div className="flex items-center justify-between border-t p-4 text-sm text-neutral-500">
            <div>
              Hiển thị từ {(page - 1) * pageSize + 1} đến {Math.min(page * pageSize, filtered.length)} trong tổng số {filtered.length} bản ghi
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Trang trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= Math.ceil(filtered.length / pageSize)}
                onClick={() => setPage(page + 1)}
              >
                Trang sau
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className={section === "products" ? "sm:max-w-[720px] max-h-[90vh] overflow-y-auto" : "sm:max-w-[480px]"}>
          <DialogHeader>
            <DialogTitle>{editingItem ? "Chỉnh sửa" : "Thêm mới"} {labels[section]?.toLowerCase()}</DialogTitle>
          </DialogHeader>

          {section === "products" ? (
            <ProductForm
              initial={editingItem ?? {}}
              onSave={async (product) => { await d.upsertProduct(product); setModalOpen(false) }}
              onCancel={() => setModalOpen(false)}
            />
          ) : section === "orders" ? (
            <div className="grid gap-4 py-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-600">Trạng thái đơn hàng</label>
                <select 
                  value={formData.status || "PENDING"} 
                  onChange={e => handleChange("status", e.target.value)}
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="PENDING">Chờ xử lý</option>
                  <option value="PROCESSING">Đang chuẩn bị hàng</option>
                  <option value="SHIPPED">Đang giao</option>
                  <option value="COMPLETED">Đã giao thành công</option>
                  <option value="CANCELLED">Đã hủy</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-600">Trạng thái thanh toán</label>
                <select 
                  value={formData.paymentStatus || "UNPAID"} 
                  onChange={e => handleChange("paymentStatus", e.target.value)}
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="UNPAID">Chưa thanh toán</option>
                  <option value="PAID">Đã thanh toán</option>
                  <option value="REFUNDED">Đã hoàn tiền</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 py-4">
              {Object.keys(formData).map((key) => {
                if (EXCLUDED_KEYS.includes(key)) return null
                return (
                  <div key={key} className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-600">{fieldLabels[key] ?? key}</label>
                    {key === "role" ? (
                      <select 
                        value={formData[key] || (section === "staff" ? "ADMIN" : "CUSTOMER")} 
                        onChange={e => handleChange(key, e.target.value)}
                        className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        {section === "customers" ? (
                          <option value="CUSTOMER">Khách hàng</option>
                        ) : (
                          <>
                            <option value="ADMIN">Quản trị viên</option>
                            <option value="STAFF">Nhân viên</option>
                          </>
                        )}
                      </select>
                    ) : typeof formData[key] === "boolean" ? (
                      <select 
                        value={String(formData[key])} 
                        onChange={e => handleChange(key, e.target.value === "true")}
                        className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="true">Bật (True)</option>
                        <option value="false">Tắt (False)</option>
                      </select>
                    ) : key === "status" ? (
                      <select 
                        value={formData[key] || "draft"} 
                        onChange={e => handleChange(key, e.target.value)}
                        className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="published">Hiển thị</option>
                        <option value="draft">Nháp</option>
                      </select>
                    ) : key === "url" || key === "image" || key === "heroImage" ? (
                      <div className="flex gap-2 items-center">
                        <Input
                          value={formData[key] || ""}
                          onChange={e => handleChange(key, e.target.value)}
                          placeholder="Hoặc nhập URL trực tiếp..."
                          className="flex-1"
                        />
                        <label className="flex h-10 px-3 shrink-0 items-center justify-center rounded-md border bg-neutral-100 hover:bg-neutral-200 cursor-pointer text-sm font-medium transition-colors">
                          <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                            const file = e.target.files?.[0]
                            if (!file) return
                            try {
                              const token = useAuthStore.getState().session?.token
                              const res = await fetch("/api/upload/image", {
                                method: "POST",
                                headers: { Authorization: `Bearer ${token}` },
                                body: (() => { const fd = new FormData(); fd.append("image", file); return fd })()
                              })
                              if (res.ok) {
                                const data = await res.json()
                                handleChange(key, data.url)
                                if (key === "url" && section === "media") {
                                  const sizeMb = (file.size / 1024 / 1024).toFixed(2)
                                  handleChange("size", `${sizeMb} MB`)
                                  handleChange("name", file.name)
                                }
                                toast.success("Tải ảnh lên thành công!")
                              } else { toast.error("Tải ảnh thất bại") }
                            } catch(err) { toast.error("Lỗi tải ảnh") }
                          }} />
                          Tải ảnh lên
                        </label>
                      </div>
                    ) : key === "size" && section === "media" ? (
                      <Input value={formData[key] || ""} disabled className="bg-neutral-50" />
                    ) : key === "category" && section === "lookbook" ? (
                      <select 
                        value={formData[key] || ""} 
                        onChange={e => handleChange(key, e.target.value)}
                        className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">— Chọn danh mục —</option>
                        <option value="Classic">Classic</option>
                        <option value="Modern">Modern</option>
                        <option value="Fade">Fade</option>
                        <option value="Grooming">Grooming</option>
                        <option value="Coloring">Coloring</option>
                      </select>
                    ) : key === "type" && section === "media" ? (
                      <select 
                        value={formData[key] || "image"} 
                        onChange={e => handleChange(key, e.target.value)}
                        className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="image">Hình ảnh</option>
                        <option value="video">Video</option>
                      </select>
                    ) : key === "parent" && section === "categories" ? (
                      <select 
                        value={formData[key] || ""} 
                        onChange={e => handleChange(key, e.target.value)}
                        className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">— Không (Mặc định) —</option>
                        <option value="grooming">Grooming (Chăm sóc tóc & râu)</option>
                        <option value="merchandise">Merchandise (Thời trang)</option>
                      </select>
                    ) : key === "manifesto" || key === "excerpt" || key === "description" ? (
                      <textarea
                        value={formData[key] || ""}
                        onChange={e => handleChange(key, e.target.value)}
                        className="w-full flex min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                      />
                    ) : (
                      <Input
                        value={formData[key] || ""}
                        onChange={e => handleChange(key, typeof formData[key] === "number" ? Number(e.target.value) : e.target.value)}
                        type={key === "password" ? "password" : typeof formData[key] === "number" ? "number" : "text"}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {section !== "products" && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setModalOpen(false)}>Hủy bỏ</Button>
              <Button onClick={handleSaveGeneric}>Lưu lại</Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Dữ liệu sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction onClick={() => itemToDelete && confirmDelete(itemToDelete)}>
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function Field({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <label className={`text-sm ${wide ? "sm:col-span-2" : ""}`}>
      {label}
      <input defaultValue={value} className="mt-2 w-full border px-3 py-2 rounded" />
    </label>
  )
}
