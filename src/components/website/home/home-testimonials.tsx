import { Quote, Star } from "lucide-react"

const testimonials = [
  {
    quote:
      "Đến đây thích nhất là sự thong thả. Mấy anh thợ làm kỹ, không vội vàng, tư vấn nhiệt tình và nói chuyện nghe rất dễ chịu.",
    name: "Anh Minh",
    role: "Khách quen 3 năm",
    location: "Tân Bình",
  },
  {
    quote:
      "Tóc mình rễ tre khó vào nếp, qua mấy chỗ đều bó tay. Ghé ToTo được tư vấn kiểu Messy layer phù hợp, về nhà tự sấy vẫn lên form chuẩn.",
    name: "Nam Khánh",
    role: "Sinh viên",
    location: "Quận 10",
  },
  {
    quote:
      "Không gian yên tĩnh, âm nhạc vừa phải, không chèo kéo mua sản phẩm hay ép cắt thêm dịch vụ. Một nơi đáng để ghé lại định kỳ.",
    name: "Hoàng Nam",
    role: "Thiết kế đồ họa",
    location: "Quận 1",
  },
] as const

export function HomeTestimonials() {
  return (
    <section
      data-home-scene="testimonials"
      aria-labelledby="home-testimonials-title"
      data-testid="home-testimonials-scene"
      className="home-testimonials-scene relative isolate overflow-hidden bg-[#0b1b18] px-5 py-16 text-[#f2f5f3] md:px-8 md:py-24 lg:px-10 xl:px-14"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[18rem] top-0 size-[48rem] -translate-y-1/2 rounded-full border border-[#2f7a68]/20 md:-right-[24rem] md:size-[60rem] lg:-right-[28rem] lg:size-[72rem]"
      />

      <div className="home-scene-inner relative mx-auto flex h-full max-w-[1400px] flex-col justify-center">
        <div className="home-testimonials-heading max-w-3xl">
          <p className="home-section-eyebrow text-xs font-semibold uppercase tracking-[0.2em] text-[#79b8a7]">
            Chuyện khách kể
          </p>
          <h2
            id="home-testimonials-title"
            className="home-section-title mt-3 text-3xl font-bold uppercase tracking-tight text-[#f2f5f3] sm:text-4xl md:text-5xl lg:text-6xl leading-[1.15]"
          >
            ToTo qua lời kể của anh em
          </h2>
          <p className="home-section-description mt-4 max-w-2xl text-sm leading-relaxed text-white/75 md:text-base">
            Những chia sẻ chân thật từ những người anh em đã đồng hành cùng ToTo qua từng góc kéo.
          </p>
        </div>

        <div className="home-scene-card-grid mt-10 grid gap-6 md:mt-14 md:grid-cols-3">
          {testimonials.map((item) => (
            <figure
              key={item.name}
              className="home-testimonial-card group relative flex flex-col justify-between rounded-xl border border-white/12 bg-[#07110f]/80 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#2f7a68]/60 hover:bg-[#07110f] hover:shadow-[0_16px_40px_rgba(7,17,15,0.6)] md:p-8"
            >
              <div>
                <div className="flex items-center justify-between">
                  <Quote
                    className="size-7 text-[#79b8a7] transition-transform duration-300 group-hover:scale-110"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <div className="flex gap-1 text-[#F5FF00]" aria-label="Đánh giá 5 sao">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="size-3.5 fill-[#F5FF00]" />
                    ))}
                  </div>
                </div>

                <blockquote className="home-testimonial-quote mt-6 text-base leading-relaxed text-white/90 md:text-lg">
                  “{item.quote}”
                </blockquote>
              </div>

              <figcaption className="mt-8 border-t border-white/10 pt-5">
                <div className="font-bold text-white text-base">
                  {item.name}
                </div>
                <div className="mt-1 text-xs font-medium text-[#79b8a7]">
                  {item.role} <span className="mx-1 text-white/30">•</span> {item.location}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

