import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MessageCircle, Play } from "lucide-react";
import { MarketingPageShell } from "@/components/website/marketing-page-shell";
import { Breadcrumbs } from "@/components/website/breadcrumbs";
import {
  FigmaServicesList,
  type FigmaServiceGroup,
} from "@/components/website/services/figma-services-list";
import { LookbookSlider } from "@/components/website/services/lookbook-slider";
import {
  FigmaTeamList,
  type FigmaTeamMember,
} from "@/components/website/services/figma-team-list";
import { getLookbooks, getTeamMembers } from "@/lib/api";

export const metadata: Metadata = {
  title: "Mấy Món Nghề Tại ToTo — Dịch Vụ Chỉn Chu & Minh Bạch",
  description:
    "Rõ ràng, chỉn chu và minh bạch. Mọi dịch vụ đều được thực hiện kĩ lưỡng bởi đội ngũ thợ lành nghề tại ToTo Barbershop 85 Đồng Đen, Tân Bình.",
};

// 2. Danh Mục Dịch Vụ (Cập nhật chuẩn 100% theo nội dung feedback docx)
const defaultServiceGroups: FigmaServiceGroup[] = [
  {
    id: "01",
    number: "01",
    title: "1. TÓC & TẠO KIỂU",
    image: "/images/service-cut.jpg",
    featured: false,
    items: [
      {
        name: "Cắt tóc & Lên form",
        price: "100k",
        description:
          "Tư vấn kỹ theo dáng mặt và chất tóc. Tỉ mỉ từng đường kéo, xả sạch tóc thừa và sấy tạo kiểu gọn gàng.",
      },
      {
        name: "Uốn tóc",
        price: "Từ 300k",
        description:
          "Lên sóng tự nhiên, giữ độ khỏe cho tóc và dễ chăm sóc tại nhà.",
      },
      {
        name: "Nhuộm màu",
        price: "Từ 400k",
        description:
          "Thuốc chất lượng cao, đa dạng màu sắc, nổi bật diện mạo.",
      },
    ],
  },
  {
    id: "02",
    number: "02",
    title: "2. GỘI & CẠO",
    image: "/images/service-shave.jpg",
    featured: false,
    items: [
      {
        name: "Gội đầu thư giãn",
        price: "60k",
        description:
          "Gội sạch bụi bẩn, ấn huyệt nhẹ nhàng để xua tan mỏi mệt.",
      },
      {
        name: "Cạo mặt & Ráy tai",
        price: "80k",
        description:
          "Ủ khăn ấm làm mềm da, cạo êm không rát. Ráy tai nhẹ nhàng, tỉ mỉ.",
      },
    ],
  },
  {
    id: "03",
    number: "03",
    title: "3. CHĂM SÓC DA MẶT",
    image: "/images/combo.jpg",
    featured: false,
    items: [
      {
        name: "Đắp khăn nóng & Lột mụn",
        price: "60k",
        description:
          "Làm sạch sâu lỗ chân lông, trả lại làn da thông thoáng.",
      },
      {
        name: "Combo Dưỡng Da",
        price: "90k",
        description:
          "Tẩy tế bào chết + Thải chì + Đắp mặt nạ ngũ hoa. Làm sạch bã nhờn, dịu nhẹ cho da sau những giờ đi đường nắng gió.",
      },
    ],
  },
  {
    id: "04",
    number: "04",
    title: "4. MẤY GÓI COMBO",
    image: "/images/ourshop-2.jpg",
    featured: true,
    items: [
      {
        name: "Combo Thư Giãn",
        price: "150k",
        description:
          "Lột mụn + Cạo mặt & Ráy tai + Đắp khăn nóng. Chăm sóc toàn diện cho gương mặt tươi tắn, nhẹ nhõm.",
      },
      {
        name: "Full Combo",
        price: "300k",
        description:
          "Cạo & Ráy + Gội + Lột mụn + Đắp khăn nóng + Dưỡng da. Trải nghiệm trọn vẹn để bạn thả lỏng hoàn toàn và lấy lại phong độ.",
      },
    ],
  },
];

