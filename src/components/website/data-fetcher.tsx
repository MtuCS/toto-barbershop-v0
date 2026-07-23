"use client"
import { useEffect } from "react"
import { useDataStore } from "@/store/data-store"

export function DataFetcher() {
  const fetchProducts = useDataStore((s) => s.fetchProducts)
  const fetchOrders = useDataStore((s) => s.fetchOrders)
  const fetchUsers = useDataStore((s) => s.fetchUsers)

  useEffect(() => {
    fetchProducts()
    fetchOrders()
    fetchUsers()
  }, [fetchProducts, fetchOrders, fetchUsers])

  return null
}
