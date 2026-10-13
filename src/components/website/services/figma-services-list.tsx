"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { ArrowUpRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ServiceSubItem {
  name: string
  price: string
  description: string
}

export interface FigmaServiceGroup {
  id: string
  number: string
  title: string
  image: string
  featured?: boolean
  items: ServiceSubItem[]
}

export function FigmaServicesList({ groups }: { groups: FigmaServiceGroup[] }) {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* 4 Nhóm Card Dịch Vụ */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {groups.map((group) => (
          <FigmaServiceCard key={group.id} group={group} />
        ))}
      </div>

      {/* Floating Capsule Action Bar tinh tế, thanh thoát theo chuẩn UI/UX Pro Max */}
      <div className="mt-8 flex justify-center">
        <div className="group/capsule relative inline-flex w-full max-w-xl sm:w-auto flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6 rounded-2xl sm:rounded-full border border-white/10 bg-[#07110f]/80 p-2 sm:p-1.5 sm:pl-5 sm:pr-2 shadow-[0_12px_32px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 hover:border-[#79b8a7]/40 hover:shadow-[0_15px_35px_rgba(121,184,167,0.12)]">
          {/* Subtle live indicator dot + Text */}
          <div className="flex items-center gap-2.5 text-center sm:text-left py-1 sm:py-0">
            <span className="relative flex size-2 shrink-0">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#79b8a7] opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-[#79b8a7]" />
            </span>
            <span className="font-sans text-xs sm:text-sm font-medium text-white/80">
              Bạn cần tư vấn kiểu tóc hoặc dịch vụ phù hợp?
            </span>
          </div>

          {/* Button-in-Button Nested CTA Pill */}
          <a
            href="https://m.me/totobarbershopHCM"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Nhắn tin Messenger tư vấn với ToTo Barbershop"
            className="group/btn inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl sm:rounded-full bg-[#79b8a7] px-4 py-2 sm:py-1.5 text-xs font-bold uppercase tracking-wider text-[#07110f] transition-all duration-300 hover:bg-[#68a494] hover:shadow-[0_0_20px_rgba(121,184,167,0.35)] active:scale-95 cursor-pointer shrink-0"
          >
            <span>Tư vấn</span>
            <span className="flex size-5 sm:size-5.5 items-center justify-center rounded-full bg-[#07110f]/15 text-[#07110f] transition-transform duration-300 group-hover/btn:rotate-45 group-hover/btn:bg-[#07110f]/25">
              <ArrowUpRight className="size-3.5 stroke-[2.5]" />
            </span>
          </a>
        </div>
      </div>
    </div>
  )
}

function FigmaServiceCard({ group }: { group: FigmaServiceGroup }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative flex flex-col rounded-[2rem] p-1.5 transition-all duration-500",
        group.featured
          ? "border border-[#d4af37]/45 bg-gradient-to-b from-[#d4af37]/15 via-white/[0.02] to-transparent shadow-[0_0_35px_rgba(212,175,55,0.08)] hover:border-[#d4af37]/75 hover:shadow-[0_25px_50px_rgba(212,175,55,0.18)]"
          : "border border-white/10 bg-white/[0.02] hover:border-[#79b8a7]/40 hover:shadow-[0_25px_50px_rgba(0,0,0,0.6)]"
      )}
    >
      {/* Interactive Spotlight Glow Effect following Cursor */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: group.featured
            ? `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, rgba(212, 175, 55, 0.22), transparent 70%)`
            : `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, rgba(121, 184, 167, 0.18), transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Inner Concentric Core (Double-Bezel Architecture) */}
      <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(2rem-0.375rem)] bg-[#07110f]/95 p-5 md:p-6 backdrop-blur-md">
        {/* Top Image Frame with concentric rounding */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-black/40">
          <Image
            src={group.image}
            alt={group.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07110f]/80 via-transparent to-transparent opacity-60" />

          {/* Signature Badge */}
          {group.featured && (
            <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full border border-[#d4af37]/40 bg-black/80 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.3)] backdrop-blur-md">
              <Sparkles className="size-2.5" />
              Signature
            </div>
          )}

          {/* Number Tag */}
          <div className="absolute top-3 right-3 rounded-md bg-black/60 px-2 py-0.5 font-mono text-[10px] font-semibold text-white/70 backdrop-blur-md">
            {group.number}
          </div>
        </div>

        {/* Category Title */}
        <div className="pt-5">
          <h3 className="font-sans text-base md:text-lg font-extrabold uppercase tracking-tight text-[#f2f5f3] group-hover:text-white transition-colors">
            {group.title}
          </h3>
        </div>

        {/* Danh sách dịch vụ + giá */}
        <div className="mt-4 flex-1 space-y-3.5 divide-y divide-white/5 pb-2">
          {group.items.map((sub, idx) => (
            <div key={idx} className={idx > 0 ? "pt-3.5" : ""}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-sans text-xs sm:text-sm font-bold text-white tracking-tight">
                  {sub.name}
                </span>
                <span className="shrink-0 rounded-full border border-[#79b8a7]/30 bg-[#79b8a7]/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-[#79b8a7]">
                  {sub.price}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-white/60 font-sans">
                {sub.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
