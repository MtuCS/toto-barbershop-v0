"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AdminSession } from "@/types"

// ============================================================================
// MOCK auth only — DO NOT use in production. Credentials are checked
// client-side purely for prototype purposes.
// Backend hook point: replace login() with a real auth call + httpOnly cookie.
// ============================================================================

const DEMO_EMAIL = "admin@totobarbershop.vn"
const DEMO_PASSWORD = "admin123"

interface AuthState {
  session: AdminSession | null
  login: (email: string, password: string) => { ok: boolean; error?: string }
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      login: (email, password) => {
        if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
          set({
            session: {
              email: DEMO_EMAIL,
              name: "Quản trị viên",
              loggedInAt: new Date().toISOString(),
            },
          })
          return { ok: true }
        }
        return { ok: false, error: "Email hoặc mật khẩu không đúng." }
      },
      logout: () => set({ session: null }),
    }),
    { name: "toto-admin-auth" },
  ),
)

export const DEMO_CREDENTIALS = { email: DEMO_EMAIL, password: DEMO_PASSWORD }
