//created by kinjal
import Image from "next/image";
import { BRAND } from "@/lib/brand";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

const PERSONAS = [
  {
    img: "persona-mom",
    alt: "A mother hugging her daughter in a park",
    who: "A mom",
    body: "She shares her daughter's first day of school. PrePost blurs the school sign and the name on the backpack.",
  },
  {
    img: "persona-walk",
    alt: "A woman walking home under a street lamp",
    who: "A woman walking home",
    body: "She moved cities to feel safe. PrePost keeps the street sign and the location out of her sunset photo.",
  },
  {
    img: "persona-teen",
    alt: "A teen taking a selfie",
    who: "A teen with a phone",
    body: "She posts her own selfies. PrePost spots the school crest on her hoodie and the address on a package behind her.",
  },
];

export default function ForEveryone() {
  return (
    <section id="everyone" aria-labelledby="everyone-title" className="px-4 py-24 sm:px-6 sm:py-32">
      <SectionHeader
        eyebrow="For everyone"
        title={<span id="everyone-title">{BRAND.forEveryone}</span>}
        intro="We started with kids. The same check protects anyone who doesn't want a photo to give away where they are."
      />
      <div className="mx-auto mt-16 grid max-w-6xl gap-6 md:grid-cols-3">
        {PERSONAS.map((p, i) => (
          <Reveal key={p.who} delay={i * 0.08}>
            <article className="lift h-full overflow-hidden rounded-[28px] border border-line bg-card shadow-soft">
              <div className="grid h-60 place-items-center bg-gradient-to-b from-paper2 to-card">
                <Image sizes="190px" src={`/assets/${p.img}.webp`} alt={p.alt} width={300} height={340} className="h-52 w-auto" />
              </div>
              <div className="p-7">
                <h3 className="font-display text-2xl font-medium text-ink">{p.who}</h3>
                <p className="mt-2 leading-relaxed text-muted">{p.body}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
