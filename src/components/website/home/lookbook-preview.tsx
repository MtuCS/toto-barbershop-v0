"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { lookbookItems } from "@/data/lookbook";

const publishedItems = lookbookItems.filter((item) => item.published);

export function LookbookPreview() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const shouldReduceMotion = useReducedMotion();
  const activeItem = publishedItems[activeIndex];
  const canNavigate = publishedItems.length > 1;
  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const };

  const moveTo = (nextDirection: number) => {
    if (!canNavigate) return;

    setDirection(nextDirection);
    setActiveIndex((currentIndex) => {
      return (
        (currentIndex + nextDirection + publishedItems.length) %
        publishedItems.length
      );
    });
  };

  return (
    <section
      aria-labelledby="home-lookbook-title"
      className="relative isolate overflow-hidden bg-[#07110f] text-[#f2f5f3]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[34rem] -top-[54rem] size-[76rem] rounded-full border border-[#2f7a68]/25"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[50rem] -right-[26rem] size-[72rem] rounded-full border border-[#2f7a68]/30"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-4 py-16 sm:px-6 md:px-8 md:py-20 lg:grid lg:h-full lg:min-h-0 lg:grid-cols-12 lg:grid-rows-12 lg:gap-x-6 lg:gap-y-0 lg:px-10 lg:py-7 xl:px-14 xl:py-8">
        <header className="order-1 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:self-start">
          <p className="mb-3 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#79b8a7]">
            <span className="h-px w-7 bg-[#2f7a68]" aria-hidden="true" />
            Lookbook
          </p>
          <h2 id="home-lookbook-title" className="sr-only">
            Tác phẩm nổi bật
          </h2>
          <p
            aria-hidden="true"
            className="font-serif text-[26vw] font-medium uppercase leading-[0.72] tracking-[-0.055em] text-[#f2f5f3] sm:text-[20vw] lg:text-[clamp(5rem,8.2vw,8rem)]"
          >
            Toto
          </p>
        </header>

        <div
          aria-hidden="true"
          className="order-2 font-serif text-[26vw] font-medium uppercase leading-[0.7] tracking-[-0.055em] text-[#f2f5f3] sm:text-[20vw] lg:col-span-6 lg:col-start-7 lg:row-span-7 lg:row-start-4 lg:self-center lg:text-[clamp(6.5rem,10.8vw,10.5rem)]"
        >
          <span className="block">Hair</span>
          {/* <span className="mt-4 block pr-40 text-[#79b8a7] lg:mt-6 lg:pl-20">
            Cuts
          </span> */}
          <span className="mt-10 block pl-20 text-[#79b8a7] lg:mt-14 lg:pl-32">
            Cuts
          </span>
        </div>

        <div className="order-3 relative aspect-[4/3] min-h-0 overflow-hidden rounded-sm border border-white/10 bg-white/5 lg:col-span-6 lg:col-start-1 lg:row-span-7 lg:row-start-4 lg:h-full lg:aspect-auto">
          {activeItem ? (
            <AnimatePresence initial={false} mode="wait" custom={direction}>
              <motion.div
                key={activeItem.id}
                custom={direction}
                initial={{
                  opacity: 0,
                  x: shouldReduceMotion ? 0 : direction * 28,
                }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: shouldReduceMotion ? 0 : direction * -28,
                }}
                transition={transition}
                className="absolute inset-0"
              >
                <Link
                  href="/lookbook"
                  aria-label={`Xem tác phẩm ${activeItem.caption} trong lookbook`}
                  className="group block size-full focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#79b8a7]"
                >
                  <Image
                    src={activeItem.image || "/placeholder.svg"}
                    alt={activeItem.caption}
                    fill
                    sizes="(max-width: 1023px) 100vw, 50vw"
                    className="object-contain object-center transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                  />
                </Link>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="grid size-full place-items-center px-6 text-center text-sm text-white/55">
              Lookbook đang được cập nhật.
            </div>
          )}
        </div>

        <div className="order-4 min-h-10 lg:col-span-6 lg:col-start-1 lg:row-span-1 lg:row-start-11 lg:self-center">
          <AnimatePresence initial={false} mode="wait">
            {activeItem ? (
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
                transition={transition}
                className="flex items-baseline justify-between gap-4 border-b border-white/15 pb-3"
              >
                <p className="text-sm font-medium text-[#f2f5f3]">
                  {activeItem.caption}
                </p>
                <p className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#79b8a7]">
                  {activeItem.category}
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>
          <p className="sr-only" aria-live="polite">
            {activeItem
              ? `${activeItem.caption}, ${activeItem.category}`
              : "Lookbook đang được cập nhật"}
          </p>
        </div>

        <p className="order-5 max-w-md text-sm leading-6 text-white/65 md:text-base md:leading-7 lg:col-span-3 lg:col-start-10 lg:row-span-3 lg:row-start-1 lg:max-w-none lg:self-start lg:text-sm lg:leading-6 xl:text-base xl:leading-7">
          Những lát cắt về kỹ thuật, cá tính và văn hóa barber tại Toto. Mỗi
          kiểu tóc được tạo nên để phù hợp với đường nét và tinh thần riêng của
          từng người.
        </p>

        <nav
          aria-label="Điều hướng tác phẩm nổi bật"
          className="order-6 flex items-center gap-5 lg:col-span-5 lg:col-start-1 lg:row-span-1 lg:row-start-12 lg:self-end"
        >
          <button
            type="button"
            onClick={() => moveTo(-1)}
            disabled={!canNavigate}
            className="group inline-flex min-h-11 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75 transition-colors hover:text-[#79b8a7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#79b8a7] disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="Xem tác phẩm trước"
          >
            <ArrowLeft
              aria-hidden="true"
              className="size-4 transition-transform duration-300 group-hover:-translate-x-1"
            />
            Previous
          </button>
          <span className="h-5 w-px bg-white/25" aria-hidden="true" />
          <button
            type="button"
            onClick={() => moveTo(1)}
            disabled={!canNavigate}
            className="group inline-flex min-h-11 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75 transition-colors hover:text-[#79b8a7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#79b8a7] disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="Xem tác phẩm tiếp theo"
          >
            Next
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </nav>

        <Link
          href="/lookbook"
          className="group order-7 inline-flex min-h-11 w-fit items-center gap-3 border-b border-[#2f7a68] py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#f2f5f3] transition-colors hover:text-[#79b8a7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#79b8a7] lg:col-span-3 lg:col-start-10 lg:row-span-1 lg:row-start-12 lg:self-end lg:justify-self-end"
        >
          Xem toàn bộ lookbook
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>
    </section>
  );
}
