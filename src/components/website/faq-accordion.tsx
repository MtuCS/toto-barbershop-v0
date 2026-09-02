"use client"

import { useState } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"

export interface FAQItem {
  question: string
  answer: string
}

const defaultFaqs: FAQItem[] = [
  {
    question: "1. Thời gian giao hàng cho đơn hàng sáp & merchandise là bao lâu?",
    answer:
      "Đối với đơn hàng tại nội thành TP.HCM (Quận Tân Bình, Quận 1, 3, 10, Phú Nhuận...), ToTo Barbershop hỗ trợ giao hoả tốc trong vòng 2 giờ hoặc trong ngày. Đối với các tỉnh thành khác trên toàn quốc, thời gian giao hàng tiêu chuẩn từ 2 - 3 ngày làm việc qua các đơn vị vận chuyển uy tín (GHTK, GHN, Viettel Post).",
  },
  {
    question: "2. Chính sách đổi trả sản phẩm sáp vuốt tóc và quần áo ToTo như thế nào?",
    answer:
      "ToTo hỗ trợ đổi mới 100% trong vòng 7 ngày nếu sản phẩm có lỗi từ nhà sản xuất (hộp sáp bị vỡ nắp, khô sáp, áo bị lỗi chỉ, không đúng size). Quý khách vui lòng giữ nguyên bao bì tem nhãn và quay video khi mở hộp hàng để được hỗ trợ nhanh nhất qua Hotline 0981 378 179.",
  },
  {
    question: "3. Làm sao để tôi chọn được loại sáp vuốt tóc phù hợp với chất tóc của mình?",
    answer:
      "Mỗi chất tóc và form đầu sẽ phù hợp với từng dòng pomade/clay khác nhau: Tóc mỏng xẹp nên chọn Matte Paste / Clay tạo phồng tự nhiên (như Forte Series, Blumaan); Tóc dày cứng hoặc uốn rủ nên chọn Pomade gốc nước tạo độ bóng lịch lãm (như Reuzel, Uppercut). Bạn có thể ghé mục Hướng dẫn chọn sáp trên website hoặc nhắn tin trực tiếp để Barber tư vấn riêng.",
  },
  {
    question: "4. Tiệm ToTo Barbershop có mở cửa vào Thứ 7, Chủ Nhật và ngày lễ không?",
    answer:
      "Có. ToTo Barbershop mở cửa xuyên suốt tất cả các ngày trong tuần từ 09:00 đến 20:00 (kể cả Thứ 7, Chủ Nhật và các dịp lễ). Khách hàng có thể ghé trực tiếp tiệm tại địa chỉ 85 Đồng Đen, Phường 12, Quận Tân Bình, TP.HCM.",
  },
  {
    question: "5. Tôi muốn tìm hiểu thông tin các khóa học nghề Barber tại ToTo Academy thì xem ở đâu?",
    answer:
      "ToTo Academy thường xuyên cập nhật giáo trình và lịch khai giảng các khóa đào tạo Barber từ Căn bản (nhập môn) đến Chuyên sâu (Fade & Stylist) tại mục Đào tạo trên website. Bạn có thể tham khảo chi tiết khung chương trình tại trang Đào tạo hoặc gọi Hotline 0981 378 179 để được Master Barber tư vấn trực tiếp.",
  },
]

export function FaqAccordion({
  items = defaultFaqs,
  title = "Câu Hỏi Thường Gặp",
  subtitle = "FAQ",
}: {
  items?: FAQItem[]
  title?: string
  subtitle?: string
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleIndex = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  return (
    <section className="relative mx-auto w-full max-w-[1400px] px-5 py-16 md:px-8 md:py-24 text-[#f2f5f3]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#79b8a7]">
          <HelpCircle className="size-3.5" />
          {subtitle}
        </span>
        <h2 className="mt-2 font-agatho text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#f2f5f3]">
          {title}
        </h2>
        <p className="mt-3 text-sm text-white/60">
          Những thắc mắc phổ biến nhất về sản phẩm, dịch vụ và chính sách của ToTo Barbershop.
        </p>
      </div>

      <div className="mt-12 mx-auto max-w-3xl divide-y divide-white/10 rounded-2xl border border-white/10 bg-[#07110f]/80 p-6 md:p-8 backdrop-blur-md">
        {items.map((item, index) => {
          const isOpen = openIndex === index

          return (
            <div key={item.question} className="py-5 first:pt-0 last:pb-0">
              <button
                type="button"
                onClick={() => toggleIndex(index)}
                className="flex w-full items-center justify-between gap-4 text-left transition-colors hover:text-[#79b8a7]"
                aria-expanded={isOpen}
              >
                <span className="font-sans text-base md:text-lg font-semibold text-white/95 leading-snug">
                  {item.question}
                </span>
                <ChevronDown
                  className={`size-5 shrink-0 text-[#79b8a7] transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-sm md:text-base text-white/70 leading-relaxed pl-1">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
