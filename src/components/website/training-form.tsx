"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useDataStore } from "@/store/data-store"
import { Button } from "@/components/ui/button"

const fieldClassName = "min-h-12 border border-black/20 bg-white px-4 text-[#101715] outline-none transition-colors placeholder:text-neutral-500 focus:border-primary"

export function TrainingForm() {
  const add = useDataStore((state) => state.addLead)
  const [loading, setLoading] = useState(false)

  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault()
        setLoading(true)
        const form = new FormData(event.currentTarget)
        add({
          name: String(form.get("name")),
          phone: String(form.get("phone")),
          email: String(form.get("email")),
          courseId: String(form.get("course")) || null,
          message: String(form.get("message")),
        })
        setTimeout(() => {
          setLoading(false)
          toast.success("Đã gửi đăng ký tư vấn")
          ;(event.target as HTMLFormElement).reset()
        }, 300)
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
      <Button disabled={loading} className="h-12 md:col-span-2">
        {loading ? "Đang gửi..." : "Đăng ký tư vấn"}
      </Button>
    </form>
  )
}
