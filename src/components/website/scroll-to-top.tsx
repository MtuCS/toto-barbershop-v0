"use client"

import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()

  // Ensure scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }, [pathname])

  // Toggle visibility based on scroll position
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  if (!isVisible) return null

  return (
    <Button
      onClick={scrollToTop}
      variant="outline"
      size="icon"
      className="fixed bottom-[5.25rem] md:bottom-24 right-6 md:right-8 z-40 size-11 md:size-12 rounded-full border border-white/20 bg-[#07110f]/85 text-white shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-[#79b8a7]/60 hover:bg-primary hover:text-white active:scale-95 animate-in fade-in slide-in-from-bottom-3"
      aria-label="Cuộn lên đầu trang"
    >
      <ArrowUp className="size-5" />
    </Button>
  )
}
