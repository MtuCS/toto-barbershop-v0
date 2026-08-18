"use client"
import { useEffect } from "react"
import { useDataStore } from "@/store/data-store"

export function DataFetcher() {
  const fetchProducts = useDataStore((s) => s.fetchProducts)
  const fetchCategories = useDataStore((s) => s.fetchCategories)
  const fetchServices = useDataStore((s) => s.fetchServices)
  const fetchCourses = useDataStore((s) => s.fetchCourses)
  const fetchStories = useDataStore((s) => s.fetchStories)
  const fetchLookbook = useDataStore((s) => s.fetchLookbook)
  const fetchMedia = useDataStore((s) => s.fetchMedia)
  const fetchFaqs = useDataStore((s) => s.fetchFaqs)
  const fetchSettings = useDataStore((s) => s.fetchSettings)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchServices()
    fetchCourses()
    fetchStories()
    fetchLookbook()
    fetchMedia()
    fetchFaqs()
    fetchSettings()
  }, [
    fetchProducts,
    fetchCategories,
    fetchServices,
    fetchCourses,
    fetchStories,
    fetchLookbook,
    fetchMedia,
    fetchFaqs,
    fetchSettings,
  ])

  return null
}
