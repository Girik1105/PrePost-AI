//created by kinjal
import Image from "next/image";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

// TODO: verify source before adding any statistic to these cards. Copy stays qualitative for now.
const CARDS = [
  {
    img: "problem-consent",
    alt: "A child's snapshot floating away into a cloud of phones",
    title: "Kids can't say no.",
    body: "Parents post hundreds of photos before a child can consent, and those photos follow them for life.",
    tint: "bg-reflection/15",
  },
  {
    img: "problem-details",
    alt: "A magnifying glass over a small house number",
    title: "Small details, big risks.",
    body: "A school sign, a house number, a boarding pass. Each one can be used for fraud, stalking, or worse.",
    tint: "bg-compassion/15",
  },
  {
    img: "problem-ink",
    alt: "A phone stamped like a posted letter",
    title: "Nothing warns you first.",
    body: "Platforms clean up after the fact. By then, it's already ink.",
    tint: "bg-integrity/15",
  },
];

export default function Problem() {
  return (
    <section id="problem" aria-labelledby="problem-title" className="relative px-4 py-24 sm:px-6 sm:py-32">
      <SectionHeader
        eyebrow="The problem"
        title={<span id="problem-title">A photo can say more than you meant.</span>}
        intro="People share photos out of love and pride. Tucked in the background are details that strangers can use to find, follow, or impersonate them."
      />
      <div className="mx-auto mt-16 grid max-w-6xl gap-6 md:grid-cols-3">
        {CARDS.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.08}>
            <article className="group h-full rounded-[28px] border border-line bg-card p-7 shadow-soft transition-transform duration-300 hover:-translate-y-1">
              <div className={`grid h-48 place-items-center rounded-2xl ${c.tint}`}>
                <Image
                  src={`/assets/${c.img}.webp`}
                  alt={c.alt}
                  width={320}
                  height={320}
                  className="h-40 w-auto transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <h3 className="mt-6 font-display text-2xl font-medium text-ink">{c.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{c.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
