import { MapPin, Navigation, Car, Phone, Clock } from "lucide-react"

export function MapSection() {
  const address = "85 Đồng Đen, Phường 12, Quận Tân Bình, TP. Hồ Chí Minh"
  const googleMapsDirectionsUrl = "https://www.google.com/maps/place/Toto+babershop/@10.793289,106.644723,17z/data=!4m6!3m5!1s0x317529fab862286b:0x558f62689c90fdae!8m2!3d10.793289!4d106.644723!16s%2Fg%2F11sy6vhbxb?entry=ttu"

  return (
    <section className="relative mx-auto w-full max-w-[1400px] px-5 py-16 md:px-8 md:py-24 text-[#f2f5f3]">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#79b8a7]">
          <MapPin className="size-3.5" />
          Địa Điểm & Chỉ Đường
        </span>
        <h2 className="mt-2 font-agatho text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#f2f5f3]">
          Ghé Tiệm ToTo Barbershop
        </h2>
        <p className="mt-3 text-sm md:text-base text-white/65">
          Tọa lạc ngay trung tâm Tân Bình, không gian thoáng đãng với chỗ đỗ xe máy & ô tô rộng rãi miễn phí.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-12 items-center">
        {/* Information Column */}
        <div className="space-y-6 lg:col-span-5 rounded-2xl border border-white/10 bg-[#07110f]/90 p-6 md:p-8 backdrop-blur-md">
          <div className="flex items-start gap-4 border-b border-white/10 pb-5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#79b8a7]/15 text-[#79b8a7]">
              <MapPin className="size-5" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#79b8a7] block">
                Địa chỉ tiệm
              </span>
              <p className="mt-1 text-sm md:text-base font-medium text-white/95 leading-relaxed">
                {address}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 border-b border-white/10 pb-5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#79b8a7]/15 text-[#79b8a7]">
              <Clock className="size-5" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#79b8a7] block">
                Giờ phục vụ
              </span>
              <p className="mt-1 text-sm text-white/90">
                09:00 – 20:30 (Mở cửa tất cả các ngày trong tuần)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 border-b border-white/10 pb-5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#79b8a7]/15 text-[#79b8a7]">
              <Car className="size-5" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#79b8a7] block">
                Bãi đỗ xe miễn phí
              </span>
              <p className="mt-1 text-sm text-white/90">
                Chỗ đỗ xe máy & ô tô rộng rãi, có bảo vệ trông xe an tâm.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 pb-2">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#79b8a7]/15 text-[#79b8a7]">
              <Phone className="size-5" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#79b8a7] block">
                Hotline hỗ trợ
              </span>
              <a
                href="tel:0981378179"
                className="mt-1 block text-base font-bold text-[#79b8a7] transition-colors hover:underline"
              >
                0981 378 179
              </a>
            </div>
          </div>

          <div className="pt-2">
            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#79b8a7] py-3.5 text-sm font-bold uppercase tracking-wider text-[#050c0a] transition-all hover:bg-[#8ec7b7] shadow-lg"
            >
              <Navigation className="size-4" />
              Mở chỉ đường trên Google Maps
            </a>
          </div>
        </div>

        {/* Map Column */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#07110f]/90 p-2 shadow-2xl lg:col-span-7">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#0d211d]">
            <iframe
              title="Vị trí ToTo Barbershop trên Google Maps"
              src="https://maps.google.com/maps?q=Toto+babershop+85+Đồng+Đen,+Phường+12,+Tân+Bình,+Hồ+Chí+Minh&t=&z=17&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "contrast(1.05) saturate(1.1)" }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
