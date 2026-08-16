import { notFound } from "next/navigation"
import { MarketingPageShell } from "@/components/website/marketing-page-shell"
import { ProductDetail } from "@/components/website/product-detail"
import { products as fallbackProducts } from "@/data/products"
import type { Product } from "@/types"

async function getProducts(): Promise<Product[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL
  if (!apiUrl) return fallbackProducts
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 1500)
  try {
    const response = await fetch(`${apiUrl.replace(/\/$/, "")}/products`, { cache: "no-store", signal: controller.signal })
    if (!response.ok) return fallbackProducts
    const products = await response.json()
    return Array.isArray(products) && products.length ? products : fallbackProducts
  } catch {
    return fallbackProducts
  } finally {
    clearTimeout(timeout)
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const products = await getProducts()
  const product = products.find((item) => item.slug === slug)
  if (!product) notFound()
  const relatedProducts = products.filter((item) => item.id !== product.id && item.collection.toLowerCase() === product.collection.toLowerCase()).slice(0, 4)
  return <MarketingPageShell><ProductDetail product={product} relatedProducts={relatedProducts} /></MarketingPageShell>
}
