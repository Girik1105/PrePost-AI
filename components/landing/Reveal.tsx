//created by kinjal
"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

// Fades content up as it scrolls into view (opacity + transform only, so it stays on the compositor). No motion when reduced motion is on.
export default function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** render as the list item itself so <ul>/<ol> only ever contain <li> */
  as?: "div" | "li";
}) {
  const reduce = useReducedMotion();
  const Plain = as;
  if (reduce) return <Plain className={className}>{children}</Plain>;
  const Tag = as === "li" ? motion.li : motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </Tag>
  );
}
