export const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPhone = (phone: string) => {
  if (!phone) return false;
  // Regex chuẩn cho SĐT di động Việt Nam: đúng 10 chữ số, bắt đầu bằng 03, 05, 07, 08, 09
  return /^0[35789]\d{8}$/.test(phone.trim());
};
