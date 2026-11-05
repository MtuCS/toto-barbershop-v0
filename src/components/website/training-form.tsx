"use client"

import { useState } from "react"
import { toast } from "sonner"
import { isValidPhone } from "@/lib/validation"
import { Loader2, ArrowUpRight, User, Phone, CheckCircle2 } from "lucide-react"

export function TrainingForm() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({})

  return (
    <form
      noValidate
      className="space-y-5"
      onSubmit={async (event) => {
        event.preventDefault()
        const formEl = event.currentTarget
        const form = new FormData(formEl)
        const name = String(form.get("name") || "").trim()
        const phone = String(form.get("phone") || "").trim()

        const nextErrors: { name?: string; phone?: string } = {}
        if (!name) {
          nextErrors.name = "Vui lòng nhập họ và tên của bạn."
        }
        if (!phone) {
          nextErrors.phone = "Vui lòng nhập số điện thoại liên hệ."
        } else if (!isValidPhone(phone)) {
          nextErrors.phone = "Số điện thoại cần đủ 10 chữ số hợp lệ."
        }

        if (nextErrors.name || nextErrors.phone) {
          setErrors(nextErrors)
          return
        }

        setErrors({})
        setLoading(true)
        try {
          const cleanPhone = phone.replace(/\s+/g, "")
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/messages`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name,
                phone: cleanPhone,
                email: `${cleanPhone}@hocvien.totobarbershop.vn`,
                subject: "Đăng ký tư vấn học nghề Barber",
                message: `Học viên ${name} (${cleanPhone}) đăng ký nhận tư vấn trực tiếp tại 85 Đồng Đen từ trang Đào tạo.`,
              }),
            }
          )

          if (!res.ok) throw new Error("Gửi thông tin đăng ký thất bại.")

          setSubmitted(true)
          toast.success(
            "Đã gửi thông tin. Anh em ToTo sẽ liên hệ lại với bạn sớm nhất."
          )
          formEl.reset()
          setTimeout(() => setSubmitted(false), 5000)
        } catch (error: any) {
          toast.error(
            error.message || "Chưa gửi được thông tin. Vui lòng thử lại sau ít phút."
          )
        } finally {
          setLoading(false)
        }
      }}
    >
      {/* Trường 1: Họ tên */}
      <div className="grid gap-2 text-left">
        <label
          htmlFor="training-name"
          className="text-sm font-medium text-[#e4ece9]"
        >
          Họ tên
        </label>
        <div className="group/input relative">
          <User
            strokeWidth={1.5}
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/45 transition-colors duration-300 group-focus-within/input:text-[#d4a84b]"
          />
          <input
            id="training-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Ví dụ: Nguyễn Minh Tuấn"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "training-name-error" : undefined}
            onChange={() => {
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
            }}
            className="h-12 w-full rounded-xl border border-white/15 bg-[#081512]/90 pl-11 pr-4 text-sm font-medium text-[#f2f5f3] outline-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] placeholder:text-white/40 hover:border-white/30 focus:border-[#d4a84b] focus:ring-3 focus:ring-[#d4a84b]/20"
          />
        </div>
        {errors.name && (
          <p id="training-name-error" className="text-xs font-medium text-[#ff8a80]">
            {errors.name}
          </p>
        )}
      </div>

      {/* Trường 2: Số điện thoại */}
      <div className="grid gap-2 text-left">
        <label
          htmlFor="training-phone"
          className="text-sm font-medium text-[#e4ece9]"
        >
          Số điện thoại
        </label>
        <div className="group/input relative">
          <Phone
            strokeWidth={1.5}
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/45 transition-colors duration-300 group-focus-within/input:text-[#d4a84b]"
          />
          <input
            id="training-phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="Ví dụ: 0918 437 797"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "training-phone-error" : undefined}
            onChange={() => {
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }))
            }}
            className="h-12 w-full rounded-xl border border-white/15 bg-[#081512]/90 pl-11 pr-4 font-mono text-sm font-medium text-[#f2f5f3] outline-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] placeholder:font-sans placeholder:text-white/40 hover:border-white/30 focus:border-[#d4a84b] focus:ring-3 focus:ring-[#d4a84b]/20"
          />
        </div>
        {errors.phone && (
          <p id="training-phone-error" className="text-xs font-medium text-[#ff8a80]">
            {errors.phone}
          </p>
        )}
      </div>

      {/* Nút [Gửi thông tin] — Kết thúc gọn gàng, không có thông tin thừa bên dưới */}
      {/* Nút [Gửi thông tin] — Căn giữa text, icon neo bên phải */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="group relative flex h-13 w-full items-center justify-center rounded-xl bg-[#68a494] px-4 text-sm font-bold text-[#0b1916] shadow-[0_14px_32px_-8px_rgba(212,168,75,0.4)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#e2b85c] hover:shadow-[0_18px_38px_-6px_rgba(212,168,75,0.55)] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60 cursor-pointer sm:text-base"
        >
          <span className="flex items-center gap-2 whitespace-nowrap">
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Đang gửi thông tin...
              </>
            ) : submitted ? (
              <>
                <CheckCircle2 className="size-4" />
                Đã gửi thông tin
              </>
            ) : (
              "Gửi thông tin"
            )}
          </span>

          <span className="absolute right-2 flex size-9 items-center justify-center rounded-lg bg-[#0b1916]/15 text-current transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowUpRight strokeWidth={2} className="size-4" />
          </span>
        </button>
      </div>
    </form>
  )
}
