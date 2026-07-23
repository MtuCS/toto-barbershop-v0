"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, ShoppingBag, Search, User, X, LogIn } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { MAIN_NAV, SITE_NAME } from "@/lib/constants"
import { useCartStore } from "@/store/cart-store"
import { useCustomerUserStore } from "@/store/customer-user-store"
import { useDataStore } from "@/store/data-store"
import { useMounted } from "@/hooks/use-mounted"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
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

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const mounted = useMounted()

  // Stores
  const { user, isAuthModalOpen: authOpen, setAuthModalOpen: setAuthOpen } = useCustomerUserStore()
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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-white/95 text-foreground backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-5 md:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Điều hướng chính">
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

        {/* Right Section: Inline Search Input + Icons */}
        <div className="flex items-center gap-3">
          {/* Direct Search Input Box */}
          <div ref={searchRef} className="relative hidden md:block w-48 lg:w-64">
            <div className="relative flex items-center">
              <Search className="absolute left-3 size-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setIsSearchOpen(true)
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="h-9 w-full rounded-full border-black/15 bg-neutral-100/80 pl-9 pr-8 text-xs placeholder:text-neutral-500 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setSearchResults([])
                  }}
                  className="absolute right-2.5 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Live Search Results Dropdown */}
            {isSearchOpen && searchQuery.trim() !== "" && (
              <div className="absolute left-0 right-0 top-full mt-2 z-50 overflow-hidden rounded-xl border border-border bg-background p-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
                {isSearching ? (
                  <p className="p-3 text-center text-xs text-muted-foreground">Đang tìm kiếm...</p>
                ) : searchResults.length > 0 ? (
                  <div className="max-h-72 overflow-y-auto space-y-1">
                    {searchResults.map((product: any) => {
                      const name = product.title || product.name || "Sản phẩm ToTo"
                      const img =
                        (product.images && product.images[0]) ||
                        product.image ||
                        "https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=300"
                      const catName =
                        typeof product.category === "object"
                          ? product.category?.name
                          : product.category === "grooming"
                          ? "Sáp & Chăm sóc"
                          : product.category === "merchandise"
                          ? "Thời trang"
                          : product.category || "Sản phẩm"
                      const priceVal =
                        product.basePrice ||
                        product.price ||
                        (product.variants && product.variants[0]?.price) ||
                        0

                      return (
                        <Link
                          key={product.id || product.slug}
                          href="/shop"
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/60 transition-colors"
                        >
                          <div className="relative size-10 shrink-0 overflow-hidden rounded border border-border bg-neutral-100">
                            <Image src={img} alt={name} fill className="object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="truncate text-xs font-bold text-foreground">{name}</h4>
                            <p className="text-[10px] text-muted-foreground">
                              {catName} • {priceVal.toLocaleString("vi-VN")} ₫
                            </p>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                ) : (
                  <p className="p-3 text-center text-xs text-muted-foreground">Không tìm thấy sản phẩm nào.</p>
                )}
              </div>
            )}
          </div>

          {/* User Auth Icon Button (Đăng nhập / Đăng ký) */}
          <Button
            variant="ghost"
            size="icon"
            className="relative cursor-pointer rounded-full transition-all duration-200 hover:bg-neutral-100 hover:text-primary hover:scale-110 active:scale-95"
            aria-label={user ? `Tài khoản (${user.name})` : "Đăng nhập / Đăng ký"}
            onClick={() => {
              if (user) router.push("/profile")
              else setAuthOpen(true)
            }}
            title={user ? `Hồ sơ, ${user.name}` : "Đăng nhập / Đăng ký"}
          >
            <User className="size-5" />
            {mounted && user && (
              <span
                className="absolute right-0 top-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white"
                title="Đã đăng nhập"
              />
            )}
          </Button>

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
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-none hover:bg-primary/8 hover:text-primary xl:hidden"
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

              {/* Mobile Inline Search */}
              <div className="px-2 pt-2 pb-4">
                <div className="relative flex items-center">
                  <Search className="absolute left-3 size-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 w-full rounded-full border-black/15 bg-neutral-100 pl-9 text-xs"
                  />
                </div>
              </div>

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

      {/* Auth Modal Component */}
      <CustomerAuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  )
}
