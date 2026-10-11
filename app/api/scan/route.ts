//created by kinjal
// Optional live mode. Sends one uploaded photo to Claude vision and returns
// structured detections. The scripted prototype never depends on this route.
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 60;

const ScanSchema = z.object({
  detections: z.array(
    z.object({
      label: z.string(),
      category: z.enum(["Location", "Identity", "Financial", "Child safety", "Metadata"]),
      reason: z.string(),
      box: z.object({ x: z.number(), y: z.number(), w: z.number(), h: z.number() }),
    }),
  ),
  exposureScore: z.number(),
  containsChild: z.boolean(),
  verdict: z.enum(["safe", "caution", "dont_post"]).nullable(),
  whyItMatters: z.string(),
});

const SYSTEM = `You check photos before someone posts them on social media.
Find visible details a stranger could use to locate, identify, or defraud the person or a child in the photo:
school names, uniform crests, name tags, full names, ages, birthdays, house numbers, street signs, mailbox names,
license plates, card numbers, IDs, boarding passes, QR codes, screens showing emails or phone numbers.
Do not flag faces or bodies. Never describe people's appearance.
For each finding give a short label, a category, one plain sentence on why it matters, and a bounding box
as fractions of the image width and height (x, y = top-left corner, all values between 0 and 1).
Make each box tight but cover the whole object: the entire ID card, card, boarding pass or label, not just one line of text on it.
exposureScore is 0 to 100 (0 = nothing personal). containsChild is true if a child appears.
verdict is only for photos with a child (safe, caution, dont_post), otherwise null.
whyItMatters is two or three warm, plain sentences, coach tone, no scolding.`;

const MAX_BASE64 = 6_000_000; // about 4.5 MB of JPEG

export async function GET() {
  return Response.json({ enabled: !!process.env.VISION_API_KEY });
}

export async function POST(req: Request) {
  const apiKey = process.env.VISION_API_KEY;
  if (!apiKey) return Response.json({ error: "Live mode is off in this demo." }, { status: 503 });

  let image: unknown;
  try {
    ({ image } = await req.json());
  } catch {
    return Response.json({ error: "Send JSON with an image field." }, { status: 400 });
  }
  if (typeof image !== "string" || !image.startsWith("data:image/jpeg;base64,")) {
    return Response.json({ error: "Expected a JPEG data URL." }, { status: 400 });
  }
  const data = image.slice("data:image/jpeg;base64,".length);
  if (data.length > MAX_BASE64) return Response.json({ error: "That photo is too large." }, { status: 413 });

  const client = new Anthropic({ apiKey });
  try {
    const response = await client.messages.parse({
      model: "claude-opus-5-5",
      max_tokens: 16000,
      output_config: { effort: "low", format: zodOutputFormat(ScanSchema) },
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: "image/jpeg", data } },
            { type: "text", text: "Check this photo before it gets posted." },
          ],
        },
      ],
    });
    if (response.stop_reason === "refusal" || !response.parsed_output) {
      return Response.json({ error: "SafePost couldn't check this photo. Try another one." }, { status: 422 });
    }
    const out = response.parsed_output;
    const clamp = (v: number) => Math.min(1, Math.max(0, v));
    return Response.json({
      ...out,
      exposureScore: Math.round(Math.min(100, Math.max(0, out.exposureScore))),
      detections: out.detections.map((d) => ({
        ...d,
        box: { x: clamp(d.box.x), y: clamp(d.box.y), w: clamp(d.box.w), h: clamp(d.box.h) },
      })),
    });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return Response.json({ error: "Live mode is busy. Try again in a minute." }, { status: 429 });
    }
    if (error instanceof Anthropic.APIError) {
      console.error("scan failed", error.status, error.message);
      return Response.json({ error: "Live mode is off in this demo." }, { status: 502 });
    }
    throw error;
  }
}
