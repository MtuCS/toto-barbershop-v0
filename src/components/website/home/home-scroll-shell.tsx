"use client"

import { type ReactNode, useCallback, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import styles from "./home-scroll-shell.module.css"

const HEADER_HEIGHT = 64
const DESKTOP_QUERY = "(min-width: 1024px)"
const TRANSITION_DURATION = 720
const WHEEL_THRESHOLD = 8

interface HomeScrollShellProps {
  children: ReactNode
}

interface HomeScene {
  id: string
  anchor: HTMLElement
  elements: HTMLElement[]
}

function hasNativeScrollTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false
  if (target.closest('input, textarea, select, [role="dialog"], [data-home-scroll-native]')) return true

  let element: Element | null = target
  while (element && element !== document.documentElement) {
    const styles = window.getComputedStyle(element)
    const canScroll = /(auto|scroll)/.test(styles.overflowY) && element.scrollHeight > element.clientHeight
    if (canScroll) return true
    element = element.parentElement
  }
  return false
}

function easeInOutCubic(progress: number) {
  return progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2
}

export function HomeScrollShell({ children }: HomeScrollShellProps) {
  const pathname = usePathname()
  const rootRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const unlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isAnimatingRef = useRef(false)
  const wheelDeltaRef = useRef(0)
  const isHome = pathname === "/"

  const getScenes = useCallback((): HomeScene[] => {
    const elements = Array.from(rootRef.current?.children ?? []) as HTMLElement[]
    if (elements.length < 8) return []

    return [
      { id: "hero", anchor: elements[0], elements: [elements[0]] },
      { id: "visual", anchor: elements[1], elements: [elements[1], elements[2]] },
      { id: "services", anchor: elements[3], elements: [elements[3]] },
      { id: "about", anchor: elements[4], elements: [elements[4]] },
      { id: "lookbook", anchor: elements[5], elements: [elements[5]] },
      { id: "merch", anchor: elements[6], elements: [elements[6]] },
      { id: "social", anchor: elements[7], elements: [elements[7]] },
    ]
  }, [])

  const getSceneTop = useCallback((scene: HomeScene) => {
    return scene.anchor.offsetTop - HEADER_HEIGHT
  }, [])

  const getClosestSceneIndex = useCallback((scenes: HomeScene[]) => {
    let closestIndex = 0
    let closestDistance = Number.POSITIVE_INFINITY
    scenes.forEach((scene, index) => {
      const distance = Math.abs(scene.anchor.getBoundingClientRect().top - HEADER_HEIGHT)
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })
    return closestIndex
  }, [])

  const setActiveScene = useCallback((scenes: HomeScene[], activeId: string) => {
    scenes.forEach((scene) => {
      scene.elements.forEach((element) => {
        element.dataset.homeSceneActive = String(scene.id === activeId)
      })
    })
  }, [])

  const scrollToScene = useCallback((scenes: HomeScene[], scene: HomeScene) => {
    const start = window.scrollY
    const distance = getSceneTop(scene) - start
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const duration = reduceMotion ? 1 : TRANSITION_DURATION
    const startedAt = performance.now()

    isAnimatingRef.current = true
    setActiveScene(scenes, scene.id)
    if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current)
    if (unlockTimerRef.current !== null) clearTimeout(unlockTimerRef.current)

    const step = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1)
      window.scrollTo(0, start + distance * easeInOutCubic(progress))
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(step)
        return
      }

      animationFrameRef.current = null
      unlockTimerRef.current = setTimeout(() => {
        isAnimatingRef.current = false
        wheelDeltaRef.current = 0
      }, 80)
    }

    animationFrameRef.current = requestAnimationFrame(step)
  }, [getSceneTop, setActiveScene])

  useEffect(() => {
    if (!isHome) return
    const desktopQuery = window.matchMedia(DESKTOP_QUERY)

    const syncActiveScene = () => {
      if (!desktopQuery.matches || isAnimatingRef.current) return
      const scenes = getScenes()
      const scene = scenes[getClosestSceneIndex(scenes)]
      if (scene) setActiveScene(scenes, scene.id)
    }

    const handleWheel = (event: WheelEvent) => {
      if (!desktopQuery.matches || hasNativeScrollTarget(event.target)) return
      const scenes = getScenes()
      if (!scenes.length) return

      const firstTop = getSceneTop(scenes[0])
      const lastTop = getSceneTop(scenes[scenes.length - 1])
      const aboveExperience = window.scrollY < firstTop - 2
      const belowExperience = window.scrollY > lastTop + 2
      if ((aboveExperience && event.deltaY < 0) || (belowExperience && event.deltaY > 0)) return

      if (isAnimatingRef.current) {
        event.preventDefault()
        return
      }

      wheelDeltaRef.current += event.deltaY
      if (Math.abs(wheelDeltaRef.current) < WHEEL_THRESHOLD) {
        event.preventDefault()
        return
      }

      const direction = wheelDeltaRef.current > 0 ? 1 : -1
      const currentIndex = belowExperience ? scenes.length : getClosestSceneIndex(scenes)
      const targetIndex = currentIndex + direction
      wheelDeltaRef.current = 0
      if (targetIndex < 0 || targetIndex >= scenes.length) return

      event.preventDefault()
      scrollToScene(scenes, scenes[targetIndex])
    }

    syncActiveScene()
    window.addEventListener("wheel", handleWheel, { passive: false })
    window.addEventListener("scroll", syncActiveScene, { passive: true })
    desktopQuery.addEventListener("change", syncActiveScene)
    return () => {
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("scroll", syncActiveScene)
      desktopQuery.removeEventListener("change", syncActiveScene)
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current)
      if (unlockTimerRef.current !== null) clearTimeout(unlockTimerRef.current)
    }
  }, [getClosestSceneIndex, getSceneTop, getScenes, isHome, scrollToScene, setActiveScene])

  if (!isHome) return children

  return <div ref={rootRef} className={styles.root}>{children}</div>
}
