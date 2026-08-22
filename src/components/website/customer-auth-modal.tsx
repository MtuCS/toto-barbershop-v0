"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { X, User, Lock, Mail, LogOut, CheckCircle2, Loader2, ArrowLeft, Eye, EyeOff, ShieldCheck, AlertCircle } from "lucide-react"
import { useCustomerUserStore } from "@/store/customer-user-store"
import { isValidEmail } from "@/lib/validation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { clientLogger } from "@/lib/logger"

interface CustomerAuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CustomerAuthModal({ isOpen, onClose }: CustomerAuthModalProps) {
  const { user, setUser, logout } = useCustomerUserStore()
  const [activeTab, setActiveTab] = useState<"login" | "register" | "forgot">("login")

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
  const [otp, setOtp] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [countdown, setCountdown] = useState(0)
  
  // Forgot password flow state
  const [forgotStep, setForgotStep] = useState<1 | 2>(1)

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  // Reset form when changing tabs
  const handleTabChange = (tab: "login" | "register" | "forgot") => {
    setActiveTab(tab)
    setErrorMsg("")
    setSuccessMsg("")
    setShowPassword(false)
    setShowConfirmPassword(false)
    if (tab === "forgot") {
      setForgotStep(1)
      setOtp("")
      setCountdown(0)
    }
  }

  // Countdown effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  if (!isOpen || !mounted) return null

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setSuccessMsg("")

    // Custom Vietnamese Validation
    if (!email.trim()) {
      setErrorMsg("Vui lòng nhập địa chỉ email của bạn.")
      return
    }
    if (!isValidEmail(email.trim())) {
      setErrorMsg("Địa chỉ email không đúng định dạng (ví dụ: customer@toto.com).")
      return
    }
    if (!password) {
      setErrorMsg("Vui lòng nhập mật khẩu của bạn.")
      return
    }

