"use client";

import { useEffect, useRef } from "react";

interface HeartBurstProps {
  triggerKey: string;
  score: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vr: number;
  alpha: number;
  color: string;
  isHeart: boolean;
}

const COLORS = ["#f43f5e", "#ec4899", "#fb7185", "#f59e0b", "#fda4af"];

export function HeartBurst({ triggerKey, score }: HeartBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const count = score >= 75 ? 46 : score >= 50 ? 28 : 16;
    const originX = width / 2;
    const originY = Math.min(height * 0.42, 360);

    const particles: Particle[] = Array.from({ length: count }, (_, i) => {
      const angle =
        -Math.PI / 2 + ((Math.random() - 0.5) * Math.PI * 1.25);
      const speed = 3.5 + Math.random() * 6.5;
      return {
        x: originX + (Math.random() - 0.5) * 40,
        y: originY + (Math.random() - 0.5) * 24,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: 6 + Math.random() * 8,
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.14,
        alpha: 1,
        color: COLORS[i % COLORS.length],
        isHeart: i % 4 !== 0,
      };
    });

    let rafId = 0;

    const drawHeart = (size: number) => {
      const s = size * 0.5;
      ctx.beginPath();
      ctx.moveTo(0, s * 0.4);
      ctx.bezierCurveTo(s * 0.1, -s * 0.6, s * 1.4, -s * 0.4, 0, s * 1.2);
      ctx.bezierCurveTo(-s * 1.4, -s * 0.4, -s * 0.1, -s * 0.6, 0, s * 0.4);
      ctx.closePath();
      ctx.fill();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      let alive = false;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.vx *= 0.99;
        p.rotation += p.vr;
        p.alpha -= 0.014;

        if (p.alpha <= 0) continue;
        alive = true;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.isHeart) {
          drawHeart(p.size);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.35, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (alive) {
        rafId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [triggerKey, score]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30"
    />
  );
}

