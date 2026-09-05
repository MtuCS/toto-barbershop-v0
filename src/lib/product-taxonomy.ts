import type { Category, ProductCategory } from "@/types"

export const PRODUCT_CATEGORY_PARENTS: Array<{ value: ProductCategory; label: string }> = [
  { value: "grooming", label: "Chăm sóc tóc & râu" },
  { value: "merchandise", label: "Thời trang" },
]

const LEGACY_GROOMING_SLUGS = new Set(["sap-vuot-toc", "pomade", "clay", "beard", "kit", "tools", "wash", "wax"])
const LEGACY_CATEGORY_LABELS: Record<string, string> = {
  "sap-vuot-toc": "Sáp vuốt tóc",
}

export function getParentCategory(category: unknown, categories: Category[]): ProductCategory | null {
  const slug = String(category ?? "")
  if (slug === "grooming" || slug === "merchandise") return slug
  return categories.find(item => item.slug === slug)?.parent ?? (LEGACY_GROOMING_SLUGS.has(slug) ? "grooming" : null)
}

export function getCategoryLabel(category: unknown, categories: Category[]) {
  const slug = String(category ?? "")
  return categories.find(item => item.slug === slug)?.name
    ?? PRODUCT_CATEGORY_PARENTS.find(item => item.value === slug)?.label
    ?? LEGACY_CATEGORY_LABELS[slug]
    ?? slug
}
