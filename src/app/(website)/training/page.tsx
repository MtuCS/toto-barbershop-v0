import Image from "next/image"
import { trainingCourses } from "@/data/training"
import { formatCurrency } from "@/lib/format"
import { MarketingPageShell } from "@/components/website/marketing-page-shell"
import { TrainingForm } from "@/components/website/training-form"

const trainingImages = {
  hero: "/images/training/training-hero.png",
  practice: "/images/training/training-3.jpg",
  teamLeft: "/images/training/training-1.jpg",
  teamRight: "/images/training/training-2.jpg",
  portrait: "/images/training/653585426_1258711476411020_7669587643556603719_n.jpg",
}

export default function Page() {
  return (
    <MarketingPageShell>
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-[1400px] px-5 pb-8 pt-14 md:px-8 md:pb-12 md:pt-20">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#79b8a7]">
            <span className="flex items-center gap-3">
              <span className="h-px w-7 bg-[#2f7a68]" aria-hidden="true" />
              TOTO Academy
            </span>
            <span>Est. 2025</span>
          </div>

          <div className="grid gap-10 pt-10 md:grid-cols-12 md:items-end md:pt-14">
            <h1 className="font-serif text-[18vw] font-medium uppercase leading-[0.78] tracking-[-0.065em] text-[#f2f5f3] sm:text-[14vw] md:col-span-8 md:text-[clamp(5rem,10vw,10.5rem)]">
              Learn the
              <br />
              craft.
            </h1>
            <div className="space-y-7 md:col-span-3 md:col-start-10 md:pb-2">
              <p className="max-w-sm text-sm leading-7 text-white/65 md:text-base">
                Learn through observation, hands-on repetition, and feedback from barbers who work with real clients every day.
              </p>
              <a
                href="#consultation"
                className="inline-flex border-b border-[#79b8a7] pb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#f2f5f3] transition-colors hover:border-white hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#79b8a7]"
              >
                Talk to the academy
              </a>
            </div>
          </div>

          <figure className="relative mt-12 aspect-[16/10] overflow-hidden border border-white/10 bg-black/30 md:mt-16 md:aspect-[2/1]">
            <Image
              src={trainingImages.hero}
              alt="Training floor at TOTO Academy"
              fill
              priority
              sizes="(max-width: 1439px) 100vw, 1400px"
              className="object-contain"
            />
            <figcaption className="absolute bottom-0 left-0 bg-[#07110f]/90 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/65 backdrop-blur-sm">
              Learn by doing / TOTO Academy
            </figcaption>
          </figure>
        </div>
      </header>

      <section className="py-20 md:py-32">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 md:grid-cols-12 md:items-start md:gap-5 md:px-8">
          <div className="md:col-span-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#79b8a7]">01 / The learning floor</p>
            <h2 className="mt-6 max-w-lg font-display text-5xl uppercase leading-[0.9] text-[#f2f5f3] md:text-7xl">
              Your hands learn the work, not just the theory.
            </h2>
            <p className="mt-7 max-w-md leading-7 text-white/65 md:text-lg">
              Every session puts you close to the rhythm of a real shop: observe the detail, practice the movement, and refine the result with direct feedback.
            </p>

            <dl className="mt-12 grid max-w-md grid-cols-3 border-t border-white/10 pt-5">
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">Format</dt>
                <dd className="mt-2 text-sm font-medium text-[#f2f5f3]">Hands-on</dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">Feedback</dt>
                <dd className="mt-2 text-sm font-medium text-[#f2f5f3]">Direct 1:1</dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">Focus</dt>
                <dd className="mt-2 text-sm font-medium text-[#f2f5f3]">Real craft</dd>
              </div>
            </dl>
          </div>

          <figure className="group relative aspect-[4/5] overflow-hidden border border-white/10 bg-black/30 md:col-span-5 md:col-start-8">
            <Image
              src={trainingImages.practice}
              alt="Student practicing a haircut on a model"
              fill
              sizes="(max-width: 767px) 100vw, 42vw"
              className="object-contain transition-transform duration-700 group-hover:scale-[1.02] motion-reduce:transition-none"
            />
          </figure>
        </div>
      </section>

      <section className="border-y border-white/10 py-5">
        <div className="mx-auto grid max-w-[1400px] gap-5 px-5 sm:grid-cols-3 md:px-8">
          <figure className="group relative aspect-square overflow-hidden border border-white/10">
            <Image src={trainingImages.teamLeft} alt="TOTO barber team in the training space" fill sizes="(max-width: 639px) 100vw, 33vw" className="object-contain transition-transform duration-700 group-hover:scale-[1.02] motion-reduce:transition-none" />
          </figure>
          <figure className="group relative aspect-square overflow-hidden border border-white/10 bg-black/30">
            <Image src={trainingImages.portrait} alt="TOTO barber sharing professional tools and techniques" fill sizes="(max-width: 639px) 100vw, 33vw" className="object-contain transition-transform duration-700 group-hover:scale-[1.02] motion-reduce:transition-none" />
          </figure>
          <figure className="group relative aspect-square overflow-hidden border border-white/10">
            <Image src={trainingImages.teamRight} alt="Young barbers practicing at TOTO Academy" fill sizes="(max-width: 639px) 100vw, 33vw" className="object-contain transition-transform duration-700 group-hover:scale-[1.02] motion-reduce:transition-none" />
          </figure>
        </div>
      </section>

      <section className="bg-[#f2f5f3] py-20 text-[#101715] md:py-32">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8">
          <div className="grid gap-8 border-b border-black/15 pb-12 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#2f7a68]">02 / Choose your route</p>
              <h2 className="mt-5 max-w-3xl font-display text-5xl uppercase leading-[0.9] md:text-7xl">From foundation to your own point of view.</h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-neutral-600 md:col-span-3 md:col-start-10 md:pb-1">
              A clear rhythm for every stage, so you always know what you are learning and where it can take you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 md:divide-x md:divide-black/15">
            {trainingCourses.map((course, index) => (
              <article key={course.id} className="flex min-h-full flex-col border-b border-black/15 py-9 md:px-10 md:py-12 first:md:pl-0 last:md:pr-0">
                <div className="flex items-start justify-between gap-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#2f7a68]">0{index + 1} / {course.level}</p>
                  <p className="text-sm font-medium text-neutral-500">{course.duration}</p>
                </div>
                <h3 className="mt-8 max-w-md font-display text-4xl uppercase leading-[0.95] md:text-5xl">{course.title}</h3>
                <p className="mt-5 max-w-lg leading-7 text-neutral-600">{course.summary}</p>
                <p className="mt-8 text-xl font-bold tracking-tight">{formatCurrency(course.price)}</p>

                <div className="mt-9 border-t border-black/15">
                  {course.roadmap.map((item) => (
                    <div key={item.week} className="grid grid-cols-[5.5rem_1fr] gap-4 border-b border-black/10 py-3 text-sm">
                      <b className="font-semibold">{item.week}</b>
                      <span className="text-neutral-600">{item.focus}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="consultation" className="scroll-mt-24 py-20 md:py-32">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 md:grid-cols-12 md:items-end md:px-8">
          <div className="md:col-span-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#79b8a7]">03 / Your instructor</p>
            <h2 className="mt-6 font-display text-5xl uppercase leading-[0.9] text-[#f2f5f3] md:text-6xl">Learn from someone who still does the work.</h2>
            <figure className="relative mt-10 aspect-square max-w-xl overflow-hidden border border-white/10 bg-black/30">
              <Image src="/images/instructor.png" alt="TOTO Academy instructor" fill sizes="(max-width: 767px) 100vw, 42vw" className="object-contain" />
            </figure>
          </div>

          <div className="border-t border-white/10 pt-8 md:col-span-6 md:col-start-7 md:pb-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#79b8a7]">Start the conversation</p>
            <h2 className="mt-5 max-w-xl font-display text-5xl uppercase leading-[0.9] text-[#f2f5f3] md:text-6xl">Find the course that matches your next move.</h2>
            <p className="mt-6 max-w-xl leading-7 text-white/65">
              Leave your details and the TOTO Academy team will contact you with the path that fits your experience and goals.
            </p>
            <div className="mt-10 bg-[#f2f5f3] p-5 text-[#101715] md:p-8">
              <TrainingForm />
            </div>
          </div>
        </div>
      </section>
    </MarketingPageShell>
  )
}