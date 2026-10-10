<!-- created by kinjal -->
# Mobbin iOS research: 7 flow types

**Access note:** You weren't logged in to Mobbin, and there was no saved Mobbin login, so I didn't sign in. I also didn't create an account with your Google login without asking. Logged out, Mobbin hides app pages, search and full flow sequences behind a signup prompt. The public "Explore" category pages and single-screen pages still work, and that's where everything below comes from. Every finding is a real iOS screen I looked at. One exception is Google Lens, which Mobbin only had as an Android screen. I didn't save or download any screenshots, and I deleted the temporary preview images I viewed them with.

---

## 1. Photo / gallery apps

**KakaoTalk, image gallery (photo grid)**
- 3-column square grid with about 2pt gutters and no rounded corners. Photos go edge to edge so they're the focus.
- Simple nav bar: title centered, a plain "Close" text button on the right, no toolbar.

**Airbnb, photo selection (multi-select grid)**
- 3-column grid. Selected photos get a small dark checkmark badge in the bottom-right corner, not a full-tile overlay, so the photo stays readable.
- Title shows the live count ("5 photos selected"). Camera shortcut sits top-right.
- Sticky bottom bar pairs the rule ("Choose at least 5 photos") on the left with a dark pill "Upload" button on the right.

**AllTrails and Google Maps, photo galleries**
- AllTrails puts tabs (Feed / Photos / Reviews / Activities) above a tight 3-column grid with an underline on the active tab.
- Google Maps adds a row of large rounded category tiles (All / Menu / Food & drink) above a 2-column grid, with an outlined "Add photos" pill on the right side of the section header.

**Halide, photo detail**
- Full-bleed image with a bottom sheet (grab handle) holding format chips (HEIC / JPEG / DEPTH), a timestamp and location right-aligned, and a row of camera stats (1/30, ISO 50, 77mm) split by thin dividers.
- Action row of three icons (like / share / delete) with delete on the far right. A clean model for a detail screen where the metadata matters.

**Kakao T and Orb Social, full-screen viewer**
- Black background, close "X" top-left, page counter pill ("1 / 2") at the bottom center (Kakao).
- Orb uses dots for pages, with author, caption and reactions grouped at the bottom left and round share / more buttons at the bottom right.

**Lensa AI, edit screen with before/after**
- Dark editor. Undo / reset / redo sit in the top center and a small yellow "Save" pill sits top-right, the only color on screen.
- A compare icon in the corner of the image is the before/after control (press to see the original). Nothing else covers the photo.
- Sliders are listed with the label left and the value right ("Face retouch ... 1"). The bottom tab bar holds tool groups (Crop / Filters / Skin / Shape / Look).

**Picsart, editor and effects**
- Tool tray at the bottom with icon plus tiny label (Tools / Effects / Retouch / Remove BG / Sticker).
- Effects use thumbnail previews of your own photo above text category tabs (SIMPLE / FX / B&W / BLUR). The active tab is colored and "NEW" badges sit on the thumbnails. "Cancel" is top-left and "Apply" top-right.

**Dropbox, image adjust (version toggle)**
- A segmented control "B&W / Whiteboard / Original" switches between versions of the same image, with a single "Contrast" slider below. This works well as a before/after toggle: one tap to see the original.

---

## 2. Privacy / security / safety apps

**1Password, Watchtower (risk score)**
- Big semicircle gauge that runs from green to blue, with a huge number ("961") and a plain-word rating ("VERY GOOD") underneath.
- Secondary "Share My Score" pill, then a short explanation ("Your score gives an overall idea of how safe your data is. Take action on the flagged items...").
- Below that, white cards with a light shadow: "Overall Password Strength" with a green progress bar and a chevron, then a card with a large count ("1") for flagged items. The pattern is score first, then why, then what to fix.

**Citizen, protection score and setup checklist**
- Ring gauge with a large number ("33") and the label "MY PROTECTION CIRCLE", on a dark navy background.
- "To-Do ... 1 / 3 completed" counter under the ring. Each checklist card has a circle checkbox, a bold title, one line on why it matters ("essential for Citizen to provide appropriate safety services during emergencies") and a full-width "+ Add Name" button inside the card.
- Strong model for "improve your safety score" progress.

