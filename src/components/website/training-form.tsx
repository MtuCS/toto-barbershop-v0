"use client"

import { useState } from "react"
import { toast } from "sonner"
import { isValidEmail, isValidPhone } from "@/lib/validation"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

const fieldClassName = "min-h-12 border border-black/20 bg-white px-4 text-[#101715] outline-none transition-colors placeholder:text-neutral-500 focus:border-primary"

export function TrainingForm() {
  const [loading, setLoading] = useState(false)

  return (
    <form
      noValidate
      className="grid gap-4 md:grid-cols-2"
      onSubmit={async (event) => {
        event.preventDefault()
        const form = new FormData(event.currentTarget)
        const name = String(form.get("name") || "").trim()
        const phone = String(form.get("phone") || "").trim()
        const email = String(form.get("email") || "").trim()
        const courseId = String(form.get("course") || "").trim()
        const userMsg = String(form.get("message") || "").trim()

        if (!name) {
          toast.error("Vui lòng nhập họ và tên của bạn.")
          return
        }
        if (!phone) {
          toast.error("Vui lòng nhập số điện thoại để nhận tư vấn.")
          return
        }
        if (!isValidPhone(phone)) {
          toast.error("Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 số.")
          return
        }
        if (!email) {
          toast.error("Vui lòng nhập địa chỉ email của bạn.")
          return
        }
        if (!isValidEmail(email)) {
          toast.error("Địa chỉ email không đúng định dạng. Vui lòng kiểm tra lại.")
          return
        }

        setLoading(true)
        try {
          const courseName = courseId === "t-foundation" ? "Barber Foundation" : courseId === "t-pro" ? "Advanced Fade & Styling" : courseId || "Chưa chọn";
          const subject = courseId ? `Đăng ký khóa học: ${courseName}` : "Đăng ký tư vấn khóa học";

          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name,
              email,
              phone,
              subject,
              message: userMsg || "Đăng ký tư vấn khóa đào tạo",
            })
          });

          if (!res.ok) throw new Error("Gửi thông tin đăng ký thất bại");

          toast.success("Cảm ơn bạn! Đã gửi thông tin đăng ký tư vấn khóa học thành công.")
          ;(event.target as HTMLFormElement).reset()
        } catch (error: any) {
          toast.error(error.message || "Đăng ký thất bại. Vui lòng thử lại sau ít phút.")
        } finally {
          setLoading(false)
        }
      }}
    >
      <input name="name" placeholder="Họ và tên*" className={fieldClassName} />
      <input name="phone" placeholder="Số điện thoại*" className={fieldClassName} />
      <input name="email" placeholder="Email*" className={fieldClassName} />
      <select name="course" defaultValue="" className={fieldClassName}>
        <option value="" disabled>Chọn khóa học mong muốn</option>
        <option value="t-foundation">Barber Foundation (Cơ bản)</option>
        <option value="t-pro">Advanced Fade &amp; Styling (Nâng cao)</option>
      </select>
      <textarea name="message" placeholder="Bạn muốn được tư vấn thêm về nội dung gì? (Học phí, lịch học, dụng cụ...)" className={`${fieldClassName} min-h-32 py-3 md:col-span-2`} />
      <Button type="submit" disabled={loading} className="h-12 md:col-span-2 flex items-center justify-center gap-2">
        {loading ? <><Loader2 className="size-4 animate-spin" /> Đang gửi đăng ký...</> : "Đăng ký tư vấn ngay"}
      </Button>
    </form>
  )
}
