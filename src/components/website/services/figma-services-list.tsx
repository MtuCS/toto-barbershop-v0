"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, ChevronRight, Clock, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export interface FigmaServiceItem {
  id: string
  number: string
  title: string
  duration: string
  image: string
  description: string
  steps: string[]
  priceLabel?: string
  price?: string
  featured?: boolean
}

export function FigmaServicesList({ items }: { items: FigmaServiceItem[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <FigmaServiceCard key={item.id} item={item} />
      ))}
    </div>
  )
}

function FigmaServiceCard({ item }: { item: FigmaServiceItem }) {
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
        item.featured
          ? "border border-[#d4af37]/45 bg-gradient-to-b from-[#d4af37]/15 via-white/[0.02] to-transparent shadow-[0_0_35px_rgba(212,175,55,0.08)] hover:border-[#d4af37]/75 hover:shadow-[0_25px_50px_rgba(212,175,55,0.18)]"
          : "border border-white/10 bg-white/[0.02] hover:border-[#79b8a7]/40 hover:shadow-[0_25px_50px_rgba(0,0,0,0.6)]"
      )}
    >
      {/* Interactive Spotlight Glow Effect following Cursor */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: item.featured
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
            src={item.image}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07110f]/80 via-transparent to-transparent opacity-60" />

          {/* Signature Badge */}
          {item.featured && (
            <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full border border-[#d4af37]/40 bg-black/80 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.3)] backdrop-blur-md">
              <Sparkles className="size-2.5" />
              Signature
            </div>
          )}

          {/* Number Tag */}
          <div className="absolute top-3 right-3 rounded-md bg-black/60 px-2 py-0.5 font-mono text-[10px] font-semibold text-white/70 backdrop-blur-md">
            {item.number}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 pt-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-sans text-sm md:text-base font-bold uppercase tracking-tight text-[#f2f5f3] group-hover:text-white transition-colors">
              {item.title}
            </h3>
            <span className="inline-flex items-center gap-1 shrink-0 font-mono text-[11px] text-white/50">
              <Clock className="size-3 text-white/40" />
              {item.duration}
            </span>
          </div>

          <p className="mt-2.5 text-xs leading-relaxed text-white/60">
            {item.description}
          </p>

          {/* Quy trình thực hiện (Process Steps theo chuẩn >) */}
          <div className="mt-5 border-t border-white/10 pt-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#79b8a7] mb-2 font-semibold">
              Quy trình thực hiện:
            </p>
            <div className="space-y-1.5">
              {item.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-xs text-white/75">
                  <span className="text-[#79b8a7] font-mono text-[10px] mt-0.5">
                    {idx + 1}.
                  </span>
                  <span className="leading-snug">{step}</span>
                  {idx < item.steps.length - 1 && (
                    <ChevronRight className="size-3 text-[#79b8a7]/40 shrink-0 self-center hidden sm:inline" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Price & Island CTA Button */}
          <div className="mt-auto flex items-end justify-between gap-3 pt-6 border-t border-white/5 mt-6">
            <div>
              {item.priceLabel && (
                <span className="block text-[10px] uppercase font-semibold tracking-wider text-[#79b8a7]">
                  {item.priceLabel}
                </span>
              )}
              {item.price && (
                <span className="font-sans text-lg md:text-xl font-bold text-white tracking-tight">
                  {item.price}
                </span>
              )}
            </div>

            <Link
              href="/contact"
              aria-label={`Đặt lịch ${item.title}`}
              className="group/btn inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 pl-3.5 pr-1.5 py-1 text-xs font-semibold text-[#f2f5f3] transition-all duration-300 hover:border-[#79b8a7]/60 hover:bg-[#79b8a7]/15 hover:text-[#79b8a7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#79b8a7]"
            >
              <span className="text-[11px]">Đặt lịch</span>
              <span className="flex size-6 items-center justify-center rounded-full bg-[#79b8a7]/20 text-[#79b8a7] transition-all duration-300 group-hover/btn:bg-[#79b8a7] group-hover/btn:text-[#07110f] group-hover/btn:rotate-45">
                <ArrowUpRight className="size-3 stroke-[2]" aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
