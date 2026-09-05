"use client"
import { MoreHorizontal, Plus, Search, Edit, Trash2, ChevronDown, ChevronUp, Eye, EyeOff, KeyRound, Copy, Check, PhoneCall, Mail, RefreshCw, UploadCloud, Images, Film, ExternalLink, ImageOff } from "lucide-react"
import { useDataStore } from "@/store/data-store"
import { useAuthStore } from "@/store/auth-store"
import { formatCurrency } from "@/lib/format"
import { getCategoryLabel, getParentCategory, PRODUCT_CATEGORY_PARENTS } from "@/lib/product-taxonomy"
import { Button } from "@/components/ui/button"
import { useState, useMemo, useEffect } from "react"
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
  "promo-codes": "Mã giảm giá",
  faqs: "Câu hỏi thường gặp",
  messages: "Tin nhắn liên hệ",
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
  process: "Quy trình dịch vụ",
  blocks: "Nội dung (các khối)",
  gallery: "Thư viện ảnh",
  published: "Trạng thái hiển thị",
  order: "Thứ tự",
  url: "Đường dẫn file (URL)",
  size: "Kích thước",
  parent: "Danh mục cha",
  productCount: "Số lượng sản phẩm",
  code: "Mã giảm giá",
  discountType: "Loại giảm giá",
  discountValue: "Giá trị giảm",
  minOrderValue: "Giá trị đơn tối thiểu (VNĐ)",
  maxDiscount: "Giảm tối đa (VNĐ, để trống = không giới hạn)",
  usageLimit: "Giới hạn số lần dùng (bỏ trống = không giới hạn)",
  isActive: "Trạng thái kích hoạt",
  expiresAt: "Ngày hết hạn (bỏ trống = không giới hạn)",
  message: "Lời nhắn",
  question: "Câu hỏi",
  answer: "Câu trả lời",
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
      { key: "volume", label: "Quy cách bán", options: ["50g", "100g", "150g", "250ml", "500ml"] },
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

function skuToken(value: string, fallback = "ITEM") {
  const token = value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "").toUpperCase()
  return token || fallback
}

function createSkuPrefix(title: string) {
  return `TOTO-${skuToken(title).slice(0, 24)}`
}

function generateVariants(
  selectedOptions: Record<string, string[]>,
  dimensions: VariantDimension[],
  variantPrices: Record<string, number>,
  variantStocks: Record<string, number>,
  basePrice: number,
  skuPrefix: string,
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
      sku: existing?.sku || `${skuPrefix}-${combo.map(value => skuToken(value)).join("-")}`,
    }
  })
}

