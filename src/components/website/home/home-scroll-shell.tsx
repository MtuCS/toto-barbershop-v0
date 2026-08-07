"use client"

import { type ReactNode, useCallback, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import styles from "./home-scroll-shell.module.css"

const HEADER_HEIGHT = 64
const SCENE_SELECTOR = "[data-home-scene]"
const TRANSITION_DURATION = 760
const REDUCED_TRANSITION_DURATION = 1
const WHEEL_THRESHOLD = 10
const WHEEL_QUIET_PERIOD = 180
const SCENE_EDGE_TOLERANCE = 4

interface HomeScrollShellProps {
  children: ReactNode
}

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false

  return Boolean(
    target.closest(
      'input, textarea, select, button, [contenteditable="true"], [role="dialog"], [data-home-scroll-native]',
    ),
  )
}

function hasNativeScrollTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false
  if (isInteractiveTarget(target)) return true

  let element: Element | null = target
  while (element && element !== document.documentElement) {
    const computed = window.getComputedStyle(element)
    const canScroll =
      /(auto|scroll)/.test(computed.overflowY) &&
      element.scrollHeight > element.clientHeight

    if (canScroll) return true
    element = element.parentElement
  }

  return false
}

function getKeyboardDirection(key: string) {
  if (key === "ArrowDown" || key === "PageDown") return 1
  if (key === "ArrowUp" || key === "PageUp") return -1
  return 0
}

