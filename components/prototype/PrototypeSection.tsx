//created by kinjal
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CaretLeft as ChevronLeft, CaretRight as ChevronRight, Hand, Pause, Play, ArrowCounterClockwise as RotateCcw } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import PhoneScreens from "./PhoneScreens";
import { ProtoProvider, useProto } from "./PrototypeController";

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex min-w-[26px] items-center justify-center rounded-md border border-line bg-card px-1.5 py-0.5 font-sans text-xs font-semibold text-ink shadow-[0_1px_0_rgb(var(--line))]">
      {children}
    </kbd>
  );
}

function Controls({ sectionRef }: { sectionRef: React.RefObject<HTMLElement> }) {
  const { demo, reset } = useProto();
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const total = demo.steps.length;
  const current = demo.steps[demo.step];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting && e.intersectionRatio > 0.35), { threshold: [0, 0.35, 0.6] });
    io.observe(el);
    return () => io.disconnect();
  }, [sectionRef]);

  // Presenter keys, only while the demo section is on screen.
  useEffect(() => {
    if (!inView) return;
    const onKey = (e: KeyboardEvent) => {
      // Two copies of the controls exist (desktop and mobile layout). Only the visible one listens.
      if (!rootRef.current?.offsetParent) return;
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, [contenteditable=true], [role=slider]") || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === "arrowright" || k === " ") {
        e.preventDefault();
        demo.next();
      } else if (k === "arrowleft") {
        e.preventDefault();
        demo.prev();
      } else if (k === "r") demo.restart();
      else if (k === "p") demo.toggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inView, demo]);

  return (
    <div ref={rootRef} className="flex w-full max-w-xl flex-col">
      {!demo.active ? (
        <div>
          <div className="flex items-end gap-4">
            <Image src="/assets/brownie-camera.webp" alt="" width={110} height={150} className="h-[96px] w-auto sm:h-[116px] animate-bob motion-reduce:animate-none" />
            <button
              type="button"
              onClick={demo.start}
              className="mb-3 inline-flex items-center gap-2.5 whitespace-nowrap rounded-full bg-compassion px-5 py-3.5 text-base font-semibold sm:px-7 sm:py-4 sm:text-lg text-[#1E2440] shadow-lift transition-transform hover:-translate-y-0.5 motion-reduce:transition-none"
            >
              <Play className="h-5 w-5" weight="fill" aria-hidden />
              Play the 2-minute demo
            </button>
          </div>
          <p className="mt-6 flex items-start gap-2 text-base leading-relaxed text-muted">
            <Hand className="mt-1 h-4 w-4 shrink-0 text-compassion-deep" aria-hidden />
            Or tap around the phone. It works like the real app. Look for the soft pulsing ring to see where to tap next.
          </p>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold uppercase tracking-[0.14em] text-compassion-deep">
              Step {demo.step + 1} of {total}
            </span>
            <span className="flex gap-1.5" aria-hidden>
              {demo.steps.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  tabIndex={-1}
                  onClick={() => demo.goto(i)}
                  className={`h-2 rounded-full transition-all ${i === demo.step ? "w-6 bg-compassion" : i < demo.step ? "w-2 bg-compassion/50" : "w-2 bg-line"}`}
                />
              ))}
            </span>
          </div>
          <div className="relative mt-4 min-h-[170px] sm:min-h-[150px]" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div key={demo.step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
                <p className="text-balance font-display text-3xl font-medium leading-tight tracking-tight text-ink sm:text-4xl">{current.caption}</p>
                <p className="mt-3 text-lg leading-relaxed text-muted">{current.detail}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          {/* progress for the current step */}
          <div className="mt-4 h-1 overflow-hidden rounded-full bg-line">
            <motion.div
              key={`${demo.step}-${demo.playing}`}
              className="h-full bg-compassion"
              initial={{ width: demo.playing ? "0%" : "100%" }}
              animate={{ width: "100%" }}
              transition={{ duration: demo.playing ? current.duration / 1000 : 0, ease: "linear" }}
            />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <CtrlButton label="Previous step" onClick={demo.prev}>
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </CtrlButton>
            <button
              type="button"
              onClick={demo.toggle}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-compassion px-6 font-semibold text-[#1E2440] shadow-soft"
            >
              {demo.playing ? <Pause className="h-5 w-5" weight="fill" aria-hidden /> : <Play className="h-5 w-5" weight="fill" aria-hidden />}
              {demo.playing ? "Pause" : "Play"}
            </button>
            <CtrlButton label="Next step" onClick={demo.next}>
              <ChevronRight className="h-5 w-5" aria-hidden />
            </CtrlButton>
            <CtrlButton label="Restart demo" onClick={demo.restart}>
              <RotateCcw className="h-[18px] w-[18px]" aria-hidden />
            </CtrlButton>
            <button type="button" onClick={reset} className="ml-1 rounded-full px-3 py-2 text-sm font-medium text-muted underline-offset-4 hover:underline">
              Exit demo and explore
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 hidden flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted sm:flex" aria-label="Keyboard shortcuts">
        <span className="flex items-center gap-1.5">
          <Kbd>→</Kbd>
          <Kbd>Space</Kbd> next
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd>←</Kbd> back
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd>P</Kbd> play / pause
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd>R</Kbd> restart
        </span>
      </div>
    </div>
  );
}

function CtrlButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-card text-ink shadow-soft transition-colors hover:bg-paper"
    >
      {children}
    </button>
  );
}

export default function PrototypeSection() {
  const ref = useRef<HTMLElement>(null);
  return (
    <section
      id="demo"
      ref={ref}
      aria-labelledby="demo-title"
      className="relative overflow-hidden bg-paper2 px-4 py-20 sm:px-6 sm:py-28 lg:min-h-screen"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{ backgroundImage: "radial-gradient(rgb(var(--line)) 1.2px, transparent 1.2px)", backgroundSize: "22px 22px" }}
        aria-hidden
      />
      <Image src="/assets/cloud-a.webp" alt="" width={400} height={258} className="pointer-events-none absolute -left-24 top-10 w-[300px] opacity-60" aria-hidden />
      <Image src="/assets/cloud-b.webp" alt="" width={500} height={130} className="pointer-events-none absolute -right-20 bottom-16 w-[420px] opacity-50" aria-hidden />

      <ProtoProvider>
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-20">
          <div className="order-2 mx-auto w-full max-w-[340px] lg:order-1">
            <PhoneScreens />
            <p className="mt-6 text-center">
              <a href="/check" className="text-sm font-semibold text-compassion-deep underline decoration-compassion/40 underline-offset-4 hover:decoration-compassion">
                Try it on your own photo
              </a>
            </p>
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-compassion-deep">The prototype</p>
            <h2 id="demo-title" className="mt-3 font-display text-5xl font-medium leading-[1.05] tracking-tight text-ink sm:text-6xl">
              Try it.
            </h2>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted lg:mb-8">
              This is SafePost on a phone. Watch the guided story, or take it for a spin yourself.
            </p>
            <div className="hidden lg:block">
              <Controls sectionRef={ref} />
            </div>
          </div>
          {/* On small screens the controls sit under the phone so captions and screen stay close. */}
          <div className="order-3 lg:hidden">
            <Controls sectionRef={ref} />
          </div>
        </div>
      </ProtoProvider>
    </section>
  );
}
