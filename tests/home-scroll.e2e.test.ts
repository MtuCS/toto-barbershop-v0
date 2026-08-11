import { expect, test, type Page } from "@playwright/test"

const HEADER_HEIGHT = 64

async function wheelOneStep(page: Page, deltaY: number) {
  await page.mouse.wheel(0, deltaY)
  await page.waitForTimeout(1_150)
}

async function expectAlignedBelowHeader(
  locator: ReturnType<Page["locator"]>,
) {
  await expect
    .poll(
      async () => {
        const top = await locator.evaluate((element) =>
          element.getBoundingClientRect().top,
        )
        return Math.abs(top - HEADER_HEIGHT)
      },
      { timeout: 3_000 },
    )
    .toBeLessThanOrEqual(1.5)
}

async function prepareHome(
  page: Page,
  viewport: { width: number; height: number },
) {
  await page.setViewportSize(viewport)
  await page.goto("/", { waitUntil: "domcontentloaded" })
  await expect(page.locator("html")).toHaveAttribute(
    "data-home-scroll-snap",
    "true",
  )
  await page.evaluate(async () => {
    await document.fonts.ready
  })
  await page.waitForTimeout(300)
}

for (const viewport of [
  { name: "laptop", width: 1366, height: 768 },
  { name: "wide desktop", width: 1900, height: 820 },
]) {
  test(`moves through both Services stops on ${viewport.name}`, async ({
    page,
  }) => {
    await prepareHome(page, viewport)

    const campaign = page.locator('[data-home-scene="campaign"]')
    const services = page.locator('[data-home-scene="services"]')
    const firstServicesStep = page.getByTestId("home-services-step-0")
    const secondServicesStep = page.getByTestId("home-services-step-1")
    const values = page.getByTestId("home-values-scene")

    await wheelOneStep(page, 120)
    await expectAlignedBelowHeader(campaign)

    await wheelOneStep(page, 120)
    await expectAlignedBelowHeader(firstServicesStep)
    await expect(services).toHaveAttribute("data-home-scene-step", "0")
    await expect(firstServicesStep).toHaveAttribute(
      "data-home-scroll-step-active",
      "true",
    )
    await expect(page.getByText("Dịch vụ tại ToTo", { exact: true })).toBeVisible()
    await expect(page.getByText("Mấy món nghề", { exact: true })).toBeVisible()
    await expect(page.getByTestId("home-services-title-mask")).toHaveCount(2)
    await expect(page.locator("#home-services-title")).toHaveCSS(
      "text-transform",
      "none",
    )
    await expect(page.locator("#home-services-title")).toHaveCSS(
      "text-align",
      "center",
    )
    const titleLineStyles = await page
      .locator("[data-services-title-line]")
      .evaluateAll((lines) =>
        lines.map((line) => {
          const style = getComputedStyle(line)
          return {
            color: style.color,
            fontFamily: style.fontFamily,
            fontSize: style.fontSize,
          }
        }),
      )
    expect(titleLineStyles[1]).toEqual(titleLineStyles[0])
    await expect(page.getByTestId("home-service-01")).toContainText(
      "Tóc & tạo kiểu",
    )
    await expect(page.getByTestId("home-service-02")).toContainText(
      "Vệ sinh & chăm sóc",
    )

    const firstStepBounds = await page.evaluate(() => {
      const first = document.querySelector<HTMLElement>(
        '[data-testid="home-service-01"]',
      )
      const second = document.querySelector<HTMLElement>(
        '[data-testid="home-service-02"]',
      )
      const nextStep = document.querySelector<HTMLElement>(
        '[data-testid="home-services-step-1"]',
      )
      if (!first || !second || !nextStep) throw new Error("Missing Services UI")

      const firstRect = first.getBoundingClientRect()
      const secondRect = second.getBoundingClientRect()

      return {
        first: { top: firstRect.top, bottom: firstRect.bottom },
        second: { top: secondRect.top, bottom: secondRect.bottom },
        nextStepTop: nextStep.getBoundingClientRect().top,
        viewportHeight: window.innerHeight,
      }
    })

    expect(firstStepBounds.first.top).toBeGreaterThanOrEqual(HEADER_HEIGHT)
    expect(firstStepBounds.first.bottom).toBeLessThanOrEqual(
      firstStepBounds.viewportHeight,
    )
    expect(firstStepBounds.second.bottom).toBeLessThanOrEqual(
      firstStepBounds.viewportHeight,
    )
    expect(firstStepBounds.nextStepTop).toBeGreaterThan(
      firstStepBounds.viewportHeight * 0.58,
    )
    expect(firstStepBounds.nextStepTop).toBeLessThan(
      firstStepBounds.viewportHeight * 0.7,
    )

    await wheelOneStep(page, 120)
    await expectAlignedBelowHeader(secondServicesStep)
    await expect(services).toHaveAttribute("data-home-scene-step", "1")
    await expect(secondServicesStep).toHaveAttribute(
      "data-home-scroll-step-active",
      "true",
    )
    await expect(secondServicesStep).toHaveAttribute(
      "data-home-scroll-step-overlap",
      "true",
    )

    const allServicesBounds = await page.evaluate(() => {
      const step = document.querySelector<HTMLElement>(
        '[data-testid="home-services-step-1"]',
      )
      const values = document.querySelector<HTMLElement>(
        '[data-testid="home-values-scene"]',
      )
      const third = document.querySelector<HTMLElement>(
        '[data-testid="home-service-03"]',
      )
      const fourth = document.querySelector<HTMLElement>(
        '[data-testid="home-service-04"]',
      )
      const first = document.querySelector<HTMLElement>(
        '[data-testid="home-service-01"]',
      )
      const second = document.querySelector<HTMLElement>(
        '[data-testid="home-service-02"]',
      )
      if (!step || !values || !first || !second || !third || !fourth) {
        throw new Error("Missing overlapping Services state")
      }

      const stepRect = step.getBoundingClientRect()
      const firstRect = first.getBoundingClientRect()
      const secondRect = second.getBoundingClientRect()
      const thirdRect = third.getBoundingClientRect()
      const fourthRect = fourth.getBoundingClientRect()
      const hitTarget = document.elementFromPoint(
        firstRect.left + 12,
        firstRect.top + 12,
      )

      return {
        stepHeight: stepRect.height,
        valuesTop: values.getBoundingClientRect().top,
        firstTop: firstRect.top,
        firstBottom: firstRect.bottom,
        secondTop: secondRect.top,
        secondBottom: secondRect.bottom,
        secondLeft: secondRect.left,
        thirdTop: thirdRect.top,
        fourthTop: fourthRect.top,
        fourthLeft: fourthRect.left,
        firstReceivesPointer: hitTarget?.closest(
          '[data-testid="home-service-01"]',
        ) === first,
        viewportHeight: window.innerHeight,
      }
    })

    expect(allServicesBounds.stepHeight).toBeGreaterThanOrEqual(
      viewport.height - HEADER_HEIGHT - 1,
    )
    expect(allServicesBounds.valuesTop).toBeGreaterThanOrEqual(
      viewport.height - 1,
    )
    expect(
      Math.abs(allServicesBounds.thirdTop - allServicesBounds.fourthTop),
    ).toBeLessThanOrEqual(64)
    expect(allServicesBounds.firstTop).toBeGreaterThanOrEqual(HEADER_HEIGHT)
    expect(allServicesBounds.secondTop).toBeGreaterThanOrEqual(HEADER_HEIGHT)
    expect(allServicesBounds.firstReceivesPointer).toBe(true)
    expect(
      Math.abs(allServicesBounds.secondLeft - allServicesBounds.fourthLeft),
    ).toBeGreaterThan(48)
    expect(
      Math.min(allServicesBounds.thirdTop, allServicesBounds.fourthTop) -
        Math.max(
          allServicesBounds.firstBottom,
          allServicesBounds.secondBottom,
        ),
    ).toBeLessThan(220)

    for (const number of ["03", "04"]) {
      const service = page.getByTestId(`home-service-${number}`)
      const bounds = await service.evaluate((element) => {
        const rect = element.getBoundingClientRect()
        return { top: rect.top, bottom: rect.bottom }
      })
      expect(bounds.top).toBeGreaterThanOrEqual(HEADER_HEIGHT)
      expect(bounds.bottom).toBeLessThanOrEqual(viewport.height)
      await expect(service).toHaveCSS("opacity", "1")
    }

    for (const number of ["01", "02"]) {
      const bounds = await page.getByTestId(`home-service-${number}`).evaluate(
        (element) => {
          const rect = element.getBoundingClientRect()
          return { top: rect.top, bottom: rect.bottom }
        },
      )
      expect(bounds.bottom).toBeLessThanOrEqual(viewport.height)
    }
    await expect(page.getByTestId("home-service-03")).toContainText(
      "Râu & khăn nóng",
    )
    await expect(page.getByTestId("home-service-04")).toContainText(
      "Mấy gói combo",
    )

    await wheelOneStep(page, 120)
    await expectAlignedBelowHeader(values)
  })
}

