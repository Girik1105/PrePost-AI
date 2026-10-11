//created by kinjal
// Scene data for the prototype. Every detection points at an SVG group id inside
// the matching scene in components/prototype/scenes, so blur and remove act on
// exactly that object. Boxes use the scene viewBox (400 x 300).

export type SceneId =
  | "school"
  | "birthday"
  | "porch"
  | "coffee"
  | "private"
  | "picnic"
  | "sunset"
  | "dog"
  | "flowers";

export type Category = "Location" | "Identity" | "Financial" | "Child safety" | "Metadata";
export type Fix = "blur" | "remove" | "strip";
export type Verdict = "safe" | "caution" | "dont_post" | null;
export type ObjMode = "none" | "blur" | "remove";

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Detection {
  id: string; // also the SVG element id
  label: string; // list title
  chip: string; // short label drawn on the photo
  category: Category;
  reason: string;
  fix: Fix;
  box?: Box; // metadata findings have no box
  chipBelow?: boolean; // draw the label under the box when neighbors are crowded
}

export interface Scene {
  id: SceneId;
  title: string;
  alt: string;
  takenAt: string;
  location: string | null;
  hasChild: boolean;
  verdict: Verdict;
  score: number | null;
  detections: Detection[];
  why?: string;
  question?: string;
  privateMoment?: boolean;
  extra?: boolean; // harmless filler photo in the camera roll
}

export const VIEWBOX = { w: 400, h: 300 };

