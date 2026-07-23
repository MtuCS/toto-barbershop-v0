"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface UserAddress {
  id: number;
  province: string;
  district: string;
  ward: string;
  street: string;
  isDefault: boolean;
}

export interface CustomerUser {
  id: number
  email: string
  name: string
  phone?: string
  role?: string
  addresses?: UserAddress[]
}

interface CustomerAuthState {
  user: CustomerUser | null
  token: string | null
  isAuthModalOpen: boolean
  setUser: (user: CustomerUser | null, token: string | null) => void
  logout: () => void
  setAuthModalOpen: (open: boolean) => void
}

export const useCustomerUserStore = create<CustomerAuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthModalOpen: false,
      setUser: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      setAuthModalOpen: (open) => set({ isAuthModalOpen: open }),
    }),
    { 
      name: "toto-customer-user-auth",
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)
