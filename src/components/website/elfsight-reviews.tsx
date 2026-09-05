"use client"

import { useEffect } from "react"
import Script from "next/script"

export function ElfsightReviews() {
  useEffect(() => {
    // Re-initialize Elfsight widget on client route navigation
    if (typeof window !== "undefined" && (window as any).elfsight) {
      try {
        (window as any).elfsight.initialize()
      } catch {
        // ignore error
      }
    }
  }, [])

  return (
    <div className="w-full min-h-[250px]">
      <Script
        src="https://elfsightcdn.com/platform.js"
        strategy="lazyOnload"
      />
      <div
        className="elfsight-app-69356c06-e920-419c-bd65-de3b4e3ba090"
        data-elfsight-app-lazy
      />
    </div>
  )
}
