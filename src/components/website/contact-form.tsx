"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { isValidEmail, isValidPhone } from "@/lib/validation";

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name) {
      toast.error("Vui lòng nhập họ và tên của bạn.");
      return;
    }
    if (!email) {
      toast.error("Vui lòng nhập địa chỉ email của bạn.");
      return;
    }
    if (!isValidEmail(email)) {
      toast.error("Địa chỉ email không đúng định dạng. Vui lòng kiểm tra lại.");
      return;
    }
    if (phone && !isValidPhone(phone)) {
      toast.error("Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 số.");
      return;
    }
    if (!message) {
      toast.error("Vui lòng nhập nội dung lời nhắn của bạn.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          subject: formData.get("subject") || undefined,
          message,
        }),
      });

      if (!res.ok) throw new Error("Gửi thất bại");

      toast.success("Cảm ơn bạn! Lời nhắn đã được gửi đến ToTo Barbershop thành công.");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau ít phút.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="grid gap-4 bg-[#f5f9f7] p-6 text-[#101715] md:col-span-7 md:p-10">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">Lời nhắn</p>
        <h2 className="mt-3 font-display text-4xl font-bold uppercase leading-none md:text-5xl">Chúng tôi lắng nghe</h2>
      </div>
      <label className="mt-4 grid gap-2 text-xs font-semibold uppercase tracking-[0.12em]">
        Họ và tên*
        <input name="name" disabled={isLoading} placeholder="Nguyễn Văn A" className="min-h-12 border border-black/20 bg-white px-4 text-base font-normal normal-case tracking-normal outline-none focus:border-primary disabled:opacity-50" />
      </label>
      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.12em]">
        Email*
        <input name="email" disabled={isLoading} placeholder="you@example.com" className="min-h-12 border border-black/20 bg-white px-4 text-base font-normal normal-case tracking-normal outline-none focus:border-primary disabled:opacity-50" />
      </label>
      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.12em]">
        Số điện thoại (tùy chọn)
        <input name="phone" disabled={isLoading} placeholder="09xxxxxxxx" className="min-h-12 border border-black/20 bg-white px-4 text-base font-normal normal-case tracking-normal outline-none focus:border-primary disabled:opacity-50" />
      </label>
      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.12em]">
        Lời nhắn*
        <textarea name="message" disabled={isLoading} placeholder="Nội dung lời nhắn, góp ý hoặc thắc mắc của bạn..." className="min-h-40 border border-black/20 bg-white px-4 py-3 text-base font-normal normal-case tracking-normal outline-none focus:border-primary disabled:opacity-50" />
      </label>
      <button disabled={isLoading} className="min-h-12 bg-primary px-6 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#2f7a68] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
        {isLoading ? <><Loader2 className="size-4 animate-spin" /> Đang gửi...</> : "Gửi lời nhắn"}
      </button>
    </form>
  );
}
