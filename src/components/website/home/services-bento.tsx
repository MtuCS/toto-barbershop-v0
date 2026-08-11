"use client"

import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import Link from "next/link"
import { useRef } from "react"

gsap.registerPlugin(useGSAP)

const SERVICES = [
  {
    number: "01",
    title: "Tóc & tạo kiểu",
    description:
      "Tư vấn kỹ theo dáng mặt và chất tóc thật. Tỉ mỉ từng đường kéo để tóc dài ra vẫn giữ được form dáng.",
  },
  {
    number: "02",
    title: "Vệ sinh & chăm sóc",
    description:
      "Gội đầu, cạo mặt và chăm sóc da đầu vừa đủ để bạn rời ghế với cảm giác nhẹ nhõm, sạch sẽ.",
  },
  {
    number: "03",
    title: "Râu & khăn nóng",
    description:
      "Tạo dáng râu theo đường nét gương mặt, kết hợp khăn nóng và dao cạo truyền thống cho bề mặt êm gọn.",
  },
  {
    number: "04",
    title: "Mấy gói combo",
    description:
      "Kết hợp trọn vẹn từ cắt tóc, gội đầu, cạo râu đến dưỡng da để lấy lại phong độ tinh tươm nhất.",
  },
] as const

type Service = (typeof SERVICES)[number]

function ServiceBlock({ service, step }: { service: Service; step: 0 | 1 }) {
  return (
    <Link
      href="/services"
      data-service-step={step}
      data-testid={`home-service-${service.number}`}
      aria-label={`Xem dịch vụ ${service.title}`}
      className="group relative block text-[#f2f5f3] outline-none focus-visible:ring-2 focus-visible:ring-[#79b8a7] focus-visible:ring-offset-8 focus-visible:ring-offset-[#07110f]"
    >
      <span className="flex items-end justify-between gap-4" aria-hidden="true">
        <span className="h-px w-[76%] origin-left bg-[#79b8a7]/45 transition-transform duration-300 ease-out group-hover:scale-x-[0.82] group-focus-visible:scale-x-[0.82]" />
        <span className="font-mono text-[0.65rem] leading-none tracking-[0.18em] text-[#79b8a7]/80">
          {service.number}
        </span>
      </span>

      <span className="mt-3 flex items-start justify-between gap-5">
        <span
          data-service-title
          className="font-sans text-[clamp(1.9rem,3vw,3.2rem)] font-extrabold leading-[0.98] tracking-[-0.05em] text-[#f2f5f3] transition-colors duration-300 group-hover:text-[#79b8a7] group-focus-visible:text-[#79b8a7]"
        >
          {service.title}
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="mt-1 size-4 shrink-0 stroke-[#79b8a7] stroke-[1.5] transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:translate-x-1 group-focus-visible:-translate-y-1 group-focus-visible:translate-x-1"
        >
          <path d="M6 18 18 6M8 6h10v10" />
        </svg>
      </span>

      <span className="mt-3 block max-w-[39ch] text-[0.78rem] leading-[1.65] text-[#f2f5f3]/62 transition-colors duration-300 group-hover:text-[#f2f5f3]/82 group-focus-visible:text-[#f2f5f3]/82 sm:text-[0.82rem]">
        {service.description}
      </span>
    </Link>
  )
}

