import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Phone, Mail } from "lucide-react"
import { getCourses } from "@/lib/api"
import { trainingCourses as defaultCourses } from "@/data/training"
import { formatCurrency } from "@/lib/format"
import { MarketingPageShell } from "@/components/website/marketing-page-shell"
import { Breadcrumbs } from "@/components/website/breadcrumbs"

export const metadata: Metadata = {
  title: "Học Viện Đào Tạo Nghề Barber — TOTO Academy",
  description:
    "Tìm hiểu giáo trình và các khóa đào tạo nghề Barber từ cơ bản đến chuyên sâu tại TOTO Academy. Thực hành trực tiếp trên mẫu thật cùng Master Barber.",
}

const trainingImages = {
  hero: "/images/training/training-hero.png",
  poster: "/images/training/training-3.jpg",
}

export default async function TrainingPage() {
  const rawCourses = await getCourses()
  const trainingCourses = rawCourses && rawCourses.length > 0 ? rawCourses : defaultCourses

  return (
    <MarketingPageShell>
      {/* 1. Breadcrumbs */}
      <div className="mx-auto max-w-[1400px] px-5 pt-3 md:px-8">
        <Breadcrumbs items={[{ label: "Đào tạo & Khóa học Barber" }]} />
      </div>

      {/* 2. Hero: Learn the craft (giữ nguyên cấu trúc ban đầu, giảm kích thước chữ) */}
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-[1400px] px-5 pb-8 pt-3 md:px-8 md:pb-12 md:pt-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#79b8a7]">
            <span className="flex items-center gap-3">
              <span className="h-px w-7 bg-[#2f7a68]" aria-hidden="true" />
              TOTO Academy
            </span>
            <span>Est. 2025</span>
          </div>

          <div className="grid gap-8 pt-6 md:grid-cols-12 md:items-end md:pt-10">
            <h1 className="font-serif text-5xl font-medium uppercase leading-[0.88] tracking-tight text-[#f2f5f3] sm:text-6xl md:col-span-8 md:text-7xl lg:text-8xl">
              Learn the
              <br />
              craft.
            </h1>
            <div className="space-y-4 md:col-span-4 md:col-start-9 md:pb-1">
              <p className="max-w-sm text-xs leading-relaxed text-white/65 sm:text-sm md:text-base">
                Học nghề từ quan sát, thực hành liên tục trên mẫu thật và nhận phản hồi trực tiếp từ những Master Barber làm nghề mỗi ngày.
              </p>
              <a
                href="#consultation"
                className="inline-flex border-b border-[#79b8a7] pb-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#f2f5f3] transition-colors hover:border-white hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#79b8a7]"
              >
                Thông tin tư vấn
              </a>
            </div>
          </div>

          <figure className="relative mt-8 aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-black/30 md:mt-12 md:aspect-[2/1]">
            <Image
              src={trainingImages.hero}
              alt="Không gian thực hành đào tạo tại TOTO Academy"
              fill
              priority
              sizes="(max-width: 1439px) 100vw, 1400px"
              className="object-cover"
            />
            <figcaption className="absolute bottom-0 left-0 rounded-tr-lg bg-[#07110f]/90 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/65 backdrop-blur-sm">
              Learn by doing / TOTO Academy
            </figcaption>
          </figure>
        </div>
      </header>

      {/* 3. Section 01: Sàn thực hành (ảnh tham chiếu 1, dịch tiếng Việt, kèm poster training-3.jpg) */}
      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 md:grid-cols-12 md:items-start md:gap-8 md:px-8">
          <div className="md:col-span-6 lg:col-span-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#79b8a7]">
              01 / Sàn thực hành
            </p>
            <h2 className="mt-6 max-w-lg font-display text-4xl uppercase leading-[0.95] text-[#f2f5f3] sm:text-5xl md:text-6xl">
              Đôi tay học nghề, không chỉ là lý thuyết.
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-white/65 md:text-base">
              Mỗi buổi học đưa bạn hòa vào nhịp làm việc thực tế của một tiệm Barber: quan sát từng chi tiết, rèn giũa thao tác tay và hoàn thiện tay nghề qua nhận xét trực tiếp 1:1.
            </p>

            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-5">
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  Hình thức
                </dt>
                <dd className="mt-2 text-sm font-bold text-[#f2f5f3]">Thực chiến</dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  Phản hồi
                </dt>
                <dd className="mt-2 text-sm font-bold text-[#f2f5f3]">Kèm cặp 1:1</dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  Trọng tâm
                </dt>
                <dd className="mt-2 text-sm font-bold text-[#f2f5f3]">Nghề thực thụ</dd>
              </div>
            </dl>
          </div>

          <figure className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-white/10 bg-black/30 shadow-2xl md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
            <Image
              src={trainingImages.poster}
              alt="Chiêu mộ học viên Barber - Định hình thế hệ thợ cắt mới"
              fill
              sizes="(max-width: 767px) 100vw, 42vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02] motion-reduce:transition-none"
            />
          </figure>
        </div>
      </section>

      {/* 4. Section 02: Lộ trình học (giữ nguyên bản hiện tại đã tối ưu vertical alignment) */}
      <section className="bg-[#f5f9f7] py-16 text-[#101715] md:py-24">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8">
          <div className="grid gap-8 border-b border-black/15 pb-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#2f7a68]">
                02 / Lộ trình học
              </p>
              <h2 className="mt-4 max-w-3xl font-display text-4xl uppercase leading-[1.15] md:text-6xl">
                Từ nền tảng đến phong cách cá nhân.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-neutral-600 md:col-span-3 md:col-start-10 md:pb-1">
              Giáo trình phân chia rõ ràng từng giai đoạn, giúp bạn nắm chắc kiến thức và định hình tay nghề vững vàng.
            </p>
          </div>

          <div className="grid md:grid-cols-2 md:divide-x md:divide-black/15">
            {trainingCourses.map((course, index) => (
              <article
                key={course.id}
                className="flex min-h-full flex-col border-b border-black/15 py-8 first:md:pl-0 last:md:pr-0 md:px-10 md:py-10"
              >
                <div className="flex flex-col">
                  <div className="flex items-start justify-between gap-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#2f7a68]">
                      0{index + 1} / {course.level}
                    </p>
                    <p className="text-sm font-medium text-neutral-500">{course.duration}</p>
                  </div>
                  <h3 className="mt-6 flex items-start font-display text-3xl uppercase leading-[0.95] sm:text-4xl md:min-h-[5.5rem] md:text-5xl">
                    {course.title}
                  </h3>
                  {course.summary ? (
                    <p className="mt-4 max-w-lg leading-relaxed text-neutral-600 md:min-h-[3.5rem]">
                      {course.summary}
                    </p>
                  ) : null}
                  <p className="mt-6 text-xl font-bold tracking-tight">
                    {formatCurrency(course.price)}
                  </p>
                </div>

                <div className="mt-8 border-t border-black/15">
                  {((course.roadmap && course.roadmap.length > 0 ? course.roadmap : defaultCourses.find((c) => c.id === course.id)?.roadmap) || []).map((item: any) => (
                    <div
                      key={item.week}
                      className="grid grid-cols-[5.5rem_1fr] gap-4 border-b border-black/10 py-3 text-sm"
                    >
                      <b className="font-semibold">{item.week}</b>
                      <span className="text-neutral-600">{item.focus}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Section 03: Giảng viên hướng dẫn & Tư vấn học viên */}
      <section id="consultation" className="scroll-mt-24 py-20 md:py-32">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 md:grid-cols-12 md:items-center md:px-8">
          <div className="md:col-span-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#79b8a7]">
              03 / Giảng viên hướng dẫn
            </p>
            <h2 className="mt-6 font-display text-5xl uppercase leading-[1.15] text-[#f2f5f3] md:text-6xl">
              Học từ người trực tiếp làm nghề.
            </h2>
            <figure className="relative mt-10 aspect-square max-w-xl overflow-hidden border border-white/10 bg-black/30">
              <Image
                src="/images/instructor.png"
                alt="Giảng viên Master Barber tại TOTO Academy"
                fill
                sizes="(max-width: 767px) 100vw, 42vw"
                className="object-contain"
              />
            </figure>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#07110f]/90 p-8 backdrop-blur-md md:col-span-6 md:col-start-7 md:p-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#79b8a7]">
              Tư vấn & Hỗ trợ học viên
            </p>
            <h2 className="mt-4 font-display text-4xl uppercase leading-[1.15] text-[#f2f5f3] md:text-5xl">
              Bắt đầu hành trình Barber của bạn
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-white/70 sm:text-base">
              Để được tư vấn chi tiết về lịch khai giảng khóa gần nhất, lộ trình học thử và chính sách hỗ trợ dụng cụ đồ nghề, bạn hãy liên hệ trực tiếp với tiệm qua Hotline hoặc ghé thăm tiệm:
            </p>

            <div className="mt-8 space-y-4">
              <a
                href="tel:0981378179"
                className="flex items-center justify-between rounded-2xl border border-[#79b8a7]/30 bg-[#13443B]/20 p-5 transition-all hover:bg-[#13443B]/40"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-[#79b8a7]/20 text-[#79b8a7]">
                    <Phone className="size-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase text-white/50">
                      Hotline tư vấn khóa học
                    </span>
                    <p className="text-lg font-bold text-white">0981 378 179</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#79b8a7]">Gọi tư vấn ➔</span>
              </a>

              <Link
                href="https://www.facebook.com/totobarbershopHCM"
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5 transition-all hover:border-[#79b8a7]/40 hover:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-white/10 text-[#79b8a7]">
                    <Mail className="size-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase text-white/50">
                      Gửi lời nhắn
                    </span>
                    <p className="text-lg font-bold text-white">Trang liên hệ ToTo</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-white/70">Gửi tin nhắn ➔</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingPageShell>
  )
}