import type { ReactNode } from "react"
import { HomeScrollShell } from "@/components/website/home/home-scroll-shell"

export default function WebsiteTemplate({ children }: { children: ReactNode }) {
  return <HomeScrollShell>{children}</HomeScrollShell>
}
