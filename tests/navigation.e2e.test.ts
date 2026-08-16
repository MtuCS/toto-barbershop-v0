import { expect, test } from "@playwright/test"

test.describe("site navigation", () => {
  test("shows the ordered desktop navigation and preserves Contact in the footer", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto("/")

    const header = page.locator("header")
    await expect(header.getByRole("link", { name: "Liên hệ" })).toHaveCount(0)
    await expect(header.locator("nav").getByRole("link").allTextContents()).resolves.toEqual([
      "Dịch vụ",
      "Shop",
      "ToTo Merchandise",
      "Lookbook",
      "Đào tạo",
    ])
    await expect(page.locator("footer").getByRole("link", { name: "Liên hệ" })).toHaveAttribute("href", "/contact")
  })

  test("keeps merchandise active and navigates from the desktop navbar", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto("/services")

    const merchandise = page.locator("header").getByRole("link", { name: "ToTo Merchandise" })
    await expect(merchandise).toBeVisible()
    await merchandise.click()
    await expect(page).toHaveURL(/\/merchandise$/)
    await expect(merchandise).toHaveAttribute("aria-current", "page")
  })

  test("clears the GooeyNav selection when the logo returns home", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto("/services")

    await page.locator("header").getByRole("link", { name: /ToTo Barbershop/i }).click()
    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByTestId("gooey-nav-effect")).toHaveClass(/effectHidden/)
  })

  test("keeps Contact out of the opened mobile menu", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/")
    await page.getByRole("button", { name: "Mở menu" }).click()

    const dialog = page.getByRole("dialog")
    await expect(dialog.getByRole("link", { name: "Liên hệ" })).toHaveCount(0)
    await expect(dialog.getByRole("link").allTextContents()).resolves.toContain("ToTo Merchandise")
  })

  test("removes GooeyNav animation when reduced motion is requested", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto("/services")
    await expect(page.getByTestId("gooey-nav-effect")).toHaveCSS("transition-duration", "0s")
  })})