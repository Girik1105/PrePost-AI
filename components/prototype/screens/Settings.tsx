//created by kinjal
"use client";

import { Bell, Baby, Cpu, Images, GpsSlash as MapPinOff, ArrowCounterClockwise as RotateCcw, UserFocus as ScanFace } from "@phosphor-icons/react/dist/ssr";
import { useProto } from "../PrototypeController";
import { APP, LargeTitle, ListGroup, ListRow, ScreenBody, SectionHeader, TabBar, Toggle } from "../ui/kit";

const ROWS = [
  { id: "faces", title: "Blur bystander faces", sub: "Softly blurs strangers in the background. Your family stays as is.", Icon: ScanFace, bg: APP.lav },
  { id: "location", title: "Always strip location", sub: "Removes where a photo was taken from every safe version.", Icon: MapPinOff, bg: "#D98A3E" },
  { id: "ondevice", title: "On-device only mode", sub: "Nothing leaves your phone, ever. Some checks get simpler.", Icon: Cpu, bg: APP.sageDeep },
  { id: "names", title: "Kids' names", sub: "Catch Maya and Leo on signs, cakes, and captions.", Icon: Baby, bg: APP.coral },
  { id: "notifications", title: "Notifications", sub: "A gentle heads-up when a new photo needs a look.", Icon: Bell, bg: APP.navy },
] as const;

export default function Settings() {
  const { state, patch, go } = useProto();
  const set = (id: string, v: boolean) => patch({ settings: { ...state.settings, [id]: v } });
  return (
    <>
      <ScreenBody tabbar>
        <LargeTitle title="Settings" />
        <SectionHeader>Protection</SectionHeader>
        <ListGroup>
          {ROWS.map((r, i) => (
            <ListRow
              key={r.id}
              icon={<r.Icon className="h-[18px] w-[18px]" aria-hidden />}
              iconBg={r.bg}
              title={r.title}
              sub={r.sub}
              last={i === ROWS.length - 1}
              right={<Toggle on={!!state.settings[r.id]} onChange={(v) => set(r.id, v)} label={r.title} />}
            />
          ))}
        </ListGroup>
        <p className="px-5 pt-2 text-[13px] leading-snug text-[#8A8790]">Private moments are always checked on your phone and never uploaded, whatever you choose here.</p>

        <SectionHeader>Your photos</SectionHeader>
        <ListGroup>
          <ListRow
            icon={<Images className="h-[18px] w-[18px]" aria-hidden />}
            iconBg={APP.coral}
            title="Photo access"
            right={<span className="text-[15px] text-[#8A8790]">{state.access === "selected" ? "Selected" : "All Photos"}</span>}
            chevron
            onClick={() => go("access")}
          />
          <ListRow icon={<RotateCcw className="h-[18px] w-[18px]" aria-hidden />} iconBg="#8A8790" title="See onboarding again" chevron last onClick={() => go("welcome", { mode: "replace" })} />
        </ListGroup>
        <p className="px-5 pb-6 pt-4 text-center text-[12px] text-[#A29FA8]">PrePost is a hackathon prototype.</p>
      </ScreenBody>
      <TabBar />
    </>
  );
}
