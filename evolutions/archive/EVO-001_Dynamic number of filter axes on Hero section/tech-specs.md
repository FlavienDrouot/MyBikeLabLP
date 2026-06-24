# Technical Specifications

## 1. General Information

- Evolution ID: EVO-001
- Title: Hero — dynamic filter axes count
- PRD reference: `MyBikeLab/evolutions/EVO-001/prd.md`
- Author: Flavien Drouot
- Date: 2026-05-24

---

## 2. Technical Context

### Technical objective

Replace the hardcoded filter count in `Hero.jsx` with a live read from the central filter registry, so the displayed stat always reflects the actual number of filterable properties.

### Affected architecture

- `src/components/Hero.jsx` — currently a pure stateless render function with no external dependencies. Gains one import from the registry.
- `src/config/wheelProperties.jsx` — no structural change. The existing `getFilterableProperties()` helper is already exported and covers the need.

### Impacted modules

- `Hero.jsx` only.

---

## 3. Technical Constraints

- No Redux, no Context, no props — the registry is static configuration, a direct import is sufficient and appropriate.
- The Hero component must remain a pure stateless function (no hooks introduced).
- No change to `wheelProperties.jsx` or any other file.
- No change to any other Hero stat, copy, layout, or CTA.

---

## 4. Architecture Decisions

### AD-001 — Direct import of `getFilterableProperties()`, no Redux selector

#### Description

`Hero.jsx` imports `getFilterableProperties` from `wheelProperties.jsx` and calls `.length` on its return value inline in JSX.

#### Motivation

`WHEEL_PROPERTIES` is static configuration loaded once at module init — it never changes at runtime. A Redux selector exists for runtime-computed derived data (filtered wheels); it would be over-engineering here. A direct import is the lightest, most readable solution and is consistent with how `FilterPanel`, `ComparisonTable`, and `ColumnSelector` already consume the registry.

#### Rejected alternatives

- **Redux selector returning the count**: adds Redux boilerplate and a `useSelector` hook to a component that currently has no hooks — unjustified for static data.
- **Prop passed from `Landing.jsx`**: creates an unnecessary coupling; the Hero should own this read directly.
- **New exported constant `FILTERABLE_COUNT`**: redundant with `getFilterableProperties().length`; a derived constant that duplicates what the function already computes.

---

## 5. Task Breakdown

---

# TASK-001 — Replace hardcoded filter count in Hero with registry-derived value

## Objective

In `Hero.jsx`, replace the hardcoded numeric literal `7` (filter axes stat) with `getFilterableProperties().length`, sourced via a named import from `wheelProperties.jsx`.

## Required context

- `src/components/Hero.jsx` is a pure stateless React component. It renders a section with three stats. The second stat currently reads `<div className="text-2xl font-bold text-brand-600">7</div>`.
- `src/config/wheelProperties.jsx` exports `getFilterableProperties`, a function that returns the subset of `WHEEL_PROPERTIES` entries that have a `filter` field defined. It currently returns 13 entries.
- No other file needs to be touched.

## Potentially impacted files

- `src/components/Hero.jsx` — sole file modified.

## Inputs

- Current `Hero.jsx` content (pure JSX, no imports).
- Exported function `getFilterableProperties` from `wheelProperties.jsx`.

## Expected outputs

- `Hero.jsx` with one added import line and the literal `7` replaced by `{getFilterableProperties().length}`.
- The rendered page displays `13` (current registry count) in the filter axes stat.

## Constraints

- Do not introduce hooks (`useState`, `useEffect`, `useSelector`, etc.).
- Do not modify `wheelProperties.jsx`.
- Do not alter any other element of the Hero JSX (copy, layout, other stats, CTAs).
- The import must be a named import: `import { getFilterableProperties } from '../config/wheelProperties';`

## Dependencies

- None.

## Validation criteria

- [ ] `Hero.jsx` contains no numeric literal representing the filter count.
- [ ] `Hero.jsx` imports `getFilterableProperties` from `../config/wheelProperties`.
- [ ] The rendered filter axes stat equals `getFilterableProperties().length` (currently 13).
- [ ] The "15+" wheels stat, the "3 Phases ahead" stat, CTAs, and all other Hero content are unchanged.
- [ ] No hook is used in `Hero.jsx`.

## Tests to implement

### Unit

- None required (pure render, no logic — see PRD §10).

### Integration

- None required.

### Manual

- Load the landing page; verify the filter axes stat reads "13".
- Open `Hero.jsx`; confirm no numeric literal for the filter count is present.
- Add one entry with a `filter` field to `WHEEL_PROPERTIES`; reload; verify the Hero stat increments to 14 without any Hero change. Revert.

---

## 6. Global Validation Strategy

### Unit validation

Not applicable — no logic to unit-test.

### Integration validation

Not applicable — no cross-module data flow introduced (static import, no side effects).

### Functional validation

- Load the landing page and verify the Hero displays "13 Filter axes".
- Inspect `Hero.jsx` source and confirm the absence of a hardcoded count.

### Non-regression validation

- All other Hero stats ("15+", "3") remain unchanged.
- The Wheel Comparator filter behavior is unaffected (no change to `wheelProperties.jsx`).
- All other page sections render correctly.

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| `getFilterableProperties` import path wrong | Build error | Path is `../config/wheelProperties` from `src/components/` — verify once |
| Future refactor renames the helper | Hero silently breaks | Covered by convention: registry helpers are the single source of truth |

---

## 8. Rollback Plan

- Revert `Hero.jsx` to its pre-evolution state (restore the hardcoded `7` and remove the import line).
- Single-file change — git revert is trivial.
