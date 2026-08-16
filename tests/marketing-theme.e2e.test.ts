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

    for (const path of ["/services", "/shop/merchandise", "/contact", "/training", "/merchandise", "/merchandise/the-origin"]) {
      await page.goto(path)
      const widths = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }))
      expect(widths.scrollWidth).toBe(widths.clientWidth)
    }
  })

  test("renders the merchandise editorial page with its hero and commerce links", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto("/merchandise")

    await expect(page.getByRole("heading", { level: 1, name: "More than merchandise" })).toBeVisible()
    await expect(page.locator('img[src*="hero-portrait.png"]')).toBeVisible()
    await expect(page.getByRole("link", { name: "Khám phá bộ sưu tập" })).toHaveAttribute("href", "/shop/merchandise")
    await expect(page.getByRole("link", { name: "Đọc câu chuyện The Origin" })).toHaveAttribute("href", "/merchandise/the-origin")
    await expect(page.getByRole("link", { name: "Đọc câu chuyện Workwear Chapter" })).toHaveAttribute("href", "/merchandise/workwear-chapter")
    await expect(page.getByRole("link", { name: "TOTO Logo Tee" }).first()).toBeVisible()
    await expect(page.getByRole("link", { name: "TOTO Water Pomade" })).toHaveCount(0)

    const widths = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }))
    expect(widths.scrollWidth).toBe(widths.clientWidth)
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

test("renders the complete services menu and keeps its contact path", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/services")

  await expect(page.getByRole("heading", { level: 1, name: "Precision in every cut" })).toBeVisible()
  await expect(page.getByRole("heading", { level: 2, name: "Chọn dịch vụ của bạn" })).toBeVisible()
  await expect(page.getByRole("heading", { level: 3 })).toHaveCount(13)
  await expect(page.getByRole("link", { name: "Liên hệ đặt lịch" }).first()).toHaveAttribute("href", "/contact")
  await expect(page.locator("main img")).toHaveCount(14)

  const question = page.getByRole("button", { name: "Tôi chưa biết mình hợp kiểu tóc nào, ToTo có tư vấn không?" })
  await question.click()
  await expect(page.getByText("Barber sẽ trao đổi về gương mặt")).toBeVisible()

  await page.setViewportSize({ width: 390, height: 844 })
  const widths = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))
  expect(widths.scrollWidth).toBe(widths.clientWidth)
})