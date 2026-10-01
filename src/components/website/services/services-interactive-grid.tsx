"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { ArrowUpRight, Check, Clock, Sparkles } from "lucide-react"
import type { Service } from "@/types"
import { formatCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"

export function ServicesInteractiveGrid({
  services,
}: {
  services: Service[]
}) {
  // Extract unique categories for filter tabs
  const categories = ["Tất Cả", ...Array.from(new Set(services.map((s) => s.category).filter(Boolean)))]
  const [activeCategory, setActiveCategory] = useState("Tất Cả")

  const filteredServices =
    activeCategory === "Tất Cả"
      ? services
      : services.filter((s) => s.category === activeCategory)

  return (
    <div className="space-y-10">
      {/* Category Filter Tabs */}
      {categories.length > 2 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 pb-4 border-b border-white/10">
          {categories.map((category) => {
            const isActive = activeCategory === category
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "cursor-pointer rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-300",
                  isActive
                    ? "border border-[#79b8a7] bg-[#79b8a7]/15 text-[#79b8a7] shadow-[0_0_20px_rgba(121,184,167,0.2)]"
                    : "border border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:text-white hover:bg-white/[0.05]"
                )}
              >
                {category}
              </button>
            )
          })}
        </div>
      )}

      {/* Services Grid with Double-Bezel and Spotlight Interaction */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => (
          <ServiceCardItem key={service.id} service={service} />
        ))}
      </div>
    </div>
  )
}

function ServiceCardItem({ service }: { service: Service }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const isFeatured = !!service.featured

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setPosition({
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
        isFeatured
          ? "border border-[#d4af37]/40 bg-gradient-to-b from-[#d4af37]/15 via-white/[0.02] to-white/[0.01] shadow-[0_0_35px_rgba(212,175,55,0.08)] hover:border-[#d4af37]/70 hover:shadow-[0_20px_45px_rgba(212,175,55,0.18)]"
          : "border border-white/10 bg-white/[0.02] hover:border-white/25 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
      )}
    >
      {/* Interactive Spotlight Effect */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: isFeatured
            ? `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(212, 175, 55, 0.18), transparent 70%)`
            : `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(121, 184, 167, 0.14), transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Inner Core (Double-Bezel Architecture) */}
      <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(2rem-0.375rem)] bg-[#07110f]/95 p-6 md:p-8 backdrop-blur-md">
        {/* Top Meta Bar */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#79b8a7]">
              {service.category}
            </span>
            {isFeatured && (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/15 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.25)]">
                <Sparkles className="size-2.5" />
                Signature
              </span>
            )}
          </div>
          <span className="inline-flex items-center gap-1 font-mono text-xs text-white/50">
            <Clock className="size-3 text-white/40" />
            {service.duration} phút
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-5 font-display text-3xl md:text-4xl font-bold uppercase leading-tight text-[#f2f5f3] transition-colors duration-300 group-hover:text-white">
          {service.name}
        </h3>

        {/* Description */}
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          {service.description}
        </p>

        {/* Process Steps */}
        {service.process && service.process.length > 0 && (
          <ul className="mt-6 space-y-2 border-t border-white/5 pt-5 text-xs text-white/75">
            {service.process.map((step) => (
              <li key={step} className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded-full",
                    isFeatured
                      ? "bg-[#d4af37]/20 text-[#d4af37]"
                      : "bg-[#79b8a7]/20 text-[#79b8a7]"
                  )}
                >
                  <Check className="size-2.5 stroke-[2.5]" aria-hidden="true" />
                </span>
                <span className="leading-snug">{step}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Bottom Price & Island CTA Button */}
        <div className="mt-auto flex items-end justify-between gap-4 pt-8">
          <div>
            {service.priceLabel && (
              <span className="block text-[11px] font-sans font-semibold uppercase tracking-[0.14em] text-[#79b8a7] mb-0.5">
                {service.priceLabel}
              </span>
            )}
            <p className="font-display text-3xl md:text-4xl font-bold text-[#f2f5f3]">
              {formatCurrency(service.price)}
            </p>
          </div>

          <Link
            href="/contact"
            aria-label={`Liên hệ đặt lịch ${service.name}`}
            className="group/btn inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 pl-4 pr-1.5 py-1.5 text-xs font-semibold text-[#f2f5f3] transition-all duration-300 hover:border-[#79b8a7]/60 hover:bg-[#79b8a7]/15 hover:text-[#79b8a7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#79b8a7]"
          >
            <span>Đặt lịch</span>
            <span className="flex size-7 items-center justify-center rounded-full bg-[#79b8a7]/20 text-[#79b8a7] transition-all duration-300 group-hover/btn:bg-[#79b8a7] group-hover/btn:text-[#07110f] group-hover/btn:rotate-45">
              <ArrowUpRight className="size-3.5 stroke-[2]" aria-hidden="true" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