**Citizen, alerts list and alert creation**
- Alerts list: a blue dot marks unread, bold headline, gray detail with distance ("0.4 Miles away from Home"), timestamp, and small "helpful / not helpful" feedback controls. The background is dark and calm, not red.
- Alert creation: category chips with icons (Police, Fire, EMS, Collision, Missing Pet). One big red circular "Start Alert" button is the only red on screen, saved for the one critical action.

**Greenlight, safety permission setup**
- "Step 1/3" pill at the top, a short intro line, then a soft gray card with an illustration, the title "Allow motion sensors", a plain explanation of why (crash detection), and a dark teal full-width "Set up permissions" button.
- Legal text sits under the card next to a small lock icon, which feels trustworthy without being alarming.

**stoic., "Shield" intro**
- Friendly line illustration in the top third, a large bold headline ("Make your phone work for you, not against you."), a short body, and a black pill "Next" button centered low on the screen. The protection idea is framed positively, not with fear.

**Zoom, security settings**
- Standard iOS grouped list with an all-caps "SECURITY" header and plain toggle rows. A small "Allow Participants to:" sub-header groups related toggles.
- The destructive action ("Suspend Participant Activities") is centered red text in its own group at the bottom.

**How warnings are shown (Bird, Honest Greens, Turo)**
- Bird: a full-width red strip with icon and text ("No parking zone") placed directly above a plain-language fix.
- Honest Greens: a small green chip ("Near · ...m") plus a big bold bottom-sheet headline ("COME A LITTLE CLOSER.") asking "Sure you want to order here?", with the next action in a black pill.
- Turo: a white label centered over the camera frame ("Document Not Detected") for scan failures.

---

## 3. Onboarding with photo-access prompts

**Craft, photo library permission (pre-prompt card)**
- Floating white card over a dimmed screen. A small all-caps "PERMISSION REQUEST" label sits above a bold "Need Permissions" title.
- A row with the iOS Photos icon, the title "Photo Library", a reason ("Required to upload photos from library") and a blue "ALLOW" pill on the right.
- Reassurance in small gray text at the bottom: "We handle your data with care. We do not scan or store any information from your device." Directly relevant to a privacy-focused app.

**VSCO, permissions hub**
- One screen listing every permission: Photos, Camera, Notifications, Location, Contacts. Each row has an outline icon, a title, a one-line benefit ("Select from your camera roll to edit on VSCO") and a toggle on the right.
- Header: "Manage your permissions" plus "For the best experience on VSCO, please grant access to:". Thin dividers between rows.

**Hinge, photo upload step**
- Big serif headline ("Pick your videos and photos"), a 3x2 grid of dashed placeholder tiles with "+" badges, and a helper line ("Tap to edit, drag to reorder · 6 required").
- A tip card with a lightbulb ("Not sure which photos to use? See what works") and a round next-arrow button bottom-right.

**Tinder and Turo, pre-permission sheets**
- Tinder: bottom sheet with an icon in a circle, "Let's get you set up", a one-line reason, a gradient "ENABLE PERMISSIONS" pill and a plain "NOT NOW" text link.
- Turo: full sheet with an illustration, "Stay up to date", and a bulleted "If you allow notifications, you'll receive:" list with an icon per benefit. "Later" sits top-right and "Allow notifications" is full-width at the bottom.

**Abode, empty album (warm photo onboarding)**
- Cute blob mascot, the line "Add photos to your album", and a single round coral camera/add button. The empty state looks inviting, not blank.

---

## 4. Notification banners and lock-screen notifications

**BeReal, notification explainer (lock-screen mock)**
- Shows a realistic iOS notification card floating on a blurred wallpaper: app icon, "Now", "Time to BeReal" in bold, and one line of body text.
- Big headline below ("One notification every day"), page dots, and an outlined full-width "Continue" button. Showing the real notification before asking for permission is very effective.

**Apple Fitness, notification explainer**
- A stylized lock screen (large "9:41" plus a frosted notification with gray placeholder lines and the app icon) sits in the top half. The bottom half has a bold headline ("Stay Motivated with Fitness Notifications"), a short benefit and a dark "Continue" button.
- Using placeholder lines instead of real text keeps it generic and clean.

