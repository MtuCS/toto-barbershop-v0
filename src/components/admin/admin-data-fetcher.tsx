"use client"
import { useEffect } from "react"
import { useDataStore } from "@/store/data-store"
import { useAuthStore } from "@/store/auth-store"

export function AdminDataFetcher() {
  const fetchPromoCodes = useDataStore((s) => s.fetchPromoCodes)
  const fetchOrders = useDataStore((s) => s.fetchOrders)
  const fetchUsers = useDataStore((s) => s.fetchUsers)
  const fetchLeads = useDataStore((s) => s.fetchLeads)

  const token = useAuthStore((s) => s.session?.token)

  useEffect(() => {
    if (token) {
      fetchPromoCodes()
      fetchOrders()
      fetchUsers()
      fetchLeads()
    }
  }, [token, fetchPromoCodes, fetchOrders, fetchUsers, fetchLeads])

  return null
}
