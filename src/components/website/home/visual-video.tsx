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
        <div className="absolute top-1 sm:top-1.5 md:top-2 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
          <button
            type="button"
            onClick={handleRestart}
            aria-label="Phát lại video từ đầu"
            title="Bấm để phát lại video từ đầu"
            className="group relative block h-9 w-32 sm:h-11 sm:w-44 md:h-13 md:w-52 lg:h-16 lg:w-64 transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none cursor-pointer select-none"
          >
            <Image
              src="/images/T_logo_1.png"
              alt="ToTo Barbershop"
              fill
              sizes="(max-width: 640px) 128px, (max-width: 768px) 176px, (max-width: 1024px) 208px, 256px"
              className="object-contain brightness-0 invert drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]"
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
