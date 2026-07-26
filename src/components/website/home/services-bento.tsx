import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export function ServicesBento() {
  return (
    <section
      aria-labelledby="home-services-title"
      className="relative isolate overflow-hidden bg-[#07110f] text-[#f2f5f3]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[28rem] -top-[51rem] size-[74rem] rounded-full border border-[#2f7a68]/30"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[46rem] -right-[18rem] size-[68rem] rounded-full border border-[#2f7a68]/35"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] grid-cols-1 px-4 pb-14 pt-20 sm:px-6 md:px-8 md:py-16 lg:h-full lg:grid-cols-12 lg:grid-rows-12 lg:gap-x-6 lg:px-10 lg:py-8 xl:px-14 xl:py-10">
        <h2
          id="home-services-title"
          className="font-serif text-[13vw] font-medium uppercase leading-[0.78] tracking-[-0.045em] text-[#f2f5f3] sm:text-[10vw] lg:col-span-7 lg:col-start-4 lg:row-span-6 lg:row-start-2 lg:self-start lg:text-[clamp(3.45rem,6.2vw,6.5rem)]"
        >
          <span className="block">The Toto</span>
          <span className="block">
            Barber <span className="text-[#2f7a68]">&amp;</span>
          </span>
          <span className="block">Grooming</span>
          <span className="block">Experience</span>
        </h2>

        <figure className="relative mt-10 ml-auto aspect-[4/5] w-[58%] max-w-[280px] overflow-hidden rounded-sm border border-white/10 sm:w-[42%] lg:col-span-3 lg:col-start-10 lg:row-span-5 lg:row-start-2 lg:mt-0 lg:w-full lg:max-w-[240px] lg:self-start lg:justify-self-end">
          <Image
            src="/images/service-cut-1.jpg"
            alt="Dịch vụ Classic Haircut tại Toto"
            fill
            sizes="(max-width: 639px) 58vw, (max-width: 1023px) 42vw, 240px"
            className="object-cover"
          />
        </figure>

        <p className="mt-9 max-w-xl text-sm leading-7 text-white/70 md:text-base lg:col-span-6 lg:col-start-4 lg:row-span-3 lg:row-start-9 lg:mt-0 lg:max-w-[600px] lg:self-start lg:text-sm lg:leading-6 xl:text-base xl:leading-7">
          Từ classic haircut đến skin fade, mỗi dịch vụ tại Toto được xây dựng
          trên kỹ thuật chuẩn barber, sự tư vấn cá nhân và gu thẩm mỹ phù hợp
          với từng người.
        </p>

        <figure className="relative mt-10 aspect-[4/5] w-[48%] max-w-[220px] overflow-hidden rounded-sm border border-white/10 sm:w-[34%] lg:col-span-2 lg:col-start-1 lg:row-span-5 lg:row-start-7 lg:mt-0 lg:w-full lg:max-w-[190px] lg:self-end">
          <Image
            src="/images/service-shave-1.jpg"
            alt="Dịch vụ tạo kiểu và chăm sóc tại Toto"
            fill
            sizes="(max-width: 639px) 48vw, (max-width: 1023px) 34vw, 190px"
            className="object-cover"
          />
        </figure>

        <Link
          href="/services"
          className="group mt-10 ml-auto inline-flex min-h-11 w-fit items-center gap-3 border-b border-[#2f7a68] py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#f2f5f3] transition-colors hover:text-[#79b8a7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#79b8a7] lg:col-span-3 lg:col-start-10 lg:row-span-2 lg:row-start-10 lg:mt-0 lg:self-end lg:justify-self-end"
        >
          Khám phá dịch vụ
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>
    </section>
  )
}
