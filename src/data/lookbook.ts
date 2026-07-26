import type { LookbookItem } from '@/types'

export const lookbookItems: LookbookItem[] = [
  { id: 'lb-1', image: '/images/lookbook-1.png', caption: 'Pompadour cổ điển', category: 'Classic', featured: true, published: true, order: 1 },
  { id: 'lb-2', image: '/images/lookbook-2.png', caption: 'Textured crop & beard', category: 'Modern', featured: true, published: true, order: 2 },
  { id: 'lb-3', image: '/images/lookbook-3.png', caption: 'Skin fade sắc nét', category: 'Fade', featured: false, published: true, order: 3 },
  { id: 'lb-4', image: '/images/lookbook-4.png', caption: 'Side part thanh lịch', category: 'Classic', featured: false, published: true, order: 4 },
  { id: 'lb-5', image: '/images/lookbook-5.png', caption: 'Hot towel shave', category: 'Grooming', featured: true, published: true, order: 5 },
  { id: 'lb-6', image: '/images/lookbook-6.png', caption: 'Buzz cut & line-up', category: 'Modern', featured: false, published: true, order: 6 },
  { id: 'lb-7', image: '/images/lookbook-7.png', caption: 'Quiff & beard combo', category: 'Modern', featured: false, published: true, order: 7 },
  { id: 'lb-8', image: '/images/lookbook-8.png', caption: 'Disconnected undercut', category: 'Modern', featured: false, published: true, order: 8 },
  
  // Shop images
  { id: 'lb-shop-1', image: '/images/interior.png', caption: 'Không gian nội thất', category: 'Shop', featured: true, published: true, order: 9 },
  { id: 'lb-shop-2', image: '/images/interior1.png', caption: 'Góc chờ', category: 'Shop', featured: false, published: true, order: 10 },
  { id: 'lb-shop-3', image: '/images/behind-scenes.png', caption: 'Sau hậu trường', category: 'Shop', featured: false, published: true, order: 11 },
  { id: 'lb-shop-4', image: '/images/barber-1.png', caption: 'Thợ cạo TOTO', category: 'Shop', featured: false, published: true, order: 12 },
  { id: 'lb-shop-5', image: '/images/barber-2.png', caption: 'Kỹ thuật fade', category: 'Shop', featured: false, published: true, order: 13 },
  { id: 'lb-shop-6', image: '/images/barber-3.png', caption: 'Chăm sóc tỉ mỉ', category: 'Shop', featured: false, published: true, order: 14 },
]
