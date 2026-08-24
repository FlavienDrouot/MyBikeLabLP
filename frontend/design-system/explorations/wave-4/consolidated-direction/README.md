# Wave 4 - Consolidated direction

Wave 4 continues the visual exploration already carried by PR #42. It does not
start a separate product or implementation track.

The goal is to make the retained refined-console direction more distinctive
without changing the information architecture or adding product features.

## Public review

GitHub Pages publishes the prototype alongside the current site, at a separate
path so the existing landing at the root URL is not replaced:

**https://flaviendrouot.github.io/MyBikeLabLP/visual-direction/**

The same path is deployed from the PR #42 branch while the direction is being
refined, then remains available after merge from `main`.

You can also open `index.html` directly. The prototype is one continuous landing
page and includes the comparator in place, matching the current product flow.

Use the theme control in the header to review the same DOM and component system
in three visual registers:

- **Light** - primary direction. Cool neutral surfaces, steel blue accent,
  subtle technical linework and slightly richer material depth.
- **Cream** - optional warm register. Same structure and density, with muted
  brass accents and warm paper-like neutrals.
- **Dark** - moderate dark register. Same surface hierarchy and decorative
  language, translated to calm charcoal values rather than near-black.

The selected theme persists through `localStorage` under `mbl-wave4-theme`.

## Comparator decisions carried forward

The comparator remains embedded in the landing and keeps the validated
left-filter-rail + right-results layout.

Wave 4 restores two behaviors that exist in the current product but were not
represented clearly enough in the Wave 3 mockups:

- each filter family has a visible enable/disable toggle;
- Brand is its own compact group with search plus a fixed-height, internally
  scrollable checkbox list, so a large brand catalog does not consume the full
  rail height.

No comparison feature has been added. The controls only demonstrate the
existing interaction model and visual states.

## Decoration rule clarified

The earlier rejection of "free decoration" applied primarily to decorative
text and pseudo-technical labels that could be mistaken for information.

Purely visual decoration is allowed when it is immediately legible as
atmosphere rather than data. Wave 4 therefore introduces restrained wheel/rim
geometry, line textures and surface glow. These elements never contain copy,
counts, codes or fake instrumentation.

## Files

| File | Role |
|---|---|
| `index.html` | Single full landing prototype, comparator included, three-theme switcher |
| `_system.css` | Wave 4 tokens, surfaces, decorative layer and responsive components |
| `INTENT.md` | Visual rationale, accepted constraints and implementation boundary |

The wheel-detail page is intentionally not revisited in Wave 4. Wave 3 remains
the reference for that surface.
