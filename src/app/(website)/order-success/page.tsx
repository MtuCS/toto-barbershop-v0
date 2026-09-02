import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ShoppingBag, Package, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Đặt Hàng Thành Công",
  description: "Cảm ơn bạn đã đặt hàng sáp vuốt tóc và sản phẩm tại ToTo Barbershop. Đơn hàng của bạn đang được đóng gói và giao hoả tốc.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  return (
    <main className="mx-auto flex min-h-[75vh] max-w-xl flex-col items-center justify-center px-5 py-16 text-center">
      <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-500/10 animate-in zoom-in-50 duration-500">
        <CheckCircle2 className="size-10 text-primary" />
      </div>

      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
        Đặt hàng thành công
      </p>

      <h1 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight md:text-5xl">
        Cảm ơn bạn
      </h1>

      <p className="mt-4 text-sm md:text-base text-neutral-600 leading-relaxed max-w-md">
        {code ? (
          <>
            Mã đơn hàng:{" "}
            <b className="font-mono text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded-md border border-neutral-200">
              {code}
            </b>
            . Chúng tôi sẽ nhanh chóng chuẩn bị và giao hàng đến bạn.
          </>
        ) : (
          "Chúng tôi sẽ nhanh chóng chuẩn bị và giao hàng đến bạn trong thời gian sớm nhất."
        )}
      </p>

      {/* Lưu ý thời gian thanh toán */}
      <div className="mt-6 rounded-xl bg-neutral-50 p-4 border border-neutral-200/80 text-xs text-neutral-500 max-w-md text-left flex items-start gap-2.5">
        <Sparkles className="size-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-neutral-800">Lưu ý thanh toán:</span> Với đơn hàng chuyển khoản qua PayOS, đơn sẽ được giữ chỗ trong <strong>15 phút</strong>. Bạn có thể xem trạng thái và thanh toán lại trong mục Đơn hàng.
        </div>
      </div>

      {/* Hành động điều hướng */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md">
        <Button
          asChild
          variant="outline"
          className="h-12 w-full sm:w-1/2 rounded-xl border-neutral-300 hover:bg-neutral-100 text-neutral-800 font-semibold transition-all"
        >
          <Link href="/shop" className="flex items-center justify-center gap-2">
            <ShoppingBag className="size-4" />
            Tiếp tục mua sắm
          </Link>
        </Button>

        <Button
          asChild
          className="h-12 w-full sm:w-1/2 rounded-xl bg-primary hover:bg-[#2f7a68] text-white font-semibold shadow-md hover:shadow-lg transition-all"
        >
          <Link
            href="/profile?tab=orders"
            className="flex items-center justify-center gap-2"
          >
            <Package className="size-4" />
            Xem đơn hàng của bạn
          </Link>
        </Button>
      </div>
    </main>
  );
}
