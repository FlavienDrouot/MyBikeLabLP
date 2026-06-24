# Spec Notes — EVO-003 Design System Migration

## PRD interpretations

**FR-002 — Hero section background**
The PRD says "Large surfaces and the hero section use `paper-0`." The current Hero uses a three-stop gradient (`from-brand-50 via-white to-white`). The spec replaces this with flat `bg-paper-0`. No gradient token is defined in the design system — the Notebook direction uses solid surfaces.

**FR-003 — Hero stat values**
The PRD specifies "brass accent on key stats" for the Hero section and "brass text on paper" for key metric values in the comparator. The tech spec extends the JetBrains Mono + tabular-nums treatment to the Hero stat values (15+, filter count, 3), since they are numeric metric values and the Notebook direction treats all prominent numbers consistently.

**FR-005 — Border radius on icon containers**
The PRD specifies square corners for "cards, panels, and the comparator table." The BenefitsGrid icon containers (`h-10 w-10 place-items-center`) are small colored panels — the spec applies `rounded-none` to them for consistency. This is a judgment call; the PRD does not explicitly address icon containers.

**FR-005 — Border radius on the logo mark**
The Navbar and Footer logo marks (`h-8 w-8` or `h-7 w-7` colored divs) use `rounded-lg` / `rounded-md`. The spec changes these to `rounded-xs` (2px). The logo mark is not a card, panel, or badge — it is a decorative element. Applying 2px rather than zero maintains a slight softness for the brand mark, consistent with the button radius convention.

