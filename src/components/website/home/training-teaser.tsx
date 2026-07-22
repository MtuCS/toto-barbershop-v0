import Image from "next/image"
import Link from "next/link"
import { ArrowRight, GraduationCap, Users, Award } from "lucide-react"
import { Button } from "@/components/ui/button"

const perks = [
  { icon: GraduationCap, label: "Lộ trình bài bản" },
  { icon: Users, label: "Lớp nhỏ, kèm sát" },
  { icon: Award, label: "Chứng nhận nghề" },
]

export function TrainingTeaser() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6 md:pb-24">
      <div className="grid items-center gap-8 overflow-hidden rounded-sm border border-border md:grid-cols-2">
        <div className="p-8 md:p-12">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            <span className="h-px w-6 bg-primary" /> Đào tạo
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold uppercase leading-[1.15] tracking-tight text-balance md:text-5xl">
            Trở thành barber chuyên nghiệp
          </h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            Học viện Toto đào tạo từ cơ bản đến nâng cao, thực hành trên khách thật và định
            hướng nghề nghiệp sau khoá học.
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
            {perks.map((p) => (
              <li key={p.label} className="flex items-center gap-2 text-sm font-medium">
                <p.icon className="size-4 text-primary" />
                {p.label}
              </li>
            ))}
          </ul>
          <Button asChild size="lg" className="mt-8 h-12 px-6 text-sm font-semibold uppercase tracking-wide">
            <Link href="/training">
              Tìm hiểu khoá học <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="relative aspect-[4/3] md:h-full">
          <Image src="/images/training.png" alt="Đào tạo barber tại Toto" fill sizes="(max-width:768px) 100vw, 45vw" className="object-cover" />
        </div>
      </div>
    </section>
  )
}