export const SCENES: Record<SceneId, Scene> = {
  school: {
    id: "school",
    title: "School pickup",
    alt: "Illustration of a girl with a backpack outside a school with a sign that reads Lincoln Oaks Elementary",
    takenAt: "Today, 3:12 PM",
    location: "Tempe, AZ",
    hasChild: true,
    verdict: "caution",
    score: 72,
    detections: [
      {
        id: "school-sign",
        label: "School name on sign",
        chip: "School name",
        category: "Location",
        reason: "Shows exactly which school Maya goes to.",
        fix: "blur",
        box: { x: 168, y: 82, w: 196, h: 38 },
      },
      {
        id: "school-crest",
        chipBelow: true,
        label: "Uniform crest",
        chip: "Crest",
        category: "Child safety",
        reason: "The crest matches the school, even if the sign is hidden.",
        fix: "blur",
        box: { x: 79, y: 168, w: 30, h: 33 },
      },
      {
        id: "school-tag",
        label: "Name tag on backpack",
        chip: "Name tag",
        category: "Identity",
        reason: "Her first name and last initial, readable from across the room.",
        fix: "blur",
        box: { x: 118, y: 184, w: 46, h: 22 },
      },
      {
        id: "school-gps",
        label: "Location in photo data",
        chip: "GPS",
        category: "Metadata",
        reason: "The photo file stores where it was taken, down to the street.",
        fix: "strip",
      },
    ],
    why: "This shows Maya's full first name, last initial, and school. Together, that's enough for a stranger to find her at pickup time. Blurring these keeps the moment and loses the risk.",
    question: "Would Maya be okay with this at 16?",
  },
  birthday: {
    id: "birthday",
    title: "Birthday cake",
    alt: "Illustration of a birthday cake that reads Happy Birthday Maya Johnson with a number seven candle",
    takenAt: "Sat, 6:40 PM",
    location: "Tempe, AZ",
    hasChild: true,
    verdict: "caution",
    score: 58,
    detections: [
      {
        id: "bday-name",
        label: "Full name on cake",
        chip: "Full name",
        category: "Identity",
        reason: "First and last name together make her easy to search for.",
        fix: "blur",
        box: { x: 126, y: 196, w: 148, h: 26 },
      },
      {
        id: "bday-age",
        label: "Age candle",
        chip: "Age",
        category: "Child safety",
        reason: "Age plus name narrows her down to one child.",
        fix: "blur",
        box: { x: 186, y: 112, w: 30, h: 46 },
      },
      {
        id: "bday-date",
        label: "Birth date on banner",
        chip: "Birthday",
        category: "Identity",
        reason: "Name and birthday are two of the three things used to open accounts in her name.",
        fix: "blur",
        box: { x: 128, y: 14, w: 146, h: 40 },
      },
    ],
    why: "A full name, an age, and a birthday are the starter kit for identity theft. Kids have clean credit, so it can go unnoticed for years. Blur the name and date and it's still the best cake ever.",
    question: "Would Maya be okay with this at 16?",
  },
  porch: {
    id: "porch",
    title: "Front porch",
    alt: "Illustration of a family on the front steps of a house with house number 2417, a mailbox, a street sign and a parked car",
    takenAt: "Sun, 10:05 AM",
    location: "Tempe, AZ",
    hasChild: true,
    verdict: "dont_post",
    score: 88,
    detections: [
      {
        id: "porch-number",
        label: "House number",
        chip: "House number",
        category: "Location",
        reason: "With the street sign, this is your home address.",
        fix: "blur",
        box: { x: 196, y: 92, w: 52, h: 24 },
      },
      {
        id: "porch-street",
        label: "Street sign",
        chip: "Street",
        category: "Location",
        reason: "Names your street for anyone who looks closely.",
        fix: "blur",
        box: { x: 12, y: 44, w: 76, h: 26 },
      },
      {
        id: "porch-mailbox",
        label: "Name on mailbox",
        chip: "Mailbox",
        category: "Identity",
        reason: "Puts your family name next to your address.",
        fix: "blur",
        box: { x: 98, y: 168, w: 44, h: 26 },
      },
      {
        id: "porch-plate",
        label: "License plate",
        chip: "Plate",
        category: "Identity",
        reason: "A plate can be used to track your car and where you park it.",
        fix: "blur",
        box: { x: 318, y: 240, w: 50, h: 18 },
      },
      {
        id: "porch-gps",
        label: "Location in photo data",
        chip: "GPS",
        category: "Metadata",
        reason: "The file stores the exact spot this was taken: your front door.",
        fix: "strip",
      },
    ],
    why: "Your house number, street, and family name are all in one frame. That's a home address with a picture of who lives there. Hide them and it's just a sunny morning on the porch.",
    question: "Would Maya be okay with this at 16?",
  },
  coffee: {
    id: "coffee",
    title: "Coffee table",
    alt: "Illustration of a latte, a Mesa Bank credit card and a boarding pass with a QR code on a wooden table",
    takenAt: "Fri, 8:20 AM",
    location: "Phoenix Sky Harbor",
    hasChild: false,
    verdict: null,
    score: 91,
    detections: [
      {
        id: "coffee-card",
        label: "Card number",
        chip: "Card number",
        category: "Financial",
        reason: "A readable card number is all someone needs to shop online.",
        fix: "blur",
        box: { x: 214, y: 150, w: 158, h: 98 },
      },
      {
        id: "coffee-pass",
        chipBelow: true,
        label: "Name and booking code",
        chip: "Booking code",
        category: "Identity",
        reason: "Your name and booking code let someone change or cancel your trip.",
        fix: "blur",
        box: { x: 30, y: 180, w: 128, h: 70 },
      },
      {
        id: "coffee-qr",
        chipBelow: true,
        label: "Boarding pass QR code",
        chip: "QR code",
        category: "Identity",
        reason: "The QR code holds your full booking details.",
        fix: "blur",
        box: { x: 160, y: 186, w: 46, h: 46 },
      },
    ],
    why: "Card numbers and boarding pass codes get scraped from public photos within hours. Blur them and you still get to show off the latte.",
  },
  private: {
    id: "private",
    title: "Private moment",
    alt: "Hidden photo. Private moment detected.",
    takenAt: "Thu, 7:02 PM",
    location: null,
    hasChild: true,
    verdict: "dont_post",
    score: null,
    detections: [],
    privateMoment: true,
    why: "Some moments are just for family. PrePost recognizes them on your phone and never sends them to any AI or server.",
    question: "Would Maya be okay with this at 16?",
  },
  picnic: {
    id: "picnic",
    title: "Park picnic",
    alt: "Illustration of a child flying a kite in a park next to a picnic blanket",
    takenAt: "Wed, 5:30 PM",
    location: null,
    hasChild: true,
    verdict: "safe",
    score: 8,
    detections: [],
    why: "No names, no signs, no location. Just a kid and a kite. This one's good to go.",
    question: "Would Maya be okay with this at 16?",
  },
  sunset: {
    id: "sunset",
    title: "Desert sunset",
    alt: "Illustration of a sunset over desert hills",
    takenAt: "Tue, 6:58 PM",
    location: null,
    hasChild: false,
    verdict: null,
    score: 2,
    detections: [],
    extra: true,
  },
  dog: {
    id: "dog",
    title: "Biscuit",
    alt: "Illustration of a happy golden dog",
    takenAt: "Mon, 9:10 AM",
    location: null,
    hasChild: false,
    verdict: null,
    score: 3,
    detections: [],
    extra: true,
  },
  flowers: {
    id: "flowers",
    title: "Garden",
    alt: "Illustration of flowers in a garden",
    takenAt: "Sun, 4:44 PM",
    location: null,
    hasChild: false,
    verdict: null,
    score: 1,
    detections: [],
    extra: true,
  },
};

// Camera roll order (newest first)
export const ROLL: SceneId[] = ["school", "birthday", "porch", "coffee", "private", "picnic", "sunset", "dog", "flowers"];

export type Risk = "safe" | "caution" | "danger";

export function riskOf(scene: Scene): Risk {
  if (scene.privateMoment || scene.verdict === "dont_post") return "danger";
  if (scene.score !== null && scene.score >= 80) return "danger";
  if (scene.score !== null && scene.score >= 40) return "caution";
  return "safe";
}

export const VERDICT_LABEL: Record<Exclude<Verdict, null>, string> = {
  safe: "Safe to post",
  caution: "Post with caution",
  dont_post: "Don't post as is",
};

/** Score that remains after the user fixes some findings. */
export function liveScore(scene: Scene, edits: Record<string, ObjMode>, stripped: boolean): number | null {
  if (scene.score === null) return null;
  if (scene.detections.length === 0) return scene.score;
  const open = scene.detections.filter((d) =>
    d.fix === "strip" ? !stripped : (edits[d.id] ?? "none") === "none",
  ).length;
  const share = open / scene.detections.length;
  return Math.max(4, Math.round(scene.score * share));
}

export function scoreWord(score: number): string {
  if (score >= 80) return "High exposure";
  if (score >= 40) return "Some exposure";
  return "Low exposure";
}
