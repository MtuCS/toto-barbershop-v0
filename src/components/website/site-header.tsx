"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, ShoppingBag, User, LogIn, LogOut, Dices, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { MAIN_NAV, SITE_NAME } from "@/lib/constants"
import { GooeyNav } from "@/components/website/gooey-nav"
import { useCartStore } from "@/store/cart-store"
import { useCustomerUserStore } from "@/store/customer-user-store"
import { useMounted } from "@/hooks/use-mounted"
import { Button, buttonVariants } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup } from "@/components/ui/dropdown-menu"
import { CustomerAuthModal } from "@/components/website/customer-auth-modal"

function Logo() {
  const pathname = usePathname()

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <Link
      href="/"
      onClick={handleLogoClick}
      className="group inline-flex shrink-0 items-baseline py-2 text-foreground cursor-pointer"
      aria-label={`${SITE_NAME}, trang chủ`}
    >
      <span className="font-akira text-[1.4rem] font-bold leading-none tracking-normal transition-transform duration-300 group-hover:-translate-y-px max-[374px]:text-[1.2rem]">
        ToTo
      </span>
      <span className="font-akira relative ml-3 pb-0.5 text-[0.98rem] font-black leading-none tracking-[0.2em] text-primary max-[374px]:ml-2 max-[374px]:text-[0.78rem]">
        BARBERSHOP
        <span
          className="absolute -bottom-1 left-0 h-0.5 w-full origin-left bg-primary transition-transform duration-300 group-hover:scale-x-50"
          aria-hidden="true"
        />
      </span>
    </Link>
  )
}

const HEADER_NAV = MAIN_NAV.filter((link) => link.showInHeader !== false)

