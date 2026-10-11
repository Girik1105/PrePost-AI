//created by kinjal
"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUp, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useRef } from "react";
import { BRAND } from "@/lib/brand";
import WordReveal from "./WordReveal";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/#how", label: "How it works" },
      { href: "/#catches", label: "What it catches" },
      { href: "/share", label: "Share flow" },
      { href: "/check", label: "Check a photo" },
    ],
  },
  {
    title: "Why",
    links: [
      { href: "/#parents", label: "Made for parents" },
      { href: "/#privacy", label: "Privacy first" },
      { href: "/#principles", label: "Humanity 101" },
      { href: "/#roadmap", label: "What's next" },
    ],
  },
  {
    title: "Team",
    links: [
      { href: "/#team", label: `Team ${BRAND.team}` },
      { href: "/#top", label: BRAND.event },
    ],
  },
];

const RING = `${BRAND.tagline.toUpperCase()} · CHECK IT FIRST · `;

/** Circular text stamp that turns as the footer scrolls past (ported from the portfolio footer). */
function Stamp() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 220]);
  return (
    <div ref={ref} className="relative h-[220px] w-[220px] shrink-0 sm:h-[260px] sm:w-[260px]">
      <motion.svg viewBox="0 0 500 500" className="absolute inset-0 h-full w-full" style={reduce ? undefined : { rotate }} aria-hidden>
        <defs>
          <path id="footer-ring" d="M 250,250 m -200,0 a 200,200 0 1,1 400,0 a 200,200 0 1,1 -400,0" />
        </defs>
        <text className="fill-[#FBF6EE]/70" style={{ fontSize: 30, fontWeight: 600 }}>
          <textPath href="#footer-ring" textLength={1250} lengthAdjust="spacing">
            {RING}
          </textPath>
        </text>
      </motion.svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/assets/brownie-cloud.webp"
          alt="Brownie mascot sitting on a cloud"
          width={180}
          height={204}
          className="h-[46%] w-auto animate-bob motion-reduce:animate-none"
        />
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="footer-bg relative overflow-hidden px-4 pt-20 text-[#FBF6EE] sm:px-6 sm:pt-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-start justify-between gap-12 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <WordReveal className="text-balance font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-6xl">
              Everything posted online is ink. Check it first.
            </WordReveal>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="/check" className="inline-flex items-center gap-2 rounded-full bg-compassion px-6 py-3.5 font-semibold text-[#1E2440] transition-transform hover:-translate-y-0.5">
                Check a photo <ArrowUpRight size={18} weight="bold" aria-hidden />
              </a>
              <a href="/share" className="inline-flex items-center gap-2 rounded-full border border-[#FBF6EE]/25 px-6 py-3.5 font-semibold transition-colors hover:bg-[#FBF6EE]/10">
                See the share flow
              </a>
            </div>
          </div>
          <Stamp />
        </div>

        <div className="mt-20 grid gap-10 border-t border-[#FBF6EE]/15 pt-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="flex items-center gap-2 font-display text-2xl font-semibold">
              <Image src="/assets/brownie-wave.webp" alt="" width={32} height={37} className="h-8 w-auto" />
              {BRAND.name}
            </p>
            <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-[#FBF6EE]/70">
              A pre-post safety check for your photos. Built for kids, works for everyone.
            </p>
          </div>
          {COLUMNS.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FBF6EE]/50">{c.title}</p>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-[15px] text-[#FBF6EE]/85 underline-offset-4 transition-colors hover:text-[#FBF6EE] hover:underline">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-[#FBF6EE]/15 py-8 text-sm text-[#FBF6EE]/60 sm:flex-row sm:items-center">
          <span>
            Made with love by Team {BRAND.team} · {BRAND.event}. {BRAND.name} is a hackathon prototype.
          </span>
          <a href="#" className="inline-flex items-center gap-1.5 text-[#FBF6EE]/80 hover:text-[#FBF6EE]">
            Back to top <ArrowUp size={14} weight="bold" aria-hidden />
          </a>
        </div>
      </div>

      {/* oversized wordmark peeking off the bottom edge */}
      <p aria-hidden className="pointer-events-none select-none text-center font-display text-[26vw] font-semibold leading-[0.72] tracking-tight text-[#FBF6EE]/[0.06]">
        {BRAND.name}
      </p>
    </footer>
  );
}
