// MOCK analytics for the admin dashboard.

export const revenueByMonth = [
  { month: "T1", revenue: 42_000_000, orders: 84 },
  { month: "T2", revenue: 38_500_000, orders: 76 },
  { month: "T3", revenue: 51_200_000, orders: 102 },
  { month: "T4", revenue: 47_800_000, orders: 95 },
  { month: "T5", revenue: 58_300_000, orders: 118 },
  { month: "T6", revenue: 64_100_000, orders: 131 },
  { month: "T7", revenue: 71_600_000, orders: 146 },
]

export const revenueBySource = [
  { source: "Grooming", value: 42, revenue: 128_000_000 },
  { source: "Merchandise", value: 33, revenue: 101_000_000 },
  { source: "Đào tạo", value: 18, revenue: 55_000_000 },
  { source: "Dịch vụ", value: 7, revenue: 21_000_000 },
]

export const topProducts = [
  { name: "Strong Hold Pomade", sold: 312, revenue: 68_640_000 },
  { name: "Heavyweight Logo Tee", sold: 248, revenue: 79_360_000 },
  { name: "Corduroy Logo Cap", sold: 186, revenue: 46_500_000 },
  { name: "Complete Grooming Kit", sold: 94, revenue: 48_880_000 },
  { name: "Matte Styling Clay", sold: 152, revenue: 36_480_000 },
]

export const dashboardStats = {
  revenue: { value: 71_600_000, delta: 11.7 },
  orders: { value: 146, delta: 8.3 },
  customers: { value: 62, delta: 14.2 },
  aov: { value: 490_000, delta: 3.1 },
}
