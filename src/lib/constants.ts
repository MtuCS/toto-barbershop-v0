import type { OrderStatus, LeadStatus, PaymentStatus } from '@/types'

export const SITE_NAME = 'Toto Barbershop'

// MOCK admin credentials — displayed on the login screen. NOT for production.
export const MOCK_ADMIN = {
  email: 'admin@totobarbershop.vn',
  password: 'admin123',
  name: 'Toto Admin',
} as const

export interface NavLink {
  label: string
  href: string
  highlight?: boolean
  children?: { label: string; href: string; description?: string }[]
}

export const MAIN_NAV: NavLink[] = [
  {
    label: 'Dịch vụ',
    href: '/services',
    children: [
      { label: 'Cắt tóc', href: '/services', description: 'Fade, undercut, classic' },
      { label: 'Cạo râu & tạo kiểu', href: '/services', description: 'Hot towel, shaping' },
      { label: 'Combo chăm sóc', href: '/services', description: 'Gói dịch vụ trọn gói' },
    ],
  },
  { label: 'Đào tạo', href: '/training' },
  { label: 'Shop', href: '/shop' },
  { label: 'Merchandise', href: '/merchandise', highlight: true },
  { label: 'Lookbook', href: '/lookbook' },
  { label: 'Về Toto', href: '/about' },
  { label: 'Liên hệ', href: '/contact' },
]

export const ADMIN_NAV = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard' },
  { label: 'Sản phẩm', href: '/admin/products', icon: 'Package' },
  { label: 'Danh mục', href: '/admin/categories', icon: 'FolderTree' },
  { label: 'Dịch vụ', href: '/admin/services', icon: 'Scissors' },
  { label: 'Đào tạo', href: '/admin/training', icon: 'GraduationCap' },
  { label: 'Merchandise Stories', href: '/admin/merchandise-stories', icon: 'BookOpen' },
  { label: 'Lookbook', href: '/admin/lookbook', icon: 'Images' },
  { label: 'Đơn hàng', href: '/admin/orders', icon: 'ShoppingBag' },
  { label: 'Khách hàng', href: '/admin/customers', icon: 'Users' },
  { label: 'Media', href: '/admin/media', icon: 'ImagePlus' },
  { label: 'Cài đặt', href: '/admin/settings', icon: 'Settings' },
] as const

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  completed: 'Hoàn thành',
  cancelled: 'Đã huỷ',
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  unpaid: 'Chưa thanh toán',
  paid: 'Đã thanh toán',
  refunded: 'Đã hoàn tiền',
}

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'Mới',
  contacted: 'Đã liên hệ',
  converted: 'Đã chuyển đổi',
  rejected: 'Từ chối',
}

// MOCK coupons for checkout demo.
export const MOCK_COUPONS: Record<string, { type: 'percent' | 'fixed'; value: number }> = {
  TOTO10: { type: 'percent', value: 10 },
  FREESHIP: { type: 'fixed', value: 30000 },
  BARBER50K: { type: 'fixed', value: 50000 },
}

export const SHIPPING_FLAT_FEE = 30000
export const FREE_SHIPPING_THRESHOLD = 500000
