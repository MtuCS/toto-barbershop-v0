"use client"

import Image from "next/image"

export interface FigmaTeamMember {
  id: string
  name: string
  image: string
}

export function FigmaTeamList({ members }: { members: FigmaTeamMember[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {members.map((member) => (
        <div
          key={member.id}
          className="group relative flex flex-col rounded-[1.75rem] md:rounded-[2rem] p-1.5 border border-white/10 bg-white/[0.02] backdrop-blur-sm transition-all duration-500 hover:border-[#79b8a7]/50 hover:shadow-[0_20px_45px_rgba(0,0,0,0.8)]"
        >
          {/* Inner Core (Concentric Curves) */}
          <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(1.75rem-0.375rem)] md:rounded-[calc(2rem-0.375rem)] bg-[#07110f]/95 p-3.5 sm:p-5 backdrop-blur-md">
            {/* Portrait Image Frame */}
            <div className="relative aspect-[4/5] sm:aspect-square w-full overflow-hidden rounded-xl border border-white/10 bg-black/40">
              <Image
                src={member.image}
                alt={member.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07110f]/80 via-transparent to-transparent opacity-50" />
            </div>

            {/* Chỉ để hình và text tên theo yêu cầu khách */}
            <div className="pt-4 pb-1 text-center">
              <h3 className="font-sans text-sm sm:text-base md:text-lg font-extrabold uppercase tracking-wider text-[#f2f5f3] group-hover:text-[#79b8a7] transition-colors duration-300">
                {member.name}
              </h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
