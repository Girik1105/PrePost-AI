//created by kinjal
import { Microphone as Mic, ChatText as MessageSquareText } from "@phosphor-icons/react/dist/ssr";
import MiniTalkToEdit from "@/components/prototype/MiniTalkToEdit";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

const EXAMPLES = ["Blur the street sign", "Remove the house number", "Hide the license plate", "Blur the card"];

export default function TalkToEdit() {
  return (
    <section id="talk" aria-labelledby="talk-title" className="px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1fr_auto]">
        <div>
          <SectionHeader
            align="left"
            eyebrow="Talk to edit"
            title={<span id="talk-title">Just say what to hide.</span>}
            intro="Type it or say it. SafePost finds the thing you mean and blurs or removes it. Undo is always one tap away."
          />
          <Reveal delay={0.1}>
            <ul className="mt-8 flex flex-wrap gap-2.5" aria-label="Example commands">
              {EXAMPLES.map((e) => (
                <li key={e} className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-sm font-medium text-ink shadow-soft">
                  <MessageSquareText size={15} className="text-compassion-deep" aria-hidden />
                  &ldquo;{e}&rdquo;
                </li>
              ))}
            </ul>
            <p className="mt-6 flex items-start gap-2 text-sm text-muted">
              <Mic size={16} className="mt-0.5 shrink-0" aria-hidden />
              SafePost edits objects and text only. It never changes faces or bodies.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="mx-auto">
          <MiniTalkToEdit className="w-[260px] sm:w-[280px]" />
        </Reveal>
      </div>
    </section>
  );
}
