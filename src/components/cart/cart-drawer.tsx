"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { useCartStore } from "@/store/cart-store"
import { useMounted } from "@/hooks/use-mounted"
import { formatCurrency } from "@/lib/format"
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"

export function CartDrawer() {
  const mounted = useMounted()
  const isOpen = useCartStore((s) => s.isOpen)
  const setOpen = useCartStore((s) => s.setOpen)
  const items = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)

  return (
    <Sheet open={mounted && isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="flex items-center gap-2 font-display uppercase tracking-tight">
            <ShoppingBag className="size-5 text-primary" />
            Giỏ hàng ({items.reduce((n, i) => n + i.quantity, 0)})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="size-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Giỏ hàng trống</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Khám phá grooming và merchandise của Toto.
              </p>
            </div>
            <Button asChild onClick={() => setOpen(false)}>
              <Link href="/shop">Mua sắm ngay</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {remaining > 0 ? (
                <div className="mb-4 rounded-sm bg-muted p-3 text-xs">
                  <p>
                    Mua thêm{" "}
                    <span className="font-semibold text-primary">{formatCurrency(remaining)}</span>{" "}
                    để được <span className="font-semibold">miễn phí vận chuyển</span>.
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
                    <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              ) : (
                <div className="mb-4 rounded-sm bg-primary/10 p-3 text-xs font-medium text-primary">
                  Bạn được miễn phí vận chuyển!
                </div>
              )}

              <ul className="flex flex-col gap-4">
                {items.map((item) => (
                  <li key={item.variantId} className="flex gap-3">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-sm border border-border bg-muted">
                      <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <Link
                        href={`/shop/${item.slug}`}
                        onClick={() => setOpen(false)}
                        className="truncate text-sm font-medium hover:text-primary"
                      >
                        {item.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">{item.variantName}</p>
                      <p className="mt-0.5 text-sm font-semibold text-primary">
                        {formatCurrency(item.price)}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-sm border border-border">
                          <button
                            className="flex size-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            aria-label="Giảm số lượng"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm tabular-nums">{item.quantity}</span>
                          <button
                            className="flex size-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            disabled={item.quantity >= item.maxStock}
                            aria-label="Tăng số lượng"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <button
                          className="text-muted-foreground transition-colors hover:text-destructive"
                          onClick={() => removeItem(item.variantId)}
                          aria-label="Xoá sản phẩm"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <SheetFooter className="border-t border-border px-5 py-4">
              <div className="flex w-full flex-col gap-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span className="font-display text-lg font-bold">{formatCurrency(subtotal)}</span>
                </div>
                <Separator />
                <Button asChild size="lg" className="h-11 w-full text-sm font-semibold uppercase tracking-wide" onClick={() => setOpen(false)}>
                  <Link href="/checkout">Thanh toán</Link>
                </Button>
                <Button variant="outline" className="h-10 w-full" onClick={() => setOpen(false)}>
                  Tiếp tục mua sắm
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
