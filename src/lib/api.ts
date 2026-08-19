import type { Product, Category, Service, TrainingCourse, MerchandiseStory, LookbookItem } from "@/types"

const API_URL = process.env.BACKEND_URL || 'http://localhost:5000'

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/api/products`, { next: { revalidate: 60 } })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    return []
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/api/categories`, { next: { revalidate: 60 } })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    return []
  }
}

export async function getServices(): Promise<Service[]> {
  try {
    const res = await fetch(`${API_URL}/api/services`, { next: { revalidate: 60 } })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    return []
  }
}

export async function getCourses(): Promise<TrainingCourse[]> {
  try {
    const res = await fetch(`${API_URL}/api/courses`, { next: { revalidate: 60 } })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    return []
  }
}

export async function getStories(): Promise<MerchandiseStory[]> {
  try {
    const res = await fetch(`${API_URL}/api/stories`, { next: { revalidate: 60 } })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    return []
  }
}

export async function getStoryBySlug(slug: string): Promise<MerchandiseStory | null> {
  const stories = await getStories()
  return stories.find((s) => s.slug === slug) || null
}

export async function getLookbooks(): Promise<LookbookItem[]> {
  try {
    const res = await fetch(`${API_URL}/api/lookbooks`, { next: { revalidate: 60 } })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    return []
  }
}

export async function getFaqs(): Promise<any[]> {
  try {
    const res = await fetch(`${API_URL}/api/faqs`, { next: { revalidate: 60 } })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    return []
  }
}

export async function getSettings(): Promise<any> {
  try {
    const res = await fetch(`${API_URL}/api/settings`, { next: { revalidate: 60 } })
    if (!res.ok) return {}
    return res.json()
  } catch (error) {
    return {}
  }
}
