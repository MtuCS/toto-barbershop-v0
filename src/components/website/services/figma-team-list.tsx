"use client"

import Image from "next/image"
import { Scissors } from "lucide-react"

export interface FigmaTeamMember {
  id: string
  name: string
  role: string
  image: string
  description: string
  specialty?: string
}

export function FigmaTeamList({ members }: { members: FigmaTeamMember[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {members.map((member) => (
        <div
          key={member.id}
          className="group relative flex flex-col rounded-[2rem] p-1.5 border border-white/10 bg-white/[0.02] backdrop-blur-sm transition-all duration-500 hover:border-[#79b8a7]/40 hover:shadow-[0_25px_50px_rgba(0,0,0,0.7)]"
        >
          {/* Inner Core (Concentric Curves) */}
          <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(2rem-0.375rem)] bg-[#07110f]/95 p-5 backdrop-blur-md">
            {/* Portrait Image Frame */}
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-white/10 bg-black/40">
              <Image
                src={member.image}
                alt={member.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07110f] via-transparent to-transparent opacity-75" />

              {/* Top Mini Badge */}
              <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/70 px-2.5 py-0.5 text-[10px] font-mono text-[#79b8a7] backdrop-blur-md">
                <Scissors className="size-2.5" />
                Barber
              </div>
            </div>

            {/* Info */}
            <div className="pt-4 flex flex-col flex-1">
              <h3 className="font-sans text-base md:text-lg font-bold uppercase tracking-tight text-[#f2f5f3] group-hover:text-[#79b8a7] transition-colors duration-300">
                {member.name}
              </h3>
              <p className="mt-1 text-xs text-[#79b8a7] font-semibold uppercase tracking-wider">
                {member.role}
              </p>
              <p className="mt-2.5 text-xs text-white/60 leading-relaxed font-sans">
                {member.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
