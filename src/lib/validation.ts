export const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPhone = (phone: string) => {
  // Regex cho SĐT Việt Nam: bắt đầu bằng số 0, sau đó là đầu số (3|5|7|8|9), và 8 chữ số.
  return /^(0[3|5|7|8|9])+([0-9]{8})$/.test(phone);
};
