# TASK-006 — Verify `Landing.jsx` section spacing and max-width compliance

## Objective

Verify that `Landing.jsx` and all four migrated section components enforce consistent section spacing (`padding: 96px 0` equivalent), a page max-width of `1280px`, and gutters of `24px` as required by PRD FR-012. This is a verification and light correction task — no structural refactoring. If any section deviates from these layout constraints after TASK-002 through TASK-005 are complete, apply the minimum correction needed.

## Required context

### Current `Landing.jsx` structure

```jsx
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MiniComparator from '../components/MiniComparator/MiniComparator';
import RoadmapSection from '../components/RoadmapSection';
import BenefitsGrid from '../components/BenefitsGrid';
import PartnershipSection from '../components/PartnershipSection';
import Footer from '../components/Footer';

const Landing = () => {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <MiniComparator />
        <RoadmapSection />
        <BenefitsGrid />
        <PartnershipSection />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
```

`Landing.jsx` is currently a thin orchestrator — it does not apply layout classes directly to sections. Each section manages its own spacing.

### Layout constraint requirements (FR-012)

- Section vertical padding: `padding: 96px 0` for standard sections. The design system defines `--space-24: 96px`. In Tailwind: `py-24` = `96px` (Tailwind's default `py-24` = `6rem` = `96px` at 16px root).
- Page max-width: `1280px` via `--container-page: 1280px`. In Tailwind config, `max-w-7xl` = `80rem` = `1280px`. The `.container-page` class in `index.css` uses `@apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- Gutters: `24px` = `--space-6`. The `.container-page` class applies `lg:px-8` (32px) on large screens and `sm:px-6` (24px) on medium. The `px-4` is the mobile fallback (16px). For desktop this means gutters are 32px at `lg` — the PRD specifies `24px`. This is a pre-existing design decision; do not change it in this task (it is part of the foundation established by EVO-039/040). Flag as an open note.

### Existing `.section` class

```css
.section { @apply py-16 sm:py-20 lg:py-24; }
```

At `lg` breakpoint: `py-24` = `96px` top and bottom. This matches the PRD's `96px` requirement. All four section components already use `className="section ..."`.

### Verification checklist

For each of the four sections, verify:
1. The `<section>` element uses the `.section` class (which resolves to `py-24` at `lg` = `96px`).
2. The inner `<div>` uses `.container-page` (which resolves to `max-w-7xl mx-auto` = `1280px` max-width).
3. No section overrides these to produce a narrower container.

Current state (before TASK-002 through TASK-005):
- `Hero.jsx`: `<section className="relative overflow-hidden hero-grid-bg">` — no `.section` class. The container div uses `className="container-page section text-center"` — the `.section` class is on the inner div, not the `<section>` element. This is acceptable as it achieves the same visual result (the `.section` padding applies to the container div that holds the content).
- `BenefitsGrid.jsx`: `<section className="section bg-paper-2">` — correct.
- `RoadmapSection.jsx`: `<section id="roadmap" className="section bg-paper-1">` — correct.
- `PartnershipSection.jsx`: `<section id="partnerships" className="section bg-ink-12 text-paper-1">` — correct.

### What Landing.jsx should ensure

`Landing.jsx` itself does not need to change unless one of the following is true:
1. A section component (after migration) loses its `.section` class or `.container-page` class.
2. The `<main>` element needs a layout class added.

Verify after TASK-002 through TASK-005 that:
- No section drops its `.section` or `.container-page` class as part of the migration.
- The `<main className="flex-1">` wrapper is sufficient for the flex-column page layout — it is (`min-h-[100dvh]` on the outer div, `flex flex-col` layout, `flex-1` on main).

### UI constraints (from `shared-knowledge/ui-guidelines.md`)

- `min-h-[100dvh]` instead of `h-screen` is already used — compliant.
- No section may override `container-page` to produce a narrower or wider container — verify no section uses a different max-width class.

## Potentially impacted files

- `frontend/src/pages/Landing.jsx` (likely no changes needed)
- Potentially: `frontend/src/components/Hero.jsx` if the `.section` / container structure needs correction

## Inputs

- Current `Landing.jsx` source (shown above)
- Post-migration states of `Hero.jsx`, `BenefitsGrid.jsx`, `RoadmapSection.jsx`, `PartnershipSection.jsx` (results of TASK-002 through TASK-005)

## Expected outputs

1. Confirm (or correct) that all four sections have:
   - Vertical padding equivalent to `96px` on large screens (via `.section` class or equivalent).
   - Inner content constrained to `1280px` max-width (via `.container-page`).
   - Horizontal gutters of at least `24px` (via `.container-page`'s `px-6` or `px-8`).

2. If `Landing.jsx` is already correct: document the verification result with a comment in the task output. No file changes required.

3. If a correction is needed: apply the minimum change to the offending section component or `Landing.jsx`. Document what was changed and why.

## Constraints

- Do not restructure `Landing.jsx` to add a global `.page` wrapper — section backgrounds are full-width and must not be constrained by a parent max-width container.
- Do not modify `MiniComparator`, `Navbar`, or `Footer` — they are out of scope.
- Do not change the `min-h-[100dvh] flex flex-col` outer div or `flex-1` main — these are EVO-040 conventions.
- If a gutter discrepancy exists (e.g. `lg:px-8` = 32px vs. PRD's 24px), leave it as-is and note it. Changing the `.container-page` class would be a system-wide breaking change outside this evolution's scope.

## Dependencies

TASK-002, TASK-003, TASK-004, TASK-005 (this task verifies the post-migration state of all four sections)

## Validation criteria

- [ ] All four section components (`Hero`, `BenefitsGrid`, `RoadmapSection`, `PartnershipSection`) apply vertical padding equivalent to `96px` at the `lg` breakpoint.
- [ ] All four sections' inner content containers resolve to `max-width: 1280px` (`max-w-7xl` = `80rem`).
- [ ] No section uses a different max-width class that overrides `.container-page`.
- [ ] The page layout (`min-h-[100dvh] flex flex-col` + `flex-1` main) is unchanged.
- [ ] The schematic grid background on `Hero` does not visually extend into the `MiniComparator` or `RoadmapSection` (the background is scoped to the `<section id="top">` element).

## Tests to implement

### Unit
- None required.

### Integration
- Load the landing page at full desktop width (1440px or wider) and verify each section's content area is constrained to `1280px`.
- Open DevTools → inspect each section's `.container-page` div: confirm `max-width: 1280px`, `padding-left: 32px`, `padding-right: 32px` at `lg` breakpoint.
- Scroll through the full page and confirm consistent top/bottom padding across all four sections.
- Verify the Hero grid background does not bleed into the MiniComparator section below it.
