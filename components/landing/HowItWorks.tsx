//created by kinjal
import Image from "next/image";
import { Images, ScanLine, Sparkles, ShieldCheck } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

const STEPS = [
  { img: "step-access", icon: Images, title: "Give photo access once", body: "Pick all photos or just a few. You can change it anytime." },
  { img: "step-scan", icon: ScanLine, title: "SafePost scans on your phone", body: "New photos get checked quietly in the background." },
  { img: "step-fix", icon: Sparkles, title: "It blurs, strips location, and explains", body: "Each finding comes with a plain reason and a fix." },
  { img: "step-ready", icon: ShieldCheck, title: "Your safe version is ready to post", body: "Clean copies wait in your Safe to Share album." },
];

export default function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-title" className="relative bg-paper2/70 px-4 py-24 sm:px-6 sm:py-32">
      <SectionHeader
        eyebrow="How it works"
        title={<span id="how-title">Four quiet steps between the camera and the post.</span>}
        mascot="brownie-camera"
        mascotAlt="Brownie mascot holding a camera"
      />
      <ol className="relative mx-auto mt-16 grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {/* Connecting line on wide screens */}
        <div aria-hidden className="absolute left-[12%] right-[12%] top-[92px] hidden border-t-2 border-dashed border-compassion/40 lg:block" />
        {STEPS.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.1}>
            <li className="relative flex flex-col items-center text-center">
              <div className="relative grid h-[184px] w-[184px] place-items-center rounded-full border border-line bg-card shadow-soft">
                <Image src={`/assets/${s.img}.webp`} alt="" width={240} height={240} className="h-32 w-auto" />
                <span className="absolute -right-1 top-3 grid h-11 w-11 place-items-center rounded-full bg-respect text-paper shadow-soft">
                  <s.icon size={20} aria-hidden />
                </span>
              </div>
              <p className="mt-6 text-sm font-semibold text-compassion-deep">Step {i + 1}</p>
              <h3 className="mt-1 max-w-[16rem] font-display text-xl font-medium leading-snug text-ink">{s.title}</h3>
              <p className="mt-2 max-w-[16rem] text-[15px] leading-relaxed text-muted">{s.body}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
