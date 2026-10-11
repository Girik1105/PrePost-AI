//created by kinjal
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, DownloadSimple as Download, Drop as Droplets, Eraser, GridNine as Grid3x3, CircleNotch as LoaderCircle, GpsSlash as MapPinOff, MagnifyingGlass as ScanSearch, Export as Share, ShieldCheck, DeviceMobile as Smartphone, Sparkle as Sparkles } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BRAND } from "@/lib/brand";
import { BRAND_PATHS } from "@/lib/brandIcons";
import { redact, type RedactStyle } from "@/lib/redact";
import { CATEGORY_ICON } from "@/components/prototype/screens/Detail";
import { ScoreRing } from "@/components/prototype/ui/bits";
import { APP, Toggle } from "@/components/prototype/ui/kit";
import { FINDINGS, MAIN, SCORE } from "./photos";
import { hintCls } from "./PhotosScreens";
import { useFlow } from "./ShareFlowContext";

const STATUS = [
  { I: MapPinOff, t: "Removing location data" },
  { I: ScanSearch, t: "Looking for names, numbers and places" },
  { I: Sparkles, t: "Deciding what to hide" },
];

const METHODS: { id: RedactStyle; label: string; I: typeof Eraser; ai?: boolean }[] = [
  { id: "blur", label: "Blur", I: Droplets },
  { id: "pixelate", label: "Pixelate", I: Grid3x3 },
  { id: "erase", label: "Erase", I: Eraser, ai: true },
];

/** The PrePost share extension, shown as an iOS page sheet over Photos. */
export default function SafePostSheet() {
  const { step, go } = useFlow();
  return (
    <motion.div
      role="dialog"
      aria-label={`${BRAND.name} share extension`}
      className="absolute inset-x-0 bottom-0 top-[60px] z-30 overflow-hidden rounded-t-[14px] bg-[#F6F2EA] shadow-[0_-10px_40px_rgba(0,0,0,0.25)]"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 34 }}
    >
      <div className="mx-auto mt-[6px] h-[5px] w-[36px] rounded-full bg-[#D6D1C9]" />
      <div className="relative flex h-[44px] items-center justify-between px-4">
        <button type="button" onClick={() => go("viewer")} className="text-[17px] text-[#2B3A67]">
          Cancel
        </button>
        <span className="absolute left-1/2 flex -translate-x-1/2 items-center gap-[6px] text-[17px] font-semibold">
          <Image sizes="22px" src="/assets/app-icon.webp" alt="" width={22} height={22} className="h-[22px] w-[22px] rounded-[6px]" />
          {BRAND.name}
        </span>
        <span className="w-[52px]" />
      </div>
      <div className="no-scrollbar absolute inset-x-0 bottom-0 top-[56px] overflow-y-auto">
        {step === "scan" && <Scan />}
        {step === "review" && <Review />}
        {step === "done" && <Done />}
      </div>
    </motion.div>
  );
}

function Photo({ src, children }: { src: string; children?: React.ReactNode }) {
  return (
    <div className="relative mx-4 aspect-square overflow-hidden rounded-[18px] bg-black shadow-[0_8px_24px_-10px_rgba(0,0,0,0.4)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={MAIN.alt} className="absolute inset-0 h-full w-full object-cover" />
      {children}
    </div>
  );
}

/* ---------------- scanning ---------------- */

function Scan() {
  const { go } = useFlow();
  const [n, setN] = useState(0);
  useEffect(() => {
    const ts = [900, 2000, 3100].map((ms, i) => window.setTimeout(() => setN(i + 1), ms));
    const done = window.setTimeout(() => go("review"), 4000);
    return () => [...ts, done].forEach(clearTimeout);
  }, [go]);
  return (
    <div className="pt-2">
      <Photo src={MAIN.src}>
        <motion.div
          className="absolute inset-x-0 h-[70px] bg-gradient-to-b from-transparent via-[#9FE0B4]/50 to-transparent"
          initial={{ top: "-15%" }}
          animate={{ top: "100%" }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 bg-[#1E2440]/10" />
      </Photo>
      <div className="mx-4 mt-5 space-y-[14px] rounded-[18px] bg-white p-4" aria-live="polite">
        {STATUS.map(({ I, t }, i) => {
          const state = i < n ? "done" : i === n ? "now" : "todo";
          return (
            <div key={t} className="flex items-center gap-3">
              <span
                className="flex h-[30px] w-[30px] items-center justify-center rounded-full"
                style={{ background: state === "done" ? APP.sage : state === "now" ? APP.lavSoft : "#F0ECE5", color: state === "done" ? "#fff" : APP.lavDeep }}
              >
                {state === "done" ? <Check className="h-4 w-4" weight="bold" aria-hidden /> : state === "now" ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden /> : <I className="h-4 w-4 opacity-50" aria-hidden />}
              </span>
              <span className={`text-[15px] ${state === "todo" ? "text-[#A9A5AE]" : "font-medium text-[#1C1C1E]"}`}>{t}</span>
            </div>
          );
        })}
      </div>
      <p className="mt-4 px-8 text-center text-[13px] leading-snug text-[#8A8790]">Location, device and time come off before anything else happens.</p>
    </div>
  );
}

/* ---------------- review ---------------- */

/** Bakes the chosen hides into the real pixels, the same way /check does. */
function useSafeCopy() {
  const { hidden, style, setSafeUrl, safeUrl } = useFlow();
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let stale = false;
    setBusy(true);
    const boxes = FINDINGS.filter((f) => hidden[f.id]).map((f) => f.box);
    redact(MAIN.src, boxes, style, FINDINGS.map((f) => f.box))
      .then((url) => !stale && setSafeUrl(url))
      .catch(() => !stale && setSafeUrl(null))
      .finally(() => !stale && setBusy(false));
    return () => {
      stale = true;
    };
  }, [hidden, style, setSafeUrl]);
  return { safeUrl, busy };
}