// 3. Lookbook (8 hình ảnh phom tóc thực tế)
const fallbackLookbookGallery = [
  { id: "1", src: "/images/lookbook-1.png", alt: "Phom tóc ToTo 1" },
  { id: "2", src: "/images/lookbook-2.png", alt: "Phom tóc ToTo 2" },
  { id: "3", src: "/images/lookbook-3.png", alt: "Phom tóc ToTo 3" },
  { id: "4", src: "/images/lookbook-4.png", alt: "Phom tóc ToTo 4" },
  { id: "5", src: "/images/lookbook-5.png", alt: "Phom tóc ToTo 5" },
  { id: "6", src: "/images/lookbook-6.png", alt: "Phom tóc ToTo 6" },
  { id: "7", src: "/images/lookbook-7.png", alt: "Phom tóc ToTo 7" },
  { id: "8", src: "/images/lookbook-8.png", alt: "Phom tóc ToTo 8" },
];

// 4. Tổ Đội TOTO (Chỉ hình chân dung + Tên theo feedback)
const fallbackTeamMembers: FigmaTeamMember[] = [
  {
    id: "barber-toto",
    name: "Barber ToTo",
    image: "/images/interior.png",
  },
  {
    id: "barber-huy",
    name: "Barber Huy",
    image: "/images/service-shave.jpg",
  },
  {
    id: "barber-minh",
    name: "Barber Minh",
    image: "/images/interior1.png",
  },
  {
    id: "barber-tin",
    name: "Barber Tín",
    image: "/images/ourshop-4.jpg",
  },
];

