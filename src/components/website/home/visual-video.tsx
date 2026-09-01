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
        <div className="absolute top-4 sm:top-6 md:top-8 lg:top-10 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
          <button
            type="button"
            onClick={handleRestart}
            aria-label="Phát lại video từ đầu"
            title="Bấm để phát lại video từ đầu"
            className="group relative block h-14 w-48 sm:h-20 sm:w-64 md:h-28 md:w-96 lg:h-36 lg:w-[460px] xl:h-40 xl:w-[520px] transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none cursor-pointer select-none"
          >
            <Image
              src="/images/T_logo_1.png"
              alt="ToTo Barbershop"
              fill
              sizes="(max-width: 640px) 200px, (max-width: 768px) 300px, (max-width: 1024px) 400px, 520px"
              className="object-contain brightness-0 invert drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]"
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
