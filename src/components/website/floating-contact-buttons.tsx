"use client"

import { useState, useRef, useEffect } from "react"
import { Phone, X, MessageCircle } from "lucide-react"

function ZaloIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.03 2 11c0 2.652 1.28 5.032 3.328 6.648-.12 1.48-.68 3.03-.703 3.104a.6.6 0 0 0 .783.714c1.68-.7 3.09-1.42 3.738-1.77.904.2 1.86.304 2.854.304 5.523 0 10-4.03 10-9S17.523 2 12 2z"
        fill="white"
      />
      <text
        x="12"
        y="11.5"
        textAnchor="middle"
        dominantBaseline="central"
        fill="black"
        style={{ fontSize: "5.5px", fontWeight: "900", fontFamily: "system-ui, sans-serif" }}
      >
        Zalo
      </text>
    </svg>
  )
}

function MessengerIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.5 3.17 7.37.16.15.26.37.26.6v2.24c0 .52.54.87 1.01.64l2.5-1.1c.17-.07.36-.09.55-.04.8.22 1.64.34 2.51.34 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm1.05 13.06l-2.61-2.78-5.1 2.78c-.56.31-1.22-.24-.97-.83l5.37-8.52c.31-.5 1.05-.51 1.38-.03l2.61 2.78 5.1-2.78c.56-.31 1.22.24.97.83l-5.37 8.52c-.31.5-1.05.51-1.38.03z" />
    </svg>
  )
}

interface SocialContact {
  id: string
  label: string
  sublabel: string
  href: string
  icon: React.ReactNode
  color: string
}

const SOCIAL_CONTACTS: SocialContact[] = [
  {
    id: "phone",
    label: "Hotline",
    sublabel: "0981 378 179",
    href: "tel:0981378179",
    icon: <Phone className="size-5 text-white animate-phone-ring" />,
    color: "hover:bg-[#1f6b5c] hover:border-[#79b8a7]",
  },
  {
    id: "zalo",
    label: "Nhắn Zalo",
    sublabel: "ToTo Barbershop",
    href: "https://zalo.me/0981378179",
    icon: <ZaloIcon className="size-5" />,
    color: "hover:bg-[#0068FF] hover:border-[#0068FF]/50",
  },
  {
    id: "messenger",
    label: "Messenger",
    sublabel: "Fanpage ToTo",
    href: "https://www.facebook.com/totobarbershopHCM/?locale=vi_VN",
    icon: <MessengerIcon className="size-5 text-white" />,
    color: "hover:bg-[#0084FF] hover:border-[#0084FF]/50",
  },
]

export function FloatingContactButtons() {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Click outside or press Escape to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className="fixed bottom-6 right-6 z-50 flex flex-row-reverse items-center md:bottom-8 md:right-8"
      aria-label="Cụm nút liên hệ ToTo Barbershop"
    >
      {/* Main Hub Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Đóng menu liên hệ" : "Mở menu liên hệ ToTo"}
        title={isOpen ? "Đóng liên hệ" : "Liên hệ ToTo Barbershop (Click để mở)"}
        className="group relative flex size-12 items-center justify-center rounded-full border border-[#79b8a7]/40 bg-[#07110f]/95 text-white shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-[#79b8a7] hover:bg-primary active:scale-95 md:size-14 cursor-pointer"
      >
        {/* Radar concentric pulse rings (only active when closed) */}
        {!isOpen && (
          <>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#79b8a7] animate-radar-pulse"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full border border-[#79b8a7]/70 animate-radar-pulse-delayed"
            />
          </>
        )}

        {/* Live status dot */}
        <span
          aria-hidden="true"
          className="absolute -right-0.5 -top-0.5 flex size-3.5 items-center justify-center"
        >
          <span className="absolute size-3 rounded-full bg-[#79b8a7] animate-live-dot" />
          <span className="relative size-2 rounded-full bg-[#a8e0d1]" />
        </span>

        {/* Icon with smooth rotation transition */}
        <span
          className={`relative flex items-center justify-center transition-transform duration-300 ${isOpen ? "rotate-90 scale-100" : "rotate-0 scale-100"
            }`}
        >
          {isOpen ? (
            <X className="size-6 text-white" />
          ) : (
            <MessageCircle className="size-6 text-[#79b8a7] transition-colors group-hover:text-white" />
          )}
        </span>
      </button>

      {/* 3 Floating Action Buttons (Slides out horizontally to the left) */}
      <div
        className={`mr-3 flex items-center gap-3 transition-all duration-300 ease-out ${isOpen
          ? "pointer-events-auto translate-x-0 opacity-100 scale-100"
          : "pointer-events-none translate-x-6 opacity-0 scale-90"
          }`}
      >
        {SOCIAL_CONTACTS.map((item, index) => (
          <a
            key={item.id}
            href={item.href}
            target={item.href.startsWith("tel:") ? undefined : "_blank"}
            rel={item.href.startsWith("tel:") ? undefined : "noopener noreferrer"}
            tabIndex={isOpen ? 0 : -1}
            aria-label={`${item.label} - ${item.sublabel}`}
            className={`group relative flex items-center transition-all duration-300 ease-out ${isOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
              }`}
            style={{
              transitionDelay: isOpen ? `${index * 50}ms` : "0ms",
            }}
          >
            {/* Tooltip on top of each button */}
            <span className="pointer-events-none absolute bottom-full left-1/2 mb-2.5 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/15 bg-[#07110f]/95 px-2.5 py-1 text-center opacity-0 shadow-2xl backdrop-blur-md transition-all duration-200 group-hover:opacity-100 group-hover:-translate-y-1">
              <span className="block font-sans text-[11px] font-bold text-white">
                {item.label}
              </span>
              <span className="block font-mono text-[9px] text-[#79b8a7]">
                {item.sublabel}
              </span>
            </span>

            {/* Circular Button */}
            <span
              className={`relative flex size-11 items-center justify-center rounded-full border border-white/20 bg-[#07110f]/95 text-white shadow-xl backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(121,184,167,0.35)] group-active:scale-95 md:size-12 ${item.color}`}
            >
              {item.icon}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
