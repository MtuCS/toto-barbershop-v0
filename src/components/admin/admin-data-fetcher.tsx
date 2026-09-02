"use client"
import { useEffect } from "react"
import { useDataStore } from "@/store/data-store"
import { useAuthStore } from "@/store/auth-store"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"

export function AdminDataFetcher() {
  const fetchPromoCodes = useDataStore((s) => s.fetchPromoCodes)
  const fetchOrders = useDataStore((s) => s.fetchOrders)
  const fetchUsers = useDataStore((s) => s.fetchUsers)
  const fetchMessages = useDataStore((s) => s.fetchMessages)

  const token = useAuthStore((s) => s.session?.token)

  // Initial data fetch
  useEffect(() => {
    if (token) {
      fetchPromoCodes()
      fetchOrders()
      fetchUsers()
      fetchMessages()
    }
  }, [token, fetchPromoCodes, fetchOrders, fetchUsers, fetchMessages])

  // Realtime: Lắng nghe thay đổi trên bảng Order và ContactMessage
  useEffect(() => {
    if (!token) return;

    const supabase = createClient();

    // 1. Kênh Realtime Đơn hàng
    const orderChannel = supabase
      .channel('admin-orders-realtime')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT + UPDATE + DELETE
          schema: 'public',
          table: 'Order',
        },
        (payload: any) => {
          fetchOrders();
          if (payload.eventType === 'INSERT') {
            const order = payload.new;
            toast.success(`🛒 Đơn hàng mới: #${order.orderCode || order.id} vừa được tạo!`, {
              duration: 5000,
            });
          } else if (payload.eventType === 'UPDATE') {
            const order = payload.new;
            toast.info(`Cập nhật đơn #${order.orderCode || order.id}: Trạng thái ${order.status}`, {
              duration: 4000,
            });
          }
        }
      )
      .subscribe();

    // 2. Kênh Realtime Tin nhắn liên hệ / Đăng ký tư vấn
    const msgChannel = supabase
      .channel('admin-messages-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ContactMessage',
        },
        (payload: any) => {
          fetchMessages();
          toast.info(`📩 Tin nhắn mới từ: ${payload.new?.name || 'Khách hàng'}`, {
            duration: 5000,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(orderChannel);
      supabase.removeChannel(msgChannel);
    };
  }, [token, fetchOrders, fetchMessages])

  return null
}
