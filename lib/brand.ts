//created by kinjal
// One place for the product name, copy constants and palette.
// Rename the product here (alternatives: "PostGuard", "Before You Post", "Ask First").

export const BRAND = {
  name: "SafePost",
  tagline: "Everything posted online is ink.",
  closer: "Everything posted online is ink. Check it first.",
  forEveryone: "Built for kids. Works for everyone.",
  team: "Brownies in the Sky",
  event: "Hacks for Humanity 2026",
  socialApp: "Snapline", // invented social app used inside the prototype
  kid: "Maya",
  kid2: "Leo",
} as const;

// Principle color system. The same hex values live as CSS variables in app/globals.css.
export const PRINCIPLES = {
  respect: { label: "Respect", hex: "#2B3A67" },
  compassion: { label: "Compassion", hex: "#E8846B" },
  reflection: { label: "Self-reflection", hex: "#8F80C2" },
  integrity: { label: "Integrity", hex: "#6F9E7D" },
} as const;

export const VERDICT_COLORS = {
  safe: "#5E8F6C",
  caution: "#D99A2B",
  dont_post: "#B5543F",
} as const;
