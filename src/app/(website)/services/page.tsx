import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { MarketingPageShell } from "@/components/website/marketing-page-shell";
import { Breadcrumbs } from "@/components/website/breadcrumbs";
import { FigmaServicesList, type FigmaServiceItem } from "@/components/website/services/figma-services-list";
import { FigmaTeamList, type FigmaTeamMember } from "@/components/website/services/figma-team-list";

export const metadata: Metadata = {
  title: "Mấy Món Nghề Tại ToTo — Dịch Vụ Chỉn Chu & Minh Bạch",
  description:
    "Rõ ràng, chỉn chu và minh bạch. Mọi dịch vụ đều được thực hiện kĩ lưỡng bởi đội ngũ thợ lành nghề tại ToTo Barbershop 85 Đồng Đen, Tân Bình.",
};

// 2. Danh Mục Dịch Vụ (Đúng chuẩn 100% copy và quy trình theo bảng đặc tả)
const serviceItems: FigmaServiceItem[] = [
  {
    id: "01",
    number: "01",
    title: "CẮT TÓC & TẠO KIỂU",
    duration: "~45 phút",
    image: "/images/service-cut.jpg",
    description: "Cắt gọt và định hình form tóc chuẩn nam tính.",
    steps: [
      "Tư vấn dáng tóc",
      "Xả sạch & Cắt gọt",
      "Sấy tạo kiểu & Hướng dẫn vuốt sáp",
    ],
    priceLabel: "Giá từ",
    price: "150.000đ",
    featured: false,
  },
  {
    id: "02",
    number: "02",
    title: "CHĂM SÓC & TỈA RÂU",
    duration: "~30 phút",
    image: "/images/service-shave.jpg",
    description: "Tỉa form râu và cạo sát êm ái cho gương mặt chỉn chu.",
    steps: [
      "Định hình khuôn râu",
      "Ủ khăn nóng & Cạo êm ái",
      "Thoa dưỡng da mặt",
    ],
    priceLabel: "Giá từ",
    price: "120.000đ",
    featured: false,
  },
  {
    id: "03",
    number: "03",
    title: "UỐN & NHUỘM TẠO FORM",
    duration: "~90 - 120 phút",
    image: "/images/combo.jpg",
    description: "Hóa chất tạo nếp và đổi màu bảo vệ chất tóc.",
    steps: [
      "Kiểm tra chất tóc",
      "Uốn/Nhuộm tạo phom natural",
      "Xả dưỡng & Khóa form",
    ],
    priceLabel: "Giá từ",
    price: "350.000đ",
    featured: true,
  },
  {
    id: "04",
    number: "04",
    title: "PHỤC HỒI & GỘI THƯ GIÃN",
    duration: "~30 - 45 phút",
    image: "/images/ourshop-2.jpg",
    description: "Làm sạch sâu da đầu và giải tỏa căng thẳng.",
    steps: [
      "Tẩy tế bào chết da đầu",
      "Gội ấn huyệt cổ-vai-gáy",
      "Xả dưỡng & Sấy khô",
    ],
    priceLabel: "Giá từ",
    price: "180.000đ",
    featured: true,
  },
];

// 3. Lookbook (8 hình ảnh cận cảnh phom tóc thực tế, góc nghiêng/sau gáy)
const lookbookGallery = [
  { id: 1, src: "/images/lookbook-1.png", alt: "Phom tóc ToTo 1" },
  { id: 2, src: "/images/lookbook-2.png", alt: "Phom tóc ToTo 2" },
  { id: 3, src: "/images/lookbook-3.png", alt: "Phom tóc ToTo 3" },
  { id: 4, src: "/images/lookbook-4.png", alt: "Phom tóc ToTo 4" },
  { id: 5, src: "/images/lookbook-5.png", alt: "Phom tóc ToTo 5" },
  { id: 6, src: "/images/lookbook-6.png", alt: "Phom tóc ToTo 6" },
  { id: 7, src: "/images/lookbook-7.png", alt: "Phom tóc ToTo 7" },
  { id: 8, src: "/images/lookbook-8.png", alt: "Phom tóc ToTo 8" },
];

