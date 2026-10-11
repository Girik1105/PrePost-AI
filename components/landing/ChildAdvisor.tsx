//created by kinjal
import Image from "next/image";
import { BRAND } from "@/lib/brand";
import SceneArt from "@/components/prototype/scenes/SceneArt";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

// One verdict per photo with a child in it. Color carries the meaning, no icons needed.
const VERDICTS = [
  { label: "Safe to post", note: "Nothing in it points back to your child.", dot: "bg-safe", ink: "ink-safe" },
  { label: "Post with caution", note: "A detail or two to soften first.", dot: "bg-caution", ink: "ink-caution", active: true },
  { label: "Don't post as is", note: "Keep it in the family album.", dot: "bg-danger", ink: "ink-danger" },
];

// The safe version removes the details outright, the same way /check erases them.
const SCHOOL_FIXED = { "school-sign": "remove", "school-crest": "remove", "school-tag": "remove" } as const;

export default function ChildAdvisor() {
  return (
    <section id="parents" aria-labelledby="parents-title" className="bg-paper2/70 px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <div>
          <SectionHeader
            align="left"
            eyebrow="Made for parents"
            eyebrowClass="text-reflection-deep"
            title={<span id="parents-title">A coach in your pocket. Never a scold.</span>}
            intro={`Sharing your kids is love. For photos with children, ${BRAND.name} gives one simple verdict and explains it with your child's future in mind.`}
          />
          <Reveal delay={0.1}>
            <ol className="mt-10 border-l-2 border-line" aria-label="The three verdicts">
              {VERDICTS.map((v) => (
                <li key={v.label} className="relative py-3 pl-6">
                  <span
                    aria-hidden
                    className={`absolute -left-[7px] top-[1.15rem] h-3 w-3 rounded-full ring-4 ring-paper2 ${v.dot} ${v.active ? "scale-125" : ""}`}
                  />
                  <p className={`font-display text-xl font-medium ${v.active ? v.ink : "text-ink"}`}>{v.label}</p>
                  <p className="mt-0.5 text-[15px] text-muted">{v.note}</p>
                </li>
              ))}
            </ol>
            <p className="mt-8 max-w-md font-display text-lg italic leading-relaxed text-ink/75">
              It points out what to fix and lets you decide. You know your family best.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="relative">
          <figure className="relative overflow-hidden rounded-[32px] border border-line bg-card shadow-lift">
            <div className="relative aspect-[16/9] w-full">
              <SceneArt id="school" edits={SCHOOL_FIXED} className="h-full w-full" />
              <span className="absolute bottom-3 left-3 rounded-full bg-card/95 px-3 py-1 text-xs font-semibold text-ink shadow-soft">
                School pickup · safe version
              </span>
            </div>
            <figcaption className="p-6 sm:p-8">
              <p className="flex items-center gap-2 text-sm font-semibold ink-caution">
                <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-caution" /> Post with caution
              </p>
              <h3 className="mt-4 font-display text-2xl font-medium text-ink">Why this matters</h3>
              <p className="mt-3 leading-relaxed text-ink/85">
                This shows {BRAND.kid}&apos;s full first name, last initial, and school. Together, that&apos;s enough for a
                stranger to find her at pickup time. Removing these keeps the moment and loses the risk.
              </p>
              <div className="mt-6 flex items-center gap-4 border-t border-line pt-6">
                <Image sizes="56px" src="/assets/brownie-thinking.webp" alt="" width={80} height={92} className="h-16 w-auto shrink-0" />
                <p className="font-display text-xl italic leading-snug text-reflection-deep">
                  Would {BRAND.kid} be okay with this at 16?
                </p>
              </div>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
