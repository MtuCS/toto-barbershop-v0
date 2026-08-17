"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, ShoppingBag, Search, User, X, LogIn, LogOut } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { MAIN_NAV, SITE_NAME } from "@/lib/constants"
import { GooeyNav } from "@/components/website/gooey-nav"
import { useCartStore } from "@/store/cart-store"
import { useCustomerUserStore } from "@/store/customer-user-store"
import { useDataStore } from "@/store/data-store"
import { useMounted } from "@/hooks/use-mounted"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup } from "@/components/ui/dropdown-menu"
import { CustomerAuthModal } from "@/components/website/customer-auth-modal"

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

const HEADER_NAV = MAIN_NAV.filter((link) => link.showInHeader !== false)

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const mounted = useMounted()

  // Stores
  const { user, isAuthModalOpen: authOpen, setAuthModalOpen: setAuthOpen, logout } = useCustomerUserStore()
  const { products } = useDataStore()
  const totalItems = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  )
  const openCart = useCartStore((state) => state.openCart)

  // Search state
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  // Handle live search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const q = searchQuery.toLowerCase().trim()

    // Filter local products store as fallback or live result
    const localFiltered = (products || []).filter((p: any) => {
      const title = String(p?.title || p?.name || "").toLowerCase()
      const desc = String(p?.description || "").toLowerCase()
      const cat = String(
        typeof p?.category === "object" ? p?.category?.name : p?.category || ""
      ).toLowerCase()
      return title.includes(q) || desc.includes(q) || cat.includes(q)
    })

    // Also attempt fetching from API if running with backend
    fetch(`/api/products/search?q=${encodeURIComponent(q)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setSearchResults(data)
        } else {
          setSearchResults(localFiltered)
        }
      })
      .catch(() => {
        setSearchResults(localFiltered)
      })
      .finally(() => {
        setIsSearching(false)
      })
  }, [searchQuery, products])

  // Click outside to close live search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="site-glass-header fixed inset-x-0 top-0 z-50 border-b border-white/60 text-foreground backdrop-blur-xl backdrop-saturate-150 shadow-[0_10px_40px_rgba(7,17,15,0.14),inset_0_1px_0_rgba(255,255,255,0.82)]">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-5 md:px-6">
        <Logo />

        <div className="hidden xl:block">
          <GooeyNav items={HEADER_NAV} />
        </div>

        {/* Right Section: Inline Search Input + Icons */}
        <div className="flex items-center gap-3">

          

          {/* User Auth Icon Button (Đăng nhập / Đăng ký) */}
          {mounted && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative cursor-pointer rounded-full transition-all duration-200 hover:bg-neutral-100 hover:text-primary hover:scale-110 active:scale-95"
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
              className="relative cursor-pointer rounded-full transition-all duration-200 hover:bg-neutral-100 hover:text-primary hover:scale-110 active:scale-95"
              aria-label="Đăng nhập / Đăng ký"
              onClick={() => setAuthOpen(true)}
              title="Đăng nhập / Đăng ký"
            >
              <User className="size-5" />
            </Button>
          )}

          {/* Cart Icon Button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative cursor-pointer rounded-full transition-all duration-200 hover:bg-neutral-100 hover:text-primary hover:scale-110 active:scale-95"
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

          {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "rounded-none hover:bg-primary/8 hover:text-primary xl:hidden"
              )}
              aria-label="Mở menu"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm">
              <SheetHeader>
                <SheetTitle className="font-display uppercase">Menu</SheetTitle>
              </SheetHeader>



              {/* Mobile Auth Button */}
              <div className="px-2 pb-4 border-b border-border">
                <Button
                  onClick={() => {
                    if (user) router.push("/profile")
                    else setAuthOpen(true)
                  }}
                  variant="outline"
                  className="w-full justify-start gap-2 text-xs uppercase font-bold"
                >
                  {mounted && user ? (
                    <>
                      <User className="size-4 text-emerald-500" /> Xin chào, {user.name}
                    </>
                  ) : (
                    <>
                      <LogIn className="size-4" /> Đăng nhập / Đăng ký
                    </>
                  )}
                </Button>
              </div>

              <nav className="flex flex-col px-2 pb-6" aria-label="Điều hướng di động">
                {HEADER_NAV.map((link) => (
                  <SheetClose
                    key={link.href}
                    {...({ nativeButton: false } as any)}
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

      {/* Auth Modal Component */}
      <CustomerAuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  )
}
