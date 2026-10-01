import Image from "next/image"
import { Scissors, Award } from "lucide-react"

export interface BarberMember {
  name: string
  role: string
  experience: string
  specialty: string
  image: string
}

const teamMembers: BarberMember[] = [
  {
    name: "Master ToTo",
    role: "Founder & Head Barber",
    experience: "13+ Năm kinh nghiệm",
    specialty: "Classic Pompadour, Skin Fade, Textured Crop",
    image: "/images/barber-1.png",
  },
  {
    name: "Senior Barber Tuấn Anh",
    role: "Lead Stylist & Trainer",
    experience: "8 Năm kinh nghiệm",
    specialty: "Side Part 7/3, Taper Fade, Uốn Texture",
    image: "/images/barber-2.png",
  },
  {
    name: "Barber Hoàng Duy",
    role: "Color & Chemical Specialist",
    experience: "6 Năm kinh nghiệm",
    specialty: "Tẩy nhuộm màu khói, Mullet Fade, Dreadlock",
    image: "/images/barber-3.png",
  },
]

export function TeamSection() {
  return (
    <section className="relative mx-auto w-full max-w-[1400px] px-5 py-16 md:px-8 md:py-24 text-[#f2f5f3]">
      <div className="mx-auto max-w-3xl text-center">
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#79b8a7]/30 bg-[#79b8a7]/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#79b8a7] backdrop-blur-md">
            <Scissors className="size-3.5 stroke-[1.5]" />
            Tổ Đội ToTo · Những Bàn Tay Tận Tâm
          </span>
        </div>
        <h2 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight leading-[1.1] text-[#f2f5f3]">
          Những Người Thợ Tận Tâm Tại ToTo
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base leading-relaxed text-white/65">
          Nơi bạn yên tâm gửi gắm mái tóc. Dù là anh em quen từ trước hay một gương mặt mới, ToTo luôn ở đây để chăm chút diện mạo cho bạn. Chào mừng bạn ghé tiệm.
        </p>
      </div>

      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <div
            key={member.name}
            className="group relative rounded-[2rem] p-1.5 border border-white/10 bg-white/[0.02] backdrop-blur-sm transition-all duration-500 hover:border-[#79b8a7]/40 hover:shadow-[0_25px_50px_rgba(0,0,0,0.7)]"
          >
            <div className="relative overflow-hidden rounded-[calc(2rem-0.375rem)] bg-[#07110f] h-full flex flex-col">
              {/* Portrait Image */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-white/5">
                <Image
                  src={member.image}
                  alt={`Chân dung ${member.name} - ${member.role} tại ToTo Barbershop`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07110f] via-[#07110f]/20 to-transparent opacity-90" />

                {/* Experience Badge */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-[#d4af37]/30 bg-black/70 px-3.5 py-1 text-xs font-mono font-medium text-[#d4af37] backdrop-blur-md shadow-lg">
                  <Award className="size-3.5" />
                  {member.experience}
                </div>
              </div>

              {/* Info */}
              <div className="p-6 md:p-7 flex flex-col flex-1">
                <h3 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-[#f2f5f3] group-hover:text-[#79b8a7] transition-colors duration-300">
                  {member.name}
                </h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#79b8a7]">
                  {member.role}
                </p>

                <div className="mt-5 border-t border-white/10 pt-4 mt-auto">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-white/40 block mb-1">
                    Sở trường kỹ thuật
                  </span>
                  <p className="text-xs text-white/80 leading-relaxed font-sans">
                    {member.specialty}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
