"use client"
import { useEffect } from "react"
import { useDataStore } from "@/store/data-store"

export function AdminDataFetcher() {
  const fetchPromoCodes = useDataStore((s) => s.fetchPromoCodes)
  const fetchOrders = useDataStore((s) => s.fetchOrders)
  const fetchUsers = useDataStore((s) => s.fetchUsers)
  const fetchLeads = useDataStore((s) => s.fetchLeads)

  useEffect(() => {
    fetchPromoCodes()
    fetchOrders()
    fetchUsers()
    fetchLeads()
  }, [fetchPromoCodes, fetchOrders, fetchUsers, fetchLeads])

  return null
}
