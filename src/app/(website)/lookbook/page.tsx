import Image from "next/image";
import { lookbookItems } from "@/data/lookbook";
import { PageHero } from "@/components/website/page-hero";
export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Lookbook"
        title="Cuts. Faces. Stories."
        description="Những cá tính đi qua chiếc ghế TOTO."
        image="/images/lookbook-1.png"
      />

      <section className="bg-white py-16 text-neutral-950 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-10 max-w-4xl md:mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-900">
              Lookbook
            </p>

            <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.92] tracking-tight md:text-6xl lg:text-7xl">
              Standout work
              <br />
              from TOTO Barbershop
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-600 md:text-lg">
              Những kiểu tóc nổi bật được thực hiện tại TOTO, từ các thiết kế
              texture, fade đến màu sắc cá tính.
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2 px-3 py-12 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
        {lookbookItems
          .filter((x) => x.published)
          .map((x) => (
            <figure
              key={x.id}
              className="relative aspect-square overflow-hidden rounded-sm"
            >
              <Image
                src={x.image}
                alt={x.caption}
                fill
                sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 hover:scale-[1.025]"
              />
            </figure>
          ))}
      </div>
      </section>

      
    </>
  );
}
