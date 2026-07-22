import type { SettingsData } from "@/types"

export const defaultSettings: SettingsData = {
  business: {
    name: "TOTO Barbershop",
    tagline: "Craft. Culture. Character.",
    description:
      "ToTo barbershop kết hợp giữa tay nghề cắt tóc cổ điển và tinh thần streetwear đương đại. Chúng tôi tạo ra những kiểu tóc, sản phẩm grooming và merchandise mang đậm chất riêng.",
  },
  contact: {
    phone: "098 137 81 79",
    email: "nguyenphap506@gmail.com",
    address: "85 Đồng Đen,Phường 12, Quận Tân Bình,TP. Hồ Chí Minh",
    
  },
  social: {
    instagram: "https://www.instagram.com/totobarbershop_/",
    facebook: "https://www.facebook.com/totobarbershopHCM",
    tiktok: "https://tiktok.com/@totobarber",
    youtube: "https://youtube.com/@totobarber",
  },
  openingHours: [
    { day: "Thứ 2 - Chủ nhật", hours: "08:30 - 20:30" },
    // { day: "Thứ 7", hours: "08:00 - 22:00" },
    // { day: "Chủ nhật", hours: "08:00 - 20:00" },
  ],
  shipping: {
    freeThreshold: 500000,
    flatFee: 30000,
  },
  bankTransfer: {
    bankName: "Vietcombank - CN TP.HCM",
    accountName: "CONG TY TNHH TOTO BARBER",
    accountNumber: "0071 0009 88777",
  },
  seo: {
    metaTitle: "TOTO Barbershop — Craft. Culture. Character.",
    metaDescription:
      "Barbershop cao cấp, học viện đào tạo, grooming và merchandise mang tinh thần streetwear.",
  },
}
