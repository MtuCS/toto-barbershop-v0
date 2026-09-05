import Link from "next/link"
import { Scissors, Home, ShoppingBag } from "lucide-react"

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#050c0a] text-[#f2f5f3] px-5 py-16 overflow-hidden">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-[#13443B]/20 blur-[120px] opacity-70" />

      {/* Decorative Barber Scissors */}
      <div className="relative mb-6 flex size-20 items-center justify-center rounded-2xl border border-[#79b8a7]/20 bg-[#13443B]/30 shadow-2xl backdrop-blur-md">
        <Scissors className="size-10 text-[#79b8a7] animate-pulse" />
        <div className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-[#d71920] text-[10px] font-bold text-white shadow-md">
          !
        </div>
      </div>

      {/* 404 Big Number */}
      <span className="font-display text-8xl md:text-9xl font-bold tracking-tighter text-[#79b8a7]/20 select-none">
        404
      </span>

      {/* Main Heading */}
      <h1 className="relative -mt-6 font-agatho text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-center text-[#f2f5f3]">
        Đường Kéo Này Đi Lạc Rồi!
      </h1>

      <p className="mt-4 max-w-md text-center text-sm md:text-base text-white/70 leading-relaxed">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã được chuyển sang một địa chỉ mới. Hãy để ToTo dẫn bạn trở lại đúng quỹ đạo nhé!
      </p>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-[#79b8a7] px-6 py-3 text-xs md:text-sm font-bold uppercase tracking-wider text-[#050c0a] transition-all duration-300 hover:bg-[#8ec7b7] hover:shadow-[0_0_20px_rgba(121,184,167,0.4)]"
        >
          <Home className="size-4" />
          Về trang chủ
        </Link>

        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-xs md:text-sm font-bold uppercase tracking-wider text-white/90 transition-all duration-300 hover:border-[#79b8a7] hover:bg-[#79b8a7]/10 hover:text-white"
        >
          <ShoppingBag className="size-4" />
          Ghé Shop Sáp & Merch
        </Link>

        <Link
          href="/services"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-transparent px-5 py-3 text-xs md:text-sm font-medium text-white/60 transition-colors hover:text-white"
        >
          <Scissors className="size-4 text-[#79b8a7]" />
          Bảng giá dịch vụ
        </Link>
      </div>

      {/* Footer tagline */}
      <p className="mt-14 text-xs font-medium uppercase tracking-[0.2em] text-white/30">
        ToTo Barbershop · Barber · Culture · Craft
      </p>
    </div>
  )
}
