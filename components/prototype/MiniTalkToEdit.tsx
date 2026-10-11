//created by kinjal
"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp, Microphone as Mic } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";
import type { ObjMode } from "@/lib/scenes";
import PhoneFrame from "./PhoneFrame";
import SceneArt from "./scenes/SceneArt";

const COMMAND = "blur the street sign";

type Phase = "idle" | "typing" | "finding" | "done";

/** Small looping clip of talk-to-edit for the landing page. */
export default function MiniTalkToEdit({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (reduce) {
      setTyped(COMMAND);
      setPhase("done");
      return;
    }
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    const cycle = () => {
      setPhase("idle");
      setTyped("");
      at(900, () => setPhase("typing"));
      for (let i = 1; i <= COMMAND.length; i++) at(900 + i * 75, () => setTyped(COMMAND.slice(0, i)));
      const sent = 900 + COMMAND.length * 75 + 500;
      at(sent, () => setPhase("finding"));
      at(sent + 1300, () => setPhase("done"));
      at(sent + 5200, cycle);
    };
    cycle();
    return () => timers.forEach(clearTimeout);
  }, [reduce]);

  const edits: Record<string, ObjMode> = phase === "done" ? { "porch-street": "blur" } : {};
  const sent = phase === "finding" || phase === "done";

  return (
    <div className={className}>
      <PhoneFrame statusTone="light" label="Looping example: typing blur the street sign hides the street sign in a photo">
        <div className="absolute inset-0 flex flex-col bg-[#15172A] px-3 pb-[40px] pt-[70px] text-white">
          <p className="mb-3 text-center text-[17px] font-semibold">Edit with words</p>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[18px]">
            <SceneArt id="porch" edits={edits} className="h-full w-full" />
            <AnimatePresence>
              {phase === "finding" && (
                <motion.div
                  className="absolute rounded-[10px] border-[2.5px] border-white"
                  style={{ left: "3%", top: "14.6%", width: "19%", height: "8.7%", boxShadow: "0 0 0 4px rgba(232,132,107,0.55)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  exit={{ opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 0.9 }}
                />
              )}
            </AnimatePresence>
          </div>
          <div className="mt-4 flex-1 space-y-2 px-1">
            <div className="max-w-[80%] rounded-[18px] rounded-bl-[6px] bg-white/10 px-[14px] py-[9px] text-[15px] text-white/90">
              Tell me what to hide.
            </div>
            <AnimatePresence>
              {sent && (
                <motion.div key="me" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
                  <div className="rounded-[18px] rounded-br-[6px] bg-[#8F80C2] px-[14px] py-[9px] text-[15px]">{COMMAND}</div>
                </motion.div>
              )}
              {phase === "finding" && (
                <motion.div key="f" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="shimmer relative inline-block overflow-hidden rounded-[18px] rounded-bl-[6px] bg-white/10 px-[14px] py-[9px] text-[15px] text-white/80">
                    Finding the street sign...
                  </div>
                </motion.div>
              )}
              {phase === "done" && (
                <motion.div key="d" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="inline-block rounded-[18px] rounded-bl-[6px] bg-white/10 px-[14px] py-[9px] text-[15px] text-white/90">
                    Done. I blurred the street sign.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/10 py-[6px] pl-4 pr-[6px]">
            <span className={`h-[36px] flex-1 truncate text-[16px] leading-[36px] ${typed && !sent ? "text-white" : "text-white/40"}`}>
              {!sent && typed ? typed : "Try: blur the street sign"}
              {phase === "typing" && <span className="ml-[1px] inline-block h-[18px] w-[2px] translate-y-[3px] animate-pulse bg-white" />}
            </span>
            <Mic className="h-5 w-5 text-white/80" aria-hidden />
            <span className="flex h-[36px] w-[36px] items-center justify-center rounded-full text-[#1E2440]" style={{ background: typed && !sent ? "#E8846B" : "rgba(255,255,255,0.25)" }}>
              <ArrowUp className="h-5 w-5" weight="bold" aria-hidden />
            </span>
          </div>
        </div>
      </PhoneFrame>
    </div>
  );
}
