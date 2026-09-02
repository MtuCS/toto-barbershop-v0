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

  const fetchProducts = useDataStore((s) => s.fetchProducts)
  const fetchCategories = useDataStore((s) => s.fetchCategories)
  const fetchServices = useDataStore((s) => s.fetchServices)
  const fetchCourses = useDataStore((s) => s.fetchCourses)
  const fetchStories = useDataStore((s) => s.fetchStories)
  const fetchLookbook = useDataStore((s) => s.fetchLookbook)
  const fetchMedia = useDataStore((s) => s.fetchMedia)
  const fetchFaqs = useDataStore((s) => s.fetchFaqs)
  const fetchSettings = useDataStore((s) => s.fetchSettings)

  const prevOrderCount = useRef<number | null>(null)
  const prevMsgCount = useRef<number | null>(null)

  // Lấy toàn bộ dữ liệu quản trị khi đăng nhập
  useEffect(() => {
    if (!token) return;
    fetchPromoCodes()
    fetchOrders()
    fetchUsers()
    fetchMessages()
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
    token,
    fetchPromoCodes,
    fetchOrders,
    fetchUsers,
    fetchMessages,
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
