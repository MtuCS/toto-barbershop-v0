import { expect, test } from "@playwright/test"

const marketingRoutes = [
  ["/services", "Precision in every cut"],
  ["/shop", "Two worlds. One culture."],
  ["/about", "Built by craft"],
  ["/contact", "Come say hello"],
  ["/lookbook", "Cuts. Faces. Stories."],
  ["/training", "Learn the craft"],
  ["/merchandise", "More than merchandise"],
] as const

test.describe("marketing theme", () => {
  test("renders dark editorial heroes without desktop overflow", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })

    for (const [path, title] of marketingRoutes) {
      await page.goto(path)
      await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible()

      const metrics = await page.evaluate(() => {
        const firstSection = document.querySelector("main section")
        return {
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          heroBackground: firstSection ? getComputedStyle(firstSection).backgroundColor : "",
          brokenImages: Array.from(document.querySelectorAll("main img")).filter(
            (image) => image.complete && image.naturalWidth === 0,
          ).length,
        }
      })

      expect(metrics.scrollWidth).toBe(metrics.clientWidth)
      expect(metrics.heroBackground).toBe("rgb(7, 17, 15)")
      expect(metrics.brokenImages).toBe(0)
    }
  })

  test("keeps representative routes within the mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })

    for (const path of ["/services", "/shop/merchandise", "/contact", "/training", "/merchandise/the-origin"]) {
      await page.goto(path)
      const widths = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }))
      expect(widths.scrollWidth).toBe(widths.clientWidth)
    }
  })

  test("keeps shop controls on a cold light surface", async ({ page }) => {
    await page.goto("/shop/merchandise")

    const sort = page.getByRole("combobox", { name: "Sắp xếp" })
    await expect(sort).toBeVisible()
    await sort.selectOption("low")
    await expect(sort).toHaveValue("low")

    const hasLightSurface = await page.evaluate(() =>
      Array.from(document.querySelectorAll("main section")).some(
        (section) => getComputedStyle(section).backgroundColor === "rgb(245, 249, 247)",
      ),
    )
    expect(hasLightSurface).toBe(true)
  })
})
