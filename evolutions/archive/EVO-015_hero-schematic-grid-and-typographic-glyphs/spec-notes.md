# Spec Notes — EVO-015

## PRD interpretations

### INT-001 — `diameter_mm` is numeric, not a string like "700C"

The PRD uses `Ø 700C` and `Ø 650B` as expected display values and implies the data stores string designations. Inspection of `wheelsData.js` reveals that `diameter_mm` is a **raw numeric integer** (`700`, not `"700C"`). All 15 current entries have `diameter_mm: 700`.

ISO nominal labels (`700C`, `650B`) are **conventional designations** that cannot be computed arithmetically from the mm value — they are industry shorthand. The spec introduces a static lookup map `DIAMETER_LABEL_MAP` in `wheelProperties.jsx` to bridge the gap, with a safe fallback for unmapped values.

This is the single most non-obvious decision in EVO-015. It is isolated in `formatDiameter` so that extending the map for new diameters requires editing exactly one object.

---

### INT-002 — No primary CTA exists in `RoadmapSection` or `BenefitsGrid`

The PRD (FR-005, section 7) lists `BenefitsGrid.jsx` and `RoadmapSection.jsx` as components requiring the trailing `→` on primary CTAs. Inspection shows:

- `BenefitsGrid.jsx`: no `<a>` or `<button>` element of any kind. No CTA.
- `RoadmapSection.jsx`: no `btn-primary` element. Phase cards have no "action" link.

The only `btn-primary` elements in the codebase are in `Hero.jsx` (which are out of scope for EVO-015 per FR-006 / EVO-008). There are therefore **zero non-Hero primary CTAs in the current codebase** to which `→` must be added.

Decision: no `→` task is created. The convention is documented in AD-005 for future sections. If `BenefitsGrid` or `RoadmapSection` gains a primary CTA in a future evolution, `→` must be appended inline at that time.

---

### INT-003 — `WheelDetailPanel` currently has no spec rows at all

The PRD (UC-005, AC-006) requires the `WheelDetailPanel` to show diameter as `Ø [value]`. Inspection reveals the panel currently renders **only affiliate links** (manufacturer URL, retailer URLs, and prices). There is no spec-data section in the panel today.

EVO-015 introduces the first spec row (diameter) to the panel. This is the minimal change needed to satisfy AC-006. No structural refactoring of the panel is introduced — the diameter row is prepended to the existing affiliate link content as a small, self-contained block.

---

### INT-004 — `unit: ' mm'` on the `diameter` entry is incorrect for display purposes

The current `diameter` entry has `unit: ' mm'`, which would render cells as `700 mm` via the default `renderCellFor` fallback. This is already inconsistent with the data format (the value `700` is an ISO-nominal approximation, not an exact rim diameter in mm). With `renderCell` added, `unit` becomes dead code for rendering. It is removed in TASK-004 to avoid misleading future maintainers. The `accessor` is kept for filter/sort operations (which operate on the raw numeric value).

---

## Architecture decision rationale

### AD-001 — Named CSS class over inline style for Hero grid

Considered three approaches:
1. Inline `style={{ backgroundImage: '...', backgroundSize: '32px 32px' }}` on `<section>`
2. Tailwind arbitrary value: `className="[background-image:linear-gradient(...)]"`
3. Named class in `index.css`: `.hero-grid-bg`

Options 1 and 2 work but are verbose and harder to read in JSX. Option 3 is consistent with the existing `@layer components` patterns (`.btn-primary`, `.hero-title`, `.section-title`) and puts the design-token reference where it belongs — in the CSS layer. The class name is also grep-friendly for future maintainers. Chosen: option 3.

---

### AD-002 — `renderCell` in the property registry as the canonical extension point

