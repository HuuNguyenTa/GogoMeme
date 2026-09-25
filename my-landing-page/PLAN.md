# Mobile-first presentation redesign — implementation plan

Summary: Recompose the existing landing page for phones and tablets with a dedicated responsive layer, mobile-specific Hero/WebGL framing, and an explorable Wish Garden. Preserve all content, routing, Supabase/realtime behavior, Three.js scene ownership, and desktop geometry.

Context:
- `src/App.jsx` is the page composition root. Theme and latest locally submitted wish are already owned here; no routing or backend rewrite is needed.
- `src/styles/landing.css` contains several generations of responsive overrides. At 360px the current page is about 15,289px tall; Choose Animal is about 1,746px, Support about 2,170px, and FAQ about 1,502px. A final, dedicated mobile stylesheet is safer than continuing to append scattered rules.
- `src/styles/hero.css` still models mobile as a scaled 760px absolute-positioned stage. The Three.js canvas is full-screen and `ThreeSanctuaryScene.js` always shifts the diorama right for desktop, which crops the mobile sanctuary.
- Mobile dock targets currently measure 34–40px, below the requested 44px minimum. It also carries one extra About item beyond the desired icon-first priority set.
- `ChooseFriendPreview.jsx` already owns choose/write modes and Supabase submission correctly. Its mobile image remains 390–480px tall and the selector collapses to a long one-column list.
- `RescueStationPreview.jsx` already preserves wish identity by `wish.id`, appends realtime wishes, selects one resident, pauses off-screen motion, and avoids React renders per animation frame. Missing pieces are a larger pannable mobile world, mobile placement, tap-away close, local-wish highlight duration, and find-my-resident.
- `gardenResidentModel.js` is the authoritative deterministic resident factory. It currently produces one desktop-oriented placement profile.
- Browser baseline at 360px and 390px confirms no page-level horizontal scroll, but reports undersized dock/filter/scenario/support controls and only the dog visible. Supabase is unavailable in the sandbox, so Garden population QA must use deterministic fixture data without changing production data flow.
- Assumption: native touch panning inside the Garden is preferable to a custom gesture engine; mouse drag support will be added only if it remains small and accessible.

System Impact:
- Content, Supabase rows, realtime subscriptions, routes, scenario data, and `wish.id` identity remain unchanged.
- `newWish` in `App.jsx` remains the source of truth for the latest local submission. The Garden derives an 8-second local highlight and a session-only find helper from that value; neither is persisted or written back to Supabase.
- Each resident keeps one identity and one DOM node. Breakpoint changes may re-seed its position for the active layout profile, but never duplicate, replace, or drop the resident.
- Mobile Garden viewport state adds only `latestLocalWishId`/helper visibility and active layout mode. Movement coordinates stay in refs/mutable resident models to avoid render-per-frame work.
- Hero keeps one renderer and one scene. Responsive camera/root framing updates in place on resize; desktop camera, scale, and placement remain the default branch.
- Responsive rules use three readable boundaries: `<=1024px`, `<=768px`, and `<=480px`. Product-level mobile changes do not leak above 1024px.

Approach:
- Add `src/styles/mobile.css`, imported after existing theme styles, as the single final responsive presentation layer. Use existing palette/type/radii and explicit component selectors rather than `!important`-heavy fixes.
- Keep desktop markup where it is already semantically sound. Add small mobile-only labels/controls only where CSS alone cannot communicate the interaction.
- Reframe mobile around alternating focal moments: sanctuary → mission image/message → educational rows → selected animal → Garden world → rescue practice → support list → quiet FAQ/action.
- Keep motion restrained: transform/opacity only, short interaction feedback, no mobile parallax, off-screen pause, and static meaningful states for reduced motion.

Design system:
- Color: retain Sanctuary Coral `#ff7e54`, Warm Paper `#fffdf9`, Cream Shelter `#faf5ee`, Rescue Sage `#52a37b`, Night Ink `#11182d`, and Moon Milk `#f3ebd8`.
- Type: retain Lexend for display/action hierarchy and Nunito for readable body copy. Mobile scale: hero 36–40px, section titles 28–32px, body 15–16px, metadata 12–14px.
- Layout: 16px phone gutters, 48–72px section rhythm, 12–16px card gaps, compact 16–20px card padding. Headings remain left-aligned where scanning matters and centered only for singular emotional moments.
- Signature: the sanctuary and living Garden remain the memorable visual systems; educational/support sections become quieter, compact, and more editorial rather than repeating large rounded cards.
- Uniqueness review: the redesign does not introduce a generic new palette, decorative label system, or uniform card stack. It derives its hierarchy from the shelter journey and preserves the project’s illustrated animals as the focal language.

