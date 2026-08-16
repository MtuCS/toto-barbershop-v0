import { expect, test } from "@playwright/test"

for (const viewport of [
  { name: "wide desktop", width: 1900, height: 820 },
  { name: "laptop desktop", width: 1366, height: 768 },
]) {
  test(`keeps values and testimonials inside one ${viewport.name} scene`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await page.goto("/")

    for (const selector of ["[data-testid=home-values-scene]", "[data-testid=home-testimonials-scene]"]) {
      const bounds = await page.evaluate((sceneSelector) => {
        const scene = document.querySelector<HTMLElement>(sceneSelector)
        if (!scene) throw new Error(`Missing scene: ${sceneSelector}`)

        window.scrollTo(0, scene.offsetTop - 64)
        const rect = scene.getBoundingClientRect()
        const contentBounds = [...scene.querySelectorAll<HTMLElement>("h2, h3, p, figure")].map((element) => element.getBoundingClientRect())
        return {
          top: rect.top,
          bottom: rect.bottom,
          contentBottom: Math.max(...contentBounds.map((item) => item.bottom)),
        }
      }, selector)

      expect(bounds.top).toBeCloseTo(64, 0)
      expect(bounds.bottom).toBeLessThanOrEqual(viewport.height)
      expect(bounds.contentBottom).toBeLessThanOrEqual(bounds.bottom)
    }
  })
}

test("stacks the two new scenes without horizontal overflow on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/")

  await expect(page.getByRole("heading", { name: "Tâm nghề tại ToTo" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "ToTo qua lời kể của anh em" })).toBeVisible()
  expect(await page.locator("html").evaluate((element) => element.scrollWidth === element.clientWidth)).toBe(true)
})
