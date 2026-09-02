import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  HandHeart,
  ScanFace,
  ScanSearch,
  Scissors,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MarketingPageShell } from "@/components/website/marketing-page-shell";
import { Breadcrumbs } from "@/components/website/breadcrumbs";
import { getServices, getFaqs } from "@/lib/api";
import { formatCurrency } from "@/lib/format";

export const metadata: Metadata = {
  title: "Bảng Giá Dịch Vụ Cắt Tóc Nam & Grooming Chuyên Nghiệp",
  description:
    "Bảng giá dịch vụ cắt tóc chuẩn barber, cạo mặt khăn nóng, uốn textured, tẩy nhuộm màu thời trang tại ToTo Barbershop 85 Đồng Đen, Tân Bình.",
};


const processSteps = [
  {
    number: "01",
    title: "Phân tích khuôn mặt",
    copy: "Đánh giá tỉ lệ, đường nét & ưu khuyết điểm để đưa ra kiểu tóc phù hợp.",
    icon: ScanFace,
  },
  {
    number: "02",
    title: "Đánh giá chất tóc",
    copy: "Đánh giá mật độ, chất tóc để có kỹ thuật phù hợp.",
    icon: ScanSearch,
  },
  {
    number: "03",
    title: "Thiết kế kiểu",
    copy: "Tư vấn kiểu tóc phù hợp với phong cách của bạn.",
    icon: Scissors,
  },
  {
    number: "04",
    title: "Hoàn thiện",
    copy: "Tạo kiểu và hướng dẫn bạn cách chăm sóc tóc tại nhà.",
    icon: HandHeart,
  },
] as const;

const lookbook = [
  ["Side part mềm", "/images/lookbook-1.png"],
  ["Textured crop", "/images/lookbook-2.png"],
  ["Skin fade", "/images/lookbook-3.png"],
  ["Màu khói", "/images/lookbook-4.png"],
  ["Classic volume", "/images/lookbook-6.png"],
  ["Modern fringe", "/images/lookbook-7.png"],
  ["Layer tự nhiên", "/images/lookbook-8.png"],
  ["Clean cut", "/images/barber-3.png"],
] as const;

