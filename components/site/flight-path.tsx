"use client";

import { motion } from "motion/react";

const PATH = "M 20 210 C 90 130, 150 190, 210 110 S 330 40, 390 30";

export function FlightPath({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 410 230"
      fill="none"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="route-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id="pin-glow" r="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <path
        d={PATH}
        stroke="var(--border)"
        strokeWidth="2"
        strokeDasharray="1 8"
        strokeLinecap="round"
      />

      <motion.path
        d={PATH}
        stroke="url(#route-line)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      />

      <circle cx="20" cy="210" r="16" fill="url(#pin-glow)" />
      <motion.circle
        cx="20"
        cy="210"
        r="5"
        fill="var(--primary)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      />

      <motion.circle
        cx="390"
        cy="30"
        r="16"
        fill="url(#pin-glow)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 2 }}
      />
      <motion.circle
        cx="390"
        cy="30"
        r="5"
        fill="var(--brand-warm)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 2, type: "spring" }}
      />

      <motion.g
        initial={{ offsetDistance: "0%", opacity: 0 }}
        animate={{ offsetDistance: "100%", opacity: 1 }}
        transition={{
          offsetDistance: { duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 },
          opacity: { duration: 0.3, delay: 0.3 },
        }}
        style={{ offsetPath: `path("${PATH}")`, offsetRotate: "auto" }}
      >
        <path d="M -3 -6 L 14 0 L -3 6 L 1 0 Z" fill="var(--foreground)" />
      </motion.g>
    </svg>
  );
}
