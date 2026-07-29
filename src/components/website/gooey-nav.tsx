"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { NavLink } from "@/lib/constants"
import styles from "./gooey-nav.module.css"

type GooeyNavProps = { items: NavLink[] }

function getActiveHref(pathname: string, items: NavLink[]) {
  return [...items]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.href ?? null
}

export function GooeyNav({ items }: GooeyNavProps) {
  const pathname = usePathname()
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const effectRef = useRef<HTMLSpanElement>(null)
  const particleTimeouts = useRef<number[]>([])
  const [pendingHref, setPendingHref] = useState<string | null>(null)
  const routeActiveHref = getActiveHref(pathname, items)
  // Home is represented by the logo, not an item in this navigation.
  const activeHref = pathname === "/"
    ? null
    : pendingHref && pendingHref !== routeActiveHref
      ? pendingHref
      : routeActiveHref
  const [reducedMotion, setReducedMotion] = useState(false)
  const activeIndex = activeHref ? items.findIndex((item) => item.href === activeHref) : -1

  const clearParticles = useCallback(() => {
    particleTimeouts.current.forEach(window.clearTimeout)
    particleTimeouts.current = []
    effectRef.current?.querySelectorAll(`.${styles.particle}`).forEach((particle) => particle.remove())
  }, [])

  const positionEffect = useCallback((index: number) => {
    const container = containerRef.current
    const target = itemRefs.current[index]
    const effect = effectRef.current
    if (!container || !target || !effect) return

    const containerRect = container.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    const underlineInset = 12
    Object.assign(effect.style, {
      left: `${targetRect.left - containerRect.left + underlineInset}px`,
      top: `${targetRect.bottom - containerRect.top - 2}px`,
      width: `${Math.max(targetRect.width - underlineInset * 2, 24)}px`,
      height: "2px",
    })
  }, [])

  const makeParticles = useCallback(() => {
    const effect = effectRef.current
    if (!effect || reducedMotion) return
    clearParticles()

    for (let index = 0; index < 12; index += 1) {
      const angle = (Math.PI * 2 * index) / 12 + (Math.random() - 0.5) * 0.2
      const distance = 26 + Math.random() * 36
      const particle = document.createElement("span")
      particle.className = styles.particle
      particle.style.setProperty("--x", `${Math.cos(angle) * distance}px`)
      particle.style.setProperty("--y", `${Math.sin(angle) * distance}px`)
      particle.style.setProperty("--delay", `${Math.round(Math.random() * 90)}ms`)
      particle.style.setProperty("--scale", `${0.7 + Math.random() * 0.7}`)
      effect.appendChild(particle)
      particleTimeouts.current.push(window.setTimeout(() => particle.remove(), 750))
    }
  }, [clearParticles, reducedMotion])


  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updatePreference = () => setReducedMotion(mediaQuery.matches)
    updatePreference()
    mediaQuery.addEventListener("change", updatePreference)
    return () => mediaQuery.removeEventListener("change", updatePreference)
  }, [])

  useEffect(() => {
    setPendingHref(null)
  }, [pathname])

  useEffect(() => {
    if (activeIndex < 0) {
      clearParticles()
      return
    }

    positionEffect(activeIndex)
    const container = containerRef.current
    if (!container) return
    const observer = new ResizeObserver(() => positionEffect(activeIndex))
    const handleResize = () => positionEffect(activeIndex)
    observer.observe(container)
    window.addEventListener("resize", handleResize)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", handleResize)
    }
  }, [activeIndex, clearParticles, positionEffect])

  useEffect(() => clearParticles, [clearParticles])

  const activate = (index: number) => {
    if (index === activeIndex) return
    setPendingHref(items[index].href)
    requestAnimationFrame(() => {
      positionEffect(index)
      makeParticles()
    })
  }

  return (
    <div ref={containerRef} className={styles.container}>
      <nav aria-label="Điều hướng chính">
        <ul className={styles.list}>
          {items.map((item, index) => {
            const isActive = item.href === activeHref
            return (
              <li key={item.href} ref={(element) => { itemRefs.current[index] = element }} className={`${styles.item} ${isActive ? styles.active : ""} ${item.highlight ? styles.highlight : ""}`}>
                <Link href={item.href} aria-current={isActive ? "page" : undefined} onClick={() => activate(index)} onKeyDown={(event) => {
                  if (event.key === " ") {
                    event.preventDefault()
                    event.currentTarget.click()
                  }
                }}>
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <span
        ref={effectRef}
        className={`${styles.effect} ${activeIndex < 0 ? styles.effectHidden : ""}`}
        data-testid="gooey-nav-effect"
        aria-hidden="true"
      />
    </div>
  )
}