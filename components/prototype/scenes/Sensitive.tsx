//created by kinjal
"use client";

import { createContext, useContext } from "react";
import { motion } from "framer-motion";
import type { ObjMode } from "@/lib/scenes";

interface SceneCtx {
  filterId: string;
  edits: Record<string, ObjMode>;
}

export const SceneContext = createContext<SceneCtx>({ filterId: "", edits: {} });

/**
 * One sensitive object in a scene. It renders twice: a sharp copy and a blurred
 * copy. Blur fades to the blurred copy, remove fades both out so the background
 * underneath shows through.
 */
export function Sensitive({ id, children }: { id: string; children: React.ReactNode }) {
  const { filterId, edits } = useContext(SceneContext);
  const mode = edits[id] ?? "none";
  return (
    <g id={id} data-mode={mode}>
      <motion.g initial={false} animate={{ opacity: mode === "none" ? 1 : 0 }} transition={{ duration: 0.6 }}>
        {children}
      </motion.g>
      <motion.g
        initial={false}
        animate={{ opacity: mode === "blur" ? 1 : 0 }}
        transition={{ duration: 0.6 }}
        filter={`url(#${filterId})`}
        aria-hidden
      >
        {children}
      </motion.g>
    </g>
  );
}

/** Simple, fully clothed cartoon kid. (x, y) is the top of the head. */
export function Kid({
  x,
  y,
  s = 1,
  shirt = "#E8846B",
  pants = "#2B3A67",
  hair = "#5A3B2E",
  skin = "#F2C7A5",
  pigtails = true,
  armUp = false,
  children,
}: {
  x: number;
  y: number;
  s?: number;
  shirt?: string;
  pants?: string;
  hair?: string;
  skin?: string;
  pigtails?: boolean;
  armUp?: boolean;
  children?: React.ReactNode; // extra layers drawn on the shirt (crest etc.)
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* legs */}
      <rect x={-13} y={74} width={10} height={34} rx={4} fill={pants} />
      <rect x={3} y={74} width={10} height={34} rx={4} fill={pants} />
      <rect x={-16} y={104} width={15} height={7} rx={3.5} fill="#3B2F2F" />
      <rect x={2} y={104} width={15} height={7} rx={3.5} fill="#3B2F2F" />
      {/* arms */}
      {armUp ? (
        <rect x={16} y={14} width={9} height={36} rx={4.5} fill={shirt} transform="rotate(-150 20 44)" />
      ) : (
        <rect x={17} y={36} width={9} height={32} rx={4.5} fill={shirt} transform="rotate(-12 21 38)" />
      )}
      <rect x={-26} y={36} width={9} height={32} rx={4.5} fill={shirt} transform="rotate(12 -21 38)" />
      {/* body */}
      <rect x={-19} y={32} width={38} height={48} rx={12} fill={shirt} />
      {/* head */}
      <circle cx={0} cy={16} r={17} fill={skin} />
      <path d="M-17 14 C-17 -6 17 -6 17 14 C12 6 -10 4 -17 14Z" fill={hair} />
      {pigtails && (
        <>
          <circle cx={-19} cy={12} r={6} fill={hair} />
          <circle cx={19} cy={12} r={6} fill={hair} />
        </>
      )}
      <circle cx={-6} cy={18} r={1.8} fill="#2B2B2B" />
      <circle cx={6} cy={18} r={1.8} fill="#2B2B2B" />
      <path d="M-4 24 Q0 27 4 24" stroke="#2B2B2B" strokeWidth={1.5} fill="none" strokeLinecap="round" />
      <circle cx={-10} cy={23} r={2.5} fill="#F29C8C" opacity={0.6} />
      <circle cx={10} cy={23} r={2.5} fill="#F29C8C" opacity={0.6} />
      {children}
    </g>
  );
}

/** Simple adult figure, (x, y) is the top of the head. */
export function Adult({
  x,
  y,
  s = 1,
  shirt = "#8F80C2",
  pants = "#3E4A6B",
  hair = "#3B2A22",
  skin = "#E9B996",
  longHair = false,
}: {
  x: number;
  y: number;
  s?: number;
  shirt?: string;
  pants?: string;
  hair?: string;
  skin?: string;
  longHair?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-14} y={92} width={12} height={46} rx={5} fill={pants} />
      <rect x={2} y={92} width={12} height={46} rx={5} fill={pants} />
      <rect x={-29} y={40} width={10} height={44} rx={5} fill={shirt} transform="rotate(8 -24 42)" />
      <rect x={19} y={40} width={10} height={44} rx={5} fill={shirt} transform="rotate(-8 24 42)" />
      <rect x={-22} y={36} width={44} height={62} rx={14} fill={shirt} />
      {longHair && <path d="M-20 16 C-24 44 -14 46 -12 40 L12 40 C14 46 24 44 20 16Z" fill={hair} />}
      <circle cx={0} cy={18} r={18} fill={skin} />
      <path d="M-18 16 C-18 -6 18 -6 18 16 C12 6 -12 4 -18 16Z" fill={hair} />
      <circle cx={-6} cy={20} r={1.8} fill="#2B2B2B" />
      <circle cx={6} cy={20} r={1.8} fill="#2B2B2B" />
      <path d="M-4 27 Q0 30 4 27" stroke="#2B2B2B" strokeWidth={1.5} fill="none" strokeLinecap="round" />
    </g>
  );
}