function Review() {
  const { hidden, toggle, style, setStyle, go, driven, touch } = useFlow();
  const { safeUrl, busy } = useSafeCopy();
  const [peek, setPeek] = useState(false);
  const [show, setShow] = useState(false);
  const open = FINDINGS.filter((f) => !hidden[f.id]).length;
  const score = Math.max(6, Math.round((SCORE * open) / FINDINGS.length));

  useEffect(() => {
    const t = window.setTimeout(() => setShow(true), 250);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="pb-[110px] pt-2">
      <Photo src={peek || !safeUrl ? MAIN.src : safeUrl}>
        {FINDINGS.map((f, i) => (
          <motion.div
            key={f.id}
            className="absolute rounded-[6px] border-2"
            style={{
              left: `${f.box.x * 100}%`,
              top: `${f.box.y * 100}%`,
              width: `${f.box.w * 100}%`,
              height: `${f.box.h * 100}%`,
              borderColor: hidden[f.id] ? "rgba(159,224,180,0.95)" : "rgba(255,255,255,0.95)",
              boxShadow: "0 0 0 1px rgba(30,36,64,0.35)",
            }}
            initial={{ opacity: 0, scale: 1.4 }}
            animate={show ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.15 + i * 0.25, type: "spring", stiffness: 300, damping: 22 }}
          />
        ))}
        {busy && (
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/55 px-2 py-[3px] text-[11px] font-semibold text-white">
            <LoaderCircle className="h-3 w-3 animate-spin" aria-hidden /> {style === "erase" ? "Erasing" : "Updating"}
          </span>
        )}
        <button
          type="button"
          onPointerDown={() => {
            touch();
            setPeek(true);
          }}
          onPointerUp={() => setPeek(false)}
          onPointerLeave={() => setPeek(false)}
          className="absolute bottom-2 right-2 rounded-full bg-black/55 px-3 py-[5px] text-[12px] font-semibold text-white backdrop-blur"
        >
          {peek ? "Original" : "Hold to compare"}
        </button>
      </Photo>

      <div className="mx-4 mt-4 flex items-center gap-4 rounded-[18px] bg-white p-4">
        <ScoreRing value={score} size={76} />
        <div className="min-w-0 flex-1">
          <p className="text-[17px] font-semibold leading-tight">{open === 0 ? "Your address is hidden." : "This photo shows where you live."}</p>
          <p className="mt-1 text-[13px] leading-snug text-[#6B6B73]">
            {open === 0 ? "Everything risky is hidden. Location is off." : `${open} of ${FINDINGS.length} details still visible.`}
          </p>
        </div>
      </div>

      <p className="px-5 pb-2 pt-5 text-[13px] font-medium uppercase tracking-wide text-[#8A8790]">How to hide</p>
      <div className="mx-4 grid grid-cols-3 gap-2" role="radiogroup" aria-label="How to hide">
        {METHODS.map(({ id, label, I, ai }) => {
          const on = style === id;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setStyle(id)}
              className={`flex items-center justify-center gap-[6px] rounded-[14px] border py-[10px] text-[14px] font-semibold ${on ? "border-[#E8846B] bg-white text-[#1C1C1E] ring-2 ring-[#E8846B]/25" : "border-[#E7E1D7] bg-[#FBF8F3] text-[#6B6B73]"}`}
            >
              <I className="h-4 w-4" aria-hidden />
              {label}
              {ai && <span className="rounded-full bg-[#E3EFE6] px-[5px] text-[10px] text-[#3E6C4C]">AI</span>}
            </button>
          );
        })}
      </div>

      <p className="px-5 pb-2 pt-5 text-[13px] font-medium uppercase tracking-wide text-[#8A8790]">What it gives away</p>
      <div className="mx-4 overflow-hidden rounded-[16px] bg-white">
        {FINDINGS.map((f, i) => {
          const { Icon, bg } = CATEGORY_ICON[f.category];
          return (
            <div key={f.id} className="flex items-center gap-3 pl-4">
              <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px] text-white" style={{ background: bg }}>
                <Icon className="h-[17px] w-[17px]" aria-hidden />
              </span>
              <div className={`flex min-w-0 flex-1 items-center gap-3 py-[11px] pr-4 ${i < FINDINGS.length - 1 ? "border-b border-[#ECE7DE]" : ""}`}>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold leading-snug">{f.label}</p>
                  <p className="text-[12px] leading-snug text-[#7A7781]">{f.reason}</p>
                </div>
                <Toggle on={!!hidden[f.id]} onChange={() => toggle(f.id)} label={`Hide ${f.label}`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#F6F2EA] via-[#F6F2EA] to-transparent px-4 pb-[34px] pt-6">
        <button
          type="button"
          data-tap="next"
          onClick={() => go("done")}
          disabled={busy && !safeUrl}
          className={`flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#E8846B] text-[17px] font-semibold text-[#1E2440] ${hintCls(!driven)}`}
        >
          <ShieldCheck className="h-5 w-5" aria-hidden /> Make it safe
        </button>
      </div>
    </div>
  );
}

/* ---------------- done ---------------- */

export function IgGlyph({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d={BRAND_PATHS.instagram.path} />
    </svg>
  );
}

function Done() {
  const { safeUrl, go, driven, hidden } = useFlow();
  const count = FINDINGS.filter((f) => hidden[f.id]).length;
  const [saved, setSaved] = useState(false);
  return (
    <div className="pb-6 pt-2">
      <Photo src={safeUrl ?? MAIN.src}>
        <motion.span
          className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-3 py-[6px] text-[13px] font-semibold shadow"
          style={{ color: APP.sageDeep }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ShieldCheck className="h-4 w-4" aria-hidden /> Safe copy
        </motion.span>
      </Photo>

      <div className="mx-4 mt-4 overflow-hidden rounded-[16px] bg-white">
        {[
          { I: MapPinOff, t: "Location removed" },
          { I: Smartphone, t: "Device and time removed" },
          { I: ShieldCheck, t: `${count} detail${count === 1 ? "" : "s"} hidden in the pixels` },
        ].map(({ I, t }, i) => (
          <motion.div
            key={t}
            className={`flex items-center gap-3 px-4 py-[11px] ${i < 2 ? "border-b border-[#ECE7DE]" : ""}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.15 }}
          >
            <I className="h-5 w-5" style={{ color: APP.sageDeep }} aria-hidden />
            <span className="flex-1 text-[15px]">{t}</span>
            <Check className="h-5 w-5" style={{ color: APP.sage }} weight="bold" aria-hidden />
          </motion.div>
        ))}
      </div>

      <div className="space-y-[10px] px-4 pt-5">
        <button
          type="button"
          data-tap="next"
          onClick={() => go("compose")}
          className={`flex h-[52px] w-full items-center justify-center gap-2 rounded-[14px] text-[17px] font-semibold text-white ${hintCls(!driven)}`}
          style={{ background: "linear-gradient(90deg,#F58529,#DD2A7B 45%,#8134AF 75%,#515BD4)" }}
        >
          <IgGlyph /> Post to Instagram
        </button>
        <div className="grid grid-cols-2 gap-[10px]">
          <button type="button" onClick={() => setSaved(true)} className="flex h-[46px] items-center justify-center gap-2 rounded-[14px] bg-white text-[15px] font-semibold text-[#2B3A67]">
            <AnimatePresence mode="wait" initial={false}>
              {saved ? (
                <motion.span key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                  <Check className="h-4 w-4" aria-hidden /> Saved
                </motion.span>
              ) : (
                <motion.span key="d" className="flex items-center gap-2">
                  <Download className="h-4 w-4" aria-hidden /> Save to Photos
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button type="button" className="flex h-[46px] items-center justify-center gap-2 rounded-[14px] bg-white text-[15px] font-semibold text-[#2B3A67]">
            <Share className="h-4 w-4" aria-hidden /> Share elsewhere
          </button>
        </div>
        <p className="pt-1 text-center text-[12px] text-[#8A8790]">Your original stays in Photos, untouched.</p>
      </div>
    </div>
  );
}
