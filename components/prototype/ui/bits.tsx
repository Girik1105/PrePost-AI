//created by kinjal
"use client";

import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { Check, CircleAlert, OctagonAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { VERDICT_LABEL, VIEWBOX, type Detection, type Risk, type Verdict } from "@/lib/scenes";
import { APP } from "./kit";

export function scoreColor(score: number) {
  if (score >= 80) return APP.brick;
  if (score >= 40) return APP.amber;
  return APP.sage;
}

/** Exposure ring that counts up to its value. */
export function ScoreRing({ value, size = 92, play = true }: { value: number; size?: number; play?: boolean }) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const [shown, setShown] = useState(0);
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  const dash = useTransform(mv, (v) => c - (v / 100) * c);

  useEffect(() => {
    if (!play) return;
    if (reduce) {
      mv.set(value);
      setShown(value);
      return;
    }
    const ctrl = animate(mv, value, { duration: 1.4, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setShown(Math.round(v)) });
    return () => ctrl.stop();
  }, [value, play, reduce, mv]);

  const color = scoreColor(shown);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`Exposure score ${value} out of 100`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#EFEAE2" strokeWidth={10} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={10}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          style={{ strokeDashoffset: dash }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[28px] font-bold leading-none tracking-tight" style={{ color: APP.text }}>
          {shown}
        </span>
        <span className="mt-[2px] text-[10px] font-semibold uppercase tracking-wide text-[#8A8790]">of 100</span>
      </div>
    </div>
  );
}

const VERDICT_STYLE: Record<Exclude<Verdict, null>, { bg: string; fg: string; Icon: typeof Check }> = {
  safe: { bg: APP.sageSoft, fg: APP.sageDeep, Icon: Check },
  caution: { bg: APP.amberSoft, fg: APP.amberDeep, Icon: CircleAlert },
  dont_post: { bg: APP.brickSoft, fg: "#8E3A28", Icon: OctagonAlert },
};

export function VerdictPill({ verdict, small = false }: { verdict: Exclude<Verdict, null>; small?: boolean }) {
  const s = VERDICT_STYLE[verdict];
  return (
    <span
      className={`inline-flex items-center gap-[6px] rounded-full font-semibold ${small ? "px-[10px] py-[4px] text-[12px]" : "px-[12px] py-[6px] text-[14px]"}`}
      style={{ background: s.bg, color: s.fg }}
    >
      <s.Icon className={small ? "h-[14px] w-[14px]" : "h-4 w-4"} strokeWidth={2.4} aria-hidden />
      {VERDICT_LABEL[verdict]}
    </span>
  );
}

export function RiskBadge({ risk }: { risk: Risk }) {
  const map = {
    safe: { bg: APP.sage, label: "Safe" },
    caution: { bg: APP.amber, label: "Needs a look" },
    danger: { bg: APP.brick, label: "Risky" },
  }[risk];
  return (
    <span
      className="flex h-[20px] w-[20px] items-center justify-center rounded-full border-2 border-white shadow"
      style={{ background: map.bg }}
      role="img"
      aria-label={map.label}
    >
      {risk === "safe" && <Check className="h-[11px] w-[11px] text-white" strokeWidth={3.5} aria-hidden />}
    </span>
  );
}

/** Soft outlines and chips drawn over a scene. Same 400 x 300 coordinate space. */
export function DetectionOverlay({
  detections,
  show,
  activeIds,
}: {
  detections: Detection[];
  show: boolean;
  activeIds?: string[]; // ids still unfixed; fixed ones fade their outline
}) {
  const boxed = detections.filter((d) => d.box);
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <svg viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`} className="absolute inset-0 h-full w-full">
        {boxed.map((d, i) => {
          const b = d.box!;
          const open = !activeIds || activeIds.includes(d.id);
          return (
            <motion.rect
              key={d.id}
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              rx={8}
              fill={open ? "rgba(255,255,255,0.08)" : "rgba(111,158,125,0.12)"}
              stroke={open ? "#FFFFFF" : APP.sage}
              strokeWidth={2.5}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={show ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.8, delay: show ? 0.3 + i * 0.35 : 0, ease: "easeInOut" }}
              style={{ filter: "drop-shadow(0 0 3px rgba(43,58,103,0.55))" }}
            />
          );
        })}
      </svg>
      {boxed.map((d, i) => {
        const b = d.box!;
        const open = !activeIds || activeIds.includes(d.id);
        const above = b.y > 26;
        const left = Math.min(Math.max((b.x / VIEWBOX.w) * 100, 1), 72);
        return (
          <motion.span
            key={d.id}
            className="absolute whitespace-nowrap rounded-full px-[8px] py-[3px] text-[11px] font-semibold shadow"
            style={{
              left: `${left}%`,
              top: above ? `calc(${(b.y / VIEWBOX.h) * 100}% - 22px)` : `calc(${((b.y + b.h) / VIEWBOX.h) * 100}% + 4px)`,
              background: open ? "rgba(255,255,255,0.95)" : APP.sageSoft,
              color: open ? APP.navy : APP.sageDeep,
            }}
            initial={{ opacity: 0, y: 6 }}
            animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
            transition={{ duration: 0.35, delay: show ? 0.6 + i * 0.35 : 0 }}
          >
            {open ? d.chip : `${d.chip} hidden`}
          </motion.span>
        );
      })}
    </div>
  );
}