**Bump, in-app banner with action**
- Rounded black banner at the top of the screen with an avatar, "Bump by ...", "Sam sent you lots of hearts", a playful emoji on the right, and an inline full-width blue action button ("Send hearts back to Sam"). Good model for an actionable alert banner.

**Shipt and Headspace, soft opt-in**
- Shipt: bottom sheet with "Enable notifications?", an icon list of categories (Order updates, Promotions and news), and buttons side by side: filled "Yes" and outlined "Not now".
- Headspace: a white modal titled "Make your day more mindful" with honest copy ("we'll do our best not to annoy you") and a full-width blue "TURN ON NOTIFICATIONS" bar attached to the bottom of the card.

**Kahoot, notification inbox**
- "New" section header, then a light-tinted row with a round colored icon, a blue unread dot, the message and a blue relative time ("3 minutes ago").

---

## 5. AI chat / command input over an image

**Google Lens, image-first AI input** (Android capture, but the pattern carries over)
- Rounded camera viewfinder takes about 60% of the screen with a shutter button in the middle. "Search with any image" sits below, with a row of example photos labeled by intent (Shop / Homework / Translate). The examples teach users what to ask.

**Riveo, AI assistant over media**
- Media preview at the top, filter thumbnails along the bottom. The first thumbnail is "AI Assistant" with a sparkle icon, so AI is offered as one option among the edit choices, not a separate mode.

**ChatGPT, message input with an attachment**
- The attachment shows as a small card inside the composer (file icon, name, type, "x" to remove) directly above the typed prompt. "+" sits on the left and a round black send arrow on the right. The composer grows upward over an empty canvas. Use the same layout with a photo thumbnail for "ask about this photo."

**Google Gemini, empty state**
- Large gradient greeting ("Hello, Alex") centered, and a bottom input pill ("Ask Gemini") with mic and camera icons inside it plus a separate round voice button. The camera button is the entry point to image input.

**Instagram (Meta AI) and Perplexity, answers mixed with images**
- Meta AI: a text answer with small source citations, then a horizontal carousel of tall image cards, and thumbs up/down under the answer.
- Perplexity: big title, source chips (Images / Sources), a row of image thumbnails, then structured text, with an "Ask follow up..." pill pinned to the bottom.

**Canva, "Ask Canva" sheet**
- The assistant opens as a sheet over the editor. The bot greeting is a gray bubble with a small logo avatar and the user's message is a lavender bubble. The input reads "How else can I help?" with a mic and a send button, plus a small help-center link underneath.

---

## 6. Settings with grouped lists and toggles

**Opal, notification settings (cards)**
- Each setting is its own rounded dark card: bold title, a two-line gray description, and a toggle top-right. Big padding (about 24pt) makes it feel premium and calm, not like a dense list.

**Monarch, advanced notifications**
- Rows with a title, a gray description explaining when it fires ("3 days before your due date"), and orange toggles that match the brand.
- A small green "Enabled" status with a check sits above an outlined "Continue" button. This is settings used as an onboarding step.

**Tiimo and Eight Sleep, sectioned lists**
- Tiimo: bold section headers (Activities / Routines / Other), compact rows, purple toggles, and "Notification sound ... System" as a value row at the top.
- Eight Sleep: dark mode with small all-caps headers (AUTOPILOT / GENERAL). AI-driven toggles get a sparkle icon in the thumb, which is a neat way to mark smart features.

**Craft, grouped settings with explanations**
- Bold group title plus a gray explanation above each rounded inset group (Comments & Mentions / Reminders / Daily Email). A time picker row ("8:00 AM") appears inside the group only when its toggle is on.

**Linear, minimal**
- Large left-aligned title, only two toggles, and a "System notification settings" row with an outbound-arrow icon that links to iOS Settings.

**VSCO and Zoom** (covered above)
- These are the plain iOS-style references: inset groups, all-caps headers, and destructive actions in red at the bottom.

---

## 7. Warm, friendly consumer apps (family, parenting, wellness)

