import type { Product } from "@/types"

const product = (
  id: string,
  slug: string,
  title: string,
  category: Product["category"],
  collection: string,
  image: string,
  price: number,
  featured = false,
): Product => ({
  id,
  slug,
  title,
  category,
  collection,
  description: `${title} — sản phẩm tuyển chọn tại TOTO Shop.`,
  excerpt: "Tuyển chọn cho routine và phong cách hằng ngày.",
  images: [image],
  variants: [
    {
      id: `${id}-default`,
      name: "Tiêu chuẩn",
      options: {},
      price,
      stock: 12,
      sku: `TOTO-${id.toUpperCase()}`,
    },
  ],
  basePrice: price,
  featured,
  status: "active",
  tags: [category, collection],
  rating: 4.8,
  reviewCount: 12,
  createdAt: "2026-07-29",
})

export const products: Product[] = [
  product("grm-pomade", "toto-water-pomade", "TOTO Water Pomade", "grooming", "pomade", "/images/grooming-pomade.png", 280000, true),
  product("grm-clay", "toto-matte-clay", "TOTO Matte Clay", "grooming", "clay", "/images/grooming-clay.png", 260000, true),
  product("grm-shampoo", "toto-daily-shampoo", "TOTO Daily Shampoo", "grooming", "shampoo", "/images/grooming-shampoo.png", 220000),
  product("grm-beard", "toto-beard-oil", "TOTO Beard Oil", "grooming", "beard care", "/images/grooming-beard-oil.png", 240000),
  product("grm-comb", "toto-pocket-comb", "TOTO Pocket Comb", "grooming", "tools", "/images/grooming-comb.png", 120000),
  product("mrc-tee", "toto-logo-tee", "TOTO Logo Tee", "merchandise", "tee", "/images/merch-tee.png", 390000, true),
  product("mrc-hoodie", "toto-workwear-hoodie", "TOTO Workwear Hoodie", "merchandise", "hoodie", "/images/merch-hoodie.png", 690000, true),
  product("mrc-jacket", "toto-street-jacket", "TOTO Street Jacket", "merchandise", "jacket", "/images/merch-jacket.png", 790000),
  product("mrc-cap", "toto-barber-cap", "TOTO Barber Cap", "merchandise", "cap", "/images/merch-cap.png", 320000),
  product("mrc-tote", "toto-market-tote", "TOTO Market Tote", "merchandise", "tote", "/images/merch-tote.png", 290000),
  product("mrc-socks", "toto-socks-set", "TOTO Socks Set", "merchandise", "socks", "/images/merch-socks.png", 180000),
]