// 4. Tổ Đội TOTO (4 Thẻ chân dung + Tên + Thế mạnh ngắn)
const teamMembers: FigmaTeamMember[] = [
  {
    id: "barber-toto",
    name: "Barber ToTo",
    role: "Head Barber & Founder",
    image: "/images/interior.png",
    description: "Tư vấn kĩ lưỡng, cắt tỉ mỉ, form tóc bền đẹp chuẩn form.",
    specialty: "Classic Pompadour, Skin Fade",
  },
  {
    id: "barber-huy",
    name: "Barber Huy",
    role: "Senior Barber",
    image: "/images/service-shave.jpg",
    description: "Chuyên mảng tẩy tóc, vuốt tạo kiểu khó và form textured cá tính.",
    specialty: "Textured Crop, Mullet",
  },
  {
    id: "barber-minh",
    name: "Barber Minh",
    role: "Stylist & Color Specialist",
    image: "/images/interior1.png",
    description: "Chuyên uốn nhuộm, vào màu tự nhiên hay contrast, sấy tạo kiểu.",
    specialty: "Uốn Texture, Nhuộm Khói",
  },
  {
    id: "barber-tin",
    name: "Barber Tín",
    role: "Grooming & Treatment Specialist",
    image: "/images/ourshop-4.jpg",
    description: "Chuyên phục hồi tóc yếu, gội thư giãn và hoàn thiện mẫu tóc.",
    specialty: "Cạo Khăn Nóng, Phục Hồi",
  },
];

