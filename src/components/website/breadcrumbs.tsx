import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Trang chủ",
        item: process.env.NEXT_PUBLIC_SITE_URL || "https://totobarbershop.com",
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.label,
        ...(item.href
          ? {
              item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://totobarbershop.com"}${item.href}`,
            }
          : {}),
      })),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-white/50">
        <Link
          href="/"
          className="inline-flex items-center gap-1 transition-colors hover:text-[#79b8a7]"
          title="Trang chủ"
        >
          <Home className="size-3.5" />
          <span className="sr-only">Trang chủ</span>
        </Link>

        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <div key={item.label} className="flex items-center gap-1.5">
              <ChevronRight className="size-3 text-white/30" />
              {isLast || !item.href ? (
                <span className="font-medium text-[#79b8a7] line-clamp-1">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-white line-clamp-1"
                >
                  {item.label}
                </Link>
              )}
            </div>
          )
        })}
      </nav>
    </>
  )
}
