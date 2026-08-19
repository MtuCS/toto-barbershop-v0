import { NextResponse } from "next/server";

const DEMO_ADMIN = {
  email: "admin@totobarber.com",
  password: "admin123",
  name: "ToTo Admin",
};

export async function POST(request: Request) {
  let credentials: { email?: unknown; password?: unknown };

  try {
    credentials = await request.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu đăng nhập không hợp lệ." }, { status: 400 });
  }

  const email = typeof credentials.email === "string" ? credentials.email.trim().toLowerCase() : "";
  const password = typeof credentials.password === "string" ? credentials.password : "";

  if (email !== DEMO_ADMIN.email || password !== DEMO_ADMIN.password) {
    return NextResponse.json({ error: "Email hoặc mật khẩu không đúng." }, { status: 401 });
  }

  return NextResponse.json({
    token: "local-demo-admin-session",
    user: {
      email: DEMO_ADMIN.email,
      name: DEMO_ADMIN.name,
      role: "ADMIN",
    },
  });
}
