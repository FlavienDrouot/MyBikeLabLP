# TASK-001 — Fix section background color collisions

## Objective

Remove the two adjacent-section background color collisions on the landing page so that every consecutive section pair has a visually distinct background. No content, layout, or behavior is changed.

## Required context

The landing page renders six sections in this order (defined in `frontend/src/pages/Landing.jsx`):

1. Hero (`<section>` in `Hero.jsx`) — currently no background color class; inherits page default (`--paper-1`)
2. MiniComparator (`<section>` in `MiniComparator/MiniComparator.jsx`) — `bg-paper-2`
3. RoadmapSection (`<section>` in `RoadmapSection.jsx`) — `bg-paper-2`  ← collision with MiniComparator
4. BenefitsGrid (`<section>` in `BenefitsGrid.jsx`) — no background class (inherits `paper-1`)
5. PartnershipSection (`<section>` in `PartnershipSection.jsx`) — `bg-ink-12`
6. Footer (`<footer>` in `Footer.jsx`) — `bg-ink-12`  ← collision with PartnershipSection

Required final background sequence:
1. Hero: `paper-1` (no change — keep no explicit class; page body defaults to `paper-1`)
2. MiniComparator: `paper-2` (no change)
3. RoadmapSection: `paper-1` (change: replace `bg-paper-2` with `bg-paper-1`)
4. BenefitsGrid: `paper-2` (change: add `bg-paper-2`)
5. PartnershipSection: `ink-12` (no change)
6. Footer: `ink-11` (change: replace `bg-ink-12` with `bg-ink-11`)

Token reference (`frontend/src/design-tokens.css`):
- `--paper-1: #f6f4ef` — default page background, warm off-white
- `--paper-2: #efebe2` — recessed panel, slightly darker warm tone
- `--ink-12: #0e0f0c` — near-black (current footer and partnership background)
- `--ink-11: #1a1a17` — primary text dark (one step lighter than ink-12)

The Tailwind config maps these tokens to utility classes as `bg-paper-1`, `bg-paper-2`, `bg-ink-12`, `bg-ink-11`.

## Potentially impacted files

- `frontend/src/components/RoadmapSection.jsx`
- `frontend/src/components/BenefitsGrid.jsx`
- `frontend/src/components/Footer.jsx`

No other files are touched.

## Inputs

- `frontend/src/components/RoadmapSection.jsx` — current `<section>` opening tag: `<section id="roadmap" className="section bg-paper-2">`
- `frontend/src/components/BenefitsGrid.jsx` — current `<section>` opening tag: `<section className="section">`
- `frontend/src/components/Footer.jsx` — current `<footer>` opening tag: `<footer className="bg-ink-12">`

## Expected outputs

- `RoadmapSection.jsx`: `<section id="roadmap" className="section bg-paper-1">`
- `BenefitsGrid.jsx`: `<section className="section bg-paper-2">`
- `Footer.jsx`: `<footer className="bg-ink-11">`

No other lines in these files change.

## Constraints

**UI guidelines (applicable rules):**

- All background colors must use existing design system Tailwind tokens (`bg-paper-*`, `bg-ink-*`, `bg-brass-*`, `bg-sage-*`). No raw hex values, no `style` attributes, no new CSS classes.
- No content, layout, spacing, padding, or text changes in any of the three files.
- Do not change any other className on any element.
- The `.hero-grid-bg` class on the Hero `<section>` applies a CSS background-image grid pattern; it does not set a background color. The Hero has no `bg-*` class and must remain that way — the page body `bg-paper-1` provides its background.

## Dependencies

none

## Validation criteria

- [ ] Open the landing page (`npm run dev`). Scroll from Hero to Footer. Confirm that no two consecutive sections share the same visible background color.
- [ ] Hero/MiniComparator boundary: paper-1 (grid-patterned) → paper-2 (darker warm) — distinct.
- [ ] MiniComparator/RoadmapSection boundary: paper-2 → paper-1 — distinct.
- [ ] RoadmapSection/BenefitsGrid boundary: paper-1 → paper-2 — distinct.
- [ ] BenefitsGrid/PartnershipSection boundary: paper-2 → ink-12 (dark) — distinct.
- [ ] PartnershipSection/Footer boundary: ink-12 → ink-11 — distinct (subtle but different token).
- [ ] No section content, heading, paragraph, icon, card, or interactive element has changed position, size, or copy.
- [ ] The Wheel Comparator filter panel and table remain fully functional.
- [ ] Inspect applied classes in browser DevTools: confirm `bg-paper-1` on RoadmapSection, `bg-paper-2` on BenefitsGrid, `bg-ink-11` on Footer.
- [ ] No raw hex values have been introduced in any class name or style attribute.

## Tests to implement

### Unit
None — purely visual; no logic.

### Integration
None.
