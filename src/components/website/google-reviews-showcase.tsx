"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, CheckCircle2, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"

export interface GoogleReview {
  id: string
  name: string
  avatar?: string
  initials: string
  avatarBg: string
  timeAgo: string
  rating: number
  text: string
  photos?: string[]
  verified: boolean
}

const googleReviewsData: GoogleReview[] = [
  {
    id: "1",
    name: "Khanh Châu",
    initials: "KC",
    avatarBg: "bg-emerald-700",
    timeAgo: "1 tháng trước trên Google",
    rating: 5,
    text: "Cắt ở đây cũng được 5 6 năm rồi, thợ tay nghề cứng, cắt rất ưng ý và nhiệt tình.",
    verified: true,
  },
  {
    id: "2",
    name: "thanh nam",
    initials: "TN",
    avatarBg: "bg-blue-600",
    timeAgo: "1 tháng trước trên Google",
    rating: 5,
    text: "Rất tốt, nên vào. Không gian thoải mái, thợ cắt kỹ lưỡng và tư vấn tận tâm.",
    verified: true,
  },
  {
    id: "3",
    name: "Phuc An Nguyen",
    initials: "PA",
    avatarBg: "bg-purple-600",
    timeAgo: "2 tháng trước trên Google",
    rating: 5,
    text: "Đã để lại đánh giá 5 sao. Xuất sắc! Dịch vụ cạo mặt và gội đầu thư giãn tuyệt vời.",
    photos: ["/images/interior.png", "/images/about.png"],
    verified: true,
  },
  {
    id: "4",
    name: "Đức Nguyễn",
    initials: "ĐN",
    avatarBg: "bg-amber-600",
    timeAgo: "2 tháng trước trên Google",
    rating: 5,
    text: "💯 Tay nghề đỉnh, không gian phong cách, giá cả dịch vụ rất hợp lý.",
    verified: true,
  },
  {
    id: "5",
    name: "Gia Huy Trần",
    initials: "GH",
    avatarBg: "bg-teal-600",
    timeAgo: "2 tháng trước trên Google",
    rating: 5,
    text: "Cắt nét, ae tới đi bao ngon. Đã cắt nhiều nơi nhưng ToTo vẫn là chân ái.",
    verified: true,
  },
  {
    id: "6",
    name: "Anh Minh",
    initials: "AM",
    avatarBg: "bg-indigo-600",
    timeAgo: "3 tháng trước trên Google",
    rating: 5,
    text: "Đến đây thích nhất là sự thong thả. Mấy anh thợ làm kỹ, không vội vàng, nói chuyện nghe rất dễ chịu.",
    verified: true,
  },
]

export function GoogleReviewsShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const maxIndex = Math.max(0, googleReviewsData.length - 3)

  const next = () => setCurrentIndex((i) => (i >= maxIndex ? 0 : i + 1))
  const prev = () => setCurrentIndex((i) => (i <= 0 ? maxIndex : i - 1))

  return (
    <div className="w-full">
      {/* Cards Slider / Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {googleReviewsData.slice(currentIndex, currentIndex + 3).map((review) => (
          <div
            key={review.id}
            className="flex flex-col justify-between rounded-xl border border-white/10 bg-white p-4 sm:p-5 text-[#101715] shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
          >
            <div>
              {/* Header: User Info & Google Icon */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex size-9 sm:size-10 items-center justify-center rounded-full text-xs sm:text-sm font-bold text-white shadow-sm shrink-0 ${review.avatarBg}`}
                  >
                    {review.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 font-bold text-neutral-900 text-xs sm:text-sm">
                      {review.name}
                      {review.verified && (
                        <CheckCircle2 className="size-3.5 fill-blue-500 text-white" />
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-400 font-medium">
                      {review.timeAgo}
                    </p>
                  </div>
                </div>

                {/* Google "G" Badge */}
                <div className="flex size-6 items-center justify-center rounded-full bg-neutral-100 p-1 shrink-0">
                  <svg className="size-3.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                </div>
              </div>

              {/* Stars */}
              <div className="mt-2.5 flex items-center gap-1">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="size-3.5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-neutral-700 line-clamp-3">
                {review.text}
              </p>

              {/* Review Photos if any */}
              {review.photos && review.photos.length > 0 && (
                <div className="mt-2.5 flex gap-2 overflow-hidden rounded-lg">
                  {review.photos.map((photo, idx) => (
                    <div
                      key={idx}
                      className="relative h-14 sm:h-16 w-1/2 overflow-hidden rounded-md border border-neutral-200"
                    >
                      <Image
                        src={photo}
                        alt="Ảnh chụp thực tế tại ToTo Barbershop"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Tag */}
            <div className="mt-3 border-t border-neutral-100 pt-2 flex items-center justify-between text-[10px] text-neutral-400">
              <span>Đã xác minh bởi Google</span>
              <span className="font-semibold text-emerald-600">✓ Trải nghiệm thực tế</span>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="mt-4 sm:mt-5 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            aria-label="Xem review trước"
            className="flex size-8 sm:size-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-all hover:border-[#79b8a7] hover:bg-[#79b8a7] hover:text-[#050c0a]"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Xem review tiếp theo"
            className="flex size-8 sm:size-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-all hover:border-[#79b8a7] hover:bg-[#79b8a7] hover:text-[#050c0a]"
          >
            <ChevronRight className="size-4" />
          </button>
          <span className="ml-2 text-[11px] text-white/50">
            {currentIndex + 1} – {Math.min(currentIndex + 3, googleReviewsData.length)} / {googleReviewsData.length}
          </span>
        </div>

        <a
          href="https://www.google.com/maps/place/Toto+babershop/@10.793289,106.644723,17z/data=!4m6!3m5!1s0x317529fab862286b:0x558f62689c90fdae!8m2!3d10.793289!4d106.644723!16s%2Fg%2F11sy6vhbxb?entry=ttu"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 transition-all hover:border-[#79b8a7] hover:text-white"
        >
          <span>Xem tất cả 73 đánh giá</span>
          <ExternalLink className="size-3" />
        </a>
      </div>
    </div>
  )
}
