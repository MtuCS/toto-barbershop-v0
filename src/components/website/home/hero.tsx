// import Image from "next/image"

// export function Hero() {
//   return (
//     <section className="relative flex min-h-[85dvh] flex-col overflow-hidden border-b border-border bg-background lg:min-h-[90dvh]">
//       {/* Decorative circle matching the editorial vibe from the reference */}
//       <div className="pointer-events-none absolute left-1/2 top-1/2 w-[120vw] max-w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[0.5px] border-border/40 object-cover opacity-60 mix-blend-multiply aspect-square dark:mix-blend-screen" />

//       <div className="relative mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-between px-4 py-12 md:px-8 md:py-16">

//         {/* Top Row: Paragraph and Image */}
//         <div className="flex w-full flex-col-reverse justify-between gap-8 md:flex-row md:items-start z-10">
//           <div className="max-w-xs md:pt-8 lg:pt-16">
//             <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
//               Est. Sài Gòn
//             </span>
//             <p className="text-balance text-sm leading-relaxed text-muted-foreground">
//               Tiệm cắt tóc chuẩn barber, học viện đào tạo, grooming và merchandise mang tinh thần streetwear của Toto.
//             </p>
//           </div>

//           <div className="w-full md:w-6/12 lg:w-5/12">
//              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-border/50 shadow-sm">
//                <Image
//                  src="/images/hero.png"
//                  alt="Toto Barbershop"
//                  fill
//                  priority
//                  sizes="(max-width:768px) 100vw, 50vw"
//                  className="object-cover"
//                />
//              </div>
//           </div>
//         </div>

//         {/* Bottom Section: Huge Typography */}
//         <div className="mt-12 flex flex-col font-display uppercase leading-[0.8] tracking-[-0.03em] text-foreground md:-mt-8 lg:-mt-24 z-0">
//           <h1 className="flex w-full flex-col text-[16vw] sm:text-[14vw] md:text-[12vw] lg:text-[10vw] xl:text-[11rem]">
//             <span className="text-right">Barber.</span>
//             <span className="text-center">Culture.</span>
//             <span className="text-left text-accent">Craft.</span>
//           </h1>
//         </div>

//       </div>
//     </section>
//   )
// }

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Sweeping arc */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[18%] aspect-square w-[130%] max-w-[1500px] -translate-x-1/2 rounded-full border border-accent/20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/2 size-[500px] -translate-y-1/2 rounded-full bg-accent/5 blur-3xl"
      />
      <div className="relative mx-auto w-full max-w-[1400px] px-4 pb-4 pt-2 md:px-8 md:pb-6 md:pt-4">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:gap-8">
          {/* Left copy */}
          <div className="max-w-xs lg:self-center">
            <span className="mb-6 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-accent">
              <span className="h-px w-6 bg-accent" aria-hidden="true" />
              Est. Sài Gòn
            </span>

            <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. 
            </p>

            <a
              href="#"
              className="group mt-7 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:text-accent"
            >
              Khám phá dịch vụ
              <ArrowUpRight
                className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          </div>

          {/* Portrait */}
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-border shadow-2xl sm:aspect-[16/9] lg:aspect-[16/8]">
            <Image
              src="/images/hero-portrait.png"
              alt="Hero_img"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 65vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Giant headline */}
        <div className="relative mt-6 md:mt-8 lg:mt-10">
          {/* <h1 className="font-serif font-medium uppercase leading-[0.86] tracking-tight text-accent text-balance">
            <span className="text-right block text-[19vw] sm:text-[16vw] lg:text-[13vw] xl:text-[5.5rem]">
              Barber.
            </span>
            <span className="text-center block text-[19vw] text-foreground sm:text-[16vw] lg:text-[13vw] xl:text-[5.5rem]">
              Culture.
            </span>
            <span className="text-left block text-[19vw] text-foreground sm:text-[16vw] lg:text-[13vw] xl:text-[5.5rem]">
              Craft.
            </span>
          </h1> */}

          <h1 className="font-serif font-medium uppercase leading-[0.86] tracking-tight text-accent text-balance">
            <span className="block text-[19vw] sm:text-[16vw] lg:text-[13vw] xl:text-[5.5rem]">
              ToTo
            </span>
            <span className="block text-[19vw] text-foreground sm:text-[16vw] lg:text-[13vw] xl:text-[5.5rem]">
              BARBERSHOP
            </span>
          </h1>

          <div className="mt-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Barbershop · Học viện đào tạo · Grooming &amp; Merchandise mang tinh
              thần streetwear Sài Gòn.
            </p> */}
            {/* <a
              href="#"
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-primary-foreground transition-opacity hover:opacity-90"
            >
              Đặt lịch cắt tóc
              <ArrowUpRight
                className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a> */}
          </div>
        </div>
      </div>
    </section>
  );
}