The `wheelProperties.jsx` registry is explicitly declared as the "single source of truth for all column rendering" in `README.md` and in the file's own header comment. Adding `renderCell` to the `diameter` entry is the declared extension mechanism — no other file needs to know that diameter display is special. This pattern already exists for `model`, `price`, `hookless`, `hub`, `spokes`, and `spokeMaterial`.

---

### AD-003 — `WheelDetailPanel` imports `formatDiameter` directly rather than reading from the registry

`WheelDetailPanel` does not iterate `wheelProperties.jsx` — it reads fields off the `wheel` prop directly. Introducing a registry-driven spec-row renderer in this task would be out of scope and would require a larger structural refactor of the panel. Importing just `formatDiameter` keeps the change minimal, self-contained, and independently testable.

---

### AD-004 — Static lookup map for ISO nominal labels

The `700 → 700C` mapping is not computable. Considered:
- Adding `diameter_label` to `wheelsData.js`: prohibited by the PRD (FR-007, AC-010, section 8).
- Computing from ISO standards: `622 mm` is the actual ISO bead-seat diameter for `700C`, but `wheelsData.js` stores `700` (nominal, not ISO BSC). No reliable formula.
- Static map: straightforward, honest, and extensible. Map lives in `wheelProperties.jsx` alongside the formatting function. New entries can be added in under 30 seconds when new diameter values enter the dataset.

---

## Tradeoffs

### T-001 — `Ø` glyph encoding in JS template literals

The `Ø` character (U+00D8, Latin capital letter O with stroke) is included directly as a Unicode literal in the template string: `\`Ø ${label}\``. This is safe because:
- The project source files are UTF-8 (Vite default).
- `Ø` is within the Latin Extended-A block, widely supported in all modern editors, terminals, and diff tools.
- No font fallback is needed (Inter covers U+00D8, confirmed in PRD section 9).

Alternative considered: Unicode escape `Ø`. Rejected as less readable with no safety benefit in a UTF-8 codebase.

---

### T-002 — Diameter row position in `WheelDetailPanel`

The diameter row is inserted at the top of the scrollable content area, before the affiliate link block. This ensures it is always visible when the panel opens (the panel has `max-h-[140px]` and `overflow-y-auto`). If placed at the bottom, it could be hidden below the fold for wheels with many retailers.

---

### T-003 — `overflow-hidden` on the Hero section as grid containment

The existing `overflow-hidden` class on the Hero `<section>` serves double duty: it originally clips any overflow from the stats or title at large type sizes, and it also prevents the CSS background pattern from being visible outside the section boundaries. No additional containment CSS is needed. A code comment is recommended to document this dependency.

---

## Open questions

### OQ-001 — `650B` values: when will the dataset include them?

All 15 current wheels have `diameter_mm: 700`. The `DIAMETER_LABEL_MAP` includes `650: '650B'` in anticipation, but the mapping has not been validated against real data yet. When 650B wheels are added to `wheelsData.js`, verify that the numeric value used is exactly `650` (not `584`, which is the ISO BSC diameter, or `27.5`, which is the MTB alias).

**Action required before closing EVO-015**: confirm with the data owner what numeric value will be stored for 650B wheels, and update `DIAMETER_LABEL_MAP` accordingly if needed.

---

### OQ-002 — Should the `diameter` filter use the formatted label or the raw numeric value?

Currently the `diameter` filter uses `type: 'multiSelect'` with `accessor: (w) => w.diameter_mm` — so the filter chip would show `700` (raw number), not `700C`. This is pre-existing behavior and is outside EVO-015 scope, but it will look odd once the column shows `Ø 700C`. Recommend a follow-up evolution to align the filter chip display with the formatted label. Not blocking for EVO-015.

---

### OQ-003 — `→` glyph: where does this requirement land once new CTAs are added?

No existing non-Hero primary CTA needs `→` today (INT-002). The convention must be communicated to whoever implements the next CTA in `BenefitsGrid` or `RoadmapSection`. Consider adding a note to the component files or to `CLAUDE.md` once EVO-015 is merged.
