import Image from "next/image"

export function PageHero({ eyebrow, title, description, image }: { eyebrow: string; title: string; description: string; image?: string }) {
  return <section className="relative min-h-[52vh] overflow-hidden bg-neutral-950 text-white">
    {image && <Image src={image} alt="" fill priority className="object-cover opacity-45" />}
    <div className="relative mx-auto flex min-h-[52vh] max-w-7xl flex-col justify-end px-5 py-14 md:px-8 md:py-20">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[.28em] text-emerald-200">{eyebrow}</p>
      <h1 className="max-w-5xl font-display text-5xl font-bold uppercase leading-[.9] md:text-8xl">{title}</h1>
      <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 md:text-lg">{description}</p>
    </div>
  </section>
}

export function SectionTitle({ label, title, copy }: { label: string; title: string; copy?: string }) {
  return <div className="mb-10 max-w-3xl"><p className="mb-3 text-xs font-bold uppercase tracking-[.25em] text-primary">{label}</p><h2 className="font-display text-4xl font-bold uppercase leading-none md:text-6xl">{title}</h2>{copy && <p className="mt-5 leading-7 text-muted-foreground">{copy}</p>}</div>
}