export default async function ServicesPage() {
  const [lookbooks, team] = await Promise.all([
    getLookbooks(),
    getTeamMembers(),
  ]);

  const lookbookGallery = lookbooks.filter(
    (item) => item.category !== "Shop" && item.published !== false
  ).length
    ? lookbooks
      .filter((item) => item.category !== "Shop" && item.published !== false)
      .map((item, index) => ({
        id: String(item.id ?? index + 1),
        src: item.image,
        alt: item.title || item.caption || "Thành phẩm TOTO",
      }))
    : fallbackLookbookGallery;

  const teamMembers: FigmaTeamMember[] = team.filter(
    (member) => member.status !== "hidden"
  ).length
    ? team
      .filter((member) => member.status !== "hidden")
      .map((member, index) => ({
        id: String(member.id ?? index),
        name: member.name,
        image: member.image,
      }))
    : fallbackTeamMembers;

  return (
    <MarketingPageShell className="bg-[#07110f] text-[#f2f5f3]">
      <div className="mx-auto max-w-[1400px] px-5 pt-6 md:px-8">
        <Breadcrumbs items={[{ label: "Dịch Vụ" }]} />
      </div>

      {/* ========================================================================= */}
      {/* 1. HEADER INTRO & VIDEO SHOWCASE FRAME */}
      {/* ========================================================================= */}
      <section className="relative px-5 pt-8 pb-12 md:px-8 md:pt-10 md:pb-16 border-b border-white/10 bg-[#07110f] overflow-hidden">
        {/* Subtle ambient light orb */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/4 size-[32rem] rounded-full bg-[#79b8a7]/10 blur-[120px]"
        />

        <div className="relative mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column (Editorial Typography) */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <h1 className="font-sans text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-[#f2f5f3] leading-[1.05]">
                MẤY MÓN NGHỀ<br className="hidden sm:inline" /> TẠI TOTO
              </h1>
              <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-white/70 font-sans">
                Rõ ràng, chỉn chu và minh bạch. Mọi dịch vụ đều được thực hiện kĩ lưỡng bởi đội ngũ thợ lành nghề.
              </p>
            </div>

            {/* Right Column (Double-Bezel Video Showcase Frame sẵn sàng cho shot quay dịch vụ) */}
            <div className="lg:col-span-5">
              <div className="group relative rounded-[2rem] p-1.5 border border-white/10 bg-white/[0.02] shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-sm transition-all duration-500 hover:border-[#79b8a7]/40">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[calc(2rem-0.375rem)] border border-white/5 bg-black/60">
                  <Image
                    src="/images/service-banner.jpg"
                    alt="Video tổng hợp dịch vụ ToTo Barbershop"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07110f]/90 via-black/40 to-black/20" />

                  {/* Play Button Overlay */}
                  {/* <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <div className="flex size-14 items-center justify-center rounded-full border border-white/30 bg-black/60 text-[#79b8a7] shadow-[0_0_30px_rgba(121,184,167,0.35)] backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-[#79b8a7] group-hover:text-[#07110f]">
                      <Play className="size-6 fill-current ml-0.5" />
                    </div>
                    <span className="mt-3 text-xs font-mono uppercase tracking-widest text-white/80 group-hover:text-[#79b8a7] transition-colors">

                    </span>
                  </div> */}

                  {/* Corner tags */}
                  {/* <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-white/70 backdrop-blur-md bg-black/60 px-3 py-1 rounded-full border border-white/10">
                    <span className="text-[#79b8a7]">ToTo Atmosphere</span>
                    <span className="text-white/50">85 Đồng Đen, Tân Bình</span>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. DANH MỤC DỊCH VỤ (4 Nhóm Card chuẩn theo docx, CTA Tìm hiểu qua Messenger) */}
      {/* ========================================================================= */}
      <section className="relative px-5 py-12 md:px-8 md:py-16 border-b border-white/10 bg-[#07110f]">
        <div className="mx-auto max-w-[1400px]">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#79b8a7]/30 bg-[#79b8a7]/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#79b8a7] backdrop-blur-md">
                Bảng Giá &amp; Dịch Vụ
              </span>
            </div>
            <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-[#f2f5f3] leading-[1.1]">
              DỊCH VỤ CHỈN CHU &amp; MINH BẠCH
            </h2>
            <p className="mt-5 text-sm sm:text-base leading-relaxed text-white/65">
              TOTO gói gọn quy trình thành từng nhóm rõ ràng, giúp bạn nắm được dịch vụ và giá trước khi ngồi ghế.
            </p>
          </div>

          {/* 4 Nhóm Thẻ Dịch Vụ (Không quy trình, chỉ hình minh họa + giá, CTA Tìm hiểu) */}
          <FigmaServicesList groups={defaultServiceGroups} />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. LOOKBOOK (1 Hàng 4 hình + Nút điều hướng < > + Hover pop-up, không CTA dưới) */}
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

          {/* Lookbook 1 dòng 4 hình với 2 nút mũi tên < > và hiệu ứng pop-up */}
          <LookbookSlider images={lookbookGallery} />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. TỔ ĐỘI TOTO (Chỉ hiển thị ảnh chân dung và tên theo feedback) */}
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

          {/* 4 Thẻ chân dung tối giản: Hình + Tên */}
          <FigmaTeamList members={teamMembers} />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. KHỐI CHỐT CTA (TƯ VẤN - Bật thẳng Messenger TOTO) */}
      {/* ========================================================================= */}
      <section className="relative px-5 py-14 md:px-8 md:py-20 bg-gradient-to-b from-[#07110f] via-[#091a16]/40 to-[#07110f] text-center">
        <div className="mx-auto max-w-4xl">
          <div className="flex justify-center mb-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#79b8a7]/30 bg-[#79b8a7]/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#79b8a7] backdrop-blur-md">
              TƯ VẤN
            </span>
          </div>
          <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#f2f5f3] leading-[1.1]">
            Tư vấn kiểu tóc hay chọn thợ hợp gu?
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-sm sm:text-base leading-relaxed text-white/65">
            TOTO sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {/* Primary CTA (Bật thẳng Messenger của TOTO) */}
            <a
              href="https://m.me/totobarbershopHCM"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Tư vấn nhanh qua Messenger ToTo Barbershop"
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
              <span>GHÉ TOTO </span>
              <ArrowUpRight className="size-4 stroke-[2.5] transition-transform duration-300 group-hover:rotate-45" />
            </Link>
          </div>
        </div>
      </section>
    </MarketingPageShell>
  );
}
