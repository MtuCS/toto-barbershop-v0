import { Clock, Mail, MapPin, Phone } from "lucide-react"
import { defaultSettings } from "@/data/settings"
import { MarketingPageShell } from "@/components/website/marketing-page-shell"
import { PageHero, SectionTitle } from "@/components/website/page-hero"

export default function Page() {
  const settings = defaultSettings
  const contactItems = [
    [MapPin, settings.contact.address],
    [Phone, settings.contact.phone],
    [Mail, settings.contact.email],
  ] as const

  return (
    <MarketingPageShell>
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
            {contactItems.map(([Icon, text]) => (
              <div key={text} className="flex gap-4 border-b border-white/12 pb-5">
                <Icon className="size-5 shrink-0 text-[#79b8a7]" aria-hidden="true" />
                <p className="text-sm leading-6 text-white/70">{text}</p>
              </div>
            ))}
            <div className="flex gap-4">
              <Clock className="size-5 shrink-0 text-[#79b8a7]" aria-hidden="true" />
              <div className="text-sm text-white/70">
                {settings.openingHours.map((item) => (
                  <p key={item.day} className="mb-2">
                    <b className="text-[#f2f5f3]">{item.day}:</b> {item.hours}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <form className="grid gap-4 bg-[#f5f9f7] p-6 text-[#101715] md:col-span-7 md:p-10">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">Lời nhắn</p>
            <h2 className="mt-3 font-display text-4xl font-bold uppercase leading-none md:text-5xl">Chúng tôi lắng nghe</h2>
          </div>
          <label className="mt-4 grid gap-2 text-xs font-semibold uppercase tracking-[0.12em]">
            Họ và tên
            <input required name="name" className="min-h-12 border border-black/20 bg-white px-4 text-base font-normal normal-case tracking-normal outline-none focus:border-primary" />
          </label>
          <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.12em]">
            Email
            <input required name="email" type="email" className="min-h-12 border border-black/20 bg-white px-4 text-base font-normal normal-case tracking-normal outline-none focus:border-primary" />
          </label>
          <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.12em]">
            Lời nhắn
            <textarea required name="message" className="min-h-40 border border-black/20 bg-white px-4 py-3 text-base font-normal normal-case tracking-normal outline-none focus:border-primary" />
          </label>
          <button className="min-h-12 bg-primary px-6 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#2f7a68] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
            Gửi lời nhắn
          </button>
        </form>
      </section>
    </MarketingPageShell>
  )
}
