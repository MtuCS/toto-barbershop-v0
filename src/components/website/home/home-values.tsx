import { HeartHandshake, ScanLine, Sparkles } from "lucide-react"

const values = [
  {
    number: "01",
    icon: ScanLine,
    title: "Chỉn chu",
    description:
      "Cắt một mái tóc vội thì dễ, nhưng tỉ mỉ để vài tuần sau tóc dài ra vẫn vào form mới khó. ToTo chọn làm kỹ, không làm vội.",
  },
  {
    number: "02",
    icon: HeartHandshake,
    title: "Chân thành",
    description:
      "Tóc sao nói vậy, hợp mới làm. ToTo chỉ tư vấn những gì thực sự phù hợp với từng gương mặt, không chèo kéo.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Sạch sẽ",
    description:
      "Từ chiếc khăn giặt sạch đến bộ dụng cụ tiệt trùng kỹ càng. ToTo tin rằng sự tôn trọng khách hàng luôn bắt đầu từ những điều nhỏ nhất.",
  },
] as const

export function HomeValues() {
  return (
    <section
      data-home-scene="values"
      aria-labelledby="home-values-title"
      data-testid="home-values-scene"
      className="home-values-scene relative isolate overflow-hidden bg-[#07110f] px-5 py-16 text-[#f2f5f3] md:px-8 md:py-24 lg:px-10 xl:px-14"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[26rem] -top-[43rem] size-[70rem] rounded-full border border-[#2f7a68]/20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[18rem] bottom-0 size-[48rem] translate-y-1/2 rounded-full border border-[#2f7a68]/20 md:-right-[24rem] md:size-[60rem] lg:-right-[28rem] lg:size-[72rem]"
      />

      <div className="home-scene-inner relative mx-auto flex h-full max-w-[1400px] flex-col justify-center">
        <div className="max-w-3xl">
          <p className="home-section-eyebrow text-xs font-semibold uppercase tracking-[0.2em] text-[#79b8a7]">
            Tâm nghề
          </p>
          <h2
            id="home-values-title"
            className="home-section-title mt-3 text-3xl font-bold uppercase tracking-tight text-[#f2f5f3] sm:text-4xl md:text-5xl lg:text-6xl leading-[1.15]"
          >
            Tâm nghề tại ToTo
          </h2>
          <p className="home-section-description mt-4 max-w-2xl text-sm leading-relaxed text-white/75 md:text-base">
            ToTo chẳng có gì để giữ chân bạn, ngoài sự chỉn chu, chân thành và sạch sẽ.
          </p>
        </div>

        <div className="home-scene-card-grid mt-10 grid gap-6 md:mt-14 md:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon

            return (
              <article
                key={value.title}
                className="home-value-card group relative flex min-h-[290px] flex-col justify-between overflow-hidden rounded-xl border border-[#48A9A6]/25 bg-[#0d1f1c]/80 p-7 shadow-[inset_0_1px_0_rgba(121,184,167,0.08),0_8px_24px_rgba(7,17,15,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-[#79b8a7]/60 hover:bg-[#0f2420] hover:shadow-[inset_0_1px_0_rgba(185,224,213,0.14),0_14px_38px_rgba(47,122,104,0.22)] md:p-8"
              >
                <div className="relative z-10">
                  <div className="inline-flex size-12 items-center justify-center rounded-lg border border-[#2f7a68]/30 bg-[#2f7a68]/15 text-[#79b8a7] transition-all duration-300 group-hover:bg-[#2f7a68]/30 group-hover:text-[#b9e0d5]">
                    <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <h3 className="home-card-title mt-6 text-2xl font-bold tracking-tight text-white md:text-3xl">
                    {value.title}
                  </h3>
                  <p className="home-card-body mt-4 max-w-[34ch] text-sm leading-relaxed text-white/70 transition-colors duration-300 group-hover:text-white/85">
                    {value.description}
                  </p>
                </div>

                <div
                  aria-hidden="true"
                  className="relative z-10 mt-8 flex justify-end"
                >
                  <span className="font-display text-5xl font-black tracking-tighter text-white/10 transition-colors duration-300 group-hover:text-[#79b8a7]/25 md:text-6xl">
                    {value.number}
                  </span>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

