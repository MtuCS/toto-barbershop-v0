import Image from "next/image"
import { MarketingPageShell } from "@/components/website/marketing-page-shell"
import { PageHero, SectionTitle } from "@/components/website/page-hero"

const stats = [
  ["13+", "Năm theo nghề"],
  ["30K", "Khách hàng"],
  ["300+", "Học viên"],
  ["01", "Tinh thần TOTO"],
]

export default function Page() {
  return (
    <MarketingPageShell>
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

      <div className="relative h-[55dvh] min-h-[420px] border-y border-white/10">
        <Image
          src="/images/interior.png"
          alt="Không gian TOTO Barbershop"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </MarketingPageShell>
  )
}
