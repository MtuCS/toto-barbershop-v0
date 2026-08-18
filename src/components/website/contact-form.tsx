"use client";

import { useState } from "react";
import { toast } from "sonner";

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Gửi thất bại");

      toast.success("Cảm ơn bạn! Lời nhắn đã được gửi đi thành công.");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 bg-[#f5f9f7] p-6 text-[#101715] md:col-span-7 md:p-10">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">Lời nhắn</p>
        <h2 className="mt-3 font-display text-4xl font-bold uppercase leading-none md:text-5xl">Chúng tôi lắng nghe</h2>
      </div>
      <label className="mt-4 grid gap-2 text-xs font-semibold uppercase tracking-[0.12em]">
        Họ và tên
        <input required name="name" disabled={isLoading} className="min-h-12 border border-black/20 bg-white px-4 text-base font-normal normal-case tracking-normal outline-none focus:border-primary disabled:opacity-50" />
      </label>
      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.12em]">
        Email
        <input required name="email" type="email" disabled={isLoading} className="min-h-12 border border-black/20 bg-white px-4 text-base font-normal normal-case tracking-normal outline-none focus:border-primary disabled:opacity-50" />
      </label>
      <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.12em]">
        Lời nhắn
        <textarea required name="message" disabled={isLoading} className="min-h-40 border border-black/20 bg-white px-4 py-3 text-base font-normal normal-case tracking-normal outline-none focus:border-primary disabled:opacity-50" />
      </label>
      <button disabled={isLoading} className="min-h-12 bg-primary px-6 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#2f7a68] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed">
        {isLoading ? "Đang gửi..." : "Gửi lời nhắn"}
      </button>
    </form>
  );
}
