"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { NavLink } from "@/lib/constants"
import styles from "./gooey-nav.module.css"

type GooeyNavProps = { items: NavLink[] }

function getActiveHref(pathname: string, items: NavLink[]) {
  return [...items]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`)))?.href ?? null
}

export function GooeyNav({ items }: GooeyNavProps) {
  const pathname = usePathname()
  const activeHref = getActiveHref(pathname, items)

  return (
    <div className={styles.container}>
      <nav aria-label="Điều hướng chính">
        <ul className={styles.list}>
          {items.map((item) => {
            const isActive = item.href === activeHref

            return (
              <li
                key={item.href}
                className={`${styles.item} ${isActive ? styles.active : ""}`}
              >
                <Link href={item.href} aria-current={isActive ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
