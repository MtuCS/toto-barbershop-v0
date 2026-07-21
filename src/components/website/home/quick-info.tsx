import { Clock, MapPin, Scissors, Truck } from "lucide-react"

const items = [
  { icon: Scissors, title: "Barber lành nghề", desc: "Đội ngũ đào tạo bài bản, tay nghề cao." },
  { icon: Clock, title: "Mở cửa cả tuần", desc: "09:00 - 21:00, T7 & CN tới 22:00." },
  { icon: MapPin, title: "Quận 1, TP.HCM", desc: "128 Lê Thánh Tôn, trung tâm thành phố." },
  { icon: Truck, title: "Giao toàn quốc", desc: "Miễn phí ship cho đơn từ 500K." },
]

export function QuickInfo() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-border border-x border-border px-0 md:grid-cols-4 md:divide-y-0">
        {items.map((item) => (
          <div key={item.title} className="flex flex-col gap-2 p-6">
            <item.icon className="size-6 text-primary" />
            <h3 className="font-display text-base font-semibold uppercase tracking-tight">{item.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