// ============================================================================
// Media Thumbnail with Graceful Fallback for Broken Images
// ============================================================================
export function MediaThumbnail({
  src,
  alt = "Media",
  className = "",
  type = "image",
}: {
  src?: string | null;
  alt?: string;
  className?: string;
  type?: string;
}) {
  const [error, setError] = useState(false);

  if (type === "video") {
    return (
      <div className={`w-full h-full bg-neutral-900 flex flex-col items-center justify-center text-white ${className}`}>
        <Film className="size-8 text-neutral-400 mb-1" />
        <span className="text-[10px] font-bold uppercase tracking-wider bg-black/60 px-2 py-0.5 rounded">Video</span>
      </div>
    );
  }

  if (error || !src || src === "undefined" || src === "null" || typeof src !== "string" || src.trim().length < 3) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center bg-neutral-100 text-neutral-400 p-2 text-center select-none ${className}`}>
        <ImageOff className="size-6 text-neutral-300 mb-1" />
        <span className="text-[9px] font-medium text-neutral-400 truncate max-w-full">Ảnh không khả dụng</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`w-full h-full object-cover ${className}`}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}

// ============================================================================
// Media Utility: Aggregate all media assets across the entire application
// ============================================================================
export function getAllMediaItems(d: any) {
  const urlMap = new Map<string, any>();
  const isValidUrl = (u: any) => typeof u === 'string' && u.trim().length > 3 && u !== 'undefined' && u !== 'null';

  // 1. Tệp trực tiếp từ Cloudflare R2 & Media Database (nguồn chính xác nhất)
  (d.media || []).forEach((m: any) => {
    if (m && isValidUrl(m.url)) {
      urlMap.set(m.url, {
        id: m.id || `med-${urlMap.size + 1}`,
        url: m.url,
        name: m.name || m.filename || m.url.split('/').pop()?.split('?')[0] || "Tệp Media",
        size: m.size ? (typeof m.size === 'number' ? `${(m.size / (1024 * 1024)).toFixed(2)} MB` : String(m.size)) : "—",
        type: m.type || (m.url.match(/\.(mp4|webm|mov|ogg|m4v)$/i) ? "video" : "image"),
        createdAt: m.createdAt || new Date().toISOString(),
        source: m.source || "Thư viện Media",
        isDatabase: true
      });
    }
  });

  // 2. Hình ảnh từ tất cả Sản phẩm (nếu có ảnh ngoài chưa lưu vào media)
  (d.products || []).forEach((p: any) => {
    (p.images || []).forEach((img: string, idx: number) => {
      if (isValidUrl(img) && !urlMap.has(img)) {
        const rawName = img.split('/').pop()?.split('?')[0] || `${p.title || 'SP'} (${idx + 1})`;
        urlMap.set(img, {
          id: `prod-img-${p.id}-${idx}`,
          url: img,
          name: rawName.replace(/[-_]/g, ' '),
          size: "—",
          type: img.match(/\.(mp4|webm|mov|ogg)$/i) ? "video" : "image",
          createdAt: p.createdAt || new Date().toISOString(),
          source: `Sản phẩm: ${p.title || 'Sản phẩm'}`
        });
      }
    });
  });

  // 3. Hình ảnh từ Lookbook
  (d.lookbook || []).forEach((lb: any, idx: number) => {
    if (isValidUrl(lb.image) && !urlMap.has(lb.image)) {
      const rawName = lb.image.split('/').pop()?.split('?')[0] || `Lookbook ${lb.title || idx + 1}`;
      urlMap.set(lb.image, {
        id: `lb-img-${lb.id || idx}`,
        url: lb.image,
        name: lb.title || rawName.replace(/[-_]/g, ' '),
        size: "—",
        type: lb.image.match(/\.(mp4|webm|mov|ogg)$/i) ? "video" : "image",
        createdAt: lb.createdAt || new Date().toISOString(),
        source: "Bộ sưu tập Lookbook"
      });
    }
  });

  return Array.from(urlMap.values());
}

// ============================================================================
// Reusable Media Picker Modal Component
// ============================================================================
export function MediaPickerModal({
  open,
  onClose,
  onSelect,
  multiple = true,
  mediaList = [],
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (urls: string[]) => void;
  multiple?: boolean;
  mediaList: any[];
}) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const d = useDataStore();

  useEffect(() => {
    if (open) {
      setSelectedUrls([]);
      setSearch("");
      setTypeFilter("ALL");
    }
  }, [open]);

  const filtered = mediaList.filter((m) => {
    const text = (m.name || m.url || "").toLowerCase();
    if (search && !text.includes(search.toLowerCase())) return false;
    if (typeFilter !== "ALL" && m.type !== typeFilter) return false;
    return true;
  });

  const toggleSelect = (url: string) => {
    if (multiple) {
      if (selectedUrls.includes(url)) {
        setSelectedUrls(selectedUrls.filter((u) => u !== url));
      } else {
        setSelectedUrls([...selectedUrls, url]);
      }
    } else {
      setSelectedUrls([url]);
    }
  };

  const handleConfirm = () => {
    if (selectedUrls.length > 0) {
      onSelect(selectedUrls);
      onClose();
    }
  };

  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    const token = useAuthStore.getState().session?.token;
    for (const file of files) {
      try {
        const fd = new FormData();
        fd.append("image", file);
        const res = await fetch("/api/upload/image", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
        if (res.ok) {
          const data = await res.json();
          await d.addMedia({
            url: data.url,
            name: file.name,
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            type: file.type.startsWith("video") ? "video" : "image",
          });
          if (!multiple) {
            setSelectedUrls([data.url]);
          } else {
            setSelectedUrls((prev) => [...prev, data.url]);
          }
          toast.success(`Đã tải lên: ${file.name}`);
        }
      } catch {
        toast.error("Tải ảnh thất bại");
      }
    }
    setUploading(false);
    e.target.value = "";
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[850px] max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-3 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Images className="size-5 text-emerald-600" />
              Thư viện Media ({mediaList.length} tệp)
            </DialogTitle>
            <label className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white rounded-md text-xs font-semibold hover:bg-neutral-800 cursor-pointer transition-colors shadow-sm">
              <UploadCloud className="size-3.5" />
              {uploading ? "Đang tải..." : "Tải ảnh mới từ máy"}
              <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleDirectUpload} disabled={uploading} />
            </label>
          </div>
        </DialogHeader>

        {/* Toolbar lọc và tìm kiếm */}
        <div className="p-3 border-b bg-neutral-50 flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
            <input
              placeholder="Tìm kiếm theo tên ảnh, tệp..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 pl-8 pr-3 text-xs bg-white border border-neutral-200 rounded-md outline-none focus:border-primary"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-8 px-2 text-xs bg-white border border-neutral-200 rounded-md outline-none cursor-pointer"
          >
            <option value="ALL">Tất cả định dạng</option>
            <option value="image">Chỉ hình ảnh</option>
            <option value="video">Chỉ video</option>
          </select>
        </div>

        {/* Lưới hình ảnh Media */}
        <div className="flex-1 overflow-y-auto p-4 max-h-[420px]">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {filtered.map((item, idx) => {
                const isSelected = selectedUrls.includes(item.url);
                return (
                  <div
                    key={item.id || idx}
                    onClick={() => toggleSelect(item.url)}
                    className={`group relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-emerald-600 ring-2 ring-emerald-500/30 scale-95"
                        : "border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    <MediaThumbnail src={item.url} alt={item.name || ""} type={item.type} />

                    {/* Dấu tích chọn */}
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 bg-emerald-600 text-white rounded-full p-0.5 shadow-md">
                        <Check className="size-3.5 stroke-[3]" />
                      </div>
                    )}

                    {/* Chú thích tên ảnh */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1.5 pt-4 text-[10px] text-white/90 truncate font-medium">
                      <div className="truncate">{item.name}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center text-neutral-400 text-sm">Không tìm thấy tệp media nào phù hợp.</div>
          )}
        </div>

        {/* Footer chọn ảnh */}
        <div className="p-3 border-t bg-neutral-50 flex items-center justify-between">
          <div className="text-xs text-neutral-600">
            {selectedUrls.length > 0 ? (
              <span className="font-semibold text-emerald-700">Đã chọn {selectedUrls.length} tệp</span>
            ) : (
              <span className="text-neutral-400">Nhấp vào ảnh để chọn</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Hủy bỏ
            </Button>
            <Button size="sm" onClick={handleConfirm} disabled={selectedUrls.length === 0} className="bg-emerald-600 hover:bg-emerald-700">
              {multiple ? `Chèn ${selectedUrls.length} ảnh đã chọn` : "Chọn ảnh này"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// Product Form Component (smart variant builder)
// ============================================================================
function ProductForm({ initial, onSave, onCancel }: {
  initial: Partial<Product>
  onSave: (p: Product) => void
  onCancel: () => void
}) {
  const d = useDataStore()
  const { categories: allCategories } = d
  const { media: dMedia, products: dProducts, lookbook: dLookbook, stories: dStories } = d
  const allMediaList = useMemo(
    () => getAllMediaItems({ media: dMedia, products: dProducts, lookbook: dLookbook, stories: dStories }),
    [dMedia, dProducts, dLookbook, dStories]
  )
  const [openMediaPicker, setOpenMediaPicker] = useState(false)

  // Basic fields
  const [title, setTitle] = useState(initial.title ?? "")
  const [description, setDescription] = useState(initial.description ?? "")
  const [basePrice, setBasePrice] = useState(initial.basePrice ?? 0)
  const [compareAtPrice, setCompareAtPrice] = useState((initial as any).compareAtPrice ?? 0)
  const [status, setStatus] = useState<"active"|"draft"|"archived">(initial.status ?? "draft")
  const [featured, setFeatured] = useState(initial.featured ?? false)
  const [categoryId, setCategoryId] = useState(initial.category ?? "")

  // Images (multiple)
  const [images, setImages] = useState<string[]>(initial.images ?? [])
  const [urlInput, setUrlInput] = useState("")
  const [uploadingImage, setUploadingImage] = useState(false)

  const [collection, setCollection] = useState(initial.collection ?? "")

  // 1. Quản lý danh sách biến thể hiện hữu (Bảo toàn ID nguyên gốc và số lượng tồn kho)
  const [currentVariants, setCurrentVariants] = useState<ProductVariant[]>(() => {
    if (initial.variants && initial.variants.length > 0) {
      return initial.variants.map((v: any) => ({
        id: v.id,
        name: v.name || "Biến thể",
        price: typeof v.price === "number" ? v.price : (initial.basePrice ?? 0),
        stock: typeof v.stock === "number" ? v.stock : 0,
        sku: v.sku || "",
        options: v.options || { size: v.size, color: v.color },
        size: v.size,
        color: v.color,
      }))
    }
    return [{ id: `variant-${Math.random().toString(36).slice(2, 9)}`, name: "Mặc định", price: initial.basePrice ?? 0, stock: 0, sku: "", options: {} }]
  })

  const handleUpdateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    setCurrentVariants(prev => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const handleRemoveVariant = (index: number) => {
    setCurrentVariants(prev => prev.filter((_, i) => i !== index))
  }

  const handleAddManualVariant = () => {
    setCurrentVariants(prev => [
      ...prev,
      {
        id: `temp-${Date.now()}` as any,
        name: `Biến thể mới ${prev.length + 1}`,
        price: basePrice,
        stock: 10,
        sku: `${createSkuPrefix(title)}-${prev.length + 1}`,
        options: {},
      }
    ])
  }

  const [productType, setProductType] = useState(() => {
    if (PRODUCT_TYPES.some(t => t.value === initial.collection)) return initial.collection;
    if (initial.variants && initial.variants.length > 0) {
      const opts = initial.variants[0].options || { size: initial.variants[0].size, color: initial.variants[0].color }
      const sizeVal = (opts.size || (opts as any).volume || "")
      if (sizeVal && opts.color) return "fashion-top"
      if (sizeVal && !opts.color) {
        if (sizeVal.includes("g") || sizeVal.includes("ml")) return "grooming"
        if (sizeVal === "One-size" || sizeVal.includes("/")) return "cap"
        return "fashion-bottom"
      }
      if (opts.color && !sizeVal) return "fashion-top"
    }
    return ""
  })

  // Ánh xạ linh hoạt key options: size có ml/g tự chuyển sang volume để khớp PRODUCT_TYPES
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>(() => {
    const opts: Record<string, string[]> = {}
    initial.variants?.forEach(v => {
      const options: any = v.options || {}
      if (v.size && !options.size) options.size = v.size
      if (v.color && !options.color) options.color = v.color
      Object.entries(options).forEach(([k, val]) => {
        let targetKey = k
        if ((k === "size" || !k) && typeof val === "string" && (val.includes("g") || val.includes("ml"))) {
          targetKey = "volume"
        }
        if (!opts[targetKey]) opts[targetKey] = []
        if (typeof val === 'string' && !opts[targetKey].includes(val)) opts[targetKey].push(val)
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
  const [variantOpen, setVariantOpen] = useState(false)

  const typeConfig = PRODUCT_TYPES.find(t => t.value === productType)
  const hasVariants = (typeConfig?.dimensions?.length ?? 0) > 0
  const skuPrefix = createSkuPrefix(title)

  const generatedVariants = useMemo(() => {
    if (!typeConfig) return []
    return generateVariants(selectedOptions, typeConfig.dimensions, variantPrices, variantStocks, basePrice, skuPrefix, initial.variants as ProductVariant[])
  }, [selectedOptions, variantPrices, variantStocks, basePrice, skuPrefix, typeConfig, initial.variants])

  const handleApplyGenerated = () => {
    if (generatedVariants.length === 0) return
    setCurrentVariants(prev => {
      const isNewDefault = prev.length === 1 && prev[0].name === "Mặc định" && Object.keys(prev[0].options ?? {}).length === 0
      const merged = isNewDefault ? [] : [...prev]
      generatedVariants.forEach(gv => {
        const existingIdx = merged.findIndex(mv => mv.name === gv.name)
        if (existingIdx >= 0) {
          merged[existingIdx] = {
            ...merged[existingIdx],
            price: variantPrices[gv.name] ?? gv.price,
            stock: variantStocks[gv.name] ?? gv.stock,
            sku: variantSkus[gv.name] || gv.sku,
          }
        } else {
          merged.push({
            ...gv,
            price: variantPrices[gv.name] ?? gv.price,
            stock: variantStocks[gv.name] ?? gv.stock,
            sku: variantSkus[gv.name] || gv.sku,
          })
        }
      })
      return merged
    })
    toast.success(`Đã áp dụng ${generatedVariants.length} biến thể.`)
  }

  const addImageFromFile = async (file: File) => {
    setUploadingImage(true)
    try {
      const token = typeof window !== "undefined" ? useAuthStore.getState().session?.token : null
      if (!token) throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.")
      const formData = new FormData()
      formData.append("image", file)
      const res = await fetch("/api/upload/image", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.url) throw new Error(data.error || "Không thể tải ảnh lên")
      setImages(prev => [...prev, data.url])
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể tải ảnh lên")
    } finally {
      setUploadingImage(false)
    }
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
    if (!Number.isFinite(basePrice) || basePrice <= 0) { toast.error("Giá bán phải lớn hơn 0."); return }
    if (compareAtPrice > 0 && compareAtPrice <= basePrice) { toast.error("Giá gốc phải lớn hơn giá bán."); return }
    if (status === "active" && images.length === 0) { toast.error("Sản phẩm đang bán cần có ít nhất một hình ảnh."); return }

    const finalVariants: ProductVariant[] = currentVariants.length > 0
      ? currentVariants.map(v => ({
          ...v,
          name: v.name?.trim() || "Biến thể",
          price: typeof v.price === "number" ? v.price : basePrice,
          stock: Math.max(0, Number(v.stock) || 0),
          sku: v.sku?.trim() || `${skuPrefix}-${skuToken(v.name || "DEFAULT")}`,
        }))
      : [{ id: `variant-${Math.random().toString(36).slice(2, 9)}`, name: "Mặc định", price: basePrice, stock: 0, sku: `${skuPrefix}-DEFAULT`, options: {} }]

    if (finalVariants.some(v => !Number.isInteger(v.price) || v.price <= 0 || !Number.isInteger(v.stock) || v.stock < 0)) { toast.error("Kiểm tra lại giá và tồn kho của biến thể."); return }
    const usedSkus = new Set<string>()
    if (finalVariants.some(v => { const value = v.sku.trim().toUpperCase(); if (usedSkus.has(value)) return true; usedSkus.add(value); return false })) { toast.error("SKU của các biến thể không được trùng nhau."); return }

    onSave({
      ...(initial as Product),
      id: initial.id,
      title,
      slug: initial.slug || title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/gi, "-").toLowerCase(),
      description,
      basePrice,
      images,
      status,
      featured,
      category: categoryId as any,
      collection: collection.trim() || null,
      variants: finalVariants,
      tags: initial.tags ?? [],
      rating: initial.rating ?? 0,
      reviewCount: initial.reviewCount ?? 0,
      createdAt: initial.createdAt ?? new Date().toISOString(),
      compareAtPrice: compareAtPrice > 0 ? compareAtPrice : undefined,
    } as any)
  }

  const groomingCats = allCategories.filter(c => c.parent === "grooming")
  const merchCats = allCategories.filter(c => c.parent === "merchandise")

  return (
    <div className="flex flex-col gap-6 py-2 w-full min-w-0 max-w-full overflow-x-hidden">

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

        {/* Nút chọn ảnh từ máy và Chọn từ Thư viện Media */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
          <div className="w-full min-w-0">
            <input type="file" accept="image/*" multiple className="hidden" id="product-multi-upload"
              onChange={async e => {
                const files = Array.from(e.target.files ?? [])
                for (const file of files) await addImageFromFile(file)
                e.target.value = ""
              }}
            />
            <label htmlFor="product-multi-upload" className="flex items-center justify-center gap-2 w-full h-14 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors text-xs font-semibold text-neutral-600 px-3 text-center">
              {uploadingImage ? <span className="animate-pulse">⏳ Đang tải ảnh lên...</span> : <>📁 Tải ảnh từ máy tính (nhiều tệp)</>}
            </label>
          </div>

          <button
            type="button"
            onClick={() => setOpenMediaPicker(true)}
            className="flex items-center justify-center gap-2 w-full h-14 border-2 border-emerald-300 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-xs font-bold text-emerald-800 transition-colors cursor-pointer shadow-sm px-3 text-center min-w-0"
          >
            <Images className="size-4 text-emerald-600 shrink-0" />
            <span className="truncate">🖼️ Chọn từ Thư viện Media ({allMediaList.length} tệp)</span>
          </button>
        </div>

        <div className="flex gap-2">
          <Input value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder="Hoặc dán link ảnh URL..." onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addImageFromUrl())} />
          <Button type="button" variant="outline" onClick={addImageFromUrl} className="shrink-0">Thêm URL</Button>
        </div>
        {images.length > 0 && <p className="text-xs text-neutral-400">Di chuột lên ảnh để đặt ảnh chính hoặc xóa.</p>}
      </section>

      {/* ── 3. Loại sản phẩm & Biến thể ── */}
      {/* ── 3. Loại sản phẩm & Quản lý Biến thể ── */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 border-b pb-2">Kho hàng &amp; Biến thể</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-600">Bộ sưu tập <span className="font-normal text-neutral-400">(tùy chọn)</span></label>
            <Input value={collection} onChange={e => setCollection(e.target.value)} placeholder="VD: Core Collection, Summer 2026..." />
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

        {/* ── 3.1. BẢNG BIẾN THỂ & TỒN KHO HIỆN CÓ ── */}
        {currentVariants.length > 0 ? (
          <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-neutral-50 px-4 py-3 border-b gap-2">
              <div>
                <h4 className="text-sm font-bold text-neutral-800 flex items-center gap-2">
                  <span>Biến thể bán &amp; tồn kho</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                    {currentVariants.length} loại
                  </span>
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Giá dùng giá mặc định ở trên; chỉ sửa khi biến thể này có giá riêng. SKU được tự sinh và có thể sửa.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddManualVariant}
                className="text-xs h-8 gap-1.5 shrink-0 bg-white"
              >
                <Plus className="size-3.5" /> Thêm biến thể
              </Button>
            </div>

            <div className="overflow-x-auto max-h-[340px] w-full min-w-0 border rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-50/90 sticky top-0 border-b text-neutral-600 font-semibold z-10">
                  <tr>
                    <th className="px-3 py-2.5">Tên biến thể</th>
                    <th className="px-3 py-2.5 w-32 whitespace-nowrap">Trạng thái kho</th>
                    <th className="px-3 py-2.5 w-28">Tồn kho (SP)</th>
                    <th className="px-3 py-2.5 w-32">Giá riêng (VNĐ)</th>
                    <th className="px-3 py-2.5 w-32">SKU tự sinh</th>
                    <th className="px-3 py-2.5 w-12 text-center">Xóa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {currentVariants.map((v, idx) => {
                    const stockNum = Number(v.stock) || 0
                    const isOutOfStock = stockNum === 0
                    const isLowStock = stockNum > 0 && stockNum < 5
                    const automaticSku = v.sku || `${skuPrefix}-${skuToken(v.name || "DEFAULT")}`

                    return (
                      <tr key={v.id || idx} className={isOutOfStock ? "bg-red-50/40" : isLowStock ? "bg-amber-50/30" : "hover:bg-neutral-50/50"}>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={v.name}
                            onChange={e => handleUpdateVariant(idx, "name", e.target.value)}
                            placeholder="Tên biến thể"
                            className="w-full font-medium border border-transparent hover:border-neutral-300 focus:border-primary rounded px-2 py-1 bg-transparent outline-none text-neutral-800 text-xs"
                          />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {isOutOfStock ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-100/90 px-2 py-0.5 rounded-full border border-red-200">
                              Hết hàng (0)
                            </span>
                          ) : isLowStock ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-200">
                              Sắp hết ({stockNum})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-200">
                              Còn hàng ({stockNum})
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min={0}
                              value={v.stock}
                              onChange={e => handleUpdateVariant(idx, "stock", Math.max(0, parseInt(e.target.value) || 0))}
                              className="w-20 border rounded px-2 py-1 font-bold text-neutral-900 outline-none focus:border-primary text-xs bg-white"
                            />
                            {isOutOfStock && (
                              <button
                                type="button"
                                onClick={() => handleUpdateVariant(idx, "stock", 10)}
                                title="Nhập nhanh +10 tồn kho"
                                className="text-[10px] text-primary hover:underline px-1 py-0.5 bg-primary/10 rounded font-bold shrink-0"
                              >
                                +10
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            min={0}
                            value={v.price ?? basePrice}
                            onChange={e => handleUpdateVariant(idx, "price", Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full max-w-[120px] border rounded px-2 py-1 outline-none focus:border-primary text-xs bg-white"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={automaticSku}
                            onChange={e => handleUpdateVariant(idx, "sku", e.target.value)}
                            aria-label={`SKU của biến thể ${v.name}`}
                            className="w-full max-w-[120px] border rounded px-2 py-1 font-mono text-[11px] outline-none focus:border-primary uppercase bg-white"
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(idx)}
                            className="text-neutral-400 hover:text-red-600 p-1 transition-colors"
                            title="Xóa biến thể này"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-neutral-50 border-t text-xs text-neutral-500 gap-2">
              <span>Tổng tồn kho: <strong className="text-neutral-800 font-bold">{currentVariants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)} SP</strong></span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAddManualVariant}
                className="text-xs h-7 text-primary hover:bg-primary/5 self-start sm:self-auto"
              >
                + Thêm biến thể dòng mới
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/40 p-4">
            <p className="text-xs text-neutral-600">Mỗi sản phẩm cần ít nhất một biến thể để quản lý tồn kho và SKU.</p>
            <Button type="button" size="sm" onClick={handleAddManualVariant}>+ Thêm biến thể</Button>
          </div>
        )}

        {/* ── 3.2. BỘ SINH BIẾN THỂ TỰ ĐỘNG THEO THUỘC TÍNH (ACCORDION) ── */}
        {typeConfig && hasVariants && (
          <div className="border rounded-xl overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => setVariantOpen(v => !v)}
              className="flex w-full items-center justify-between bg-neutral-50 px-4 py-3 text-sm font-semibold hover:bg-neutral-100 transition-colors border-b"
            >
              <div className="flex items-center gap-2 text-left">
                <span>Sinh biến thể theo thuộc tính</span>
                <span className="text-xs px-2 py-0.5 rounded bg-neutral-200 text-neutral-600 font-normal">
                  {typeConfig.label}
                </span>
              </div>
              {variantOpen ? <ChevronUp className="size-4 text-neutral-500" /> : <ChevronDown className="size-4 text-neutral-500" />}
            </button>

            {variantOpen && (
              <div className="p-4 space-y-5">
                <div className="text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 flex items-center justify-between flex-wrap gap-2">
                  <span>Chọn thuộc tính để tạo các tổ hợp biến thể.</span>
                </div>

                {typeConfig.dimensions.map(dim => (
                  <div key={dim.key} className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">{dim.label}</label>
                    <div className="flex flex-wrap gap-2">
                      {dim.options.map(opt => {
                        const active = selectedOptions[dim.key]?.includes(opt)
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => toggleOption(dim.key, opt)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${active ? "bg-primary text-white border-primary" : "bg-white text-neutral-600 hover:border-primary"}`}
                          >
                            {opt}
                          </button>
                        )
                      })}
                      {(selectedOptions[dim.key] ?? []).filter(v => !dim.options.includes(v)).map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleOption(dim.key, opt)}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold border bg-primary text-white border-primary"
                        >
                          {opt} ✕
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-1">
                      <Input
                        value={customOptionInputs[dim.key] ?? ""}
                        onChange={e => setCustomOptionInputs(prev => ({ ...prev, [dim.key]: e.target.value }))}
                        placeholder={`Thêm ${dim.label.toLowerCase()} tùy chỉnh...`}
                        className="h-8 text-xs"
                        onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addCustomOption(dim.key))}
                      />
                      <Button type="button" size="sm" variant="outline" onClick={() => addCustomOption(dim.key)} className="h-8 text-xs px-3">Thêm</Button>
                    </div>
                  </div>
                ))}

                {generatedVariants.length > 0 && (
                  <div className="mt-4 pt-4 border-t space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                        Bản xem trước tổ hợp ({generatedVariants.length} biến thể sinh ra)
                      </p>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleApplyGenerated}
                        className="text-xs h-7 bg-emerald-600 text-white hover:bg-emerald-700"
                      >
                        Áp dụng {generatedVariants.length} biến thể
                      </Button>
                    </div>

                    <div className="overflow-x-auto border rounded-lg max-h-[220px] w-full min-w-0">
                      <table className="w-full text-xs">
                        <thead className="bg-neutral-50 sticky top-0 border-b">
                          <tr>
                            <th className="px-3 py-2 text-left font-semibold text-neutral-600">Biến thể sinh ra</th>
                            <th className="px-3 py-2 text-left font-semibold text-neutral-600">Giá mặc định</th>
                            <th className="px-3 py-2 text-left font-semibold text-neutral-600">Tồn kho ban đầu</th>
                            <th className="px-3 py-2 text-left font-semibold text-neutral-600">Mã SKU dự kiến</th>
                          </tr>
                        </thead>
                        <tbody>
                          {generatedVariants.map((v, i) => (
                            <tr key={v.name} className={i % 2 === 0 ? "bg-white" : "bg-neutral-50/50"}>
                              <td className="px-3 py-2 font-medium whitespace-nowrap">{v.name}</td>
                              <td className="px-3 py-2">
                                <input
                                  type="number"
                                  value={variantPrices[v.name] ?? basePrice}
                                  onChange={e => setVariantPrices(prev => ({ ...prev, [v.name]: Number(e.target.value) }))}
                                  className="w-28 border rounded px-2 py-1 outline-none focus:border-primary"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <input
                                  type="number"
                                  value={variantStocks[v.name] ?? 0}
                                  onChange={e => setVariantStocks(prev => ({ ...prev, [v.name]: Number(e.target.value) }))}
                                  className="w-20 border rounded px-2 py-1 outline-none focus:border-primary"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <input
                                  type="text"
                                  value={variantSkus[v.name] ?? v.sku}
                                  onChange={e => setVariantSkus(prev => ({ ...prev, [v.name]: e.target.value }))}
                                  className="w-32 border rounded px-2 py-1 outline-none focus:border-primary font-mono text-xs"
                                />
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

      <MediaPickerModal
        open={openMediaPicker}
        onClose={() => setOpenMediaPicker(false)}
        onSelect={(urls) => setImages(prev => [...prev, ...urls])}
        multiple={true}
        mediaList={allMediaList}
      />
    </div>
  )
}

// ============================================================================
// Settings Form Component
// ============================================================================
function SettingsForm() {
  const d = useDataStore()
  const [form, setForm] = useState(d.settings || {})
  
  useEffect(() => {
    if (d.settings && Object.keys(d.settings).length > 0) {
      setForm(d.settings)
    }
  }, [d.settings])
  
  const handleChange = (section: string, key: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
  }

  const handleSave = () => {
    // Đảm bảo đồng bộ cả social và socials để tương thích ngược mọi nơi
    const payload = {
      ...form,
      social: form.social || form.socials || {},
      socials: form.social || form.socials || {}
    }
    d.updateSettings(payload)
  }

  return (
    <div>
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-widest text-primary">Quản trị nội dung</p><h1 className="mt-2 font-display text-4xl font-bold uppercase">Cài đặt</h1></div>
      </header>
      
      <div className="mt-8 grid max-w-3xl gap-5 border bg-white p-6 sm:grid-cols-2">
        <h2 className="sm:col-span-2 font-bold text-lg border-b pb-2">Thông tin doanh nghiệp</h2>
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-semibold text-neutral-600">Tên doanh nghiệp</label>
          <Input value={form.business?.name || ""} onChange={e => handleChange('business', 'name', e.target.value)} />
        </div>
        
        <h2 className="sm:col-span-2 font-bold text-lg border-b pb-2 mt-4">Liên hệ & Địa chỉ</h2>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-600">Email liên hệ</label>
          <Input value={form.contact?.email || ""} onChange={e => handleChange('contact', 'email', e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-600">Hotline / Điện thoại</label>
          <Input value={form.contact?.phone || ""} onChange={e => handleChange('contact', 'phone', e.target.value)} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-semibold text-neutral-600">Địa chỉ tiệm</label>
          <Input value={form.contact?.address || ""} onChange={e => handleChange('contact', 'address', e.target.value)} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-semibold text-neutral-600">Giờ làm việc / Giờ mở cửa</label>
          <Input value={form.contact?.hours || ""} placeholder="VD: 09:00 – 20:30 (Mở cửa tất cả các ngày trong tuần)" onChange={e => handleChange('contact', 'hours', e.target.value)} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-semibold text-neutral-600">Đường dẫn Google Maps (Mở chỉ đường)</label>
          <Input value={form.contact?.googleMapsUrl || ""} placeholder="VD: https://www.google.com/maps/place/..." onChange={e => handleChange('contact', 'googleMapsUrl', e.target.value)} />
        </div>

        <h2 className="sm:col-span-2 font-bold text-lg border-b pb-2 mt-4">Mạng xã hội</h2>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-600">Facebook URL</label>
          <Input value={form.social?.facebook || form.socials?.facebook || ""} onChange={e => handleChange('social', 'facebook', e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-600">Instagram URL</label>
          <Input value={form.social?.instagram || form.socials?.instagram || ""} onChange={e => handleChange('social', 'instagram', e.target.value)} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-semibold text-neutral-600">Tiktok URL</label>
          <Input value={form.social?.tiktok || form.socials?.tiktok || ""} onChange={e => handleChange('social', 'tiktok', e.target.value)} />
        </div>

        <Button onClick={handleSave} className="sm:col-span-2 mt-4">Lưu thay đổi</Button>
      </div>

      <ChangeAdminPasswordCard />
    </div>
  )
}

function ChangeAdminPasswordCard() {
  const session = useAuthStore(s => s.session)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng điền đầy đủ các trường mật khẩu")
      return
    }
    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có tối thiểu 6 ký tự")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!")
      return
    }

    setLoading(true)
    try {
      const token = useAuthStore.getState().session?.token
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(data.message || "Đổi mật khẩu thành công!")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        toast.error(data.error || "Đổi mật khẩu thất bại")
      }
    } catch {
      toast.error("Lỗi khi kết nối đến máy chủ")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-8 max-w-3xl border bg-white p-6">
      <div className="flex items-center gap-2 border-b pb-3 mb-5">
        <KeyRound className="size-5 text-amber-600" />
        <div>
          <h2 className="font-bold text-lg">Bảo mật & Đổi mật khẩu của tôi</h2>
          <p className="text-xs text-neutral-500">Đang đăng nhập với email: <strong className="text-neutral-800">{session?.email}</strong></p>
        </div>
      </div>

      <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-600">Mật khẩu hiện tại</label>
          <div className="relative">
            <Input 
              type={showPass ? "text" : "password"} 
              value={currentPassword} 
              onChange={e => setCurrentPassword(e.target.value)} 
              placeholder="Nhập mật khẩu đang sử dụng..." 
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-600">Mật khẩu mới</label>
          <div className="relative">
            <Input 
              type={showPass ? "text" : "password"} 
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)} 
              placeholder="Tối thiểu 6 ký tự..." 
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-600">Xác nhận mật khẩu mới</label>
          <div className="relative">
            <Input 
              type={showPass ? "text" : "password"} 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              placeholder="Nhập lại mật khẩu mới..." 
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button 
            type="button" 
            onClick={() => setShowPass(!showPass)} 
            className="text-xs text-neutral-500 hover:text-neutral-800 flex items-center gap-1 cursor-pointer"
          >
            {showPass ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
            {showPass ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          </button>

          <Button type="submit" disabled={loading} className="gap-2">
            <KeyRound className="size-4" />
            {loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
          </Button>
        </div>
      </form>
    </div>
  )
}

// ============================================================================
// Generic form for other sections
// ============================================================================
const EXCLUDED_KEYS = ["id", "createdAt", "updatedAt", "slug", "images", "variants", "tags", "relatedProductIds", "timeline", "items", "modules", "roadmap", "benefits", "audience", "productCount", "totalOrders", "totalSpent", "orders", "addresses", "resetTokens"]
// Những field dùng UI dynamic list thay vì textarea JSON
const JSON_LIST_KEYS = ["process", "blocks", "gallery"]

function generateDefaultForm(section: string) {
  switch (section) {
    case "categories": return { name: "", slug: "", parent: "", description: "" }
    case "services": return { name: "", category: "Tóc & tạo kiểu", price: 100000, duration: 45, description: "", process: ["Tư vấn kiểu tóc", "Cắt tỉa tạo form", "Gội sấy & vuốt sáp tạo kiểu"], image: "", featured: false }
    case "training": return { title: "", duration: "2 tháng", price: 15000000, description: "", excerpt: "", startDate: "Khai giảng hàng tháng", status: "active" }
    case "merchandise-stories": return { title: "", subtitle: "", manifesto: "", heroImage: "", blocks: [], gallery: [], status: "published", order: 1 }
    case "lookbook": return { title: "", category: "Classic", image: "" }
    case "customers": return { name: "", email: "", password: "", phone: "", role: "CUSTOMER" }
    case "staff": return { name: "", email: "", password: "", phone: "", role: "ADMIN" }
    case "promo-codes": return { code: "", discountType: "PERCENT", discountValue: 0, minOrderValue: 0, maxDiscount: 0, usageLimit: 100, isActive: true, expiresAt: null }
    case "faqs": return { question: "", answer: "", category: "shop", order: 0 }
    default: return { name: "" }
  }
}

type Row = Record<string, any>

// ============================================================================
// Messages Form Component with Advanced Filters
// ============================================================================
function MessagesForm({ d }: { d: any }) {
  const [selectedMsg, setSelectedMsg] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL"); // ALL, COURSE, CONTACT
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, UNREAD, READ

  const filteredMessages = (d.messages || []).filter((msg: any) => {
    const text = `${msg.name || ""} ${msg.email || ""} ${msg.phone || ""} ${msg.subject || ""} ${msg.message || ""}`.toLowerCase();
    if (search && !text.includes(search.toLowerCase())) return false;

    const isCourse = msg.subject && msg.subject.includes('Đăng ký khóa học');
    if (typeFilter === "COURSE" && !isCourse) return false;
    if (typeFilter === "CONTACT" && isCourse) return false;

    if (statusFilter === "UNREAD" && msg.status !== "unread") return false;
    if (statusFilter === "READ" && msg.status === "unread") return false;

    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Hệ thống</p>
          <h1 className="mt-2 font-display text-4xl font-bold uppercase">Tin nhắn liên hệ</h1>
          <p className="text-sm text-muted-foreground mt-1">Quản lý các yêu cầu tư vấn và đăng ký đào tạo từ khách hàng.</p>
        </div>
      </div>

      <div className="border bg-white max-w-full overflow-hidden">
        {/* Bộ lọc tin nhắn */}
        <div className="flex flex-wrap items-center gap-3 border-b p-4 bg-white/50">
          <div className="relative w-full sm:max-w-xs flex items-center">
            <Search className="absolute left-3 size-4 text-neutral-400" />
            <input 
              placeholder="Tìm theo tên, email, sđt..." 
              className="flex-1 h-9 outline-none pl-9 border border-neutral-200 rounded-md text-sm focus:border-primary" 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>

          <select 
            value={typeFilter} 
            onChange={e => setTypeFilter(e.target.value)} 
            className="h-9 border border-neutral-200 rounded-md bg-neutral-50 px-3 text-sm focus:outline-none focus:border-primary cursor-pointer text-neutral-700"
          >
            <option value="ALL">Tất cả loại tin</option>
            <option value="COURSE">Đăng ký khóa học</option>
            <option value="CONTACT">Liên hệ tư vấn chung</option>
          </select>

          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)} 
            className="h-9 border border-neutral-200 rounded-md bg-neutral-50 px-3 text-sm focus:outline-none focus:border-primary cursor-pointer text-neutral-700"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="UNREAD">Chưa đọc</option>
            <option value="READ">Đã đọc</option>
          </select>

          {(search || typeFilter !== "ALL" || statusFilter !== "ALL") && (
            <button 
              onClick={() => { setSearch(""); setTypeFilter("ALL"); setStatusFilter("ALL"); }} 
              className="text-xs text-primary hover:underline px-2"
            >
              Xóa lọc
            </button>
          )}
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[700px] text-sm text-left">
            <thead className="bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Khách hàng</th>
                <th className="px-6 py-4 font-medium">Loại</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Trạng thái</th>
                <th className="px-6 py-4 font-medium">Ngày gửi</th>
                <th className="px-6 py-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredMessages.map((msg: any) => (
                <tr key={msg.id} className={`group transition-colors hover:bg-muted/50 ${msg.status === 'unread' ? 'bg-amber-50/30' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {msg.status === 'unread' && <div className="size-2 rounded-full bg-primary shrink-0" />}
                      <span className={`font-medium ${msg.status === 'unread' ? 'text-foreground font-bold' : 'text-muted-foreground'}`}>{msg.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {msg.subject && msg.subject.includes('Đăng ký khóa học') ? (
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-700 tracking-wider uppercase border border-blue-200/50">
                        Đăng ký học
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-1 text-[10px] font-medium text-neutral-600 tracking-wider uppercase border border-neutral-200">
                        Liên hệ
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{msg.email}</td>
                  <td className="px-6 py-4">
                    {msg.status === 'unread' ? (
                      <span className="inline-flex items-center rounded-md bg-neutral-900 px-2 py-1 text-[10px] font-medium text-neutral-50 tracking-wider uppercase">
                        Chưa đọc
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md border border-neutral-200 bg-transparent px-2 py-1 text-[10px] font-medium text-neutral-500 tracking-wider uppercase">
                        Đã đọc
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(msg.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedMsg(msg)} className="size-8 text-muted-foreground hover:text-foreground" title="Xem chi tiết">
                        <Eye className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => {
                        if (confirm('Xóa tin nhắn này?')) d.deleteMessage(msg.id);
                      }} className="size-8 text-muted-foreground hover:bg-red-50 hover:text-red-600" title="Xóa tin nhắn">
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredMessages.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-muted-foreground">Không tìm thấy tin nhắn nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedMsg && (
        <Dialog open={!!selectedMsg} onOpenChange={(open) => !open && setSelectedMsg(null)}>
          <DialogContent className="sm:max-w-4xl p-0 overflow-hidden gap-0 border-border/40">
            <div className="flex flex-col md:flex-row min-h-[400px]">
              {/* Left Column: User Info */}
              <div className="w-full md:w-1/3 shrink-0 bg-muted/10 border-b md:border-b-0 md:border-r border-border/40 p-6 flex flex-col">
                <DialogHeader className="mb-8 text-left">
                  <DialogTitle className="text-lg font-medium tracking-tight">Chi tiết tin nhắn</DialogTitle>
                </DialogHeader>

                <div className="space-y-8 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-neutral-600 font-medium text-lg">
                      {selectedMsg.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-foreground">{selectedMsg.name}</h3>
                      <p className="text-xs text-muted-foreground pt-0.5">{new Date(selectedMsg.createdAt).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase mb-1.5">Email</p>
                      <p className="text-sm text-foreground">{selectedMsg.email}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase mb-1.5">Số điện thoại</p>
                      <p className="text-sm text-foreground">{selectedMsg.phone || <span className="text-muted-foreground italic">Không có</span>}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase mb-1.5">Chủ đề</p>
                      <p className="text-sm text-foreground">{selectedMsg.subject || <span className="text-muted-foreground italic">Liên hệ chung</span>}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase mb-1.5">Trạng thái</p>
                      <p className="text-sm font-medium">
                        {selectedMsg.status === 'unread' ? <span className="text-primary">Chưa đọc</span> : <span className="text-muted-foreground">Đã đọc</span>}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Message Content */}
              <div className="w-full md:w-2/3 min-w-0 flex flex-col bg-background overflow-hidden">
                <div className="flex-1 p-8 overflow-y-auto">
                  <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase mb-4">Nội dung</p>
                  <div className="text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap break-all font-mono bg-muted/5 p-4 rounded-lg border border-border/40 min-h-[200px]">
                    {selectedMsg.message}
                  </div>
                </div>
                
                <DialogFooter className="p-4 border-t border-border/40 bg-muted/10 flex sm:justify-end gap-2">
                  <Button variant="ghost" onClick={() => setSelectedMsg(null)}>Đóng</Button>
                  {selectedMsg.status === 'unread' && (
                    <Button onClick={() => {
                      d.updateMessageStatus(selectedMsg.id, 'read');
                      setSelectedMsg(null);
                    }}>
                      Đánh dấu đã đọc
                    </Button>
                  )}
                </DialogFooter>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// ============================================================================
// Main CrudPage Component
// ============================================================================
export function CrudPage({ section }: { section: string }) {
  const d = useDataStore()

  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Row | null>(null)
  const [formData, setFormData] = useState<Row>({})
  
  // Product Filters
  const [filterCategory, setFilterCategory] = useState("ALL")
  const [filterSubcategory, setFilterSubcategory] = useState("ALL")
  const [categoryParentTab, setCategoryParentTab] = useState("ALL")
  const [filterStatus, setFilterStatus] = useState("ALL")
  const [productStockFilter, setProductStockFilter] = useState("ALL")

  // Customer Filters
  const [customerTypeFilter, setCustomerTypeFilter] = useState("ALL")
  const [customerSpendingFilter, setCustomerSpendingFilter] = useState("ALL")
  const [customerSort, setCustomerSort] = useState("NEWEST")

  // Staff Filters
  const [staffRoleFilter, setStaffRoleFilter] = useState("ALL")
  const [staffSort, setStaffSort] = useState("NEWEST")

  // Promo Code Filters
  const [promoTypeFilter, setPromoTypeFilter] = useState("ALL")
  const [promoStatusFilter, setPromoStatusFilter] = useState("ALL")

  // FAQ Filter
  const [faqCategoryFilter, setFaqCategoryFilter] = useState("ALL")

  const [page, setPage] = useState(1)
  const pageSize = section === "media" ? 24 : 10
  const [itemToDelete, setItemToDelete] = useState<Row | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  // Media & Media Picker States
  const { media: cMedia, products: cProducts, lookbook: cLookbook, stories: cStories } = d
  const productSubcategories = useMemo(
    () => filterCategory === "ALL" ? [] : d.categories.filter(category => category.parent === filterCategory),
    [d.categories, filterCategory],
  )
  const allMediaList = useMemo(
    () => getAllMediaItems({ media: cMedia, products: cProducts, lookbook: cLookbook, stories: cStories }),
    [cMedia, cProducts, cLookbook, cStories]
  )
  const [previewMedia, setPreviewMedia] = useState<any | null>(null)
  const [mediaTypeFilter, setMediaTypeFilter] = useState("ALL")
  const [mediaSourceFilter, setMediaSourceFilter] = useState("ALL")
  const [openGenericMediaPicker, setOpenGenericMediaPicker] = useState(false)
  const [genericMediaField, setGenericMediaField] = useState<string | null>(null)

  // Customer & Staff Support States (Reset Password & Detail Drawer)
  const [resetPasswordUser, setResetPasswordUser] = useState<Row | null>(null)
  const [newPasswordValue, setNewPasswordValue] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(true)
  const [copiedPassword, setCopiedPassword] = useState(false)
  const [viewingCustomer, setViewingCustomer] = useState<Row | null>(null)

  const generateRandomPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
    let pass = "";
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPasswordValue(pass);
    setCopiedPassword(false);
  };

  const handleCopyPassword = () => {
    if (!newPasswordValue) return;
    navigator.clipboard.writeText(newPasswordValue);
    setCopiedPassword(true);
    toast.success("Đã sao chép mật khẩu vào bộ nhớ tạm!");
    setTimeout(() => setCopiedPassword(false), 2000);
  };

  const handleConfirmResetPassword = async () => {
    if (!resetPasswordUser?.id) return;
    if (!newPasswordValue || newPasswordValue.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }
    try {
      await d.updateUser(resetPasswordUser.id, { password: newPasswordValue });
      toast.success(`Đã đổi mật khẩu cho ${resetPasswordUser.name || resetPasswordUser.email} thành công!`);
      setResetPasswordUser(null);
      setNewPasswordValue("");
    } catch (err: any) {
      toast.error(err.message || "Đổi mật khẩu thất bại!");
    }
  };

  if (section === 'messages') {
    return <MessagesForm d={d} />
  }

  let rows: Row[] = []
  if (section === "products") rows = d.products || []
  if (section === "categories") rows = d.categories || []
  if (section === "services") rows = d.services || []
  if (section === "training") rows = d.courses || []
  if (section === "merchandise-stories") rows = d.stories || []
  if (section === "lookbook") rows = d.lookbook || []
  if (section === "orders") rows = d.orders || []
  if (section === "media") rows = allMediaList
  if (section === "promo-codes") rows = d.promoCodes || []
  if (section === "faqs") rows = d.faqs || []
  if (section === "customers" || section === "staff") {
    const customerMap = new Map();
    (d.customers || []).forEach(c => {
      const key = (c.email || String(c.id)).toLowerCase().trim();
      customerMap.set(key, { ...c, totalOrders: 0, totalSpent: 0 });
    });

    (d.orders || []).forEach(o => {
      const emailKey = (o.customerEmail || o.customer?.email || (typeof o.shippingAddress === 'object' ? (o.shippingAddress as any)?.email : '') || '').toLowerCase().trim();
      const phone = o.customerPhone || o.customer?.phone || (typeof o.shippingAddress === 'object' ? (o.shippingAddress as any)?.phone : '') || '';
      const name = o.customerName || o.customer?.name || (typeof o.shippingAddress === 'object' ? (o.shippingAddress as any)?.fullName || (o.shippingAddress as any)?.name : '') || 'Khách vãng lai';
      
      const st = (o.status || '').toUpperCase();
      const ps = (o.paymentStatus || '').toUpperCase();

      // Chỉ tính vào Tổng chi tiêu nếu đơn đã hoàn thành hoặc đã thanh toán mà không bị hủy/hoàn tiền
      const isCountedSpent = (st === 'COMPLETED' || ps === 'PAID') && st !== 'CANCELLED' && ps !== 'REFUNDED';
      const orderAmount = isCountedSpent ? (Number(o.total) || 0) : 0;
      // Đơn hợp lệ (không tính đơn hủy)
      const isCountedOrder = st !== 'CANCELLED';

      let matched = false;
      if (emailKey && customerMap.has(emailKey)) {
        const c = customerMap.get(emailKey);
        if (isCountedOrder) c.totalOrders += 1;
        c.totalSpent += orderAmount;
        if (!c.phone && phone) c.phone = phone;
        matched = true;
      }
      if (!matched && o.userId) {
        for (const c of customerMap.values()) {
          if (c.id === o.userId) {
            if (isCountedOrder) c.totalOrders += 1;
            c.totalSpent += orderAmount;
            matched = true;
            break;
          }
        }
      }
      if (!matched && emailKey) {
        customerMap.set(emailKey, {
          id: `guest-${emailKey}`,
          email: emailKey,
          name: name,
          phone: phone,
          role: 'GUEST',
          createdAt: o.createdAt || new Date(),
          totalOrders: isCountedOrder ? 1 : 0,
          totalSpent: orderAmount,
        });
      }
    });
    
    if (section === "customers") {
      rows = Array.from(customerMap.values()).filter(c => {
        const role = (c.role || '').toUpperCase();
        return role === 'CUSTOMER' || role === 'GUEST' || role === 'USER' || (!role || (role !== 'ADMIN' && role !== 'STAFF' && role !== 'MANAGER' && role !== 'BARBER'));
      });
    } else {
      rows = Array.from(customerMap.values()).filter(c => {
        const role = (c.role || '').toUpperCase();
        return role === 'ADMIN' || role === 'STAFF' || role === 'MANAGER' || role === 'BARBER';
      });
    }
  }

  let filtered = rows.filter(r => {
    const text = String(r.title ?? r.name ?? r.code ?? r.email ?? r.phone ?? r.question ?? "").toLowerCase()
    let match = text.includes(search.toLowerCase())
    
    if (section === "products") {
      if (filterCategory !== "ALL" && getParentCategory(r.category, d.categories) !== filterCategory) match = false
      if (filterSubcategory !== "ALL" && r.category !== filterSubcategory) match = false
      if (filterStatus !== "ALL" && r.status !== filterStatus) match = false
      if (productStockFilter !== "ALL") {
        const variants = (r.variants && r.variants.length > 0) ? r.variants : [];
        const totalStock = variants.length > 0
          ? variants.reduce((acc: number, v: any) => acc + (Number(v.stock) || 0), 0)
          : (Number(r.stock) || 0);
        const hasZeroVariant = variants.some((v: any) => (Number(v.stock) || 0) === 0);
        const hasLowVariant = variants.some((v: any) => (Number(v.stock) || 0) < 5);

        if (productStockFilter === "IN_STOCK" && (totalStock <= 0 || hasZeroVariant)) match = false;
        if (productStockFilter === "HAS_OUT_OF_STOCK_VARIANT" && !hasZeroVariant && totalStock > 0) match = false;
        if (productStockFilter === "LOW_STOCK" && (totalStock <= 0 || (!hasLowVariant && totalStock > 10))) match = false;
        if (productStockFilter === "OUT_OF_STOCK" && totalStock > 0) match = false;
      }
    }

    if (section === "categories" && categoryParentTab !== "ALL" && r.parent !== categoryParentTab) match = false

    if (section === "customers") {
      const role = (r.role || '').toUpperCase();
      if (customerTypeFilter === "MEMBER" && role === "GUEST") match = false;
      if (customerTypeFilter === "GUEST" && role !== "GUEST") match = false;
      if (customerTypeFilter === "HAS_ORDERS" && (r.totalOrders || 0) === 0) match = false;
      if (customerTypeFilter === "NO_ORDERS" && (r.totalOrders || 0) > 0) match = false;

      const spent = Number(r.totalSpent) || 0;
      if (customerSpendingFilter === "OVER_500K" && spent < 500_000) match = false;
      if (customerSpendingFilter === "OVER_1M" && spent < 1_000_000) match = false;
      if (customerSpendingFilter === "OVER_5M" && spent < 5_000_000) match = false;
      if (customerSpendingFilter === "ZERO" && spent > 0) match = false;
    }

    if (section === "staff") {
      const role = (r.role || '').toUpperCase();
      if (staffRoleFilter !== "ALL" && role !== staffRoleFilter) match = false;
    }

    if (section === "promo-codes") {
      if (promoTypeFilter !== "ALL" && r.discountType !== promoTypeFilter) match = false;
      const isExpired = r.expiresAt && new Date(r.expiresAt) < new Date();
      if (promoStatusFilter === "ACTIVE" && (!r.isActive || isExpired)) match = false;
      if (promoStatusFilter === "EXPIRED" && !isExpired) match = false;
      if (promoStatusFilter === "DISABLED" && r.isActive) match = false;
    }

    if (section === "faqs") {
      if (faqCategoryFilter !== "ALL" && r.category !== faqCategoryFilter) match = false;
    }

    if (section === "media") {
      if (mediaTypeFilter !== "ALL" && r.type !== mediaTypeFilter) match = false;
      if (mediaSourceFilter !== "ALL" && !String(r.source || '').toLowerCase().includes(mediaSourceFilter.toLowerCase())) match = false;
    }
    
    return match
  })

  // Sắp xếp
  if (section === "products") {
    filtered = [...filtered].sort((a, b) => {
      return new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime()
    })
  }

  if (section === "customers") {
    filtered = [...filtered].sort((a, b) => {
      if (customerSort === "SPENT_DESC") return (Number(b.totalSpent) || 0) - (Number(a.totalSpent) || 0);
      if (customerSort === "ORDERS_DESC") return (Number(b.totalOrders) || 0) - (Number(a.totalOrders) || 0);
      if (customerSort === "NAME_ASC") return String(a.name || '').localeCompare(String(b.name || ''));
      if (customerSort === "NEWEST") return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      return 0;
    })
  }

  if (section === "staff") {
    filtered = [...filtered].sort((a, b) => {
      if (staffSort === "NAME_ASC") return String(a.name || '').localeCompare(String(b.name || ''));
      if (staffSort === "NEWEST") return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      return 0;
    })
  }

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
    if (section === "promo-codes") await d.deletePromoCode(item.id)
    if (section === "faqs") await d.deleteFaq(item.id)
    if (section === "customers" || section === "staff") await d.deleteUser(item.id)
    if (section === "media") await d.deleteMedia(item.id)
    setItemToDelete(null)
  }

  const handleSaveGeneric = async () => {
    if (section === "customers" || section === "staff") {
      if (editingItem?.id) {
        await d.updateUser(editingItem.id, formData)
      } else {
        await d.createUser(formData)
      }
    } else if (section === "orders") {
      await d.updateOrderStatus(formData.id, { status: formData.status, paymentStatus: formData.paymentStatus })
    }
    if (section === "categories") await d.upsertCategory(formData as any)
    if (section === "services") {
      const payload = { ...formData };
      if (payload.price) payload.price = Number(payload.price);
      if (payload.duration) payload.duration = Number(payload.duration);
      if (typeof payload.process === 'string') {
        try { payload.process = JSON.parse(payload.process); } catch { payload.process = payload.process.split('\n').filter(Boolean); }
      }
      await d.upsertService(payload as any)
    }
    if (section === "training") {
      const payload = { ...formData };
      if (payload.price) payload.price = Number(payload.price);
      if (!payload.slug && payload.title) {
        payload.slug = payload.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/gi, "-").replace(/(^-|-$)+/g, "");
      }
      await d.upsertCourse(payload as any)
    }
    if (section === "merchandise-stories") {
      const payload = { ...formData };
      if (!payload.slug && payload.title) {
        payload.slug = payload.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/gi, "-").replace(/(^-|-$)+/g, "");
      }
      try { if (typeof payload.blocks === 'string') payload.blocks = JSON.parse(payload.blocks); } catch {}
      try { if (typeof payload.gallery === 'string') payload.gallery = JSON.parse(payload.gallery); } catch {}
      await d.upsertStory(payload as any)
    }
    if (section === "lookbook") {
      const payload = { ...formData };
      if (payload.caption && !payload.title) payload.title = payload.caption;
      await d.upsertLookbook(payload as any)
    }
    if (section === "promo-codes") await d.upsertPromoCode(formData as any)
    if (section === "faqs") await d.upsertFaq(formData as any)
    if (section === "media") await d.addMedia(formData as any)
    setModalOpen(false)
  }

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  if (section === "settings") {
    return (
      <SettingsForm />
    )
  }

  const paginatedRows = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div>
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Quản trị nội dung</p>
          <h1 className="mt-2 font-display text-4xl font-bold uppercase">{labels[section] ?? section}</h1>
        </div>
        {section !== "settings" && section !== "orders" && section !== "media" && (
          <Button onClick={handleAdd} className="w-full sm:w-auto"><Plus className="mr-2 size-4" />Thêm mới</Button>
        )}
        {section === "media" && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-sm font-semibold cursor-pointer transition-colors shadow-sm w-full sm:w-auto">
              <UploadCloud className="size-4" />
              Tải lên tệp Media từ máy
              <input 
                type="file" 
                multiple 
                accept="image/*,video/*" 
                className="hidden" 
                onChange={async (e) => {
                  const files = Array.from(e.target.files ?? []);
                  if (!files.length) return;
                  const token = useAuthStore.getState().session?.token;
                  toast.info(`Đang tải lên ${files.length} tệp...`);
                  for (const file of files) {
                    try {
                      const fd = new FormData();
                      fd.append("image", file);
                      const res = await fetch("/api/upload/image", {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}` },
                        body: fd,
                      });
                      if (res.ok) {
                        const data = await res.json();
                        await d.addMedia({
                          url: data.url,
                          name: file.name,
                          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                          type: file.type.startsWith("video") ? "video" : "image",
                        });
                      }
                    } catch (err) {
                      console.error(err);
                    }
                  }
                  toast.success(`Đã tải lên và lưu ${files.length} tệp thành công!`);
                  e.target.value = "";
                }} 
              />
            </label>
          </div>
        )}
      </header>

      {section === "categories" && (
        <div className="mt-6 flex gap-2 border-b">
          {[{ value: "ALL", label: "Tất cả" }, ...PRODUCT_CATEGORY_PARENTS].map(tab => (
            <button key={tab.value} type="button" onClick={() => { setCategoryParentTab(tab.value); setPage(1) }} className={`border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${categoryParentTab === tab.value ? "border-primary text-primary" : "border-transparent text-neutral-500 hover:text-neutral-900"}`}>
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8 border bg-white max-w-full overflow-hidden">
        {/* Bộ lọc thanh công cụ (Toolbar Filters) */}
        <div className="flex flex-wrap items-center gap-3 border-b p-4 bg-white/50">
          <div className="relative w-full sm:max-w-xs flex items-center">
            <Search className="absolute left-3 size-4 text-neutral-400" />
            <input 
              placeholder={section === "customers" ? "Tìm theo tên, email, sđt..." : section === "staff" ? "Tìm theo tên, email..." : section === "media" ? "Tìm kiếm tệp media..." : "Tìm kiếm..."} 
              className="flex-1 h-9 outline-none pl-9 border border-neutral-200 rounded-md text-sm focus:border-primary" 
              value={search} 
              onChange={e => { setSearch(e.target.value); setPage(1); }} 
            />
          </div>

          {/* Bộ lọc riêng cho Media */}
          {section === "media" && (
            <>
              <select 
                value={mediaTypeFilter} 
                onChange={e => { setMediaTypeFilter(e.target.value); setPage(1); }} 
                className="h-9 border border-neutral-200 rounded-md bg-neutral-50 px-3 text-sm focus:outline-none focus:border-primary cursor-pointer text-neutral-700"
              >
                <option value="ALL">Tất cả định dạng ({allMediaList.length})</option>
                <option value="image">Chỉ hình ảnh ({allMediaList.filter(m => m.type !== 'video').length})</option>
                <option value="video">Chỉ video ({allMediaList.filter(m => m.type === 'video').length})</option>
              </select>

              <select 
                value={mediaSourceFilter} 
                onChange={e => { setMediaSourceFilter(e.target.value); setPage(1); }} 
                className="h-9 border border-neutral-200 rounded-md bg-neutral-50 px-3 text-sm focus:outline-none focus:border-primary cursor-pointer text-neutral-700"
              >
                <option value="ALL">Tất cả nguồn tải</option>
                <option value="Thư viện">Thư viện Media</option>
                <option value="Sản phẩm">Sản phẩm</option>
                <option value="Lookbook">Lookbook</option>
                <option value="Câu chuyện">Stories</option>
              </select>

              {(mediaTypeFilter !== "ALL" || mediaSourceFilter !== "ALL" || search) && (
                <button onClick={() => { setSearch(""); setMediaTypeFilter("ALL"); setMediaSourceFilter("ALL"); }} className="text-xs text-primary hover:underline px-2">Xóa lọc</button>
              )}
            </>
          )}

          {/* Bộ lọc riêng cho Sản phẩm */}
          {section === "products" && (
            <>
              <select value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setFilterSubcategory("ALL"); setPage(1); }} className="h-9 border border-neutral-200 rounded-md bg-neutral-50 px-3 text-sm focus:outline-none focus:border-primary cursor-pointer text-neutral-700">
                <option value="ALL">Tất cả nhóm ngành</option>
                {PRODUCT_CATEGORY_PARENTS.map(category => <option key={category.value} value={category.value}>{category.label}</option>)}
              </select>
              {filterCategory !== "ALL" && <select value={filterSubcategory} onChange={e => { setFilterSubcategory(e.target.value); setPage(1); }} className="h-9 border border-neutral-200 rounded-md bg-neutral-50 px-3 text-sm focus:outline-none focus:border-primary cursor-pointer text-neutral-700">
                <option value="ALL">Tất cả danh mục con</option>
                {productSubcategories.map(category => <option key={category.id} value={category.slug}>{category.name}</option>)}
              </select>}
              <select value={productStockFilter} onChange={e => { setProductStockFilter(e.target.value); setPage(1); }} className="h-9 border border-neutral-200 rounded-md bg-neutral-50 px-3 text-sm focus:outline-none focus:border-primary cursor-pointer text-neutral-700">
                <option value="ALL">Tất cả tồn kho</option>
                <option value="IN_STOCK">Còn hàng (Đủ loại)</option>
                <option value="HAS_OUT_OF_STOCK_VARIANT">Có loại hết hàng (0 SP)</option>
                <option value="LOW_STOCK">Sắp hết hàng (≤ 10 hoặc biến thể &lt; 5)</option>
                <option value="OUT_OF_STOCK">Hết hàng toàn bộ (0)</option>
              </select>
              <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }} className="h-9 border border-neutral-200 rounded-md bg-neutral-50 px-3 text-sm focus:outline-none focus:border-primary cursor-pointer text-neutral-700">
                <option value="ALL">Tất cả trạng thái</option>
                <option value="active">Đang bán</option>
                <option value="draft">Bản nháp</option>
                <option value="archived">Lưu trữ</option>
              </select>
              {(filterCategory !== "ALL" || filterSubcategory !== "ALL" || filterStatus !== "ALL" || productStockFilter !== "ALL" || search) && (
                <button onClick={() => { setSearch(""); setFilterCategory("ALL"); setFilterSubcategory("ALL"); setFilterStatus("ALL"); setProductStockFilter("ALL"); }} className="text-xs text-primary hover:underline px-2">Xóa lọc</button>
              )}
            </>
          )}

          {/* Bộ lọc nâng cao cho Khách hàng */}
          {section === "customers" && (
            <>
              <select value={customerTypeFilter} onChange={e => { setCustomerTypeFilter(e.target.value); setPage(1); }} className="h-9 border border-neutral-200 rounded-md bg-neutral-50 px-3 text-sm focus:outline-none focus:border-primary cursor-pointer text-neutral-700">
                <option value="ALL">Tất cả loại khách</option>
                <option value="MEMBER">Thành viên có tài khoản</option>
                <option value="GUEST">Khách mua vãng lai</option>
                <option value="HAS_ORDERS">Đã từng mua hàng</option>
                <option value="NO_ORDERS">Chưa mua hàng</option>
              </select>
              <select value={customerSpendingFilter} onChange={e => { setCustomerSpendingFilter(e.target.value); setPage(1); }} className="h-9 border border-neutral-200 rounded-md bg-neutral-50 px-3 text-sm focus:outline-none focus:border-primary cursor-pointer text-neutral-700">
                <option value="ALL">Tất cả mức chi tiêu</option>
                <option value="OVER_500K">Chi tiêu &gt; 500.000đ</option>
                <option value="OVER_1M">Chi tiêu &gt; 1.000.000đ</option>
                <option value="OVER_5M">Chi tiêu VIP (&gt; 5.000.000đ)</option>
                <option value="ZERO">Chưa chi tiêu (0đ)</option>
              </select>
              <select value={customerSort} onChange={e => setCustomerSort(e.target.value)} className="h-9 border border-neutral-200 rounded-md bg-neutral-50 px-3 text-sm focus:outline-none focus:border-primary cursor-pointer text-neutral-700">
                <option value="NEWEST">Ngày tham gia mới nhất</option>
                <option value="SPENT_DESC">Chi tiêu cao nhất</option>
                <option value="ORDERS_DESC">Nhiều đơn hàng nhất</option>
                <option value="NAME_ASC">Tên (A-Z)</option>
              </select>
              {(customerTypeFilter !== "ALL" || customerSpendingFilter !== "ALL" || customerSort !== "NEWEST" || search) && (
                <button onClick={() => { setSearch(""); setCustomerTypeFilter("ALL"); setCustomerSpendingFilter("ALL"); setCustomerSort("NEWEST"); }} className="text-xs text-primary hover:underline px-2">Xóa lọc</button>
              )}
            </>
          )}

          {/* Bộ lọc nâng cao cho Nhân viên */}
          {section === "staff" && (
            <>
              <select value={staffRoleFilter} onChange={e => { setStaffRoleFilter(e.target.value); setPage(1); }} className="h-9 border border-neutral-200 rounded-md bg-neutral-50 px-3 text-sm focus:outline-none focus:border-primary cursor-pointer text-neutral-700">
                <option value="ALL">Tất cả vai trò</option>
                <option value="ADMIN">Quản trị viên (ADMIN)</option>
                <option value="MANAGER">Quản lý cửa hàng</option>
                <option value="BARBER">Thợ cắt tóc (Barber)</option>
                <option value="STAFF">Nhân viên hỗ trợ</option>
              </select>
              <select value={staffSort} onChange={e => setStaffSort(e.target.value)} className="h-9 border border-neutral-200 rounded-md bg-neutral-50 px-3 text-sm focus:outline-none focus:border-primary cursor-pointer text-neutral-700">
                <option value="NEWEST">Ngày tạo mới nhất</option>
                <option value="NAME_ASC">Tên (A-Z)</option>
              </select>
              {(staffRoleFilter !== "ALL" || staffSort !== "NEWEST" || search) && (
                <button onClick={() => { setSearch(""); setStaffRoleFilter("ALL"); setStaffSort("NEWEST"); }} className="text-xs text-primary hover:underline px-2">Xóa lọc</button>
              )}
            </>
          )}

          {/* Bộ lọc nâng cao cho Mã giảm giá */}
          {section === "promo-codes" && (
            <>
              <select value={promoTypeFilter} onChange={e => { setPromoTypeFilter(e.target.value); setPage(1); }} className="h-9 border border-neutral-200 rounded-md bg-neutral-50 px-3 text-sm focus:outline-none focus:border-primary cursor-pointer text-neutral-700">
                <option value="ALL">Tất cả loại giảm</option>
                <option value="PERCENT">Phần trăm (%)</option>
                <option value="FIXED">Số tiền (VNĐ)</option>
              </select>
              <select value={promoStatusFilter} onChange={e => { setPromoStatusFilter(e.target.value); setPage(1); }} className="h-9 border border-neutral-200 rounded-md bg-neutral-50 px-3 text-sm focus:outline-none focus:border-primary cursor-pointer text-neutral-700">
                <option value="ALL">Tất cả trạng thái</option>
                <option value="ACTIVE">Đang hiệu lực</option>
                <option value="EXPIRED">Đã hết hạn</option>
                <option value="DISABLED">Đang khóa</option>
              </select>
              {(promoTypeFilter !== "ALL" || promoStatusFilter !== "ALL" || search) && (
                <button onClick={() => { setSearch(""); setPromoTypeFilter("ALL"); setPromoStatusFilter("ALL"); }} className="text-xs text-primary hover:underline px-2">Xóa lọc</button>
              )}
            </>
          )}

          {/* Bộ lọc cho FAQ */}
          {section === "faqs" && (
            <>
              <select value={faqCategoryFilter} onChange={e => { setFaqCategoryFilter(e.target.value); setPage(1); }} className="h-9 border border-neutral-200 rounded-md bg-neutral-50 px-3 text-sm focus:outline-none focus:border-primary cursor-pointer text-neutral-700">
                <option value="ALL">Tất cả chuyên mục</option>
                <option value="shop">Cửa hàng</option>
                <option value="service">Dịch vụ</option>
                <option value="training">Đào tạo</option>
              </select>
              {(faqCategoryFilter !== "ALL" || search) && (
                <button onClick={() => { setSearch(""); setFaqCategoryFilter("ALL"); }} className="text-xs text-primary hover:underline px-2">Xóa lọc</button>
              )}
            </>
          )}
        </div>

        {section === "media" ? (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Hiển thị {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1} - {Math.min(page * pageSize, filtered.length)} trên tổng số {filtered.length} tệp media {filtered.length > pageSize && `(Trang ${page}/${Math.ceil(filtered.length / pageSize)})`}
              </div>
            </div>

            {paginatedRows.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {paginatedRows.map((r, i) => (
                  <div 
                    key={String(r.id ?? i)} 
                    className="group relative flex flex-col rounded-xl overflow-hidden bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="relative aspect-square bg-neutral-100 overflow-hidden cursor-pointer" onClick={() => setPreviewMedia(r)}>
                      <MediaThumbnail src={String(r.url)} alt={String(r.name || "Media")} type={r.type} className="transition-transform group-hover:scale-105" />

                      {/* Source Badge */}
                      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded text-[10px] font-medium max-w-[80%] truncate">
                        {r.source || "Media"}
                      </div>

                      {/* Action Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setPreviewMedia(r); }} 
                          className="bg-white/20 hover:bg-white text-white hover:text-neutral-900 p-2 rounded-full backdrop-blur-md transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="size-4" />
                        </button>
                        <button 
                          type="button"
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            navigator.clipboard.writeText(r.url); 
                            toast.success("Đã copy link tệp media vào bộ nhớ tạm!"); 
                          }} 
                          className="bg-white/20 hover:bg-white text-white hover:text-neutral-900 p-2 rounded-full backdrop-blur-md transition-colors"
                          title="Sao chép link URL"
                        >
                          <Copy className="size-4" />
                        </button>
                        {r.isDatabase && (
                          <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setItemToDelete(r); }} 
                            className="bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                            title="Xóa tệp khỏi thư viện"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="p-2.5 bg-white border-t space-y-0.5">
                      <div className="text-xs font-bold text-neutral-800 truncate" title={r.name}>{r.name}</div>
                      <div className="flex items-center justify-between text-[10px] text-neutral-400">
                        <span>{r.type === 'video' ? 'Video' : 'Hình ảnh'}</span>
                        <span>{r.size}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-neutral-400 text-sm">
                Không tìm thấy tệp media nào phù hợp với bộ lọc.
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-neutral-50 text-xs uppercase text-neutral-500 border-b">
              {section === "customers" ? (
                <tr>
                  <th className="p-4 font-semibold">Khách hàng</th>
                  <th className="font-semibold">Liên hệ</th>
                  <th className="font-semibold text-center">Đơn hàng</th>
                  <th className="font-semibold">Tổng chi tiêu</th>
                  <th className="font-semibold">Ngày tham gia</th>
                  <th className="text-right pr-4">Thao tác</th>
                </tr>
              ) : section === "staff" ? (
                <tr>
                  <th className="p-4 font-semibold">Nhân viên</th>
                  <th className="font-semibold">Liên hệ</th>
                  <th className="font-semibold">Vai trò</th>
                  <th className="font-semibold">Ngày tạo</th>
                  <th className="text-right pr-4">Thao tác</th>
                </tr>
              ) : section === "promo-codes" ? (
                <tr>
                  <th className="p-4">Mã giảm giá</th>
                  <th>Điều kiện</th>
                  <th>Thời hạn (TTL)</th>
                  <th>Trạng thái</th>
                  <th className="text-right pr-4">Thao tác</th>
                </tr>
              ) : section === "faqs" ? (
                <tr>
                  <th className="p-4 w-16 text-center">STT</th>
                  <th>Câu hỏi & Trả lời</th>
                  <th className="w-32">Danh mục</th>
                  <th className="w-16 text-right pr-4">Thao tác</th>
                </tr>
              ) : section === "lookbook" ? (
                <tr>
                  <th className="p-4">Tác phẩm Lookbook</th>
                  <th>Phong cách / Nhóm</th>
                  <th>Ngày đăng</th>
                  <th className="text-right pr-4">Thao tác</th>
                </tr>
              ) : section === "services" ? (
                <tr>
                  <th className="p-4">Dịch vụ</th>
                  <th>Phân nhóm</th>
                  <th>Thời lượng</th>
                  <th>Quy trình</th>
                  <th>Giá niêm yết</th>
                  <th className="text-right pr-4">Thao tác</th>
                </tr>
              ) : section === "training" ? (
                <tr>
                  <th className="p-4">Khóa học</th>
                  <th>Thời lượng</th>
                  <th>Khai giảng</th>
                  <th>Học phí</th>
                  <th>Trạng thái</th>
                  <th className="text-right pr-4">Thao tác</th>
                </tr>
              ) : section === "categories" ? (
                <tr>
                  <th className="p-4">Tên danh mục</th>
                  <th>Đường dẫn (Slug)</th>
                  <th>Mô tả</th>
                  <th>Số lượng SP</th>
                  <th className="text-right pr-4">Thao tác</th>
                </tr>
              ) : section === "merchandise-stories" ? (
                <tr>
                  <th className="p-4">Câu chuyện sản phẩm</th>
                  <th>Đường dẫn (Slug)</th>
                  <th>Nội dung</th>
                  <th>Trạng thái</th>
                  <th>Ngày đăng</th>
                  <th className="text-right pr-4">Thao tác</th>
                </tr>
              ) : section === "products" ? (
                <tr>
                  <th className="p-4">Sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Giá bán</th>
                  <th>Tồn kho</th>
                  <th>Trạng thái</th>
                  <th className="text-right pr-4">Thao tác</th>
                </tr>
              ) : section === "orders" ? (
                <tr>
                  <th className="p-4">Mã đơn hàng</th>
                  <th>Khách hàng</th>
                  <th>Phương thức</th>
                  <th>Trạng thái đơn</th>
                  <th>Thanh toán</th>
                  <th>Tổng tiền</th>
                  <th className="text-right pr-4">Thao tác</th>
                </tr>
              ) : (
                <tr>
                  <th className="p-4">Tên / Mã</th>
                  <th>Phân loại</th>
                  <th>Trạng thái</th>
                  <th>Giá trị</th>
                  <th className="text-right pr-4">Thao tác</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-border/40">
              {paginatedRows.length ? paginatedRows.map((r, i) => (
                <tr key={String(r.id ?? i)} className="border-t hover:bg-neutral-50/60 transition-colors">
                  {section === "customers" ? (
                    <>
                      <td className="p-4 font-medium">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-200">
                            {String(r.name || r.email || "K").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-neutral-900">{r.name || "Khách hàng"}</div>
                            <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${r.role === 'GUEST' ? 'bg-neutral-100 text-neutral-600' : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'}`}>
                              {r.role === 'GUEST' ? 'Khách vãng lai' : 'Thành viên'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 space-y-1">
                        <div className="text-sm font-medium text-neutral-800">{r.email}</div>
                        <div className="text-xs text-neutral-500">{r.phone || <span className="italic text-neutral-400">Chưa cập nhật SĐT</span>}</div>
                      </td>
                      <td className="text-center py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${r.totalOrders > 0 ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-neutral-100 text-neutral-500'}`}>
                          {r.totalOrders} đơn
                        </span>
                      </td>
                      <td className="py-3 font-bold text-emerald-600">
                        {formatCurrency(r.totalSpent || 0)}
                      </td>
                      <td className="py-3 text-xs text-neutral-500">
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString("vi-VN") : "—"}
                      </td>
                      <td className="py-3 text-right pr-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger aria-label="Tác vụ" className="p-2 hover:bg-neutral-200/60 rounded-full outline-none">
                            <MoreHorizontal className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52">
                            <DropdownMenuItem onClick={() => setViewingCustomer(r)}>
                              <Eye className="mr-2 size-4 text-neutral-500" /> Xem hồ sơ & Đơn hàng
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(r)}>
                              <Edit className="mr-2 size-4 text-neutral-500" /> Chỉnh sửa thông tin
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setResetPasswordUser(r); setNewPasswordValue(""); setCopiedPassword(false); }}>
                              <KeyRound className="mr-2 size-4 text-amber-600" /> Đặt lại mật khẩu
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setItemToDelete(r)} variant="destructive">
                              <Trash2 className="mr-2 size-4" /> Xóa tài khoản
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </>
                  ) : section === "staff" ? (
                    <>
                      <td className="p-4 font-medium">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                            {String(r.name || r.email || "S").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-neutral-900">{r.name || "Nhân viên"}</div>
                            <div className="text-xs text-neutral-400 font-mono">ID: #{r.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 space-y-1">
                        <div className="text-sm font-medium text-neutral-800">{r.email}</div>
                        <div className="text-xs text-neutral-500">{r.phone || <span className="italic text-neutral-400">Chưa có SĐT</span>}</div>
                      </td>
                      <td className="py-3">
                        <span className={`px-2.5 py-1 text-xs font-bold uppercase rounded-md border ${
                          r.role === "ADMIN" ? "bg-purple-50 text-purple-700 border-purple-200" :
                          r.role === "MANAGER" ? "bg-blue-50 text-blue-700 border-blue-200" :
                          r.role === "BARBER" ? "bg-amber-50 text-amber-700 border-amber-200" :
                          "bg-neutral-100 text-neutral-700 border-neutral-200"
                        }`}>
                          {r.role === "ADMIN" ? "Quản trị viên" : r.role === "MANAGER" ? "Quản lý" : r.role === "BARBER" ? "Thợ Barber" : "Nhân viên"}
                        </span>
                      </td>
                      <td className="py-3 text-xs text-neutral-500">
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString("vi-VN") : "—"}
                      </td>
                      <td className="py-3 text-right pr-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger aria-label="Tác vụ" className="p-2 hover:bg-neutral-200/60 rounded-full outline-none">
                            <MoreHorizontal className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52">
                            <DropdownMenuItem onClick={() => handleEdit(r)}>
                              <Edit className="mr-2 size-4 text-neutral-500" /> Chỉnh sửa & Phân quyền
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setResetPasswordUser(r); setNewPasswordValue(""); setCopiedPassword(false); }}>
                              <KeyRound className="mr-2 size-4 text-amber-600" /> Đặt lại mật khẩu
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setItemToDelete(r)} variant="destructive">
                              <Trash2 className="mr-2 size-4" /> Xóa nhân viên
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </>
                  ) : section === "promo-codes" ? (
                    <>
                      <td className="p-4 font-medium">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-base">{r.code}</span>
                          <span className="text-xs text-neutral-500">{r.discountType === "PERCENT" ? `Giảm ${r.discountValue}%` : `Giảm ${formatCurrency(r.discountValue)}`}</span>
                        </div>
                      </td>
                      <td className="text-sm text-neutral-600 space-y-1 py-3">
                        <div>Đơn tối thiểu: {formatCurrency(r.minOrderValue)}</div>
                        {r.maxDiscount ? <div>Giảm tối đa: {formatCurrency(r.maxDiscount)}</div> : null}
                        <div className="text-xs text-neutral-400">Lượt dùng: {r.usedCount} / {r.usageLimit ?? "Không giới hạn"}</div>
                      </td>
                      <td className="text-sm">
                        {r.expiresAt ? (
                          <div className="flex flex-col gap-1">
                            <span>{new Date(r.expiresAt).toLocaleDateString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" })}</span>
                            {new Date(r.expiresAt) > new Date() ? (
                              <span className="text-xs text-emerald-600 font-medium">Còn {Math.ceil((new Date(r.expiresAt).getTime() - new Date().getTime()) / (1000 * 3600 * 24))} ngày</span>
                            ) : (
                              <span className="text-xs text-red-600 font-medium">Đã hết hạn</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-neutral-500">Không thời hạn</span>
                        )}
                      </td>
                      <td>
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${!r.isActive ? "bg-neutral-100 text-neutral-500" : (r.expiresAt && new Date(r.expiresAt) < new Date() ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700")}`}>
                          {!r.isActive ? "Bị khóa" : (r.expiresAt && new Date(r.expiresAt) < new Date() ? "Hết hạn" : "Hoạt động")}
                        </span>
                      </td>
                      <td className="text-right pr-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger aria-label="Tác vụ" className="p-2 hover:bg-neutral-100 rounded-full outline-none">
                            <MoreHorizontal className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(r)}>
                              <Edit className="mr-2 size-4" /> Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setItemToDelete(r)} variant="destructive">
                              <Trash2 className="mr-2 size-4" /> Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </>
                  ) : section === "faqs" ? (
                    <>
                      <td className="p-4 font-medium text-center text-neutral-500">{r.order ?? "—"}</td>
                      <td className="py-3 pr-4">
                        <div className="font-bold text-base text-neutral-900 mb-1">{r.question || "Chưa có câu hỏi"}</div>
                        <div className="text-sm text-neutral-600 line-clamp-2">{r.answer || "Chưa có câu trả lời"}</div>
                      </td>
                      <td>
                        <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${
                          r.category === "shop" ? "bg-amber-100 text-amber-800" :
                          r.category === "service" ? "bg-purple-100 text-purple-800" :
                          r.category === "training" ? "bg-blue-100 text-blue-800" : "bg-neutral-100 text-neutral-600"
                        }`}>
                          {r.category === "shop" ? "Cửa hàng" : r.category === "service" ? "Dịch vụ" : r.category === "training" ? "Đào tạo" : r.category}
                        </span>
                      </td>
                      <td className="text-right pr-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger aria-label="Tác vụ" className="p-2 hover:bg-neutral-100 rounded-full outline-none">
                            <MoreHorizontal className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(r)}>
                              <Edit className="mr-2 size-4" /> Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setItemToDelete(r)} variant="destructive">
                              <Trash2 className="mr-2 size-4" /> Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </>
                  ) : section === "lookbook" ? (
                    <>
                      <td className="p-4 font-medium">
                        <div className="flex items-center gap-3">
                          {r.image && (
                            <div className="relative size-12 shrink-0 bg-neutral-100 overflow-hidden rounded-lg border">
                              <MediaThumbnail src={r.image} alt={r.title} />
                            </div>
                          )}
                          <div className="font-bold text-neutral-900">{r.title || "Tác phẩm Lookbook"}</div>
                        </div>
                      </td>
                      <td>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200">
                          {r.category || "Classic"}
                        </span>
                      </td>
                      <td className="text-xs text-neutral-500">
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString("vi-VN") : "—"}
                      </td>
                      <td className="text-right pr-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger aria-label="Tác vụ" className="p-2 hover:bg-neutral-100 rounded-full outline-none">
                            <MoreHorizontal className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(r)}>
                              <Edit className="mr-2 size-4" /> Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setItemToDelete(r)} variant="destructive">
                              <Trash2 className="mr-2 size-4" /> Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </>
                  ) : section === "services" ? (
                    <>
                      <td className="p-4 font-medium">
                        <div className="flex items-center gap-3">
                          {r.image && (
                            <div className="relative size-10 shrink-0 bg-neutral-100 overflow-hidden rounded-md border">
                              <MediaThumbnail src={r.image} alt={r.title} />
                            </div>
                          )}
                          <div className="font-bold text-neutral-900">{r.title || "Tên dịch vụ"}</div>
                        </div>
                      </td>
                      <td>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {r.category || "Dịch vụ tóc"}
                        </span>
                      </td>
                      <td className="text-sm font-semibold text-neutral-700">
                        {r.duration || 30} phút
                      </td>
                      <td className="text-xs text-neutral-500">
                        {Array.isArray(r.process) ? `${r.process.length} bước thực hiện` : typeof r.process === 'string' && r.process.trim() ? `${r.process.split('\n').filter(Boolean).length} bước thực hiện` : "Quy trình tiêu chuẩn"}
                      </td>
                      <td className="font-bold text-emerald-600">
                        {typeof r.price === "number" ? formatCurrency(r.price) : "—"}
                      </td>
                      <td className="text-right pr-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger aria-label="Tác vụ" className="p-2 hover:bg-neutral-100 rounded-full outline-none">
                            <MoreHorizontal className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(r)}>
                              <Edit className="mr-2 size-4" /> Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setItemToDelete(r)} variant="destructive">
                              <Trash2 className="mr-2 size-4" /> Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </>
                  ) : section === "training" ? (
                    <>
                      <td className="p-4 font-medium">
                        <div className="space-y-0.5">
                          <div className="font-bold text-neutral-900">{r.title || "Tên khóa học"}</div>
                          {r.excerpt && <div className="text-xs text-neutral-400 line-clamp-1">{r.excerpt}</div>}
                        </div>
                      </td>
                      <td className="text-sm font-medium text-neutral-700">{r.duration || "—"}</td>
                      <td className="text-xs text-neutral-600 font-medium">
                        {r.startDate || <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Liên tục mở lớp</span>}
                      </td>
                      <td className="font-bold text-emerald-600">
                        {typeof r.price === "number" ? formatCurrency(r.price) : "—"}
                      </td>
                      <td>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded ${r.status === 'published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-neutral-100 text-neutral-600'}`}>
                          {r.status === 'published' ? 'Đang mở lớp' : 'Tạm dừng'}
                        </span>
                      </td>
                      <td className="text-right pr-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger aria-label="Tác vụ" className="p-2 hover:bg-neutral-100 rounded-full outline-none">
                            <MoreHorizontal className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(r)}>
                              <Edit className="mr-2 size-4" /> Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setItemToDelete(r)} variant="destructive">
                              <Trash2 className="mr-2 size-4" /> Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </>
                  ) : section === "categories" ? (
                    <>
                      <td className="p-4 font-medium">
                        <div className="font-bold text-neutral-900">{r.title || r.name || "Danh mục"}</div>
                      </td>
                      <td className="font-mono text-xs text-neutral-500">{r.slug || "—"}</td>
                      <td className="text-xs text-neutral-600 line-clamp-2 max-w-xs">{r.description || "—"}</td>
                      <td className="text-sm font-semibold text-neutral-700">
                        {r.productCount ?? 0} sản phẩm
                      </td>
                      <td className="text-right pr-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger aria-label="Tác vụ" className="p-2 hover:bg-neutral-100 rounded-full outline-none">
                            <MoreHorizontal className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(r)}>
                              <Edit className="mr-2 size-4" /> Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setItemToDelete(r)} variant="destructive">
                              <Trash2 className="mr-2 size-4" /> Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </>
                  ) : section === "merchandise-stories" ? (
                    <>
                      <td className="p-4 font-medium">
                        <div className="flex items-center gap-3">
                          {r.heroImage && (
                            <div className="relative size-12 shrink-0 bg-neutral-100 overflow-hidden rounded-lg border">
                              <MediaThumbnail src={r.heroImage} alt={r.title} />
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-neutral-900">{r.title || "Tiêu đề Story"}</div>
                            {r.subtitle && <div className="text-xs text-neutral-400">{r.subtitle}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="font-mono text-xs text-neutral-500">/{r.slug}</td>
                      <td className="text-xs text-neutral-600">
                        {Array.isArray(r.blocks) ? `${r.blocks.length} khối nội dung` : "—"}
                      </td>
                      <td>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded ${r.status === 'published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-neutral-100 text-neutral-600'}`}>
                          {r.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                        </span>
                      </td>
                      <td className="text-xs text-neutral-500">
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString("vi-VN") : "—"}
                      </td>
                      <td className="text-right pr-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger aria-label="Tác vụ" className="p-2 hover:bg-neutral-100 rounded-full outline-none">
                            <MoreHorizontal className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(r)}>
                              <Edit className="mr-2 size-4" /> Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setItemToDelete(r)} variant="destructive">
                              <Trash2 className="mr-2 size-4" /> Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </>
                  ) : section === "products" ? (
                    <>
                      <td className="p-4 font-medium">
                        <div className="flex items-center gap-3">
                          {(Array.isArray(r.images) && r.images[0]) && (
                            <div className="relative size-11 shrink-0 bg-neutral-100 overflow-hidden rounded-lg border">
                              <MediaThumbnail src={r.images[0]} alt={r.title} />
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-neutral-900">{r.title || "Tên sản phẩm"}</div>
                            {r.slug && <div className="text-[11px] text-neutral-400 font-mono">{r.slug}</div>}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${getParentCategory(r.category, d.categories) === 'grooming' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-blue-50 text-blue-800 border border-blue-200'}`}>
                          {getCategoryLabel(r.category, d.categories)}
                        </span>
                      </td>
                      <td className="font-bold text-emerald-600">
                        {typeof r.price === "number" ? formatCurrency(r.price) : typeof r.basePrice === "number" ? formatCurrency(r.basePrice) : "—"}
                      </td>
                      <td>
                        {(() => {
                          const variants = Array.isArray(r.variants) ? r.variants : [];
                          const totalStock = variants.length > 0
                            ? variants.reduce((acc: number, v: any) => acc + (Number(v.stock) || 0), 0)
                            : (Number(r.stock) || 0);
                          
                          const zeroVariants = variants.filter((v: any) => (Number(v.stock) || 0) === 0);
                          const lowVariants = variants.filter((v: any) => (Number(v.stock) || 0) > 0 && (Number(v.stock) || 0) < 5);

                          return (
                            <div className="flex flex-col items-start gap-1 py-1">
                              <span className={`px-2 py-0.5 text-xs font-semibold rounded ${totalStock > 10 ? 'bg-emerald-50 text-emerald-700' : totalStock > 0 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
                                {totalStock > 0 ? `Còn ${totalStock} SP` : 'Hết hàng'}
                              </span>
                              
                              {zeroVariants.length > 0 && (
                                <span 
                                  className="inline-flex items-center gap-1 text-[10px] text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded font-medium cursor-default"
                                  title={`Hết hàng (0 SP): ${zeroVariants.map((v: any) => v.name).join(', ')}`}
                                >
                                  ⚠️ {zeroVariants.length} loại hết hàng
                                </span>
                              )}

                              {zeroVariants.length === 0 && lowVariants.length > 0 && (
                                <span 
                                  className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-medium cursor-default"
                                  title={`Sắp hết (<5 SP): ${lowVariants.map((v: any) => `${v.name} (${v.stock})`).join(', ')}`}
                                >
                                  ⚡ {lowVariants.length} loại sắp hết
                                </span>
                              )}
                            </div>
                          );
                        })()}
                      </td>
                      <td>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded ${r.status === 'active' ? 'bg-emerald-50 text-emerald-700' : r.status === 'draft' ? 'bg-neutral-100 text-neutral-600' : 'bg-red-50 text-red-700'}`}>
                          {r.status === 'active' ? 'Đang bán' : r.status === 'draft' ? 'Bản nháp' : 'Lưu trữ'}
                        </span>
                      </td>
                      <td className="text-right pr-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger aria-label="Tác vụ" className="p-2 hover:bg-neutral-100 rounded-full outline-none">
                            <MoreHorizontal className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(r)}>
                              <Edit className="mr-2 size-4" /> Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setItemToDelete(r)} variant="destructive">
                              <Trash2 className="mr-2 size-4" /> Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </>
                  ) : section === "orders" ? (
                    <>
                      <td className="p-4 font-medium">
                        <div className="space-y-0.5">
                          <div className="font-bold text-neutral-900 font-mono">#{r.orderCode || r.id}</div>
                          <div className="text-xs text-neutral-400">{r.createdAt ? new Date(r.createdAt).toLocaleDateString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }) : "—"}</div>
                        </div>
                      </td>
                      <td className="py-3 space-y-0.5">
                        <div className="font-semibold text-neutral-900">{r.customer?.name || r.shippingAddress?.fullName || r.shippingAddress?.name || "Khách hàng"}</div>
                        <div className="text-xs text-neutral-500">{r.customer?.phone || r.shippingAddress?.phone || r.customer?.email || "—"}</div>
                      </td>
                      <td className="text-xs font-semibold uppercase text-neutral-600">
                        {r.paymentMethod || "COD"}
                      </td>
                      <td>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                          r.status === "COMPLETED" || r.status === "completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                          r.status === "SHIPPED" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                          r.status === "PROCESSING" ? "bg-purple-50 text-purple-700 border border-purple-200" :
                          r.status === "CANCELLED" ? "bg-red-50 text-red-700 border border-red-200" :
                          "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                          {r.status === "COMPLETED" || r.status === "completed" ? "Hoàn thành" :
                           r.status === "SHIPPED" ? "Đang giao" :
                           r.status === "PROCESSING" ? "Đang chuẩn bị" :
                           r.status === "CANCELLED" ? "Đã hủy" : "Chờ xử lý"}
                        </span>
                      </td>
                      <td>
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${r.paymentStatus === "PAID" ? "bg-emerald-100 text-emerald-800" : r.paymentStatus === "REFUNDED" ? "bg-purple-100 text-purple-800" : "bg-neutral-100 text-neutral-600"}`}>
                          {r.paymentStatus === "PAID" ? "Đã thanh toán" : r.paymentStatus === "REFUNDED" ? "Đã hoàn tiền" : "Chưa thanh toán"}
                        </span>
                      </td>
                      <td className="font-bold text-emerald-600">
                        {typeof r.total === "number" ? formatCurrency(r.total) : "—"}
                      </td>
                      <td className="text-right pr-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger aria-label="Tác vụ" className="p-2 hover:bg-neutral-100 rounded-full outline-none">
                            <MoreHorizontal className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(r)}>
                              <Edit className="mr-2 size-4" /> Cập nhật trạng thái
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-4 font-medium">
                        <div className="flex items-center gap-3">
                          {r.image && (
                            <div className="relative size-10 shrink-0 bg-neutral-100 overflow-hidden rounded-md border">
                              <MediaThumbnail src={r.image} alt="" />
                            </div>
                          )}
                          {String(r.title || r.name || `Bản ghi ${i + 1}`)}
                        </div>
                      </td>
                      <td>{String(r.category || r.type || "—")}</td>
                      <td>
                        <span className="px-2 py-0.5 text-xs font-semibold rounded bg-neutral-100 text-neutral-700">
                          {String(r.status || "Hoạt động")}
                        </span>
                      </td>
                      <td>{typeof r.price === "number" ? formatCurrency(r.price) : "—"}</td>
                      <td className="text-right pr-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger aria-label="Tác vụ" className="p-2 hover:bg-neutral-100 rounded-full outline-none">
                            <MoreHorizontal className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(r)}>
                              <Edit className="mr-2 size-4" /> Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setItemToDelete(r)} variant="destructive">
                              <Trash2 className="mr-2 size-4" /> Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </>
                  )}
                </tr>
              )) : (
                <tr><td colSpan={7} className="p-16 text-center text-neutral-400">Không tìm thấy dữ liệu phù hợp với bộ lọc.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        )}
        {/* Pagination controls */}
        {filtered.length > pageSize && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t p-4 text-sm text-neutral-500">
            <div>
              Hiển thị từ <span className="font-semibold text-neutral-800">{(page - 1) * pageSize + 1}</span> đến <span className="font-semibold text-neutral-800">{Math.min(page * pageSize, filtered.length)}</span> trong tổng số <span className="font-semibold text-neutral-800">{filtered.length}</span> bản ghi (Trang {page}/{Math.ceil(filtered.length / pageSize)})
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
              <div className="flex items-center px-2 text-xs font-semibold text-neutral-700 bg-neutral-100 rounded">
                {page} / {Math.ceil(filtered.length / pageSize)}
              </div>
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
        <DialogContent className={section === "products" ? "sm:max-w-4xl lg:max-w-5xl max-h-[90vh] overflow-y-auto overflow-x-hidden p-6" : "sm:max-w-[500px] max-h-[90vh] overflow-y-auto overflow-x-hidden p-6"}>
          <DialogHeader>
            <DialogTitle>{editingItem ? "Chỉnh sửa" : "Thêm mới"} {labels[section]?.toLowerCase()}</DialogTitle>
          </DialogHeader>

          {section === "products" ? (
            <ProductForm
              initial={editingItem ?? {}}
              onSave={async (product) => { if (await d.upsertProduct(product)) setModalOpen(false) }}
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
                    ) : key === "discountType" ? (
                      <select 
                        value={formData[key] || "PERCENT"} 
                        onChange={e => handleChange(key, e.target.value)}
                        className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="PERCENT">Phần trăm (%)</option>
                        <option value="FIXED">Số tiền cố định (VNĐ)</option>
                      </select>
                    ) : key === "url" || key === "image" || key === "heroImage" ? (
                      <div className="flex flex-col gap-2">
                        {formData[key] && (
                          <div className="relative h-36 w-full bg-neutral-100 rounded-md overflow-hidden border">
                            <MediaThumbnail src={formData[key]} alt="Preview" className="h-full w-full object-contain" />
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2 items-center">
                          <Input
                            value={formData[key] || ""}
                            onChange={e => handleChange(key, e.target.value)}
                            placeholder="Hoặc nhập URL trực tiếp..."
                            className="flex-1 min-w-[180px]"
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => { setGenericMediaField(key); setOpenGenericMediaPicker(true); }}
                            className="gap-1.5 bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 shrink-0 text-xs"
                          >
                            <Images className="size-3.5 text-emerald-600" />
                            Chọn từ Media
                          </Button>
                          <label className="flex h-10 px-3 shrink-0 items-center justify-center rounded-md border bg-neutral-100 hover:bg-neutral-200 cursor-pointer text-xs font-medium transition-colors">
                            <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (!file) return
                              try {
                                const token = useAuthStore.getState().session?.token
                                const fd = new FormData()
                                fd.append("image", file)
                                const res = await fetch("/api/upload/image", {
                                  method: "POST",
                                  headers: { Authorization: `Bearer ${token}` },
                                  body: fd
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
                              } catch { toast.error("Lỗi tải ảnh") }
                            }} />
                            Tải ảnh từ máy
                          </label>
                        </div>
                      </div>
                    ) : key === "size" && section === "media" ? (
                      <Input value={formData[key] || ""} disabled className="bg-neutral-50" />
                    ) : key === "category" && section === "services" ? (
                      <select 
                        value={formData[key] || "Tóc & tạo kiểu"} 
                        onChange={e => handleChange(key, e.target.value)}
                        className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="Tóc & tạo kiểu">Tóc & tạo kiểu</option>
                        <option value="Vệ sinh & chăm sóc">Vệ sinh & chăm sóc</option>
                        <option value="Râu & khăn nóng">Râu & khăn nóng</option>
                        <option value="Mấy gói combo">Mấy gói combo</option>
                        <option value="Tẩy & Nhuộm tóc">Tẩy & Nhuộm tóc</option>
                        <option value="Uốn tóc Textured">Uốn tóc Textured</option>
                      </select>
                    ) : key === "category" && section === "lookbook" ? (
                      <select 
                        value={formData[key] || "Classic"} 
                        onChange={e => handleChange(key, e.target.value)}
                        className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="Classic">Classic</option>
                        <option value="Modern">Modern</option>
                        <option value="Fade">Fade</option>
                        <option value="Shop">Không gian tiệm (Shop)</option>
                        <option value="Grooming">Grooming</option>
                        <option value="Coloring">Tẩy nhuộm</option>
                      </select>
                    ) : key === "category" && section === "faqs" ? (
                      <select 
                        value={formData[key] || "shop"} 
                        onChange={e => handleChange(key, e.target.value)}
                        className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="shop">Cửa hàng</option>
                        <option value="service">Dịch vụ</option>
                        <option value="training">Đào tạo</option>
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
                    ) : JSON_LIST_KEYS.includes(key) ? (
                      // UI Dynamic List thay vì textarea JSON thô
                      <div className="space-y-2">
                        {(Array.isArray(formData[key]) ? formData[key] : []).map((item: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="mt-2 shrink-0 text-xs font-bold text-neutral-400 w-5 text-right">{idx + 1}.</span>
                            <textarea
                              value={item}
                              rows={2}
                              onChange={e => {
                                const arr = [...(formData[key] || [])]
                                arr[idx] = e.target.value
                                handleChange(key, arr as any)
                              }}
                              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const arr = [...(formData[key] || [])]
                                arr.splice(idx, 1)
                                handleChange(key, arr as any)
                              }}
                              className="mt-2 text-red-400 hover:text-red-600 text-lg leading-none"
                            >×</button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => handleChange(key, [...(Array.isArray(formData[key]) ? formData[key] : []), ""] as any)}
                          className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium mt-1"
                        >
                          <span className="text-lg leading-none">+</span> Thêm mục
                        </button>
                        {(!formData[key] || formData[key].length === 0) && (
                          <p className="text-xs text-neutral-400 italic">Chưa có mục nào. Nhấn &quot;+&quot; để thêm.</p>
                        )}
                      </div>
                    ) : key === "manifesto" || key === "excerpt" || key === "description" || key === "message" || key === "answer" ? (
                      <textarea
                        value={typeof formData[key] === 'object' ? JSON.stringify(formData[key], null, 2) : (formData[key] || "")}
                        onChange={e => handleChange(key, e.target.value)}
                        className="w-full flex min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                      />
                    ) : key === "expiresAt" ? (
                      <Input
                        type="datetime-local"
                        value={formData[key] ? new Date(new Date(formData[key]).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0,16) : ""}
                        onChange={e => handleChange(key, e.target.value ? new Date(e.target.value).toISOString() : "")}
                      />
                    ) : key === "password" ? (
                      <div className="relative">
                        <Input
                          value={formData[key] || ""}
                          onChange={e => handleChange(key, e.target.value)}
                          type={showPassword ? "text" : "password"}
                          className="pr-10"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600">
                          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    ) : (
                      <Input
                        value={formData[key] || ""}
                        onChange={e => handleChange(key, typeof formData[key] === "number" ? Number(e.target.value) : e.target.value)}
                        type={typeof formData[key] === "number" ? "number" : "text"}
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

      {/* Modal Chi tiết Khách hàng & Lịch sử Đơn hàng */}
      {viewingCustomer && (
        <Dialog open={!!viewingCustomer} onOpenChange={(open) => !open && setViewingCustomer(null)}>
          <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-xl">
                <div className="size-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-200">
                  {String(viewingCustomer.name || viewingCustomer.email || "K").charAt(0).toUpperCase()}
                </div>
                <div>
                  <div>{viewingCustomer.name || "Khách hàng"}</div>
                  <div className="text-xs font-normal text-neutral-400">ID: #{viewingCustomer.id} • Thành viên từ {viewingCustomer.createdAt ? new Date(viewingCustomer.createdAt).toLocaleDateString("vi-VN") : "—"}</div>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-2">
              {/* Thống kê nhanh */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-neutral-50 border rounded-xl p-4">
                  <div className="text-xs text-neutral-500 font-medium">Tổng chi tiêu</div>
                  <div className="text-xl font-bold text-emerald-600 mt-1">{formatCurrency(viewingCustomer.totalSpent || 0)}</div>
                </div>
                <div className="bg-neutral-50 border rounded-xl p-4">
                  <div className="text-xs text-neutral-500 font-medium">Tổng đơn hàng</div>
                  <div className="text-xl font-bold text-neutral-900 mt-1">{viewingCustomer.totalOrders || 0} đơn</div>
                </div>
                <div className="bg-neutral-50 border rounded-xl p-4">
                  <div className="text-xs text-neutral-500 font-medium">Vai trò tài khoản</div>
                  <div className="text-sm font-bold text-neutral-900 mt-1.5 uppercase">{viewingCustomer.role || "CUSTOMER"}</div>
                </div>
              </div>

              {/* Thông tin liên hệ */}
              <div className="border rounded-xl p-4 bg-white space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Thông tin liên hệ & Hỗ trợ</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-lg border">
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="size-4 text-neutral-400 shrink-0" />
                      <span className="truncate">{viewingCustomer.email || "Chưa có email"}</span>
                    </div>
                    {viewingCustomer.email && (
                      <a href={`mailto:${viewingCustomer.email}`} className="text-xs text-primary hover:underline shrink-0 ml-2 font-medium">Gửi mail</a>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-lg border">
                    <div className="flex items-center gap-2 truncate">
                      <PhoneCall className="size-4 text-neutral-400 shrink-0" />
                      <span>{viewingCustomer.phone || <span className="italic text-neutral-400">Chưa có SĐT</span>}</span>
                    </div>
                    {viewingCustomer.phone && (
                      <a href={`tel:${viewingCustomer.phone}`} className="text-xs text-primary hover:underline shrink-0 ml-2 font-medium">Gọi điện</a>
                    )}
                  </div>
                </div>
              </div>

              {/* Lịch sử đơn hàng */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Lịch sử đơn hàng đã đặt</h3>
                  <span className="text-xs text-neutral-500">
                    {(d.orders || []).filter((o: any) => o.userId === viewingCustomer.id || o.customer?.email?.toLowerCase() === viewingCustomer.email?.toLowerCase()).length} đơn tìm thấy
                  </span>
                </div>

                <div className="border rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-neutral-50 text-neutral-500 border-b">
                      <tr>
                        <th className="p-3">Mã đơn</th>
                        <th>Ngày đặt</th>
                        <th>Trạng thái</th>
                        <th>Thanh toán</th>
                        <th className="text-right pr-3">Tổng tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {(d.orders || [])
                        .filter((o: any) => o.userId === viewingCustomer.id || o.customer?.email?.toLowerCase() === viewingCustomer.email?.toLowerCase())
                        .map((order: any) => (
                          <tr key={order.id} className="hover:bg-neutral-50/50">
                            <td className="p-3 font-bold font-mono">#{order.id}</td>
                            <td className="text-neutral-500">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</td>
                            <td>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                order.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700" :
                                order.status === "PENDING" ? "bg-amber-50 text-amber-700" :
                                order.status === "CANCELLED" ? "bg-red-50 text-red-700" : "bg-neutral-100 text-neutral-700"
                              }`}>
                                {order.status === "COMPLETED" ? "Đã giao" : order.status === "PENDING" ? "Chờ xử lý" : order.status === "SHIPPED" ? "Đang giao" : order.status === "CANCELLED" ? "Đã hủy" : order.status}
                              </span>
                            </td>
                            <td>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                (order.paymentStatus || '').toUpperCase() === "PAID" ? "bg-emerald-100 text-emerald-800" :
                                (order.paymentStatus || '').toUpperCase() === "REFUNDED" ? "bg-purple-100 text-purple-800" :
                                "bg-neutral-100 text-neutral-600"
                              }`}>
                                {(order.paymentStatus || '').toUpperCase() === "PAID" ? "Đã trả" :
                                 (order.paymentStatus || '').toUpperCase() === "REFUNDED" ? "Hoàn tiền" : "Chưa trả"}
                              </span>
                            </td>
                            <td className="text-right pr-3 font-bold text-neutral-900">{formatCurrency(order.total || 0)}</td>
                          </tr>
                        ))}
                      {(d.orders || []).filter((o: any) => o.userId === viewingCustomer.id || o.customer?.email?.toLowerCase() === viewingCustomer.email?.toLowerCase()).length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-neutral-400">Khách hàng này chưa có đơn hàng nào.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-row justify-between sm:justify-between items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => { 
                  const target = viewingCustomer; 
                  setViewingCustomer(null); 
                  setResetPasswordUser(target); 
                  setNewPasswordValue(""); 
                }}
              >
                <KeyRound className="mr-1.5 size-3.5 text-amber-600" /> Đặt lại mật khẩu
              </Button>
              <Button size="sm" onClick={() => setViewingCustomer(null)}>Đóng</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal Đổi / Đặt lại Mật khẩu Hỗ trợ Khách hàng & Nhân viên */}
      {resetPasswordUser && (
        <Dialog open={!!resetPasswordUser} onOpenChange={(open) => !open && setResetPasswordUser(null)}>
          <DialogContent className="sm:max-w-[460px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg">
                <KeyRound className="size-5 text-amber-600" />
                Đặt lại mật khẩu {resetPasswordUser.role === 'ADMIN' || resetPasswordUser.role === 'STAFF' || resetPasswordUser.role === 'MANAGER' || resetPasswordUser.role === 'BARBER' ? 'Nhân viên' : 'Khách hàng'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-3">
              <div className="p-3 bg-neutral-50 rounded-lg border text-xs space-y-1">
                <div><span className="text-neutral-500">Tài khoản:</span> <strong className="text-neutral-800">{resetPasswordUser.name || "Chưa có tên"}</strong></div>
                <div><span className="text-neutral-500">Email:</span> <strong className="text-neutral-800">{resetPasswordUser.email}</strong></div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-neutral-700">Mật khẩu mới</label>
                  <button 
                    type="button" 
                    onClick={generateRandomPassword}
                    className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
                  >
                    <RefreshCw className="size-3" /> Tạo mật khẩu ngẫu nhiên
                  </button>
                </div>

                <div className="relative flex items-center">
                  <Input 
                    type={showNewPassword ? "text" : "password"}
                    value={newPasswordValue}
                    onChange={e => setNewPasswordValue(e.target.value)}
                    placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)..."
                    className="pr-20 font-mono text-sm"
                  />
                  <div className="absolute right-1 flex items-center">
                    <button 
                      type="button" 
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded"
                      title={showNewPassword ? "Ẩn" : "Hiện"}
                    >
                      {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                    <button 
                      type="button" 
                      onClick={handleCopyPassword}
                      disabled={!newPasswordValue}
                      className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded disabled:opacity-30"
                      title="Sao chép"
                    >
                      {copiedPassword ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-neutral-400">Sau khi lưu, bạn có thể copy mật khẩu này gửi cho khách hàng/nhân viên để họ đăng nhập.</p>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setResetPasswordUser(null)}>Hủy bỏ</Button>
              <Button onClick={handleConfirmResetPassword} disabled={!newPasswordValue || newPasswordValue.length < 6}>
                Xác nhận đổi mật khẩu
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal Xem chi tiết Preview Media */}
      {previewMedia && (
        <Dialog open={!!previewMedia} onOpenChange={(open) => !open && setPreviewMedia(null)}>
          <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
            <DialogHeader className="p-4 pb-2 border-b">
              <DialogTitle className="text-base truncate flex items-center gap-2">
                {previewMedia.type === 'video' ? <Film className="size-4 text-primary" /> : <Images className="size-4 text-emerald-600" />}
                {previewMedia.name || "Chi tiết Media"}
              </DialogTitle>
            </DialogHeader>

            <div className="p-4 space-y-4">
              <div className="relative w-full max-h-[420px] bg-neutral-950 rounded-lg overflow-hidden flex items-center justify-center">
                {previewMedia.type === "video" ? (
                  <video src={previewMedia.url} controls autoPlay className="max-h-[420px] w-full" />
                ) : (
                  <MediaThumbnail src={previewMedia.url} alt={previewMedia.name || "Preview"} type="image" className="max-h-[420px] w-auto object-contain mx-auto" />
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-neutral-50 p-3 rounded-lg border">
                <div>
                  <span className="text-neutral-400 block">Nguồn:</span>
                  <strong className="text-neutral-800">{previewMedia.source || "Thư viện"}</strong>
                </div>
                <div>
                  <span className="text-neutral-400 block">Định dạng:</span>
                  <strong className="text-neutral-800 uppercase">{previewMedia.type || "Ảnh"}</strong>
                </div>
                <div>
                  <span className="text-neutral-400 block">Kích thước:</span>
                  <strong className="text-neutral-800">{previewMedia.size || "—"}</strong>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Input value={previewMedia.url} readOnly className="text-xs font-mono bg-neutral-50" />
                <Button 
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(previewMedia.url);
                    toast.success("Đã sao chép đường dẫn URL!");
                  }}
                  className="gap-1.5 shrink-0"
                >
                  <Copy className="size-3.5" /> Sao chép
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  asChild
                  className="shrink-0"
                >
                  <a href={previewMedia.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-3.5" />
                  </a>
                </Button>
              </div>
            </div>

            <DialogFooter className="p-3 border-t bg-neutral-50 flex items-center justify-between">
              {previewMedia.isDatabase ? (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => {
                    const target = previewMedia;
                    setPreviewMedia(null);
                    setItemToDelete(target);
                  }}
                  className="gap-1"
                >
                  <Trash2 className="size-3.5" /> Xóa tệp
                </Button>
              ) : <div />}
              <Button size="sm" onClick={() => setPreviewMedia(null)}>Đóng</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Generic Media Picker for other CMS entities (Lookbook, Stories, Categories) */}
      <MediaPickerModal
        open={openGenericMediaPicker}
        onClose={() => setOpenGenericMediaPicker(false)}
        onSelect={(urls) => {
          if (genericMediaField && urls[0]) {
            handleChange(genericMediaField, urls[0]);
          }
        }}
        multiple={false}
        mediaList={allMediaList}
      />
    </div>
  )
}
