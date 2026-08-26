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

1. **Wave 5 Light.** The default surface is the cool technical page `#f4f7fa`, with white panels, recessed wells and a restrained blue accent. Cream and Dark will translate the same semantic tokens later. Never pure `#000000`.
2. **Numbers in mono.** Every numeric value uses Fragment Mono with `font-variant-numeric: tabular-nums`. Weight, price, depth, percentages, all tabular.
3. **Controlled depth.** Panels use a 14px radius, hairline border and the restrained Wave 5 surface shadow. Floating elements may use the raised shadow.

**Committed direction:** Wave 5 Light (technical, restrained blue accent, generous air).

**Accent remains a semantic axis** through `--accent`, `--accent-muted` and
`--accent-wash`; future themes must translate these tokens without adding
Light-specific DOM.

**Hard rules (see README “Editorial & UI Rules”):** no em-dash/en-dash in prose (hyphen only); no section-index labels (`01 / 03`, `Phase 01`); no version labels on marketing; no decorative status dots; no glows, gradient text, or pure black.

**Type stack:** Schibsted Grotesk for display, UI and body, separated by weight
and tracking. Fragment Mono carries every numeric value.
**Accent:** Wave 5 blue `#2f64a9`, used sparingly for focus, active controls
and key data.
**Avoid:** emoji, exclamation marks, gradients, blue-purple SaaS palettes,
and decorative noise.

## Files

- `colors_and_type.css` — full token system. Always import this in HTML artifacts.
- `assets/` — logo mark, wordmark, favicon, wheel schematic.
- `preview/` — single-concept reference cards (one per spec).
- `ui_kits/landing/` — marketing landing recreation (Notebook direction) with a base-palette Tweak.
- `ui_kits/comparator/` — the wheel comparator surface.
- `ui_kits/wheel-detail/` — single-wheel spec sheet.
- `frontend/` — imported source from the live codebase (`github.com/FlavienDrouot/MyBikeLabLP`).
