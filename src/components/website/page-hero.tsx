import Image from "next/image"
import { cn } from "@/lib/utils"

type PageHeroVariant = "split" | "media" | "compact"

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  variant = "split",
  imageClassName,
  imageAspectClassName,
}: {
  eyebrow: string
  title: string
  description: string
  image?: string
  variant?: PageHeroVariant
  imageClassName?: string
  imageAspectClassName?: string
}) {
  if (variant === "media") {
    return (
      <section className="relative overflow-hidden border-b border-white/10 bg-[#07110f] text-[#f2f5f3]">
        <div className="mx-auto w-full max-w-[1400px] px-5 pb-10 pt-14 md:px-8 md:pb-14 md:pt-20">
          <div className="mb-10 grid gap-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-9">
              <Eyebrow>{eyebrow}</Eyebrow>
              <h1 className="mt-5 max-w-5xl font-serif text-[15vw] font-medium uppercase leading-[0.82] tracking-[-0.05em] sm:text-[11vw] md:text-[clamp(4.5rem,8vw,8.5rem)]">
                {title}
              </h1>
            </div>
            {description ? (
              <p className="max-w-md text-sm leading-7 text-white/65 md:col-span-3 md:pb-1 md:text-base">
                {description}
              </p>
            ) : null}
          </div>

          {image ? (
            <div
              className={cn(
                "relative overflow-hidden rounded-sm border border-white/10 bg-black",
                imageAspectClassName ?? "aspect-[4/3] sm:aspect-[16/9] lg:aspect-[16/7]",
              )}
            >
              <Image
                src={image}
                alt=""
                fill
                priority
                sizes="(max-width: 1439px) 100vw, 1400px"
                className={cn("object-cover", imageClassName)}
              />
            </div>
          ) : null}
        </div>
      </section>
    )
  }

  const compact = variant === "compact"

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#07110f] text-[#f2f5f3]">
      <div
        className={cn(
          "mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-10 px-5 md:grid-cols-12 md:items-center md:px-8",
          compact ? "py-10 md:min-h-[42vh] md:py-12" : "py-14 md:min-h-[64vh] md:py-16",
        )}
      >
        <div className="md:col-span-6">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1
            className={cn(
              "mt-5 max-w-3xl font-serif font-medium uppercase tracking-[-0.05em]",
              compact
                ? "text-[13vw] leading-[0.86] sm:text-[9vw] md:text-[clamp(3.5rem,6vw,6.5rem)]"
                : "text-[15vw] leading-[0.82] sm:text-[11vw] md:text-[clamp(4.5rem,7.2vw,7.5rem)]",
            )}
          >
            {title}
          </h1>
          {description ? (
            <p className="mt-7 max-w-xl text-sm leading-7 text-white/65 md:text-base">
              {description}
            </p>
          ) : null}
        </div>

        {image ? (
          <div
            className={cn(
              "relative overflow-hidden rounded-sm border border-white/10 bg-black/40 md:col-span-6",
              compact ? "aspect-[16/10] md:aspect-[4/3]" : "aspect-square",
            )}
          >
            <Image
              src={image}
              alt=""
              fill
              priority
              sizes="(max-width: 767px) 100vw, 50vw"
              className={cn("object-cover", imageClassName)}
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#79b8a7]">
      <span className="h-px w-7 bg-[#2f7a68]" aria-hidden="true" />
      {children}
    </p>
  )
}

export function SectionTitle({
  label,
  title,
  copy,
  labelClassName,
  theme = "light",
}: {
  label: string
  title: string
  copy?: string
  labelClassName?: string
  theme?: "light" | "dark"
}) {
  const dark = theme === "dark"

  return (
    <div className="mb-10 max-w-3xl">
      <p
        className={cn(
          "mb-3 text-xs font-bold uppercase tracking-[0.25em]",
          dark ? "text-[#79b8a7]" : "text-primary",
          labelClassName,
        )}
      >
        {label}
      </p>
      <h2
        className={cn(
          "font-display text-4xl font-bold uppercase leading-none md:text-6xl",
          dark && "text-[#f2f5f3]",
        )}
      >
        {title}
      </h2>
      {copy ? (
        <p className={cn("mt-5 leading-7", dark ? "text-white/65" : "text-muted-foreground")}>
          {copy}
        </p>
      ) : null}
    </div>
  )
}
