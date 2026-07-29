import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { services } from "@/data/services"
import { MarketingPageShell } from "@/components/website/marketing-page-shell"
import { PageHero, SectionTitle } from "@/components/website/page-hero"

export default function Page() {
  return (
    <MarketingPageShell>
      <PageHero
        eyebrow="Dịch vụ"
        title="Precision in every cut"
        description="Kỹ thuật chuẩn barber, tư vấn cá nhân và một trải nghiệm được hoàn thiện đến từng chi tiết."
        image="/images/barber-1.png"
        variant="split"
      />

      <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-24">
        <SectionTitle label="Bảng dịch vụ" title="Chọn chất riêng" theme="dark" />
        <div className="grid border-l border-t border-white/10 md:grid-cols-2">
          {services.map((service) => (
            <article
              key={service.id}
              className="grid grid-cols-[112px_1fr] border-b border-r border-white/10 bg-white/[0.025] sm:grid-cols-[160px_1fr] lg:grid-cols-[190px_1fr]"
            >
              <div className="relative min-h-52 overflow-hidden bg-black/30">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  sizes="(max-width: 639px) 112px, (max-width: 1023px) 160px, 190px"
                  className="object-cover transition-transform duration-700 hover:scale-[1.025] motion-reduce:transition-none"
                />
              </div>
              <div className="flex flex-col justify-between p-5 md:p-7">
                <h2 className="font-display text-2xl font-bold uppercase leading-tight text-[#f2f5f3] md:text-3xl">
                  {service.name}
                </h2>
                <p className="mt-5 text-sm leading-6 text-white/60">
                  {service.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[#79b8a7]/15 bg-[#13443b] px-5 py-16 text-[#f2f5f3] md:py-20">
        <div className="mx-auto grid max-w-[1400px] gap-10 md:grid-cols-12 md:items-end md:px-3">
          <div className="md:col-span-8">
            <SectionTitle
              label="Quy trình"
              title="Tư vấn. Tạo kiểu. Hoàn thiện."
              copy="Mỗi dịch vụ bắt đầu bằng việc hiểu khuôn mặt, chất tóc và phong cách sống của bạn."
              theme="dark"
            />
          </div>
          <Link
            href="/contact"
            className="group inline-flex min-h-11 w-fit items-center gap-3 border-b border-[#79b8a7] py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:text-[#79b8a7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#79b8a7] md:col-span-4 md:justify-self-end"
          >
            Liên hệ tiệm
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </MarketingPageShell>
  )
}
