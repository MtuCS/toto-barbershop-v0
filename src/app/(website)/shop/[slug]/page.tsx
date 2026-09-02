import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MarketingPageShell } from "@/components/website/marketing-page-shell"
import { ProductDetail } from "@/components/website/product-detail"
import { Breadcrumbs } from "@/components/website/breadcrumbs"
import { getProducts } from "@/lib/api"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const products = await getProducts()
  const product = products.find((item) => item.slug === slug)

  if (!product) {
    return {
      title: "Sản Phẩm Không Tồn Tại",
    }
  }

  return {
    title: `${product.title} — Chính Hãng`,
    description: product.description || `Mua ngay ${product.title} chính hãng tại ToTo Barbershop. Giao hàng hoả tốc, cam kết đổi trả 7 ngày.`,
    openGraph: {
      title: `${product.title} | ToTo Barbershop`,
      description: product.description,
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const products = await getProducts()
  const product = products.find((item) => item.slug === slug)

  if (!product) notFound()

  const relatedProducts = products
    .filter((item) => item.id !== product.id && item.collection?.toLowerCase() === product.collection?.toLowerCase())
    .slice(0, 4)

  return (
    <MarketingPageShell>
      <div className="mx-auto max-w-[1400px] px-5 pt-6 md:px-8">
        <Breadcrumbs
          items={[
            { label: "Cửa hàng", href: "/shop" },
            { label: product.title },
          ]}
        />
      </div>
      <ProductDetail product={product} relatedProducts={relatedProducts} />
    </MarketingPageShell>
  )
}
