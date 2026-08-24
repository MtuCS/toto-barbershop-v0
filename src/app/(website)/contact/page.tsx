import type { Metadata } from "next"
import { Clock, Mail, MapPin, Phone } from "lucide-react"
import { getSettings } from "@/lib/api"
import { MarketingPageShell } from "@/components/website/marketing-page-shell"
import { PageHero, SectionTitle } from "@/components/website/page-hero"
import { ContactForm } from "@/components/website/contact-form"
import { Breadcrumbs } from "@/components/website/breadcrumbs"
import { MapSection } from "@/components/website/map-section"

export const metadata: Metadata = {
  title: "Liên Hệ & Chỉ Đường Đến Tiệm",
  description:
    "Ghé tiệm ToTo Barbershop tại 85 Đồng Đen, Phường 12, Tân Bình, TP.HCM hoặc liên hệ Hotline 0981 378 179 để được tư vấn dịch vụ và sáp vuốt tóc.",
}

export default async function Page() {
  const settings = await getSettings()
  const contact = settings?.contact || { phone: "", email: "", address: "" }
  
  const contactItems = [
    [MapPin, contact?.address || "85 Đồng Đen, Phường 12, Quận Tân Bình, TP.HCM"],
    [Phone, contact?.phone || "0981 378 179"],
    [Mail, contact?.email || "totobarbershop2013@gmail.com"],
  ] as const

  return (
    <MarketingPageShell>
      <div className="mx-auto max-w-[1400px] px-5 pt-6 md:px-8">
        <Breadcrumbs items={[{ label: "Liên hệ & Chỉ đường" }]} />
      </div>

      <PageHero
        eyebrow="Contact"
        title="Come say hello"
        description="Ghé tiệm, gọi cho chúng tôi hoặc gửi một lời nhắn."
        image="/images/interior.png"
        variant="split"
      />

      <section className="mx-auto grid max-w-[1400px] gap-12 px-5 py-16 md:grid-cols-12 md:px-8 md:py-24">
        <div className="md:col-span-5">
          <SectionTitle label="Tìm TOTO" title="Gặp nhau tại tiệm" theme="dark" />
          <div className="space-y-6">
            {contactItems.map(([Icon, text], index) => (
              <div key={index} className="flex gap-4 border-b border-white/12 pb-5">
                <Icon className="size-5 shrink-0 text-[#79b8a7]" aria-hidden="true" />
                <p className="text-sm leading-6 text-white/70">{text}</p>
              </div>
            ))}
            <div className="flex gap-4">
              <Clock className="size-5 shrink-0 text-[#79b8a7]" aria-hidden="true" />
              <div className="text-sm text-white/70">
                {[
                  { day: "Thứ 2 - Chủ Nhật", hours: "09:00 - 20:00 (Mở cửa cả ngày lễ)" },
                ].map((item) => (
                  <p key={item.day} className="mb-2">
                    <b className="text-[#f2f5f3]">{item.day}:</b> {item.hours}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <ContactForm />
      </section>

      {/* Map and Directions Component */}
      <div className="border-t border-white/10">
        <MapSection />
      </div>
    </MarketingPageShell>
  )
}
