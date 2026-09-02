"use client"
import { useEffect, useRef } from "react"
import { useDataStore } from "@/store/data-store"
import { useAuthStore } from "@/store/auth-store"
import { toast } from "sonner"

const POLL_INTERVAL_MS = 30_000; // Tự động làm mới dữ liệu mỗi 30 giây

export function AdminDataFetcher() {
  const fetchPromoCodes = useDataStore((s) => s.fetchPromoCodes)
  const fetchOrders = useDataStore((s) => s.fetchOrders)
  const fetchUsers = useDataStore((s) => s.fetchUsers)
  const fetchMessages = useDataStore((s) => s.fetchMessages)
  const token = useAuthStore((s) => s.session?.token)

  const prevOrderCount = useRef<number | null>(null)
  const prevMsgCount = useRef<number | null>(null)

  // Lấy dữ liệu lần đầu khi đăng nhập
  useEffect(() => {
    if (!token) return;
    fetchPromoCodes()
    fetchOrders()
    fetchUsers()
    fetchMessages()
  }, [token, fetchPromoCodes, fetchOrders, fetchUsers, fetchMessages])

  // Polling mỗi 30 giây thay thế cho Supabase Realtime
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(async () => {
      const ordersBefore = useDataStore.getState().orders?.length ?? 0;
      const msgsBefore = useDataStore.getState().messages?.length ?? 0;

      await fetchOrders();
      await fetchMessages();

      const ordersAfter = useDataStore.getState().orders?.length ?? 0;
      const msgsAfter = useDataStore.getState().messages?.length ?? 0;

      // Thông báo khi có đơn hàng mới
      if (prevOrderCount.current !== null && ordersAfter > ordersBefore) {
        toast.success(`🛒 Có ${ordersAfter - ordersBefore} đơn hàng mới!`, { duration: 5000 });
      }
      prevOrderCount.current = ordersAfter;

      // Thông báo khi có tin nhắn mới
      if (prevMsgCount.current !== null && msgsAfter > msgsBefore) {
        toast.info(`📩 Có ${msgsAfter - msgsBefore} tin nhắn liên hệ mới!`, { duration: 5000 });
      }
      prevMsgCount.current = msgsAfter;

    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [token, fetchOrders, fetchMessages])

  return null
}
