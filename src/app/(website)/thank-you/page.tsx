import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2, ShoppingBag, Home, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Cảm ơn bạn đã liên hệ | ToTo Barbershop",
  description: "Cảm ơn bạn đã gửi lời nhắn đến ToTo Barbershop. Chúng tôi sẽ phản hồi lại bạn sớm nhất trong vòng 15 phút.",
}

export default function ThankYouPage() {
  return (
    <div className="relative min-h-[75vh] flex flex-col items-center justify-center px-5 py-20 text-[#f2f5f3]">
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full bg-[#13443B]/25 blur-[120px]" />

      <div className="relative mx-auto max-w-xl text-center">
        {/* Animated Check Icon */}
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full border border-[#79b8a7]/30 bg-[#13443B]/40 shadow-2xl backdrop-blur-md">
          <CheckCircle2 className="size-10 text-[#79b8a7]" />
        </div>

        {/* Title */}
        <span className="inline-block text-xs font-semibold uppercase tracking-[0.25em] text-[#79b8a7]">
          Tin nhắn đã được tiếp nhận
        </span>
        <h1 className="mt-2 font-agatho text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#f2f5f3]">
          Cảm Ơn Bạn Đã Kết Nối!
        </h1>

        <p className="mt-4 text-sm sm:text-base text-white/70 leading-relaxed">
          Đội ngũ ToTo Barbershop đã nhận được thông tin của bạn. Chúng tôi cam kết sẽ xem xét và phản hồi lại qua Email / Số điện thoại trong vòng <strong className="text-[#79b8a7]">15 phút</strong> (trong khung giờ mở cửa 09:00 - 20:00).
        </p>

        {/* Promise Card */}
        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md text-left">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <Clock className="size-5 text-[#79b8a7]" />
            <h2 className="text-sm font-semibold text-white/90">Trong lúc chờ phản hồi:</h2>
          </div>
          <ul className="mt-4 space-y-3 text-xs sm:text-sm text-white/70">
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[#79b8a7]" />
              Khám phá sáp vuốt tóc & pomade chính hãng tại <Link href="/shop" className="text-[#79b8a7] underline font-medium hover:text-white">Shop</Link>.
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[#79b8a7]" />
              Thử vận may nhận mã giảm giá tại <Link href="/lucky-wheel" className="text-[#79b8a7] underline font-medium hover:text-white">Vòng quay may mắn</Link>.
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[#79b8a7]" />
              Cần hỗ trợ gấp? Gọi ngay hotline: <a href="tel:0981378179" className="text-[#79b8a7] font-semibold hover:text-white">0981 378 179</a>.
            </li>
          </ul>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-[#79b8a7] px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#050c0a] transition-all duration-300 hover:bg-[#8ec7b7] hover:shadow-[0_0_20px_rgba(121,184,167,0.4)]"
          >
            <ShoppingBag className="size-4" />
            Khám phá Shop
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white/90 transition-all duration-300 hover:border-[#79b8a7] hover:bg-[#79b8a7]/10"
          >
            <Home className="size-4" />
            Về Trang Chủ
          </Link>
        </div>
      </div>
    </div>
  )
}
