//created by kinjal
"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import SectionHeader from "./SectionHeader";

type Box = { x: number; y: number; w: number; h: number };

interface Risk {
  label: string;
  note: string;
  /** spots in the photo; tag is the label shown next to the spot when it's active */
  spots?: { box: Box; blur?: Box; tag: string }[];
  kind?: "file" | "private";
}

// Boxes are fractions of the 1024x1024 scene (AI-generated with Aside, no real people or brands).
const RISKS: Risk[] = [
  {
    label: "House numbers and addresses",
    note: "Porch numbers, mailboxes, street signs.",
    spots: [
      { box: { x: 0.602, y: 0.08, w: 0.102, h: 0.045 }, tag: "2417 points to her front door" },
      { box: { x: 0.005, y: 0.064, w: 0.114, h: 0.037 }, tag: "Juniper Ln names her street" },
    ],
  },
  { label: "License plates", note: "On the car in the driveway or the street.", spots: [{ box: { x: 0.904, y: 0.271, w: 0.066, h: 0.035 }, tag: "8KDL204 can track the car" }] },
  { label: "Name tags and full names", note: "Badges, backpack tags, cakes, jerseys.", spots: [{ box: { x: 0.306, y: 0.555, w: 0.081, h: 0.068 }, tag: "Her full name, readable" }] },
  { label: "Screens with emails or phone numbers", note: "Open laptops and phones in the shot.", spots: [{ box: { x: 0.48, y: 0.561, w: 0.283, h: 0.207 }, tag: "Her email and inbox" }] },
  { label: "Boarding passes and QR codes", note: "Booking codes and scannable tickets.", spots: [{ box: { x: 0.484, y: 0.77, w: 0.225, h: 0.096 }, tag: "Flight, seat and a booking QR" }] },
  { label: "Cards and IDs", note: "Bank cards, licenses, badges.", spots: [{ box: { x: 0.748, y: 0.838, w: 0.129, h: 0.07 }, tag: "A readable card number" }] },
  { label: "School names and uniforms", note: "Signs, crests, logos on a backpack.", spots: [{ box: { x: 0.84, y: 0.527, w: 0.088, h: 0.09 }, tag: "Maple Ridge Academy crest" }] },
  {
    label: "Bystander faces",
    note: "Optional. Blur people who didn't ask to be in it.",
    spots: [{ box: { x: 0.008, y: 0.236, w: 0.09, h: 0.166 }, blur: { x: 0.02, y: 0.236, w: 0.035, h: 0.04 }, tag: "A neighbor who didn't ask to be in it" }],
  },
  { label: "Location hidden in the file", note: "Your camera adds GPS on its own. SafePost strips it.", kind: "file" },
  { label: "Private moments", note: "Checked on your phone. Never uploaded.", kind: "private" },
];

const PINNED = RISKS.filter((r) => r.spots).length;
const pct = (v: number) => `${v * 100}%`;

