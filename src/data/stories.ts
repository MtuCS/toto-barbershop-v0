import type { MerchandiseStory } from '@/types'

export const merchandiseStories: MerchandiseStory[] = [
  {
    id: 'st-origin',
    slug: 'the-origin',
    title: 'The Origin',
    subtitle: 'Từ ghế cắt đến tủ đồ',
    heroImage: '/images/merch-story-hero.png',
    manifesto:
      'Toto Merchandise sinh ra từ văn hóa barber — nơi mỗi đường kéo, mỗi lần fade đều là một tuyên ngôn phong cách. Chúng tôi biến tinh thần đó thành những món đồ bạn mặc mỗi ngày.',
    blocks: [
      { id: 'b-1', type: 'text', heading: 'Bắt đầu từ tiệm', body: 'Mọi thứ khởi nguồn từ chiếc ghế cắt tóc. Những cuộc trò chuyện, âm nhạc và phong cách sống trong tiệm chính là chất liệu cho bộ sưu tập.' },
      { id: 'b-2', type: 'image', image: '/images/merch-lifestyle.png' },
      { id: 'b-3', type: 'quote', body: 'Chúng tôi không bán quần áo. Chúng tôi bán một thái độ.' },
      { id: 'b-4', type: 'text', heading: 'Chất liệu thật', body: 'Cotton dày, vải bố bền, đường may chắc. Mỗi sản phẩm được chọn để đồng hành lâu dài, không chạy theo mùa vụ.' },
    ],
    gallery: ['/images/merch-lifestyle.png', '/images/merch-tee.png', '/images/merch-cap.png', '/images/merch-jacket.png'],
    relatedProductIds: ['p-tee', 'p-cap', 'p-jacket'],
    status: 'published',
    order: 1,
  },
  {
    id: 'st-workwear',
    slug: 'workwear-chapter',
    title: 'Workwear Chapter',
    subtitle: 'Bền bỉ như người thợ',
    heroImage: '/images/merch-jacket.png',
    manifesto:
      'Lấy cảm hứng từ trang phục lao động, chương Workwear tôn vinh sự bền bỉ, thực dụng và vẻ đẹp mộc mạc của người thợ lành nghề.',
    blocks: [
      { id: 'b-5', type: 'text', heading: 'Tinh thần workwear', body: 'Túi hộp tiện dụng, vải bố dày, form phom chuẩn — thiết kế để làm việc và để sống.' },
      { id: 'b-6', type: 'gallery', images: ['/images/merch-jacket.png', '/images/behind-scenes.png'] },
      { id: 'b-7', type: 'text', heading: 'Màu của tiệm', body: 'Xanh rêu — màu đặc trưng của Toto, xuất hiện xuyên suốt bộ sưu tập như một chữ ký.' },
    ],
    gallery: ['/images/merch-jacket.png', '/images/behind-scenes.png', '/images/merch-story-hero.png'],
    relatedProductIds: ['p-jacket', 'p-hoodie', 'p-cap'],
    status: 'published',
    order: 2,
  },
]

export function getStoryBySlug(slug: string): MerchandiseStory | undefined {
  return merchandiseStories.find((s) => s.slug === slug)
}
