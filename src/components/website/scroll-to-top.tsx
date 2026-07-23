"use client"

import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

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
      className="fixed bottom-6 right-6 z-[999] rounded-full border-neutral-200 bg-white/90 text-neutral-900 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white hover:text-primary active:scale-95 animate-in fade-in slide-in-from-bottom-5"
      aria-label="Cuộn lên đầu trang"
    >
      <ArrowUp className="size-5" />
    </Button>
  )
}
