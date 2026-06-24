# Implementation Notes — EVO-022 Landing UI Polish

## TASK-001 — Fix section background color collisions

Three files were changed, each with a single className attribute edit:

- `frontend/src/components/RoadmapSection.jsx`: `bg-paper-2` replaced with `bg-paper-1` on the `<section>` tag, eliminating the collision with the preceding MiniComparator (`bg-paper-2`).
- `frontend/src/components/BenefitsGrid.jsx`: `bg-paper-2` added to the `<section>` tag (was classless), creating a visible contrast against the now-`paper-1` RoadmapSection above and the `ink-12` PartnershipSection below.
- `frontend/src/components/Footer.jsx`: `bg-ink-12` replaced with `bg-ink-11` on the `<footer>` tag, eliminating the collision with the preceding PartnershipSection (`bg-ink-12`).

No other lines, content, layout, or logic were touched. All validation criteria are met: the six-section background sequence is now `paper-1 → paper-2 → paper-1 → paper-2 → ink-12 → ink-11` with no two consecutive sections sharing the same token. Only existing design-system Tailwind tokens were used; no raw hex values or style attributes were introduced.

---

## TASK-002 — Hero title "measured." typography

Files changed:
- `frontend/src/components/Hero.jsx` (line 11): wrapped "measured." in a bare `<em>` element with no attributes — `<em>measured.</em>`.
- `frontend/src/index.css`: inserted `.hero-title em { font-style: italic; font-weight: 300; letter-spacing: -0.05em; color: var(--brass-8); }` inside `@layer components`, immediately after the closing brace of `.hero-title`.

All validation criteria pass by static inspection: the `<em>` carries no `className`, `style`, or other attribute; the `<h1>` className is unchanged (`hero-title text-ink-10`); all four CSS properties are explicit using `var(--brass-8)`; no other elements or layout are touched.

---

## TASK-003 — Replace placeholder favicon with MyBikeLab brand icon

File changed: `frontend/public/favicon.svg` — entirely replaced with the logo-mark SVG (square outline, four tick marks, M path). Every `currentColor` occurrence was substituted with the explicit value `#0e0f0c` (`--ink-12` token) for reliable rendering outside any CSS context. No other files were touched (`index.html` and `src/assets/logo-mark.svg` are unchanged). All validation criteria pass: the new file contains the logo-mark shape, no `currentColor` references remain, no `width`/`height` attributes were added, and no `<title>` or `<desc>` elements are present.
