import { expect, test } from "@playwright/test"

test.describe("purchase flow", () => {
  test("a guest can add from a product card, review cart, and open checkout", async ({ page }) => {
    await page.goto("/shop")
    const card = page.locator("#all-products").locator("div.group").first()
    await card.getByRole("button", { name: /giỏ/i }).click()
    await expect(page.getByRole("dialog")).toContainText("Đã thêm vào giỏ hàng")
    await page.getByRole("link", { name: "Đi đến giỏ hàng" }).click()
    await expect(page).toHaveURL(/\/cart$/)
    await expect(page.getByRole("heading", { name: /giỏ hàng của bạn/i })).toBeVisible()
    await page.getByRole("link", { name: /tiến hành thanh toán/i }).click()
    await expect(page).toHaveURL(/\/checkout$/)
    await expect(page.getByText(/bạn không cần đăng nhập/i)).toBeVisible()
  })
})
