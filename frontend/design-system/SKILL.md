---
name: mybikelab-design
description: Use this skill to generate well-branded interfaces and assets for MyBikeLab, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick orientation

MyBikeLab is a structured-data comparison platform for road cyclists — starts with road wheels, grows toward a full bike configurator. The brand voice is **neutral, technical, slightly nerdy** (Wirecutter / DPReview), not energy-drink hype.

**Three principles** that distinguish MyBikeLab from generic-SaaS:

1. **Paper, not white.** The default surface is `Paper` (warm `#f6f4ef`); `Mist` cool grey and `Porcelain` near-white also ship. Switch via body class `pal-*`. Never `#ffffff` raw, never pure `#000000`.
2. **Numbers in mono.** Every numeric value uses JetBrains Mono with `font-variant-numeric: tabular-nums`. Weight, price, depth, percentages, all tabular.
3. **Hairlines, not shadows.** Cards are square (`radius: 0`), bordered with `1px solid ink-4`, never drop-shadowed.

**Committed direction:** Notebook (editorial, premium-minimal, brass accents, generous air).

**Accent is a swappable axis** (`acc-*`): Brass (default), Cobalt, Oxblood, Forest. Each overrides the `--brass-*` ramp, so brass usages reskin automatically. Canonical default is **Paper + Brass**; documented alternate pairings are **Mist + Cobalt** and **Porcelain + Forest**.

**Hard rules (see README “Editorial & UI Rules”):** no em-dash/en-dash in prose (hyphen only); no section-index labels (`01 / 03`, `Phase 01`); no version labels on marketing; no decorative status dots; no glows, gradient text, or pure black.

**Type stack:** Inter (kept from the codebase) for display + UI + body, separated by weight & tracking. JetBrains Mono carries every numeric value.
**Accent:** Brass `#c9a86a` by default; swappable via `acc-*` (Cobalt, Oxblood, Forest). Used sparingly for the primary CTA, focus, and key data.
**Avoid:** emoji, exclamation marks, gradients, blue-purple SaaS palettes, rounded-corner-with-colored-left-border cards.

## Files

- `colors_and_type.css` — full token system. Always import this in HTML artifacts.
- `assets/` — logo mark, wordmark, favicon, wheel schematic.
- `preview/` — single-concept reference cards (one per spec).
- `ui_kits/landing/` — marketing landing recreation (Notebook direction) with a base-palette Tweak.
- `ui_kits/comparator/` — the wheel comparator surface.
- `ui_kits/wheel-detail/` — single-wheel spec sheet.
- `frontend/` — imported source from the live codebase (`github.com/FlavienDrouot/MyBikeLabLP`).
