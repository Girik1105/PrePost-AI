//created by kinjal
"use client";

import { motion } from "framer-motion";
import { Flame, Sparkle as Sparkles } from "@phosphor-icons/react/dist/ssr";
import { useProto } from "../PrototypeController";
import { APP, Brownie, Card, LargeTitle, ScreenBody, SectionHeader, TabBar } from "../ui/kit";

const HABITS = [
  { label: "Location", count: 4, color: "#D98A3E" },
  { label: "School", count: 3, color: APP.lav },
  { label: "Names", count: 3, color: APP.navy },
  { label: "House numbers", count: 1, color: APP.coral },
  { label: "Cards and tickets", count: 1, color: APP.brick },
];

export default function Insights() {
  useProto();
  const max = Math.max(...HABITS.map((h) => h.count));
  return (
    <>
      <ScreenBody tabbar>
        <LargeTitle title="Insights" sub="Last 30 days" />

        <div className="px-4">
          <Card className="flex items-center gap-3 overflow-hidden p-4" style={{ background: "linear-gradient(135deg,#E3EFE6,#FFFFFF)" }}>
            <div className="flex-1">
              <p className="flex items-center gap-1 text-[13px] font-semibold uppercase tracking-wide" style={{ color: APP.sageDeep }}>
                <Flame className="h-4 w-4" aria-hidden /> Streak
              </p>
              <p className="mt-1 text-[28px] font-bold leading-tight tracking-tight">6 safe posts in a row</p>
              <p className="mt-1 text-[14px] leading-snug text-[#4A4852]">Every one of them checked first. That&apos;s care your kids will feel later.</p>
            </div>
            <Brownie pose="thumbsup" size={86} />
          </Card>
        </div>

        <SectionHeader>What slips through most</SectionHeader>
        <div className="px-4">
          <Card className="space-y-3 p-4">
            {HABITS.map((h, i) => (
              <div key={h.label}>
                <div className="flex justify-between text-[14px]">
                  <span className="font-medium">{h.label}</span>
                  <span className="text-[#7A7781]">
                    {h.count} photo{h.count > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="mt-[6px] h-[10px] overflow-hidden rounded-full bg-[#F1ECE4]">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: h.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(h.count / max) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.1 + i * 0.08 }}
                  />
                </div>
              </div>
            ))}
          </Card>
        </div>

        <SectionHeader>A gentle nudge</SectionHeader>
        <div className="px-4">
          <Card className="flex gap-3 p-4" style={{ background: APP.lavSoft }}>
            <Sparkles className="mt-[2px] h-5 w-5 shrink-0" style={{ color: APP.lavDeep }} aria-hidden />
            <p className="text-[15px] leading-snug" style={{ color: "#3B2F6B" }}>
              Location sneaks into most of your photos. Turning on <span className="font-semibold">Always strip location</span> in Settings handles it for you.
            </p>
          </Card>
        </div>

        <SectionHeader>This week</SectionHeader>
        <div className="grid grid-cols-2 gap-3 px-4">
          {[
            { n: "5", l: "details hidden before posting" },
            { n: "12", l: "photos checked on this phone" },
          ].map((s) => (
            <Card key={s.l} className="p-4">
              <p className="text-[30px] font-bold leading-none tracking-tight" style={{ color: APP.navy }}>
                {s.n}
              </p>
              <p className="mt-2 text-[13px] leading-snug text-[#6B6B73]">{s.l}</p>
            </Card>
          ))}
        </div>
      </ScreenBody>
      <TabBar />
    </>
  );
}
