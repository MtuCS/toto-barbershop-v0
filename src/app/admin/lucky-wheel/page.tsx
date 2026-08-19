import { Button } from "@/components/ui/button"
import { AlertTriangle, Plus, Save, Settings, Trash2, Trophy } from "lucide-react"
import Image from "next/image"

const MOCK_PRIZES = [
  { id: "1", name: "Giảm 10%", color: "#f59e0b", prob: 20 },
  { id: "2", name: "Free Haircut", image: "https://placehold.co/100x100/101715/79b8a7?text=Haircut", color: "#10b981", prob: 5 },
  { id: "3", name: "Sáp vuốt tóc", image: "https://placehold.co/100x100/101715/79b8a7?text=Wax", color: "#3b82f6", prob: 10 },
  { id: "4", name: "Chúc may mắn", color: "#ef4444", prob: 40 },
  { id: "5", name: "Giảm 20%", color: "#8b5cf6", prob: 15 },
  { id: "6", name: "Lược tạo kiểu", image: "https://placehold.co/100x100/101715/79b8a7?text=Comb", color: "#06b6d4", prob: 10 },
];

export default function AdminLuckyWheelPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold uppercase font-display flex items-center gap-2">
            <Trophy className="text-primary size-6" /> Quản lý Vòng quay
          </h1>
          <p className="text-neutral-500 text-sm mt-1">Thiết lập phần thưởng và điều kiện tham gia vòng quay may mắn.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Save className="size-4" /> Lưu cấu hình
        </Button>
      </div>

      <div className="bg-amber-50 text-amber-700 p-4 border border-amber-200 rounded-lg flex gap-3 text-sm">
        <AlertTriangle className="size-5 shrink-0" />
        <div>
          <p className="font-bold">Chế độ Mock Data</p>
          <p>Giao diện này hiện tại chỉ là bản nháp (UI). Các thay đổi chưa được lưu vào cơ sở dữ liệu thật.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Settings */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-5 h-fit">
          <h2 className="font-bold flex items-center gap-2 text-lg">
            <Settings className="size-5 text-neutral-400" /> Cài đặt chung
          </h2>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-medium text-sm">Kích hoạt vòng quay</span>
              <div className="w-10 h-6 bg-primary rounded-full relative">
                <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full"></div>
              </div>
            </label>
            <div className="space-y-2">
              <label className="text-sm font-medium">Điều kiện nhận 1 lượt quay</label>
              <select className="w-full border border-neutral-300 rounded p-2 text-sm outline-none focus:border-primary">
                <option>Giá trị đơn hàng tối thiểu</option>
                <option>Mua sản phẩm cụ thể</option>
                <option>Mỗi khách hàng 1 lượt</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Giá trị đơn hàng tối thiểu (VNĐ)</label>
              <input type="number" defaultValue={300000} className="w-full border border-neutral-300 rounded p-2 text-sm outline-none focus:border-primary" />
            </div>
          </div>
        </div>

        {/* Prizes List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-lg">Danh sách phần thưởng</h2>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Plus className="size-4" /> Thêm phần thưởng
            </Button>
          </div>

          <div className="space-y-3">
            {MOCK_PRIZES.map((prize, idx) => (
              <div key={prize.id} className="flex items-center gap-4 p-3 border border-neutral-100 rounded-lg hover:border-primary transition-colors bg-neutral-50/50">
                <div className="w-12 h-12 rounded bg-neutral-200 shrink-0 overflow-hidden relative border border-black/5">
                  {prize.image ? (
                    <Image src={prize.image} alt={prize.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400 font-bold" style={{backgroundColor: prize.color, color: 'white'}}>
                      TXT
                    </div>
                  )}
                </div>
                
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3 items-center">
                  <div className="col-span-2 md:col-span-2">
                    <p className="text-xs text-neutral-500 font-bold uppercase mb-1">Tên phần thưởng</p>
                    <input type="text" defaultValue={prize.name} className="w-full bg-white border border-neutral-200 rounded p-1.5 text-sm" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 font-bold uppercase mb-1">Màu sắc</p>
                    <div className="flex items-center gap-2">
                      <input type="color" defaultValue={prize.color} className="w-6 h-6 rounded cursor-pointer" />
                      <span className="text-xs font-mono">{prize.color}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 font-bold uppercase mb-1">Tỉ lệ (%)</p>
                    <input type="number" defaultValue={prize.prob} className="w-16 bg-white border border-neutral-200 rounded p-1.5 text-sm text-center" />
                  </div>
                </div>

                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 shrink-0">
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="bg-neutral-100 rounded p-3 text-sm text-center font-bold text-neutral-600">
            Tổng tỉ lệ: <span className="text-primary">100%</span>
          </div>

        </div>

      </div>
    </div>
  )
}
