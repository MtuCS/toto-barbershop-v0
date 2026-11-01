"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
} from "motion/react";
import {
  Scissors,
  Users,
  Sparkles,
  Compass,
  Plus,
} from "lucide-react";

const PILLARS = [
  {
    title: "Kèm sát 1 kèm 1",
    description:
      "Thợ chính đồng hành và theo dõi học viên trên từng góc kéo, đường cạo.",
    icon: Users,
    craftNote: "Đồng hành sát sao",
    featured: false,
  },
  {
    title: "Thực chiến đến nơi đến chốn",
    description:
      "Không lý thuyết suông. Trải qua đa dạng chất tóc, tích lũy kinh nghiệm qua từng ca khó để tay kéo ngày càng vững vàng.",
    icon: Scissors,
    craftNote: "Thực hành tóc thật",
    featured: true,
  },
  {
    title: "Hiểu dáng, rõ gu",
    description:
      "Học cách nhìn dáng mặt, hiểu chất tóc để tư vấn đúng kiểu phù hợp.",
    icon: Sparkles,
    craftNote: "Thẩm mỹ form tóc",
    featured: false,
  },
  {
    title: "Tư duy làm nghề",
    description:
      "Rèn sự chỉn chu, cách đối nhân xử thế với khách và tác phong người thợ trưởng thành.",
    icon: Compass,
    craftNote: "Tác phong người thợ",
    featured: false,
  },
] as const;

export const TRAINING_FAQS = [
  {
    question:
      "Tôi chưa từng cầm kéo, bắt đầu từ con số 0 có học được không?",
    answer:
      "Được chứ. Ở ToTo không quan trọng bạn bắt đầu từ đâu, mà là thái độ của bạn với nghề thế nào. Tụi mình sẽ hướng dẫn từ cách cầm kéo, thế đứng, cách chia tóc... từ những bước căn bản nhất. Chỉ cần bạn chịu khó, tụi mình sẵn sàng chỉ hết lòng.",
  },
  {
    question: "Mất bao lâu thì tôi có thể tự tin ra nghề và cắt được?",
    answer:
      "Trung bình từ 4 - 6 tháng là anh em đã nắm vững kỹ thuật để đứng ghế. Nhưng nhanh hay chậm còn tùy thuộc vào độ nhạy và sự chăm chỉ thực hành của mỗi người. ToTo không ép tiến độ để đuổi học viên ra sớm, tụi mình đồng hành đến khi nào tay nghề bạn thật sự cứng cáp mới thôi.",
  },
  {
    question:
      "Trong lúc học, tôi được thực hành trên tóc thật như thế nào?",
    answer:
      "Sau khi qua giai đoạn làm quen tay trên đầu manocanh, bạn sẽ được đi thực tế ngay tại các buổi cắt tóc miễn phí hàng tuần, các chương trình thiện nguyện và làm mẫu trực tiếp tại tiệm dưới sự kèm cặp 1-1 của thợ chính. Va chạm với càng nhiều chất tóc khó, bạn càng mau lớn.",
  },
  {
    question: "Chi phí học nghề có phát sinh thêm khoản nào nữa không?",
    answer:
      "Học phí tại ToTo là trọn gói cho toàn bộ quá trình học. Riêng về bộ đồ nghề (tông đơ, kéo, lược...), tụi mình sẽ tư vấn để bạn tự trang bị một bộ dụng cụ riêng vừa vặn với tay mình nhất. Đồ nghề đi theo mình cả đời, tự tay chọn lựa vẫn luôn có ý nghĩa hơn.",
  },
  {
    question: "Học xong có chắc chắn được giữ lại tiệm làm việc không?",
    answer:
      "Cánh cửa ToTo luôn mở rộng cho những người anh em cùng tần số. Nếu sau khóa học, tay kéo của bạn đã vững, tính tình đàng hoàng, thương khách và hợp với văn hóa của tiệm, tụi mình rất vui mừng nếu bạn chọn ở lại và đi đường dài cùng anh em.",
  },
] as const;

