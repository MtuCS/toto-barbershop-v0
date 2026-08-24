import type { Metadata } from "next"
import { CartPage } from "@/components/cart/cart-page"

export const metadata: Metadata = {
  title: "Giỏ Hàng Của Bạn",
  description: "Xem lại danh sách sản phẩm sáp vuốt tóc và merchandise ToTo Barbershop trong giỏ hàng trước khi tiến hành thanh toán.",
}

export default function Page() {
  return <CartPage />
}
