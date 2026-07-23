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
  CartItem,
} from "@/types"


import { categories as seedCategories } from "@/data/categories"
import { services as seedServices } from "@/data/services"
import { trainingCourses as seedCourses } from "@/data/training"
import { merchandiseStories as seedStories } from "@/data/stories"
import { lookbookItems as seedLookbook } from "@/data/lookbook"
// import { orders as seedOrders } from "@/data/orders"
import { media as seedMedia } from "@/data/media"
import { defaultSettings } from "@/data/settings"

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
  customers: any[] // we use users as customers
  media: MediaItem[]
  settings: SettingsData

  fetchProducts: () => Promise<void>
  fetchOrders: () => Promise<void>
  fetchUsers: () => Promise<void>
  createUser: (userData: any) => Promise<void>
  upsertProduct: (product: Product) => void
  deleteProduct: (id: string) => void

  // Categories
  upsertCategory: (category: Category) => void
  deleteCategory: (id: string) => void

  // Services
  upsertService: (service: Service) => void
  deleteService: (id: string) => void

  // Courses
  upsertCourse: (course: TrainingCourse) => void
  deleteCourse: (id: string) => void

  // Leads
  addLead: (lead: Omit<TrainingLead, "id" | "createdAt" | "status">) => void
  updateLeadStatus: (id: string, status: TrainingLead["status"]) => void
  deleteLead: (id: string) => void

  // Stories
  upsertStory: (story: MerchandiseStory) => void
  deleteStory: (id: string) => void

  // Lookbook
  upsertLookbook: (item: LookbookItem) => void
  deleteLookbook: (id: string) => void

  // Orders
  placeOrder: (input: {
    customer: Order["customer"]
    items: CartItem[]
    subtotal: number
    shippingFee: number
    discount: number
    total: number
    couponCode?: string
    paymentMethod: Order["paymentMethod"]
  }) => Order
  updateOrderStatus: (id: string, status: OrderStatus, note?: string) => void

  // Media
  addMedia: (item: Omit<MediaItem, "id" | "createdAt">) => void
  deleteMedia: (id: string) => void

  // Settings
  updateSettings: (settings: SettingsData) => void

  resetAll: () => void
}

const seed = {
  products: [] as Product[],
  categories: seedCategories,
  services: seedServices,
  courses: seedCourses,
  leads: [] as TrainingLead[],
  stories: seedStories,
  lookbook: seedLookbook,
  orders: [] as Order[],
  customers: [] as any[],
  media: seedMedia,
  settings: defaultSettings,
}

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      ...seed,

      fetchProducts: async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products`);
          if (res.ok) {
            const data = await res.json();
            set({ products: data });
          }
        } catch (error) {
          console.error("Failed to fetch products:", error);
        }
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
            alert(err.error || 'Failed to create user');
          }
        } catch (error) {
          console.error("Failed to create user:", error);
          alert('Failed to create user');
        }
      },

      upsertProduct: (product) =>
        set((s) => ({
          products: s.products.some((p) => p.id === product.id)
            ? s.products.map((p) => (p.id === product.id ? product : p))
            : [{ ...product, id: product.id || Number(uid("p").replace('p-','')) }, ...s.products],
        })),
      deleteProduct: (id) => set((s) => ({ products: s.products.filter((p) => p.id !== Number(id)) })),

      upsertCategory: (category) =>
        set((s) => ({
          categories: s.categories.some((c) => c.id === category.id)
            ? s.categories.map((c) => (c.id === category.id ? category : c))
            : [...s.categories, { ...category, id: category.id || uid("c") }],
        })),
      deleteCategory: (id) => set((s) => ({ categories: s.categories.filter((c) => c.id !== id) })),

      upsertService: (service) =>
        set((s) => ({
          services: s.services.some((x) => x.id === service.id)
            ? s.services.map((x) => (x.id === service.id ? service : x))
            : [...s.services, { ...service, id: service.id || uid("s") }],
        })),
      deleteService: (id) => set((s) => ({ services: s.services.filter((x) => x.id !== id) })),

      upsertCourse: (course) =>
        set((s) => ({
          courses: s.courses.some((x) => x.id === course.id)
            ? s.courses.map((x) => (x.id === course.id ? course : x))
            : [...s.courses, { ...course, id: course.id || uid("t") }],
        })),
      deleteCourse: (id) => set((s) => ({ courses: s.courses.filter((x) => x.id !== id) })),

      addLead: (lead) =>
        set((s) => ({
          leads: [
            {
              ...lead,
              id: uid("lead"),
              status: "new",
              createdAt: new Date().toISOString(),
            } as TrainingLead,
            ...s.leads,
          ],
        })),
      updateLeadStatus: (id, status) =>
        set((s) => ({ leads: s.leads.map((l) => (l.id === id ? { ...l, status } : l)) })),
      deleteLead: (id) => set((s) => ({ leads: s.leads.filter((l) => l.id !== id) })),

      upsertStory: (story) =>
        set((s) => ({
          stories: s.stories.some((x) => x.id === story.id)
            ? s.stories.map((x) => (x.id === story.id ? story : x))
            : [...s.stories, { ...story, id: story.id || uid("st") }],
        })),
      deleteStory: (id) => set((s) => ({ stories: s.stories.filter((x) => x.id !== id) })),

      upsertLookbook: (item) =>
        set((s) => ({
          lookbook: s.lookbook.some((x) => x.id === item.id)
            ? s.lookbook.map((x) => (x.id === item.id ? item : x))
            : [...s.lookbook, { ...item, id: item.id || uid("lb") }],
        })),
      deleteLookbook: (id) => set((s) => ({ lookbook: s.lookbook.filter((x) => x.id !== id) })),

      placeOrder: (input) => {
        const now = new Date().toISOString()
        const order: Order = {
          id: uid("ord"),
          code: `TOTO-${Math.floor(1000 + Math.random() * 9000)}`,
          customer: input.customer,
          items: input.items.map((i) => ({
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
          timeline: [{ status: "pending", at: now, note: "Khách đặt hàng" }],
          createdAt: now,
        }
        set((s) => ({ orders: [order, ...s.orders] }))
        return order
      },
      updateOrderStatus: (id, status, note) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === id
              ? {
                  ...o,
                  status,
                  timeline: [...o.timeline, { status, at: new Date().toISOString(), note }],
                }
              : o,
          ),
        })),

      addMedia: (item) =>
        set((s) => ({
          media: [
            { ...item, id: uid("med"), createdAt: new Date().toISOString().slice(0, 10) } as MediaItem,
            ...s.media,
          ],
        })),
      deleteMedia: (id) => set((s) => ({ media: s.media.filter((m) => m.id !== id) })),

      updateSettings: (settings) => set({ settings }),

      resetAll: () => set({ ...seed }),
    }),
    {
      name: "toto-admin-data",
      version: 1,
    },
  ),
)

export function getOrderByCode(orders: Order[], code: string) {
  return orders.find((o) => o.code === code)
}