Mobile composition:
```
[ 44px icon dock: Home Choose Garden Guide Support Theme Start ]

Headline
Short description
[ Primary CTA ]
[ Quiet secondary action ]

[ one existing 3D sanctuary, fully framed ]
```

```
Garden heading + compact filters      [Find my resident]
┌──────── contained 520–620px viewport ────────┐
│     larger 1.5–2× world; touch pan           │
│  all residents, labels hidden until selected │
│ [one selected-resident card at the bottom]   │
└───────────────────────────────────────────────┘
```

Changes:
- `src/App.jsx` — import the dedicated mobile stylesheet last; keep state and section order unchanged.
- `src/styles/mobile.css` — define the three responsive tiers, global spacing/type rhythm, 44px targets, section-specific mobile composition, overflow containment, night reductions, and reduced-motion overrides.
- `src/components/hero/HeroSection.jsx` — mark the lower-priority About nav item for mobile hiding and provide explicit labels/tooltips for the icon-first dock without changing desktop labels.
- `src/components/hero/ThreeSanctuaryScene.js` — add resize-aware mobile camera/root scale and vertical framing so the house, island, dog, and cat occupy the lower Hero visual zone; retain the exact desktop branch.
- `src/styles/hero.css` — leave desktop rules intact and let the new mobile layer replace the scaled absolute-stage composition with content-first Hero geometry.
- `src/components/pixel-pets/PixelPet.jsx` and `pixel-pets.css` — keep both companions at 36–44px on phones, dog left/cat right, use idle pose changes only, respect safe areas, and place them below interactive UI.
- `src/components/sections/ComparisonSection.jsx` — add mobile-only “Tình huống / Tránh / Nên làm” labels so each existing row becomes a self-contained comparison card without horizontal scrolling.
- `src/components/sections/ChooseFriendPreview.jsx` — preserve choose/write logic; use compact 4:3 media, a two-column selector, one-column form, full-width primary actions, and local error placement.
- `src/components/garden/gardenResidentModel.js` — expose deterministic desktop/mobile placement profiles based on `wish.id` and index while preserving identity and append-only deduplication.
- `src/components/sections/RescueStationPreview.jsx` — add responsive world sizing, native pan initialization, tap-empty close, one mobile detail card, 8-second local ring/sparkle/“Lời chúc của bạn” signal, and “Tìm bé của bạn” centering behavior. Keep all residents and filters.
- `src/components/motion/LandingMotionController.jsx` — disable mobile parallax and reduce reveal distance/density while retaining section visibility and off-screen pausing.
- `src/styles/night-theme.css` — only if needed, scope mobile night contrast/firefly count so particles appear in Hero and Garden rather than every section.
- Existing section JSX (`AboutSection`, `ProtectionLayersSection`, `LearnToHelpSection`, `FindSupportSection`, `ProjectJourneySection`, `FaqSection`, `FinalCtaSection`, `Footer`) remains structurally stable unless a small accessibility label is required; their mobile presentation is handled in `mobile.css`.
- `scripts/audit-mobile-layout.mjs` — finish the reusable CDP audit for 360/375/390/412/430/768 and desktop, including overflow, touch targets, section screenshots, both themes, reduced motion, pet positions, and deterministic Garden fixture checks.

Verification:
- Run `npm.cmd run lint`, `npm.cmd run build`, and `git diff --check`.
- Capture the desktop baseline before product edits, then compare 1440px Day/Night after implementation for Hero, dock, section spacing, card sizing, Garden, and typography regressions.
- Browser-test 360, 375, 390, 412, 430, and 768 widths from top to bottom and bottom to top; inspect 360/390 Day/Night section screenshots rather than relying only on a compressed full-page image.
- Assert `document.documentElement.scrollWidth === clientWidth` at 360 and 390; separately allow overflow only inside the Garden world/intentional selector scrollers.
- Assert visible interactive targets are at least 44px, both fixed pets are present and pointer-inert, the dock stays usable, CTA/form/FAQ/modal controls remain unobstructed, and reduced motion disables parallax/looping pet movement.
- Exercise Choose Animal selection, write-mode routing, validation/error display, and successful submission flow with a mocked successful Supabase response in browser QA.
- Exercise Garden with deterministic fixture wishes: all unique IDs render, filters do not delete data, tap shows exactly one card, tap-empty closes it, world pans, movement stays bounded, realtime insert appends, local insert remains highlighted for about 8 seconds, and find-my-resident centers/selects the latest local ID.
- Exercise every scenario answer/confirm/next/retry path, rescue phone/external links, FAQ accordions, theme persistence, and final CTA navigation.