export default async function Page() {
  const services = await getServices();
  const allFaqs = await getFaqs();
  const serviceFaqs = allFaqs.filter(f => f.category === 'service');

  return (
    <MarketingPageShell className="bg-[#07110f]">
      <div className="mx-auto max-w-[1400px] px-5 pt-6 md:px-8">
        <Breadcrumbs items={[{ label: "Menu Dịch Vụ & Bảng Giá" }]} />
      </div>

      <section className="overflow-hidden border-b border-white/10 bg-[#07110f] text-[#f2f5f3]">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-12 md:grid-cols-12 md:px-8 md:py-16 lg:min-h-[670px] lg:items-center">
          <div className="relative z-10 md:col-span-5">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#79b8a7]">
              Dịch vụ ToTo
            </p>
            <h1 className="mt-5 max-w-xl font-display text-6xl font-bold uppercase leading-[0.88] tracking-[-0.045em] sm:text-7xl lg:text-[6.25rem]">
              Precision in every cut
            </h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-white/68 md:text-base">
              Từ form cổ điển đến texture hiện đại, mỗi lần ngồi ghế là một cuộc
              trao đổi để tìm ra kiểu tóc thuộc về bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 md:col-span-7 md:pl-4 items-stretch">
            {/* Ảnh lớn bên trái chiếm trọn chiều cao */}
            <div className="relative md:col-span-7 aspect-[3/4] md:aspect-auto md:h-full min-h-[380px] md:min-h-[500px] overflow-hidden rounded-xl border border-white/10 bg-[#0d211d]">
              <Image
                src="/images/service-cut.jpg"
                alt="Barber ToTo đang hoàn thiện kiểu tóc"
                fill
                priority
                sizes="(max-width: 767px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
            {/* 2 ảnh bên phải xếp chồng cân đối */}
            <div className="grid grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-3 md:gap-4 md:col-span-5 md:h-full">
              <div className="relative aspect-[4/3] md:aspect-auto md:h-full min-h-[180px] md:min-h-[240px] overflow-hidden rounded-xl border border-white/10 bg-[#0d211d]">
                <Image
                  src="/images/barber-2.png"
                  alt="Không gian phục vụ tại ToTo Barbershop"
                  fill
                  priority
                  sizes="(max-width: 767px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[4/3] md:aspect-auto md:h-full min-h-[180px] md:min-h-[240px] overflow-hidden rounded-xl border border-white/10 bg-[#0d211d]">
                <Image
                  src="/images/service-shave.jpg"
                  alt="Dịch vụ cạo râu khăn nóng tại ToTo"
                  fill
                  priority
                  sizes="(max-width: 767px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#0b1b18] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#79b8a7]">
              Bắt đầu từ sự thấu hiểu
            </p>
            <h2 className="mt-4 font-display text-5xl font-bold uppercase leading-[1.3] tracking-[-0.035em] text-[#f2f5f3] md:text-7xl">
              Kiểu tóc hợp với đời sống của bạn
            </h2>
          </div>
          <div className="mt-12 grid divide-y divide-white/10 border-y border-white/10 md:grid-cols-4 md:divide-x md:divide-y-0">
            {processSteps.map(({ number, title, copy, icon: Icon }) => (
              <article
                key={number}
                className="px-0 py-6 md:px-6 md:py-0 first:md:pl-0 last:md:pr-0"
              >
                <div className="flex items-start justify-between gap-4">
                  <Icon
                    className="size-10 stroke-[1.4] text-[#FFFFFF ]"
                    aria-hidden="true"
                  />

                  <span className="font-mono text-xs text-[#79b8a7]">
                    {number}
                  </span>
                </div>

                <h3 className="mt-8 font-display text-3xl font-bold uppercase leading-none text-[#f2f5f3]">
                  {title}
                </h3>

                <p className="mt-4 max-w-xs text-sm leading-6 text-white/60">
                  {copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#07110f] px-5 py-16 md:px-8 md:py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.045]"
          style={{ backgroundImage: "url('/images/site-grain.png')" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-[1400px]">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#79b8a7]">
                Bảng giá
              </p>
              <h2 className="mt-4 font-display text-5xl font-bold uppercase leading-none text-[#f2f5f3] md:text-7xl">
                Chọn dịch vụ của bạn
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-white/60">
              {/* Liên hệ ToTo để nhận tư vấn phù hợp với tình trạng tóc của bạn. */}
            </p>
          </div>

          <div className="mt-10 grid border-l border-t border-white/10 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.id}
                className="flex min-h-[390px] flex-col border-b border-r border-white/10 bg-white/[0.025] p-6 transition-colors hover:bg-[#13443b]/35 md:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#79b8a7]">
                    {service.category}
                  </p>
                  <span className="font-mono text-xs text-white/45">
                    {service.duration} phút
                  </span>
                </div>
                <h3 className="mt-5 max-w-sm font-display text-4xl font-bold uppercase leading-[0.92] text-[#f2f5f3]">
                  {service.name}
                </h3>
                <p className="mt-5 text-sm leading-6 text-white/60">
                  {service.description}
                </p>
                <ul className="mt-7 space-y-2 text-xs text-white/72">
                  {service.process.map((step) => (
                    <li key={step} className="flex items-center gap-2">
                      <Check
                        className="size-3.5 shrink-0 text-[#79b8a7]"
                        aria-hidden="true"
                      />
                      {step}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex items-end justify-between gap-4 pt-8">
                  <p className="font-display text-3xl font-bold text-[#f2f5f3]">
                    <span className="mr-1 text-xs font-sans font-semibold uppercase tracking-[0.1em] text-[#79b8a7]">
                      {service.priceLabel}
                    </span>
                    {formatCurrency(service.price)}
                  </p>
                  <Link
                    href="/contact"
                    aria-label={`Liên hệ đặt lịch ${service.name}`}
                    className="inline-flex size-10 items-center justify-center border border-[#79b8a7]/60 text-[#79b8a7] transition-colors hover:bg-[#79b8a7] hover:text-[#07110f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#79b8a7]"
                  >
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* <section className="border-y border-white/10 bg-[#0b1b18] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="font-display text-5xl font-bold uppercase leading-none text-[#f2f5f3] md:text-7xl">
            Nâng cấp diện mạo
          </h2>
          <div className="mt-10 grid gap-px bg-white/10 md:grid-cols-3">
            {upgrades.map((service) => (
              <article
                key={service.id}
                className="group relative min-h-[430px] overflow-hidden bg-[#07110f] p-6 md:p-7"
              >
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  sizes="(max-width: 767px) 100vw, 33vw"
                  className="object-cover opacity-45 transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#07110f] via-[#07110f]/50 to-transparent"
                  aria-hidden="true"
                />
                <div className="relative flex h-full flex-col justify-end">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#79b8a7]">
                    {service.priceLabel ? `${service.priceLabel} ` : ""}
                    {formatCurrency(service.price)} · {service.duration} phút
                  </p>
                  <h3 className="mt-3 font-display text-4xl font-bold uppercase leading-none text-[#f2f5f3]">
                    {service.name}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">
                    {service.description}
                  </p>
                  <Link
                    href="/contact"
                    className="mt-6 inline-flex w-fit items-center gap-2 border-b border-[#79b8a7] pb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#f2f5f3] transition-colors hover:text-[#79b8a7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#79b8a7]"
                  >
                    Liên hệ đặt lịch{" "}
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section> */}

      <section className="bg-[#07110f] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="font-display text-5xl font-bold uppercase leading-none text-[#f2f5f3] md:text-7xl">
              Hot looks
            </h2>
            <p className="max-w-xs text-sm leading-6 text-white/60">
              Không có một kiểu tóc đẹp cho tất cả mọi người. Hãy xem đây là
              điểm khởi đầu cho cuộc trao đổi với barber.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-6">
            {lookbook.map(([title, image]) => (
              <figure key={image} className="group">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#0d211d]">
                  <Image
                    src={image}
                    alt={`Kiểu tóc ${title}`}
                    fill
                    sizes="(max-width: 767px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.035]"
                  />
                </div>
                <figcaption className="mt-3 font-display text-lg font-bold uppercase leading-none text-[#f2f5f3]">
                  {title}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>


      <section className="border-t border-white/10 bg-[#0b1b18] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-[1400px] gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#79b8a7]">
              Câu hỏi thường gặp
            </p>
            <h2 className="mt-4 font-display text-5xl font-bold uppercase leading-[0.9] text-[#f2f5f3]">
              Trước khi ngồi ghế
            </h2>
            <Scissors
              className="mt-8 size-8 text-[#79b8a7]"
              aria-hidden="true"
            />
          </div>
          <Accordion className="border-t border-white/10 md:col-span-8">
            {serviceFaqs.map((faq, index) => (
              <AccordionItem
                key={faq.id || index}
                value={`faq-${index}`}
                className="border-b border-white/10"
              >
                <AccordionTrigger className="gap-8 rounded-none py-5 text-base font-semibold text-[#f2f5f3] hover:no-underline hover:text-[#79b8a7] data-[state=open]:text-[#79b8a7]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="max-w-2xl pb-5 text-sm leading-7 text-white/65">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </MarketingPageShell>
  );
}
