import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export function MerchTeaser() {
  return (
    <section
      aria-labelledby="home-merch-title"
      className="relative isolate overflow-hidden bg-[#07110f] text-[#f2f5f3]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[34rem] -top-[55rem] size-[76rem] rounded-full border border-[#2f7a68]/25"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[52rem] -right-[24rem] size-[72rem] rounded-full border border-[#2f7a68]/30"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] grid-cols-1 px-4 py-16 sm:px-6 md:px-8 md:py-20 lg:h-full lg:min-h-0 lg:grid-cols-12 lg:grid-rows-12 lg:gap-x-8 lg:px-10 lg:py-8 xl:px-14 xl:py-10">
        <header className="order-1 lg:col-span-5 lg:col-start-1 lg:row-span-7 lg:row-start-2 lg:self-start">
          <p className="mb-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#79b8a7]">
            <span className="h-px w-7 bg-[#2f7a68]" aria-hidden="true" />
            Merchandise
          </p>

          <h2
            id="home-merch-title"
            className="font-serif text-[14vw] font-medium uppercase leading-[0.82] tracking-[-0.045em] text-[#f2f5f3] sm:text-[10vw] lg:text-[clamp(3.5rem,5.4vw,5.7rem)]"
          >
            
            <span className="block">lorem ipsum </span>
            <span className="block text-[#79b8a7]">dolor sit</span>
            <span className="block">consectetur </span>
          </h2>
        </header>

        <div className="order-2 relative mt-10 aspect-[1.08/1] min-h-0 w-full sm:mx-auto sm:max-w-2xl lg:col-span-7 lg:col-start-6 lg:row-span-12 lg:row-start-1 lg:mt-0 lg:h-full lg:max-w-none lg:self-center">
          <figure className="absolute right-0 top-0 aspect-square w-[82%] overflow-hidden rounded-sm border border-white/10 bg-white/[0.03]">
            <Image
              src="/images/merch-lifestyle.png"
              alt="Phong cách streetwear của Toto Barbershop"
              fill
              priority
              loading="eager"
              sizes="(max-width: 639px) 82vw, (max-width: 1023px) 656px, 48vw"
              className="object-cover object-center"
            />
          </figure>

          {/* <figure className="absolute bottom-0 left-0 aspect-square w-[38%] overflow-hidden rounded-sm border border-[#79b8a7]/25 bg-[#0b1916]">
            <Image
              src="/images/merch-hoodie.png"
              alt="Áo hoodie heavyweight của Toto"
              fill
              sizes="(max-width: 639px) 38vw, (max-width: 1023px) 304px, 22vw"
              className="object-cover object-center"
            />
          </figure> */}
        </div>

        <div className="order-3 mt-10 max-w-md lg:col-span-5 lg:col-start-1 lg:row-span-3 lg:row-start-9 lg:mt-0 lg:self-start">
          <p className="text-sm leading-7 text-white/68 md:text-base">
            Bộ sưu tập streetwear giới hạn gồm tee, hoodie, cap và phụ kiện.
            Một câu chuyện về văn hóa barber, không chỉ là quần áo.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link
              href="/merchandise"
              className="group inline-flex min-h-11 items-center gap-3 rounded-sm bg-[#2f7a68] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#376f62] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#79b8a7] active:translate-y-px"
            >
              Xem câu chuyện
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>

            <Link
              href="/shop/merchandise"
              className="inline-flex min-h-11 items-center border-b border-white/30 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#f2f5f3] transition-colors hover:border-[#79b8a7] hover:text-[#79b8a7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#79b8a7] active:translate-y-px"
            >
              Mua ngay
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
