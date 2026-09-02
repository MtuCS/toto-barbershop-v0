import Image from "next/image"
import { Scissors, Award, Sparkles } from "lucide-react"

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
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#79b8a7]">
          <Scissors className="size-3.5" />
          Đội Ngũ Tay Kéo
        </span>
        <h2 className="mt-2 font-agatho text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#f2f5f3]">
          Những Người Thợ Tận Tâm Tại ToTo
        </h2>
        <p className="mt-3 text-sm md:text-base text-white/65">
          Từng đường kéo, từng nhát cạo đều được trau chuốt bởi những người thợ sống trọn vẹn với văn hóa Barber.
        </p>
      </div>

      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <div
            key={member.name}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#07110f]/80 transition-all duration-500 hover:-translate-y-1.5 hover:border-[#79b8a7]/50 hover:shadow-[0_20px_40px_rgba(7,17,15,0.7)]"
          >
            {/* Portrait Image */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-white/5">
              <Image
                src={member.image}
                alt={`Chân dung ${member.name} - ${member.role} tại ToTo Barbershop`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07110f] via-transparent to-transparent opacity-90" />

              {/* Experience Badge */}
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-xs font-semibold text-[#79b8a7] backdrop-blur-md">
                <Award className="size-3.5" />
                {member.experience}
              </div>
            </div>

            {/* Info */}
            <div className="p-6">
              <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-white group-hover:text-[#79b8a7] transition-colors">
                {member.name}
              </h3>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#79b8a7]">
                {member.role}
              </p>

              <div className="mt-4 border-t border-white/10 pt-3">
                <span className="text-[11px] font-medium uppercase text-white/40 block mb-1">
                  Sở trường kỹ thuật
                </span>
                <p className="text-xs text-white/80 leading-relaxed">
                  {member.specialty}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