test("does not skip a stop during wheel momentum and supports reverse travel", async ({
  page,
}) => {
  await prepareHome(page, { width: 1366, height: 768 })

  const campaign = page.locator('[data-home-scene="campaign"]')
  const firstServicesStep = page.getByTestId("home-services-step-0")
  const secondServicesStep = page.getByTestId("home-services-step-1")

  await page.mouse.wheel(0, 420)
  await page.mouse.wheel(0, 420)
  await page.waitForTimeout(1_150)
  await expectAlignedBelowHeader(campaign)

  await wheelOneStep(page, 120)
  await expectAlignedBelowHeader(firstServicesStep)
  await wheelOneStep(page, 120)
  await expectAlignedBelowHeader(secondServicesStep)

  await wheelOneStep(page, -120)
  await expectAlignedBelowHeader(firstServicesStep)
  await expect(page.getByTestId("home-service-01")).toHaveCSS("opacity", "1")
  await expect(page.getByTestId("home-service-02")).toHaveCSS("opacity", "1")
})

test("replays Hero and Services when scenes are revisited", async ({ page }) => {
  await prepareHome(page, { width: 1366, height: 768 })

  const hero = page.locator('[data-home-scene="hero"]')
  const services = page.locator('[data-home-scene="services"]')
  const values = page.locator('[data-home-scene="values"]')

  await expect(hero).toHaveAttribute("data-home-scene-visit", "1")
  await expect(page.locator("[data-home-hero-replay-key]")).toHaveAttribute(
    "data-home-hero-replay-key",
    "1",
  )

  await wheelOneStep(page, 120)
  await wheelOneStep(page, 120)
  await expect(services).toHaveAttribute("data-home-scene-visit", "1")

  await wheelOneStep(page, 120)
  await wheelOneStep(page, 120)
  await expectAlignedBelowHeader(values)

  await wheelOneStep(page, -120)
  await expectAlignedBelowHeader(page.getByTestId("home-services-step-1"))
  await expect(services).toHaveAttribute("data-home-scene-visit", "2")
  await expect
    .poll(() => page.locator("[data-services-title-line]").first().evaluate(
      (line) => getComputedStyle(line).opacity,
    ))
    .toBeLessThan(1)

  await wheelOneStep(page, -120)
  await wheelOneStep(page, -120)
  await wheelOneStep(page, -120)
  await expectAlignedBelowHeader(hero)
  await expect(hero).toHaveAttribute("data-home-scene-visit", "2")
  await expect(page.locator("[data-home-hero-replay-key]")).toHaveAttribute(
    "data-home-hero-replay-key",
    "2",
  )
})

