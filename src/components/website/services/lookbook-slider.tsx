"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

export interface LookbookImage {
  id: string
  src: string
  alt: string
}

export function LookbookSlider({ images }: { images: LookbookImage[] }) {
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 4
  const totalPages = Math.ceil(images.length / itemsPerPage)

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1))
  }

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0))
  }

  // Active 4 images for current page
  const currentImages = images.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  )

  return (
    <div className="relative w-full">
      {/* Navigation Controls Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[#79b8a7] tracking-wider font-semibold">
            Trang {currentPage + 1} / {totalPages}
          </span>
          <div className="flex gap-1.5 ml-2">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentPage(idx)}
                aria-label={`Chuyển đến trang ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentPage === idx
                    ? "w-6 bg-[#79b8a7]"
                    : "w-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Previous & Next Arrows (< >) */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Xem 4 ảnh trước đó"
            className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/80 backdrop-blur-md transition-all duration-300 hover:border-[#79b8a7] hover:bg-[#79b8a7] hover:text-[#07110f] hover:shadow-[0_0_20px_rgba(121,184,167,0.35)] active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="size-5 stroke-[2.2]" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Xem 4 ảnh tiếp theo"
            className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/80 backdrop-blur-md transition-all duration-300 hover:border-[#79b8a7] hover:bg-[#79b8a7] hover:text-[#07110f] hover:shadow-[0_0_20px_rgba(121,184,167,0.35)] active:scale-95 cursor-pointer"
          >
            <ChevronRight className="size-5 stroke-[2.2]" />
          </button>
        </div>
      </div>

      {/* 1 Line 4 Images with Pop-up Hover Effect */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {currentImages.map((img) => (
          <div
            key={img.id}
            className="group relative rounded-2xl p-1.5 border border-white/10 bg-white/[0.02] transition-all duration-300 ease-out hover:-translate-y-2.5 hover:scale-[1.03] hover:border-[#79b8a7]/60 hover:shadow-[0_20px_45px_rgba(121,184,167,0.25)] hover:z-10 cursor-pointer"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-black/40">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-3.5">
                <span className="text-[11px] font-mono text-[#79b8a7] font-semibold">
                  ToTo Real Look #{img.id}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
