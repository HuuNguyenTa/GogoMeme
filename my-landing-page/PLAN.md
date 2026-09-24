# Dreamy Night Garden — implementation plan

Summary: Add a persisted Day/Night theme with one React-owned source of truth, CSS theme tokens for the full landing page, and a live Three.js lighting transition for the hero. Preserve all existing content, layout, wish behavior, and interaction flows.

Context:
- `src/App.jsx` is the top-level composition point and currently has no theme state.
- The only navbar is the floating dock inside `src/components/hero/HeroSection.jsx`; mobile already collapses dock labels, so an icon-only accessible theme control fits without changing navigation structure.
- `src/components/motion/AmbientBackgroundLayer.jsx` already owns section-aware background tone and seven low-cost particles.
- `src/components/hero/ThreeSanctuaryScene.js` owns the hero’s renderer, lights, materials, house window, tree, lawn, and pollen particles, but currently exposes only cleanup.
- `src/styles/landing.css` has global tokens but many legacy hard-coded light surfaces. Night mode therefore needs both token changes and bounded grouped overrides for existing cards/forms/tooltips.
- The rescue scenario scene is already night-lit; the final CTA is already warm-dark. They need visual harmonization, not a second scene architecture.
- No requirements are ambiguous enough to block implementation. Assumption: use saved preference first, system preference only on first visit, and keep explicit user choice stable afterward.

System Impact:
- Before: visual mode is fixed and distributed across CSS/Three.js constants.
- After: `useLandingTheme` is the single source of truth (`day | night`), mirrored to `document.documentElement[data-theme]`, persisted under a versioned localStorage key, and passed only to components that need imperative WebGL updates.
- Theme transitions remain a visual concern: no wish, Supabase, garden-resident identity, navigation, or form state changes.
- Invariant: one theme value controls HTML/CSS, ambient decoration, and the hero scene. Three.js is not remounted on toggle; its existing controller receives a new target theme and interpolates lighting/material values.
- Reduced-motion users get immediate/static theme visuals with no drifting fireflies, parallax, or pulsing glow.

Approach:
- Use semantic CSS tokens plus `[data-theme='night']` overrides rather than duplicating whole components.
- Add a pre-paint theme bootstrap in `index.html` to avoid a bright flash before React mounts.
- Make the hero WebGL initializer return `{ dispose, setTheme }`; `setTheme` updates target colors/intensities and the existing RAF loop eases toward them over roughly 600–800ms.
- Reuse the ambient layer for the moon halo and page-level fireflies, then add only a small garden-local firefly layer where spatial depth materially helps.
- Keep interaction feedback at 150–180ms; reserve the longer 650ms transition for the rare page-wide theme change. Animate only opacity and transforms for looping motion.

Design system:
- Color: Night Ink `#11182D`, Indigo Canopy `#242B50`, Moon Milk `#F3EBD8`, Leaf Shadow `#173E3A`, Firefly Gold `#F6CE78`, Ember Coral `#FF7E54`.
- Type: retain Lexend for display and Nunito for readable body copy; no new labels or decorative copy.
- Layout: preserve all section geometry and alignment. The dock receives one compact icon control; atmospheric elements remain behind content and pointer-inert.
- Signature: cool moonlight + warm shelter windows/fireflies, with glow used as atmosphere rather than as an affordance.

Changes:
- `index.html` — set the stored/system theme before first paint and set a matching initial color-scheme/background.
- `src/hooks/useLandingTheme.js` — own lazy initialization, persistence, DOM synchronization, system fallback, and the toggle callback.
- `src/App.jsx` — initialize the theme once and pass it to the hero/final CTA; keep all existing product state unchanged.
- `src/components/theme/ThemeToggle.jsx` — accessible 44px Sun/Moon dock control with `aria-pressed`, visible focus state, and no extra copy in the navbar.
- `src/components/hero/HeroSection.jsx` — render the toggle and forward theme changes to the existing Three.js scene controller without remounting it.
- `src/components/hero/ThreeSanctuaryScene.js` — add interpolated day/night fog, moon/key/rim/ambient lighting, lawn/foliage/roof color targets, stronger warm window/porch emissive light, and pollen-to-firefly behavior.
- `src/components/motion/AmbientBackgroundLayer.jsx` — add a pointer-inert moon halo and reuse the particle field as sparse night fireflies.
- `src/components/sections/RescueStationPreview.jsx` — add a small decorative firefly layer inside the garden only; resident movement and `wish.id` identity remain untouched.
- `src/components/sections/FinalCtaSection.jsx` and `FinalCtaCompanions3D.jsx` — harmonize CTA rim/ambient light with the active theme while retaining the existing warm focal lighting.
- `src/styles/hero.css` — theme the hero sky, dock, copy surfaces, toggle, moon atmosphere, focus states, and mobile layout.
- `src/styles/landing.css` — define night tokens and grouped overrides for sections, cards, forms, garden, tooltips, scenario panel, CTA/footer, ambient moon/fireflies, responsive behavior, and reduced motion.

Verification:
- Run `npm.cmd run lint`, `npm.cmd run build`, and `git diff --check`.
- Browser QA at desktop and 390px mobile in both Day and Night modes.
- Verify first-load system fallback, localStorage persistence after reload, keyboard activation, focus ring, and correct `aria-pressed`/label changes.
- Verify no horizontal overflow, text/card contrast, readable garden labels/tooltips, visible 3D mascots, warm house windows, and smooth theme interpolation.
- Verify reduced-motion disables drifting/pulsing/reveal motion while preserving the selected visual theme.
- Verify WebGL loops still pause off-screen/when the tab is hidden and that toggle actions do not recreate duplicate renderers or event listeners.