**Life360, role selection (family)**
- Full-bleed periwinkle background, a centered white question ("How would you describe your role in this Circle?"), and a stack of tinted pill buttons (Mom, Dad, Son / Daughter / Child, Grandparent, Partner / Spouse, Friend, Other). Soft, inclusive family wording.

**GoHenry, kids' tasks (parenting)**
- Big friendly headline with the child's name ("___'s earning £10") and a calm subline ("To be paid on Saturday").
- Empty state: a simple clipboard icon, "Use tasks your way", a short teaching line, and a bright purple full-width "Add a task" pill at the bottom.

**Peanut, setup progress (moms community)**
- Avatar inside a coral progress ring, "Finish setting up your experience", "You have completed 2 of 3 steps", and checklist rows on pale pink with check circles and chevrons. Coral and rose palette with rounded rows.

**Headspace, today list (wellness)**
- "Start your day" / "Your afternoon lift" time-of-day sections. A vertical timeline on the left shows green checks for completed items and an orange dot for the current one.
- Cards pair text with bold orange and yellow illustrations, and social proof ("538 meditating"). Warm orange is the main color.

**Tiimo, plan view (neurodivergent-friendly planner)**
- Serif "Get started" heading, pastel lilac cards with an outline icon, a duration ("2 MIN") and an arrow button. "Start now" chips with a play icon, and a lavender FAB.

**Abode, success screen (family / home)**
- Blob mascots holding hands with a small heart, "You're all set", a reassuring body, and a blue "Get started" pill. The background is a coral-to-white card. Celebration without confetti noise.

---

## Patterns worth borrowing across the board

- **Score, then why, then fix (1Password, Citizen):** big number in a ring, a plain-word rating, one explanation line, then actionable cards with progress ("1 / 3 completed").
- **Save red for the one critical thing:** Citizen's Start Alert and Bird's no-parking strip. Everything else stays calm and neutral.
- **Prime before the iOS prompt:** show a real-looking notification (BeReal, Apple Fitness), give a per-permission reason (VSCO, Craft) and a privacy promise ("we do not scan or store..."), and always offer "Not now" / "Later".
- **Button placement:** one full-width primary button at the bottom, with the secondary option as a text link or outlined button beside or under it. Editors put Cancel top-left and Apply/Save top-right.
- **Before/after:** a compare icon on the image (Lensa) or a segmented "Original" toggle (Dropbox), not split-screen sliders.
- **AI on images:** a photo-thumbnail card inside the composer (ChatGPT pattern) plus intent chips that teach what to ask (Google Lens).
- **Warm tone:** pastel cards (lilac, coral, peach), rounded pills, mascots or soft illustrations, time-of-day section titles, and family-role wording (Life360, Headspace, Tiimo, Abode).


---

## How SafePost uses these patterns

Patterns only. No screenshots are saved here and no app's logo, colors or name appear in the prototype.

- **Photo detail:** score first, then why, then fix (1Password / Citizen). Exposure ring with a plain-word rating, a "Why this matters" card, then finding rows with toggles. Calm palette; brick red is used only for the "Don't post" verdict.
- **Scan grid:** 3-column square grid with 2pt gutters (KakaoTalk / Airbnb). Status badges sit small in the corner so the photo stays readable.
- **Onboarding:** step pill ("Step 2 of 3", Greenlight), a pre-permission card with a per-permission reason and a privacy promise (Craft / VSCO), always a "Not now" link.
- **Lock screen:** a realistic frosted notification on a blurred wallpaper (BeReal / Apple Fitness).
- **Talk-to-edit:** the photo up top and a composer pinned to the bottom with mic + send (ChatGPT / Gemini), with intent chips that teach what to ask (Google Lens).
- **Before / after:** we keep a draggable slider (the brief asks for it) and add a compare toggle as a second control (Lensa / Dropbox).
- **Settings:** inset grouped lists with a one-line gray explanation under each toggle (Craft / Monarch).
- **Tone:** pastel cards, rounded pills, a mascot in empty and success states (Abode / Headspace / Peanut). Success without confetti noise.
- **Buttons:** one full-width primary at the bottom, secondary as a text link beneath.
