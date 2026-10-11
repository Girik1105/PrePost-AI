//created by kinjal
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

// Ported from the portfolio's "rotate" Copy effect: each word tips up from -90deg in 3D,
// in reading order, once, as the heading scrolls into view.
const word = {
  hidden: { opacity: 0, rotateX: -90 },
  show: { opacity: 1, rotateX: 0, transition: { duration: 0.75, ease: [0.215, 0.61, 0.355, 1] } },
};

function split(node: ReactNode, key = "w"): ReactNode {
  if (typeof node === "string") {
    return node.split(/(\s+)/).map((part, i) =>
      /^\s+$/.test(part) || !part ? (
        part
      ) : (
        <motion.span key={`${key}-${i}`} variants={word} className="inline-block will-change-transform" style={{ transformOrigin: "50% 50% -0.5em" }}>
          {part}
        </motion.span>
      ),
    );
  }
  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode }>;
    return cloneElement(el, undefined, ...Children.toArray(el.props.children).map((c, i) => split(c, `${key}-${i}`)));
  }
  return node;
}

export default function WordReveal({ children, className = "", as = "h2", stagger = 0.06 }: { children: ReactNode; className?: string; as?: "h1" | "h2" | "h3" | "p"; stagger?: number }) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  return (
    <Tag
      className={className}
      style={{ perspective: 700 }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ staggerChildren: stagger }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
    >
      {split(children)}
    </Tag>
  );
}
