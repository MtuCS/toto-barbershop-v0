import Image from "next/image";
import { lookbookItems } from "@/data/lookbook";
import { PageHero } from "@/components/website/page-hero";
import { ShopCarousel } from "./shop-carousel";

export default function Page() {
  const shopItems = lookbookItems.filter((x) => x.published && x.category === 'Shop');
  const hairItems = lookbookItems.filter((x) => x.published && x.category !== 'Shop');

  return (
    <>
      <PageHero
        eyebrow="Lookbook"
        title="Cuts. Faces. Stories."
        description="Những cá tính đi qua chiếc ghế TOTO."
        image="/images/lookbook-1.png"
      />

      {/* Our Shop Section */}
      <section className="bg-neutral-950 py-16 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-4 max-w-4xl md:mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-400">
              Vibes
            </p>

            <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.92] tracking-tight md:text-6xl lg:text-7xl">
              Our Shop
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-400 md:text-lg">
              Không gian mang đậm chất TOTO, nơi những câu chuyện được kể và những kiểu tóc được tạo ra.
            </p>
          </div>
        </div>

        <ShopCarousel items={shopItems} />
      </section>

      {/* Featured Hairstyles Section */}
      <section className="bg-neutral-950 py-16 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-10 max-w-4xl md:mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-400">
              Vibes
            </p>

            <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.92] tracking-tight md:text-6xl lg:text-7xl">
              Kiểu tóc nổi bật
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-400 md:text-lg">
              Những tác phẩm được thực hiện tại TOTO, từ các thiết kế
              texture, fade đến màu sắc cá tính.
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2 px-3 py-6 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
          {hairItems.map((x) => (
            <figure
              key={x.id}
              className="group relative aspect-square overflow-hidden rounded-sm bg-neutral-900"
            >
              <Image
                src={x.image}
                alt={x.caption}
                fill
                sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 group-hover:opacity-100">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">{x.category}</span>
                <p className="text-sm font-medium text-white">{x.caption}</p>
              </div>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
