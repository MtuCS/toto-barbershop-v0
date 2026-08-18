import { notFound } from "next/navigation"
import { MarketingPageShell } from "@/components/website/marketing-page-shell"
import { ProductDetail } from "@/components/website/product-detail"
import { getProducts } from "@/lib/api"

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
      <ProductDetail product={product} relatedProducts={relatedProducts} />
    </MarketingPageShell>
  )
}
