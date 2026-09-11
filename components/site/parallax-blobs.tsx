"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

export function ParallaxBlobs({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 60, damping: 20, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const blob1X = useTransform(smoothX, [-1, 1], [-24, 24]);
  const blob1Y = useTransform(smoothY, [-1, 1], [-16, 16]);
  const blob2X = useTransform(smoothX, [-1, 1], [18, -18]);
  const blob2Y = useTransform(smoothY, [-1, 1], [14, -14]);

  useEffect(() => {
    function handlePointerMove(e: PointerEvent) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      mouseX.set((e.clientX / w) * 2 - 1);
      mouseY.set((e.clientY / h) * 2 - 1);
    }
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [mouseX, mouseY]);

  return (
    <div ref={containerRef} className={className} aria-hidden>
      <motion.div
        style={{ x: blob1X, y: blob1Y }}
        className="animate-float-slow absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/25 blur-3xl"
      />
      <motion.div
        style={{ x: blob2X, y: blob2Y }}
        className="animate-float absolute right-0 top-24 h-80 w-80 rounded-full bg-[var(--brand-warm)]/20 blur-3xl"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--border)_1px,transparent_0)] bg-[size:28px_28px] opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />
    </div>
  );
}