const MOBILE_NAV_LIST = [
  { label: "Service", href: "/services" },
  { label: "Shop", href: "/shop" },
  { label: "TOTO Merchandise", href: "/merchandise" },
  { label: "Training", href: "/training" },
  { label: "Contact", href: "/contact" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const mounted = useMounted()
  const [sheetOpen, setSheetOpen] = useState(false)

  // Stores
  const { user, isAuthModalOpen: authOpen, setAuthModalOpen: setAuthOpen, logout } = useCustomerUserStore()
  const totalItems = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  )
  const openCart = useCartStore((state) => state.openCart)

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <header className="site-glass-header fixed inset-x-0 top-0 z-50 border-b border-white/60 text-foreground backdrop-blur-xl backdrop-saturate-150 shadow-[0_10px_40px_rgba(7,17,15,0.14),inset_0_1px_0_rgba(255,255,255,0.82)]">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-2 px-4 sm:gap-4 sm:px-5 md:gap-3 md:px-6 xl:gap-4">
        <Logo />

        <div className="hidden shrink-0 md:block">
          <GooeyNav items={HEADER_NAV} />
        </div>

        {/* Right Section: Desktop Icons (hidden on mobile) + Mobile Menu (hidden on desktop) */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* User Auth Icon Button (Desktop Only) */}
          {mounted && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hidden md:inline-flex cursor-pointer rounded-full transition-all duration-200 hover:bg-neutral-100 hover:text-primary hover:scale-110 active:scale-95"
                    aria-label={`Tài khoản (${user.name})`}
                  />
                }
              >
                <User className="size-5" />
                <span className="absolute right-0 top-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white" title="Đã đăng nhập" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 font-display">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer">
                    <User className="size-4 mr-2" /> Hồ sơ cá nhân
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/profile?tab=orders")} className="cursor-pointer">
                    <ShoppingBag className="size-4 mr-2" /> Đơn hàng
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { logout(); router.push("/"); }} className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50">
                  <LogOut className="size-4 mr-2" /> Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="relative hidden md:inline-flex cursor-pointer rounded-full transition-all duration-200 hover:bg-neutral-100 hover:text-primary hover:scale-110 active:scale-95"
              aria-label="Đăng nhập / Đăng ký"
              onClick={() => setAuthOpen(true)}
              title="Đăng nhập / Đăng ký"
            >
              <User className="size-5" />
            </Button>
          )}

          {/* Lucky Wheel Icon (Desktop Only) */}
          <Link href="/lucky-wheel" passHref className="hidden md:inline-flex">
            <Button
              variant="ghost"
              size="icon"
              className="relative cursor-pointer rounded-full transition-all duration-200 hover:bg-neutral-100 hover:text-primary hover:scale-110 active:scale-95"
              aria-label="Vòng quay may mắn"
              title="Vòng quay may mắn"
            >
              <Dices className="size-5" />
            </Button>
          </Link>

          {/* Cart Icon Button (Desktop Only) */}
          <Button
            variant="ghost"
            size="icon"
            className="relative hidden md:inline-flex cursor-pointer rounded-full transition-all duration-200 hover:bg-neutral-100 hover:text-primary hover:scale-110 active:scale-95"
            aria-label="Giỏ hàng"
            onClick={openCart}
          >
            <ShoppingBag className="size-5" />
            {mounted && totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex size-[18px] items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
                {totalItems}
              </span>
            )}
          </Button>

          {/* Mobile Menu Trigger (Dấu 3 gạch - Mobile Only) */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "relative flex md:hidden size-10 items-center justify-center rounded-full border border-black/10 dark:border-white/20 hover:bg-primary/10 hover:text-primary active:scale-95"
              )}
              aria-label="Mở menu"
            >
              <Menu className="size-5" />
              {mounted && totalItems > 0 && (
                <span className="absolute right-1 top-1 size-2 rounded-full bg-primary ring-2 ring-background" />
              )}
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col overflow-y-auto max-h-[100dvh] w-full max-w-sm p-6">
              <SheetHeader className="text-left pb-3 border-b border-border/60">
                <SheetTitle className="font-display text-2xl font-bold uppercase tracking-wide">
                  ToTo <span className="text-primary text-base">Barbershop</span>
                </SheetTitle>
              </SheetHeader>

              {/* 1. Navigation Links (Có khoảng đệm thanh lịch bên dưới ToTo Barbershop) */}
              <nav className="flex flex-col space-y-1.5 pt-5 pb-2" aria-label="Điều hướng di động">
                {MOBILE_NAV_LIST.map((link) => {
                  const active = isActive(link.href)
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setSheetOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-3 py-3 font-display text-base uppercase tracking-wide transition-colors",
                        active
                          ? "bg-primary/10 text-primary font-bold"
                          : "text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-primary"
                      )}
                    >
                      <span>{link.label}</span>
                      <ChevronRight className={cn("size-4 text-muted-foreground", active && "text-primary")} />
                    </Link>
                  )
                })}
              </nav>

              {/* 2. Cụm Tiện ích & Đăng nhập (Được kéo lên gần danh sách hơn, tạo khối gắn kết) */}
              <div className="mt-6 space-y-3 pt-5 border-t border-border/60">
                {/* Quick Utilities (Phương án 1: Ghost Wireframe tối giản) */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Giỏ hàng */}
                  <button
                    type="button"
                    onClick={() => {
                      setSheetOpen(false)
                      openCart()
                    }}
                    className="flex h-10 items-center justify-center gap-2 rounded-lg border border-border/80 bg-transparent px-3 text-xs font-medium text-foreground transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800/60 active:scale-95"
                  >
                    <ShoppingBag className="size-3.5 text-primary" />
                    <span>Giỏ hàng</span>
                    {mounted && totalItems > 0 ? (
                      <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                        {totalItems}
                      </span>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">(0)</span>
                    )}
                  </button>

                  {/* Vòng quay may mắn */}
                  <Link
                    href="/lucky-wheel"
                    onClick={() => setSheetOpen(false)}
                    className="flex h-10 items-center justify-center gap-2 rounded-lg border border-border/80 bg-transparent px-3 text-xs font-medium text-foreground transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800/60 active:scale-95"
                  >
                    <Dices className="size-3.5 text-primary" />
                    <span>Vòng quay</span>
                  </Link>
                </div>

                {/* Auth / Login (Tinh gọn, thanh mảnh) */}
                {mounted && user ? (
                  <div className="rounded-lg border border-primary/30 p-2.5 bg-transparent">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-[11px]">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-foreground">{user.name}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2 mt-1.5 border-t border-primary/20 text-[11px]">
                      <Link
                        href="/profile"
                        onClick={() => setSheetOpen(false)}
                        className="flex items-center justify-center gap-1 rounded border border-primary/20 py-1 font-medium hover:bg-primary/10 text-foreground"
                      >
                        <User className="size-3 text-primary" /> Hồ sơ
                      </Link>
                      <Link
                        href="/profile?tab=orders"
                        onClick={() => setSheetOpen(false)}
                        className="flex items-center justify-center gap-1 rounded border border-primary/20 py-1 font-medium hover:bg-primary/10 text-foreground"
                      >
                        <ShoppingBag className="size-3 text-primary" /> Đơn hàng
                      </Link>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        logout()
                        setSheetOpen(false)
                        router.push("/")
                      }}
                      className="flex w-full items-center justify-center gap-1 text-[10px] text-red-500 hover:text-red-600 pt-1.5"
                    >
                      <LogOut className="size-3" /> Đăng xuất
                    </button>
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      setSheetOpen(false)
                      setAuthOpen(true)
                    }}
                    variant="outline"
                    className="w-full h-9 gap-1.5 text-[11px] font-semibold uppercase tracking-wider border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground bg-transparent rounded-lg transition-colors"
                  >
                    <LogIn className="size-3.5" /> Đăng nhập
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Auth Modal Component */}
      <CustomerAuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  )
}