test("uses the same stop order for keyboard navigation", async ({ page }) => {
  await prepareHome(page, { width: 1366, height: 768 })

  for (const target of [
    page.locator('[data-home-scene="campaign"]'),
    page.getByTestId("home-services-step-0"),
    page.getByTestId("home-services-step-1"),
    page.getByTestId("home-values-scene"),
  ]) {
    await page.keyboard.press("PageDown")
    await page.waitForTimeout(1_150)
    await expectAlignedBelowHeader(target)
  }
})

test("keeps natural scrolling and a single-column Services flow below desktop", async ({
  page,
}) => {
  await prepareHome(page, { width: 390, height: 844 })
  await page.mouse.wheel(0, 240)
  await page.waitForTimeout(150)

  const scrollY = await page.evaluate(() => window.scrollY)
  expect(scrollY).toBeGreaterThan(0)
  expect(scrollY).toBeLessThan(500)
  await expect(page.locator('[data-testid^="home-service-"]')).toHaveCount(4)
  expect(
    await page
      .locator("html")
      .evaluate((element) => element.scrollWidth === element.clientWidth),
  ).toBe(true)
})

test("shows Services immediately when reduced motion is enabled", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await prepareHome(page, { width: 1366, height: 768 })

  await page.mouse.wheel(0, 120)
  await page.waitForTimeout(220)
  await page.mouse.wheel(0, 120)
  await page.waitForTimeout(220)
  await expectAlignedBelowHeader(page.getByTestId("home-services-step-0"))

  for (const number of ["01", "02", "03", "04"]) {
    await expect(page.getByTestId(`home-service-${number}`)).toHaveCSS(
      "opacity",
      "1",
    )
  }
  await expect(page.getByTestId("home-services-title-mask")).toHaveCount(2)
  await expect(page.getByText("Mấy món nghề", { exact: true })).toBeVisible()
})
