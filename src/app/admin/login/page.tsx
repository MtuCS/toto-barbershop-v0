"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { useAuthStore, DEMO_CREDENTIALS } from "@/store/auth-store"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

export default function Page() {
  const router = useRouter()
  const login = useAuthStore(s => s.login)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="grid min-h-screen place-items-center bg-neutral-950 px-5 text-white">
      <form className="w-full max-w-md border border-white/15 p-8" onSubmit={async event => {
        event.preventDefault()
        setBusy(true)
        setError("")
        const form = new FormData(event.currentTarget)
        const result = await login(String(form.get("email")).trim(), String(form.get("password")).trim())
        if (result.ok) {
          toast.success("Đăng nhập thành công")
          router.replace("/admin/dashboard")
          router.refresh()
        } else {
          setError(result.error ?? "Đăng nhập thất bại")
          setBusy(false)
        }
      }}>
        <p className="text-xs uppercase tracking-[.25em] text-emerald-300">TOTO / Admin</p>
        <h1 className="mt-3 font-display text-5xl font-bold uppercase">Đăng nhập</h1>
        <p className="mt-3 text-sm text-white/50">Hệ thống quản trị ToTo Barbershop.</p>
        <div className="mt-7 space-y-4">
          <label className="block text-xs uppercase tracking-wider text-white/50">Email
            <input name="email" type="email" required autoComplete="username" defaultValue={DEMO_CREDENTIALS.email} className="mt-2 w-full border border-white/20 bg-transparent px-4 py-3 text-white outline-none focus:border-[#287565]" />
          </label>
          <div className="block text-xs uppercase tracking-wider text-white/50">Mật khẩu
            <div className="relative mt-2">
              <input name="password" type={showPassword ? "text" : "password"} required autoComplete="current-password" defaultValue={DEMO_CREDENTIALS.password} className="w-full border border-white/20 bg-transparent px-4 py-3 pr-10 text-white outline-none focus:border-[#287565]" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-white/80">
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
        </div>
        {error && <p role="alert" className="mt-3 text-sm text-red-400">{error}</p>}
        <Button type="submit" disabled={busy} className="mt-6 h-12 w-full">{busy ? "Đang xử lý..." : "Vào trang quản trị"}</Button>
      </form>
    </div>
  )
}
