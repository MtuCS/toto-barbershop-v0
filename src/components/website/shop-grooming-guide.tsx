import Link from "next/link"

export function ShopGroomingGuide() {
  return (
    <section className="border-t border-black/10 bg-[#f5f9f7] py-16 text-[#101715] md:py-24" aria-labelledby="grooming-guide-title">
      <article className="mx-auto max-w-[820px] px-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-primary">TOTO Grooming guide</p>
        <h2 id="grooming-guide-title" className="mt-4 font-display text-4xl font-bold uppercase leading-[0.95] md:text-5xl">
          Sáp vuốt tóc nam là gì? Phân biệt Pomade, Clay, Wax, Paste và Fiber
        </h2>
        <div className="mt-6 border-t-2 border-[#101715] pt-6 text-[15px] leading-7 text-neutral-700">
          <p>
            Sáp vuốt tóc là nhóm sản phẩm tạo kiểu dạng sáp hoặc kem, giúp định hình tóc và giữ nếp trong ngày mà vẫn có thể chỉnh lại khi cần.
          </p>
          <p className="mt-5">
            <strong>Pomade</strong> hợp slick back, side part và bề mặt bóng; <strong>Clay</strong> tăng volume, texture và hiệu ứng lì; <strong>Wax</strong> cân bằng độ giữ nếp; <strong>Paste</strong> nhẹ, linh hoạt; còn <strong>Fiber</strong> tạo độ tách lọn rõ cho tóc ngắn đến trung bình.
          </p>
          <h3 className="mt-8 font-display text-2xl font-bold uppercase text-[#101715]">Chọn đúng theo tóc và phong cách</h3>
          <ul className="mt-4 space-y-3">
            <li><strong>Tóc mỏng hoặc ngắn:</strong> ưu tiên Clay/Fiber để tạo phồng mà không nặng tóc.</li>
            <li><strong>Tóc dày, dài vừa:</strong> chọn Wax hoặc Pomade medium–strong hold để kiểm soát tốt hơn.</li>
            <li><strong>Thích tự nhiên:</strong> chọn matte hoặc natural shine; muốn kiểu gọn cổ điển, chọn Pomade có shine.</li>
            <li><strong>Dùng đúng lượng:</strong> bắt đầu bằng một hạt đậu, xoa ấm trên tay, rồi tăng dần thay vì lấy quá nhiều ngay từ đầu.</li>
          </ul>
          <p className="mt-6">
            Khám phá theo nhu cầu: <Link href="/shop/grooming?collection=pomade" className="font-semibold underline underline-offset-4 hover:text-primary">Pomade</Link>, <Link href="/shop/grooming?collection=clay" className="font-semibold underline underline-offset-4 hover:text-primary">Clay</Link> và <Link href="/shop/grooming?collection=wax" className="font-semibold underline underline-offset-4 hover:text-primary">Wax</Link>.
          </p>
        </div>
      </article>
    </section>
  )
}