import type { CSSProperties } from "react";

const FLOATING_HEARTS = [
  { left: "6%", size: 18, duration: "19s", delay: "-3s", color: "text-rose-300/60" },
  { left: "14%", size: 26, duration: "24s", delay: "-11s", color: "text-pink-300/50" },
  { left: "23%", size: 14, duration: "16s", delay: "-6s", color: "text-rose-400/45" },
  { left: "34%", size: 22, duration: "22s", delay: "-15s", color: "text-pink-200/75" },
  { left: "45%", size: 16, duration: "17s", delay: "-8s", color: "text-rose-300/55" },
  { left: "58%", size: 24, duration: "25s", delay: "-18s", color: "text-rose-200/70" },
  { left: "67%", size: 15, duration: "18s", delay: "-2s", color: "text-pink-300/55" },
  { left: "77%", size: 28, duration: "23s", delay: "-12s", color: "text-rose-300/45" },
  { left: "86%", size: 17, duration: "20s", delay: "-7s", color: "text-pink-300/60" },
  { left: "93%", size: 21, duration: "21s", delay: "-14s", color: "text-rose-400/40" },
];

export function FloatingHearts() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Warm romantic aurora gradient mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,#ffe4ec_0%,transparent_48%),radial-gradient(circle_at_85%_18%,#ffedd5_0%,transparent_44%),radial-gradient(circle_at_50%_88%,#fce7f3_0%,transparent_52%),linear-gradient(180deg,#fff9fb_0%,#fff1f5_55%,#fff7f2_100%)]" />

      {/* Soft luminous orbs */}
      <div className="absolute -left-24 top-16 h-80 w-80 rounded-full bg-rose-200/40 blur-3xl" />
      <div className="absolute -right-24 top-32 h-96 w-96 rounded-full bg-amber-100/55 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-pink-200/35 blur-3xl" />

      {/* Gentle rising heart silhouettes */}
      {FLOATING_HEARTS.map((item, idx) => {
        const style = {
          left: item.left,
          bottom: "-40px",
          "--float-duration": item.duration,
          "--float-delay": item.delay,
        } as CSSProperties;

        return (
          <svg
            key={idx}
            viewBox="0 0 24 24"
            width={item.size}
            height={item.size}
            fill="currentColor"
            style={style}
            className={`animate-float-heart absolute ${item.color}`}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        );
      })}
    </div>
  );
}