export default function ServicesPage() {
  return (
    <MarketingPageShell className="bg-[#07110f] text-[#f2f5f3]">
      <div className="mx-auto max-w-[1400px] px-5 pt-6 md:px-8">
        <Breadcrumbs items={[{ label: "Dịch Vụ" }]} />
      </div>

      {/* ========================================================================= */}
      {/* 2. DANH MỤC DỊCH VỤ (4 Block Grid 2x2 Mobile / 4 Cột Desktop) */}
      {/* ========================================================================= */}
      <section className="relative px-5 py-12 md:px-8 md:py-16 border-b border-white/10 bg-[#07110f]">
        <div className="mx-auto max-w-[1400px]">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#79b8a7]/30 bg-[#79b8a7]/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#79b8a7] backdrop-blur-md">
                Bảng Giá &amp; Quy Trình
              </span>
            </div>
            <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-[#f2f5f3] leading-[1.1]">
              DỊCH VỤ CHỈN CHU &amp; MINH BẠCH
            </h2>
            <p className="mt-5 text-sm sm:text-base leading-relaxed text-white/65">
              TOTO gói gọn quy trình thô thành từng bước rõ ràng, giúp bạn nắm được dịch vụ trước khi ngồi ghế.
            </p>
          </div>

          {/* 4 Service Cards Grid (Grid 2x2 Mobile / 4 Columns Desktop) */}
          <FigmaServicesList items={serviceItems} />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. LOOKBOOK (GÓC THÀNH PHẨM TRONG NGOẶC KÉP & 8 ẢNH PHOM TÓC) */}
      {/* ========================================================================= */}
      <section className="relative px-5 py-12 md:px-8 md:py-16 border-b border-white/10 bg-[#07110f]">
        <div className="mx-auto max-w-[1400px]">
          {/* Section Title in quotation marks & exact sub-headline */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#79b8a7]/30 bg-[#79b8a7]/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#79b8a7] backdrop-blur-md">
                Lookbook
              </span>
            </div>
            <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-[#f2f5f3] leading-[1.1]">
              GÓC THÀNH PHẨM
            </h2>
            <p className="mt-5 text-sm sm:text-base leading-relaxed text-white/65">
              Những thành phẩm được tạo ra từ sự tin tưởng của anh em và sự tỉ mỉ của TOTO.
            </p>
          </div>

          {/* Clean 8-Image Grid (2 rows x 4 columns) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {lookbookGallery.map((img) => (
              <div
                key={img.id}
                className="group relative rounded-2xl p-1 border border-white/10 bg-white/[0.02] transition-all duration-500 hover:border-[#79b8a7]/50 hover:shadow-[0_15px_30px_rgba(0,0,0,0.7)]"
              >
                <div className="relative aspect-square overflow-hidden rounded-xl bg-black/40">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-4">
                    <span className="text-[11px] font-mono text-[#79b8a7]">ToTo Real Look #{img.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Centered Button */}
          <div className="mt-8 flex justify-center">
            <Link
              href="/#lookbook"
              className="group inline-flex items-center gap-2 rounded-full bg-[#79b8a7] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#07110f] transition-all duration-300 hover:bg-[#68a494] hover:shadow-[0_0_25px_rgba(121,184,167,0.35)]"
            >
              <span>Xem nhiều hình ảnh hơn</span>
              <ArrowUpRight className="size-4 stroke-[2.5] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. TỔ ĐỘI TOTO */}
      {/* ========================================================================= */}
      <section className="relative px-5 py-12 md:px-8 md:py-16 border-b border-white/10 bg-[#07110f]">
        <div className="mx-auto max-w-[1400px]">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#79b8a7]/30 bg-[#79b8a7]/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#79b8a7] backdrop-blur-md">
                Đội Ngũ Thợ
              </span>
            </div>
            <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-[#f2f5f3] leading-[1.1]">
              TỔ ĐỘI TOTO
            </h2>
            <p className="mt-5 text-sm sm:text-base leading-relaxed text-white/65">
              Nơi bạn yên tâm gửi gắm mái tóc. Dù là anh em quen từ trước hay một gương mặt mới, TOTO luôn ở đây để chăm chút diện mạo cho bạn. Chào mừng bạn ghé tiệm.
            </p>
          </div>

          {/* 4 Thẻ chân dung (Ảnh chân dung + Tên + Thế mạnh ngắn) */}
          <FigmaTeamList members={teamMembers} />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. KHỐI CHỐT CTA */}
      {/* ========================================================================= */}
      <section className="relative px-5 py-14 md:px-8 md:py-20 bg-gradient-to-b from-[#07110f] via-[#091a16]/40 to-[#07110f] text-center">
        <div className="mx-auto max-w-4xl">
          <div className="flex justify-center mb-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#79b8a7]/30 bg-[#79b8a7]/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#79b8a7] backdrop-blur-md">
              Tư Vấn &amp; Đặt Lịch
            </span>
          </div>
          <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#f2f5f3] leading-[1.1]">
            Tư vấn kiểu tóc hay chọn thợ hợp gu?
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-sm sm:text-base leading-relaxed text-white/65">
            Đội ngũ TOTO sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {/* Primary CTA (Link Zalo / Messenger) */}
            <a
              href="https://zalo.me/0981378179"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Tư vấn nhanh qua Zalo hoặc Messenger"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#79b8a7] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#07110f] transition-all duration-300 hover:bg-[#68a494] hover:shadow-[0_0_25px_rgba(121,184,167,0.35)]"
            >
              <MessageCircle className="size-4" />
              <span>TƯ VẤN</span>
              <ArrowUpRight className="size-4 stroke-[2.5] transition-transform duration-300 group-hover:rotate-45" />
            </a>

            {/* Secondary CTA (Link cuộn đến footer thông tin liên hệ / bản đồ) */}
            <Link
              href="#footer"
              aria-label="Xem địa chỉ và ghé ToTo hôm nay"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 hover:border-[#79b8a7] hover:text-[#79b8a7] hover:bg-[#79b8a7]/10"
            >
              <span>GHÉ TOTO HÔM NAY</span>
              <ArrowUpRight className="size-4 stroke-[2.5] transition-transform duration-300 group-hover:rotate-45" />
            </Link>
          </div>
        </div>
      </section>
    </MarketingPageShell>
  );
}
