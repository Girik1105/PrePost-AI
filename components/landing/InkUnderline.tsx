//created by kinjal
"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

// A hand-drawn ink stroke that draws itself under a word.
export default function InkUnderline({
  children,
  color = "rgb(var(--compassion))",
  delay = 0.4,
}: {
  children: ReactNode;
  color?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <span className="relative inline-block whitespace-nowrap">
      <span className="relative z-10">{children}</span>
      <svg
        aria-hidden
        viewBox="0 0 300 24"
        preserveAspectRatio="none"
        className="absolute -bottom-[0.12em] left-[-2%] z-0 h-[0.38em] w-[104%]"
      >
        <motion.path
          d="M4 15 C 50 6, 95 19, 150 11 S 250 5, 296 13"
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0, opacity: 0.4 }}
          whileInView={{ pathLength: 1, opacity: 0.85 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeInOut", delay }}
        />
        <motion.path
          d="M30 20 C 90 15, 170 21, 270 16"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.5 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeInOut", delay: delay + 0.5 }}
        />
      </svg>
    </span>
  );
}
