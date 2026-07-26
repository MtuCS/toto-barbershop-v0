import { expect, test } from "@playwright/test"

test.describe("home section scroll", () => {
  test("moves one scene per desktop wheel gesture", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 })
    await page.goto("/")

    const scenes = page.locator("main > div").first().locator(":scope > *")
    await expect(scenes).toHaveCount(8)

    await page.mouse.wheel(0, 120)
    await page.waitForTimeout(900)

    const visualPosition = await scenes.nth(1).evaluate((element) => ({
      top: element.getBoundingClientRect().top,
      marqueeHeight: element.getBoundingClientRect().height,
      videoHeight: element.nextElementSibling?.getBoundingClientRect().height ?? 0,
    }))

    expect(visualPosition.top).toBeCloseTo(64, 0)
    expect(visualPosition.marqueeHeight + visualPosition.videoHeight).toBeCloseTo(704, 0)

    await page.mouse.wheel(0, 120)
    await page.waitForTimeout(900)

    const servicesTop = await scenes.nth(3).evaluate(
      (element) => element.getBoundingClientRect().top,
    )
    expect(servicesTop).toBeCloseTo(64, 0)
  })

  test("keeps natural scrolling below the desktop breakpoint", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/")
    await page.mouse.wheel(0, 240)
    await page.waitForTimeout(150)

    const scrollY = await page.evaluate(() => window.scrollY)
    expect(scrollY).toBeGreaterThan(0)
    expect(scrollY).toBeLessThan(500)
  })
})
