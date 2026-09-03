"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useAnimationControls } from "motion/react";
import { Button } from "@/components/ui/button";
import { Trophy, X, Gift, HeartHandshake } from "lucide-react";

export interface Prize {
  id: string;
  name: string;
  color: string;
  probability: number;
  image?: string;
  code?: string;
  description?: string;
}

interface LuckyWheelGameProps {
  prizes: Prize[];
  onFinish?: (prize: Prize) => void;
}

export function LuckyWheelGame({ prizes, onFinish }: LuckyWheelGameProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<Prize | null>(null);
  const controls = useAnimationControls();
  const currentRotationRef = useRef(0);

  const numSlices = prizes.length;
  const sliceAngle = 360 / numSlices;

  // Continuous ultra-slow idle rotation on GPU (~75s per full 360 turn for effortless reading)
  useEffect(() => {
    if (!isSpinning && !result) {
      controls.start({
        rotate: currentRotationRef.current + 36000,
        transition: {
          duration: 5000,
          ease: "linear",
        },
      });
    } else if (result) {
      // Freeze wheel at exact target position while modal is open
      controls.stop();
    }
  }, [isSpinning, result, controls]);

  const spin = async () => {
    if (isSpinning || result) return;
    setIsSpinning(true);
    setResult(null);

    // Stop idle animation immediately
    controls.stop();

    // 1. Determine prize by probability
    const rand = Math.random() * 100;
    let sum = 0;
    let selectedIndex = 0;
    for (let i = 0; i < prizes.length; i++) {
      sum += prizes[i].probability;
      if (rand <= sum) {
        selectedIndex = i;
        break;
      }
    }

    // 2. Pointer is at 3 o'clock (0 degrees).
    // Land at a random position inside the winning slice (between 1% and 99% of slice span)
    const randomFraction = 0.01 + Math.random() * 0.98;
    const targetSliceOffset = (360 - (selectedIndex + randomFraction) * sliceAngle) % 360;
    const spins = 10 + Math.floor(Math.random() * 3); // 10-12 full rotations
    const startRot = currentRotationRef.current;
    const targetRot = startRot + (spins * 360) + ((targetSliceOffset - (startRot % 360) + 360) % 360);
    const spinDuration = 12 + Math.random() * 2; // 12-14 seconds (1.5-2x longer for thrilling suspense)

    // 3. GPU-accelerated spin transition with realistic smooth deceleration
    await controls.start({
      rotate: targetRot,
      transition: {
        duration: spinDuration,
        ease: [0.1, 0.85, 0.15, 1], // Smooth, realistic deceleration curve
      },
    });

    currentRotationRef.current = targetRot;

    // Set result FIRST so modal opens while wheel stays frozen at exact target position!
    setResult(prizes[selectedIndex]);
    setIsSpinning(false);
    onFinish?.(prizes[selectedIndex]);
  };


  const round = (n: number) => Number(n.toFixed(4));

  const createSlicePath = (index: number) => {
    const startAngle = (index * sliceAngle * Math.PI) / 180;
    const endAngle = ((index + 1) * sliceAngle * Math.PI) / 180;
    const radius = 196;
    const cx = 200;
    const cy = 200;

    const x1 = round(cx + radius * Math.cos(startAngle));
    const y1 = round(cy + radius * Math.sin(startAngle));
    const x2 = round(cx + radius * Math.cos(endAngle));
    const y2 = round(cy + radius * Math.sin(endAngle));

    const largeArcFlag = sliceAngle > 180 ? 1 : 0;

    return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  const isLuckPrize = result?.name.toLowerCase().includes("chúc may mắn");

  return (
    <div className="flex flex-col items-center justify-center relative w-[min(92vw,calc(100vh-90px),760px)] aspect-square mx-auto select-none p-1">

      {/* Ambient Glow */}
      <div className="absolute inset-4 rounded-full bg-gradient-to-r from-[#ef4444]/20 via-[#3b82f6]/20 to-[#10b981]/20 blur-3xl -z-10 animate-pulse" />

      {/* Red Pointer Arrow with realistic ticker vibration when spinning */}
      <motion.div
        animate={isSpinning ? { rotate: [0, -10, 5, -6, 2, 0] } : { rotate: 0 }}
        transition={isSpinning ? { repeat: Infinity, duration: 0.18, ease: "linear" } : { duration: 0.2 }}
        className="absolute top-1/2 -right-3 sm:-right-4 -translate-y-1/2 z-40 flex items-center filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] origin-right"
      >
        <div className="w-0 h-0 border-t-[14px] sm:border-t-[20px] border-t-transparent border-b-[14px] sm:border-b-[20px] border-b-transparent border-r-[30px] sm:border-r-[42px] border-r-[#dc2626] filter drop-shadow-lg" />
        <div className="w-2.5 sm:w-3 h-7 sm:h-10 bg-[#dc2626] rounded-r-md -ml-1 border-y border-r border-white/30" />
      </motion.div>

      {/* Main Wheel Container (Strict Square, Perfect Circle) */}
      <div
        className="relative w-full h-full rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden bg-neutral-900 cursor-pointer group"
        onClick={spin}
      >
        <motion.div
          animate={controls}
          initial={{ rotate: 0 }}
          className="w-full h-full relative"
          style={{ transformOrigin: "center center" }}
        >
          <svg viewBox="0 0 400 400" className="w-full h-full">
            <defs>
              <clipPath id="circle-clip">
                <circle cx="200" cy="200" r="197" />
              </clipPath>
            </defs>

            <g clipPath="url(#circle-clip)">
              {prizes.map((prize, i) => {
                const textAngle = (i + 0.5) * sliceAngle;

                return (
                  <g key={prize.id}>
                    {/* Slice Sector */}
                    <path
                      d={createSlicePath(i)}
                      fill={prize.color}
                      stroke="rgba(255,255,255,0.4)"
                      strokeWidth="2"
                    />

                    {/* Radial Text */}
                    <g transform={`translate(200, 200) rotate(${textAngle})`}>
                      <text
                        x="120"
                        y="0"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#ffffff"
                        fontSize="17"
                        fontWeight="900"
                        className="uppercase tracking-wider font-display"
                        style={{
                          textShadow: "0px 2px 6px rgba(0,0,0,0.95)",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {prize.name}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>

            {/* Perfect SVG Outer White Border (Never Distorted) */}
            <circle cx="200" cy="200" r="197" fill="none" stroke="#ffffff" strokeWidth="6" />
          </svg>
        </motion.div>

        {/* Center White Circle Hub (Responsive size) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-white border-2 sm:border-4 border-neutral-100 shadow-[0_0_30px_rgba(0,0,0,0.5)] z-30 flex flex-col items-center justify-center p-1 sm:p-2 group-hover:scale-105 transition-transform duration-300 pointer-events-none">
          <span className="text-[11px] sm:text-sm md:text-base font-black uppercase text-neutral-900 tracking-tight text-center leading-tight">
            {isSpinning ? "Đang quay..." : "Quay"}
          </span>
        </div>
      </div>

      {/* Luxury Redesigned Winner Modal */}
      {result && !isSpinning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in zoom-in-95 duration-300">

          {/* Card Container */}
          <div className="relative bg-[#07130f]/95 border-2 border-[#79b8a7]/40 ring-1 ring-white/10 p-5 sm:p-8 rounded-3xl shadow-[0_0_80px_rgba(121,184,167,0.25),0_30px_70px_rgba(0,0,0,0.95)] text-center max-w-md w-full max-h-[90vh] overflow-y-auto">

            {/* Ambient Inner Halo */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#79b8a7]/20 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={() => setResult(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-1.5 sm:p-2 transition-all cursor-pointer z-10"
              aria-label="Đóng"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#79b8a7]/15 border border-[#79b8a7]/30 text-[#79b8a7] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] mb-3 sm:mb-4">
              {isLuckPrize ? (
                <>
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>Rất tiếc!</span>
                </>
              ) : (
                <>
                  <Trophy className="w-3.5 h-3.5 text-amber-300" />
                  <span>Chúc Mừng!</span>
                </>
              )}
            </div>

            {/* Product Image / Icon Showcase Pedestal */}
            <div className="relative my-2 sm:my-3 mx-auto w-28 h-28 sm:w-40 sm:h-40 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/15 p-2 sm:p-3 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
              {result.image ? (
                <div className="relative w-full h-full rounded-xl overflow-hidden flex items-center justify-center">
                  <Image
                    src={result.image}
                    alt={result.name}
                    fill
                    className="object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                    sizes="(max-width: 768px) 140px, 200px"
                  />
                </div>
              ) : isLuckPrize ? (
                <div className="flex flex-col items-center justify-center text-white/60 gap-2">
                  <div className="p-3 sm:p-4 rounded-full bg-white/5 border border-white/10 text-amber-400">
                    <HeartHandshake className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                </div>
              ) : (
                <div className="p-3 sm:p-4 rounded-full bg-[#79b8a7]/20 border border-[#79b8a7]/40 text-[#79b8a7]">
                  <Gift className="w-10 h-10 sm:w-12 sm:h-12" />
                </div>
              )}
            </div>

            {/* Prize Name */}
            <h3 className="text-xl sm:text-3xl font-display font-black uppercase text-white tracking-tight mt-2 sm:mt-3">
              {result.name}
            </h3>

            {/* Description */}
            <p className="text-[11px] sm:text-sm text-white/70 mt-1.5 sm:mt-2 px-1 sm:px-2 leading-relaxed">
              {result.description || "Phần thưởng đã sẵn sàng để bạn sử dụng ngay tại TOTO Barbershop."}
            </p>


            {/* Action CTA Button */}
            <Button
              className="w-full h-11 sm:h-12 mt-4 sm:mt-5 bg-[#79b8a7] hover:bg-[#88cbb9] active:scale-[0.98] text-[#07110f] font-black uppercase tracking-wider rounded-xl shadow-[0_8px_25px_rgba(121,184,167,0.35)] transition-all cursor-pointer text-xs sm:text-base"
              onClick={() => setResult(null)}
            >
              {isLuckPrize ? "Đồng ý" : "Nhận phần thưởng"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
