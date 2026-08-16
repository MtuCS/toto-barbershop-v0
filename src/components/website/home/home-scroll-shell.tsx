"use client"

import { gsap } from "gsap"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import { usePathname } from "next/navigation"
import { type ReactNode, useCallback, useEffect, useRef } from "react"
import styles from "./home-scroll-shell.module.css"

gsap.registerPlugin(ScrollToPlugin)

const HEADER_HEIGHT = 64
const DESKTOP_BREAKPOINT = 1024
const SCENE_SELECTOR = "[data-home-scene]"
const STEP_SELECTOR = ":scope > [data-home-scroll-step]"
const TRANSITION_DURATION = 0.82
const WHEEL_THRESHOLD = 10
const WHEEL_QUIET_PERIOD = 180
const STOP_EDGE_TOLERANCE = 4

interface HomeScrollShellProps {
  children: ReactNode
}

interface HomeScrollStop {
  element: HTMLElement
  scene: HTMLElement
  stepIndex: number
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

function getDirectSteps(scene: HTMLElement) {
  return Array.from(scene.querySelectorAll<HTMLElement>(STEP_SELECTOR))
}

export function HomeScrollShell({ children }: HomeScrollShellProps) {
  const pathname = usePathname()
  const scrollTweenRef = useRef<gsap.core.Tween | null>(null)
  const unlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isAnimatingRef = useRef(false)
  const inputLockedRef = useRef(false)
  const lastWheelAtRef = useRef(0)
  const wheelDeltaRef = useRef(0)
  const isHome = pathname === "/"

  const isDesktop = useCallback(() => {
    return window.innerWidth >= DESKTOP_BREAKPOINT
  }, [])

  const getScenes = useCallback(() => {
    return Array.from(document.querySelectorAll<HTMLElement>(SCENE_SELECTOR))
  }, [])

  const getStops = useCallback((): HomeScrollStop[] => {
    return getScenes().flatMap((scene) => {
      const steps =
        isDesktop() && scene.dataset.homeSceneScroll === "steps"
          ? getDirectSteps(scene)
          : []

      if (steps.length) {
        return steps.map((element, stepIndex) => ({
          element,
          scene,
          stepIndex,
        }))
      }

      return [{ element: scene, scene, stepIndex: 0 }]
    })
  }, [getScenes, isDesktop])

  const getStopStart = useCallback((stop: HomeScrollStop) => {
    return Math.max(
      0,
      stop.element.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT,
    )
  }, [])

  const getCurrentStopIndex = useCallback(
    (stops: HomeScrollStop[]) => {
      const probe = window.scrollY + STOP_EDGE_TOLERANCE
      let currentIndex = 0

      stops.forEach((stop, index) => {
        if (getStopStart(stop) <= probe) currentIndex = index
      })

      return currentIndex
    },
    [getStopStart],
  )

  const setActiveStop = useCallback(
    (stops: HomeScrollStop[], activeIndex: number) => {
      const activeStop = stops[activeIndex]
      if (!activeStop) return

      const scenes = getScenes()
      scenes.forEach((scene) => {
        const isActiveScene = scene === activeStop.scene
        const wasActiveScene = scene.dataset.homeSceneActive === "true"
        scene.dataset.homeSceneActive = String(isActiveScene)

        if (isActiveScene && !wasActiveScene) {
          const visit = Number(scene.dataset.homeSceneVisit ?? "0") + 1
          scene.dataset.homeSceneVisit = String(visit)
        }

        const steps = getDirectSteps(scene)
        steps.forEach((step, stepIndex) => {
          const isActiveStep =
            isActiveScene && stepIndex === activeStop.stepIndex
          step.dataset.homeScrollStepActive = String(isActiveStep)
        })

        if (isActiveScene) {
          scene.dataset.homeSceneStep = String(activeStop.stepIndex)
        }
      })
    },
    [getScenes],
  )

  const clearMotion = useCallback(() => {
    scrollTweenRef.current?.kill()
    scrollTweenRef.current = null
    delete document.documentElement.dataset.homeScrollAnimating

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

  const scrollToStop = useCallback(
    (stops: HomeScrollStop[], targetIndex: number) => {
      const target = stops[targetIndex]
      if (!target) return

      clearMotion()
      isAnimatingRef.current = true
      inputLockedRef.current = true
      wheelDeltaRef.current = 0
      setActiveStop(stops, targetIndex)

      const targetY = getStopStart(target)
      const html = document.documentElement
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches

      const completeTransition = () => {
        gsap.set(window, { scrollTo: { y: targetY, autoKill: false } })
        delete html.dataset.homeScrollAnimating
        scrollTweenRef.current = null
        isAnimatingRef.current = false
        queueUnlockAfterQuiet()
      }

      const interruptTransition = () => {
        delete html.dataset.homeScrollAnimating
        scrollTweenRef.current = null
        isAnimatingRef.current = false
        queueUnlockAfterQuiet()
      }

      if (reduceMotion) {
        gsap.set(window, { scrollTo: { y: targetY, autoKill: false } })
        completeTransition()
        return
      }

      html.dataset.homeScrollAnimating = "true"
      scrollTweenRef.current = gsap.to(window, {
        scrollTo: { y: targetY, autoKill: false },
        duration: TRANSITION_DURATION,
        ease: "power3.inOut",
        overwrite: true,
        onComplete: completeTransition,
        onInterrupt: interruptTransition,
      })
    },
    [clearMotion, getStopStart, queueUnlockAfterQuiet, setActiveStop],
  )

  useEffect(() => {
    if (!isHome) return

    const html = document.documentElement
    html.dataset.homeScrollSnap = "true"

    const syncActiveStop = () => {
      if (isAnimatingRef.current) return
      const stops = getStops()
      if (!stops.length) return
      setActiveStop(stops, getCurrentStopIndex(stops))
    }

    const handleWheel = (event: WheelEvent) => {
      if (!isDesktop() || hasNativeScrollTarget(event.target)) return

      event.preventDefault()
      const now = performance.now()
      const quietSinceLastInput = now - lastWheelAtRef.current
      if (
        inputLockedRef.current &&
        !isAnimatingRef.current &&
        quietSinceLastInput >= WHEEL_QUIET_PERIOD
      ) {
        inputLockedRef.current = false
        wheelDeltaRef.current = 0
      }
      lastWheelAtRef.current = now

      if (inputLockedRef.current) {
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
      if (Math.abs(wheelDeltaRef.current) < WHEEL_THRESHOLD) return

      const direction = wheelDeltaRef.current > 0 ? 1 : -1
      wheelDeltaRef.current = 0

      const stops = getStops()
      if (!stops.length) return

      const currentIndex = getCurrentStopIndex(stops)
      const targetIndex = currentIndex + direction
      if (targetIndex < 0 || targetIndex >= stops.length) return

      scrollToStop(stops, targetIndex)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        !isDesktop() ||
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
      const now = performance.now()
      const quietSinceLastInput = now - lastWheelAtRef.current
      if (
        inputLockedRef.current &&
        !isAnimatingRef.current &&
        quietSinceLastInput >= WHEEL_QUIET_PERIOD
      ) {
        inputLockedRef.current = false
        wheelDeltaRef.current = 0
      }

      if (event.repeat || inputLockedRef.current) return

      const stops = getStops()
      if (!stops.length) return

      const currentIndex = getCurrentStopIndex(stops)
      const targetIndex = currentIndex + direction
      if (targetIndex < 0 || targetIndex >= stops.length) return

      lastWheelAtRef.current = now
      scrollToStop(stops, targetIndex)
    }

    const handleResize = () => {
      clearMotion()
      isAnimatingRef.current = false
      inputLockedRef.current = false
      wheelDeltaRef.current = 0
      syncActiveStop()
    }

    syncActiveStop()
    window.addEventListener("wheel", handleWheel, { passive: false })
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("scroll", syncActiveStop, { passive: true })
    window.addEventListener("resize", handleResize)

    return () => {
      delete html.dataset.homeScrollSnap
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("scroll", syncActiveStop)
      window.removeEventListener("resize", handleResize)
      clearMotion()
      isAnimatingRef.current = false
      inputLockedRef.current = false
      wheelDeltaRef.current = 0
    }
  }, [
    clearMotion,
    getCurrentStopIndex,
    getStops,
    isDesktop,
    isHome,
    queueUnlockAfterQuiet,
    scrollToStop,
    setActiveStop,
  ])

  if (!isHome) return children

  return <div className={styles.root}>{children}</div>
}
