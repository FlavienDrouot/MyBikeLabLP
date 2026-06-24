# Needs Assessment

## 1. General Information

- Evolution ID: EVO-043
- Title: Design system migration — WheelDetailPanel
- Author: Flavien Drouot
- Date: 2026-06-03
- Status: Draft
- Priority: Normal

---

## 2. Context

### Current situation

The WheelDetailPanel is an inline drawer that expands below the selected row in the comparator table. Its content consists of two columns:
- Left: `WheelImageCarousel` (photo carousel showing actual product images)
- Right: a price ledger split into Manufacturer and Retailers sections, with ranked link rows, prices, and CTAs

The component uses raw Tailwind utility classes and does not apply design system token classes consistently:
- Container: `bg-paper-2/60 border-t border-t-ink-3 border-b border-b-ink-4` (not a proper DS card)
- Section headers (`GroupHeader`): `text-base font-semibold text-ink-11` (not `.t-eyebrow`)
- Prices: `font-mono tabular-nums` inline utilities (not `.t-numeric`)
- Illustration: product photography via carousel (design system bans photography in the MVP)

The drawer open/close mechanism and the close/dismiss button live in `MiniComparator.jsx` and have not been migrated to DS animation tokens or button styles.

### Identified problem

The WheelDetailPanel is visually inconsistent with the design system surfaces introduced in EVO-039 through EVO-042. Its container, typography, and illustration deviate from established DS rules, breaking the lab-instrument aesthetic.

### Business motivation

Visual consistency across all product surfaces is necessary before the product is presented to potential brand partners. The WheelDetailPanel is the deepest user interaction in the comparator — it is the moment when a user considers a purchase. It must carry the same precision-instrument credibility as the rest of the product.

---

## 3. Business Objective

Bring the WheelDetailPanel into full design system compliance so that it reads as a cohesive part of the MyBikeLab product rather than a legacy MVP panel.

---

## 4. Scope

### Included

- `frontend/src/components/MiniComparator/WheelDetailPanel.jsx` — full DS pass:
  - Container: replace `bg-paper-2/60` band with a hairline card (`paper-0` fill, `1px solid ink-10` border)
  - Illustration: composit the wheel carousel photos inside the SVG schematic circle — the schematic acts as a frame/overlay rendered over the carousel; no photography outside the schematic bounds
  - Section headers: migrate `GroupHeader` to `.t-eyebrow` token (uppercase, mono, `ink-7`, `0.06em` tracking)
  - Prices and numeric values: migrate to `.t-numeric` token class (JetBrains Mono, tabular-nums)
  - Remove any remaining legacy `brand-*` blue classes
- `frontend/src/components/MiniComparator/MiniComparator.jsx` — close/dismiss button and panel animation:
  - Close button: `ink-11` color, `brass-8` focus ring, `radius-xs`, no colored status dots
  - Panel open/close animation: `--duration-base` (220ms) and `--ease-standard`

### Excluded

- Drawer layout, open/close behavior, and trigger logic — stays as-is
- Adding new content sections (spec values, comparable wheels strip, retailer ranking) — not in scope
- `WheelImageCarousel.jsx` internal implementation — only its integration point changes (composited inside the schematic)
- i18n key additions — no new keys; existing FR/EN keys must continue to work

---

## 5. Constraints

### Business constraints

- The panel must remain fully functional with or without affiliate links data (empty states must still render correctly)
- FR/EN i18n must pass without regression

### Known technical constraints

- EVO-039 (foundation tokens) is a prerequisite and is complete
- EVO-042 (MiniComparator DS migration) is recommended for visual consistency — its status should be confirmed before shipping EVO-043
- The SVG schematic + carousel composite must degrade gracefully when no wheel images are available (schematic renders alone)

### Regulatory / security constraints

- None

---

## 6. Use Cases

### Nominal case

As a user browsing the comparator,
I want to expand the detail panel for a wheel that has both images and affiliate links,
So that I can see the wheel illustrated in its schematic frame and find the best price across sources.

### Alternative cases

- Wheel has images but no affiliate links: schematic + carousel render; price ledger shows empty-state text
- Wheel has affiliate links but no images: schematic renders alone (no carousel inside); price ledger renders normally
- Wheel has neither images nor affiliate links: schematic renders alone; panel shows `wheelDetail.noLinks` text

### Known error cases

- None beyond existing empty-state handling already in the component

---

## 7. Acceptance Criteria

- [ ] Panel container uses `paper-0` fill and `1px solid ink-10` border — no `bg-paper-2/60` band
- [ ] Wheel carousel photos are composited inside the SVG schematic circle; schematic line art overlays the carousel
- [ ] When no wheel images are available, the SVG schematic renders alone without error
- [ ] Section headers ("Manufacturer", "Retailers") use the `.t-eyebrow` token (uppercase, mono, `ink-7`)
- [ ] All price values use the `.t-numeric` token class (JetBrains Mono, tabular-nums)
- [ ] No legacy `brand-*` blue classes remain in the component
- [ ] Close/dismiss button: `ink-11` color, `2px solid brass-8` focus ring at `2px` offset, `radius-xs`, no colored status dots
- [ ] Panel open/close animation uses `--duration-base` (220ms) and `--ease-standard`
- [ ] FR and EN language switching produces no visual or functional regression
- [ ] All existing empty-state cases (no links, no manufacturer, no retailers) still render correctly

---

## 8. Open Questions

- None — all ambiguities resolved during needs assessment interview.

---

## 9. Assumptions

- The SVG schematic used is the inline procedural version (matching `design-system/wheel-detail-panel-redesign/panels.jsx` `WheelSchematic`) rather than the static `assets/wheel-schematic.svg`, since the composite with the carousel requires a DOM element as a clip/frame container.
- EVO-042 (MiniComparator) is considered complete enough that its DS tokens and class names are stable references for EVO-043.
- The `panelWidth` prop driving the `isMobile` breakpoint remains unchanged.
