import { expect, test, type Page } from "@playwright/test"

const products = [
  {
    id: "wax-1", slug: "toto-matte-wax", title: "TOTO Matte Wax", category: "grooming", collection: "wax", description: "", excerpt: "", images: ["/images/grooming-pomade.png"], variants: [{ id: "wax-v1", name: "100g", options: {}, price: 250000, stock: 8, sku: "WAX-1" }], basePrice: 250000, featured: true, status: "active", tags: [], rating: 5, reviewCount: 0, createdAt: "2026-01-01",
  },
  {
    id: "pomade-1", slug: "toto-water-pomade", title: "TOTO Water Pomade", category: "grooming", collection: "pomade", description: "", excerpt: "", images: ["/images/grooming-pomade.png"], variants: [{ id: "pomade-v1", name: "100g", options: {}, price: 280000, stock: 8, sku: "POMADE-1" }], basePrice: 280000, featured: true, status: "active", tags: [], rating: 5, reviewCount: 0, createdAt: "2026-01-01",
  },
  {
    id: "tee-1", slug: "toto-tee", title: "TOTO Tee", category: "merchandise", collection: "tee", description: "", excerpt: "", images: ["/images/merch-tee.png"], variants: [{ id: "tee-v1", name: "M", options: {}, price: 390000, stock: 5, sku: "TEE-1" }], basePrice: 390000, featured: true, status: "active", tags: [], rating: 5, reviewCount: 0, createdAt: "2026-01-01",
  },
]

async function seedProducts(page: Page) {
  await page.route("**/api/products", (route) =>
    route.fulfill({ contentType: "application/json", body: JSON.stringify(products) }),
  )
  await page.addInitScript((seed: unknown) => {
    window.localStorage.setItem("toto-admin-data", JSON.stringify({ state: { products: seed }, version: 1 }))
  }, products)
}

test.describe("shop catalogue", () => {
  test("switches hero slides and displays the catalogue, Q&A, and editorial guide in order", async ({ page }) => {
    await seedProducts(page)
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto("/shop")

    await expect(page.getByRole("heading", { level: 1, name: "Finish like a barber" })).toBeVisible()
    await page.getByRole("button", { name: /slide 2/i }).click()
    await expect(page.getByRole("heading", { level: 1, name: "Wear the attitude" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Tất cả sản phẩm" })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Câu hỏi thường gặp về pomade & sáp tóc" })).toBeVisible()
    await expect(page.getByRole("heading", { name: /Sáp vuốt tóc nam là gì/i })).toBeVisible()
  })

  test("filters Grooming products by collection and honours the Q&A collection link", async ({ page }) => {
    await seedProducts(page)
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto("/shop/grooming?collection=wax")

    await expect(page.getByRole("button", { name: "wax", exact: true })).toBeVisible()
    const catalogue = page.locator("#all-products")
    await expect(catalogue.getByRole("link", { name: "TOTO Matte Wax" })).toHaveCount(2)
    await expect(catalogue.getByRole("link", { name: "TOTO Water Pomade" })).toHaveCount(0)

    await page.goto("/shop/grooming?collection=pomade")
    await expect(page.getByRole("link", { name: "TOTO Water Pomade" })).toHaveCount(2)
    await expect(page.getByRole("link", { name: "TOTO Matte Wax" })).toHaveCount(0)
  })

  test("keeps one FAQ open at a time and is usable on mobile", async ({ page }) => {
    await seedProducts(page)
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/shop")

    await page.waitForTimeout(750)
    const first = page.getByRole("button", { name: /Pomade gốc nước/i })
    const second = page.getByRole("button", { name: /Clay và Fiber/i })
    await first.click()
    await expect(first).toHaveAttribute("aria-expanded", "true")
    await second.press("Enter")
    await expect(first).toHaveAttribute("aria-expanded", "false")
    await expect(second).toHaveAttribute("aria-expanded", "true")
  })

  test("does not auto-rotate when reduced motion is enabled", async ({ page }) => {
    await seedProducts(page)
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/shop")
    await expect(page.getByRole("heading", { level: 1, name: "Finish like a barber" })).toBeVisible()
    await page.waitForTimeout(3200)
    await expect(page.getByRole("heading", { level: 1, name: "Finish like a barber" })).toBeVisible()
  })
})