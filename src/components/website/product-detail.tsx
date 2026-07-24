"use client"
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "@/types";
import { formatCurrency } from "@/lib/format";
import { useCartStore } from "@/store/cart-store";
import { useCustomerUserStore } from "@/store/customer-user-store";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button"

export function ProductDetail({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(
    product.variants.find((v) => v.stock > 0)?.id ?? product.variants[0].id
  );
  const variant = product.variants.find((v) => v.id === variantId)!;
  const add = useCartStore((s) => s.addItem);
  const { user, setAuthModalOpen } = useCustomerUserStore();

  const handleAdd = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    add({
      variantId: variant.id,
      productId: product.id,
      slug: product.slug,
      title: product.title,
      variantName: variant.name,
      image: product.images[0],
      price: variant.price,
      maxStock: variant.stock,
    });
    toast.success("Đã thêm vào giỏ");
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12">
      <Link href="/shop" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="size-4" /> Quay lại cửa hàng
      </Link>
      <div className="grid gap-10 md:grid-cols-2">
        <div className="grid gap-3 sm:grid-cols-2">
        {product.images.map((src, i) => (
          <div
            key={src}
            className={`relative aspect-square overflow-hidden bg-muted ${
              i === 0 ? "sm:col-span-2" : ""
            }`}
          >
            <Image
              src={src}
              alt={`${product.title} ${i + 1}`}
              fill
              priority={i === 0}
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <div className="md:sticky md:top-24 md:self-start">
        <p className="text-xs font-bold uppercase tracking-[.25em] text-primary">
          {product.collection}
        </p>
        <h1 className="mt-3 font-display text-5xl font-bold uppercase leading-none">
          {product.title}
        </h1>
        <p className="mt-5 text-2xl font-bold">{formatCurrency(variant.price)}</p>
        <p className="mt-6 leading-7 text-muted-foreground">
          {product.description}
        </p>
        <div className="mt-8">
          <p className="mb-3 text-sm font-semibold">Chọn phiên bản</p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                disabled={!v.stock}
                onClick={() => setVariantId(v.id)}
                className={`border px-4 py-3 text-sm ${
                  variantId === v.id ? "border-primary bg-primary text-white" : ""
                } disabled:opacity-35`}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>
        <Button
          size="lg"
          className="mt-7 h-14 w-full uppercase"
          disabled={!variant.stock}
          onClick={handleAdd}
        >
          Thêm vào giỏ — {formatCurrency(variant.price)}
        </Button>
        <div className="mt-8 grid grid-cols-3 border-y py-5 text-center text-xs uppercase tracking-wide">
          <span>Giao toàn quốc</span>
          <span>Đổi trong 7 ngày</span>
          <span>Hỗ trợ tận tâm</span>
        </div>
        </div>
      </div>
    </div>
  );
}
