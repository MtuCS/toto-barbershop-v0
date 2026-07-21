// ============================================================================
// Domain types for Toto Barbershop frontend prototype.
// These describe the shape of ALL mock data and are ready to map to a real
// backend later (see README "Backend hook points").
// ============================================================================

export type ID = string

export type ProductCategory = 'grooming' | 'merchandise'

export type ProductStatus = 'active' | 'draft' | 'archived'

export interface ProductVariant {
  id: ID
  /** e.g. "Đen / M" */
  name: string
  /** attribute map, e.g. { size: "M", color: "Đen" } */
  options: Record<string, string>
  price: number
  /** optional strike-through price for sale badge */
  compareAtPrice?: number
  stock: number
  sku: string
}

export interface Product {
  [key: string]: unknown
  id: ID
  slug: string
  title: string
  category: ProductCategory
  /** finer collection tag, e.g. "pomade", "tee", "cap" */
  collection: string
  description: string
  /** short one-liner for cards */
  excerpt: string
  images: string[]
  variants: ProductVariant[]
  /** lowest price across variants, denormalized for listing */
  basePrice: number
  compareAtPrice?: number
  featured: boolean
  status: ProductStatus
  tags: string[]
  rating: number
  reviewCount: number
  createdAt: string
  seo?: SeoFields
}

export interface SeoFields {
  metaTitle?: string
  metaDescription?: string
}

export interface Category {
  [key: string]: unknown
  id: ID
  slug: string
  name: string
  parent: ProductCategory
  description: string
  productCount: number
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export type ServiceStatus = 'active' | 'hidden'

export interface Service {
  [key: string]: unknown
  id: ID
  slug: string
  name: string
  category: string
  price: number
  /** minutes */
  duration: number
  description: string
  process: string[]
  image: string
  featured: boolean
  order: number
  status: ServiceStatus
}

// ---------------------------------------------------------------------------
// Training
// ---------------------------------------------------------------------------

export interface TrainingModule {
  title: string
  lessons: string[]
}

export interface TrainingCourse {
  [key: string]: unknown
  id: ID
  slug: string
  title: string
  level: 'beginner' | 'intermediate' | 'pro'
  duration: string
  price: number
  summary: string
  audience: string[]
  benefits: string[]
  roadmap: { week: string; focus: string }[]
  modules: TrainingModule[]
  images: string[]
  instructor: { name: string; role: string; bio: string; avatar: string }
  status: 'published' | 'draft'
}

export type LeadStatus = 'new' | 'contacted' | 'converted' | 'rejected'

export interface TrainingLead {
  [key: string]: unknown
  id: ID
  name: string
  phone: string
  email: string
  courseId: ID | null
  message: string
  status: LeadStatus
  createdAt: string
}

// ---------------------------------------------------------------------------
// Merchandise editorial stories
// ---------------------------------------------------------------------------

export type StoryBlockType = 'text' | 'image' | 'quote' | 'gallery'

export interface StoryBlock {
  id: ID
  type: StoryBlockType
  heading?: string
  body?: string
  image?: string
  images?: string[]
}

export interface MerchandiseStory {
  [key: string]: unknown
  id: ID
  slug: string
  title: string
  subtitle: string
  heroImage: string
  manifesto: string
  blocks: StoryBlock[]
  gallery: string[]
  relatedProductIds: ID[]
  status: 'published' | 'draft'
  order: number
}

// ---------------------------------------------------------------------------
// Lookbook
// ---------------------------------------------------------------------------

export interface LookbookItem {
  [key: string]: unknown
  id: ID
  image: string
  caption: string
  category: string
  featured: boolean
  published: boolean
  order: number
}

// ---------------------------------------------------------------------------
// Cart & Orders
// ---------------------------------------------------------------------------

export interface CartItem {
  /** unique key = variantId */
  variantId: ID
  productId: ID
  slug: string
  title: string
  variantName: string
  image: string
  price: number
  quantity: number
  maxStock: number
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipping'
  | 'completed'
  | 'cancelled'

export type PaymentMethod = 'cod' | 'bank_transfer'

export type PaymentStatus = 'unpaid' | 'paid' | 'refunded'

export interface OrderItem {
  variantId: ID
  productId: ID
  title: string
  variantName: string
  image: string
  price: number
  quantity: number
}

export interface OrderTimelineEntry {
  status: OrderStatus
  at: string
  note?: string
}

export interface Order {
  [key: string]: unknown
  id: ID
  code: string
  customer: {
    name: string
    phone: string
    email: string
    address: string
    note?: string
  }
  items: OrderItem[]
  subtotal: number
  shippingFee: number
  discount: number
  total: number
  couponCode?: string
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  status: OrderStatus
  timeline: OrderTimelineEntry[]
  createdAt: string
}

export interface Customer {
  id: ID
  name: string
  phone: string
  email: string
  totalOrders: number
  totalSpent: number
  lastOrderDate: string
}

// ---------------------------------------------------------------------------
// Media
// ---------------------------------------------------------------------------

export interface MediaItem {
  [key: string]: unknown
  id: ID
  url: string
  name: string
  type: 'image'
  size: string
  createdAt: string
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export interface SettingsData {
  business: {
    name: string
    tagline: string
    description: string
  }
  contact: {
    phone: string
    email: string
    address: string
  }
  social: {
    instagram: string
    facebook: string
    tiktok: string
    youtube: string
  }
  openingHours: { day: string; hours: string }[]
  shipping: {
    freeThreshold: number
    flatFee: number
  }
  bankTransfer: {
    bankName: string
    accountName: string
    accountNumber: string
  }
  seo: SeoFields
}

// ---------------------------------------------------------------------------
// Auth (MOCK ONLY — not for production)
// ---------------------------------------------------------------------------

export interface AdminSession {
  email: string
  name: string
  loggedInAt: string
}

// ---------------------------------------------------------------------------
// Shared UI helpers
// ---------------------------------------------------------------------------

export interface FaqItem {
  question: string
  answer: string
}
