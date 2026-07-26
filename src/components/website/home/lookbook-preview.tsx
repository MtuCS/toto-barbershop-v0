"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { lookbookItems } from "@/data/lookbook";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";

export function LookbookPreview() {
  const [startIndex, setStartIndex] = useState(0);
  const items = lookbookItems.filter((i) => i.published);

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setStartIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const getVisibleItems = () => {
    if (items.length < 4) return items;
    const visible = [];
    for (let i = 0; i < 4; i++) {
      visible.push(items[(startIndex + i) % items.length]);
    }
    return visible;
  };

  const visibleItems = getVisibleItems();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          eyebrow="Lookbook"
          title="Tác phẩm nổi bật"
          description=""
        />
        <Button
          asChild
          variant="outline"
          className="hidden shrink-0 md:inline-flex"
        >
          <Link href="/lookbook">
            Xem lookbook <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="relative mt-10 ">
        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrev}
          className="absolute -left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/90 shadow-md backdrop-blur transition-colors hover:bg-background md:-left-5"
          aria-label="Xem ảnh trước"
        >
          <ArrowLeft className="size-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          className="absolute -right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/90 shadow-md backdrop-blur transition-colors hover:bg-background md:-right-5"
          aria-label="Xem ảnh tiếp theo"
        >
          <ArrowRight className="size-4" />
        </Button>

        <div className="overflow-hidden md:overflow-visible py-2">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
            <AnimatePresence mode="popLayout" initial={false}>
              {visibleItems.map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <Link
                    href="/lookbook"
                    aria-label={`Xem tác phẩm ${item.caption} trong lookbook`}
                    className="group relative aspect-[4/5] block overflow-hidden rounded-md bg-muted"
                  >
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.caption}
                      fill
                      sizes="(max-width: 767px) 50vw, 25vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                    />
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center md:hidden">
        <Button asChild variant="outline" className="w-full">
          <Link href="/lookbook">
            Xem lookbook <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
