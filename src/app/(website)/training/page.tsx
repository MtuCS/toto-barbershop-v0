import { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, Scissors } from "lucide-react";
import { TrainingForm } from "@/components/website/training-form";
import {
  TrainingPillarsGrid,
  CareerRevealBlock,
  TrainingFaqAccordion,
} from "@/components/website/training-sections";

export const metadata: Metadata = {
  title: "Đào tạo nghề Barber thực chiến | ToTo Barbershop",
  description:
    "Cắt có nghề - Làm có gu - Đứng ghế có chất. Học nghề Barber thực chiến 1 kèm 1 tại ToTo Barbershop 85 Đồng Đen, Tân Bình.",
  alternates: {
    canonical: "https://totobarbershop.com/training",
  },
};

const MESSENGER_CONSULT_URL =
  "https://m.me/totobarbershopHCM?text=" +
  encodeURIComponent(
    "Chào ToTo Barbershop, mình muốn nhận tư vấn về khóa học nghề Barber tại 85 Đồng Đen!"
  );

export default function TrainingPage() {
  return (
    <div className="relative isolate min-h-[100dvh] overflow-hidden bg-[#0a1815] text-white selection:bg-[#d4a84b] selection:text-[#0a1815]">
      {/* =====================================================================
          GLOBAL FILM GRAIN / NOISE OVERLAY (Opacity ~3.8% - Fine-art paper / leather feel)
      ===================================================================== */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-30 bg-[url('/images/site-grain.png')] bg-repeat opacity-[0.038] mix-blend-overlay"
      />

      {/* =====================================================================
          1. HERO SECTION - Left-aligned editorial showcase
      ===================================================================== */}
      <section className="relative flex min-h-[82dvh] items-center overflow-hidden border-b border-white/10 pt-16 pb-20 lg:py-28">
        {/* Background Media Layer (Static Image now, ready to swap to Video later) */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/service-banner.jpg"
            alt="Đào tạo nghề Barber thực chiến tại ToTo Barbershop"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-[1.02]"
          />

          {/*
            TODO: Khi cần đổi sang Video nền chuyển động chậm (Slow-motion),
            chỉ cần bỏ comment thẻ <video> bên dưới và ẩn component <Image /> ở trên:
            <video
              autoPlay
              loop
              muted
              playsInline
              poster="/images/service-banner.jpg"
              className="h-full w-full object-cover object-center"
            >
              <source src="/videos/training-hero.mp4" type="video/mp4" />
            </video>
          */}

          {/* Dark overlay + directional gradient + warm bronze ambient glow */}
          <div className="absolute inset-0 bg-[#06110e]/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071411]/95 via-[#0a1815]/80 to-[#0a1815]/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1815] via-transparent to-[#071411]/55" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 top-1/3 h-[360px] w-[480px] rounded-full bg-[#d4a84b]/10 blur-[120px]"
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="max-w-3xl">
            {/* Eyebrow 1 of 2 on page */}
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#d4a84b]">
              {/* Đào tạo nghề Barber thực chiến */}
            </p>

            {/* Main Headline (H1) - Pairing bold Oswald display with Playfair Display Serif */}
            <h1 className="font-display text-3xl font-bold uppercase leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-[56px]">
              CẮT CÓ NGHỀ - LÀM CÓ GU -{" "}
              <span className="font-agatho italic font-bold text-[#d4a84b]">
                ĐỨNG GHẾ CÓ CHẤT.
              </span>
            </h1>

            {/* Sub-headline (19 words, <= 20 words rule) */}
            <p className="mt-6 max-w-[54ch] text-base leading-[1.75] text-[#d7e0dd] sm:text-lg lg:text-xl">
              Cùng bạn qua từng đường kéo thật, từng kỹ năng thật, để tự tin
              bước ra với màu sắc của riêng mình.
            </p>

            {/* Primary CTA -> Messenger Consultation */}
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href={MESSENGER_CONSULT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-xl bg-[#68a494] px-7 py-4 text-sm font-bold text-[#0a1815] shadow-[0_14px_32px_-8px_rgba(212,168,75,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e1b85c] hover:shadow-[0_18px_38px_-6px_rgba(212,168,75,0.6)] active:scale-[0.98] sm:text-base"
              >
                <span>Nhận tư vấn</span>
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={2}
                />
              </a>

              {/* <a
                href="#dang-ky-truc-tiep"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-[#d4a84b]/45 hover:bg-white/[0.08] active:scale-[0.98] sm:text-base"
              >
                Ghé tiệm trò chuyện
              </a> */}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. TRIẾT LÝ ĐÀO TẠO (3 Thật) - Ambient Radial Glow + Vintage Serif Header + 4-Card Showcase
      ===================================================================== */}
      <section className="relative py-22 lg:py-30">
        {/* Ambient Radial Glows (blur: 120px) để tách lớp (layering) phần card nổi bật hẳn khỏi nền */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[460px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1f6b5c]/28 blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/3 top-1/3 -z-10 h-[340px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4a84b]/12 blur-[120px]"
        />

        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Upgraded Barber Artisanal Section Header */}
          <div className="mb-14 flex flex-col justify-between gap-6 border-b border-white/12 pb-9 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <div className="mb-3 flex items-center gap-3 text-[#d4a84b]/80">
                <Scissors className="h-4 w-4" strokeWidth={1.25} />
                <span className="h-[1px] w-12 bg-gradient-to-r from-[#d4a84b]/70 to-transparent" />
              </div>

              <h2 className="text-3xl leading-[1.18] tracking-tight text-white sm:text-4xl lg:text-[44px]">
                <span className="font-display font-bold uppercase">
                  3 Thật:{" "}
                </span>
                <span className="font-agatho italic font-bold text-[#d4a84b]">
                  Học thật - Tóc thật - Chất thật.
                </span>
              </h2>
            </div>

            <p className="max-w-md text-base leading-relaxed text-[#c9d4d0] lg:text-right">
              Tại ToTo, mọi thứ đều đi từ thực tế để rèn luyện nên những “tay
              kéo” vững nghề.
            </p>
          </div>

          <TrainingPillarsGrid />
        </div>
      </section>

      {/* =====================================================================
          3. LỘ TRÌNH & CƠ HỘI (Đường dài & Ở lại) - Full-width tonal band
      ===================================================================== */}
      <section className="relative border-y border-white/10 bg-[#071310]/90 py-22 lg:py-30">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-1/4 top-1/2 -z-10 h-[380px] w-[520px] -translate-y-1/2 rounded-full bg-[#d4a84b]/10 blur-[120px]"
        />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <CareerRevealBlock />
        </div>
      </section>

      {/* =====================================================================
          4. FAQs (Mấy câu anh em hay hỏi) - Sticky left header + hairline accordion
      ===================================================================== */}
      <section className="relative py-22 lg:py-30">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/4 top-1/2 -z-10 h-[380px] w-[520px] -translate-y-1/2 rounded-full bg-[#1f6b5c]/20 blur-[120px]"
        />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
              {/* Eyebrow 2 of 2 on page */}
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#d4a84b]">
                Giải đáp thực tế
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-tight tracking-tight text-white sm:text-4xl">
                Mấy điều anh em{" "}
                <span className="font-agatho italic font-bold normal-case tracking-normal text-[#d4a84b]">
                  hay thắc mắc
                </span>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#a8b6b1] sm:text-base">
                Những câu hỏi thực tế nhất từ anh em mới bắt đầu tìm hiểu nghề
                tóc tại ToTo Barbershop.
              </p>
            </div>

            <div className="lg:col-span-8">
              <TrainingFaqAccordion />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. ĐĂNG KÝ TƯ VẤN (Ghé tiệm trò chuyện) - Form bên trái + Ảnh /images/instructor.png bên phải
      ===================================================================== */}
      <section
        id="dang-ky-truc-tiep"
        className="relative scroll-mt-20 border-t border-white/10 bg-[#07120f] py-20 lg:py-28"
      >
        {/* Ambient Radial Glow phía sau khu vực Form & Ảnh */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4a84b]/12 blur-[120px]"
        />

        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
            {/* Cột trái: Khung Form Đăng Ký (không có thông tin thừa bên dưới nút Gửi thông tin) */}
            <div className="relative overflow-hidden rounded-2xl border border-[#d4a84b]/30 bg-gradient-to-b from-[#132923]/95 to-[#0b1815]/95 p-7 shadow-[0_28px_60px_-16px_rgba(0,0,0,0.7)] sm:p-10 lg:col-span-6">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(212,168,75,0.16),transparent_65%)]"
              />

              <div className="relative z-10">
                <h2 className="font-display text-2xl font-bold uppercase leading-snug tracking-tight text-white sm:text-3xl lg:text-[34px]">
                  Bắt đầu hành trình{" "}
                  <span className="font-agatho italic font-bold normal-case tracking-normal text-[#d4a84b]">
                    cầm kéo cùng ToTo
                  </span>
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-[#c9d4d0] sm:text-base">
                  Không cần hoa mỹ, hãy ghé 85 Đồng Đen thử tay kéo và trò
                  chuyện trực tiếp cùng tụi tôi.
                </p>

                <div className="mt-8">
                  <TrainingForm />
                </div>
              </div>
            </div>

            {/* Cột phải: Hình ảnh /images/instructor.png */}
            <div className="lg:col-span-6">
              <div className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-[#d4a84b]/25 bg-[#0a1815] shadow-[0_28px_60px_-16px_rgba(0,0,0,0.75)]">
                <Image
                  src="/images/instructor.png"
                  alt="Đào tạo học viên Barber thực chiến tại ToTo Barbershop 85 Đồng Đen"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
