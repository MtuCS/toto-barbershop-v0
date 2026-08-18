"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
  Product,
  Category,
  Service,
  TrainingCourse,
  TrainingLead,
  MerchandiseStory,
  LookbookItem,
  Order,
  MediaItem,
  SettingsData,
  OrderStatus,
  PaymentStatus,
  CartItem,
  ContactMessage,
} from "@/types"


import { toast } from "sonner"
import { useAuthStore } from "./auth-store"

// ============================================================================
// Central editable data store (admin CMS). Persisted to LocalStorage so admin
// edits survive reloads. Backend hook point: swap each action for an API call.
// ============================================================================

const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`

interface DataState {
  products: Product[]

  categories: Category[]
  services: Service[]
  courses: TrainingCourse[]
  leads: TrainingLead[]
  stories: MerchandiseStory[]
  lookbook: LookbookItem[]
  orders: Order[]
  promoCodes: any[]
  customers: any[]
  media: MediaItem[]
  faqs: any[]
  settings: SettingsData
  messages: ContactMessage[]

  fetchProducts: () => Promise<void>
  fetchCategories: () => Promise<void>
  fetchServices: () => Promise<void>
  fetchCourses: () => Promise<void>
  fetchLeads: () => Promise<void>
  fetchStories: () => Promise<void>
  fetchLookbook: () => Promise<void>
  fetchMedia: () => Promise<void>
  fetchOrders: () => Promise<void>
  fetchPromoCodes: () => Promise<void>
  fetchUsers: () => Promise<void>
  fetchFaqs: () => Promise<void>
  fetchSettings: () => Promise<void>
  fetchMessages: () => Promise<void>
  createUser: (userData: any) => Promise<void>
  updateOrderStatus: (id: string, data: { status?: string, paymentStatus?: string }) => Promise<void>
  cancelOrder: (id: string, token: string) => Promise<boolean>
  
  upsertProduct: (product: Partial<Product>) => Promise<void>
  deleteProduct: (id: string | number) => Promise<void>

  // Categories
  upsertCategory: (category: Partial<Category>) => Promise<void>
  deleteCategory: (id: string | number) => Promise<void>

  // Services
  upsertService: (service: Partial<Service>) => Promise<void>
  deleteService: (id: string | number) => Promise<void>

  // Courses
  upsertCourse: (course: TrainingCourse) => void
  deleteCourse: (id: string) => void

  // Leads
  addLead: (lead: Omit<TrainingLead, "id" | "createdAt" | "status">) => Promise<void>
  updateLeadStatus: (id: string, status: TrainingLead["status"]) => void
  deleteLead: (id: string) => void

  // Stories
  upsertStory: (story: MerchandiseStory) => void
  deleteStory: (id: string) => void

  // Lookbook
  upsertLookbook: (item: LookbookItem) => void
  deleteLookbook: (id: string) => void

  // Promo Codes
  upsertPromoCode: (promo: any) => Promise<void>
  deletePromoCode: (id: string | number) => Promise<void>

  // Orders
  
  setOrderStatusInStore: (id: string | number, status: OrderStatus, paymentStatus: PaymentStatus) => void

  // Media
  addMedia: (item: Omit<MediaItem, "id" | "createdAt">) => void
  deleteMedia: (id: string) => void

  // FAQ
  upsertFaq: (faq: any) => Promise<void>
  deleteFaq: (id: string | number) => Promise<void>

  // Settings
  updateSettings: (settings: SettingsData) => Promise<void>

  // Messages
  updateMessageStatus: (id: string, status: string) => Promise<void>
  deleteMessage: (id: string) => Promise<void>

  resetAll: () => void
}

const seed = {
  products: [] as Product[],
  categories: [] as Category[],
  services: [] as Service[],
  courses: [] as TrainingCourse[],
  leads: [] as TrainingLead[],
  stories: [] as MerchandiseStory[],
  lookbook: [] as LookbookItem[],
  promoCodes: [] as any[],
  orders: [] as Order[],
  customers: [] as any[],
  media: [] as MediaItem[],
  faqs: [] as any[],
  settings: {} as SettingsData,
  messages: [] as ContactMessage[],
}

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      ...seed,

      fetchProducts: async () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) return;
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 1500);
        try {
          const res = await fetch(`${apiUrl.replace(/\/$/, "")}/products`, { signal: controller.signal });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length) set({ products: data });
          }
        } catch {
          // Keep the seeded catalogue available while the optional API is offline.
        } finally {
          window.clearTimeout(timeout);
        }
      },
      fetchCategories: async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/categories`);
          if (res.ok) {
            const data = await res.json();
            set({ categories: data });
          }
        } catch (error) {
          console.error("Failed to fetch categories:", error);
        }
      },

      fetchServices: async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/services`);
          if (res.ok) {
            const data = await res.json();
            set({ services: data });
          }
        } catch (error) {
          console.error("Failed to fetch services:", error);
        }
      },
      fetchCourses: async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/courses`);
          if (res.ok) set({ courses: await res.json() });
        } catch (error) { console.error(error); }
      },
      fetchLeads: async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/leads`);
          if (res.ok) set({ leads: await res.json() });
        } catch (error) { console.error(error); }
      },
      fetchStories: async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/stories`);
          if (res.ok) set({ stories: await res.json() });
        } catch (error) { console.error(error); }
      },
      fetchLookbook: async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/lookbooks`);
          if (res.ok) set({ lookbook: await res.json() });
        } catch (error) { console.error(error); }
      },
      fetchMedia: async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/media`);
          if (res.ok) set({ media: await res.json() });
        } catch (error) { console.error(error); }
      },

      fetchOrders: async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders`);
          if (res.ok) {
            const data = await res.json();
            set({ orders: data });
          }
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        }
      },

      fetchPromoCodes: async () => {
        try {
          const token = typeof window !== 'undefined' ? useAuthStore.getState().session?.token : null;
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/promo`, {
            headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
          });
          if (res.ok) set({ promoCodes: await res.json() });
        } catch (error) { console.error(error); }
      },

      fetchUsers: async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/users`);
          if (res.ok) {
            const data = await res.json();
            set({ customers: data });
          }
        } catch (error) {
          console.error("Failed to fetch users:", error);
        }
      },

      createUser: async (userData: any) => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
          });
          if (res.ok) {
            const newUser = await res.json();
            set(s => ({ customers: [newUser, ...s.customers] }));
          } else {
            const err = await res.json();
            toast.error(err.error || 'Failed to create user');
          }
        } catch (error) {
          console.error("Failed to create user:", error);
          toast.error('Failed to create user');
        }
      },

      updateOrderStatus: async (id, data) => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          if (res.ok) {
            get().fetchOrders();
          }
        } catch (error) {
          console.error("Failed to update order:", error);
        }
      },

      cancelOrder: async (id, token) => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders/${id}/cancel`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            get().fetchOrders();
            return true;
          }
        } catch (error) {
          console.error("Failed to cancel order:", error);
        }
        return false;
      },

      setOrderStatusInStore: (id, status, paymentStatus) => {
        set((state) => ({
          orders: state.orders.map(o => o.id.toString() === id.toString() ? { ...o, status, paymentStatus } : o)
        }))
      },

      upsertProduct: async (product) => {
        try {
          const token = typeof window !== 'undefined' ? useAuthStore.getState().session?.token : null;
          const isUpdate = !!product.id;
          const url = isUpdate 
            ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products/${product.id}`
            : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products`;
          const method = isUpdate ? 'PUT' : 'POST';
          
          const res = await fetch(url, {
            method,
            headers: { 
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify(product)
          });
          
          if (res.ok) {
            get().fetchProducts();
          } else {
            const err = await res.json();
            toast.error(err.error || 'Failed to save product');
          }
        } catch (error) {
          console.error("Failed to save product:", error);
          toast.error('Failed to save product');
        }
      },
      
      deleteProduct: async (id) => {
        try {
          const token = typeof window !== 'undefined' ? useAuthStore.getState().session?.token : null;
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products/${id}`, {
            method: 'DELETE',
            headers: {
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
          });
          if (res.ok) {
            get().fetchProducts();
          } else {
            toast.error('Failed to delete product');
          }
        } catch (error) {
          console.error("Failed to delete product:", error);
          toast.error('Failed to delete product');
        }
      },

      upsertCategory: async (category) => {
        try {
          const token = typeof window !== 'undefined' ? useAuthStore.getState().session?.token : null;
          const isUpdate = !!category.id;
          const url = isUpdate 
            ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/categories/${category.id}`
            : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/categories`;
          const method = isUpdate ? 'PUT' : 'POST';
          
          const res = await fetch(url, {
            method,
            headers: { 
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify(category)
          });
          
          if (res.ok) {
            get().fetchCategories();
          } else {
            const err = await res.json();
            toast.error(err.error || 'Failed to save category');
          }
        } catch (error) {
          console.error("Failed to save category:", error);
          toast.error('Failed to save category');
        }
      },
      
      deleteCategory: async (id) => {
        try {
          const token = typeof window !== 'undefined' ? useAuthStore.getState().session?.token : null;
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/categories/${id}`, {
            method: 'DELETE',
            headers: {
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
          });
          if (res.ok) {
            get().fetchCategories();
          } else {
            toast.error('Failed to delete category');
          }
        } catch (error) {
          console.error("Failed to delete category:", error);
          toast.error('Failed to delete category');
        }
      },

      upsertService: async (service) => {
        try {
          const token = typeof window !== 'undefined' ? useAuthStore.getState().session?.token : null;
          const isUpdate = !!service.id;
          const url = isUpdate 
            ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/services/${service.id}`
            : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/services`;
          const method = isUpdate ? 'PUT' : 'POST';
          
          const res = await fetch(url, {
            method,
            headers: { 
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify(service)
          });
          
          if (res.ok) {
            get().fetchServices();
          } else {
            const err = await res.json();
            toast.error(err.error || 'Failed to save service');
          }
        } catch (error) {
          console.error("Failed to save service:", error);
          toast.error('Failed to save service');
        }
      },
      
      deleteService: async (id) => {
        try {
          const token = typeof window !== 'undefined' ? useAuthStore.getState().session?.token : null;
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/services/${id}`, {
            method: 'DELETE',
            headers: {
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
          });
          if (res.ok) {
            get().fetchServices();
          } else {
            toast.error('Failed to delete service');
          }
        } catch (error) {
          console.error("Failed to delete service:", error);
          toast.error('Failed to delete service');
        }
      },

      
      upsertCourse: async (course) => {
        const token = useAuthStore.getState().session?.token;
        const isUpdate = !!course.id && !String(course.id).startsWith('t-');
        const url = isUpdate ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/courses/${course.id}` : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/courses`;
        await fetch(url, { method: isUpdate ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(course) });
        get().fetchCourses();
      },
      deleteCourse: async (id) => {
        const token = useAuthStore.getState().session?.token;
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/courses/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
        get().fetchCourses();
      },


      
      addLead: async (lead) => {
        const token = typeof window !== 'undefined' ? useAuthStore.getState().session?.token : null;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/leads`, { 
          method: 'POST', 
          headers: { 
            'Content-Type': 'application/json', 
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}) 
          }, 
          body: JSON.stringify(lead) 
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || 'Failed to submit lead');
        }
        get().fetchLeads();
      },
      updateLeadStatus: async (id, status) => {
        const token = useAuthStore.getState().session?.token;
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/leads/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status }) });
        get().fetchLeads();
      },
      deleteLead: async (id) => {
        const token = useAuthStore.getState().session?.token;
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/leads/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
        get().fetchLeads();
      },


      
      upsertStory: async (story) => {
        const token = useAuthStore.getState().session?.token;
        const isUpdate = !!story.id && !String(story.id).startsWith('st-');
        const url = isUpdate ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/stories/${story.id}` : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/stories`;
        await fetch(url, { method: isUpdate ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(story) });
        get().fetchStories();
      },
      deleteStory: async (id) => {
        const token = useAuthStore.getState().session?.token;
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/stories/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
        get().fetchStories();
      },


      
      upsertLookbook: async (item) => {
        const token = useAuthStore.getState().session?.token;
        const isUpdate = !!item.id && !String(item.id).startsWith('lb-');
        const url = isUpdate ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/lookbooks/${item.id}` : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/lookbooks`;
        await fetch(url, { method: isUpdate ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(item) });
        get().fetchLookbook();
      },
      deleteLookbook: async (id) => {
        const token = useAuthStore.getState().session?.token;
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/lookbooks/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
        get().fetchLookbook();
      },

      upsertPromoCode: async (promo) => {
        try {
          const token = typeof window !== 'undefined' ? useAuthStore.getState().session?.token : null;
          const isUpdate = !!promo.id;
          const url = isUpdate 
            ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/promo/${promo.id}`
            : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/promo`;
          const method = isUpdate ? 'PUT' : 'POST';
          
          const res = await fetch(url, {
            method,
            headers: { 
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify(promo)
          });
          
          if (res.ok) {
            get().fetchPromoCodes();
          } else {
            const err = await res.json();
            toast.error(err.error || 'Lỗi lưu mã giảm giá');
          }
        } catch (error) {
          console.error(error);
          toast.error('Lỗi lưu mã giảm giá');
        }
      },
      
      deletePromoCode: async (id) => {
        try {
          const token = typeof window !== 'undefined' ? useAuthStore.getState().session?.token : null;
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/promo/${id}`, {
            method: 'DELETE',
            headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
          });
          if (res.ok) {
            get().fetchPromoCodes();
          } else {
            toast.error('Lỗi xóa mã giảm giá');
          }
        } catch (error) {
          console.error(error);
          toast.error('Lỗi xóa mã giảm giá');
        }
      },

      placeOrder: (input: any) => {
        const now = new Date().toISOString()
        const order: Order = {
          id: uid("ord"),
          code: `TOTO-${Math.floor(1000 + Math.random() * 9000)}`,
          customer: input.customer,
          items: input.items.map((i: any) => ({
            variantId: i.variantId,
            productId: i.productId,
            title: i.title,
            variantName: i.variantName,
            image: i.image,
            price: i.price,
            quantity: i.quantity,
          })),
          subtotal: input.subtotal,
          shippingFee: input.shippingFee,
          discount: input.discount,
          total: input.total,
          couponCode: input.couponCode,
          paymentMethod: input.paymentMethod,
          paymentStatus: "unpaid",
          status: "pending",
          timeline: [{ status: "pending", at: now, note: "KhÃ¡ch Ä‘áº·t hÃ ng" }],
          createdAt: now,
        }
        set((s) => ({ orders: [order, ...s.orders] }))
        return order
      },


      
      addMedia: async (item) => {
        const token = useAuthStore.getState().session?.token;
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/media`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(item) });
        get().fetchMedia();
      },
      deleteMedia: async (id) => {
        const token = useAuthStore.getState().session?.token;
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/media/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
        get().fetchMedia();
      },


      fetchFaqs: async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/faqs`);
          if (res.ok) set({ faqs: await res.json() });
        } catch (error) { console.error(error); }
      },
      
      upsertFaq: async (faq) => {
        try {
          const token = typeof window !== 'undefined' ? useAuthStore.getState().session?.token : null;
          const isUpdate = !!faq.id;
          const url = isUpdate 
            ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/faqs/${faq.id}`
            : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/faqs`;
          const res = await fetch(url, {
            method: isUpdate ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
            body: JSON.stringify(faq)
          });
          if (res.ok) get().fetchFaqs();
        } catch (error) { console.error(error); toast.error('Failed to save FAQ'); }
      },
      
      deleteFaq: async (id) => {
        try {
          const token = typeof window !== 'undefined' ? useAuthStore.getState().session?.token : null;
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/faqs/${id}`, {
            method: 'DELETE',
            headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
          });
          if (res.ok) get().fetchFaqs();
        } catch (error) { console.error(error); toast.error('Failed to delete FAQ'); }
      },

      fetchSettings: async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/settings`);
          if (res.ok) set({ settings: await res.json() });
        } catch (error) { console.error(error); }
      },

      updateSettings: async (settings) => {
        try {
          const token = typeof window !== 'undefined' ? useAuthStore.getState().session?.token : null;
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
            body: JSON.stringify(settings)
          });
          if (res.ok) {
            set({ settings: await res.json() });
            toast.success("Đã lưu Cài đặt!");
          } else {
            toast.error("Lưu cài đặt thất bại (Lỗi server)!");
          }
        } catch (error) { console.error(error); toast.error('Failed to update settings'); }
      },

      fetchMessages: async () => {
        try {
          const token = typeof window !== 'undefined' ? useAuthStore.getState().session?.token : null;
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/messages`, {
            headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
          });
          if (res.ok) set({ messages: await res.json() });
        } catch (error) { console.error(error); }
      },

      updateMessageStatus: async (id, status) => {
        try {
          const token = typeof window !== 'undefined' ? useAuthStore.getState().session?.token : null;
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/messages/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
            body: JSON.stringify({ status })
          });
          if (res.ok) {
            get().fetchMessages();
            toast.success("Đã cập nhật trạng thái tin nhắn!");
          } else {
            toast.error("Cập nhật thất bại!");
          }
        } catch (error) { console.error(error); toast.error('Failed to update message'); }
      },

      deleteMessage: async (id) => {
        try {
          const token = typeof window !== 'undefined' ? useAuthStore.getState().session?.token : null;
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/messages/${id}`, {
            method: 'DELETE',
            headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
          });
          if (res.ok) {
            get().fetchMessages();
            toast.success("Đã xóa tin nhắn!");
          } else {
            toast.error("Xóa thất bại!");
          }
        } catch (error) { console.error(error); toast.error('Failed to delete message'); }
      },

      resetAll: () => set({ ...seed }),
    }),
    {
      name: "toto-admin-data",
      version: 2,
      migrate: (persistedState, version) => {
        const state = persistedState as Partial<DataState>
        if (version < 2 && !state.products?.length) {
          return { ...state }
        }
        return state as DataState
      },
    },
  ),
)

export function getOrderByCode(orders: Order[], code: string) {
  return orders.find((o) => o.code === code)
}
