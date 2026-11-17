"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Intensity = "subtle" | "medium" | "strong";
interface BeamsBackgroundProps {
  className?: string;
  intensity?: Intensity;
}
interface Beam {
  x: number;
  y: number;
  width: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  hue: number;
  pulse: number;
}
const opacityMap: Record<Intensity, number> = {
  subtle: 0.7,
  medium: 0.85,
  strong: 1,
};

// Adapted from the supplied Beams example as a decorative overlay only.
export function BeamsBackground({
  className,
  intensity = "subtle",
}: BeamsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let beams: Beam[] = [];
    let frame = 0;
    let previousTime = 0;
    let inView = false;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (const beam of beams) {
        ctx.save();
        ctx.translate(beam.x, beam.y);
        ctx.rotate((beam.angle * Math.PI) / 180);
        const opacity =
          beam.opacity *
          (0.8 + Math.sin(beam.pulse) * 0.2) *
          opacityMap[intensity];
        const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);
        gradient.addColorStop(0, `hsla(${beam.hue}, 75%, 65%, 0)`);
        gradient.addColorStop(0.4, `hsla(${beam.hue}, 75%, 65%, ${opacity})`);
        gradient.addColorStop(0.6, `hsla(${beam.hue}, 75%, 65%, ${opacity})`);
        gradient.addColorStop(1, `hsla(${beam.hue}, 75%, 65%, 0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
        ctx.restore();
      }
    }

    function animate(time: number) {
      frame = 0;
      if (reducedMotion.matches || document.hidden || !inView) return;
      // Limit rendering to 30fps; motion speed is independent of display refresh rate.
      if (!previousTime || time - previousTime >= 1000 / 30) {
        const delta = previousTime
          ? Math.min((time - previousTime) / 1000, 0.1)
          : 0;
        previousTime = time;
        for (const beam of beams) {
          beam.y -= beam.speed * delta;
          beam.pulse += delta * 0.4;
          if (beam.y + beam.length < -100) {
            beam.y = height + 100;
            beam.x = Math.random() * width;
          }
        }
        draw();
      }
      frame = requestAnimationFrame(animate);
    }

    function syncAnimation() {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
      if (!reducedMotion.matches && !document.hidden && inView) {
        frame = requestAnimationFrame(animate);
      }
    }

    function resize() {
      if (!canvas || !container || !ctx) return;
      const bounds = container.getBoundingClientRect();
      if (bounds.width === width && bounds.height === height) return;
      width = bounds.width;
      height = bounds.height;
      if (!width || !height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      beams = Array.from({ length: width < 640 ? 8 : 14 }, (_, index) => ({
        x: (index / (width < 640 ? 8 : 14)) * width * 1.4 - width * 0.2,
        y: -height * (0.3 + Math.random() * 0.8),
        width: 35 + Math.random() * 65,
        length: height * 2.5,
        angle: -35 + Math.random() * 10,
        speed: 24 + Math.random() * 32,
        opacity: 0.12 + Math.random() * 0.12,
        hue: 195 + Math.random() * 55,
        pulse: Math.random() * Math.PI * 2,
      }));
      draw();
      syncAnimation();
    }

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncAnimation();
    });
    resize();
    resizeObserver.observe(container);
    intersectionObserver.observe(container);
    reducedMotion.addEventListener("change", syncAnimation);
    document.addEventListener("visibilitychange", syncAnimation);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      reducedMotion.removeEventListener("change", syncAnimation);
      document.removeEventListener("visibilitychange", syncAnimation);
    };
  }, [intensity]);

  return (
    <div className={cn("beams-background", className)} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
