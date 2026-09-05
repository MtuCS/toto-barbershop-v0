"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
  Product,
  Category,
  Service,
  TrainingCourse,
  MerchandiseStory,
  LookbookItem,
  Order,
  MediaItem,
  SettingsData,
  OrderStatus,
  PaymentStatus,
  ContactMessage,
} from "@/types"


import { toast } from "sonner"
import { useAuthStore } from "./auth-store"
import { useCustomerUserStore } from "./customer-user-store"

// ============================================================================
// Central editable data store (admin CMS). Persisted to LocalStorage so admin
// edits survive reloads. Backend hook point: swap each action for an API call.
// ============================================================================

interface DataState {
  products: Product[]

  categories: Category[]
  services: Service[]
  courses: TrainingCourse[]
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
  updateUser: (id: string | number, userData: any) => Promise<void>
  deleteUser: (id: string | number) => Promise<void>
  updateOrderStatus: (id: string, data: { status?: string, paymentStatus?: string, cancelReason?: string }) => Promise<boolean>
  fetchOrderHistory: (id: string | number) => Promise<any[]>
  cancelOrder: (id: string, token: string) => Promise<boolean>
  
  upsertProduct: (product: Partial<Product>) => Promise<boolean>
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
          const adminToken = typeof window !== 'undefined' ? useAuthStore.getState().session?.token : null;
          const customerToken = typeof window !== 'undefined' ? useCustomerUserStore.getState().token : null;
          const token = adminToken || customerToken;

          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders`, {
            headers: {
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
          });
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
          const token = typeof window !== 'undefined' ? useAuthStore.getState().session?.token : null;
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/users`, {
            headers: {
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
          });
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
          const token = typeof window !== 'undefined' ? useAuthStore.getState().session?.token : null;
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/users`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify(userData)
          });
          if (res.ok) {
            const newUser = await res.json();
            set(s => ({ customers: [newUser, ...s.customers.filter(c => c.id !== newUser.id)] }));
            toast.success("Tạo tài khoản thành công!");
          } else {
            const err = await res.json();
            toast.error(err.error || 'Lỗi tạo tài khoản');
          }
        } catch (error) {
          console.error("Failed to create user:", error);
          toast.error('Lỗi kết nối máy chủ');
        }
      },

      updateUser: async (id: string | number, userData: any) => {
        try {
          const token = typeof window !== 'undefined' ? useAuthStore.getState().session?.token : null;
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/users/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify(userData)
          });
          if (res.ok) {
            const updatedUser = await res.json();
            set(s => ({
              customers: s.customers.map(c => c.id === updatedUser.id ? { ...c, ...updatedUser } : c)
            }));
            toast.success("Cập nhật thông tin thành công!");
          } else {
            const err = await res.json();
            toast.error(err.error || 'Cập nhật thất bại');
          }
        } catch (error) {
          console.error("Failed to update user:", error);
          toast.error('Lỗi kết nối máy chủ');
        }
      },

      deleteUser: async (id: string | number) => {
        try {
          const token = typeof window !== 'undefined' ? useAuthStore.getState().session?.token : null;
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/users/${id}`, {
            method: 'DELETE',
            headers: {
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
          });
          if (res.ok) {
            set(s => ({
              customers: s.customers.filter(c => String(c.id) !== String(id))
            }));
            toast.success("Đã xóa tài khoản thành công!");
          } else {
            const err = await res.json();
            toast.error(err.error || 'Xóa tài khoản thất bại');
          }
        } catch (error) {
          console.error("Failed to delete user:", error);
          toast.error('Lỗi kết nối máy chủ');
        }
      },

      updateOrderStatus: async (id, data) => {
        try {
          const token = typeof window !== 'undefined' ? useAuthStore.getState().session?.token : null;
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders/${id}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify(data)
          });
          if (res.ok) {
            get().fetchOrders();
            toast.success("Đã cập nhật trạng thái đơn hàng!");
            return true;
          } else {
            const err = await res.json();
            toast.error(err.error || 'Lỗi cập nhật đơn hàng');
            return false;
          }
        } catch (error) {
          console.error("Failed to update order:", error);
          toast.error('Lỗi kết nối máy chủ');
          return false;
        }
      },

      fetchOrderHistory: async (id) => {
        try {
          const token = typeof window !== 'undefined' ? useAuthStore.getState().session?.token : null;
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders/${id}/history`, {
            headers: {
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
          });
          if (res.ok) {
            return await res.json();
          }
          return [];
        } catch (error) {
          console.error("Failed to fetch order history:", error);
          return [];
        }
      },

      cancelOrder: async (id, token) => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders/${id}/cancel`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json().catch(() => ({}));
          if (res.ok) {
            get().fetchOrders();
            return true;
          } else {
            toast.error(data.error || 'Hủy đơn hàng thất bại');
          }
        } catch (error) {
          console.error("Failed to cancel order:", error);
          toast.error('Lỗi kết nối máy chủ khi hủy đơn');
        }
        return false;
      },

      setOrderStatusInStore: (id, status, paymentStatus) => {
        set((state) => ({
          orders: state.orders.map(o => o.id.toString() === id.toString() ? { 
            ...o, 
            status: (status ? status.toLowerCase() : o.status) as OrderStatus, 
            paymentStatus: (paymentStatus ? paymentStatus.toLowerCase() : o.paymentStatus) as PaymentStatus 
          } : o)
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
            toast.success(isUpdate ? "Đã cập nhật sản phẩm." : "Đã tạo sản phẩm.");
            return true;
          } else {
            const err = await res.json();
            toast.error(err.error || 'Failed to save product');
            return false;
          }
        } catch (error) {
          console.error("Failed to save product:", error);
          toast.error('Failed to save product');
          return false;
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
