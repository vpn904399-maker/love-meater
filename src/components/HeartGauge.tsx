"use client";

import { useEffect, useId, useState } from "react";

interface HeartGaugeProps {
  targetScore: number;
  accentHex: string;
}

const HEART_PATH =
  "M100 174C100 174 18 122 18 62.5C18 32.5 41.5 14 66.5 14C82.4 14 94.8 22.8 100 34.4C105.2 22.8 117.6 14 133.5 14C158.5 14 182 32.5 182 62.5C182 122 100 174 100 174Z";

export function HeartGauge({ targetScore, accentHex }: HeartGaugeProps) {
  const clipId = useId();
  const gradId = useId();
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setAnimatedScore(targetScore);
      return;
    }

    let rafId = 0;
    const duration = 1150;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic for a dramatic, satisfying climb
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * targetScore));

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    setAnimatedScore(0);
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [targetScore]);

  // Map 0..100% into the visual heart cavity (bottom y=172 to full top y=6)
  const liquidTopY = 172 - (animatedScore / 100) * 166;

  return (
    <div className="relative mx-auto flex h-56 w-60 items-center justify-center sm:h-60 sm:w-64">
      {/* Soft ambient aura behind the heart */}
      <div
        className="absolute inset-4 rounded-full opacity-35 blur-2xl transition-colors duration-500"
        style={{ backgroundColor: accentHex }}
      />

      <svg
        viewBox="0 0 200 185"
        className="animate-pulse-heart relative h-full w-full drop-shadow-[0_14px_30px_rgba(225,29,72,0.22)]"
        role="img"
        aria-label={`Love compatibility meter showing ${targetScore} percent`}
      >
        <defs>
          <clipPath id={clipId}>
            <path d={HEART_PATH} />
          </clipPath>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="50%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>
        </defs>

        {/* Heart shell */}
        <path
          d={HEART_PATH}
          fill="#fff1f4"
          stroke="#fecdd3"
          strokeWidth="4"
        />

        {/* Liquid fill clipped inside heart */}
        <g clipPath={`url(#${clipId})`}>
          <g
            style={{
              transform: `translateY(${liquidTopY}px)`,
              transition: "transform 80ms linear",
            }}
          >
            {/* Back wave */}
            <g className="animate-wave-back opacity-55">
              <path
                d="M0 0 Q 25 -10 50 0 T 100 0 T 150 0 T 200 0 T 250 0 T 300 0 T 350 0 T 400 0 V 210 H 0 Z"
                fill="#fda4af"
              />
            </g>

            {/* Front liquid wave */}
            <g className="animate-wave-front">
              <path
                d="M0 2 Q 25 11 50 2 T 100 2 T 150 2 T 200 2 T 250 2 T 300 2 T 350 2 T 400 2 V 210 H 0 Z"
                fill={`url(#${gradId})`}
              />
            </g>
          </g>
        </g>

        {/* Subtle outer stroke & glass highlight */}
        <path
          d={HEART_PATH}
          fill="none"
          stroke="rgba(244, 63, 94, 0.35)"
          strokeWidth="3"
        />
        <path
          d="M44 43 C 34 52, 31 66, 35 78"
          fill="none"
          stroke="rgba(255,255,255,0.72)"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>

      {/* High-contrast frosted medallion for percentage readout */}
      <div className="pointer-events-none absolute flex h-24 w-24 flex-col items-center justify-center rounded-full border border-white/90 bg-white/88 shadow-[0_8px_24px_rgba(136,19,55,0.16)] backdrop-blur-md">
        <span className="font-display text-3xl font-extrabold tracking-tight text-rose-950 sm:text-4xl">
          {animatedScore}
          <span className="text-lg font-bold text-rose-600">%</span>
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-rose-500">
          Match
        </span>
      </div>
    </div>
  );
}

