import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function MarketingPageShell({
  children,
  className,
  showMotif = true,
}: {
  children: ReactNode
  className?: string
  showMotif?: boolean
}) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden bg-[#07110f] text-[#f2f5f3]",
        className,
      )}
    >
      {showMotif && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-[34rem] -top-[56rem] size-[78rem] rounded-full border border-[#2f7a68]/25"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-[34rem] top-[38%] size-[76rem] rounded-full border border-[#2f7a68]/20"
          />
        </>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