export function HomeScrollShell({ children }: HomeScrollShellProps) {
  const pathname = usePathname()
  const rootRef = useRef<HTMLDivElement>(null)
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const unlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isAnimatingRef = useRef(false)
  const inputLockedRef = useRef(false)
  const lastWheelAtRef = useRef(0)
  const wheelDeltaRef = useRef(0)
  const isHome = pathname === "/"

  const getScenes = useCallback(() => {
    return Array.from(
      document.querySelectorAll<HTMLElement>(SCENE_SELECTOR),
    )
  }, [])

  const getSceneStart = useCallback((scene: HTMLElement) => {
    return scene.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT
  }, [])

  const getSceneRange = useCallback(
    (scene: HTMLElement) => {
      const start = Math.max(0, getSceneStart(scene))
      const documentTop = start + HEADER_HEIGHT
      const end = Math.max(
        start,
        documentTop + scene.offsetHeight - window.innerHeight,
      )

      return { start, end }
    },
    [getSceneStart],
  )

  const getCurrentSceneIndex = useCallback(
    (scenes: HTMLElement[]) => {
      const probe = window.scrollY + HEADER_HEIGHT + SCENE_EDGE_TOLERANCE
      let currentIndex = 0

      scenes.forEach((scene, index) => {
        const documentTop = getSceneStart(scene) + HEADER_HEIGHT
        if (documentTop <= probe) currentIndex = index
      })

      return currentIndex
    },
    [getSceneStart],
  )

  const setActiveScene = useCallback(
    (scenes: HTMLElement[], activeIndex: number) => {
      scenes.forEach((scene, index) => {
        scene.dataset.homeSceneActive = String(index === activeIndex)
      })
    },
    [],
  )

  const clearTimers = useCallback(() => {
    if (transitionTimerRef.current !== null) {
      clearTimeout(transitionTimerRef.current)
      transitionTimerRef.current = null
    }

    if (unlockTimerRef.current !== null) {
      clearTimeout(unlockTimerRef.current)
      unlockTimerRef.current = null
    }
  }, [])

  const queueUnlockAfterQuiet = useCallback(() => {
    if (unlockTimerRef.current !== null) clearTimeout(unlockTimerRef.current)

    const elapsed = performance.now() - lastWheelAtRef.current
    const delay = Math.max(0, WHEEL_QUIET_PERIOD - elapsed)

    unlockTimerRef.current = setTimeout(() => {
      unlockTimerRef.current = null
      if (isAnimatingRef.current) return

      inputLockedRef.current = false
      wheelDeltaRef.current = 0
    }, delay)
  }, [])

  const scrollToScene = useCallback(
    (scenes: HTMLElement[], targetIndex: number) => {
      const target = scenes[targetIndex]
      if (!target) return

      clearTimers()
      isAnimatingRef.current = true
      inputLockedRef.current = true
      wheelDeltaRef.current = 0
      setActiveScene(scenes, targetIndex)

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches
      const duration = reduceMotion
        ? REDUCED_TRANSITION_DURATION
        : TRANSITION_DURATION

      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      })

      transitionTimerRef.current = setTimeout(() => {
        transitionTimerRef.current = null
        isAnimatingRef.current = false
        queueUnlockAfterQuiet()
      }, duration)
    },
    [clearTimers, queueUnlockAfterQuiet, setActiveScene],
  )

  const canScrollInsideScene = useCallback(
    (scene: HTMLElement, direction: number) => {
      const allowsInternalScroll =
        window.innerWidth < 1024 || scene.dataset.homeSceneScroll === "inside"

      if (!allowsInternalScroll) return false

      const { start, end } = getSceneRange(scene)

      return direction > 0
        ? window.scrollY < end - SCENE_EDGE_TOLERANCE
        : window.scrollY > start + SCENE_EDGE_TOLERANCE
    },
    [getSceneRange],
  )

  const scrollInsideScene = useCallback(
    (scene: HTMLElement, direction: number, distance: number) => {
      const { start, end } = getSceneRange(scene)
      const nextPosition = Math.min(
        end,
        Math.max(start, window.scrollY + direction * Math.abs(distance)),
      )

      window.scrollTo({ top: nextPosition, behavior: "auto" })

      const reachedEdge =
        direction > 0
          ? nextPosition >= end - SCENE_EDGE_TOLERANCE
          : nextPosition <= start + SCENE_EDGE_TOLERANCE

      if (reachedEdge) {
        inputLockedRef.current = true
        queueUnlockAfterQuiet()
      }
    },
    [getSceneRange, queueUnlockAfterQuiet],
  )

  useEffect(() => {
    if (!isHome) return

    const html = document.documentElement
    html.dataset.homeScrollSnap = "true"

    const syncActiveScene = () => {
      if (isAnimatingRef.current) return
      const scenes = getScenes()
      if (!scenes.length) return
      setActiveScene(scenes, getCurrentSceneIndex(scenes))
    }

    const handleWheel = (event: WheelEvent) => {
      if (hasNativeScrollTarget(event.target)) return

      lastWheelAtRef.current = performance.now()

      if (inputLockedRef.current) {
        event.preventDefault()
        queueUnlockAfterQuiet()
        return
      }

      const deltaMultiplier =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? 16
          : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? window.innerHeight
            : 1

      wheelDeltaRef.current += event.deltaY * deltaMultiplier
      if (Math.abs(wheelDeltaRef.current) < WHEEL_THRESHOLD) {
        event.preventDefault()
        return
      }

      const direction = wheelDeltaRef.current > 0 ? 1 : -1
      const distance = Math.min(Math.abs(wheelDeltaRef.current), 160)
      wheelDeltaRef.current = 0

      const scenes = getScenes()
      if (!scenes.length) return

      const currentIndex = getCurrentSceneIndex(scenes)
      const currentScene = scenes[currentIndex]

      if (canScrollInsideScene(currentScene, direction)) {
        event.preventDefault()
        scrollInsideScene(currentScene, direction, distance)
        return
      }

      const targetIndex = currentIndex + direction
      event.preventDefault()

      if (targetIndex < 0 || targetIndex >= scenes.length) return
      scrollToScene(scenes, targetIndex)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        isInteractiveTarget(event.target)
      ) {
        return
      }

      const direction = getKeyboardDirection(event.key)
      if (!direction) return

      event.preventDefault()
      if (event.repeat || inputLockedRef.current) return

      const scenes = getScenes()
      if (!scenes.length) return

      const currentIndex = getCurrentSceneIndex(scenes)
      const currentScene = scenes[currentIndex]

      if (canScrollInsideScene(currentScene, direction)) {
        const isPageKey = event.key === "PageDown" || event.key === "PageUp"
        const distance = isPageKey
          ? Math.max(120, window.innerHeight - HEADER_HEIGHT - 48)
          : 96

        inputLockedRef.current = true
        scrollInsideScene(currentScene, direction, distance)
        lastWheelAtRef.current = performance.now()
        queueUnlockAfterQuiet()
        return
      }

      const targetIndex = currentIndex + direction
      if (targetIndex < 0 || targetIndex >= scenes.length) return
      scrollToScene(scenes, targetIndex)
    }

    syncActiveScene()
    window.addEventListener("wheel", handleWheel, { passive: false })
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("scroll", syncActiveScene, { passive: true })
    window.addEventListener("resize", syncActiveScene)

    return () => {
      delete html.dataset.homeScrollSnap
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("scroll", syncActiveScene)
      window.removeEventListener("resize", syncActiveScene)
      clearTimers()
      isAnimatingRef.current = false
      inputLockedRef.current = false
      wheelDeltaRef.current = 0
    }
  }, [
    canScrollInsideScene,
    clearTimers,
    getCurrentSceneIndex,
    getScenes,
    isHome,
    queueUnlockAfterQuiet,
    scrollInsideScene,
    scrollToScene,
    setActiveScene,
  ])

  if (!isHome) return children

  return (
    <div ref={rootRef} className={styles.root}>
      {children}
    </div>
  )
}
