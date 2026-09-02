import type { TrainingCourse } from "@/types"

export const trainingCourses: TrainingCourse[] = [
  {
    id: "t-foundation",
    slug: "barber-foundation",
    title: "BARBER FOUNDATION",
    level: "beginner",
    duration: "8 tuần",
    price: 12000000,
    summary:
      "Khóa nền tảng cho người mới bắt đầu: từ cách cầm tông đơ đến hoàn thiện một kiểu cắt cơ bản.",
    audience: [
      "Người chưa có kinh nghiệm",
      "Muốn chuyển nghề barber",
      "Học viên trẻ đam mê nghề tóc",
    ],
    benefits: [
      "Thực hành trên người thật có giám sát",
      "Bộ dụng cụ nhập môn",
      "Chứng chỉ hoàn thành Toto Academy",
      "Cơ hội thực tập tại chi nhánh",
    ],
    roadmap: [
      { week: "Tuần 1-2", focus: "Dụng cụ, vệ sinh, cấu trúc tóc" },
      { week: "Tuần 3-4", focus: "Kỹ thuật tông đơ & fade cơ bản" },
      { week: "Tuần 5-6", focus: "Kéo, tỉa layer, tạo khối" },
      { week: "Tuần 7-8", focus: "Hoàn thiện & thực hành khách thật" },
    ],
    modules: [
      { title: "Nền tảng nghề", lessons: ["Lịch sử barber", "Vệ sinh & an toàn", "Làm quen dụng cụ"] },
      { title: "Kỹ thuật cắt", lessons: ["Cầm tông đơ", "Fade cơ bản", "Cắt kéo"] },
      { title: "Hoàn thiện", lessons: ["Tạo kiểu", "Tư vấn khách", "Quy trình phục vụ"] },
    ],
    images: ["/images/training.png", "/images/barber-1.png"],
    instructor: {
      name: "Toto Nguyễn",
      role: "Master Barber & Founder",
      bio: "12 năm kinh nghiệm, đào tạo hơn 300 barber trên toàn quốc.",
      avatar: "/images/instructor.png",
    },
    status: "published",
  },
  {
    id: "t-pro",
    slug: "advanced-fade-styling",
    title: "ADVANCED FADE & STYLING",
    level: "pro",
    duration: "6 tuần",
    price: 18000000,
    summary:
      "Khóa nâng cao cho barber đã có nghề, tập trung vào fade phức tạp, freestyle và xây dựng phong cách cá nhân.",
    audience: [
      "Barber đang hành nghề",
      "Muốn nâng tay nghề fade",
      "Chuẩn bị mở tiệm riêng",
    ],
    benefits: [
      "Kỹ thuật fade nâng cao & freestyle",
      "Xây dựng thương hiệu cá nhân",
      "Networking cộng đồng barber",
      "Chứng chỉ nâng cao",
    ],
    roadmap: [
      { week: "Tuần 1-2", focus: "Fade nâng cao, blend hoàn hảo" },
      { week: "Tuần 3-4", focus: "Freestyle & hair design" },
      { week: "Tuần 5-6", focus: "Thương hiệu cá nhân & vận hành" },
    ],
    modules: [
      { title: "Fade Mastery", lessons: ["Drop fade", "Burst fade", "Blend nâng cao"] },
      { title: "Design", lessons: ["Hair tattoo", "Freestyle", "Texture"] },
      { title: "Business", lessons: ["Personal brand", "Định giá", "Vận hành tiệm"] },
    ],
    images: ["/images/lookbook-3.png", "/images/training.png"],
    instructor: {
      name: "Toto Nguyễn",
      role: "Master Barber & Founder",
      bio: "12 năm kinh nghiệm, đào tạo hơn 300 barber trên toàn quốc.",
      avatar: "/images/instructor.png",
    },
    status: "published",
  },
]
