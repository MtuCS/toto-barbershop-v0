"use client"

import { useState } from "react"
import Link from "next/link"
import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { shopFaqs } from "@/data/shop-faq"

export function ShopFaq() {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <section className="bg-white py-16 text-[#101715] md:py-24" aria-labelledby="shop-faq-title">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-primary">Q & A</p>
          <h2 id="shop-faq-title" className="mt-4 font-display text-4xl font-bold uppercase leading-none md:text-6xl">
            Câu hỏi thường gặp về pomade & sáp tóc
          </h2>
          <p className="mt-5 text-sm leading-6 text-neutral-600 md:text-base">
            Giải đáp nhanh để bạn chọn đúng sản phẩm ngay lần đầu.
          </p>
        </div>

        <div className="mt-12 grid gap-3 md:grid-cols-2 md:gap-4">
          {shopFaqs.map((item, index) => {
            const id = `shop-faq-${index + 1}`
            const open = openId === id
            return (
              <article
                key={item.question}
                className={cn(
                  "rounded-lg border bg-white px-4 transition-colors md:px-5",
                  open ? "border-[#101715]" : "border-black/15",
                )}
              >
                <button
                  type="button"
                  id={id}
                  aria-expanded={open}
                  aria-controls={`${id}-panel`}
                  onClick={() => setOpenId(open ? null : id)}
                  className="flex min-h-16 w-full items-center justify-between gap-4 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <span className="flex items-center gap-4">
                    <span className="text-xs font-bold text-neutral-300">{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-sm font-bold text-[#101715] md:text-base">{item.question}</span>
                  </span>
                  <span className={cn("grid size-8 shrink-0 place-items-center rounded-full border border-black/15", open && "bg-[#101715] text-white")}>
                    {open ? <Minus className="size-4" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
                  </span>
                </button>
                <div
                  id={`${id}-panel`}
                  role="region"
                  aria-labelledby={id}
                  className={cn(
                    "grid transition-[grid-template-rows] duration-200 motion-reduce:transition-none",
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="pb-5 pl-8 pr-3 text-sm leading-7 text-neutral-600 md:pl-10">
                      <p>{item.answer}</p>
                      {item.linkLabel && item.linkHref ? (
                        <Link href={item.linkHref} className="mt-3 inline-flex font-semibold text-[#101715] underline underline-offset-4 hover:text-primary">
                          {item.linkLabel} →
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}