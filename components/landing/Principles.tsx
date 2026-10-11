//created by kinjal
"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import SectionHeader from "./SectionHeader";

// Official Humanity 101 artwork (Hacks for Humanity / ASU Project Humanities) and the official one-line
// definitions from projecthumanities.asu.edu/our-mission/humanity-101/overview, quoted verbatim.
const PRINCIPLES = [
  {
    slug: "respect",
    name: "Respect",
    official: "Showing consideration and appreciation for others.",
    ours: "We protect a child's privacy before they're old enough to protect it themselves.",
    color: "#D9822B",
  },
  {
    slug: "self-reflection",
    name: "Self-reflection",
    official: "Thinking deeply about one's actions and motives.",
    ours: "One question before you post: would they be okay with this at 16?",
    color: "#2F2F83",
  },
  {
    slug: "integrity",
    name: "Integrity",
    official: "Being honest and having strong moral principles.",
    ours: "Privacy-first by design. Your photos stay yours, and we say exactly what we change.",
    color: "#1A682F",
  },
  {
    slug: "compassion",
    name: "Compassion",
    official: "Showing empathy and care for others",
    ours: "We help, we never shame. Sharing your kids is love. We just make it safer.",
    color: "#782B90",
  },
];

/** Black line art first, then the watercolor washes in from the center as the card scrolls into view. */
function Mandala({ slug, name, delay }: { slug: string; name: string; delay: number }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative mx-auto aspect-square w-40">
      <motion.div
        className="absolute inset-0"
        initial={reduce ? { opacity: 0 } : { opacity: 1 }}
        whileInView={{ opacity: 0 }}
        viewport={{ once: true, margin: "-25% 0px -25% 0px" }}
        transition={{ duration: 0.6, delay: delay + 1.1 }}
      >
        <Image src={`/assets/h4h/${slug}-black.webp`} alt="" fill sizes="160px" className="h4h-line object-contain" />
      </motion.div>
      <motion.div
        className="absolute inset-0"
        initial={reduce ? false : { clipPath: "circle(0% at 50% 50%)" }}
        whileInView={{ clipPath: "circle(75% at 50% 50%)" }}
        viewport={{ once: true, margin: "-25% 0px -25% 0px" }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay }}
      >
        <Image src={`/assets/h4h/${slug}-color.webp`} alt={`Humanity 101 ${name} mandala`} fill sizes="160px" className="object-contain" />
      </motion.div>
    </div>
  );
}

export default function Principles() {
  const reduce = useReducedMotion();
  return (
    <section id="principles" aria-labelledby="principles-title" className="bg-paper2/70 px-4 py-24 sm:px-6 sm:py-32">
      <SectionHeader
        eyebrow="Humanity 101"
        title={<span id="principles-title">The principles behind it.</span>}
        intro="Hacks for Humanity asks every project to live at least three of the seven Humanity 101 principles. PrePost is built on four."
      />

      <div className="mx-auto mt-16 grid max-w-6xl gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        {PRINCIPLES.map((p, i) => (
          <motion.article
            key={p.slug}
            className="flex flex-col text-center"
            initial={reduce ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
          >
            <Mandala slug={p.slug} name={p.name} delay={0.25 + i * 0.15} />
            <h3 className="mt-7 font-display text-2xl font-medium text-ink">{p.name}</h3>
            <blockquote className="mx-auto mt-3 max-w-[16rem]">
              <p className="font-display text-lg italic leading-snug" style={{ color: p.color }}>
                &ldquo;{p.official}&rdquo;
              </p>
            </blockquote>
            <span aria-hidden className="mx-auto mt-5 h-px w-10" style={{ background: p.color, opacity: 0.4 }} />
            <p className="mx-auto mt-5 max-w-[16rem] text-[15px] leading-relaxed text-muted">{p.ours}</p>
          </motion.article>
        ))}
      </div>

      <p className="mx-auto mt-16 max-w-xl text-center text-sm text-muted">
        Artwork and definitions from{" "}
        <a
          href="https://projecthumanities.asu.edu/our-mission/humanity-101/overview"
          className="underline underline-offset-4 hover:text-ink"
          target="_blank"
          rel="noreferrer"
        >
          Humanity 101
        </a>
        , ASU Project Humanities.
      </p>
    </section>
  );
}
