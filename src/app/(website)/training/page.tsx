import Image from "next/image";
import { trainingCourses } from "@/data/training";
import { formatCurrency } from "@/lib/format";
import { PageHero, SectionTitle } from "@/components/website/page-hero";
import { TrainingForm } from "@/components/website/training-form";

const trainingImages = {
    hero: "/images/about_raw.png",
//   hero: "/images/training/training-hero.png",
academyBanner: "/images/training/training-hero.png",
  teamLeft: "/images/training/training-1.jpg",
  practice: "/images/training/training-3.jpg",
  portrait:
    "/images/training/653585426_1258711476411020_7669587643556603719_n.jpg",
  teamRight: "/images/training/training-2.jpg",
};

export default function Page() {
  return (
    <>
      {/* <PageHero
        eyebrow="TOTO Academy"
        title="LEARN THE CRAFT."
        description="Nếu anh em muốn thoát xác khỏi mấy kiểu đầu công nghiệp và thực sự muốn tìm cái GU, cái CHẤT riêng của mình, thì đây là tấm vé lên thuyền."
        image={trainingImages.hero}
      /> */}

      <section className="bg-neutral-950">
        <div className="mx-auto max-w-7xl px-5 pt-8 md:px-8 md:pt-12">
          <div className="relative w-full overflow-hidden bg-black aspect-[16/9]">
            <Image
              src={trainingImages.academyBanner}
              alt="Đào tạo học viên tại TOTO Barbershop"
              fill
              priority
              sizes="(min-width: 1280px) 1280px, 100vw"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-neutral-950 py-16 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[.25em] text-emerald-300">
              Một ngày tại TOTO Academy
            </p>
            <p className="mt-6 max-w-2xl leading-7 text-white/65 md:text-lg">
              Quan sát, thực hành và chỉnh sửa trực tiếp. Mỗi buổi học đưa bạn
              gần hơn với nhịp làm nghề thật, từ văn hóa Barber đến thao tác tay
              và cách làm việc với khách hàng.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3 md:mt-16 md:grid-cols-12 md:gap-5">
            <figure className="group relative col-span-2 aspect-[4/3] overflow-hidden md:col-span-7 md:row-span-2 md:aspect-auto md:min-h-[720px]">
              <Image
                src={trainingImages.practice}
                alt="Học viên thực hành cắt tóc trên người mẫu tại TOTO Academy"
                fill
                sizes="(min-width: 768px) 58vw, 100vw"
                className="object-contain transition-transform duration-700 group-hover:scale-[1.025]"
              />
            </figure>
            <figure className="group relative col-span-1 aspect-[4/5] overflow-hidden md:col-span-5 md:aspect-[4/3]">
              <Image
                src={trainingImages.teamLeft}
                alt="Đội ngũ barber trong không gian đào tạo TOTO"
                fill
                sizes="(min-width: 768px) 42vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
              />
            </figure>
            <figure className="group relative col-span-1 aspect-[4/5] overflow-hidden md:col-span-5 md:aspect-[4/3]">
              <Image
                src={trainingImages.teamRight}
                alt="Các barber trẻ tại khu vực thực hành của TOTO Academy"
                fill
                sizes="(min-width: 768px) 42vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <SectionTitle label="Khóa học" title="Từ nền tảng đến làm chủ" />
        <div className="grid gap-8 md:grid-cols-2">
          {trainingCourses.map((course) => (
            <article key={course.id} className="border p-6 md:p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">
                {course.level} · {course.duration}
              </p>
              <h2 className="mt-3 font-display text-4xl font-bold uppercase">
                {course.title}
              </h2>
              <p className="mt-4 text-muted-foreground">{course.summary}</p>
              <p className="mt-5 text-xl font-bold">
                {formatCurrency(course.price)}
              </p>
              <div className="mt-7 border-t pt-5">
                {course.roadmap.map((item) => (
                  <div
                    key={item.week}
                    className="grid grid-cols-[90px_1fr] border-b py-3 text-sm"
                  >
                    <b>{item.week}</b>
                    <span className="text-muted-foreground">{item.focus}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-neutral-950 py-16 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid items-end gap-8 md:grid-cols-12">
            <div className="md:col-span-4 md:pb-10">
              <p className="text-xs font-bold uppercase tracking-[.25em] text-emerald-300">
                Va chạm thực tế
              </p>
              <h2 className="mt-4 font-display text-5xl font-bold uppercase leading-[1.2] md:text-7xl">
                Tay nghề lớn lên qua từng lần cầm kéo
              </h2>
              <p className="mt-6 leading-7 text-white/65">
                Không chỉ xem giảng viên làm mẫu. Học viên trực tiếp thao tác,
                xử lý tình huống và hoàn thiện tác phẩm trong môi trường chuyên
                nghiệp.
              </p>
            </div>
            <figure className="relative aspect-square overflow-hidden md:col-span-8 md:aspect-[16/10]">
              <Image
                src={trainingImages.portrait}
                alt="Barber TOTO giới thiệu dụng cụ và chia sẻ kinh nghiệm làm nghề"
                fill
                sizes="(min-width: 768px) 66vw, 100vw"
                className="object-cover"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className="bg-neutral-950 pb-16 text-white md:pb-24">
        <div className="mx-auto grid max-w-7xl gap-12 border-t border-white/15 px-5 pt-16 md:grid-cols-2 md:px-8 md:pt-24">
          <div>
            <SectionTitle
              label="Giảng viên"
              title="Học từ người đang làm nghề"
            />
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/instructor.png"
                alt="Giảng viên TOTO Academy"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="self-end">
            <SectionTitle
              label="Tư vấn"
              title="Bắt đầu hành trình của bạn"
              copy="Để lại thông tin, đội ngũ TOTO Academy sẽ liên hệ và tư vấn lộ trình phù hợp với kinh nghiệm của bạn."
            />
            <TrainingForm />
          </div>
        </div>
      </section>
    </>
  );
}
