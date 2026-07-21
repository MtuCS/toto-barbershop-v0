"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, ShoppingBag, ChevronDown, Scissors } from "lucide-react"
import { cn } from "@/lib/utils"
import { MAIN_NAV, SITE_NAME } from "@/lib/constants"
import { useCartStore } from "@/store/cart-store"
import { useMounted } from "@/hooks/use-mounted"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label={`${SITE_NAME} trang chủ`}>
      <span className="flex size-8 items-center justify-center rounded-sm bg-primary text-primary-foreground">
        <Scissors className="size-4" />
      </span>
      <span className="font-display text-xl font-bold uppercase tracking-tight">Toto</span>
    </Link>
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  const mounted = useMounted()
  const totalItems = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0))
  const openCart = useCartStore((s) => s.setOpen)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
          : "border-b border-transparent bg-background/60 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Điều hướng chính">
          {MAIN_NAV.map((link) =>
            link.children ? (
              <DropdownMenu key={link.href}>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "inline-flex items-center gap-1 rounded-sm px-3 py-2 text-sm font-medium uppercase tracking-wide transition-colors hover:text-primary",
                      isActive(link.href) ? "text-primary" : "text-foreground",
                    )}
                  >
                    {link.label}
                    <ChevronDown className="size-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                  {link.children.map((child) => (
                    <DropdownMenuItem key={child.label} asChild>
                      <Link href={child.href} className="flex flex-col items-start gap-0.5">
                        <span className="font-medium">{child.label}</span>
                        {child.description ? (
                          <span className="text-xs text-muted-foreground">{child.description}</span>
                        ) : null}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-sm px-3 py-2 text-sm font-medium uppercase tracking-wide transition-colors hover:text-primary",
                  link.highlight && "text-primary",
                  isActive(link.href) && !link.highlight && "text-primary",
                )}
              >
                <span className="relative">
                  {link.label}
                  {link.highlight ? (
                    <span className="absolute -right-2 -top-2 size-1.5 rounded-full bg-primary" />
                  ) : null}
                </span>
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Giỏ hàng"
            onClick={() => openCart(true)}
          >
            <ShoppingBag className="size-5" />
            {mounted && totalItems > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {totalItems}
              </span>
            ) : null}
          </Button>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Mở menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm">
              <SheetHeader>
                <SheetTitle className="font-display uppercase tracking-tight">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col px-2 pb-6" aria-label="Điều hướng di động">
                {MAIN_NAV.map((link) => (
                  <div key={link.href} className="border-b border-border">
                    <SheetClose asChild>
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center justify-between px-2 py-3.5 font-display text-lg uppercase tracking-tight",
                          link.highlight ? "text-primary" : "text-foreground",
                        )}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                    {link.children ? (
                      <div className="pb-2 pl-4">
                        {link.children.map((child) => (
                          <SheetClose asChild key={child.label}>
                            <Link
                              href={child.href}
                              className="block py-2 text-sm text-muted-foreground"
                            >
                              {child.label}
                            </Link>
                          </SheetClose>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
