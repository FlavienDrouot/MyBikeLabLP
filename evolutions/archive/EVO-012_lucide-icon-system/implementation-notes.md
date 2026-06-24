# Implementation Notes — EVO-012

## TASK-001 — Install lucide-react

**Result:** `lucide-react@^1.16.0` added to `dependencies` in `package.json`. Installed via `npm install lucide-react`.

**Notes:** No issues. One pre-existing moderate severity vulnerability flagged by npm audit — unrelated to this evolution.

---

## TASK-002 — Create Icon wrapper

**Result:** `src/components/ui/Icon.jsx` created. DS stroke defaults (`strokeWidth: 1.4`, `strokeLinecap: 'square'`, `strokeLinejoin: 'miter'`, `color: 'currentColor'`) defined in exactly one place.

**Notes:** No deviations from spec.

---

## TASK-003 — Navbar icons

**Result:** Two inline SVGs replaced with `<Icon as={Menu} size={24} />` and `<Icon as={X} size={24} />`. No layout or behavior change.

**Notes:** No deviations from spec.

---

## TASK-004 — MiniComparator icons

**Result:** Filter trigger replaced with `<Icon as={SlidersHorizontal} size={16} />`. Drawer close replaced with `<Icon as={X} size={20} />`. Sizing classes (`h-4 w-4`, `h-5 w-5`) removed; size owned by the `size` prop.

**Notes:** `SlidersHorizontal` chosen for filter trigger as specified (best match for filter/adjust intent).

---

## TASK-005 — FilterPanel Section chevron

**Result:** `ChevronDown` replaces fill-based SVG chevron. `rotate-180`, `text-ink-6`, and `transition-transform` classes preserved via `className` on the Icon call.

**Notes:** No deviations from spec.

---

## TASK-006 — ComparisonTable ChevronIcon

**Result:** Local `ChevronIcon` component removed. `ChevronDown` via `Icon` wrapper replaces it inline at the usage site. `transition-transform duration-150` and conditional `rotate-180` class preserved.

**Notes:** No deviations from spec.

---

## TASK-007 — ColumnSelector icon

**Result:** `Columns2` chosen — the original SVG rendered two vertical column dividers inside a rounded rectangle, which `Columns2` represents directly. `text-ink-7` class preserved via `className`.

**Notes:** No deviations from spec.

---

## TASK-008 — ContactForm checkmark

**Result:** `Check` replaces the inline SVG checkmark in the success state. Inherits `text-brass-9` via `currentColor` from parent container.

**Bug fix:** The spec listed the import path as `../ui/Icon` for `ContactForm.jsx`, but this file lives at `src/components/ContactForm.jsx` (same level as `ui/`), so the correct path is `./ui/Icon`. The task agent used the incorrect spec path; corrected by the orchestrator before the final build.

---

## TASK-009 — Audit

**Result:** Final grep on `src/components/**/*.jsx` for `<svg` returns **zero matches**. DS stroke defaults (`strokeWidth: 1.4`, `strokeLinecap: 'square'`, `strokeLinejoin: 'miter'`) appear only in `src/components/ui/Icon.jsx`. No wildcard `lucide-react` imports found anywhere.

**Unexpected finding:** `BenefitsGrid.jsx` contained 3 inline SVG UI icons not listed in the original scope (benefit card icons: checkmark circle, trend chart, group of people). These were migrated during the audit step using `CheckCircle`, `TrendingUp`, and `Users` respectively.

**`assets/wheel-schematic.svg`:** Not touched.

---

## TASK-010 — Bundle size

| | JS (raw) | JS (gzip) |
|---|---|---|
| Baseline (pre-evolution) | 265.91 kB | 81.17 kB |
| Post-evolution | 266.15 kB | 81.77 kB |
| **Delta** | **+0.24 kB** | **+0.60 kB** |

Bundle addition is tree-shaken and well below the 15 KB threshold. No wildcard imports confirmed.

---

## Spec note

The tech-specs.md import path for `ContactForm.jsx` (`../ui/Icon`) was incorrect. The correct relative path from `src/components/ContactForm.jsx` to `src/components/ui/Icon.jsx` is `./ui/Icon`. The spec-notes.md should be updated to reflect this.