export default function Detects() {
  const reduce = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const inView = useInView(stage, { once: true, margin: "-20% 0px -20% 0px" });
  const [active, setActive] = useState<number | null>(null);
  const [after, setAfter] = useState(false);
  const [touched, setTouched] = useState(false);

  // Once every pin is in, flip to the safe version by itself, one time.
  useEffect(() => {
    if (!inView || reduce || touched) return;
    const t = window.setTimeout(() => setAfter(true), 400 + PINNED * 90 + 1600);
    return () => window.clearTimeout(t);
  }, [inView, reduce, touched]);

  const flip = (v: boolean) => {
    setTouched(true);
    setAfter(v);
  };

  return (
    <section id="catches" aria-labelledby="catches-title" className="overflow-hidden px-4 py-24 sm:px-6 sm:py-32">
      <SectionHeader
        eyebrow="What it catches"
        title={<span id="catches-title">How many risks can you spot?</span>}
        intro="One ordinary selfie on the front steps. SafePost finds what strangers look for, then hides it."
        mascot="brownie-magnify"
        mascotAlt="Brownie mascot looking through a magnifying glass"
      />

      <div className="mx-auto mt-16 grid max-w-6xl items-start gap-12 lg:grid-cols-[7fr_5fr] lg:gap-14">
        {/* the scene */}
        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div role="radiogroup" aria-label="Show the photo" className="flex rounded-full border border-line bg-paper2 p-1">
              {[
                { v: false, l: "Before" },
                { v: true, l: "After SafePost" },
              ].map((o) => (
                <button
                  key={o.l}
                  type="button"
                  role="radio"
                  aria-checked={after === o.v}
                  onClick={() => flip(o.v)}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${after === o.v ? "bg-card text-ink shadow-soft" : "text-muted hover:text-ink"}`}
                >
                  {o.l}
                </button>
              ))}
            </div>
            <p className="text-sm text-muted">
              <span className="font-display text-lg font-semibold text-ink">{PINNED + 1}</span> things in one selfie
            </p>
          </div>

          <div ref={stage} className="relative -rotate-1 rounded-[28px] bg-card p-2.5 shadow-lift sm:p-3">
            <div className="relative aspect-square overflow-hidden rounded-[20px]">
              <Image
                src="/assets/catches/porch-scene.webp"
                alt="A woman taking a selfie on her front steps, with a house number, street sign, license plate, name badge, open laptop, boarding pass, bank card, school backpack and a neighbor in view"
                fill
                sizes="(min-width: 1024px) 620px, 92vw"
                className="object-cover"
              />

              {RISKS.map((r, i) =>
                r.spots?.map((s, j) => {
                  const on = active === i;
                  const b = s.blur ?? s.box;
                  return (
                    <div key={`${i}-${j}`}>
                      {/* blur layer for the After state */}
                      <motion.div
                        aria-hidden
                        className="absolute rounded-md"
                        style={{ left: pct(b.x), top: pct(b.y), width: pct(b.w), height: pct(b.h), backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", background: "rgba(255,255,255,0.08)" }}
                        initial={false}
                        animate={{ opacity: after ? 1 : 0 }}
                        transition={{ duration: 0.6, delay: after && !reduce ? i * 0.07 : 0 }}
                      />
                      {/* outline when active */}
                      <motion.div
                        aria-hidden
                        className="pointer-events-none absolute rounded-lg border-2 border-dashed border-compassion"
                        style={{ left: pct(s.box.x - 0.006), top: pct(s.box.y - 0.006), width: pct(s.box.w + 0.012), height: pct(s.box.h + 0.012) }}
                        initial={false}
                        animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 1.06 }}
                        transition={{ duration: 0.25 }}
                      />
                      <AnimatePresence>
                        {on && j === 0 && (
                          <motion.span
                            className="pointer-events-none absolute z-20 whitespace-nowrap rounded-lg bg-card px-2.5 py-1 text-[13px] font-medium text-ink shadow-lift"
                            style={{
                              left: pct(Math.min(s.box.x, 0.62)),
                              top: s.box.y > 0.75 ? `calc(${pct(s.box.y)} - 34px)` : `calc(${pct(s.box.y + s.box.h)} + 8px)`,
                            }}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                          >
                            {s.tag}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {/* numbered pin */}
                      <motion.button
                        type="button"
                        aria-label={`${i + 1}. ${r.label}: ${s.tag}`}
                        aria-pressed={on}
                        onMouseEnter={() => setActive(i)}
                        onMouseLeave={() => setActive(null)}
                        onFocus={() => setActive(i)}
                        onBlur={() => setActive(null)}
                        onClick={() => setActive(on ? null : i)}
                        className={`absolute z-10 grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full font-display text-sm font-semibold shadow-soft ring-2 ring-white transition-colors ${
                          after ? "bg-integrity text-paper" : "bg-compassion text-[#1E2440]"
                        }`}
                        style={{ left: pct(s.box.x), top: pct(s.box.y) }}
                        initial={reduce ? false : { scale: 0, opacity: 0 }}
                        animate={inView || reduce ? { scale: 1, opacity: 1 } : {}}
                        transition={{ type: "spring", stiffness: 400, damping: 22, delay: reduce ? 0 : 0.4 + i * 0.09 }}
                      >
                        {after ? "✓" : i + 1}
                      </motion.button>
                    </div>
                  );
                }),
              )}

              {/* location chip: the risk you can't see */}
              <motion.span
                className="absolute bottom-3 left-3 z-10 rounded-full bg-[#1E2440]/80 px-3 py-1 font-mono text-[11px] text-white backdrop-blur"
                initial={false}
                animate={{ opacity: after ? 0.9 : 1 }}
              >
                {after ? "GPS removed" : "GPS 37.77°N, 122.41°W"}
              </motion.span>
            </div>
          </div>
          <p className="mt-6 text-center font-display text-lg italic text-ink/70">Most people spot two or three. SafePost spots all of them.</p>
        </div>

        {/* the list */}
        <ol className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1" aria-label="What SafePost looks for">
          {RISKS.map((r, i) => {
            const on = active === i;
            const pinned = !!r.spots;
            return (
              <motion.li
                key={r.label}
                initial={reduce ? false : { opacity: 0, x: 16 }}
                animate={inView || reduce ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: reduce ? 0 : 0.3 + i * 0.07 }}
              >
                <div
                  onMouseEnter={() => pinned && setActive(i)}
                  onMouseLeave={() => pinned && setActive(null)}
                  className={`flex items-start gap-3 rounded-2xl px-3 py-2.5 transition-colors ${on ? "bg-card shadow-soft" : ""} ${r.kind === "private" ? "bg-integrity/10" : ""}`}
                >
                  <span
                    className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full font-display text-xs font-semibold transition-colors duration-500 ${
                      !pinned
                        ? r.kind === "private"
                          ? "bg-integrity text-paper"
                          : "bg-respect text-paper"
                        : inView || reduce
                          ? after
                            ? "bg-integrity text-paper"
                            : "bg-compassion text-[#1E2440]"
                          : "bg-line text-muted"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-[17px] font-medium leading-snug text-ink">{r.label}</p>
                    <p className="text-sm leading-snug text-muted">{r.note}</p>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