function PillarCard({
  pillar,
  index,
}: {
  pillar: (typeof PILLARS)[number];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const spotlightBg = useMotionTemplate`radial-gradient(360px circle at ${mouseX}px ${mouseY}px, rgba(212, 168, 75, 0.15), transparent 72%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const Icon = pillar.icon;
  // Dịch Card số 2 (index 1) và số 4 (index 3) xuống 32px (lg:mt-8) để phá vỡ sự cứng nhắc của hàng ngang
  const isStaggeredDown = index % 2 === 1;

  return (
    <div className={`h-full ${isStaggeredDown ? "lg:pt-8" : "lg:pb-8"}`}>
      <motion.article
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 0.55,
          delay: index * 0.08,
          ease: [0.16, 1, 0.3, 1],
        }}
        onMouseMove={handleMouseMove}
        className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border p-7 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-[#d4a84b]/60 hover:shadow-[0_28px_60px_-16px_rgba(0,0,0,0.75)] ${pillar.featured
          ? "border-[#d4a84b]/45 bg-gradient-to-b from-[#17332c] via-[#10241f] to-[#0a1714] shadow-[0_24px_50px_-16px_rgba(0,0,0,0.65)]"
          : "border-white/12 bg-gradient-to-b from-[#122722]/90 to-[#0a1815]/95"
          }`}
      >
        {/* 1. Hiệu ứng nền card sáng nhẹ ở góc (Warm Bronze Corner Radial-Gradient) khi Hover */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_100%_0%,rgba(212,168,75,0.24)_0%,rgba(212,168,75,0.07)_42%,transparent_70%)] transition-opacity duration-500 ${pillar.featured
            ? "opacity-50 group-hover:opacity-100"
            : "opacity-0 group-hover:opacity-100"
            }`}
        />

        {/* 2. Interactive Cursor Spotlight */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: spotlightBg }}
        />

        {/* Top & Copy Section */}
        <div className="relative z-10">
          <div className="mb-7 flex items-center justify-between gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-105 group-hover:border-[#d4a84b]/75 group-hover:bg-[#d4a84b]/15 ${pillar.featured
                ? "border-[#d4a84b]/55 bg-[#d4a84b]/12 text-[#f0c766] shadow-[0_0_24px_-4px_rgba(212,168,75,0.35)]"
                : "border-[#d4a84b]/30 bg-[#0b1b17]/90 text-[#d4a84b] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                }`}
            >
              <Icon className="h-5 w-5" strokeWidth={1.25} />
            </div>

            <span className="font-agatho italic text-xs tracking-wide text-[#d4a84b]/80 transition-colors duration-300 group-hover:text-[#f3d27a]">
              {pillar.craftNote}
            </span>
          </div>

          <h3 className="font-display text-xl font-bold uppercase leading-snug tracking-wide text-white transition-colors duration-300 group-hover:text-[#f3d27a]">
            {pillar.title}
          </h3>

          <p className="mt-3.5 text-sm leading-[1.75] text-[#c9d4d0] md:text-[15px]">
            {pillar.description}
          </p>
        </div>

        {/* 3. Thanh tiến trình mảnh (Solid Progress Line) sáng dần từ trái qua phải khi Hover */}
        <div className="relative z-10 mt-8 pt-2">
          <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-white/10">
            <div
              aria-hidden="true"
              className={`h-full w-full origin-left bg-gradient-to-r from-[#d4a84b] via-[#f5d77f] to-[#d4a84b] shadow-[0_0_12px_rgba(212,168,75,0.85)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 ${pillar.featured ? "scale-x-[0.35]" : "scale-x-[0.15]"
                }`}
            />
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export function TrainingPillarsGrid() {
  return (
    <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {PILLARS.map((pillar, index) => (
        <PillarCard key={pillar.title} pillar={pillar} index={index} />
      ))}
    </div>
  );
}