**FR-006 — ColumnSelector dropdown shadow**
The PRD prohibits drop shadows on "cards or panels." The ColumnSelector dropdown is a floating menu, not a card or panel. The design system defines `--shadow-menu` specifically for floating menus. The spec uses `shadow-sm` (Tailwind's lightest named shadow) as a practical approximation of `--shadow-menu` since the custom property cannot be used directly as a Tailwind class. This is the minimum needed to visually lift the dropdown above the page content.

**FR-007 — Range slider value display**
The PRD specifies JetBrains Mono for "all numeric data in the ComparisonTable." The spec additionally applies `font-mono` to the range value display in `FilterPanel` (the "X — Y" readout above each slider). These are numeric values displayed alongside a filter, which aligns with the precision aesthetic even though the PRD does not explicitly call them out.

**FR-008 — Section group titles in FilterPanel**
The PRD says "filter axis labels in FilterPanel are rendered as all-caps micro labels." This is interpreted as applying to both the individual filter axis labels (Weight, Brand, etc.) AND the section group titles (Wheel Specs, Geometry, etc.). The group titles function as category headers — applying the micro label treatment makes the entire filter panel typography consistent.

**FR-010 — Footer: light or dark?**
The PRD section 7 explicitly says: "src/components/Footer/ — background (dark section: `ink-12`), text colors." The current Footer is white (`bg-white`). The spec changes it to `bg-ink-12`, making it a dark end-cap to the landing page. This creates two consecutive dark sections at the bottom (Partnership + Footer). The border `border-ink-10` between them provides adequate separation.

---

## Architecture decision rationale

**AD-001 — Why fully replace ink-* rather than alias old steps**
During codebase analysis, the old `ink-*` steps (100–900) appear in 11 component files. If we kept aliases like `ink-100: '#f1f5f9'` pointing to old values, those components would continue compiling with stale class names — silently passing AC-001 (`brand-` search) while still using the old slate palette. Full replacement forces all usages to break immediately when TASK-001 is applied, making the migration state visible.

**AD-002 — Why retain brand-* in tailwind.config.js**
After reading all 11 component files, every `brand-*` usage is in a component that has a corresponding migration task. However, the migration happens task by task, and if `brand-*` were removed from config in TASK-001, any partially migrated component that still compiles (because its `brand-*` class is now undefined and Tailwind simply omits it) would show the correct classes for migrated elements and invisible/missing styles for unmigrated ones. Keeping `brand-*` defined throughout the migration means the unmigrated classes continue to produce their (wrong) blue output, making visual diffs obvious. Post-migration, a PR can remove `brand-*` from the config.

**AD-005 — Why property.unit as the numeric heuristic**
After reading `ComparisonTable.jsx`, `getColumnProperties()` returns an array of property configs. The two non-numeric columns visible in the rendered table are the "Wheel" name column (no unit, renders `brand model`) and the expand/collapse column (no content, just a chevron). All other columns have a `unit` field (`'g'`, `'€'`, `'mm'`, etc.). This heuristic is robust for the current dataset but requires verification at implementation time by logging the property list.

**AD-006 — Why bypass headClassFor in ComparisonTable**
After reading `wheelProperties.jsx` path and confirming it cannot be modified, the only safe way to apply a universal header style is to hardcode it. The `headClassFor` helper may return values with legacy `ink-*` tokens from `wheelProperties.jsx` — these cannot be updated. Bypassing the helper entirely eliminates the risk of legacy token contamination in column headers.

---

## Tradeoffs

**Keeping brand-* in tailwind.config.js vs removing it**
Keeping: safer during transition, no partial-migration silent failures.
Removing: cleaner output, smaller generated CSS, forces all issues to surface immediately.
→ Kept for EVO-003; removal is a one-line change in a follow-up cleanup EVO.

**Applying font-mono to all table cells vs only numeric cells**
All cells: simpler implementation, consistent monospace rhythm. Downside: brand/model names in monospace look odd (brand names are editorial, not technical).
Only numeric (via property.unit): correct semantic distinction, aligns with FR-007 wording.
→ Selected: only numeric cells, identified by `property.unit !== undefined`.

**Replacing card drop shadow with hairline border vs no border**
Hairline border only: aligns with FR-006, allows elevation to be communicated through background-color differentiation between paper steps (paper-0 card on paper-1 page or paper-2 section).
No border, no shadow: would make cards invisible on same-tone backgrounds.
→ Hairline border (`border-ink-4`) is the correct choice per design system.

**Dark Footer immediately after dark Partnership section**
Risk of two dark sections reading as one undifferentiated block.
Mitigation: the top border of the Footer (`border-ink-10`) is a strong keyline that separates the sections. Additionally, the Partnership section contains significant light content (the ContactForm card in paper-0) which provides visual contrast before the dark Footer begins.

---

## Open questions

**OQ-001 — cellClassName and headClassName in wheelProperties.jsx**
At implementation time, the implementer must call `getColumnProperties()` and log the full output to check whether any property defines `column?.cellClassName` or `column?.headClassName` with legacy `ink-*` or `brand-*` tokens. If found, these cannot be updated (out of EVO-003 scope). They should be documented here and addressed in a follow-up EVO.

**OQ-002 — accent-brass-7 Tailwind v3 support**
The `accent-*` utility was introduced in Tailwind v3.1. The project's `package.json` Tailwind version must be verified before using `accent-brass-7`. If the version is below 3.1, the fallback is `[accent-color:#a88846]` as an explicit arbitrary-value exception — document it in `token-convention.md` Section 6 if used.

**OQ-003 — ContactForm on dark background contrast**
The `ContactForm` `<form>` uses `.card` (now `bg-paper-0`) inside the ink-12 Partnership section. The form is wrapped in `<div className="text-ink-11">` set by PartnershipSection. Verify that `text-ink-11` (very dark) inside `bg-paper-0` renders correctly — it should (dark text on light card background), but verify no outer dark-text inheritance bleeds through.

**OQ-004 — Google Fonts CDN availability**
The JetBrains Mono import is added to `index.css`. In offline/development environments without CDN access, the font may not load. The fallback stack (`IBM Plex Mono`, `SF Mono`, `Menlo`, `Consolas`) provides a monospace alternative. This is acceptable for the MVP. If offline reliability becomes a requirement, bundling the font via the project's assets is a follow-up consideration.
