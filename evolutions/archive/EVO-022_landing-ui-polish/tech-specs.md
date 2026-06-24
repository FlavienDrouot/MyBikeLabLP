# Technical Specifications

## 1. General Information

- Evolution ID: EVO-022
- PRD reference: `MyBikeLab/evolutions/EVO-022_landing-ui-polish/prd.md`
- Author: Flavien Drouot
- Date: 2026-05-28

---

## 2. Technical Context

### Technical objective

Apply three isolated visual corrections to the MyBikeLab landing page: fix background color collisions between adjacent sections, add the NoteBook-direction typography treatment to the Hero title word "measured", and replace the placeholder favicon with the MyBikeLab brand icon.

### Affected architecture

- Static JSX components (React, no state, no logic)
- Shared component CSS (`src/index.css`, `@layer components`)
- Public asset (`public/favicon.svg`)

### Impacted modules

- `frontend/src/components/Hero.jsx` — Hero section markup
- `frontend/src/components/RoadmapSection.jsx` — section background class
- `frontend/src/components/BenefitsGrid.jsx` — section background class (currently absent)
- `frontend/src/components/Footer.jsx` — footer background class
- `frontend/src/index.css` — `.hero-title em` CSS rule (new)
- `frontend/public/favicon.svg` — file content replaced with brand icon

---

## 3. Technical Constraints

- All background colors must use existing Tailwind tokens (`bg-paper-*`, `bg-ink-*`, `bg-brass-*`, `bg-sage-*`); no raw hex values in class names.
- Hero title typography must use a CSS rule in `@layer components`, co-located with the existing `.hero-title` rule in `src/index.css`.
- No new files in the project — the favicon is replaced in-place.
- No changes to `design-system/preview/direction-comparison.html` or any design system file.
- No changes to section content, layout, copy, or interactive behavior.
- No automated tests are expected (all changes are purely visual).

---

## 4. Architecture Decisions

### AD-001 — Section backgrounds via Tailwind utility classes
#### Description
Apply background color changes as Tailwind `bg-*` utility classes directly on `<section>` (or `<footer>`) elements, consistent with the existing pattern in the codebase.

#### Motivation
Existing sections already use `bg-paper-2`, `bg-ink-12` etc. as inline Tailwind classes. No abstraction layer exists or is needed. Adding/changing a class is the minimal, readable, auditable change.

#### Rejected alternatives
New CSS classes in `index.css`: unnecessary indirection for a one-attribute change. Inline `style` prop: bypasses the token system.

---

### AD-002 — `<em>` wrapper in JSX + `.hero-title em` rule in `index.css`
#### Description
Wrap "measured." in an `<em>` element in `Hero.jsx`. Add a `.hero-title em` CSS rule inside `@layer components` in `src/index.css`, immediately after the existing `.hero-title` block.

#### Motivation
`letter-spacing: -0.05em` has no exact Tailwind equivalent (closest `tracking-tight` is `-0.025em`). A CSS rule is the cleanest way to express all four required properties without arbitrary value hacks. The `.hero-title` rule is already in `index.css`; placing `.hero-title em` directly below it keeps related styles co-located.

#### Rejected alternatives
Tailwind arbitrary values (`tracking-[-0.05em]`) + utility classes on `<em>`: valid but less readable and inconsistent with the hero's existing CSS-class pattern. Inline `style` prop: bypasses the CSS layer and is harder to override or audit.

---

### AD-003 — Favicon replaced in-place in `public/favicon.svg`
#### Description
The content of `public/favicon.svg` is replaced with the logo-mark SVG shape, with `currentColor` resolved to `#0e0f0c` (the `--ink-12` near-black token) so the icon renders correctly without a CSS context.

#### Motivation
`index.html` already declares `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`. No change to `index.html` is needed. Replacing the file content avoids introducing a new file. The `href="/favicon.svg"` absolute path is browser-standard for favicons and is not affected by Vite's `/MyBikeLabLP/` base path.

#### Rejected alternatives
Adding a second `<link rel="icon">` pointing to `logo-mark.svg` copied to `public/`: creates a new file and a duplicate favicon declaration. Changing `href` to an asset import path: favicons cannot be Vite-imported assets; they must be in `public/`.

---

## 5. Task Breakdown

| Task | File | Summary | Dependencies |
|------|------|---------|--------------|
| TASK-001 | `TASK-001.md` | Fix section background collisions (RoadmapSection, BenefitsGrid, Footer) | none |
| TASK-002 | `TASK-002.md` | Add `<em>` wrapper on "measured." and `.hero-title em` CSS rule | none |
| TASK-003 | `TASK-003.md` | Replace `public/favicon.svg` with the MyBikeLab logo-mark brand icon | none |

All three tasks are independent and can be implemented and merged in any order.

---

## 6. Global Validation Strategy

### Unit validation
None — changes are purely visual with no logic.

### Integration validation
None — no component interactions are modified.

### Functional validation
Manual visual inspection after local `npm run dev`:
- Scroll through all six sections: confirm background color alternation at every boundary.
- Read the Hero heading: confirm "measured." is italic and brass-colored; all other words are dark and bold.
- Check the browser tab: confirm the MyBikeLab logo-mark icon appears.

### Non-regression validation
- Confirm the Wheel Comparator filters and table remain fully functional.
- Confirm no section content, layout, spacing, or interactive behavior has changed.
- Confirm no other heading or text element has been unintentionally restyled.
- Inspect HTML source: confirm no raw hex/rgb values have been introduced in class names or `style` attributes.

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Footer `ink-11` is visually near-identical to `ink-12` | AC-001 may be read as not satisfied if "different background" implies perceptible difference | Open question documented in spec-notes.md — confirm with stakeholder before implementation if needed |
| `public/favicon.svg` replacement breaks a cached favicon in dev | Minor dev inconvenience | Hard-refresh browser (`Ctrl+Shift+R`) during testing |
| SVG favicon `#0e0f0c` near-black is invisible in dark-mode browser chrome | Reduced favicon legibility in dark browser themes | Out of scope per PRD; noted in spec-notes.md for future |

---

## 8. Rollback Plan

- TASK-001: revert `bg-paper-1` on RoadmapSection, remove `bg-paper-2` from BenefitsGrid, revert Footer to `bg-ink-12`.
- TASK-002: remove `<em>` from Hero.jsx markup; remove `.hero-title em` rule from `index.css`.
- TASK-003: restore original `public/favicon.svg` content from git history.
