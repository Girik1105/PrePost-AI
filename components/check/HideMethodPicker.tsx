//created by kinjal
"use client";

import { Drop as Droplets, Eraser, GridNine as Grid3x3 } from "@phosphor-icons/react/dist/ssr";
import type { RedactStyle } from "@/lib/redact";

const METHODS: { id: RedactStyle; label: string; note: string; Icon: typeof Eraser; ai?: boolean }[] = [
  { id: "erase", label: "Erase", note: "Rebuilds the background", Icon: Eraser, ai: true },
  { id: "blur", label: "Blur", note: "Softens it past reading", Icon: Droplets },
  { id: "pixelate", label: "Pixelate", note: "Turns it into blocks", Icon: Grid3x3 },
];

/** How the found details get hidden. Sits right above the photo, since it changes what you see. */
export default function HideMethodPicker({ value, onChange }: { value: RedactStyle; onChange: (v: RedactStyle) => void }) {
  return (
    <div role="radiogroup" aria-label="How to hide what it found" className="grid grid-cols-3 gap-2">
      {METHODS.map(({ id, label, note, Icon, ai }) => {
        const on = value === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(id)}
            className={`flex items-center gap-3 rounded-2xl border p-2.5 text-left transition-colors sm:p-3 ${
              on ? "border-compassion bg-card shadow-soft ring-2 ring-compassion/25" : "border-line bg-paper hover:bg-card"
            }`}
          >
            <span
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-colors ${
                on ? "bg-compassion text-[#1E2440]" : "bg-respect/10 text-respect"
              }`}
            >
              <Icon size={18} aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-1.5 font-semibold text-ink">
                {label}
                {ai && <span className="rounded-full bg-integrity/15 px-1.5 py-px text-[11px] font-semibold text-integrity-deep">AI</span>}
              </span>
              <span className="hidden truncate text-xs text-muted sm:block">{note}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
