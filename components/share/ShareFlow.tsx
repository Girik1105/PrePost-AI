//created by kinjal
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CaretLeft as ChevronLeft, CaretRight as ChevronRight, Hand, Pause, Play, ArrowCounterClockwise as RotateCcw } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import PhoneFrame from "@/components/prototype/PhoneFrame";
import { Gallery, ShareSheet, Viewer } from "./PhotosScreens";
import SafePostSheet from "./SafePostScreens";
import { Compose, Posted } from "./InstagramScreens";
import { STEPS, ShareFlowProvider, useFlow } from "./ShareFlowContext";

function Screens() {
  const { step, tap, screenRef } = useFlow();
  const layer = step === "gallery" || step === "viewer" || step === "sheet" ? "photos" : step === "compose" || step === "posted" ? "ig" : "safepost";

  return (
    <div ref={screenRef} className="absolute inset-0">
      <AnimatePresence initial={false} mode="popLayout">
        {layer === "photos" && (
          <motion.div key="photos" className="absolute inset-0" exit={{ opacity: 1 }}>
            {step === "gallery" ? <Gallery /> : <Viewer dimmed={step === "sheet"} />}
            <AnimatePresence>{step === "sheet" && <ShareSheet key="sheet" />}</AnimatePresence>
          </motion.div>
        )}
        {layer === "safepost" && (
          <motion.div key="safepost" className="absolute inset-0 bg-black" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.35 }}>
            {/* Photos stays behind the page sheet, pushed back like iOS does */}
            <motion.div
              className="absolute inset-0 origin-top overflow-hidden"
              initial={{ scale: 1, borderRadius: 0 }}
              animate={{ scale: 0.93, borderRadius: 14, y: 18 }}
              transition={{ type: "spring", stiffness: 300, damping: 34 }}
            >
              <Viewer dimmed />
              <div className="absolute inset-0 bg-black/30" />
            </motion.div>
            <SafePostSheet />
          </motion.div>
        )}
        {layer === "ig" && (
          <motion.div
            key="ig"
            className="absolute inset-0"
            initial={{ scale: 0.2, opacity: 0, borderRadius: 60 }}
            animate={{ scale: 1, opacity: 1, borderRadius: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 28 }}
          >
            {step === "compose" ? <Compose /> : <Posted />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* demo finger */}
      <AnimatePresence>
        {tap && (
          <motion.span
            key={tap.key}
            className="pointer-events-none absolute z-[60] h-[54px] w-[54px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/90 bg-black/25 shadow-[0_0_0_6px_rgba(255,255,255,0.25)]"
            style={{ left: tap.x, top: tap.y }}
            initial={{ scale: 1.6, opacity: 0 }}
            animate={{ scale: [1.6, 1, 0.85, 1.3], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.9, times: [0, 0.35, 0.5, 1] }}
            aria-hidden
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Phone() {
  const { step, touch } = useFlow();
  const light = step === "scan" || step === "review" || step === "done";
  return (
    <div onPointerDownCapture={touch}>
      <PhoneFrame statusTone={light ? "light" : "dark"} homeTone="dark" label="Share flow prototype">
        <Screens />
      </PhoneFrame>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex min-w-[26px] items-center justify-center rounded-md border border-line bg-card px-1.5 py-0.5 font-sans text-xs font-semibold text-ink shadow-[0_1px_0_rgb(var(--line))]">
      {children}
    </kbd>
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

function Controls() {
  const f = useFlow();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!rootRef.current?.offsetParent) return;
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, [contenteditable=true]") || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === "arrowright" || k === " ") {
        e.preventDefault();
        f.next();
      } else if (k === "arrowleft") {
        e.preventDefault();
        f.prev();
      } else if (k === "r") f.restart();
      else if (k === "p") f.togglePlay();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [f]);

  return (
    <div ref={rootRef} className="w-full max-w-xl">
      {!f.started ? (
        <div className="flex items-end gap-4">
          <Image src="/assets/brownie-camera.webp" alt="" width={110} height={150} className="h-[96px] w-auto animate-bob motion-reduce:animate-none sm:h-[112px]" />
          <button
            type="button"
            onClick={f.play}
            className="mb-3 inline-flex items-center gap-2.5 whitespace-nowrap rounded-full bg-compassion px-5 py-3.5 text-base font-semibold text-[#1E2440] shadow-lift transition-transform hover:-translate-y-0.5 sm:px-7 sm:py-4 sm:text-lg"
          >
            <Play className="h-5 w-5" weight="fill" aria-hidden /> Play the share flow
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <CtrlButton label="Previous step" onClick={f.prev}>
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </CtrlButton>
          <button type="button" onClick={f.togglePlay} className="inline-flex h-12 items-center gap-2 rounded-full bg-compassion px-6 font-semibold text-[#1E2440] shadow-soft">
            {f.playing ? <Pause className="h-5 w-5" weight="fill" aria-hidden /> : <Play className="h-5 w-5" weight="fill" aria-hidden />}
            {f.playing ? "Pause" : "Play"}
          </button>
          <CtrlButton label="Next step" onClick={f.next}>
            <ChevronRight className="h-5 w-5" aria-hidden />
          </CtrlButton>
          <CtrlButton label="Restart" onClick={f.restart}>
            <RotateCcw className="h-[18px] w-[18px]" aria-hidden />
          </CtrlButton>
        </div>
      )}

      <ol className="mt-8 space-y-1" aria-label="Steps">
        {STEPS.map((s, i) => {
          const now = i === f.index;
          const past = i < f.index;
          return (
            <li key={s.id} className={`rounded-2xl px-4 py-3 transition-colors ${now ? "bg-card shadow-soft" : ""}`} aria-current={now ? "step" : undefined}>
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    now ? "bg-compassion text-[#1E2440]" : past ? "bg-integrity/25 text-integrity-deep" : "bg-line text-muted"
                  }`}
                >
                  {i + 1}
                </span>
                <div>
                  <p className={`font-semibold ${now ? "text-ink" : past ? "text-ink/70" : "text-muted"}`}>{s.caption}</p>
                  <AnimatePresence initial={false}>
                    {now && (
                      <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden text-[15px] leading-relaxed text-muted">
                        {s.detail}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="mt-6 flex items-start gap-2 text-sm leading-relaxed text-muted">
        <Hand className="mt-0.5 h-4 w-4 shrink-0 text-compassion-deep" aria-hidden />
        Or tap through it yourself. The pulsing ring shows the next tap.
      </p>
      <div className="mt-4 hidden flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted sm:flex" aria-label="Keyboard shortcuts">
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

export default function ShareFlow() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <ShareFlowProvider>
      <section aria-labelledby="share-title" className="relative overflow-hidden bg-paper2 px-4 pb-20 pt-28 sm:px-6 sm:pb-28 sm:pt-32">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{ backgroundImage: "radial-gradient(rgb(var(--line)) 1.2px, transparent 1.2px)", backgroundSize: "22px 22px" }}
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-20">
          <div className="lg:col-start-2 lg:row-start-1">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-compassion-deep">From your camera roll</p>
            <h1 id="share-title" className="mt-3 text-balance font-display text-5xl font-medium leading-[1.05] tracking-tight text-ink sm:text-6xl">
              Check it from the share button.
            </h1>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted">
              Pick a photo, tap Share, tap SafePost. It cleans the photo and hands it to Instagram, ready to post.
            </p>
            <div className="mt-8 hidden lg:block">{mounted && <Controls />}</div>
          </div>
          <div className="mx-auto w-full max-w-[340px] lg:col-start-1 lg:row-start-1 lg:sticky lg:top-24">
            <Phone />
          </div>
          <div className="lg:hidden">{mounted && <Controls />}</div>
        </div>
      </section>
    </ShareFlowProvider>
  );
}
