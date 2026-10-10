//created by kinjal
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ROLL, SCENES, riskOf } from "@/lib/scenes";
import { useProto } from "../PrototypeController";
import { APP, Brownie, LargeTitle, ScreenBody, TabBar } from "../ui/kit";
import { RiskBadge } from "../ui/bits";
import SceneArt from "../scenes/SceneArt";

export default function Scan() {
  const { state, patch, go, driven } = useProto();
  const [scanning, setScanning] = useState(!state.scanned);
  const [revealed, setRevealed] = useState(state.scanned ? ROLL.length : 0);

  useEffect(() => {
    if (state.scanned) return;
    const t = window.setTimeout(() => setScanning(false), 2200);
    return () => window.clearTimeout(t);
  }, [state.scanned]);

  useEffect(() => {
    if (scanning || revealed >= ROLL.length) {
      if (!scanning && revealed >= ROLL.length && !state.scanned) patch({ scanned: true });
      return;
    }
    const t = window.setTimeout(() => setRevealed((r) => r + 1), 180);
    return () => window.clearTimeout(t);
  }, [scanning, revealed, state.scanned, patch]);

  const rescan = () => {
    patch({ scanned: false });
    setScanning(true);
    setRevealed(0);
    window.setTimeout(() => setScanning(false), 2200);
  };

  const flagged = ROLL.filter((id) => riskOf(SCENES[id]) !== "safe").length;

  return (
    <>
      <ScreenBody tabbar>
        <LargeTitle
          title="Camera Roll"
          right={
            <button type="button" onClick={rescan} className="mb-2 rounded-full bg-white px-3 py-[6px] text-[14px] font-semibold text-[#2B3A67] shadow-sm">
              Scan again
            </button>
          }
        />
        <div className="mx-4 mb-3 flex items-center gap-3 rounded-[16px] bg-white p-3">
          <Brownie pose="magnify" size={44} />
          <div className="min-w-0 flex-1" aria-live="polite">
            <AnimatePresence mode="wait">
              {scanning ? (
                <motion.div key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <p className="text-[15px] font-semibold">Scanning {ROLL.length} photos...</p>
                  <div className="mt-2 h-[6px] overflow-hidden rounded-full bg-[#EFEAE2]">
                    <motion.div className="h-full rounded-full" style={{ background: APP.sage }} initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2.1, ease: "easeInOut" }} />
                  </div>
                </motion.div>
              ) : (
                <motion.div key="d" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-[15px] font-semibold">Done. {flagged} photos need a look.</p>
                  <p className="text-[13px] text-[#7A7781]">Checked on this phone. Nothing was uploaded.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-[2px]">
          {ROLL.map((id, i) => {
            const scene = SCENES[id];
            const shown = !scanning && i < revealed;
            return (
              <button
                key={id}
                type="button"
                onClick={() => go("detail", { scene: id })}
                aria-label={`${scene.title}. ${shown ? (riskOf(scene) === "safe" ? "Safe" : "Needs a look") : "Scanning"}`}
                className={`relative aspect-square overflow-hidden ${id === "school" && shown && !driven ? "tap-hint z-10" : ""}`}
              >
                <SceneArt id={id} className="h-full w-full" showPrivateCard={false} />
                {scene.privateMoment && <div className="absolute inset-0 backdrop-blur-md" />}
                {scanning && <div className="shimmer absolute inset-0 overflow-hidden bg-white/20" />}
                <AnimatePresence>
                  {shown && (
                    <motion.span
                      className="absolute bottom-[6px] right-[6px]"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 18 }}
                    >
                      <RiskBadge risk={riskOf(scene)} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-4 px-4 py-4 text-[12px] text-[#7A7781]">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: APP.sage }} /> Safe</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: APP.amber }} /> Needs a look</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: APP.brick }} /> Risky</span>
        </div>
      </ScreenBody>
      <TabBar />
    </>
  );
}
