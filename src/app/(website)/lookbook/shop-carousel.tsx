"use client";

import Image from "next/image";
import { LookbookItem } from "@/types";

export function ShopCarousel({ items }: { items: LookbookItem[] }) {
  // To ensure the marquee has enough items to scroll seamlessly, 
  // we render two identical sets of items.
  return (
    <div className="relative mx-auto max-w-7xl px-3 py-6 overflow-hidden group">
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {[1, 2].map((set) => (
          <div key={set} className="flex gap-2 md:gap-3 pr-2 md:pr-3">
            {items.map((x) => (
              <figure
                key={x.id}
                className="relative flex-none w-[85vw] sm:w-[45vw] md:w-[300px] lg:w-[305px] xl:w-[310px] aspect-[4/5] overflow-hidden rounded-sm"
              >
                <Image
                  src={x.image}
                  alt={x.caption}
                  fill
                  sizes="(max-width: 767px) 85vw, (max-width: 1023px) 45vw, 310px"
                  className="object-cover transition-transform duration-500 hover:scale-[1.025]"
                />
                <div className="absolute inset-0 flex items-end p-6 opacity-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 hover:opacity-100">
                  <p className="text-sm font-medium tracking-wide text-white">{x.caption}</p>
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
