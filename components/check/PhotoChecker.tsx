//created by kinjal
"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronsLeftRight, Download, ImagePlus, MapPinOff, RotateCcw, ScanSearch, SquareDashedMousePointer, Trash2, Upload } from "lucide-react";
import { CATEGORY_ICON } from "@/components/prototype/screens/Detail";
import { VERDICT_LABEL, scoreWord, type Category, type Verdict } from "@/lib/scenes";
import { redact, type Box, type RedactStyle } from "@/lib/redact";

interface Item {
  id: string;
  label: string;
  category: Category;
  reason?: string;
  box: Box;
  hidden: boolean;
  manual?: boolean;
}

interface Summary {
  exposureScore: number;
  verdict: Exclude<Verdict, null> | null;
  whyItMatters: string;
}

type Phase = "idle" | "scanning" | "ready" | "error";
type Tool = "compare" | "draw";

const STYLES: { id: RedactStyle; label: string }[] = [
  { id: "blur", label: "Blur" },
  { id: "pixelate", label: "Pixelate" },
  { id: "erase", label: "Erase" },
];

const STATUS = ["Removing location data", "Looking for names, numbers and places", "Deciding what to hide"];

const STEPS = [
  { Icon: MapPinOff, title: "Location comes off", body: "Your browser strips GPS, device and time data before anything is sent." },
  { Icon: ScanSearch, title: "Risky details get found", body: "Names, numbers, cards, signs, plus anything you mark yourself." },
  { Icon: Download, title: "You save a clean copy", body: "Blur, pixelate or erase each one, then download the safe version." },
];

const VERDICT_INK: Record<Exclude<Verdict, null>, string> = { safe: "ink-safe", caution: "ink-caution", dont_post: "ink-danger" };

/** Redraws the photo on a canvas, which drops EXIF (location, device, time). */
function toJpeg(bitmap: ImageBitmap, maxSide: number, quality: number): string {
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", quality);
}

function scoreInk(score: number) {
  if (score >= 80) return "text-danger";
  if (score >= 40) return "text-caution";
  return "text-safe";
}

