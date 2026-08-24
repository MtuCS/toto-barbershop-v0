"use client"

import { useEffect, useRef } from "react"

export function ElfsightReviews() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 1. Check if script is already present
    const scriptId = "elfsight-platform-script"
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script")
      script.id = scriptId
      script.src = "https://elfsightcdn.com/platform.js"
      script.async = true
      document.body.appendChild(script)
    }

    // 2. Hide branding pill safely without failing offsetWidth checks
    const hideBadge = () => {
      if (!containerRef.current) return
      const badges = containerRef.current.querySelectorAll(
        'a[href*="elfsight.com"], [class*="Badge__BadgeContainer"], [class*="Badge__Container"], [class*="Badge__Link"]'
      )
      badges.forEach((badge) => {
        const el = badge as HTMLElement
        el.style.setProperty("transform", "translateY(5000px) scale(0.001)", "important")
        el.style.setProperty("opacity", "0.001", "important")
        el.style.setProperty("pointer-events", "none", "important")
      })
    }

    const observer = new MutationObserver(() => {
      hideBadge()
    })

    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
      })
    }

    const interval = setInterval(hideBadge, 300)

    return () => {
      observer.disconnect()
      clearInterval(interval)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="elfsight-reviews-wrapper relative w-full overflow-hidden"
    >
      <style jsx global>{`
        .elfsight-reviews-wrapper a[href*="elfsight.com"],
        .elfsight-reviews-wrapper [class*="Badge__BadgeContainer"],
        .elfsight-reviews-wrapper [class*="Badge__Container"],
        .elfsight-reviews-wrapper [class*="Badge__Link"] {
          transform: translateY(5000px) scale(0.001) !important;
          opacity: 0.001 !important;
          pointer-events: none !important;
        }
      `}</style>

      <div
        className="elfsight-app-69356c06-e920-419c-bd65-de3b4e3ba090"
      />
    </div>
  )
}
