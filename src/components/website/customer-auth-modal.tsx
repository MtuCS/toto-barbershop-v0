"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { X, User, Lock, Mail, LogOut, CheckCircle2, UserPlus, LogIn, Loader2 } from "lucide-react"
import { useCustomerUserStore } from "@/store/customer-user-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CustomerAuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CustomerAuthModal({ isOpen, onClose }: CustomerAuthModalProps) {
  const { user, setUser, logout } = useCustomerUserStore()
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")

  // Mounted state for portal
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Form states
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  if (!isOpen || !mounted) return null

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      let data;
      try {
        data = await res.json()
      } catch (err) {
        throw new Error("Phản hồi từ máy chủ không hợp lệ.")
      }

      if (res.ok && data.user) {
        setUser(data.user, data.token || null)
        setSuccessMsg("Đăng nhập thành công!")
        setTimeout(() => {
          onClose()
          setSuccessMsg("")
        }, 1000)
      } else {
        setErrorMsg(data.error || "Tài khoản hoặc mật khẩu không chính xác")
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Không thể kết nối đến máy chủ. Vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")
    setSuccessMsg("")

    if (!name.trim()) {
      setErrorMsg("Vui lòng nhập họ và tên của bạn")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg("Mật khẩu nhập lại không khớp")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password, name: name.trim() }),
      })

      let data;
      try {
        data = await res.json()
      } catch (err) {
        throw new Error("Phản hồi từ máy chủ không hợp lệ.")
      }

      if (res.ok && data.user) {
        setUser(data.user, data.token || null)
        setSuccessMsg("Đăng ký tài khoản thành công!")
        setTimeout(() => {
          onClose()
          setSuccessMsg("")
        }, 1000)
      } else {
        setErrorMsg(data.error || "Đăng ký thất bại. Email có thể đã tồn tại.")
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Không thể kết nối đến máy chủ. Vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  }

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-[420px] overflow-hidden rounded-[24px] bg-white p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] ring-1 ring-black/5 transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-neutral-400 transition-all hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200"
        >
          <X className="size-4" />
        </button>

        {user ? (
          /* User Profile Logged In View */
          <div className="flex flex-col items-center py-6 text-center animate-in slide-in-from-bottom-4 duration-500">
            <div className="mb-5 flex size-20 items-center justify-center rounded-full bg-neutral-50 border ring-4 ring-white shadow-sm">
              <User className="size-8 text-neutral-400" />
            </div>
            <h3 className="font-display text-2xl font-bold tracking-tight text-neutral-900">
              {user.name}
            </h3>
            <p className="mt-1 text-sm text-neutral-500">{user.email}</p>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600 ring-1 ring-inset ring-emerald-600/20">
              <CheckCircle2 className="size-3.5" /> Thành viên ToTo
            </div>

            <div className="mt-10 w-full">
              <Button
                onClick={() => {
                  logout()
                  onClose()
                }}
                variant="outline"
                className="w-full h-12 rounded-xl border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-red-600 font-medium transition-colors"
              >
                <LogOut className="mr-2 size-4" /> Đăng xuất
              </Button>
            </div>
          </div>
        ) : (
          /* Login / Register Tabs View */
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 text-center">
              <h2 className="font-display text-3xl font-bold tracking-tight text-neutral-900">
                ToTo Barbershop
              </h2>
              <p className="mt-2 text-sm text-neutral-500">
                {activeTab === "login" ? "Chào mừng bạn quay trở lại" : "Tạo tài khoản để trải nghiệm dịch vụ"}
              </p>
            </div>

            {/* Tabs switcher */}
            <div className="mb-8 flex rounded-xl bg-neutral-100/80 p-1">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("login")
                  setErrorMsg("")
                  setSuccessMsg("")
                }}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                  activeTab === "login"
                    ? "bg-white text-neutral-900 shadow-sm ring-1 ring-black/5"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("register")
                  setErrorMsg("")
                  setSuccessMsg("")
                }}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                  activeTab === "register"
                    ? "bg-white text-neutral-900 shadow-sm ring-1 ring-black/5"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                Đăng ký
              </button>
            </div>

            {errorMsg && (
              <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-600 ring-1 ring-inset ring-red-600/10 animate-in fade-in slide-in-from-top-2">
                <div className="mt-0.5 rounded-full bg-red-100 p-1">
                  <X className="size-3 text-red-600" />
                </div>
                <p className="leading-5">{errorMsg}</p>
              </div>
            )}

            {successMsg && (
              <div className="mb-6 flex items-start gap-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-600 ring-1 ring-inset ring-emerald-600/10 animate-in fade-in slide-in-from-top-2">
                <div className="mt-0.5 rounded-full bg-emerald-100 p-1">
                  <CheckCircle2 className="size-3 text-emerald-600" />
                </div>
                <p className="leading-5">{successMsg}</p>
              </div>
            )}

            {activeTab === "login" ? (
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-700">
                    Email của bạn
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-neutral-400" />
                    <Input
                      type="email"
                      required
                      placeholder="vido@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 rounded-xl bg-neutral-50/50 pl-11 text-neutral-900 border-neutral-200 focus:bg-white focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-neutral-700">
                      Mật khẩu
                    </label>
                    <a href="#" className="text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
                      Quên mật khẩu?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-neutral-400" />
                    <Input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 rounded-xl bg-neutral-50/50 pl-11 text-neutral-900 border-neutral-200 focus:bg-white focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="mt-6 h-12 w-full rounded-xl bg-neutral-900 text-white font-semibold shadow hover:bg-neutral-800 transition-all"
                >
                  {loading ? (
                    <><Loader2 className="mr-2 size-4 animate-spin" /> Đang xử lý...</>
                  ) : (
                    "Đăng nhập"
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-700">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-neutral-400" />
                    <Input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12 rounded-xl bg-neutral-50/50 pl-11 text-neutral-900 border-neutral-200 focus:bg-white focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-700">
                    Email của bạn
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-neutral-400" />
                    <Input
                      type="email"
                      required
                      placeholder="vido@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 rounded-xl bg-neutral-50/50 pl-11 text-neutral-900 border-neutral-200 focus:bg-white focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-700">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-neutral-400" />
                    <Input
                      type="password"
                      required
                      placeholder="Tối thiểu 6 ký tự"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 rounded-xl bg-neutral-50/50 pl-11 text-neutral-900 border-neutral-200 focus:bg-white focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-700">
                    Nhập lại mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-neutral-400" />
                    <Input
                      type="password"
                      required
                      placeholder="Nhập lại mật khẩu ở trên"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-12 rounded-xl bg-neutral-50/50 pl-11 text-neutral-900 border-neutral-200 focus:bg-white focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="mt-6 h-12 w-full rounded-xl bg-neutral-900 text-white font-semibold shadow hover:bg-neutral-800 transition-all"
                >
                  {loading ? (
                    <><Loader2 className="mr-2 size-4 animate-spin" /> Đang xử lý...</>
                  ) : (
                    "Đăng ký tài khoản"
                  )}
                </Button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
