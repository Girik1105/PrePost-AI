//created by kinjal
"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ComponentType } from "react";
import PhoneFrame from "./PhoneFrame";
import { useProto, type ScreenId } from "./PrototypeController";
import LockScreen from "./screens/LockScreen";
import { Access, Kids, Welcome } from "./screens/Onboarding";
import Home from "./screens/Home";
import Scan from "./screens/Scan";
import Detail from "./screens/Detail";
import TalkToEdit from "./screens/TalkToEdit";
import Compare from "./screens/Compare";
import Album from "./screens/Album";
import Social from "./screens/Social";
import Insights from "./screens/Insights";
import Settings from "./screens/Settings";

const SCREENS: Record<ScreenId, ComponentType> = {
  welcome: Welcome,
  access: Access,
  kids: Kids,
  lock: LockScreen,
  home: Home,
  scan: Scan,
  detail: Detail,
  edit: TalkToEdit,
  compare: Compare,
  album: Album,
  social: Social,
  insights: Insights,
  settings: Settings,
};

const LIGHT_STATUS: ScreenId[] = ["lock", "edit"];

const variants = {
  enter: ({ dir, reduce }: { dir: number; reduce: boolean }) =>
    reduce || dir === 0 ? { opacity: 0, x: 0, zIndex: 1 } : { x: dir > 0 ? "100%" : "-30%", opacity: 1, zIndex: dir > 0 ? 2 : 0 },
  center: { x: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 360, damping: 38, mass: 0.9 } },
  exit: ({ dir, reduce }: { dir: number; reduce: boolean }) =>
    reduce || dir === 0
      ? { opacity: 0, zIndex: 0, transition: { duration: 0.25 } }
      : { x: dir > 0 ? "-30%" : "100%", zIndex: dir > 0 ? 0 : 2, transition: { type: "spring" as const, stiffness: 360, damping: 38 } },
};

export default function PhoneScreens({ className = "" }: { className?: string }) {
  const { state, touch } = useProto();
  const reduce = !!useReducedMotion();
  const Screen = SCREENS[state.screen];
  const custom = { dir: state.dir, reduce };

  return (
    <div onPointerDownCapture={touch} onKeyDownCapture={(e) => (e.key === "Enter" || e.key === " ") && touch()} className={className}>
      <PhoneFrame statusTone={LIGHT_STATUS.includes(state.screen) ? "light" : "dark"}>
        <AnimatePresence initial={false} custom={custom}>
          <motion.div
            key={state.screen}
            custom={custom}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 bg-[#F6F2EA]"
            style={{ boxShadow: state.dir !== 0 ? "-8px 0 24px rgba(0,0,0,0.08)" : undefined }}
          >
            <Screen />
          </motion.div>
        </AnimatePresence>
      </PhoneFrame>
    </div>
  );
}
