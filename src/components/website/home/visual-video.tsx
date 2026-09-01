"use client"

import { useRef } from "react"

export function VisualVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    }
  }

  return (
    <section className="relative z-10 border-b border-border bg-[#07110f]">
      <div className="relative w-full">
        {/* Clickable 'toto' logo/watermark overlay to restart video from 0:00 */}
        <div className="absolute top-4 md:top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
          <button
            type="button"
            onClick={handleRestart}
            aria-label="Phát lại video từ đầu"
            title="Bấm để phát lại video từ đầu"
            className="group font-agatho text-2xl md:text-3xl lg:text-4xl font-bold tracking-[0.2em] text-white/90 transition-all duration-300 hover:text-white hover:scale-105 active:scale-95 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] focus:outline-none cursor-pointer select-none"
          >
            toto
          </button>
        </div>

        <div className="relative w-full overflow-hidden lg:h-full lg:bg-black">
          <video
            ref={videoRef}
            src="/images/TotoVisual.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Visual ToTo Barbershop"
            className="block h-auto w-full lg:absolute lg:inset-0 lg:h-full lg:object-contain"
          />
        </div>
      </div>
    </section>
  )
}
