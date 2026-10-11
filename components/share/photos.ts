//created by kinjal
// Camera roll for the share-flow prototype. All photos are AI-generated (Aside image generation);
// none of them show a real person. The porch photo is the one that gets checked.
import type { Category } from "@/lib/scenes";
import type { Box } from "@/lib/redact";

export const ROLL = [
  "wedding", "lake", "bench", "skyline", "pasta", "grads", "cat", "trail", "rooftop",
  "books", "summit", "tulips", "jog", "pancakes", "concert", "guitar", "sunset", "skate",
  "beach", "mirror", "plant", "bbq", "cooking", "leaves", "carsing", "bike", "reading",
  "sneakers", "yoga", "cake", "coffeewalk", "dog", "hikedog", "beachgirl", "latte", "brunch",
] as const;

export const MAIN = { src: "/assets/share/porch.webp", alt: "A woman holding a golden retriever puppy on the front steps of her house", taken: "Today  10:05 AM" };

export interface Finding {
  id: string;
  label: string;
  category: Category;
  reason: string;
  box: Box; // fractions of the photo
}

export const FINDINGS: Finding[] = [
  { id: "number", label: "House number", category: "Location", reason: "With the street sign, this is your home address.", box: { x: 0.15, y: 0.05, w: 0.13, h: 0.08 } },
  { id: "street", label: "Street sign", category: "Location", reason: "Names your street for anyone who zooms in.", box: { x: 0.76, y: 0.064, w: 0.14, h: 0.058 } },
  { id: "mailbox", label: "Name on mailbox", category: "Identity", reason: "Puts your family name right next to your address.", box: { x: 0.655, y: 0.268, w: 0.135, h: 0.05 } },
  { id: "plate", label: "License plate", category: "Identity", reason: "A plate can be used to track your car and where you park.", box: { x: 0.88, y: 0.383, w: 0.075, h: 0.04 } },
];

export const SCORE = 86;
export const CAPTION = "Sunday mornings with Biscuit 🐶☀️";
export const HANDLE = "sarah.johnson";
