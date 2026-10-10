//created by kinjal
// Talk-to-edit: tiny keyword parser. Action word + target word -> detection id.
import { SCENES, type SceneId } from "./scenes";

export type EditAction = "blur" | "remove";

export interface ParsedCommand {
  action: EditAction;
  targetId: string;
  targetLabel: string;
}

const ACTIONS: Record<string, EditAction> = {
  blur: "blur",
  hide: "blur",
  pixelate: "blur",
  cover: "blur",
  mask: "blur",
  obscure: "blur",
  remove: "remove",
  erase: "remove",
  delete: "remove",
  "get rid": "remove",
  "take out": "remove",
};

// Target synonyms per detection id. Order matters only inside a scene.
const TARGETS: Record<string, { words: string[]; label: string }> = {
  "school-sign": { words: ["school sign", "sign", "school", "building", "street sign", "name of the school"], label: "school sign" },
  "school-crest": { words: ["crest", "logo", "uniform", "badge", "shirt"], label: "crest" },
  "school-tag": { words: ["name tag", "tag", "backpack", "bag", "name", "maya"], label: "name tag" },
  "bday-name": { words: ["full name", "name", "cake", "johnson", "maya", "writing"], label: "name on the cake" },
  "bday-age": { words: ["age", "candle", "seven", "7"], label: "age candle" },
  "bday-date": { words: ["date", "birthday", "banner", "may"], label: "birthday banner" },
  "porch-number": { words: ["house number", "number", "house", "address", "2417"], label: "house number" },
  "porch-street": { words: ["street sign", "street", "sign", "road"], label: "street sign" },
  "porch-mailbox": { words: ["mailbox", "mail", "last name", "family name", "name"], label: "mailbox name" },
  "porch-plate": { words: ["license plate", "plate", "license", "car"], label: "license plate" },
  "coffee-card": { words: ["credit card", "card", "credit", "bank", "number"], label: "card" },
  "coffee-pass": { words: ["boarding pass", "pass", "ticket", "boarding", "booking", "flight"], label: "boarding pass" },
  "coffee-qr": { words: ["qr code", "qr", "code", "barcode"], label: "QR code" },
};

function findAction(text: string): EditAction {
  for (const [word, action] of Object.entries(ACTIONS)) {
    if (text.includes(word)) return action;
  }
  return "blur"; // "the street sign please" still means hide it
}

export function hasActionWord(text: string): boolean {
  const t = text.toLowerCase();
  return Object.keys(ACTIONS).some((w) => t.includes(w));
}

/** Returns null when nothing in this scene matches. */
export function parseCommand(input: string, sceneId: SceneId): ParsedCommand | null {
  const text = ` ${input.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ")} `;
  const ids = SCENES[sceneId].detections.filter((d) => d.fix !== "strip").map((d) => d.id);
  let best: { id: string; len: number } | null = null;
  for (const id of ids) {
    const t = TARGETS[id];
    if (!t) continue;
    for (const w of t.words) {
      if (text.includes(` ${w} `) || text.includes(` ${w}s `)) {
        // longest phrase wins so "street sign" beats "sign"
        if (!best || w.length > best.len) best = { id, len: w.length };
      }
    }
  }
  if (!best) return null;
  return { action: findAction(text), targetId: best.id, targetLabel: TARGETS[best.id].label };
}

/** Wants location stripped ("remove location", "strip gps"). */
export function isLocationCommand(input: string): boolean {
  return /\b(location|gps|metadata|where)\b/i.test(input);
}

export const SUGGESTIONS: Record<SceneId, string[]> = {
  school: ["Blur the school sign", "Remove the name tag", "Hide the crest"],
  birthday: ["Blur the name", "Hide the birthday banner", "Blur the age candle"],
  porch: ["Remove the house number", "Blur the street sign", "Hide the license plate"],
  coffee: ["Blur the card", "Hide the boarding pass", "Blur the QR code"],
  private: [],
  picnic: [],
  sunset: [],
  dog: [],
  flowers: [],
};
