"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Phone, ShoppingBag, ShoppingCart } from "lucide-react"
import { useCartStore } from "@/store/cart-store"

export function StickyMobileCta() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [mounted, setMounted] = useState(false)
  const items = useCartStore((s) => s.items)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > 150) {
        if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 10) {
          // Scrolling down -> show
          setIsVisible(true)
        }
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  if (!mounted) return null

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 block md:hidden transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto flex items-center justify-between gap-2 border-t border-white/15 bg-[#050c0a]/95 px-4 py-2.5 shadow-[0_-8px_30px_rgba(0,0,0,0.6)] backdrop-blur-lg">
        {/* Hotline Call */}
        <a
          href="tel:0981378179"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/5 py-2.5 text-xs font-semibold text-white/90 active:bg-white/10"
        >
          <Phone className="size-3.5 text-[#79b8a7]" />
          <span>Hotline</span>
        </a>

        {/* Shop Now Main Button */}
        <Link
          href="/shop"
          className="flex flex-[1.6] items-center justify-center gap-1.5 rounded-full bg-[#79b8a7] py-2.5 text-xs font-bold uppercase tracking-wider text-[#050c0a] shadow-[0_0_15px_rgba(121,184,167,0.3)] active:bg-[#8ec7b7]"
        >
          <ShoppingBag className="size-3.5" />
          <span>Ghé Shop</span>
        </Link>

        {/* Cart Quick View */}
        <Link
          href="/cart"
          className="relative flex flex-1 items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/5 py-2.5 text-xs font-semibold text-white/90 active:bg-white/10"
        >
          <ShoppingCart className="size-3.5 text-[#79b8a7]" />
          <span>Giỏ</span>
          {itemCount > 0 && (
            <span className="flex size-4 items-center justify-center rounded-full bg-[#d71920] text-[9px] font-bold text-white">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </div>
  )
}
