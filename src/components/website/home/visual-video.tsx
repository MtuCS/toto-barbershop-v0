"use client"

import { useRef } from "react"
import Image from "next/image"

export function VisualVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => { })
    }
  }

  return (
    <section className="relative z-10 border-b border-border bg-[#07110f]">
      <div className="relative w-full">
        {/* Clickable T_logo_1 watermark overlay to restart video from 0:00 */}
        <div className="absolute top-1.5 sm:top-2 md:top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
          <button
            type="button"
            onClick={handleRestart}
            aria-label="Phát lại video từ đầu"
            title="Bấm để phát lại video từ đầu"
            className="group relative block h-7 w-24 sm:h-8 sm:w-32 md:h-10 md:w-40 transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none cursor-pointer select-none"
          >
            <Image
              src="/images/T_logo_1.png"
              alt="ToTo Barbershop"
              fill
              sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, 160px"
              className="object-contain brightness-0 invert drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]"
              priority
            />
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
