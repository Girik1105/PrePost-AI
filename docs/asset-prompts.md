<!-- created by kinjal -->
# Asset prompts

Every decorative image in `/public/assets/` was generated with GPT image generation inside the Aside browser (`imagegen.generate` in the Aside REPL), then cleaned with `scripts/cutout.py` (flood-fill background removal, 2x size, WebP).

To regenerate one: run the prompt in Aside, save the PNG, then
`python3 scripts/cutout.py in.png public/assets/<name>.webp --width 640`
(`--keep-bg` for the sky, `--key 18234a` for the clouds, which were drawn on navy so their white survives).

## Shared style strings

**STYLE (mascot poses, always passed with the reference image `brownie-wave` / the character sheet):**
> Style: soft hand-drawn pencil sketch lines with gentle watercolor fills, warm cozy picture-book illustration. Keep the character EXACTLY like the reference image: same chunky square chocolate brownie body with chocolate chips, same pink frosting swirl with colorful sprinkles, same small dot eyes, rosy cheeks, tiny stubby arms and legs, same proportions and colors. Isolated character centered, on a plain solid pure white background (#FFFFFF), no checkerboard, no shadow on the ground, no text, no letters.

**ART (scenes):**
> Style: soft hand-drawn pencil sketch lines with gentle watercolor fills, warm cozy picture-book illustration. Palette: warm navy, coral and peach, muted lavender, sage green, on warm off-white paper tones. No text, no letters, no logos.

**SPOT (spot illustrations) = prompt + :**
> Small square spot illustration, single centered vignette with soft fading edges, plain solid pure white background (#FFFFFF), lots of empty white space around it. + ART

## Character sheet (reference, no input image)
> A cute chunky chocolate brownie square mascot with a pink frosting swirl and sprinkles on top, small dot eyes, rosy cheeks, tiny stubby arms and legs, friendly smile, waving hello. Style: soft hand-drawn pencil sketch lines with gentle watercolor fills, warm cozy picture-book feel, transparent background, no text.

## Mascot poses (reference image + STYLE)
| File | Prompt (+ STYLE) |
|---|---|
| brownie-wave | The brownie mascot from the reference, waving hello cheerfully with one hand raised. |
| brownie-camera | ...happily holding a small cute vintage camera up with both tiny hands, about to take a picture. |
| brownie-shield | ...proudly holding a small rounded sage-green shield in front of its body with both tiny hands, protective and friendly. The shield is plain with no symbols or letters. |
| brownie-magnify | ...curiously looking through a big round magnifying glass held in one hand, one eye looks bigger through the lens, detective vibe. |
| brownie-thinking | ...thoughtful pose with one tiny hand on its chin, looking up gently, with a small soft lavender thought bubble made of three little circles floating above its head. The thought bubble is empty. |
| brownie-cloud | ...sitting happily on top of a fluffy soft white-and-peach watercolor cloud, legs dangling over the edge, smiling. |
| brownie-thumbsup | ...giving a cheerful thumbs up with one tiny hand, winking happily, with two tiny sparkle doodles next to it. |
| brownie-sleepy | ...napping peacefully curled up on a fluffy soft lavender-tinted watercolor cloud, eyes closed as small curved lines, tiny sleepy smile. |
| brownie-peek | ...peeking over a straight horizontal edge: only the top half of the brownie is visible, with its two tiny hands gripping the edge, curious happy look. |

## Hero
| File | Prompt |
|---|---|
| hero-sky | A wide panoramic landscape-format dreamy sky at golden hour: soft pastel peach, coral and lavender gradient sky, fluffy watercolor clouds scattered around the edges and bottom, gentle warm light, lots of calm open space in the upper-left area for headline text. No characters, no people, no buildings. + ART |
| hero-people | A wide landscape-format row of loose, friendly pencil line sketches with light watercolor washes, on a plain pure white background: a parent crouching to photograph their small fully-clothed child on a playground slide; a young woman taking a selfie with her phone; a teenager holding up a phone to take a picture; two grandparents snapping a photo at a birthday table with balloons. Faces kept very simple. + ART |
| cloud-a | A single fluffy soft watercolor cloud, warm white with peach and lavender shading on the underside, gentle pencil outline, isolated and centered on a plain solid dark navy blue background (#1F2A4D). |
| cloud-b | A long low wide stretched fluffy watercolor cloud bank, warm white with soft coral and lavender shading underneath, on a plain solid dark navy blue background (#1F2A4D). |

## Spot illustrations (+ SPOT)
| File | Prompt |
|---|---|
| problem-consent | A small childhood snapshot photo print (a fully clothed child waving at a playground, drawn very simply) floating up and away into a soft cloud made of many tiny smartphones. |
| problem-details | A big round magnifying glass hovering over a tiny cozy house, the lens enlarging the small house number plaque by the door (blank shapes, no digits). |
| problem-ink | A smartphone lying flat with a big round rubber ink stamp mark pressed onto its screen, a plain circle with a check mark shape, navy ink splatter droplets around it. |
| step-access | A friendly hand holding a smartphone showing a grid of little photo thumbnails, with a small golden key floating next to it. |
| step-scan | A smartphone with a soft glowing sage-green scanning line sweeping over a little photo on its screen, tiny sparkles around. |
| step-fix | A little photo print where a small sign is softly blurred with a frosted watercolor patch, a location pin being crossed out, a pencil and eraser beside it. |
| step-ready | A small photo album folder with a sage-green shield badge on it, photo prints peeking out, a small heart and sparkles above. |
| persona-mom | A warm loving mother kneeling and gently hugging her fully clothed young daughter in a sunny park, holding a phone at her side. |
| persona-walk | A young woman walking home in the evening along a quiet tree-lined sidewalk under a warm street lamp, holding her phone, calm and confident. |
| persona-teen | A cheerful teenage girl in a hoodie holding up her phone to take a selfie, making a peace sign, small sparkle doodles around. |

## Decorative bits and icon
| File | Prompt |
|---|---|
| ink-drop | A single glossy watercolor ink drop shape in deep warm navy blue, with a tiny highlight and a small soft splash ring beneath it, on pure white. |
| sparkles | Three small hand-drawn sparkle doodles (four-pointed stars) in warm coral, golden yellow and lavender, on pure white. |
| app-icon | A rounded-square tile filled with a soft warm coral-to-peach watercolor wash, a cream rounded shield with a small navy ink drop inside, the brownie mascot peeking from behind the shield. (reference image + STYLE) |

The headline has no underline; the ink idea comes through the copy and the ink-drop art.

## Delivery

All shipped images are pre-sized to about twice their largest on-screen width and saved as WebP (quality 80), and `next.config.mjs` sets `images.unoptimized`, so the CDN serves them directly with no on-demand resizing. If you add or regenerate an image, resize it the same way before committing.
