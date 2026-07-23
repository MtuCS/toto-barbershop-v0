"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useDataStore } from "@/store/data-store";
import { Button } from "@/components/ui/button";
export function TrainingForm() {
  const add = useDataStore((s) => s.addLead);
  const [loading, setLoading] = useState(false);
  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        setLoading(true);
        const f = new FormData(e.currentTarget);
        add({
          name: String(f.get("name")),
          phone: String(f.get("phone")),
          email: String(f.get("email")),
          courseId: String(f.get("course")) || null,
          message: String(f.get("message")),
        });
        setTimeout(() => {
          setLoading(false);
          toast.success("Đã gửi đăng ký tư vấn");
          (e.target as HTMLFormElement).reset();
        }, 300);
      }}
    >
      <input
        required
        name="name"
        placeholder="Họ và tên"
        className="border bg-transparent px-4 py-3"
      />
      <input
        required
        name="phone"
        pattern="[0-9 +]{9,15}"
        placeholder="Số điện thoại"
        className="border bg-transparent px-4 py-3"
      />
      <input
        required
        type="email"
        name="email"
        placeholder="Email"
        className="border bg-transparent px-4 py-3"
      />
      {/* <select name="course" className="border bg-background px-4 py-3">
        <option value="t-foundation">Barber Foundation</option>
        <option value="t-pro">Advanced Fade & Styling</option>
      </select> */}

      <select
        name="course"
        defaultValue=""
        className="w-full border border-white/70 bg-transparent px-4 py-3 text-white outline-none transition-colors focus:border-emerald-400"
      >
        <option value="" disabled className="bg-neutral-950 text-white">
          Chọn khóa học
        </option>

        <option value="t-foundation" className="bg-neutral-950 text-white">
          Barber Foundation
        </option>

        <option value="t-pro" className="bg-neutral-950 text-white">
          Advanced Fade & Styling
        </option>
      </select>

      <textarea
        name="message"
        placeholder="Bạn muốn được tư vấn điều gì?"
        className="min-h-32 border bg-transparent px-4 py-3 md:col-span-2"
      />
      <Button disabled={loading} className="h-12 md:col-span-2">
        {loading ? "Đang gửi..." : "Đăng ký tư vấn"}
      </Button>
    </form>
  );
}
