import type { Service } from '@/types'

export type ServiceFaq = {
  question: string
  answer: string
}

export const services: Service[] = [
  {
    id: 's-classic',
    slug: 'classic-haircut',
    name: 'Classic Haircut',
    category: 'Cắt tóc',
    price: 150000,
    duration: 45,
    description: 'Cắt tóc cổ điển theo khuôn mặt, gội và tạo kiểu hoàn thiện.',
    process: ['Tư vấn kiểu tóc', 'Cắt & tỉa', 'Gội massage', 'Tạo kiểu'],
    image: '/images/barber-1.png',
    featured: true,
    order: 1,
    status: 'active',
  },
  {
    id: 's-fade',
    slug: 'skin-fade',
    name: 'Skin Fade',
    category: 'Cắt tóc',
    price: 200000,
    duration: 60,
    description: 'Fade da đầu chuẩn từng lớp, đường nét sắc sảo, hiện đại.',
    process: ['Tư vấn độ fade', 'Tông đơ tạo lớp', 'Line-up', 'Tạo kiểu'],
    image: '/images/lookbook-3.png',
    featured: true,
    order: 2,
    status: 'active',
  },
  {
    id: 's-beard',
    slug: 'beard-shaping',
    name: 'Beard Shaping & Hot Towel',
    category: 'Cạo râu',
    price: 120000,
    duration: 30,
    description: 'Tạo dáng râu, cạo dao cạo truyền thống kèm khăn nóng thư giãn.',
    process: ['Khăn nóng', 'Tạo dáng râu', 'Cạo dao', 'Dưỡng da'],
    image: '/images/lookbook-5.png',
    featured: true,
    order: 3,
    status: 'active',
  },
  {
    id: 's-combo',
    slug: 'the-full-service',
    name: 'The Full Service',
    category: 'Combo',
    price: 300000,
    duration: 90,
    description: 'Combo trọn gói: cắt tóc, fade, cạo râu và tạo kiểu cao cấp.',
    process: ['Tư vấn tổng thể', 'Cắt & fade', 'Cạo râu hot towel', 'Gội & tạo kiểu'],
    image: '/images/hero.png',
    featured: true,
    order: 4,
    status: 'active',
  },
  {
    id: 's-kids',
    slug: 'kids-cut',
    name: 'Kids Cut',
    category: 'Cắt tóc',
    price: 100000,
    duration: 30,
    description: 'Cắt tóc cho bé nhẹ nhàng, thân thiện, tạo kiểu dễ thương.',
    process: ['Trò chuyện với bé', 'Cắt & tỉa', 'Tạo kiểu'],
    image: '/images/barber-2.png',
    featured: false,
    order: 5,
    status: 'active',
  },
  {
    id: 's-color',
    slug: 'hair-color',
    name: 'Hair Color',
    category: 'Nhuộm',
    price: 450000,
    priceLabel: 'Từ',
    duration: 120,
    description: 'Nhuộm màu thời trang hoặc phủ bạc, chăm sóc màu bền đẹp.',
    process: ['Tư vấn màu', 'Tẩy/nhuộm', 'Dưỡng màu', 'Tạo kiểu'],
    image: '/images/lookbook-4.png',
    featured: false,
    order: 6,
    status: 'active',
  },
]

export const serviceFaqs: ServiceFaq[] = [
  {
    question: 'Tôi chưa biết mình hợp kiểu tóc nào, ToTo có tư vấn không?',
    answer: 'Có. Barber sẽ trao đổi về gương mặt, chất tóc, nhịp sinh hoạt và phong cách bạn muốn theo đuổi trước khi bắt đầu.',
  },
  {
    question: 'Một buổi cắt tóc thường mất bao lâu?',
    answer: 'Tuỳ dịch vụ, thời lượng từ 30 đến 120 phút. Thời gian cụ thể được ghi ở từng gói để bạn dễ sắp xếp lịch.',
  },
  {
    question: 'Giá nhuộm tóc được tính như thế nào?',
    answer: 'Dịch vụ nhuộm bắt đầu từ 450.000đ. Mức giá cuối cùng phụ thuộc vào độ dài tóc, nền tóc hiện tại và màu cần thực hiện.',
  },
  {
    question: 'Tôi có cần đặt lịch trước không?',
    answer: 'Nên liên hệ trước để ToTo giữ đúng khung giờ và chuẩn bị thời lượng phù hợp cho dịch vụ của bạn.',
  },
  {
    question: 'Nên chuẩn bị gì trước khi đến tiệm?',
    answer: 'Bạn chỉ cần đến với mái tóc ở trạng thái tự nhiên và chia sẻ thói quen tạo kiểu hằng ngày. Nếu có ảnh tham khảo, hãy mang theo để barber tư vấn chính xác hơn.',
  },
]
