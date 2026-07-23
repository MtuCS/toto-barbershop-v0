import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/website/product-detail"
import type { Product } from "@/types"

export default async function Page({params}:{params:Promise<{slug:string}>}){
  const {slug} = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products`, { cache: 'no-store' });
  if (!res.ok) notFound();
  const products: Product[] = await res.json();
  const product = products.find(p => p.slug === slug);
  if(!product) notFound();
  return <ProductDetail product={product}/>
}