export function ServicesBento() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      const label = section.querySelector<HTMLElement>("[data-services-label]")
      const titleMasks = Array.from(
        section.querySelectorAll<HTMLElement>("[data-services-title-mask]"),
      )
      const titleLines = Array.from(
        section.querySelectorAll<HTMLElement>("[data-services-title-line]"),
      )
      const firstStepBlocks = Array.from(
        section.querySelectorAll<HTMLElement>('[data-service-step="0"]'),
      )
      const secondStepBlocks = Array.from(
        section.querySelectorAll<HTMLElement>('[data-service-step="1"]'),
      )
      const arc = section.querySelector<HTMLElement>("[data-services-arc]")
      const rule = section.querySelector<HTMLElement>("[data-services-rule]")

      const desktopQuery = window.matchMedia("(min-width: 1024px)")
      const reducedMotionQuery = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      )
      let lastSceneVisit = -1
      let lastActiveStep = -1

      const showFirstStep = () => {
        gsap.set(label, { autoAlpha: 1, y: 0 })
        gsap.set(arc, { autoAlpha: 1, scale: 1 })
        gsap.set(rule, { autoAlpha: 1, scaleX: 1 })
        gsap.set(titleMasks, { clipPath: "inset(0% 0% 0% 0%)" })
        gsap.set(titleLines, { autoAlpha: 1, yPercent: 0 })
        gsap.set(firstStepBlocks, { autoAlpha: 1, y: 0 })
      }

      const showEverything = () => {
        showFirstStep()
        gsap.set(secondStepBlocks, { autoAlpha: 1, y: 0 })
      }

      if (!desktopQuery.matches || reducedMotionQuery.matches) {
        showEverything()
      } else {
        gsap.set(label, { autoAlpha: 0, y: 18 })
        gsap.set(arc, { autoAlpha: 0, scale: 0.96, transformOrigin: "50% 50%" })
        gsap.set(rule, { autoAlpha: 0, scaleX: 0, transformOrigin: "0% 50%" })
        gsap.set(titleMasks, { clipPath: "inset(0% 0% 100% 0%)" })
        gsap.set(titleLines, { autoAlpha: 0, yPercent: 115 })
        gsap.set([...firstStepBlocks, ...secondStepBlocks], {
          autoAlpha: 0,
          y: 34,
        })
      }

      const firstStepTimeline = gsap
        .timeline({ paused: true })
        .to(arc, { autoAlpha: 1, scale: 1, duration: 1.25, ease: "power2.out" }, 0)
        .to(rule, { autoAlpha: 1, scaleX: 1, duration: 0.46, ease: "power2.out" }, 0.04)
        .to(label, { autoAlpha: 1, y: 0, duration: 0.42, ease: "power2.out" }, 0.08)
        .to(
          titleMasks,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.58,
            stagger: 0.1,
            ease: "power2.out",
          },
          0.22,
        )
        .to(
          titleLines,
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.64,
            stagger: 0.1,
            ease: "power3.out",
          },
          0.22,
        )
        .to(
          firstStepBlocks,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.62,
            stagger: 0.13,
            ease: "power3.out",
          },
          0.58,
        )

      const secondStepTimeline = gsap
        .timeline({ paused: true })
        .to(
          secondStepBlocks,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.58,
            stagger: 0.1,
            ease: "power3.out",
          },
          0,
        )

      const resetMotion = () => {
        firstStepTimeline.pause(0)
        secondStepTimeline.pause(0)
        firstStepTimeline.eventCallback("onComplete", null)
        gsap.set(label, { autoAlpha: 0, y: 18 })
        gsap.set(arc, { autoAlpha: 0, scale: 0.96 })
        gsap.set(rule, { autoAlpha: 0, scaleX: 0 })
        gsap.set(titleMasks, { clipPath: "inset(0% 0% 100% 0%)" })
        gsap.set(titleLines, { autoAlpha: 0, yPercent: 115 })
        gsap.set([...firstStepBlocks, ...secondStepBlocks], {
          autoAlpha: 0,
          y: 34,
        })
      }

      const playFirstStep = (includeSecondStep: boolean) => {
        resetMotion()
        firstStepTimeline.eventCallback(
          "onComplete",
          includeSecondStep ? () => secondStepTimeline.restart() : null,
        )
        firstStepTimeline.restart()
      }

      const syncSceneState = () => {
        if (!desktopQuery.matches || reducedMotionQuery.matches) {
          showEverything()
          return
        }

        const isActive = section.dataset.homeSceneActive === "true"
        if (!isActive) {
          if (lastActiveStep !== -1) resetMotion()
          lastActiveStep = -1
          return
        }

        const activeStep = Number(section.dataset.homeSceneStep ?? "0")
        const sceneVisit = Number(section.dataset.homeSceneVisit ?? "0")

        if (sceneVisit !== lastSceneVisit) {
          lastSceneVisit = sceneVisit
          lastActiveStep = activeStep
          playFirstStep(activeStep >= 1)
          return
        }

        if (activeStep === lastActiveStep) return

        lastActiveStep = activeStep
        if (activeStep === 0) {
          playFirstStep(false)
        } else {
          secondStepTimeline.restart()
        }
      }

      const observer = new MutationObserver(syncSceneState)
      observer.observe(section, {
        attributes: true,
        attributeFilter: [
          "data-home-scene-active",
          "data-home-scene-step",
          "data-home-scene-visit",
        ],
      })

      const handlePreferenceChange = () => {
        if (!desktopQuery.matches || reducedMotionQuery.matches) showEverything()
        else syncSceneState()
      }

      desktopQuery.addEventListener("change", handlePreferenceChange)
      reducedMotionQuery.addEventListener("change", handlePreferenceChange)
      syncSceneState()

      return () => {
        observer.disconnect()
        desktopQuery.removeEventListener("change", handlePreferenceChange)
        reducedMotionQuery.removeEventListener("change", handlePreferenceChange)
      }
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      data-home-scene="services"
      data-home-scene-scroll="steps"
      aria-labelledby="home-services-title"
      className="home-services-scene relative isolate overflow-clip bg-[#07110f] text-[#f2f5f3]"
    >
      <div
        data-services-arc
        aria-hidden="true"
        className="pointer-events-none absolute left-[24%] top-[4%] aspect-square w-[min(108vw,88rem)] rounded-full border border-[#79b8a7]/28"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_84%_43%,rgba(47,122,104,0.10),transparent_32%),radial-gradient(circle_at_16%_82%,rgba(121,184,167,0.055),transparent_26%)]"
      />

      <div
        data-home-scroll-step="0"
        data-testid="home-services-step-0"
        className="home-services-step relative z-10 px-5 pb-16 pt-14 sm:px-6 md:px-8 md:pb-20 md:pt-16 lg:px-10 lg:py-[clamp(2rem,4svh,3.5rem)] xl:px-14"
      >
        <div className="mx-auto flex w-full max-w-[1400px] flex-col lg:h-full lg:justify-between">
          <header className="mx-auto w-full max-w-[72rem] text-center">
            <p
              data-services-label
              className="flex items-center  gap-3 text-[0.72rem] font-semibold tracking-[0.14em] text-[#79b8a7]"
            >
              <span
                data-services-rule
                className="h-px w-12 origin-left bg-[#79b8a7]/70"
                aria-hidden="true"
              />
              Dịch vụ tại ToTo
            </p>

            <h2
              id="home-services-title"
              className="mt-7 font-sans text-[clamp(4rem,8.2vw,8.8rem)] font-bold leading-[0.9] tracking-[-0.055em] text-[#f2f5f3]"
            >
              <span
                data-services-title-mask
                data-testid="home-services-title-mask"
                className="block overflow-hidden py-[0.08em]"
              >
                <span data-services-title-line className="block">
                  Mấy món nghề
                </span>
              </span>
              <span
                data-services-title-mask
                data-testid="home-services-title-mask"
                className="block overflow-hidden py-[0.08em] text-[#79b8a7]"
              >
                <span data-services-title-line className="block">
                  ToTo
                </span>
              </span>
            </h2>
          </header>

          <div className="mt-14 grid gap-y-10 lg:grid-cols-12 lg:items-start lg:gap-x-8 lg:gap-y-0 xl:gap-x-12">
            <div className="lg:col-span-4 lg:col-start-1">
              <ServiceBlock service={SERVICES[0]} step={0} />
            </div>

            <div className="lg:col-span-5 lg:col-start-6">
              <ServiceBlock service={SERVICES[1]} step={0} />
            </div>
          </div>
        </div>
      </div>

      <div
        data-home-scroll-step="1"
        data-home-scroll-step-overlap="true"
        data-testid="home-services-step-1"
        className="home-services-step pointer-events-none relative z-10 px-5 pb-24 sm:px-6 md:px-8 md:pb-28 lg:px-10 lg:pb-[clamp(1.5rem,3.5svh,2.5rem)] lg:pt-[calc(60svh-6rem)] xl:px-14"
      >
        <div className="mx-auto grid w-full max-w-[1400px] gap-y-10 lg:grid-cols-12 lg:items-start lg:gap-x-8 lg:gap-y-0 xl:gap-x-12">
          <div className="pointer-events-auto lg:col-span-4 lg:col-start-4">
            <ServiceBlock service={SERVICES[2]} step={1} />
          </div>

          <div className="pointer-events-auto lg:col-span-4 lg:col-start-9 lg:translate-x-4">
            <ServiceBlock service={SERVICES[3]} step={1} />
          </div>
        </div>
      </div>
    </section>
  )
}
