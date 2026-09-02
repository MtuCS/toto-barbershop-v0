import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

const translateAuthError = (msg?: string) => {
  if (!msg) return "Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.";
  if (msg.includes("Invalid email or password") || msg.includes("không đúng")) {
    return "Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.";
  }
  if (msg.includes("Email and password are required")) {
    return "Vui lòng nhập đầy đủ email và mật khẩu.";
  }
  if (msg.includes("Email không hợp lệ") || msg.includes("Invalid email")) {
    return "Địa chỉ email không đúng định dạng. Vui lòng kiểm tra lại.";
  }
  if (msg.includes("already registered") || msg.includes("đã tồn tại")) {
    return "Email này đã được đăng ký tài khoản. Vui lòng đăng nhập.";
  }
  return msg;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { error: translateAuthError(data.error) },
        { status: res.status }
      );
    }

    return NextResponse.json({
      ...data,
      message: data.message || "Đăng nhập thành công! Chào mừng quý khách quay trở lại."
    }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Không thể kết nối đến máy chủ xác thực. Vui lòng thử lại sau ít phút." },
      { status: 503 }
    );
  }
}
