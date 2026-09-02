"use client"

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


import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import TextType from "@/components/ui/text-type";

export function Hero() {
  const sceneRef = useRef<HTMLElement>(null);
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    let lastVisit = Number(scene.dataset.homeSceneVisit ?? "0");
    const observer = new MutationObserver(() => {
      const visit = Number(scene.dataset.homeSceneVisit ?? "0");
      if (visit === lastVisit) return;

      lastVisit = visit;
      setReplayKey((current) => current + 1);
    });

    observer.observe(scene, {
      attributes: true,
      attributeFilter: ["data-home-scene-visit"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sceneRef} data-home-scene="hero" className="home-hero-scene relative z-10 bg-[#07110f] text-[#f2f5f3]">
      {/* Sweeping arc */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[18%] aspect-square w-[130%] max-w-[1500px] -translate-x-1/2 rounded-full border border-[#2f7a68]/30"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/2 size-[500px] -translate-y-1/2 rounded-full bg-[#2f7a68]/10 blur-3xl"
      />
      <div className="home-hero-inner relative mx-auto w-full max-w-[1400px] px-4 pb-4 pt-2 md:px-8 md:pb-6 md:pt-4">
        <div className="home-hero-grid grid grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:gap-8">
          {/* Left copy */}
          <div className="max-w-xs lg:self-center">
            <span className="mb-6 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#79b8a7]">
              <span className="h-px w-6 bg-[#2f7a68]" aria-hidden="true" />
              Est. Sài Gòn
            </span>

            <p className="text-pretty text-sm leading-relaxed text-white/65">
              Ghé ToTo, bỏ lại một Sài Gòn tấp nập phía sau cánh cửa kính. Ở đây chỉ có chiếc ghế da êm, chiếc tủ lạnh đầy nước mát, và những người thợ gắn bó với cây kéo bằng tất cả tâm huyết cùng sự chỉn chu.
            </p>

            <Link
              href="/services"
              className="group mt-7 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#f2f5f3] transition-colors hover:text-[#79b8a7]"
            >
              Mượt đường kéo, sắc phong độ
            </Link>
          </div>

          {/* Portrait */}
          <div className="home-hero-media relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.35)] sm:aspect-[16/9] lg:aspect-[16/8]">
            <video
              src="/images/0806.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/images/hero-portrait-2.jpg"
              aria-label="Visual ToTo Barbershop"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Giant headline */}
        <div className="home-hero-headline relative mt-6 pb-8 md:mt-8 md:pb-10 lg:mt-10 lg:pb-14">
          <h1
            key={replayKey}
            data-home-hero-replay-key={replayKey}
            className="font-agatho font-medium uppercase leading-[0.92] tracking-tight text-[#79b8a7] md:leading-[0.86]"
          >
            <span className="sr-only">ToTo Barbershop</span>
            <TextType
              aria-hidden="true"
              as="span"
              text="ToTo"
              typingSpeed={105}
              initialDelay={250}
              loop={false}
              showCursor={false}
              className="!block min-h-[0.92em] text-[clamp(3.5rem,18vw,4.75rem)] sm:text-[clamp(4.75rem,16vw,6.5rem)] lg:text-[13vw] xl:text-[5.5rem]"
            />
            <TextType
              aria-hidden="true"
              as="span"
              text="BARBERSHOP"
              typingSpeed={68}
              initialDelay={780}
              loop={false}
              showCursor
              cursorCharacter="|"
              cursorBlinkDuration={0.65}
              cursorClassName="font-sans font-light text-[#2f7a68]"
              className="text-type--nowrap !block min-h-[0.92em] pl-[0.22em] text-[clamp(2.2rem,11.5vw,3.2rem)] text-[#f2f5f3] sm:pl-[0.55em] sm:text-[clamp(3.25rem,11.5vw,5rem)] lg:pl-[0.88em] lg:text-[13vw] xl:text-[5.5rem]"
            />
          </h1>

        </div>
      </div>
    </section>
  );
}
