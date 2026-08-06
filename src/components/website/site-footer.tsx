import { MapPin, Phone, Clock, Share2 } from "lucide-react"

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.38 22a6.34 6.34 0 0 0 6.33-6.33V9.05a8.21 8.21 0 0 0 3.88 1.09V6.69z" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

export function SiteFooter() {
  return (
    <footer className="relative isolate border-t border-white/10 bg-[#050c0a] text-[#f2f5f3]">
      <div className="mx-auto w-full max-w-[1400px] px-5 py-16 md:px-8 md:py-20 lg:px-10 xl:px-14">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14 xl:gap-20">
          {/* Thông tin chính */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold uppercase tracking-tight text-[#f2f5f3] sm:text-4xl lg:text-5xl leading-[1.15]">
                Bạn muốn ghé ToTo thử một chuyến?
              </h2>

              <ul className="mt-8 space-y-6 text-sm md:text-base text-white/85">
                <li className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#2f7a68]/30 bg-[#2f7a68]/15 text-[#79b8a7]">
                    <Clock className="size-5" />
                  </div>
                  <div>
                    <span className="block font-semibold uppercase tracking-wider text-xs text-[#79b8a7] mb-0.5">
                      Giờ mở cửa
                    </span>
                    <span className="text-white/90">
                      09:00 – 20:00 (Mở cửa tất cả các ngày trong tuần)
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#2f7a68]/30 bg-[#2f7a68]/15 text-[#79b8a7]">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <span className="block font-semibold uppercase tracking-wider text-xs text-[#79b8a7] mb-0.5">
                      Địa chỉ
                    </span>
                    <span className="text-white/90">
                      85 Đồng Đen, Phường 12, Tân Bình, TP.HCM
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#2f7a68]/30 bg-[#2f7a68]/15 text-[#79b8a7]">
                    <Phone className="size-5" />
                  </div>
                  <div>
                    <span className="block font-semibold uppercase tracking-wider text-xs text-[#79b8a7] mb-0.5">
                      Hotline hỗ trợ
                    </span>
                    <span className="font-semibold text-[#79b8a7] text-base md:text-lg">
                      0981 378 179
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#2f7a68]/30 bg-[#2f7a68]/15 text-[#79b8a7]">
                    <Share2 className="size-5" />
                  </div>
                  <div>
                    <span className="block font-semibold uppercase tracking-wider text-xs text-[#79b8a7] mb-1.5">
                      Social của tiệm
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/90">
                        <FacebookIcon className="size-4 text-[#79b8a7]" />
                        FB
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/90">
                        <InstagramIcon className="size-4 text-[#79b8a7]" />
                        IG
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/90">
                        <TikTokIcon className="size-4 text-[#79b8a7]" />
                        TT
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bản đồ Google Maps */}
          <div className="relative min-h-[320px] w-full overflow-hidden rounded-xl border border-white/15 shadow-2xl lg:min-h-[400px]">
            <iframe
              title="Bản đồ ToTo Barbershop"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.2618228383824!2d106.64324227584168!3d10.791244358917804!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175294a530965d1%3A0xb3e18a9be3b5be5b!2s85%20%C4%90%E1%BB%93ng%20%C4%90en%2C%20Ph%C6%B0%E1%BB%9Dng%2014%2C%20T%C3%A2n%20B%C3%ACnh%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 size-full contrast-[1.05] grayscale-[0.2]"
            />
          </div>
        </div>

        {/* Dòng bản quyền */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} ToTo Barbershop. All rights reserved.</p>
          <p>Barber · Culture · Craft</p>
        </div>
      </div>
    </footer>
  )
}

