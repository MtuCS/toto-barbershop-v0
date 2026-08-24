import type { Metadata } from "next"
import { CheckoutForm } from "@/components/website/checkout-form"

export const metadata: Metadata = {
  title: "Thanh Toán Đơn Hàng An Toàn",
  description: "Xác nhận địa chỉ nhận hàng và lựa chọn phương thức thanh toán COD hoặc chuyển khoản PayOS cho đơn hàng tại ToTo Barbershop.",
}

export default function Page() {
  return <CheckoutForm />
}
