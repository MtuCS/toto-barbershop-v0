import type { Category } from '@/types'

export const categories: Category[] = [
  { id: 'c-grooming', slug: 'grooming', name: 'Grooming', parent: 'grooming', description: 'Sản phẩm chăm sóc tóc và râu.', productCount: 6 },
  { id: 'c-merch', slug: 'merchandise', name: 'Toto Merchandise', parent: 'merchandise', description: 'Đồ streetwear & phụ kiện thương hiệu.', productCount: 6 },
  { id: 'c-pomade', slug: 'pomade', name: 'Pomade & Sáp', parent: 'grooming', description: 'Sản phẩm tạo kiểu.', productCount: 2 },
  { id: 'c-beard', slug: 'beard', name: 'Chăm sóc râu', parent: 'grooming', description: 'Dầu & dưỡng râu.', productCount: 1 },
  { id: 'c-apparel', slug: 'apparel', name: 'Apparel', parent: 'merchandise', description: 'Áo & khoác.', productCount: 3 },
  { id: 'c-accessory', slug: 'accessory', name: 'Phụ kiện', parent: 'merchandise', description: 'Nón, túi, tất.', productCount: 3 },
]
