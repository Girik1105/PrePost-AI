//created by kinjal
import Image from "next/image";
import { MapPin } from "@phosphor-icons/react/dist/ssr";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

// TODO: verify source before adding any statistic to these cards. Copy stays qualitative for now.
/** The phone illustration, plus the one detail that matters most here: the exact spot it was taken. */
function HiddenDataArt() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl">
      <Image
        src="/assets/phones-contain-geo.webp"
        alt=""
        fill
        sizes="(min-width: 1024px) 260px, (min-width: 768px) 45vw, 90vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
      <p
        aria-hidden
        className="absolute left-3 top-3 flex -rotate-2 items-center gap-1.5 whitespace-nowrap rounded-full border border-[#E6DCCD] bg-white/95 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-[#1E2440] shadow-soft"
      >
        <MapPin size={12} weight="duotone" className="shrink-0 text-[#A84830]" />
        40.7128° N, 74.0060° W
      </p>
    </div>
  );
}

const CARDS: { img?: string; art?: () => JSX.Element; alt: string; title: string; body: string; tint: string }[] = [
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
    art: HiddenDataArt,
    alt: "A phone with layers of hidden file data, including a pinned location, peeling out of a photo",
    title: "Photos carry a hidden map.",
    body: "Your phone saves where and when each photo was taken inside the file. Send the original, and anyone who opens it can read the exact spot.",
    tint: "bg-respect/10",
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
      <div className="mx-auto mt-16 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.08}>
            <article className="group h-full rounded-[28px] border border-line bg-card p-6 shadow-soft lift">
              <div className={`grid h-48 place-items-center rounded-2xl ${c.tint}`}>
                {c.art ? (
                  <>
                    <c.art />
                    <span className="sr-only">{c.alt}</span>
                  </>
                ) : (
                  <Image sizes="180px"
                    src={`/assets/${c.img}.webp`}
                    alt={c.alt}
                    width={320}
                    height={320}
                    className="h-40 w-auto transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                )}
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
