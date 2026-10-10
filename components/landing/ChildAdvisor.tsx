//created by kinjal
import Image from "next/image";
import { CheckCircle2, AlertCircle, XCircle, Heart } from "lucide-react";
import { BRAND } from "@/lib/brand";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

const VERDICTS = [
  { icon: CheckCircle2, label: "Safe to post", cls: "bg-safe/15 ink-safe border-safe/30" },
  { icon: AlertCircle, label: "Post with caution", cls: "bg-caution/15 ink-caution border-caution/40" },
  { icon: XCircle, label: "Don't post as is", cls: "bg-danger/12 ink-danger border-danger/30" },
];

export default function ChildAdvisor() {
  return (
    <section id="parents" aria-labelledby="parents-title" className="bg-paper2/70 px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
        <div>
          <SectionHeader
            align="left"
            eyebrow="Made for parents"
            eyebrowClass="text-reflection-deep"
            title={<span id="parents-title">A coach in your pocket. Never a scold.</span>}
            intro={`Sharing your kids is love. For photos with children, ${BRAND.name} gives a simple verdict and explains it with your child's future in mind.`}
          />
          <Reveal delay={0.1}>
            <ul className="mt-8 flex flex-wrap gap-3" aria-label="Verdicts">
              {VERDICTS.map((v) => (
                <li key={v.label} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${v.cls}`}>
                  <v.icon size={17} aria-hidden />
                  {v.label}
                </li>
              ))}
            </ul>
            <p className="mt-6 flex items-start gap-2 text-muted">
              <Heart size={18} className="mt-1 shrink-0 text-compassion" aria-hidden />
              It points out what to fix and lets you decide. You know your family best.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="relative">
          <div className="relative rounded-[32px] border border-line bg-card p-6 shadow-lift sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-caution/40 bg-caution/15 px-3 py-1.5 text-sm font-semibold ink-caution">
                <AlertCircle size={16} aria-hidden /> Post with caution
              </span>
              <span className="text-sm text-muted">School pickup photo</span>
            </div>
            <h3 className="mt-6 font-display text-2xl font-medium text-ink">Why this matters</h3>
            <p className="mt-3 leading-relaxed text-ink/85">
              This shows {BRAND.kid}&apos;s full first name, last initial, and school. Together, that&apos;s enough for a
              stranger to find her at pickup time. Blurring these keeps the moment and loses the risk.
            </p>
            <div className="mt-6 flex items-center gap-4 rounded-2xl bg-reflection/15 p-4 sm:p-5">
              <Image
                src="/assets/brownie-thinking.webp"
                alt="Brownie mascot thinking"
                width={80}
                height={92}
                className="h-16 w-auto shrink-0"
              />
              <p className="font-display text-xl italic leading-snug text-reflection-deep">
                Would {BRAND.kid} be okay with this at 16?
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
