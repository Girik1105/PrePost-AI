//created by kinjal
"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { RedactStyle } from "@/lib/redact";
import { FINDINGS } from "./photos";

export type StepId = "gallery" | "viewer" | "sheet" | "scan" | "review" | "done" | "compose" | "posted";

export interface Step {
  id: StepId;
  caption: string;
  detail: string;
  /** how long the guided demo waits before tapping the highlighted control. 0 = the screen moves on by itself */
  wait: number;
}

export const STEPS: Step[] = [
  { id: "gallery", caption: "Open a photo in your gallery.", detail: "Nothing new to learn. You start where you always do, in Photos.", wait: 3200 },
  { id: "viewer", caption: "Tap Share.", detail: "The same button you'd press to send it to a friend or post it.", wait: 2800 },
  { id: "sheet", caption: "PrePost is right there in the share sheet.", detail: "It sits next to Messages and Instagram, so checking first costs one tap.", wait: 3000 },
  { id: "scan", caption: "It checks the photo first.", detail: "Location data comes off, then it looks for names, numbers and places.", wait: 0 },
  { id: "review", caption: "You see what it found, and why.", detail: "A house number, a street sign, a family name and a plate. You choose what to hide and how.", wait: 6500 },
  { id: "done", caption: "A clean copy, ready to post.", detail: "The details are baked out of the pixels and the location is stripped. The original stays untouched.", wait: 4200 },
  { id: "compose", caption: "Post it to Instagram.", detail: "PrePost hands the clean copy straight to Instagram's new post screen.", wait: 5200 },
  { id: "posted", caption: "Shared. Your address stayed home.", detail: "Same photo, same smile. Nothing in it points to where she lives.", wait: 0 },
];

interface Tap {
  x: number;
  y: number;
  key: number;
}

interface Ctx {
  step: StepId;
  index: number;
  go: (id: StepId) => void;
  style: RedactStyle;
  setStyle: (s: RedactStyle) => void;
  hidden: Record<string, boolean>;
  toggle: (id: string) => void;
  safeUrl: string | null;
  setSafeUrl: (u: string | null) => void;
  playing: boolean;
  started: boolean;
  driven: boolean;
  tap: Tap | null;
  screenRef: React.RefObject<HTMLDivElement>;
  play: () => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  restart: () => void;
  touch: () => void;
}

const C = createContext<Ctx | null>(null);

export function useFlow() {
  const v = useContext(C);
  if (!v) throw new Error("useFlow outside ShareFlowProvider");
  return v;
}

const allOn = () => Object.fromEntries(FINDINGS.map((f) => [f.id, true]));

export function ShareFlowProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<StepId>("gallery");
  const [style, setStyle] = useState<RedactStyle>("blur");
  const [hidden, setHidden] = useState<Record<string, boolean>>(allOn);
  const [safeUrl, setSafeUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [tap, setTap] = useState<Tap | null>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const index = STEPS.findIndex((s) => s.id === step);

  const go = useCallback((id: StepId) => setStep(id), []);
  const toggle = useCallback((id: string) => setHidden((h) => ({ ...h, [id]: !h[id] })), []);

  const reset = useCallback((to: StepId = "gallery") => {
    setHidden(allOn());
    setStyle("blur");
    setStep(to);
  }, []);

  /** Shows a finger tap on the highlighted control, then presses it for real. */
  const autoTap = useCallback(() => {
    const screen = screenRef.current;
    const el = screen?.querySelector<HTMLElement>('[data-tap="next"]');
    if (!screen || !el) return false;
    const s = screen.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const scale = s.width / 390;
    setTap({ x: (r.left + r.width / 2 - s.left) / scale, y: (r.top + r.height / 2 - s.top) / scale, key: Date.now() });
    window.setTimeout(() => el.click(), 420);
    return true;
  }, []);

  // guided demo: wait, then tap
  useEffect(() => {
    if (!playing) return;
    const wait = STEPS[index].wait;
    if (!wait) {
      if (step === "posted") {
        const t = window.setTimeout(() => setPlaying(false), 4000);
        return () => window.clearTimeout(t);
      }
      return;
    }
    const t = window.setTimeout(autoTap, wait);
    return () => window.clearTimeout(t);
  }, [playing, step, index, autoTap]);

  const play = useCallback(() => {
    setStarted(true);
    reset("gallery");
    setPlaying(true);
  }, [reset]);

  const toggleP = useCallback(() => {
    setStarted(true);
    setPlaying((p) => !p);
  }, []);

  const next = useCallback(() => {
    setStarted(true);
    if (!autoTap() && index < STEPS.length - 1) setStep(STEPS[index + 1].id);
  }, [autoTap, index]);

  const prev = useCallback(() => {
    setStarted(true);
    const target = STEPS[Math.max(0, index - 1)].id;
    // scanning is a passing state, so stepping back from review lands on the share sheet
    setStep(target === "scan" ? "sheet" : target);
  }, [index]);

  const restart = useCallback(() => {
    reset("gallery");
    setStarted(true);
    setPlaying(true);
  }, [reset]);

  const touch = useCallback(() => setPlaying(false), []);

  const value = useMemo<Ctx>(
    () => ({
      step,
      index,
      go,
      style,
      setStyle,
      hidden,
      toggle,
      safeUrl,
      setSafeUrl,
      playing,
      started,
      driven: playing,
      tap,
      screenRef,
      play,
      togglePlay: toggleP,
      next,
      prev,
      restart,
      touch,
    }),
    [step, index, go, style, hidden, toggle, safeUrl, playing, started, tap, play, toggleP, next, prev, restart, touch],
  );

  return <C.Provider value={value}>{children}</C.Provider>;
}
