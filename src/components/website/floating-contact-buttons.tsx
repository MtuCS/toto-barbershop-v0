"use client"

import { Phone } from "lucide-react"

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
    icon: <Phone className="size-5 text-white" />,
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
    href: "https://m.me/totobarbershopHCM",
    icon: <MessengerIcon className="size-5 text-white" />,
    color: "hover:bg-[#0084FF] hover:border-[#0084FF]/50",
  },
]

export function FloatingContactButtons() {
  return (
    <aside
      className="fixed bottom-6 right-4 z-40 flex flex-col items-center gap-3 md:bottom-8 md:right-6"
      aria-label="Kênh liên hệ nhanh ToTo Barbershop"
    >
      {SOCIAL_CONTACTS.map((item) => (
        <a
          key={item.id}
          href={item.href}
          target={item.href.startsWith("tel:") ? undefined : "_blank"}
          rel={item.href.startsWith("tel:") ? undefined : "noopener noreferrer"}
          aria-label={`${item.label} - ${item.sublabel}`}
          className="group relative flex items-center justify-center transition-transform duration-200 active:scale-95"
        >
          {/* Tooltip on the left side of each button on hover */}
          <span className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-md border border-white/15 bg-[#07110f]/95 px-2.5 py-1 text-center opacity-0 shadow-2xl backdrop-blur-md transition-all duration-200 group-hover:opacity-100 group-hover:-translate-x-0.5">
            <span className="block font-sans text-[11px] font-bold text-white">
              {item.label}
            </span>
            <span className="block font-mono text-[9px] text-[#79b8a7]">
              {item.sublabel}
            </span>
          </span>

          {/* Circular Button */}
          <span
            className={`relative flex size-11 items-center justify-center rounded-full border border-white/20 bg-[#07110f]/95 text-white shadow-xl backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(121,184,167,0.35)] md:size-12 ${item.color}`}
          >
            {item.id === "phone" && (
              <span
                aria-hidden="true"
                className="absolute -right-0.5 -top-0.5 flex size-3 items-center justify-center"
              >
                <span className="absolute size-2.5 rounded-full bg-[#79b8a7] animate-ping opacity-75" />
                <span className="relative size-2 rounded-full bg-[#79b8a7]" />
              </span>
            )}
            {item.icon}
          </span>
        </a>
      ))}
    </aside>
  )
}
