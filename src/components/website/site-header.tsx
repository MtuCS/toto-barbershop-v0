"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"
import { MAIN_NAV, SITE_NAME } from "@/lib/constants"
import { useCartStore } from "@/store/cart-store"
import { useMounted } from "@/hooks/use-mounted"
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

function Logo() {
  return (
    <Link
      href="/"
      className="group inline-flex items-end py-2 text-foreground"
      aria-label={`${SITE_NAME}, trang chủ`}
    >
      <span className="font-display text-[1.7rem] font-black leading-none tracking-[-0.075em] transition-transform duration-300 group-hover:-translate-y-px">
        ToTo
      </span>
      <span className="relative ml-3 pb-0.5 text-[0.98rem] font-black leading-none tracking-[0.2em] text-primary">
        BARBERSHOP
        <span
          className="absolute -bottom-1 left-0 h-0.5 w-full origin-left bg-primary transition-transform duration-300 group-hover:scale-x-50"
          aria-hidden="true"
        />
      </span>
    </Link>
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  const mounted = useMounted()
  const totalItems = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  )
  const openCart = useCartStore((state) => state.openCart)
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-white/95 text-foreground backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-5 md:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Điều hướng chính">
          {MAIN_NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative px-3 py-2 text-sm font-semibold uppercase tracking-[0.06em] text-foreground/65 transition-colors hover:text-foreground",
                isActive(link.href) && "text-primary",
                link.highlight && "text-primary",
              )}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-primary" aria-hidden="true" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-none hover:bg-primary/8 hover:text-primary active:scale-[0.98]"
            aria-label="Giỏ hàng"
            onClick={openCart}
          >
            <ShoppingBag className="size-5" />
            {mounted && totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center bg-primary text-[10px] font-semibold text-primary-foreground">
                {totalItems}
              </span>
            )}
          </Button>

          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-none hover:bg-primary/8 hover:text-primary lg:hidden"
                  aria-label="Mở menu"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm">
              <SheetHeader>
                <SheetTitle className="font-display uppercase">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col px-2 pb-6" aria-label="Điều hướng di động">
                {MAIN_NAV.map((link) => (
                  <SheetClose
                    key={link.href}
                    render={
                      <Link
                        href={link.href}
                        className={cn(
                          "border-b px-2 py-4 font-display text-xl uppercase",
                          (isActive(link.href) || link.highlight) && "text-primary",
                        )}
                      />
                    }
                  >
                    {link.label}
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
