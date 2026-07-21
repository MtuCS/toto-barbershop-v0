import { notFound } from "next/navigation"; import { products, getProductBySlug } from "@/data/products"; import { ProductDetail } from "@/components/website/product-detail"
export function generateStaticParams(){return products.map(p=>({slug:p.slug}))}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params; const product=getProductBySlug(slug); if(!product)notFound(); return <ProductDetail product={product}/>}
