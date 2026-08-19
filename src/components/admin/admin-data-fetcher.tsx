"use client"
import { useEffect } from "react"
import { useDataStore } from "@/store/data-store"
import { useAuthStore } from "@/store/auth-store"
import { createClient } from "@/utils/supabase/client"

export function AdminDataFetcher() {
  const fetchPromoCodes = useDataStore((s) => s.fetchPromoCodes)
  const fetchOrders = useDataStore((s) => s.fetchOrders)
  const fetchUsers = useDataStore((s) => s.fetchUsers)

  const token = useAuthStore((s) => s.session?.token)

  // Initial data fetch
  useEffect(() => {
    if (token) {
      fetchPromoCodes()
      fetchOrders()
      fetchUsers()
    }
  }, [token, fetchPromoCodes, fetchOrders, fetchUsers])

  // Realtime: Lắng nghe INSERT và UPDATE trên bảng Order → tự động reload
  useEffect(() => {
    if (!token) return;

    const supabase = createClient();

    const channel = supabase
      .channel('admin-orders-realtime')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT + UPDATE + DELETE
          schema: 'public',
          table: 'Order',
        },
        () => {
          // Khi có thay đổi bất kỳ, tải lại danh sách đơn hàng
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [token, fetchOrders])

  return null
}
