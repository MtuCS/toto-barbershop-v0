"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Save, Settings, Trash2, Trophy, Info, CheckCircle2, AlertCircle } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface WheelPrize {
  id: string
  name: string
  code?: string
  image?: string
  color: string
  prob: number
}

const DEFAULT_PRIZES: WheelPrize[] = [
  { id: "1", name: "Giảm 10%", code: "TOTO10", color: "#f59e0b", prob: 20, image: "/images/grooming-kit.png" },
  { id: "2", name: "Free Haircut", code: "FREECUT", image: "/images/service-cut.jpg", color: "#10b981", prob: 5 },
  { id: "3", name: "Sáp vuốt tóc", code: "WAXGIFT", image: "/images/grooming-pomade.png", color: "#3b82f6", prob: 10 },
  { id: "4", name: "Chúc may mắn", color: "#ef4444", prob: 40 },
  { id: "5", name: "Giảm 20%", code: "TOTO20", image: "/images/grooming-clay.png", color: "#8b5cf6", prob: 15 },
  { id: "6", name: "Lược tạo kiểu", code: "COMBGIFT", image: "/images/grooming-comb.png", color: "#06b6d4", prob: 10 },
]

const STORAGE_KEY = "toto_admin_lucky_wheel_config"

export default function AdminLuckyWheelPage() {
  const [enabled, setEnabled] = useState(true)
  const [condition, setCondition] = useState("min_order")
  const [minOrderValue, setMinOrderValue] = useState(300000)
  const [prizes, setPrizes] = useState<WheelPrize[]>(DEFAULT_PRIZES)
  const [isSaved, setIsSaved] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (typeof parsed.enabled === "boolean") setEnabled(parsed.enabled)
        if (parsed.condition) setCondition(parsed.condition)
        if (parsed.minOrderValue) setMinOrderValue(parsed.minOrderValue)
        if (Array.isArray(parsed.prizes) && parsed.prizes.length > 0) setPrizes(parsed.prizes)
      }
    } catch {
      // Use defaults if parse fails
    }
  }, [])

  const totalProb = prizes.reduce((sum, p) => sum + (Number(p.prob) || 0), 0)
  const isProbValid = totalProb === 100

  const handleSave = () => {
    try {
      const config = {
        enabled,
        condition,
        minOrderValue,
        prizes,
        updatedAt: new Date().toISOString(),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
      setIsSaved(true)
      toast.success("Đã lưu cấu hình vòng quay may mắn thành công!")
      setTimeout(() => setIsSaved(false), 3000)
    } catch {
      toast.error("Không thể lưu cấu hình. Vui lòng thử lại.")
    }
  }

  const handleUpdatePrize = (id: string, field: keyof WheelPrize, value: any) => {
    setPrizes(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  const handleAddPrize = () => {
    const newId = String(Date.now())
    const newPrize: WheelPrize = {
      id: newId,
      name: "Phần thưởng mới",
      color: "#13443B",
      prob: 10,
    }
    setPrizes(prev => [...prev, newPrize])
  }

  const handleRemovePrize = (id: string) => {
    if (prizes.length <= 2) {
      toast.warning("Vòng quay cần tối thiểu 2 phần thưởng để hoạt động.")
      return
    }
    setPrizes(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold uppercase font-display flex items-center gap-2">
            <Trophy className="text-primary size-6" /> Quản lý Vòng quay
          </h1>
          <p className="text-neutral-500 text-sm mt-1">Thiết lập giải thưởng, tỷ lệ trúng và điều kiện tham gia vòng quay may mắn.</p>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white">
          {isSaved ? <CheckCircle2 className="size-4" /> : <Save className="size-4" />}
          {isSaved ? "Đã lưu" : "Lưu cấu hình"}
        </Button>
      </div>

      <div className="bg-emerald-50/70 border border-emerald-200/80 text-emerald-900 p-4 rounded-xl flex items-start gap-3 text-sm">
        <Info className="size-5 shrink-0 text-emerald-600 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-emerald-950">Cấu hình khuyến mãi trực tiếp</p>
          <p className="text-emerald-800/90 text-xs sm:text-sm">
            Tất cả điều chỉnh về tỉ lệ phần thưởng và điều kiện nhận lượt quay sẽ được áp dụng trực tiếp cho giao diện Vòng quay may mắn trên website.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Settings */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-5 h-fit">
          <h2 className="font-bold flex items-center gap-2 text-base text-neutral-900">
            <Settings className="size-5 text-neutral-500" /> Cài đặt chung
          </h2>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer py-1">
              <div>
                <span className="font-medium text-sm text-neutral-800 block">Kích hoạt vòng quay</span>
                <span className="text-xs text-neutral-500">Hiển thị tính năng này cho khách hàng</span>
              </div>
              <button
                type="button"
                onClick={() => setEnabled(!enabled)}
                className={`w-11 h-6 rounded-full transition-colors relative inline-flex items-center ${enabled ? 'bg-primary' : 'bg-neutral-300'}`}
              >
                <span className={`w-4 h-4 bg-white rounded-full transition-transform transform shadow-sm ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </label>

            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <label className="text-sm font-medium text-neutral-800">Điều kiện nhận 1 lượt quay</label>
              <select 
                value={condition} 
                onChange={e => setCondition(e.target.value)}
                className="w-full border border-neutral-300 rounded-lg p-2.5 text-sm outline-none focus:border-primary bg-neutral-50/50"
              >
                <option value="min_order">Giá trị đơn hàng tối thiểu</option>
                <option value="every_customer">Mỗi khách hàng đăng ký 1 lượt</option>
                <option value="special_event">Sự kiện đặc biệt (Tất cả khách)</option>
              </select>
            </div>

            {condition === "min_order" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-800">Đơn hàng tối thiểu (VNĐ)</label>
                <input 
                  type="number" 
                  value={minOrderValue} 
                  onChange={e => setMinOrderValue(Number(e.target.value))}
                  className="w-full border border-neutral-300 rounded-lg p-2 text-sm outline-none focus:border-primary" 
                />
                <p className="text-xs text-neutral-400">Khách hoàn thành đơn đạt mức này sẽ tự động nhận 1 lượt quay.</p>
              </div>
            )}
          </div>
        </div>

        {/* Prizes List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-5">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-bold text-base text-neutral-900">Danh sách phần thưởng ({prizes.length})</h2>
              <p className="text-xs text-neutral-500">Mỗi ô đại diện cho một phần trên vòng quay.</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleAddPrize} className="flex items-center gap-1.5 text-xs">
              <Plus className="size-3.5" /> Thêm phần thưởng
            </Button>
          </div>

          <div className="space-y-3">
            {prizes.map((prize, idx) => (
              <div key={prize.id} className="flex items-center gap-3 sm:gap-4 p-3 border border-neutral-200 rounded-lg hover:border-primary/50 transition-colors bg-neutral-50/40">
                <div className="w-11 h-11 rounded-lg bg-neutral-100 shrink-0 overflow-hidden relative border border-neutral-200 flex items-center justify-center">
                  {prize.image ? (
                    <Image src={prize.image} alt={prize.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white uppercase" style={{ backgroundColor: prize.color }}>
                      {idx + 1}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-center">
                  <div className="sm:col-span-5">
                    <p className="text-[10px] text-neutral-400 font-semibold uppercase mb-0.5">Tên hiển thị</p>
                    <input 
                      type="text" 
                      value={prize.name} 
                      onChange={e => handleUpdatePrize(prize.id, 'name', e.target.value)}
                      className="w-full bg-white border border-neutral-200 rounded px-2.5 py-1.5 text-sm focus:border-primary outline-none" 
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <p className="text-[10px] text-neutral-400 font-semibold uppercase mb-0.5">Mã giảm giá</p>
                    <input 
                      type="text" 
                      value={prize.code || ""} 
                      placeholder="Tự do"
                      onChange={e => handleUpdatePrize(prize.id, 'code', e.target.value)}
                      className="w-full bg-white border border-neutral-200 rounded px-2 py-1.5 text-xs uppercase font-mono focus:border-primary outline-none" 
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-[10px] text-neutral-400 font-semibold uppercase mb-0.5">Màu sắc</p>
                    <div className="flex items-center gap-1.5">
                      <input 
                        type="color" 
                        value={prize.color} 
                        onChange={e => handleUpdatePrize(prize.id, 'color', e.target.value)}
                        className="w-7 h-7 rounded border border-neutral-200 cursor-pointer p-0.5 bg-white" 
                      />
                      <span className="text-[11px] font-mono text-neutral-500 uppercase">{prize.color}</span>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-[10px] text-neutral-400 font-semibold uppercase mb-0.5">Tỉ lệ (%)</p>
                    <input 
                      type="number" 
                      min={0}
                      max={100}
                      value={prize.prob} 
                      onChange={e => handleUpdatePrize(prize.id, 'prob', Number(e.target.value))}
                      className="w-full bg-white border border-neutral-200 rounded px-2 py-1.5 text-sm text-center font-bold focus:border-primary outline-none" 
                    />
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleRemovePrize(prize.id)}
                  className="text-neutral-400 hover:text-red-600 hover:bg-red-50 shrink-0 h-8 w-8"
                  title="Xóa phần thưởng"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className={`rounded-xl p-3.5 text-sm flex items-center justify-between border ${isProbValid ? 'bg-neutral-50 border-neutral-200 text-neutral-700' : 'bg-amber-50 border-amber-300 text-amber-900'}`}>
            <span className="font-medium flex items-center gap-2">
              {!isProbValid && <AlertCircle className="size-4 text-amber-600" />}
              Tổng tỉ lệ trúng thưởng:
            </span>
            <span className={`font-bold text-base ${isProbValid ? 'text-primary' : 'text-amber-600'}`}>
              {totalProb}% {isProbValid ? "(Chuẩn 100%)" : "(Nên điều chỉnh về 100%)"}
            </span>
          </div>

        </div>

      </div>
    </div>
  )
}
