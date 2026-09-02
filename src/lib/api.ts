import type { Product, Category, Service, TrainingCourse, MerchandiseStory, LookbookItem } from "@/types"
import { clientLogger } from "./logger"

const API_URL = process.env.BACKEND_URL || 'http://localhost:5000'

async function safeFetch<T>(endpoint: string, fallback: T, options?: RequestInit): Promise<T> {
  const reqId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : undefined;
  const url = `${API_URL}${endpoint}`;
  
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        ...(reqId ? { 'X-Request-Id': reqId } : {}),
      },
    });

    if (!res.ok) {
      clientLogger.warn(`API responded with status ${res.status} [${endpoint}]`, { reqId, status: res.status });
      return fallback;
    }

    return await res.json();
  } catch (error) {
    clientLogger.error(`Failed to fetch from ${endpoint}`, error, reqId);
    return fallback;
  }
}

export async function getProducts(): Promise<Product[]> {
  return safeFetch<Product[]>('/api/products', [], { next: { revalidate: 60 } } as any);
}

export async function getCategories(): Promise<Category[]> {
  return safeFetch<Category[]>('/api/categories', [], { next: { revalidate: 60 } } as any);
}

export async function getServices(): Promise<Service[]> {
  return safeFetch<Service[]>('/api/services', [], { next: { revalidate: 60 } } as any);
}

import { trainingCourses as defaultCourses } from "@/data/training";

export async function getCourses(): Promise<TrainingCourse[]> {
  const courses = await safeFetch<TrainingCourse[]>('/api/courses', defaultCourses, { next: { revalidate: 60 } } as any);
  return courses && courses.length > 0 ? courses : defaultCourses;
}

export async function getStories(): Promise<MerchandiseStory[]> {
  return safeFetch<MerchandiseStory[]>('/api/stories', [], { next: { revalidate: 60 } } as any);
}

export async function getStoryBySlug(slug: string): Promise<MerchandiseStory | null> {
  const stories = await getStories();
  return stories.find((s) => s.slug === slug) || null;
}

import { lookbookItems as defaultLookbookItems } from "@/data/lookbook";

export async function getLookbooks(): Promise<LookbookItem[]> {
  const items = await safeFetch<LookbookItem[]>('/api/lookbooks', defaultLookbookItems, { next: { revalidate: 60 } } as any);
  return items && items.length > 0 ? items : defaultLookbookItems;
}

export async function getFaqs(): Promise<any[]> {
  return safeFetch<any[]>('/api/faqs', [], { next: { revalidate: 60 } } as any);
}

export async function getSettings(): Promise<any> {
  return safeFetch<any>('/api/settings', {}, { next: { revalidate: 60 } } as any);
}
