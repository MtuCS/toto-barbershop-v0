"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

const fieldClassName = "min-h-12 border border-black/20 bg-white px-4 text-[#101715] outline-none transition-colors placeholder:text-neutral-500 focus:border-primary"

export function TrainingForm() {
  const [loading, setLoading] = useState(false)

  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      onSubmit={async (event) => {
        event.preventDefault()
        setLoading(true)
        const form = new FormData(event.currentTarget)
        try {
          const courseId = String(form.get("course")) || "Không xác định";
          const courseName = courseId === "t-foundation" ? "Barber Foundation" : courseId === "t-pro" ? "Advanced Fade & Styling" : courseId;
          const phone = String(form.get("phone"));
          const userMsg = String(form.get("message") || "Không có");
          const subject = courseName !== "Không xác định" ? `Đăng ký khóa học: ${courseName}` : undefined;

          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: String(form.get("name")),
              email: String(form.get("email")),
              phone,
              subject,
              message: userMsg
            })
          });

          if (!res.ok) throw new Error("Gửi form thất bại");

          toast.success("Đã gửi đăng ký tư vấn")
          ;(event.target as HTMLFormElement).reset()
        } catch (error: any) {
          toast.error(error.message || "Đăng ký thất bại. Vui lòng thử lại sau.")
        } finally {
          setLoading(false)
        }
      }}
    >
      <input required name="name" placeholder="Họ và tên" className={fieldClassName} />
      <input required name="phone" pattern="[0-9 +]{9,15}" placeholder="Số điện thoại" className={fieldClassName} />
      <input required type="email" name="email" placeholder="Email" className={fieldClassName} />
      <select name="course" defaultValue="" className={fieldClassName}>
        <option value="" disabled>Chọn khóa học</option>
        <option value="t-foundation">Barber Foundation</option>
        <option value="t-pro">Advanced Fade &amp; Styling</option>
      </select>
      <textarea name="message" placeholder="Bạn muốn được tư vấn điều gì?" className={`${fieldClassName} min-h-32 py-3 md:col-span-2`} />
      <Button type="submit" disabled={loading} className="h-12 md:col-span-2">
        {loading ? "Đang gửi..." : "Đăng ký tư vấn"}
      </Button>
    </form>
  )
}
