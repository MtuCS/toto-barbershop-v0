import type { Metadata } from "next"
import { ShieldCheck, Lock, FileText, RefreshCw, Mail, Phone } from "lucide-react"
import { Breadcrumbs } from "@/components/website/breadcrumbs"

export const metadata: Metadata = {
  title: "Chính Sách Bảo Mật & Điều Khoản Dịch Vụ",
  description:
    "Chính sách bảo mật thông tin khách hàng, điều khoản mua sắm và quy định đổi trả sản phẩm 7 ngày tại ToTo Barbershop.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="relative min-h-screen bg-[#050c0a] text-[#f2f5f3] py-12 px-5 md:px-8">
      <div className="mx-auto max-w-4xl">
        <Breadcrumbs items={[{ label: "Chính sách bảo mật & Điều khoản" }]} />

        {/* Header */}
        <div className="mt-6 border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#79b8a7]/30 bg-[#13443B]/30 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#79b8a7]">
            <ShieldCheck className="size-4" />
            Cam kết minh bạch
          </div>
          <h1 className="mt-3 font-agatho text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#f2f5f3]">
            Chính Sách Bảo Mật & Điều Khoản
          </h1>
          <p className="mt-3 text-sm text-white/60">
            Cập nhật lần cuối: Tháng 8, 2026 · Áp dụng cho toàn bộ khách hàng và học viên ToTo Barbershop.
          </p>
        </div>

        {/* Content sections */}
        <div className="mt-10 space-y-12 text-sm sm:text-base text-white/80 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="flex items-center gap-2.5 font-display text-xl font-bold uppercase tracking-tight text-[#79b8a7]">
              <Lock className="size-5" />
              1. Thu Thập & Bảo Mật Thông Tin Cá Nhân
            </h2>
            <p>
              ToTo Barbershop chỉ thu thập các thông tin cần thiết khi quý khách đặt hàng hoặc gửi liên hệ trên website, bao gồm: <strong>Họ tên, Số điện thoại, Địa chỉ giao hàng và Email</strong>.
            </p>
            <p>
              Chúng tôi cam kết:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-white/70">
              <li>Không bán, chia sẻ hoặc để lộ thông tin của quý khách cho bên thứ ba vì bất kỳ mục đích thương mại nào.</li>
              <li>Thông tin được mã hóa an toàn và chỉ sử dụng để xử lý đơn hàng, gửi mã OTP xác thực và chăm sóc sau mua hàng.</li>
              <li>Quý khách có quyền yêu cầu xóa hoặc cập nhật thông tin cá nhân của mình bất kỳ lúc nào tại mục Trang cá nhân hoặc liên hệ hotline.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="flex items-center gap-2.5 font-display text-xl font-bold uppercase tracking-tight text-[#79b8a7]">
              <RefreshCw className="size-5" />
              2. Chính Sách Đổi Trả Sản Phẩm Trong 7 Ngày
            </h2>
            <p>
              Để đảm bảo quyền lợi cao nhất cho anh em mua sắm sáp vuốt tóc và merchandise ToTo:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-white/70">
              <li><strong>Đổi mới 100% trong 7 ngày:</strong> Nếu sản phẩm bị hư hỏng trong quá trình vận chuyển (bể nắp, móp hộp sáp) hoặc giao sai phân loại/size áo.</li>
              <li><strong>Điều kiện:</strong> Sản phẩm còn nguyên tem mác, chưa qua sử dụng (đối với sáp chưa mở seal) và có video đồng kiểm khi mở hàng.</li>
              <li>ToTo chịu toàn bộ chi phí vận chuyển 2 chiều đối với các đơn hàng phát sinh lỗi từ phía shop.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="flex items-center gap-2.5 font-display text-xl font-bold uppercase tracking-tight text-[#79b8a7]">
              <FileText className="size-5" />
              3. Điều Khoản Mua Hàng & Thanh Toán
            </h2>
            <p>
              Website hỗ trợ hai hình thức thanh toán linh hoạt và an toàn:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-white/70">
              <li><strong>Thanh toán khi nhận hàng (COD):</strong> Kiểm tra hàng trước khi thanh toán tiền mặt cho nhân viên giao hàng.</li>
              <li><strong>Chuyển khoản QR PayOS:</strong> Thanh toán tức thì qua cổng VietQR chuẩn Napas247, tự động duyệt đơn và miễn phí vận chuyển.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-4 rounded-2xl border border-white/10 bg-[#07110f]/90 p-6 md:p-8">
            <h2 className="font-display text-lg font-bold uppercase tracking-tight text-white">
              4. Trung Tâm Hỗ Trợ & Giải Đáp Khiếu Nại
            </h2>
            <p className="text-sm text-white/70">
              Nếu bạn có bất kỳ thắc mắc hoặc cần khiếu nại về đơn hàng, vui lòng liên hệ ngay với ToTo Barbershop:
            </p>
            <div className="mt-4 flex flex-wrap gap-6 text-sm">
              <a href="tel:0981378179" className="flex items-center gap-2 text-[#79b8a7] font-semibold hover:underline">
                <Phone className="size-4" />
                0981 378 179
              </a>
              <a href="mailto:totobarbershop2013@gmail.com" className="flex items-center gap-2 text-[#79b8a7] font-semibold hover:underline">
                <Mail className="size-4" />
                totobarbershop2013@gmail.com
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