export function CareerRevealBlock() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
    >
      {/* Left Narrative */}
      <div className="lg:col-span-6">
        <h2 className="font-display text-3xl font-bold uppercase leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-[42px]">
          Hợp gu, cùng nhà,{" "}
          <span className="font-agatho italic font-bold normal-case tracking-normal text-[#d4a84b]">
            đi đường dài.
          </span>
        </h2>

        <div className="mt-5 flex items-center gap-3">
          <span className="h-[2px] w-16 bg-gradient-to-r from-[#d4a84b] to-transparent" />
        </div>

        <p className="mt-6 max-w-[60ch] text-base leading-[1.8] text-[#d6dfdc] sm:text-lg">
          Học nghề suy cho cùng là để kiếm một cái nghề đàng hoàng và một chốn
          để dung thân. Những anh em nào vững tay kéo, tâm sáng và cùng chung
          nhịp sống với ToTo, cánh cửa đứng ghế chính thức luôn rộng mở.
        </p>

        {/* Hairline-divided values (no nested cards) */}
        <dl className="mt-9 grid grid-cols-1 gap-6 border-t border-white/10 pt-7 sm:grid-cols-3">
          <div>
            <dt className="font-agatho italic text-lg font-bold text-[#d4a84b]">
              Vững tay kéo
            </dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-[#a8b6b1]">
              Làm chủ kỹ thuật cắt, cạo, tạo kiểu thực tế tại ghế.
            </dd>
          </div>
          <div className="sm:border-l sm:border-white/10 sm:pl-6">
            <dt className="font-agatho italic text-lg font-bold text-[#d4a84b]">
              Tâm sáng
            </dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-[#a8b6b1]">
              Chỉn chu, đàng hoàng và tử tế với từng vị khách.
            </dd>
          </div>
          <div className="sm:border-l sm:border-white/10 sm:pl-6">
            <dt className="font-agatho italic text-lg font-bold text-[#d4a84b]">
              Cùng nhịp sống
            </dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-[#a8b6b1]">
              Cơ hội đứng ghế chính thức, gắn bó lâu dài tại ToTo.
            </dd>
          </div>
        </dl>
      </div>

      {/* Right Candid Photo with external caption */}
      <figure className="lg:col-span-6">
        <div className="group relative overflow-hidden rounded-2xl border border-[#d4a84b]/25 bg-[#0d1f1b] shadow-[0_28px_60px_-20px_rgba(0,0,0,0.75)]">
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <Image
              src="/images/ourshop-5.jpg"
              alt="Anh em thợ cạo và học viên ToTo Barbershop"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#091512]/55 via-transparent to-transparent" />
          </div>
        </div>
        {/* <figcaption className="mt-3 flex items-center justify-between text-xs text-[#9cb0aa] sm:text-sm">
          <span>Không gian làm nghề và gắn kết mỗi ngày tại 85 Đồng Đen</span>
          <span className="font-agatho italic font-semibold text-[#d4a84b]">
            ToTo Team
          </span>
        </figcaption> */}
      </figure>
    </div>
  );
}

export function TrainingFaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: TRAINING_FAQS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="divide-y divide-white/10 border-y border-white/10">
        {TRAINING_FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          const panelId = `training-faq-panel-${idx}`;
          const buttonId = `training-faq-btn-${idx}`;

          return (
            <div key={faq.question} className="transition-colors duration-300">
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleIndex(idx)}
                  className="group flex w-full items-center justify-between gap-6 py-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a84b]/60"
                >
                  <span
                    className={`text-base font-semibold leading-snug transition-colors sm:text-lg ${isOpen
                      ? "text-[#f0c766]"
                      : "text-white group-hover:text-[#f0c766]"
                      }`}
                  >
                    {faq.question}
                  </span>

                  {/* Plus (+) rotates into Minus (-) */}
                  <span
                    aria-hidden="true"
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${isOpen
                      ? "border-[#d4a84b] bg-[#d4a84b] text-[#0d1f1b]"
                      : "border-white/15 bg-white/[0.03] text-[#d4a84b] group-hover:border-[#d4a84b]/50"
                      }`}
                  >
                    <Plus
                      className={`h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? "rotate-45" : "rotate-0"
                        }`}
                      strokeWidth={1.75}
                    />
                  </span>
                </button>
              </h3>

              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
                  }`}
              >
                <div className="overflow-hidden">
                  <div className="pb-6 pr-12">
                    <p className="max-w-[65ch] text-sm leading-[1.8] text-[#c9d4d0] sm:text-base">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
