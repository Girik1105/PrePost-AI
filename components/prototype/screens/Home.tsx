//created by kinjal
"use client";

import { motion } from "framer-motion";
import { ChartBar as BarChart3, CaretRight as ChevronRight, Images, Scan as ScanLine, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { SCENES } from "@/lib/scenes";
import { useProto } from "../PrototypeController";
import { APP, Brownie, Card, LargeTitle, ScreenBody, SectionHeader, TabBar } from "../ui/kit";
import SceneArt from "../scenes/SceneArt";

// Last 10 posts: 1 = shared a location. 4 of 10.
const TREND = [1, 0, 0, 1, 0, 1, 0, 0, 1, 0];
const EXPOSURE = [62, 30, 18, 70, 24, 66, 20, 12, 72, 8];

function TrendChart() {
  const w = 300;
  const h = 70;
  const step = w / (EXPOSURE.length - 1);
  const pts = EXPOSURE.map((v, i) => [i * step, h - (v / 100) * h] as const);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`-6 -6 ${w + 12} ${h + 12}`} className="h-[82px] w-full" role="img" aria-label="Exposure across your last 10 posts. 4 shared a location.">
      <path d={`${d} L${w} ${h} L0 ${h}Z`} fill="url(#trend-fill)" />
      <defs>
        <linearGradient id="trend-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={APP.lav} stopOpacity="0.28" />
          <stop offset="1" stopColor={APP.lav} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path d={d} fill="none" stroke={APP.lav} strokeWidth={2.5} strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={TREND[i] ? 5 : 3.2} fill={TREND[i] ? APP.coral : "#fff"} stroke={TREND[i] ? "#fff" : APP.lav} strokeWidth={2} />
      ))}
    </svg>
  );
}

export default function Home() {
  const { go, driven } = useProto();
  return (
    <>
      <ScreenBody tabbar>
        <LargeTitle title="Today" sub="Saturday, October 10" right={<Brownie pose="wave" size={52} className="animate-bob" alt="" />} />

        <div className="px-4">
          <Card className="overflow-hidden">
            <button type="button" onClick={() => go("detail", { scene: "school" })} className={`flex w-full items-center gap-3 p-4 text-left ${!driven ? "tap-hint rounded-[18px]" : ""}`}>
              <div className="flex -space-x-3">
                {(["school", "birthday", "picnic"] as const).map((id) => (
                  <SceneArt key={id} id={id} className="h-[52px] w-[52px] rounded-[12px] border-2 border-white shadow-sm" />
                ))}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[17px] font-semibold leading-tight">3 new photos scanned.</p>
                <p className="mt-[2px] text-[15px] font-medium" style={{ color: APP.amberDeep }}>
                  1 needs a look.
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-[#C4C0C8]" aria-hidden />
            </button>
            <div className="flex items-center gap-2 border-t border-[#F0EBE3] px-4 py-[10px] text-[13px] text-[#6B6B73]">
              <span className="h-2 w-2 rounded-full" style={{ background: APP.amber }} />
              {SCENES.school.title} · shows {SCENES.school.detections.length - 1} details and a location
            </div>
          </Card>
        </div>

        <SectionHeader>Exposure trend</SectionHeader>
        <div className="px-4">
          <Card className="p-4">
            <div className="flex items-baseline justify-between">
              <p className="text-[15px] font-semibold">Last 10 posts</p>
              <span className="flex items-center gap-1 text-[12px] text-[#8A8790]">
                <span className="h-2 w-2 rounded-full" style={{ background: APP.coral }} /> location shared
              </span>
            </div>
            <TrendChart />
            <p className="rounded-[12px] px-3 py-[10px] text-[14px] leading-snug" style={{ background: APP.lavSoft, color: "#3B2F6B" }}>
              You&apos;ve shared a location in 4 of your last 10 photos.
            </p>
          </Card>
        </div>

        <SectionHeader>Quick actions</SectionHeader>
        <div className="grid grid-cols-3 gap-3 px-4">
          {[
            { label: "Scan now", Icon: ScanLine, to: "scan" as const, bg: APP.coralSoft, fg: "#A04A33" },
            { label: "Safe to Share", Icon: ShieldCheck, to: "album" as const, bg: APP.sageSoft, fg: APP.sageDeep },
            { label: "Insights", Icon: BarChart3, to: "insights" as const, bg: APP.lavSoft, fg: APP.lavDeep },
          ].map(({ label, Icon, to, bg, fg }) => (
            <motion.button
              key={label}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => go(to, { mode: "tab" })}
              className="flex flex-col items-center gap-2 rounded-[18px] bg-white px-2 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            >
              <span className="flex h-[44px] w-[44px] items-center justify-center rounded-full" style={{ background: bg, color: fg }}>
                <Icon className="h-[22px] w-[22px]" aria-hidden />
              </span>
              <span className="text-[13px] font-medium">{label}</span>
            </motion.button>
          ))}
        </div>

        <SectionHeader>Recent</SectionHeader>
        <div className="px-4">
          <Card className="flex items-center gap-3 p-3">
            <span className="flex h-[40px] w-[40px] items-center justify-center rounded-full" style={{ background: APP.sageSoft, color: APP.sageDeep }}>
              <Images className="h-5 w-5" aria-hidden />
            </span>
            <p className="flex-1 text-[14px] leading-snug text-[#4A4852]">6 safe posts in a row. That care adds up.</p>
          </Card>
        </div>
      </ScreenBody>
      <TabBar />
    </>
  );
}
