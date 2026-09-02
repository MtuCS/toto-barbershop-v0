import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { MarketingPageShell } from "@/components/website/marketing-page-shell"
import { PageHero, SectionTitle } from "@/components/website/page-hero"
import { Breadcrumbs } from "@/components/website/breadcrumbs"
import { TeamSection } from "@/components/website/team-section"
import { ShoppingBag, Scissors } from "lucide-react"

export const metadata: Metadata = {
  title: "Về Chúng Tôi — Câu Chuyện & Đội Ngũ",
  description:
    "ToTo Barbershop từ 2013 — Không gian văn hóa Barber cổ điển kết hợp phong cách đường phố đương đại tại Sài Gòn. Tìm hiểu câu chuyện thương hiệu và đội ngũ Master Barber.",
}

const stats = [
  ["13+", "Năm theo nghề"],
  ["30K", "Khách hàng"],
  ["300+", "Học viên"],
  ["01", "Tinh thần TOTO"],
]

export default function Page() {
  return (
    <MarketingPageShell>
      <div className="mx-auto max-w-[1400px] px-5 pt-6 md:px-8">
        <Breadcrumbs items={[{ label: "Về ToTo Barbershop" }]} />
      </div>

      <PageHero
        eyebrow="Since 2013"
        title="Built by craft"
        description="TOTO là nơi kỹ nghệ cổ điển gặp văn hóa đương đại."
        image="/images/about.png"
        variant="split"
      />

      <section className="mx-auto grid max-w-[1400px] gap-12 px-5 py-16 md:grid-cols-12 md:px-8 md:py-24">
        <div className="md:col-span-6">
          <SectionTitle
            label="Câu chuyện"
            title="Không chỉ là một tiệm tóc"
            copy="Chúng tôi tin một kiểu tóc tốt có thể thay đổi cách bạn bước ra đường. TOTO được xây dựng từ sự tôn trọng nghề, con người và những chi tiết nhỏ."
            theme="dark"
          />
        </div>
        <div className="grid grid-cols-2 border-l border-t border-black/10 bg-[#f5f9f7] text-[#101715] md:col-span-6">
          {stats.map(([value, label]) => (
            <div key={label} className="border-b border-r border-black/10 p-6 md:p-8">
              <b className="font-serif text-5xl font-medium text-primary md:text-6xl">{value}</b>
              <p className="mt-3 text-sm text-neutral-600">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Photo Section */}
      <TeamSection />

      {/* Interior Image Banner */}
      <div className="relative h-[55dvh] min-h-[420px] border-y border-white/10">
        <Image
          src="/images/interior.png"
          alt="Không gian nội thất cổ điển tại ToTo Barbershop 85 Đồng Đen"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Internal Links CTA */}
      <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-20 text-center">
        <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-[#07110f]/80 p-8 md:p-12 backdrop-blur-md">
          <h2 className="font-agatho text-2xl md:text-4xl font-medium text-[#f2f5f3]">
            Khám Phá Thêm Về ToTo
          </h2>
          <p className="mt-3 text-sm text-white/70">
            Trải nghiệm dịch vụ chuyên nghiệp hoặc lựa chọn các dòng sáp vuốt tóc chính hãng được thợ tin dùng.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-[#79b8a7] px-6 py-3 text-xs md:text-sm font-bold uppercase tracking-wider text-[#050c0a] transition-all hover:bg-[#8ec7b7]"
            >
              <ShoppingBag className="size-4" />
              Ghé Shop Sáp & Merch
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-xs md:text-sm font-bold uppercase tracking-wider text-white transition-all hover:border-[#79b8a7]"
            >
              <Scissors className="size-4 text-[#79b8a7]" />
              Menu Dịch Vụ
            </Link>
          </div>
        </div>
      </section>
    </MarketingPageShell>
  )
}
