"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { useAuthStore, DEMO_CREDENTIALS } from "@/store/auth-store"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Loader2, Shield } from "lucide-react"
import { isValidEmail } from "@/lib/validation"

export default function Page() {
  const router = useRouter()
  const login = useAuthStore(s => s.login)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="grid min-h-screen place-items-center bg-neutral-950 px-5 text-white">
      <form noValidate className="w-full max-w-md border border-white/15 p-8 rounded-2xl bg-neutral-900/60 backdrop-blur-sm" onSubmit={async event => {
        event.preventDefault()
        setError("")

        const form = new FormData(event.currentTarget)
        const email = String(form.get("email") || "").trim()
        const password = String(form.get("password") || "").trim()

        if (!email) {
          setError("Vui lòng nhập địa chỉ email quản trị viên.")
          return
        }
        if (!isValidEmail(email)) {
          setError("Địa chỉ email không đúng định dạng.")
          return
        }
        if (!password) {
          setError("Vui lòng nhập mật khẩu quản trị.")
          return
        }

        setBusy(true)
        try {
          const result = await login(email, password)
          if (result.ok) {
            toast.success("Đăng nhập trang quản trị thành công!")
            router.replace("/admin/dashboard")
            router.refresh()
          } else {
            setError(result.error ?? "Email hoặc mật khẩu quản trị không chính xác.")
            setBusy(false)
          }
        } catch {
          setError("Không thể kết nối đến máy chủ xác thực. Vui lòng thử lại sau.")
          setBusy(false)
        }
      }}>
        <div className="flex items-center gap-2">
          <Shield className="size-4 text-emerald-400" />
          <p className="text-xs uppercase tracking-[.25em] text-emerald-400 font-semibold">TOTO / Quản Trị Hệ Thống</p>
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold uppercase">Đăng nhập</h1>
        <p className="mt-2 text-sm text-white/50">Hệ thống quản trị và kiểm soát ToTo Barbershop.</p>
        <div className="mt-7 space-y-4">
          <label className="block text-xs uppercase tracking-wider text-white/60">Email Quản Trị
            <input name="email" type="text" autoComplete="username" defaultValue={DEMO_CREDENTIALS.email} placeholder="admin@toto.com" className="mt-2 w-full border border-white/20 bg-neutral-800/50 px-4 py-3 text-white rounded-xl outline-none focus:border-[#287565] transition-colors" />
          </label>
          <div className="block text-xs uppercase tracking-wider text-white/60">Mật khẩu
            <div className="relative mt-2">
              <input name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" defaultValue={DEMO_CREDENTIALS.password} placeholder="••••••••" className="w-full border border-white/20 bg-neutral-800/50 px-4 py-3 pr-10 text-white rounded-xl outline-none focus:border-[#287565] transition-colors" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-white/80">
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
        </div>
        {error && (
          <div className="mt-4 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
            {error}
          </div>
        )}
        <Button type="submit" disabled={busy} className="mt-6 h-12 w-full rounded-xl bg-primary hover:bg-[#2f7a68] text-white font-semibold">
          {busy ? <><Loader2 className="mr-2 size-4 animate-spin" /> Đang kiểm tra...</> : "Vào trang quản trị"}
        </Button>
      </form>
    </div>
  )
}
