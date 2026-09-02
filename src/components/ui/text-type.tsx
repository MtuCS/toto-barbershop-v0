"use client"

import {
  createElement,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { gsap } from "gsap"
import "./text-type.css"

interface TextTypeProps extends HTMLAttributes<HTMLElement> {
  text: string | string[]
  as?: ElementType
  typingSpeed?: number
  initialDelay?: number
  pauseDuration?: number
  deletingSpeed?: number
  loop?: boolean
  showCursor?: boolean
  hideCursorWhileTyping?: boolean
  cursorCharacter?: ReactNode
  cursorClassName?: string
  cursorBlinkDuration?: number
  textColors?: string[]
  variableSpeed?: { min: number; max: number }
  onSentenceComplete?: (sentence: string, index: number) => void
  startOnVisible?: boolean
  reverseMode?: boolean
}

export default function TextType({
  text,
  as: Component = "div",
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = "",
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = "|",
  cursorClassName = "",
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  reverseMode = false,
  ...props
}: TextTypeProps) {
  const initialText = Array.isArray(text) ? (text[0] ?? "") : text
  const initialDisplayedText = reverseMode
    ? initialText.split("").reverse().join("")
    : initialText
  const [displayedText, setDisplayedText] = useState(initialDisplayedText)
  const [hasMounted, setHasMounted] = useState(false)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(!startOnVisible)
  const [reduceMotion, setReduceMotion] = useState(false)
  const cursorRef = useRef<HTMLSpanElement>(null)
  const containerRef = useRef<HTMLElement>(null)

  const textArray = useMemo(
    () => (Array.isArray(text) ? text : [text]),
    [text],
  )

  const getRandomSpeed = useCallback(() => {
    if (!variableSpeed) return typingSpeed
    return Math.random() * (variableSpeed.max - variableSpeed.min) + variableSpeed.min
  }, [typingSpeed, variableSpeed])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const syncPreference = () => setReduceMotion(mediaQuery.matches)

    syncPreference()
    mediaQuery.addEventListener("change", syncPreference)
    return () => mediaQuery.removeEventListener("change", syncPreference)
  }, [])

  useEffect(() => {
    if (reduceMotion) return
    setDisplayedText("")
    setCurrentCharIndex(0)
    setCurrentTextIndex(0)
    setIsDeleting(false)
    setHasMounted(true)
  }, [initialDisplayedText, reduceMotion])

  useEffect(() => {
    if (!reduceMotion) return
    const finalText = textArray[textArray.length - 1] ?? ""
    setCurrentTextIndex(textArray.length - 1)
    setCurrentCharIndex(finalText.length)
    setDisplayedText(reverseMode ? finalText.split("").reverse().join("") : finalText)
    setIsDeleting(false)
    setIsVisible(true)
  }, [reduceMotion, reverseMode, textArray])

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setIsVisible(true)
      },
      { threshold: 0.1 },
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [startOnVisible])

  useEffect(() => {
    if (!showCursor || !cursorRef.current || reduceMotion) return

    gsap.set(cursorRef.current, { opacity: 1 })
    const tween = gsap.to(cursorRef.current, {
      opacity: 0,
      duration: cursorBlinkDuration,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    })

    return () => {
      tween.kill()
    }
  }, [cursorBlinkDuration, reduceMotion, showCursor])

  useEffect(() => {
    if (!hasMounted || !isVisible || reduceMotion) return

    let timeout: ReturnType<typeof setTimeout> | undefined
    const currentText = textArray[currentTextIndex] ?? ""
    const processedText = reverseMode
      ? currentText.split("").reverse().join("")
      : currentText

    if (isDeleting) {
      if (displayedText === "") {
        setIsDeleting(false)
        if (currentTextIndex === textArray.length - 1 && !loop) return
        onSentenceComplete?.(textArray[currentTextIndex], currentTextIndex)
        setCurrentTextIndex((previous) => (previous + 1) % textArray.length)
        setCurrentCharIndex(0)
      } else {
        timeout = setTimeout(() => {
          setDisplayedText((previous) => previous.slice(0, -1))
          setCurrentCharIndex((previous) => Math.max(0, previous - 1))
        }, deletingSpeed)
      }
    } else if (currentCharIndex < processedText.length) {
      const characterDelay =
        (currentCharIndex === 0 && displayedText === "" ? initialDelay : 0) +
        (variableSpeed ? getRandomSpeed() : typingSpeed)

      timeout = setTimeout(() => {
        const nextIndex = currentCharIndex + 1
        setDisplayedText(processedText.slice(0, nextIndex))
        setCurrentCharIndex(nextIndex)
      }, characterDelay)
    } else if (loop || currentTextIndex < textArray.length - 1) {
      timeout = setTimeout(() => setIsDeleting(true), pauseDuration)
    }

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [
    currentCharIndex,
    currentTextIndex,
    deletingSpeed,
    displayedText,
    getRandomSpeed,
    hasMounted,
    initialDelay,
    isDeleting,
    isVisible,
    loop,
    onSentenceComplete,
    pauseDuration,
    reduceMotion,
    reverseMode,
    textArray,
    typingSpeed,
    variableSpeed,
  ])

  const currentText = textArray[currentTextIndex] ?? ""
  const shouldHideCursor =
    hideCursorWhileTyping &&
    (currentCharIndex < currentText.length || isDeleting)
  const textColor = textColors.length
    ? textColors[currentTextIndex % textColors.length]
    : "inherit"

  return createElement(
    Component,
    {
      ref: containerRef,
      className: `text-type ${className}`,
      ...props,
    },
    <span className="text-type__content" style={{ color: textColor }}>
      {displayedText}
    </span>,
    showCursor && !reduceMotion && (
      <span
        ref={cursorRef}
        className={`text-type__cursor ${cursorClassName} ${
          shouldHideCursor ? "text-type__cursor--hidden" : ""
        }`}
      >
        {cursorCharacter}
      </span>
    ),
  )
}
