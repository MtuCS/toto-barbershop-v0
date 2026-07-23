"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AdminSession } from "@/types"

interface AuthState {
  session: AdminSession | null
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      login: async (email, password) => {
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.trim(), password }),
          })
          
          let data;
          try {
            data = await res.json()
          } catch {
            return { ok: false, error: "Lỗi kết nối đến máy chủ." }
          }
          
          if (res.ok && data.user) {
            if (data.user.role !== 'ADMIN') {
              return { ok: false, error: "Tài khoản không có quyền quản trị." }
            }
            
            set({
              session: {
                email: data.user.email,
                name: data.user.name,
                loggedInAt: new Date().toISOString(),
                token: data.token
              } as any,
            })
            return { ok: true }
          }
          
          return { ok: false, error: data.error || "Email hoặc mật khẩu không đúng." }
        } catch (err: any) {
          return { ok: false, error: "Không thể kết nối đến máy chủ." }
        }
      },
      logout: () => set({ session: null }),
    }),
    { name: "toto-admin-auth-real" },
  ),
)

export const DEMO_CREDENTIALS = { email: "admin@totobarber.com", password: "admin123" }
