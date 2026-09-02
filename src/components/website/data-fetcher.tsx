"use client"
import { useEffect } from "react"
import { useDataStore } from "@/store/data-store"
import { useCustomerUserStore } from "@/store/customer-user-store"

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

  const token = useCustomerUserStore((s) => s.token)
  const setUser = useCustomerUserStore((s) => s.setUser)

  useEffect(() => {
    if (!token) return
    fetch("/api/users/profile", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        const u = data?.user || data
        if (u && u.id) {
          setUser(u, token)
        }
      })
      .catch(() => {})
  }, [token, setUser])

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
