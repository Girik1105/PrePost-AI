//created by kinjal
"use client";

import { animate, AnimatePresence, motion, useMotionValue, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, ChevronsLeftRight, Clock, MapPin, Smartphone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SCENES } from "@/lib/scenes";
import { useProto } from "../PrototypeController";
import { APP, Brownie, Button, Card, NavBar, ScreenBody, SectionHeader } from "../ui/kit";
import SceneArt from "../scenes/SceneArt";

export default function Compare() {
  const { state, save, strip, go, driven, touch } = useProto();
  const scene = SCENES[state.scene];
  const reduce = useReducedMotion();
  const pos = useMotionValue(50);
  const [p, setP] = useState(50);
  const boxRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const saved = state.saved.includes(scene.id);
  const stripped = !!state.stripped[scene.id];

  useMotionValueEvent(pos, "change", (v) => setP(v));

  useEffect(() => {
    if (state.cue?.name !== "sweep" || reduce) return;
    const ctrl = animate(pos, [50, 92, 8, 50], { duration: 4.2, ease: "easeInOut", delay: 0.8 });
    return () => ctrl.stop();
  }, [state.cue, pos, reduce]);

  const setFromX = (clientX: number) => {
    const r = boxRef.current?.getBoundingClientRect();
    if (!r) return;
    pos.set(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  const onSave = () => {
    strip(scene.id, true);
    save(scene.id);
    setDone(true);
    window.setTimeout(() => setDone(false), 2200);
  };

  const meta = [
    { Icon: MapPin, label: "Location", from: scene.location ?? "None" },
    { Icon: Smartphone, label: "Device info", from: "Phone model, lens" },
    { Icon: Clock, label: "Time", from: scene.takenAt },
  ];

  return (
    <>
      <ScreenBody>
        <NavBar title="Before and after" />
        <div
          ref={boxRef}
          className="relative mx-4 mt-1 aspect-[4/3] touch-none select-none overflow-hidden rounded-[18px] shadow-md"
          onPointerDown={(e) => {
            touch();
            (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
            setFromX(e.clientX);
          }}
          onPointerMove={(e) => {
            if (e.buttons) setFromX(e.clientX);
          }}
        >
          {/* safe version underneath, original clipped on the left */}
          <SceneArt id={scene.id} edits={state.edits} className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - p}% 0 0)` }}>
            <SceneArt id={scene.id} edits={{}} className="h-full w-full" />
          </div>
          <span className="absolute left-2 top-2 rounded-full bg-black/45 px-2 py-[3px] text-[11px] font-semibold text-white">Original</span>
          <span className="absolute right-2 top-2 rounded-full px-2 py-[3px] text-[11px] font-semibold text-white" style={{ background: APP.sageDeep }}>
            Safe version
          </span>
          <div className="absolute inset-y-0" style={{ left: `${p}%` }}>
            <div className="absolute inset-y-0 -ml-[1.5px] w-[3px] bg-white shadow" />
            <button
              type="button"
              role="slider"
              aria-label="Compare original and safe version"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(p)}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") pos.set(Math.max(0, p - 5));
                if (e.key === "ArrowRight") pos.set(Math.min(100, p + 5));
                e.stopPropagation();
              }}
              className="absolute top-1/2 -ml-[20px] -mt-[20px] flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white text-[#2B3A67] shadow-lg"
            >
              <ChevronsLeftRight className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>
        <p className="mt-2 text-center text-[13px] text-[#8A8790]">Drag to compare</p>

        <SectionHeader>Hidden in the photo file</SectionHeader>
        <div className="mx-4 overflow-hidden rounded-[16px] bg-white">
          {meta.map(({ Icon, label, from }, i) => (
            <div key={label} className={`flex items-center gap-3 px-4 py-[12px] ${i < meta.length - 1 ? "border-b border-[#ECE7DE]" : ""}`}>
              <Icon className="h-5 w-5 shrink-0 text-[#7A7781]" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-medium">{label}</p>
                <p className="truncate text-[13px] text-[#7A7781]">{from}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-[#C4C0C8]" aria-hidden />
              <span className="rounded-full px-2 py-[3px] text-[12px] font-semibold" style={{ background: APP.sageSoft, color: APP.sageDeep }}>
                {stripped || saved ? "Removed" : "On save"}
              </span>
            </div>
          ))}
        </div>

        <div className="px-4 pt-5">
          {saved ? (
            <Button onClick={() => go("album", { mode: "tab" })} variant="navy" hint={!driven}>
              View in Safe to Share
            </Button>
          ) : (
            <Button onClick={onSave} hint={!driven} icon={<Check className="h-5 w-5" aria-hidden />}>
              Save to Safe to Share
            </Button>
          )}
        </div>
        <Card className="mx-4 mt-4 p-3 text-center text-[13px] leading-snug text-[#6B6B73]">
          The original stays in your camera roll, untouched.
        </Card>
      </ScreenBody>

      <AnimatePresence>
        {done && (
          <motion.div
            className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#F6F2EA]/85 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="status"
          >
            <motion.div initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 420, damping: 16 }} className="relative">
              <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden>
                <circle cx="60" cy="60" r="54" fill={APP.sage} />
                <motion.path
                  d="M36 62 L53 78 L86 44"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.2, duration: 0.45 }}
                />
              </svg>
              <Brownie pose="thumbsup" size={74} className="absolute -bottom-4 -right-12" />
            </motion.div>
            <p className="mt-6 text-[20px] font-bold">Saved to Safe to Share</p>
            <p className="mt-1 text-[14px] text-[#6B6B73]">Ready when you are.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
