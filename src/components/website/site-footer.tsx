import Link from "next/link"
import { Camera, AtSign, Play, MapPin, Phone, Mail, Scissors } from "lucide-react"
import { defaultSettings } from "@/data/settings"
import { MAIN_NAV } from "@/lib/constants"

const shopLinks = [
  { label: "Grooming", href: "/shop/grooming" },
  { label: "Merchandise", href: "/shop/merchandise" },
  { label: "Tất cả sản phẩm", href: "/shop" },
  { label: "Lookbook", href: "/lookbook" },
]

export function SiteFooter() {
  const s = defaultSettings
  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-sm bg-primary text-primary-foreground">
                <Scissors className="size-4" />
              </span>
              <span className="font-display text-2xl font-bold uppercase">Toto</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-background/70">
              {s.business.tagline}. {s.business.description}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Link href={s.social.instagram} aria-label="Instagram" className="rounded-sm border border-background/20 p-2 transition-colors hover:bg-primary hover:text-primary-foreground">
                <Instagram className="size-4" />
              </Link>
              <Link href={s.social.facebook} aria-label="Facebook" className="rounded-sm border border-background/20 p-2 transition-colors hover:bg-primary hover:text-primary-foreground">
                <Facebook className="size-4" />
              </Link>
              <Link href={s.social.youtube} aria-label="YouTube" className="rounded-sm border border-background/20 p-2 transition-colors hover:bg-primary hover:text-primary-foreground">
                <Youtube className="size-4" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-background/50">
              Khám phá
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {MAIN_NAV.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-background/80 transition-colors hover:text-background">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-background/50">
              Cửa hàng
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-background/80 transition-colors hover:text-background">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-background/50">
              Liên hệ
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-background/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{s.contact.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-primary" />
                <a href={`tel:${s.contact.phone.replace(/\s/g, "")}`}>{s.contact.phone}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-primary" />
                <a href={`mailto:${s.contact.email}`}>{s.contact.email}</a>
              </li>
            </ul>
            <div className="mt-4 space-y-1 text-xs text-background/60">
              {s.openingHours.map((o) => (
                <div key={o.day} className="flex justify-between gap-4">
                  <span>{o.day}</span>
                  <span>{o.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-background/15 pt-6 text-xs text-background/60 md:flex-row">
          <p>© {new Date().getFullYear()} {s.business.name}. Prototype frontend.</p>
          <p>Craft. Culture. Character.</p>
        </div>
      </div>
    </footer>
  )
}
