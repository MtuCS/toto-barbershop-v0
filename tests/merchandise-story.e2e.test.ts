import { expect, test } from "@playwright/test"

const stories = [
  {
    slug: "the-origin",
    title: "The Origin",
    nextHref: "/merchandise/workwear-chapter",
  },
  {
    slug: "workwear-chapter",
    title: "Workwear Chapter",
    nextHref: "/merchandise/the-origin",
  },
] as const

test.describe("merchandise story editorial layout", () => {
  for (const story of stories) {
    test(`${story.slug} fills the hero media without uppercase display copy`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.goto(`/merchandise/${story.slug}`)

      await expect(
        page.getByRole("heading", { level: 1, name: story.title }),
      ).toBeVisible()

      const presentation = await page.evaluate(() => {
        const media = document.querySelector<HTMLElement>(
          '[data-testid="story-hero-media"]',
        )
        const image = media?.querySelector<HTMLImageElement>("img")
        const title = document.querySelector<HTMLElement>("main h1")
        const manifesto = document.querySelector<HTMLElement>(
          '[data-testid="story-manifesto"]',
        )
        const mediaRect = media?.getBoundingClientRect()
        const imageRect = image?.getBoundingClientRect()

        return {
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          objectFit: image ? getComputedStyle(image).objectFit : "",
          mediaWidth: mediaRect?.width ?? 0,
          mediaHeight: mediaRect?.height ?? 0,
          imageWidth: imageRect?.width ?? 0,
          imageHeight: imageRect?.height ?? 0,
          titleTransform: title ? getComputedStyle(title).textTransform : "",
          manifestoTransform: manifesto
            ? getComputedStyle(manifesto).textTransform
            : "",
        }
      })

      expect(presentation.scrollWidth).toBe(presentation.clientWidth)
      expect(presentation.objectFit).toBe("cover")
      expect(presentation.imageWidth).toBeCloseTo(
        presentation.mediaWidth,
        0,
      )
      expect(presentation.imageHeight).toBeCloseTo(
        presentation.mediaHeight,
        0,
      )
      expect(presentation.titleTransform).toBe("none")
      expect(presentation.manifestoTransform).toBe("none")

      await expect(
        page.getByRole("link", { name: "Tất cả câu chuyện" }),
      ).toHaveAttribute("href", "/merchandise")
      await expect(
        page.getByRole("link", { name: "Câu chuyện tiếp theo" }),
      ).toHaveAttribute("href", story.nextHref)
      await expect(
        page.getByRole("link", { name: "Shop Merchandise" }),
      ).toHaveAttribute("href", "/shop/merchandise")
    })
  }

  test("story pages stay inside the mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })

    for (const story of stories) {
      await page.goto(`/merchandise/${story.slug}`)
      const dimensions = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        columns: getComputedStyle(
          document.querySelector('[data-testid="story-hero-media"]')!
            .parentElement!,
        ).gridTemplateColumns,
      }))

      expect(dimensions.scrollWidth).toBe(dimensions.clientWidth)
      expect(dimensions.columns.split(" ").length).toBe(1)
    }
  })
})
