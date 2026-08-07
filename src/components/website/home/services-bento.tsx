import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const SERVICES = [
  {
    title: "TÓC & TẠO KIỂU",
    description:
      "Tư vấn kỹ theo dáng mặt và chất tóc thật. Tỉ mỉ từng đường kéo để vài tuần sau tóc dài ra vẫn giữ nguyên form dáng.",
    link: "/services#toc",
    image: "/images/service-cut-1.jpg",
    heightClass: "h-[360px] sm:h-[380px] md:h-[420px] lg:h-[440px]",
    offsetClass: "md:mt-12 lg:mt-16",
  },
  {
    title: "VỆ SINH & CHĂM SÓC",
    description:
      "Gội đầu xua tan mỏi mệt, cạo mặt êm không rát và ráy tai tỉ mỉ. Những chăm sóc nhỏ cho một diện mạo tươi tắn, nhẹ nhõm.",
    link: "/services#ve-sinh",
    image: "/images/service-shave-1.jpg",
    heightClass: "h-[360px] sm:h-[380px] md:h-[460px] lg:h-[500px]",
    offsetClass: "md:mt-6 lg:mt-8",
  },
  {
    title: "MẤY GÓI COMBO",
    description:
      "Kết hợp trọn vẹn từ cắt tóc, gội đầu, cạo ráy đến dưỡng da. Thả lỏng hoàn toàn để lấy lại phong độ tinh tươm nhất.",
    link: "/services#combo",
    image: "/images/combo.jpg",
    heightClass: "h-[360px] sm:h-[380px] md:h-[500px] lg:h-[560px]",
    offsetClass: "md:mt-0",
  },
]

export function ServicesBento() {
  return (
    <section
      data-home-scene="services"

      aria-labelledby="home-services-title"
      className="
        home-services-scene relative isolate overflow-hidden
        bg-[#07110f] text-[#f2f5f3]
        pb-24 pt-16
        md:pb-28 md:pt-20
        lg:pb-32 lg:pt-24
      "
    >
      {/* Đường tròn trang trí bên trái */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          -left-[28rem] -top-[51rem]
          size-[74rem] rounded-full
          border border-[#2f7a68]/30
        "
      />

      {/* Đường tròn trang trí bên phải */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          -bottom-[46rem] -right-[18rem]
          size-[68rem] rounded-full
          border border-[#2f7a68]/35
        "
      />

      <div
        className="
          relative z-10 mx-auto
          w-full max-w-[1400px]
          px-4 sm:px-6 lg:px-10 xl:px-14
        "
      >
        {/* Tiêu đề */}
        <div className="home-services-heading mb-6 md:mb-7 lg:mb-8">
          <h2
            id="home-services-title"
            className="
              home-section-title text-3xl font-semibold uppercase
              leading-[1.05] tracking-tight
              text-[#f2f5f3]
              sm:text-4xl
              md:text-5xl
              lg:text-6xl
            "
          >
            Mấy món nghề
            <br />
            <span className="text-[#2f7a68]">ToTo</span>
          </h2>
        </div>

        {/* Gallery tăng dần từ trái sang phải */}
        <div
          className="home-services-grid
            grid grid-cols-1 gap-6
            md:-mt-4 md:grid-cols-3 md:items-start
            lg:-mt-8
          "
        >
          {SERVICES.map((service) => (
            <Link
              key={service.title}
              href={service.link}
              className={`
                home-service-card group relative flex w-full flex-col justify-end
                overflow-hidden rounded-sm bg-[#0a1512]
                ${service.heightClass}
                ${service.offsetClass}
              `}
            >
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes="(max-width: 767px) 100vw, 33vw"
                className="
                  object-cover object-[center_30%]
                  opacity-70
                  transition-all duration-700 ease-out
                  group-hover:scale-105
                  md:opacity-80
                  md:group-hover:opacity-40
                "
              />

              {/* Overlay */}
              <div
                className="
                  absolute inset-0
                  bg-gradient-to-t
                  from-[#07110f]
                  via-[#07110f]/40
                  to-transparent
                  opacity-80
                  transition-opacity duration-500
                  md:group-hover:opacity-100
                "
              />

              {/* Nội dung */}
              <div className="absolute inset-x-0 bottom-0 z-10 p-6 pb-7 lg:p-8 lg:pb-9">
                <h3
                  className="
                    home-card-title text-xl font-bold uppercase
                    leading-[1.12] tracking-wide text-white
                    lg:text-2xl
                  "
                >
                  {service.title}
                </h3>

                <div
                  className="
                    grid grid-rows-[1fr]
                    transition-all duration-500
                    ease-[0.16,1,0.3,1]
                    md:grid-rows-[0fr]
                    md:group-hover:grid-rows-[1fr]
                  "
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="pt-3 lg:pt-4">
                      <p className="home-card-body text-sm leading-relaxed text-white/80">
                        {service.description}
                      </p>

                      <div
                        className="
                          mt-4 inline-flex items-center gap-2
                          text-xs font-bold uppercase
                          tracking-[0.15em] text-[#79b8a7]
                        "
                      >
                        Chi tiết

                        <ArrowUpRight
                          className="
                            size-3
                            transition-transform duration-300
                            group-hover:-translate-y-0.5
                            group-hover:translate-x-0.5
                          "
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}