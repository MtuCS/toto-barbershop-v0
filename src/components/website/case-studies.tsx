import Image from "next/image"
import Link from "next/link"
import { Sparkles, ArrowRight, Scissors } from "lucide-react"

export interface CaseStudyItem {
  title: string
  clientType: string
  style: string
  productUsed: string
  description: string
  image: string
}

const caseStudies: CaseStudyItem[] = [
  {
    title: "Side Part Classic 7/3 Sang Trọng",
    clientType: "Dân công sở / Doanh nhân",
    style: "Classic Low Fade",
    productUsed: "Reuzel Blue Strong Hold Pomade",
    description: "Khắc phục tóc chỉa hai bên mai, fade thấp tự nhiên và vào nếp lịch lãm giữ form suốt 12 tiếng.",
    image: "/images/lookbook-1.png",
  },
  {
    title: "Textured Crop Cá Tính Mùa Hè",
    clientType: "Sinh viên / Sáng tạo nội dung",
    style: "High Skin Fade + Textured Top",
    productUsed: "Forte Series Texture Clay",
    description: "Tạo độ phồng tơi tự nhiên cho mái tóc mỏng, dễ tạo kiểu lại sau khi đội mũ bảo hiểm chỉ bằng vài cái vuốt tay.",
    image: "/images/lookbook-2.png",
  },
  {
    title: "Modern Mullet & Tẩy Khói Sành Điệu",
    clientType: "Nghệ sĩ / Dân Streetwear",
    style: "Modern Mullet Fade",
    productUsed: "Dầu dưỡng Argan & Matte Wax",
    description: "Màn biến hóa nổi bật với phần đuôi gáy mềm mại và màu nhuộm khói sáng, đậm chất văn hóa đường phố ToTo.",
    image: "/images/lookbook-3.png",
  },
]

export function CaseStudies() {
  return (
    <section className="relative mx-auto w-full max-w-[1400px] px-5 py-16 md:px-8 md:py-24 text-[#f2f5f3]">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#79b8a7]">
          <Sparkles className="size-3.5" />
          Phong Cách Tiêu Biểu
        </span>
        <h2 className="mt-2 font-agatho text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#f2f5f3]">
          Những Màn Biến Hóa Phong Độ
        </h2>
        <p className="mt-3 text-sm md:text-base text-white/65">
          Khám phá cách một kiểu tóc chuẩn xác cùng dòng sáp vuốt tóc phù hợp thay đổi diện mạo của phái mạnh.
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {caseStudies.map((study) => (
          <div
            key={study.title}
            className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#07110f]/80 transition-all duration-300 hover:-translate-y-1 hover:border-[#79b8a7]/40 hover:shadow-[0_16px_36px_rgba(7,17,15,0.8)]"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-white/5">
              <Image
                src={study.image}
                alt={`${study.title} tại ToTo Barbershop`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07110f] via-transparent to-transparent opacity-80" />
              <span className="absolute top-3 left-3 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[11px] font-semibold text-[#79b8a7] backdrop-blur-md">
                {study.style}
              </span>
            </div>

            <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
                  {study.clientType}
                </span>
                <h3 className="mt-1 font-display text-xl font-bold uppercase tracking-tight text-white group-hover:text-[#79b8a7] transition-colors">
                  {study.title}
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-white/70">
                  {study.description}
                </p>
              </div>

              <div className="mt-6 border-t border-white/10 pt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50">Sáp khuyên dùng:</span>
                  <span className="font-semibold text-[#79b8a7]">{study.productUsed}</span>
                </div>
                <Link
                  href="/shop"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:text-[#79b8a7]"
                >
                  Tìm sáp phù hợp
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
