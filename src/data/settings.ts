import type { SettingsData } from "@/types"

export const defaultSettings: SettingsData = {
  business: {
    name: "TOTO Barbershop",
    tagline: "Craft. Culture. Character.",
    description:
      "TOTO là barbershop kết hợp giữa tay nghề cắt tóc cổ điển và tinh thần streetwear đương đại. Chúng tôi tạo ra những kiểu tóc, sản phẩm grooming và merchandise mang đậm chất riêng.",
  },
  contact: {
    phone: "0909 888 777",
    email: "hello@totobarber.vn",
    address: "85 Đồng Đen,Phường 12, Quận Tân Bình,TP. Hồ Chí Minh",
    
  },
  social: {
    instagram: "https://instagram.com/totobarber",
    facebook: "https://facebook.com/totobarber",
    tiktok: "https://tiktok.com/@totobarber",
    youtube: "https://youtube.com/@totobarber",
  },
  openingHours: [
    { day: "Thứ 2 - Thứ 6", hours: "09:00 - 21:00" },
    { day: "Thứ 7", hours: "08:00 - 22:00" },
    { day: "Chủ nhật", hours: "08:00 - 20:00" },
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
