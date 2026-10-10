//created by kinjal
import { Globe, Type, History, Users, Stethoscope } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

const ITEMS = [
  { icon: Globe, title: "Browser extension", body: "The same check for photos you upload from a computer." },
  { icon: Type, title: "Caption check", body: "Catch names and birthdays in what you write, too." },
  { icon: History, title: "Scan your existing profile", body: "Find posts that are already live and fix them." },
  { icon: Users, title: "Family mode", body: "Parents and grandparents share the same rules for the kids." },
  { icon: Stethoscope, title: "Pediatricians and schools", body: "Partner with the people families already trust." },
];

export default function Roadmap() {
  return (
    <section id="roadmap" aria-labelledby="roadmap-title" className="px-4 py-24 sm:px-6 sm:py-32">
      <SectionHeader
        eyebrow="Roadmap"
        title={<span id="roadmap-title">What&apos;s next</span>}
        intro="These are future plans. They aren't in the prototype yet."
      />
      <ol className="relative mx-auto mt-16 max-w-3xl">
        <div aria-hidden className="absolute bottom-4 left-[22px] top-4 border-l-2 border-dashed border-line" />
        {ITEMS.map((it, i) => (
          <Reveal key={it.title} delay={i * 0.06}>
            <li className="relative flex gap-5 pb-8 last:pb-0">
              <span className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line bg-card text-respect shadow-soft">
                <it.icon size={19} aria-hidden />
              </span>
              <div className="flex-1 rounded-2xl border border-line bg-card px-5 py-4 shadow-soft">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-ink">{it.title}</h3>
                  <span className="rounded-full bg-reflection/20 px-2.5 py-0.5 text-xs font-semibold text-reflection-deep">
                    Future
                  </span>
                </div>
                <p className="mt-1 text-[15px] text-muted">{it.body}</p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