    setLoading(true)
    try {
      clientLogger.info(`Initiating customer login for: ${email.trim()}`)
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      let data: any
      try {
        data = await res.json()
      } catch (err) {
        throw new Error("Không nhận được phản hồi hợp lệ từ máy chủ.")
      }

      if (res.ok && data.user) {
        // Chặn tài khoản Admin đăng nhập vào trang khách hàng
        if (data.user.role === 'ADMIN') {
          setErrorMsg("Tài khoản Quản trị viên không được dùng trên giao diện khách hàng. Vui lòng sử dụng trang quản trị.")
          setLoading(false)
          return
        }
        setUser(data.user, data.token || null)
        setSuccessMsg(data.message || "Đăng nhập thành công! Chào mừng quý khách.")
        clientLogger.info(`Customer login succeeded for: ${email.trim()}`)
        setTimeout(() => {
          onClose()
          setSuccessMsg("")
        }, 1000)
      } else {
        const errorText = data.error || "Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại."
        setErrorMsg(errorText)
        clientLogger.warn(`Customer login failed: ${errorText}`)
      }
    } catch (err: any) {
      const errorText = err.message || "Không thể kết nối đến máy chủ. Vui lòng thử lại sau ít phút."
      setErrorMsg(errorText)
      clientLogger.error("Login network/server error", err)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setSuccessMsg("")

    // Custom Vietnamese Validation
    if (!name.trim()) {
      setErrorMsg("Vui lòng nhập họ và tên của quý khách.")
      return
    }
    if (!email.trim()) {
      setErrorMsg("Vui lòng nhập địa chỉ email của bạn.")
      return
    }
    if (!isValidEmail(email.trim())) {
      setErrorMsg("Địa chỉ email không đúng định dạng (ví dụ: customer@toto.com).")
      return
    }
    if (!password) {
      setErrorMsg("Vui lòng thiết lập mật khẩu mới.")
      return
    }
    if (password.length < 6) {
      setErrorMsg("Mật khẩu phải có độ dài từ 6 ký tự trở lên.")
      return
    }
    if (!confirmPassword) {
      setErrorMsg("Vui lòng nhập lại mật khẩu xác nhận.")
      return
    }
    if (password !== confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không trùng khớp. Vui lòng kiểm tra lại.")
      return
    }

    setLoading(true)
    try {
      clientLogger.info(`Initiating customer registration for: ${email.trim()}`)
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password, name: name.trim() }),
      })

      let data: any
      try {
        data = await res.json()
      } catch (err) {
        throw new Error("Không nhận được phản hồi hợp lệ từ máy chủ.")
      }

      if (res.ok && data.user) {
        setUser(data.user, data.token || null)
        setSuccessMsg(data.message || "Đăng ký thành công! Chào mừng quý khách gia nhập ToTo Barbershop.")
        clientLogger.info(`Customer registered succeeded for: ${email.trim()}`)
        setTimeout(() => {
          onClose()
          setSuccessMsg("")
        }, 1000)
      } else {
        const errorText = data.error || "Đăng ký không thành công. Email có thể đã được sử dụng."
        setErrorMsg(errorText)
        clientLogger.warn(`Registration failed: ${errorText}`)
      }
    } catch (err: any) {
      const errorText = err.message || "Không thể kết nối đến máy chủ. Vui lòng thử lại sau ít phút."
      setErrorMsg(errorText)
      clientLogger.error("Register network/server error", err)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setSuccessMsg("")

    // Custom Vietnamese Validation
    if (!email.trim()) {
      setErrorMsg("Vui lòng nhập địa chỉ email của bạn để nhận mã OTP.")
      return
    }
    if (!isValidEmail(email.trim())) {
      setErrorMsg("Địa chỉ email không đúng định dạng (ví dụ: customer@toto.com).")
      return
    }

    setLoading(true)
    try {
      clientLogger.info(`Requesting password reset OTP for: ${email.trim()}`)
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setSuccessMsg(data.message || "Mã xác nhận OTP (6 số) đã được gửi đến hộp thư của bạn.")
        setForgotStep(2)
        setCountdown(60)
      } else {
        setErrorMsg(data.error || "Không thể gửi mã xác nhận lúc này. Vui lòng thử lại sau.")
      }
    } catch (err: any) {
      setErrorMsg("Không thể kết nối đến máy chủ. Vui lòng thử lại sau ít phút.")
      clientLogger.error("Forgot password network error", err)
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (countdown > 0 || loading) return
    
    setLoading(true)
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setSuccessMsg(data.message || "Đã gửi lại mã OTP mới. Quý khách vui lòng kiểm tra hộp thư.")
        setCountdown(60)
      } else {
        setErrorMsg(data.error || "Không thể gửi lại mã lúc này. Vui lòng thử lại sau.")
      }
    } catch (err: any) {
      setErrorMsg("Không thể kết nối đến máy chủ. Vui lòng thử lại sau ít phút.")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setSuccessMsg("")

    // Custom Vietnamese Validation
    if (!otp.trim()) {
      setErrorMsg("Vui lòng nhập mã xác nhận OTP gồm 6 chữ số.")
      return
    }
    if (otp.trim().length !== 6) {
      setErrorMsg("Mã xác nhận OTP phải gồm đúng 6 chữ số.")
      return
    }
    if (!password) {
      setErrorMsg("Vui lòng nhập mật khẩu mới.")
      return
    }
    if (password.length < 6) {
      setErrorMsg("Mật khẩu mới phải có độ dài từ 6 ký tự trở lên.")
      return
    }
    if (!confirmPassword) {
      setErrorMsg("Vui lòng xác nhận lại mật khẩu mới.")
      return
    }
    if (password !== confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không trùng khớp. Vui lòng kiểm tra lại.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code: otp.trim(), newPassword: password }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setSuccessMsg(data.message || "Đổi mật khẩu thành công! Quý khách có thể đăng nhập ngay.")
        setTimeout(() => {
          handleTabChange("login")
          setPassword("")
        }, 2000)
      } else {
        setErrorMsg(data.error || "Mã xác nhận không chính xác hoặc đã hết hạn.")
      }
    } catch (err: any) {
      setErrorMsg("Không thể kết nối đến máy chủ. Vui lòng thử lại sau ít phút.")
    } finally {
      setLoading(false)
    }
  }

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-[420px] overflow-hidden rounded-[24px] bg-white p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] ring-1 ring-black/5 transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-neutral-400 transition-all hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200 z-10"
        >
          <X className="size-4" />
        </button>

        {user ? (
          /* User Profile Logged In View */
          <div className="flex flex-col items-center py-6 text-center animate-in slide-in-from-bottom-4 duration-500">
            <div className="mb-5 flex size-20 items-center justify-center rounded-full bg-neutral-900 text-gold-400 border border-neutral-800 ring-4 ring-neutral-100 shadow-md">
              <User className="size-9 text-neutral-200" />
            </div>
            <h3 className="font-display text-2xl font-bold tracking-tight text-neutral-900">
              {user.name}
            </h3>
            <p className="mt-1 text-sm text-neutral-500">{user.email}</p>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              <ShieldCheck className="size-3.5 text-emerald-600" /> Thành viên ToTo Barbershop
            </div>

            <div className="mt-10 w-full">
              <Button
                onClick={() => {
                  logout()
                  onClose()
                }}
                variant="outline"
                className="w-full h-12 rounded-xl border-neutral-200 text-neutral-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600 font-medium transition-colors"
              >
                <LogOut className="mr-2 size-4" /> Đăng xuất tài khoản
              </Button>
            </div>
          </div>
        ) : activeTab === "forgot" ? (
          /* Forgot Password View */
          <div className="animate-in slide-in-from-right-4 duration-300">
            <div className="mb-8 flex flex-col items-start text-left">
              <button
                type="button"
                onClick={() => handleTabChange("login")}
                className="mb-4 text-neutral-400 hover:text-neutral-900 transition-colors flex items-center text-sm font-medium"
              >
                <ArrowLeft className="mr-1 size-4" /> Quay lại đăng nhập
              </button>
              <h2 className="font-display text-3xl font-bold tracking-tight text-neutral-900">
                {forgotStep === 1 ? "Quên mật khẩu" : "Đặt lại mật khẩu"}
              </h2>
              <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
                {forgotStep === 1
                  ? "Nhập email tài khoản của bạn, ToTo Barbershop sẽ gửi mã OTP gồm 6 chữ số để xác minh."
                  : "Vui lòng kiểm tra hộp thư email và nhập mã OTP 6 số cùng mật khẩu mới của bạn."}
              </p>
            </div>

            {errorMsg && (
              <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-600 ring-1 ring-inset ring-red-600/10 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="mt-0.5 size-4 text-red-600 shrink-0" />
                <p className="leading-5 font-medium">{errorMsg}</p>
              </div>
            )}

            {successMsg && (
              <div className="mb-6 flex items-start gap-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700 ring-1 ring-inset ring-emerald-600/10 animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 className="mt-0.5 size-4 text-emerald-600 shrink-0" />
                <p className="leading-5 font-medium">{successMsg}</p>
              </div>
            )}

            {forgotStep === 1 ? (
              <form noValidate onSubmit={handleForgotPassword} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-700">Email của bạn</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-neutral-400" />
                    <Input
                      type="text"
                      placeholder="customer@toto.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (errorMsg) setErrorMsg("")
                      }}
                      className="h-12 rounded-xl bg-neutral-50/50 pl-11 text-neutral-900 border-neutral-200 focus:bg-white focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="mt-6 h-12 w-full rounded-xl bg-neutral-900 text-white font-semibold shadow hover:bg-neutral-800 transition-all"
                >
                  {loading ? <><Loader2 className="mr-2 size-4 animate-spin" /> Đang gửi mã xác nhận...</> : "Gửi mã OTP xác minh"}
                </Button>
              </form>
            ) : (
              <form noValidate onSubmit={handleResetPassword} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-700">Mã xác nhận (OTP 6 số)</label>
                  <div className="relative">
                    <CheckCircle2 className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-neutral-400" />
                    <Input
                      type="text"
                      placeholder="123456"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value)
                        if (errorMsg) setErrorMsg("")
                      }}
                      className="h-12 rounded-xl bg-neutral-50/50 pl-11 font-mono tracking-widest text-lg text-neutral-900 border-neutral-200 focus:bg-white focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all text-center"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-700">Mật khẩu mới</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-neutral-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Tối thiểu 6 ký tự"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (errorMsg) setErrorMsg("")
                      }}
                      className="h-12 rounded-xl bg-neutral-50/50 pl-11 pr-11 text-neutral-900 border-neutral-200 focus:bg-white focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-700">Xác nhận mật khẩu mới</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-neutral-400" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Nhập lại mật khẩu ở trên"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        if (errorMsg) setErrorMsg("")
                      }}
                      className="h-12 rounded-xl bg-neutral-50/50 pl-11 pr-11 text-neutral-900 border-neutral-200 focus:bg-white focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="mt-6 h-12 w-full rounded-xl bg-neutral-900 text-white font-semibold shadow hover:bg-neutral-800 transition-all"
                >
                  {loading ? <><Loader2 className="mr-2 size-4 animate-spin" /> Đang cập nhật...</> : "Cập nhật mật khẩu mới"}
                </Button>

                <div className="text-center pt-2">
                  <button 
                    type="button" 
                    disabled={countdown > 0 || loading}
                    onClick={handleResendCode}
                    className="text-sm font-medium text-neutral-600 hover:text-neutral-900 disabled:opacity-50 transition-colors"
                  >
                    {countdown > 0 ? `Gửi lại mã OTP sau ${countdown}s` : "Chưa nhận được mã? Gửi lại OTP"}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* Login / Register Tabs View */
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 text-center">
              <h2 className="font-display text-3xl font-bold tracking-tight text-neutral-900">
                ToTo Barbershop
              </h2>
              <p className="mt-2 text-sm text-neutral-500">
                {activeTab === "login" ? "Chào mừng quý khách quay trở lại" : "Đăng ký thành viên để nhận ưu đãi độc quyền"}
              </p>
            </div>

            {/* Tabs switcher */}
            <div className="mb-8 flex rounded-xl bg-neutral-100/80 p-1">
              <button
                type="button"
                onClick={() => handleTabChange("login")}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                  activeTab === "login" ? "bg-white text-neutral-900 shadow-sm ring-1 ring-black/5" : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => handleTabChange("register")}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                  activeTab === "register" ? "bg-white text-neutral-900 shadow-sm ring-1 ring-black/5" : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                Đăng ký
              </button>
            </div>

            {errorMsg && (
              <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-600 ring-1 ring-inset ring-red-600/10 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="mt-0.5 size-4 text-red-600 shrink-0" />
                <p className="leading-5 font-medium">{errorMsg}</p>
              </div>
            )}

            {successMsg && (
              <div className="mb-6 flex items-start gap-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700 ring-1 ring-inset ring-emerald-600/10 animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 className="mt-0.5 size-4 text-emerald-600 shrink-0" />
                <p className="leading-5 font-medium">{successMsg}</p>
              </div>
            )}

            {activeTab === "login" ? (
              <form noValidate onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-700">Email của bạn</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-neutral-400" />
                    <Input
                      type="text"
                      placeholder="customer@toto.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (errorMsg) setErrorMsg("")
                      }}
                      className="h-12 rounded-xl bg-neutral-50/50 pl-11 text-neutral-900 border-neutral-200 focus:bg-white focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-neutral-700">Mật khẩu</label>
                    <button
                      type="button"
                      onClick={() => handleTabChange("forgot")}
                      className="text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-neutral-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (errorMsg) setErrorMsg("")
                      }}
                      className="h-12 rounded-xl bg-neutral-50/50 pl-11 pr-11 text-neutral-900 border-neutral-200 focus:bg-white focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="mt-6 h-12 w-full rounded-xl bg-neutral-900 text-white font-semibold shadow hover:bg-neutral-800 transition-all"
                >
                  {loading ? <><Loader2 className="mr-2 size-4 animate-spin" /> Đang kiểm tra...</> : "Đăng nhập ngay"}
                </Button>
              </form>
            ) : (
              <form noValidate onSubmit={handleRegister} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-700">Họ và tên của quý khách</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-neutral-400" />
                    <Input
                      type="text"
                      placeholder="Nguyễn Văn Khách"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value)
                        if (errorMsg) setErrorMsg("")
                      }}
                      className="h-12 rounded-xl bg-neutral-50/50 pl-11 text-neutral-900 border-neutral-200 focus:bg-white focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-700">Email của bạn</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-neutral-400" />
                    <Input
                      type="text"
                      placeholder="customer@toto.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (errorMsg) setErrorMsg("")
                      }}
                      className="h-12 rounded-xl bg-neutral-50/50 pl-11 text-neutral-900 border-neutral-200 focus:bg-white focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-700">Mật khẩu</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-neutral-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Tối thiểu 6 ký tự"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (errorMsg) setErrorMsg("")
                      }}
                      className="h-12 rounded-xl bg-neutral-50/50 pl-11 pr-11 text-neutral-900 border-neutral-200 focus:bg-white focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-neutral-700">Xác nhận mật khẩu</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-neutral-400" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Nhập lại mật khẩu ở trên"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        if (errorMsg) setErrorMsg("")
                      }}
                      className="h-12 rounded-xl bg-neutral-50/50 pl-11 pr-11 text-neutral-900 border-neutral-200 focus:bg-white focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="mt-6 h-12 w-full rounded-xl bg-neutral-900 text-white font-semibold shadow hover:bg-neutral-800 transition-all"
                >
                  {loading ? <><Loader2 className="mr-2 size-4 animate-spin" /> Đang đăng ký...</> : "Đăng ký tài khoản"}
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
