"use client";

import { useEffect, useRef } from "react";

/**
 * A slowly evolving pressure-like scalar field rendered as isolines
 * (marching squares). It's decorative, so it is aria-hidden, pauses when
 * off-screen, and renders a single static frame under prefers-reduced-motion.
 */
type Centre = { x: number; y: number; vx: number; vy: number; amp: number; r: number };

const LEVELS = 22;

export function IsobarField({
  className = "",
  major = "rgba(255,255,255,0.55)",
  minor = "rgba(255,255,255,0.16)",
}: {
  className?: string;
  major?: string;
  minor?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = true;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Deterministic seed so the composition is the same on every load.
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const centres: Centre[] = Array.from({ length: 6 }, (_, i) => ({
      x: rand(),
      y: rand(),
      vx: (rand() - 0.5) * 0.00012,
      vy: (rand() - 0.5) * 0.00008,
      amp: (i % 2 === 0 ? 1 : -1) * (0.6 + rand() * 0.6),
      r: 0.18 + rand() * 0.22,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const field = (x: number, y: number, t: number) => {
      const aspect = w / Math.max(h, 1);
      let v = 0.15 * Math.sin(x * 2.1 + t * 0.00004) + 0.1 * Math.cos(y * 3.3 - t * 0.00003);
      for (const c of centres) {
        const dx = (x - c.x) * aspect;
        const dy = y - c.y;
        v += c.amp * Math.exp(-(dx * dx + dy * dy) / (2 * c.r * c.r));
      }
      return v;
    };

    const draw = (t: number) => {
      for (const c of centres) {
        c.x += c.vx;
        c.y += c.vy;
        if (c.x < -0.1 || c.x > 1.1) c.vx *= -1;
        if (c.y < -0.1 || c.y > 1.1) c.vy *= -1;
      }
      ctx.clearRect(0, 0, w, h);
      const cell = w < 640 ? 14 : 12;
      const cols = Math.ceil(w / cell) + 1;
      const rows = Math.ceil(h / cell) + 1;
      const grid = new Float32Array(cols * rows);
      let min = Infinity;
      let max = -Infinity;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const v = field(i / (cols - 1), j / (rows - 1), t);
          grid[j * cols + i] = v;
          if (v < min) min = v;
          if (v > max) max = v;
        }
      }

      for (let l = 1; l < LEVELS; l++) {
        const level = min + ((max - min) * l) / LEVELS;
        const isMajor = l % 5 === 0;
        ctx.beginPath();
        for (let j = 0; j < rows - 1; j++) {
          for (let i = 0; i < cols - 1; i++) {
            const a = grid[j * cols + i];
            const b = grid[j * cols + i + 1];
            const c = grid[(j + 1) * cols + i + 1];
            const d = grid[(j + 1) * cols + i];
            const idx = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0);
            if (idx === 0 || idx === 15) continue;
            const x = i * cell;
            const y = j * cell;
            const lerp = (p: number, q: number) => (level - p) / (q - p);
            const top = [x + cell * lerp(a, b), y] as const;
            const right = [x + cell, y + cell * lerp(b, c)] as const;
            const bottom = [x + cell * lerp(d, c), y + cell] as const;
            const left = [x, y + cell * lerp(a, d)] as const;
            const seg = (p: readonly [number, number], q: readonly [number, number]) => {
              ctx.moveTo(p[0], p[1]);
              ctx.lineTo(q[0], q[1]);
            };
            switch (idx) {
              case 1: case 14: seg(left, bottom); break;
              case 2: case 13: seg(bottom, right); break;
              case 3: case 12: seg(left, right); break;
              case 4: case 11: seg(top, right); break;
              case 6: case 9: seg(top, bottom); break;
              case 7: case 8: seg(left, top); break;
              case 5: seg(left, top); seg(bottom, right); break;
              case 10: seg(top, right); seg(left, bottom); break;
            }
          }
        }
        ctx.strokeStyle = isMajor ? major : minor;
        ctx.lineWidth = isMajor ? 1.1 : 0.8;
        ctx.stroke();
      }
    };

    const loop = (t: number) => {
      if (visible) draw(t);
      raf = requestAnimationFrame(loop);
    };

    resize();
    draw(0);
    if (!reduced) raf = requestAnimationFrame(loop);

    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [major, minor]);

  return <canvas ref={canvasRef} aria-hidden className={`pointer-events-none h-full w-full ${className}`} />;
}
