import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { services } from "@/data/services"
import { formatCurrency, formatDuration } from "@/lib/format"
import { cn } from "@/lib/utils"
import { SectionHeading } from "@/components/shared/section-heading"
import { Button } from "@/components/ui/button"

export function ServicesBento() {
  const featured = services.filter((s) => s.featured).slice(0, 4)

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          eyebrow="Dịch vụ"
          title="Cắt, cạo & tạo kiểu"
          description="Từ classic haircut tới skin fade, mỗi dịch vụ đều theo quy trình chuẩn barber."
        />
        <Button asChild variant="outline" className="shrink-0">
          <Link href="/services">
            Tất cả dịch vụ <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 md:grid-cols-12 md:grid-rows-2 md:auto-rows-[240px] lg:auto-rows-[290px]">
        {featured.map((service, i) => (
          <Link
            key={service.id}
            href="/services"
            className={cn(
              "group relative min-h-72 overflow-hidden rounded-sm border border-border bg-neutral-950 sm:min-h-64 md:min-h-0",
              i === 0 && "sm:col-span-2 md:col-span-8 md:row-span-2",
              i === 1 && "md:col-span-4",
              i > 1 && "md:col-span-2",
            )}
          >
            <div className="absolute inset-0">
              <Image
                src={service.image || "/placeholder.svg"}
                alt={service.name}
                fill
                sizes={i === 0 ? "(max-width: 767px) 100vw, 66vw" : i === 1 ? "(max-width: 767px) 50vw, 33vw" : "(max-width: 767px) 50vw, 17vw"}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/20 to-transparent" />
            </div>
            <div className="relative flex h-full items-end justify-between gap-3 p-4 text-background md:p-5">
              <div>
                <span className="text-xs uppercase tracking-wide text-background/70">{service.category}</span>
                <h3 className={cn("font-display font-bold uppercase leading-tight", i === 0 ? "text-2xl md:text-4xl" : "text-lg md:text-base lg:text-lg")}>
                  {service.name}
                </h3>
                <p className={cn("mt-1 text-sm text-background/80", i > 1 && "md:text-xs lg:text-sm")}>
                  {formatCurrency(service.price)} · {formatDuration(service.duration)}
                </p>
              </div>
              <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1", i > 1 && "md:size-8")}>
                <ArrowUpRight className="size-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
