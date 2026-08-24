import type { Metadata } from "next"
import { ShopLanding } from "@/components/website/shop-landing"

export const metadata: Metadata = {
  title: "Cửa Hàng Sáp Vuốt Tóc, Pomade & Merchandise Streetwear",
  description:
    "Mua sắm sáp vuốt tóc cao cấp chính hãng (Reuzel, Forte Series, Blumaan, Uppercut) và các sản phẩm thời trang streetwear độc quyền từ ToTo Barbershop.",
}

export default function Page() {
  return <ShopLanding />
}