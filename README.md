<!-- created by kinjal -->
# SafePost

**Everything posted online is ink.** SafePost checks photos before they go online. It finds what they give away, blurs it, and explains why.

This is a website: a landing page with a clickable iPhone prototype built in. The "app" is made of HTML/CSS/React screens drawn inside a phone frame on the page. It is not a real iOS app.

Hacks for Humanity 2026 · Team #7, Brownies in the Sky.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (deploys to Vercel with zero config)
```

## Presenting

Scroll to **Try it** (or click "Watch the demo") and press **Play the 2-minute demo**. It runs 8 steps on its own, with captions next to the phone.

| Key | Action |
|---|---|
| `→` or `Space` | next step |
| `←` | previous step |
| `P` | play / pause |
| `R` | restart |

The keys only work while the demo section is on screen. Tapping the phone pauses the demo so you can explore, and **Exit demo and explore** resets it. In free-explore mode a soft pulsing ring marks the next tap.

## Where things live

- `lib/brand.ts`: product name, tagline and principle colors. **Rename the product here** (alternatives: PostGuard, Before You Post, Ask First).
- `lib/scenes.ts`: the six scan scenes: detections, boxes, verdicts, scores, "Why this matters" copy.
- `lib/editCommands.ts`: talk-to-edit keyword parser and suggestion chips.
- `components/prototype/`: phone frame, state machine and demo script (`PrototypeController.tsx`), screens, SVG scenes, iOS UI kit.
- `components/landing/`: the 14 landing sections.
- `app/globals.css`: color tokens for light and dark mode.
- `public/assets/`: mascot and illustrations generated with GPT image generation in Aside. Prompts are in `docs/asset-prompts.md`, and `scripts/cutout.py` removes backgrounds.
- `docs/ui-references.md`: iOS patterns studied on Mobbin.

## Content rules

- Every photo in the prototype is a code-drawn SVG. Each sensitive object is its own layer, so blur and remove work on exactly that object.
- No real photos of children. The private-moment example is only a blurred placeholder card.
- Brands are invented (Mesa Bank, Snapline, Lincoln Oaks Elementary).
- Any statistic must be checked before demo day. Search the code for `TODO: verify source`.

## Optional live mode

Put an Anthropic API key in `.env.local` as `VISION_API_KEY=...` (and add it to the Vercel project settings for production). The **Check a photo** page at `/check` (`components/check/PhotoChecker.tsx`, linked from the hero and nav) then scans uploads automatically. The browser redraws the photo on a canvas, which strips EXIF, and `app/api/scan/route.ts` sends it to Claude (`claude-opus-5-5`) for structured detections. `lib/redact.ts` blurs, pixelates or erases each finding in the pixels, and **Save safe version** downloads the clean JPEG. **Erase** runs LaMa, an open object-removal model, in the viewer's browser with ONNX Runtime Web (`lib/lama.worker.ts`). The photo never leaves the device; the 208 MB model downloads once from Hugging Face and is cached. If it can't load, erase falls back to built-in texture synthesis (`lib/inpaint.ts`). Without the key, the same page still works: people draw boxes over what they want hidden. The scripted prototype never depends on it.
