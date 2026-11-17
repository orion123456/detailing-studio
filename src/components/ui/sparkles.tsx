"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Container, ISourceOptions } from "@tsparticles/engine";
import { cn } from "@/lib/utils";

const Particles = dynamic(() => import("@tsparticles/react"), { ssr: false });
let engineInitialization: Promise<void> | undefined;
function initializeEngine() {
  engineInitialization ??= Promise.all([
    import("@tsparticles/react"),
    import("@tsparticles/slim"),
  ]).then(([{ initParticlesEngine }, { loadSlim }]) =>
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }),
  );
  return engineInitialization;
}

interface SparklesProps {
  id?: string;
  className?: string;
  particleColor?: string | string[];
  particleDensity?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
}
const defaultColors = ["#69717c", "#69717c", "#69717c", "#69717c", "#d9252a"];

export function SparklesCore({
  id,
  className,
  particleColor = defaultColors,
  particleDensity = 90,
  minSize = 0.8,
  maxSize = 2,
  speed = 0.35,
}: SparklesProps) {
  const generatedId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<Container | undefined>(undefined);
  const visibleRef = useRef(false);
  const reducedRef = useRef(true);
  const [ready, setReady] = useState(false);

  const syncAnimation = useCallback(() => {
    const container = containerRef.current;
    if (!container || container.destroyed) return;
    if (visibleRef.current && !reducedRef.current && !document.hidden) {
      container.play();
    } else {
      container.pause();
    }
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let cancelled = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      reducedRef.current = reduced.matches;
      syncAnimation();
    };
    updatePreference();
    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      if (entry.isIntersecting) {
        void initializeEngine().then(() => {
          if (!cancelled) setReady(true);
        });
      }
      syncAnimation();
    });
    observer.observe(root);
    reduced.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", syncAnimation);
    return () => {
      cancelled = true;
      observer.disconnect();
      reduced.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", syncAnimation);
      containerRef.current?.pause();
      containerRef.current = undefined;
    };
  }, [syncAnimation]);

  const particlesLoaded = useCallback(
    async (container?: Container) => {
      containerRef.current = container;
      // Paint one static frame even when animation is disabled.
      container?.draw(false);
      syncAnimation();
    },
    [syncAnimation],
  );

  const options = useMemo<ISourceOptions>(
    () => ({
      autoPlay: false,
      fullScreen: { enable: false },
      background: { color: "transparent" },
      fpsLimit: 30,
      detectRetina: true,
      pauseOnBlur: true,
      pauseOnOutsideViewport: true,
      interactivity: {
        events: { onClick: { enable: false }, onHover: { enable: false } },
      },
      particles: {
        color: { value: particleColor },
        number: {
          value: particleDensity,
          density: { enable: true, width: 1400, height: 800 },
        },
        shape: { type: "circle" },
        size: { value: { min: minSize, max: maxSize } },
        opacity: {
          value: { min: 0.12, max: 0.38 },
          animation: { enable: true, speed, sync: false, startValue: "random" },
        },
        move: {
          enable: true,
          speed: { min: 0.1, max: 0.3 },
          direction: "none",
          outModes: { default: "out" },
        },
        links: { enable: false },
      },
    }),
    [particleColor, particleDensity, minSize, maxSize, speed],
  );

  return (
    <div
      ref={rootRef}
      className={cn("sparkles-background", className)}
      aria-hidden="true"
    >
      {ready && (
        <Particles
          id={id ?? `sparkles-${generatedId.replace(/:/g, "")}`}
          options={options}
          particlesLoaded={particlesLoaded}
        />
      )}
    </div>
  );
}