function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${on ? "bg-integrity" : "bg-line"}`}
    >
      <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-[left] ${on ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { id: T; label: string; icon?: React.ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex rounded-full border border-line bg-paper2 p-1">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={`inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
            value === o.id ? "bg-card text-ink shadow-soft" : "text-muted hover:text-ink"
          }`}
        >
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function PhotoChecker() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [fileName, setFileName] = useState("photo");
  const [original, setOriginal] = useState<string | null>(null);
  const [safe, setSafe] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [style, setStyle] = useState<RedactStyle>("blur");
  const [tool, setTool] = useState<Tool>("compare");
  const [split, setSplit] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState(0);
  const [draft, setDraft] = useState<Box | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const drawStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    fetch("/api/scan")
      .then((r) => r.json())
      .then((d) => setEnabled(!!d.enabled))
      .catch(() => setEnabled(false));
  }, []);

  // Step through the status lines while the scan runs.
  useEffect(() => {
    if (phase !== "scanning") return;
    setStatus(0);
    const t = setInterval(() => setStatus((s) => Math.min(s + 1, STATUS.length - 1)), 2200);
    return () => clearInterval(t);
  }, [phase]);

  // Bake the current choices into a fresh safe copy.
  useEffect(() => {
    if (!original || phase !== "ready") return;
    let stale = false;
    redact(original, items.filter((i) => i.hidden).map((i) => i.box), style)
      .then((url) => !stale && setSafe(url))
      .catch(() => !stale && setSafe(null));
    return () => {
      stale = true;
    };
  }, [original, items, style, phase]);

  const reset = () => {
    setPhase("idle");
    setOriginal(null);
    setSafe(null);
    setItems([]);
    setSummary(null);
    setNotice(null);
    setError(null);
    setTool("compare");
    setSplit(50);
  };

  const start = useCallback(
    async (file: File) => {
      reset();
      if (!file.type.startsWith("image/") && !/\.(heic|heif)$/i.test(file.name)) {
        setError("That file isn't a photo. Choose a JPEG, PNG or HEIC image.");
        setPhase("error");
        return;
      }
      let bitmap: ImageBitmap;
      try {
        bitmap = await createImageBitmap(file);
      } catch {
        setError("Your browser can't open this photo format. Try a JPEG or PNG.");
        setPhase("error");
        return;
      }
      const full = toJpeg(bitmap, 2400, 0.92);
      const forScan = toJpeg(bitmap, 1400, 0.85);
      setFileName(file.name.replace(/\.[^.]+$/, "") || "photo");
      setOriginal(full);

      if (!enabled) {
        setNotice("Automatic scanning is off on this copy of the site. Draw a box over anything you want hidden.");
        setTool("draw");
        setPhase("ready");
        return;
      }

      setPhase("scanning");
      try {
        const res = await fetch("/api/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: forScan }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "The scan didn't finish.");
        const found: Item[] = data.detections.map(
          (d: { label: string; category: Category; reason: string; box: Box }, i: number) => ({ ...d, id: `ai-${i}`, hidden: true }),
        );
        setItems(found);
        setSummary({ exposureScore: data.exposureScore, verdict: data.verdict, whyItMatters: data.whyItMatters });
        if (!found.length) setNotice("Nothing personal found. If you spot something, draw a box over it.");
      } catch (e) {
        const msg = e instanceof Error ? e.message : "The scan didn't finish.";
        setNotice(`${msg} You can still draw a box over anything you want hidden.`);
        setTool("draw");
      }
      setPhase("ready");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enabled],
  );

  const toFraction = (e: React.PointerEvent) => {
    const r = stage.current!.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)),
      y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)),
    };
  };
  const boxFrom = (a: { x: number; y: number }, b: { x: number; y: number }): Box => ({
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    w: Math.abs(a.x - b.x),
    h: Math.abs(a.y - b.y),
  });

  const onDown = (e: React.PointerEvent) => {
    if (tool !== "draw") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawStart.current = toFraction(e);
    setDraft({ ...drawStart.current, w: 0, h: 0 });
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drawStart.current) return;
    setDraft(boxFrom(drawStart.current, toFraction(e)));
  };
  const onUp = (e: React.PointerEvent) => {
    if (!drawStart.current) return;
    const box = boxFrom(drawStart.current, toFraction(e));
    drawStart.current = null;
    setDraft(null);
    if (box.w < 0.015 || box.h < 0.015) return;
    setItems((list) => [
      ...list,
      { id: `you-${Date.now()}`, label: `Your box ${list.filter((i) => i.manual).length + 1}`, category: "Identity", box, hidden: true, manual: true },
    ]);
  };

  const found = items.filter((i) => !i.manual);
  const shownFound = found.filter((i) => !i.hidden).length;
  const after = summary
    ? found.length
      ? Math.round((summary.exposureScore * shownFound) / found.length) || Math.min(summary.exposureScore, 4)
      : summary.exposureScore
    : null;

  const pct = (v: number) => `${v * 100}%`;

  const heading =
    phase === "scanning" ? "Looking closely." : phase === "ready" ? "Here\u2019s your safe version." : "Check it before it\u2019s ink.";
  const sub =
    phase === "scanning"
      ? "SafePost is reading the photo the way a stranger would. This takes a few seconds."
      : phase === "ready"
        ? "Drag across the photo to see what changed. Save it when you\u2019re happy."
        : "Drop in a photo. SafePost finds what it gives away, hides it, and hands you a clean copy to post.";

  return (
    <div className="relative isolate overflow-hidden">
      {/* Sky that fades into paper, echoing the landing hero */}
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[640px]">
        <Image src="/assets/hero-sky.webp" alt="" fill priority sizes="100vw" className="object-cover object-[50%_30%]" />
        <div className="hero-dim absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-paper/40 via-paper/70 to-paper" />
      </div>
      <Image src="/assets/cloud-a.webp" alt="" aria-hidden width={800} height={516} className="pointer-events-none absolute -left-24 top-28 -z-10 w-[260px] opacity-80 sm:w-[340px]" />
      <Image src="/assets/cloud-b.webp" alt="" aria-hidden width={966} height={254} className="pointer-events-none absolute -right-28 top-72 -z-10 hidden w-[420px] opacity-90 md:block" />

      <div className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6 sm:pt-36">
        <header className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance font-display text-[2.6rem] font-medium leading-[1.04] tracking-tight text-ink [text-shadow:0_1px_18px_rgb(var(--paper)/0.9)] sm:text-6xl lg:text-7xl">
            {heading}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-ink/75 sm:text-xl">{sub}</p>
        </header>

        <input
          ref={input}
          type="file"
          accept="image/*,.heic,.heif"
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) start(f);
            e.target.value = "";
          }}
        />

        {(phase === "idle" || phase === "error") && (
          <>
            <div className="relative mx-auto mt-28 max-w-2xl sm:mt-32">
              {/* The brownie peeks over the top edge of the print */}
              <Image
                src="/assets/brownie-peek.webp"
                alt=""
                aria-hidden
                width={400}
                height={396}
                priority
                className={`pointer-events-none absolute left-1/2 z-10 w-[112px] -translate-x-1/2 transition-[top] duration-300 sm:w-[132px] ${
                  dragging ? "-top-[118px]" : "-top-[98px] sm:-top-[114px]"
                }`}
              />
              <motion.div
                initial={false}
                animate={reduce ? undefined : { rotate: dragging ? 0 : -1.6, scale: dragging ? 1.02 : 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
                className="rounded-[10px] bg-white p-3 pb-12 shadow-lift ring-1 ring-black/5 sm:p-4 sm:pb-14"
              >
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    const f = e.dataTransfer.files?.[0];
                    if (f) start(f);
                  }}
                  className={`flex flex-col items-center rounded-[4px] border-2 border-dashed px-6 py-16 text-center transition-colors sm:py-24 ${
                    dragging ? "border-[#E8846B] bg-[#FCE9E1]" : "border-[#DCCFBC] bg-[#F5EDE1]"
                  }`}
                >
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-white text-[#2B3A67] shadow-soft">
                    <ImagePlus size={26} aria-hidden />
                  </span>
                  <h2 className="mt-5 font-display text-3xl font-medium text-[#1E2440] sm:text-4xl">
                    {dragging ? "Let go to check it." : "Drop a photo here"}
                  </h2>
                  <p className="mt-2 text-[#585E78]">or pick one from your device</p>
                  <button
                    type="button"
                    onClick={() => input.current?.click()}
                    className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#E8846B] px-7 py-3.5 text-base font-semibold text-[#1E2440] shadow-lift transition-transform hover:-translate-y-0.5"
                  >
                    <Upload size={18} aria-hidden />
                    Choose a photo
                  </button>
                  {error && (
                    <p role="alert" className="mt-5 max-w-md font-medium text-[#9A4230]">
                      {error}
                    </p>
                  )}
                </div>
                <p className="mt-4 text-center font-display text-[15px] italic text-[#8A8790]">JPEG, PNG or HEIC</p>
              </motion.div>
            </div>

            <ol className="mx-auto mt-20 grid max-w-4xl gap-8 sm:grid-cols-3 sm:gap-6">
              {STEPS.map((s, i) => (
                <li key={s.title} className="relative text-center sm:text-left">
                  <span className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-respect/10 text-respect sm:mx-0">
                    <s.Icon size={21} aria-hidden />
                  </span>
                  <h3 className="mt-4 font-semibold text-ink">
                    <span className="sr-only">Step {i + 1}: </span>
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.body}</p>
                </li>
              ))}
            </ol>
            <p className="mx-auto mt-12 max-w-md text-center text-sm leading-relaxed text-muted">
              {enabled === false
                ? "Automatic scanning is off on this copy of the site, so you\u2019ll mark what to hide yourself."
                : "This is a test build. Please use photos of adults or objects, not children."}
            </p>
          </>
        )}

        {(phase === "scanning" || phase === "ready") && original && (
          <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            {/* Photo stage */}
            <div className="rounded-[2rem] border border-line bg-paper2 p-3 shadow-soft sm:p-5">
              {phase === "ready" && (
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <Segmented<Tool>
                    label="What the photo does when you drag"
                    value={tool}
                    onChange={setTool}
                    options={[
                      { id: "compare", label: "Compare", icon: <ChevronsLeftRight size={16} aria-hidden /> },
                      { id: "draw", label: "Add a box", icon: <SquareDashedMousePointer size={16} aria-hidden /> },
                    ]}
                  />
                  <p className="text-sm text-muted">
                    {tool === "compare" ? "Drag to compare the original and the safe version." : "Drag over anything you want hidden."}
                  </p>
                </div>
              )}

              <div className="flex justify-center py-2 sm:py-4">
                <div className="rounded-[6px] bg-white p-2 shadow-lift ring-1 ring-black/5 sm:p-3">
                <div
                  ref={stage}
                  className={`relative w-fit select-none ${tool === "draw" && phase === "ready" ? "cursor-crosshair touch-none" : ""}`}
                  onPointerDown={onDown}
                  onPointerMove={onMove}
                  onPointerUp={onUp}
                  onPointerCancel={() => {
                    drawStart.current = null;
                    setDraft(null);
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={phase === "ready" && safe ? safe : original}
                    alt={phase === "ready" ? "Safe version of your photo" : "Your photo, being checked"}
                    draggable={false}
                    className="block max-h-[64vh] w-auto max-w-full"
                  />

                  {phase === "scanning" && (
                    <>
                      <div className="absolute inset-0 bg-paper/30" />
                      <div className="scan-sweep absolute inset-x-0 h-24" aria-hidden />
                    </>
                  )}

                  {phase === "ready" && tool === "compare" && safe && (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={original}
                        alt=""
                        draggable={false}
                        className="absolute inset-0 h-full w-full"
                        style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-[#1E2440]/75 px-3 py-1 text-xs font-semibold text-white">Original</span>
                      <span className="absolute right-3 top-3 rounded-full bg-[#1E2440]/75 px-3 py-1 text-xs font-semibold text-white">Safe version</span>
                      <div className="pointer-events-none absolute inset-y-0 w-[3px] -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgb(30_36_64/0.25)]" style={{ left: `${split}%` }}>
                        <span className="compare-knob absolute top-1/2 left-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[#1E2440] shadow-lift">
                          <ChevronsLeftRight size={20} aria-hidden />
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={split}
                        onChange={(e) => setSplit(Number(e.target.value))}
                        aria-label="Slide between the original and the safe version"
                        className="compare-range absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
                      />
                    </>
                  )}

                  {phase === "ready" &&
                    items.map((it) =>
                      tool === "draw" || !it.hidden ? (
                        <div
                          key={it.id}
                          className={`pointer-events-none absolute rounded-md border-2 ${it.hidden ? "border-white/80" : "border-dashed border-compassion"}`}
                          style={{ left: pct(it.box.x), top: pct(it.box.y), width: pct(it.box.w), height: pct(it.box.h) }}
                        />
                      ) : null,
                    )}

                  {draft && (
                    <div
                      className="pointer-events-none absolute rounded-md border-2 border-dashed border-white bg-white/20"
                      style={{ left: pct(draft.x), top: pct(draft.y), width: pct(draft.w), height: pct(draft.h) }}
                    />
                  )}
                </div>
                </div>
              </div>
            </div>

            {/* Side panel */}
            <aside className="rounded-[2rem] border border-line bg-card p-5 shadow-soft sm:p-6" aria-live="polite">
              {phase === "scanning" ? (
                <div className="py-6">
                  <p className="font-display text-2xl font-medium text-ink">Checking your photo</p>
                  <ol className="mt-5 space-y-3">
                    {STATUS.map((s, i) => (
                      <li key={s} className={`flex items-center gap-3 text-[15px] ${i <= status ? "text-ink" : "text-muted/60"}`}>
                        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${i < status ? "bg-integrity" : i === status ? "animate-pulse bg-compassion" : "bg-line"}`} />
                        {s}
                      </li>
                    ))}
                  </ol>
                </div>
              ) : (
                <>
                  {summary && after !== null && (
                    <div className="border-b border-line pb-5">
                      <p className="text-sm font-medium text-muted">Exposure score</p>
                      <p className="mt-1 flex items-baseline gap-3 font-display">
                        <span className={`text-3xl text-muted line-through decoration-2 ${after === summary.exposureScore ? "hidden" : ""}`}>
                          {summary.exposureScore}
                        </span>
                        <span className={`text-6xl font-medium leading-none ${scoreInk(after)}`}>{after}</span>
                        <span className="text-base text-muted">of 100</span>
                      </p>
                      <p className="mt-2 text-sm text-muted">
                        {after === summary.exposureScore ? scoreWord(after) : `${scoreWord(after)} after your changes`}
                      </p>
                      {summary.verdict && (
                        <p className={`mt-3 font-semibold ${VERDICT_INK[summary.verdict]}`}>{VERDICT_LABEL[summary.verdict]}</p>
                      )}
                    </div>
                  )}

                  {notice && <p className="mb-4 mt-1 rounded-2xl bg-paper2 p-4 text-sm leading-relaxed text-ink/80">{notice}</p>}

                  {items.length > 0 && (
                    <>
                      <h3 className="mt-5 font-semibold text-ink">What it gives away</h3>
                      <ul className="mt-3 divide-y divide-line">
                        {items.map((it) => {
                          const { Icon, bg } = CATEGORY_ICON[it.category] ?? CATEGORY_ICON.Identity;
                          return (
                            <li key={it.id} className="flex items-start gap-3 py-3">
                              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl text-white" style={{ background: it.manual ? "#7A7781" : bg }}>
                                {it.manual ? <SquareDashedMousePointer size={16} aria-hidden /> : <Icon size={16} aria-hidden />}
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium leading-snug text-ink">{it.label}</p>
                                {it.reason && <p className="mt-0.5 text-sm leading-snug text-muted">{it.reason}</p>}
                              </div>
                              {it.manual && (
                                <button
                                  type="button"
                                  onClick={() => setItems((l) => l.filter((x) => x.id !== it.id))}
                                  aria-label={`Delete ${it.label}`}
                                  className="grid h-7 w-7 place-items-center rounded-full text-muted hover:bg-ink/5 hover:text-ink"
                                >
                                  <Trash2 size={15} aria-hidden />
                                </button>
                              )}
                              <Switch
                                on={it.hidden}
                                label={`Hide ${it.label}`}
                                onChange={(v) => setItems((l) => l.map((x) => (x.id === it.id ? { ...x, hidden: v } : x)))}
                              />
                            </li>
                          );
                        })}
                      </ul>
                      <h3 className="mt-5 font-semibold text-ink">How to hide it</h3>
                      <div className="mt-3">
                        <Segmented<RedactStyle> label="How to hide it" value={style} onChange={setStyle} options={STYLES} />
                      </div>
                    </>
                  )}

                  {summary?.whyItMatters && <p className="mt-5 text-pretty leading-relaxed text-ink/80">{summary.whyItMatters}</p>}

                  <div className="mt-6 flex flex-col gap-3">
                    <a
                      href={safe ?? undefined}
                      download={`${fileName}-safe.jpg`}
                      aria-disabled={!safe}
                      className={`inline-flex items-center justify-center gap-2 rounded-full bg-compassion px-6 py-3.5 text-base font-semibold text-[#1E2440] shadow-lift transition-transform hover:-translate-y-0.5 ${
                        safe ? "" : "pointer-events-none opacity-60"
                      }`}
                    >
                      <Download size={18} aria-hidden />
                      Save safe version
                    </a>
                    <button
                      type="button"
                      onClick={() => input.current?.click()}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 bg-card px-6 py-3 text-base font-semibold text-ink transition-colors hover:bg-paper2"
                    >
                      <ImagePlus size={18} aria-hidden />
                      Check another photo
                    </button>
                    <button type="button" onClick={reset} className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
                      <RotateCcw size={14} aria-hidden />
                      Start over
                    </button>
                  </div>
                  <p className="mt-4 text-center text-xs leading-relaxed text-muted">The saved copy has no location, device or time data.</p>
                </>
              )}
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
