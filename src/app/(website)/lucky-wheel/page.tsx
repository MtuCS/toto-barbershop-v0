import { MarketingPageShell } from "@/components/website/marketing-page-shell"
import { LuckyWheelGame, Prize } from "@/components/website/lucky-wheel-game"

const mockPrizes: Prize[] = [
  { 
    id: "1", 
    name: "Giảm 10%", 
    color: "#f59e0b", 
    probability: 20,
    code: "TOTO10",
    description: "Giảm trực tiếp 10% cho toàn bộ hoá đơn dịch vụ hoặc mua sản phẩm tại Salon.",
    image: "/images/grooming-kit.png"
  },
  { 
    id: "2", 
    name: "Free Haircut", 
    color: "#10b981", 
    probability: 5,
    code: "FREECUT",
    description: "Tặng 01 buổi cắt tóc & gội đầu massage Barber VIP trị giá 250.000đ.",
    image: "/images/service-cut.jpg"
  },
  { 
    id: "3", 
    name: "Sáp vuốt tóc", 
    color: "#3b82f6", 
    probability: 10,
    code: "WAXGIFT",
    description: "01 Hộp sáp tạo kiểu cao cấp TOTO Matte Pomade chính hãng 100ml.",
    image: "/images/grooming-pomade.png"
  },
  { 
    id: "4", 
    name: "Chúc may mắn", 
    color: "#ef4444", 
    probability: 40,
    description: "Đừng buồn nhé! Hãy tích thêm lượt quay mới khi đặt lịch hoặc mua sắm tại TOTO."
  },
  { 
    id: "5", 
    name: "Giảm 20%", 
    color: "#8b5cf6", 
    probability: 15,
    code: "TOTO20",
    description: "Voucher giảm cực sốc 20% cho đơn hàng hoặc dịch vụ tiếp theo.",
    image: "/images/grooming-clay.png"
  },
  { 
    id: "6", 
    name: "Lược tạo kiểu", 
    color: "#06b6d4", 
    probability: 10,
    code: "COMBGIFT",
    description: "01 Chiếc lược sấy phồng chuyên dụng phong cách Barber cổ điển.",
    image: "/images/grooming-comb.png"
  },
];

export default function LuckyWheelPage() {
  return (
    <MarketingPageShell>
      <div className="bg-[#07110f] min-h-[calc(100vh-64px)] py-2 sm:py-4 px-4 sm:px-6 lg:px-10 relative overflow-x-hidden flex items-center justify-center">
        
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[min(90vw,850px)] h-[min(90vw,850px)] bg-primary/10 rounded-full blur-[180px] pointer-events-none" />

        <div className="mx-auto max-w-[1550px] w-full relative z-10">
          
          {/* 2-Column Responsive Layout: Left = Wheel, Right = 2-Row Title Only */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-12 items-center">
            
            {/* LEFT COLUMN: Perfectly Fitted Wheel Component */}
            <div className="lg:col-span-7 flex justify-center items-center order-2 lg:order-1">
              <LuckyWheelGame prizes={mockPrizes} />
            </div>

            {/* RIGHT COLUMN: Luxury Typography with 100% Unclipped Diacritics */}
            <div className="lg:col-span-5 flex flex-col justify-center order-1 lg:order-2 text-center lg:text-left relative">
              
              {/* Background Faint Watermark Text */}
              <span className="absolute -top-12 -left-4 text-7xl sm:text-8xl md:text-9xl font-black font-display uppercase text-white/[0.03] select-none pointer-events-none tracking-tighter hidden lg:block">
                LUCKY
              </span>

              {/* Tag / Micro Label */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#79b8a7]/10 border border-[#79b8a7]/25 text-[#79b8a7] text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] w-fit mx-auto lg:mx-0 mb-3 sm:mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#79b8a7] animate-ping" />
                <span>TOTO Barbershop • Special Rewards</span>
              </div>

              {/* Main 2-Row Luxury Title (With Safe Diacritics Box) */}
              <h1 className="font-display uppercase tracking-tight flex flex-col items-center lg:items-start select-none">
                <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)] whitespace-nowrap leading-none pb-2">
                  Vòng Quay
                </span>
                <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#79b8a7] via-[#e2c168] to-[#79b8a7] filter drop-shadow-[0_0_40px_rgba(121,184,167,0.35)] whitespace-nowrap leading-normal pt-2 pb-1 inline-block">
                  May Mắn
                </span>
              </h1>

              {/* Decorative Accent Line */}
              <div className="flex items-center gap-2 mt-4 sm:mt-5 justify-center lg:justify-start">
                <div className="w-14 h-1 bg-gradient-to-r from-[#79b8a7] to-[#e2c168] rounded-full" />
                <div className="w-2 h-2 rounded-full bg-[#e2c168]" />
                <div className="w-28 h-[1px] bg-gradient-to-r from-white/30 to-transparent" />
              </div>

            </div>

          </div>

        </div>
      </div>
    </MarketingPageShell>
  );
}
