"use client";

import Image from "next/image";
import { LookbookItem } from "@/types";

export function ShopCarousel({ items }: { items: LookbookItem[] }) {
  // Render two identical sets so the marquee can loop seamlessly.
  return (
    <div className="group relative mx-auto max-w-7xl overflow-hidden px-3 py-6">
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {[1, 2].map((set) => (
          <div key={set} className="flex gap-2 pr-2 md:gap-3 md:pr-3">
            {items.map((item) => (
              <figure
                key={`${set}-${item.id}`}
                className="relative aspect-[4/5] w-[85vw] flex-none overflow-hidden rounded-sm sm:w-[45vw] md:w-[300px] lg:w-[305px] xl:w-[310px]"
              >
                <Image
                  src={item.image}
                  alt={item.title || "TOTO Barbershop Lookbook"}
                  fill
                  sizes="(max-width: 767px) 85vw, (max-width: 1023px) 45vw, 310px"
                  className="object-cover transition-transform duration-500 hover:scale-[1.025]"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-6 opacity-0 transition-opacity duration-300 hover:opacity-100">
                  <p className="text-sm font-medium tracking-wide text-white">{item.title || "TOTO Barbershop"}</p>
                </div>
              </figure>
            ))}
          </div>
        ))}
      </div>
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
}
