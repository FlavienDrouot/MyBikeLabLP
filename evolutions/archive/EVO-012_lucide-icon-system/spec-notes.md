# Spec Notes — EVO-012: Lucide as the canonical icon system

---

## PRD Interpretations

### INT-001 — Footer has no UI icons to migrate
The PRD lists `Footer` as an impacted component. The actual `Footer.jsx` contains only text navigation links and no SVG icons. The Footer is therefore included in scope for the inventory audit (TASK-001) and the bundle check (TASK-008), but requires no icon replacement task. If a UI icon is added to the Footer in a future evolution, it will automatically inherit the shared system.

### INT-002 — `MiniComparator.jsx` owns two icons independently of `FilterPanel` and drawer
The MiniComparator parent component owns two icons: the mobile filter trigger button (filter funnel) and the mobile drawer close button (X). These are separate from the icons inside `FilterPanel`. They must be migrated in the MiniComparator task, not in the FilterPanel task.

### INT-003 — `ColumnSelector.jsx` icon is a columns/layout icon, not a chevron
The PRD mentions "toggle chevron" for ColumnSelector. Inspection shows the actual icon is a layout/columns grid icon (`fill="currentColor"` path). The button does not render a chevron — there is no open/closed state chevron on the button. The ColumnSelector button icon is a columns grid icon; Lucide's `Columns2` (or `LayoutList`) is the appropriate replacement. This is flagged as an open question.

### INT-004 — FilterPanel chevron is currently fill-based, not stroke-based
The `Section` accordion in `FilterPanel.jsx` uses a filled chevron SVG (`fill="currentColor"`, no `stroke`). Replacing it with a Lucide chevron (which is stroke-based) aligns it with the DS specification. This is a deliberate improvement, not a regression — the DS explicitly requires stroke-based icons.

### INT-005 — ComparisonTable has no sort indicator icon in the current codebase
The PRD mentions "sort indicator" for ComparisonTable. The current `ComparisonTable.jsx` does not implement a sort indicator icon — it only has the `ChevronIcon` expand/collapse chevron. No task is needed for a sort indicator at this time; the PRD reference is aspirational. The migration covers the existing `ChevronIcon` only.

### INT-006 — `LargeMultiSelectFilter` remove-value buttons use `×` (U+00D7) as text, not an SVG icon
In `FilterPanel.jsx`, the selected-value chips in `LargeMultiSelectFilter` use `<span aria-hidden="true" className="text-ink-12/60">×</span>` — a typographic multiplication sign, not an inline SVG. This is already compliant with the DS rule "typographic glyphs preferred over icons." No replacement is required.

### INT-007 — No automated tests are expected per PRD section 10
The PRD explicitly states "None specified for this evolution — the DS compliance and layout criteria require visual judgment that is not automatable at this stage." All validation criteria in the tech-specs are therefore manual. The `Tests to implement` sections will note "none" for automated tests.

### INT-008 — `lucide-react` must be added as a runtime dependency, not a devDependency
Icons are rendered at runtime in JSX. `lucide-react` must appear in `dependencies`, not `devDependencies`, in `package.json`.

---

## Architecture Decision Rationale

### AD-001 — Shared `Icon` wrapper component as the single configuration point

**Decision:** Introduce a thin wrapper component `src/components/ui/Icon.jsx` that forwards all DS defaults (`strokeWidth`, `strokeLinecap`, `strokeLinejoin`, `color`) to any Lucide icon component passed as a prop, while allowing per-use `size` override.

**Rationale:** FR-003 requires that DS stroke defaults be defined in exactly one place. A wrapper component achieves this without any build-time complexity. Every point of use imports `Icon` and passes a Lucide component — the wrapper enforces stroke properties. Changing stroke defaults in the future means editing `Icon.jsx` only.

**Alternative considered — Tailwind CSS global SVG rule:** Applying DS stroke values via a global CSS selector (e.g., `svg { stroke-width: 1.4 }`) would work but is fragile: it would affect the wheel schematic illustration, brand icons, and any SVG element outside the icon system, violating FR-005 and FR-006. Rejected.

**Alternative considered — Lucide's `defaultProps` / context provider:** Lucide React does not expose a context-level configuration API as of the current version. Even if it did, it would apply to all Lucide instances unconditionally, with no way to exclude brand icons. Rejected.

**Alternative considered — per-use prop repetition:** Each icon call site would repeat `strokeWidth={1.4} strokeLinecap="square" strokeLinejoin="miter"`. This violates FR-003 directly. Rejected.

### AD-002 — `Icon` component accepts a Lucide component as a prop (not an icon name string)

**Decision:** The `Icon` wrapper signature is `<Icon as={LucideComponent} size={n} />` where `as` is the actual imported Lucide component class.

**Rationale:** This approach preserves full tree-shaking. Only the Lucide icons actually passed to `Icon` will be bundled. A string-based registry (`<Icon name="chevron-down" />`) would require importing all icon components into a central map, defeating tree-shaking and increasing bundle size.

### AD-003 — `lucide-react` installed as a production dependency

**Decision:** `lucide-react` is added to `dependencies` in `package.json`, not `devDependencies`.

**Rationale:** The library is required at runtime. Vite's tree-shaking handles bundle optimization regardless of which section it appears in, but semantic correctness and deployment correctness require it in `dependencies`.

### AD-004 — Icon replacement is done component by component in separate tasks

**Decision:** Each affected component (Navbar, MiniComparator, FilterPanel, ComparisonTable, ColumnSelector, ContactForm) is migrated in a dedicated task.

**Rationale:** Atomic tasks are independently testable and mergeable per the TECH-SPECS workflow constraint. A single "replace all icons everywhere" task cannot be validated in isolation. Each component's visual regression is checked independently.

---

## Tradeoffs

### Wrapper verbosity vs. simplicity
The `<Icon as={ChevronDown} size={16} />` syntax is slightly more verbose than a direct `<ChevronDown size={16} />`. This is an intentional tradeoff: the wrapper is the enforcement mechanism for FR-003. Without it, there is no guarantee that DS defaults are applied consistently. The verbosity is acceptable and predictable.

### Lucide vs. Phosphor / Tabler
The design system README flags Lucide as the chosen set and notes the substitution. The PRD is built on Lucide. Phosphor and Tabler were considered in the design phase (DS README explicitly mentions them). The choice stands: Lucide is the canonical source. Swapping to another library in the future is a one-import change at the wrapper level.

### No automated tests
The evolution is purely visual — DS stroke compliance and layout regression are not automatable with the current test setup (Vitest, no visual regression framework). Adding Playwright or Chromatic would be a separate evolution. The tradeoff is accepted as stated in PRD section 10.

---

## Open Questions

### OQ-001 — Correct Lucide replacement for the ColumnSelector icon
The current icon in `ColumnSelector.jsx` is a filled two-column layout grid (resembling a "manage columns" icon). The PRD calls it a "toggle chevron" which does not match what is rendered. Candidate Lucide icons: `Columns2`, `LayoutList`, `TableProperties`. The implementor must verify which icon best matches the original visual intent before replacing. **Recommend confirming with the product owner before TASK-006 is executed.**

### OQ-002 — Exact Lucide replacement for the MiniComparator filter trigger icon
The current filter trigger icon in `MiniComparator.jsx` is a filled funnel-like path (`fillRule="evenodd"`). Candidate Lucide icons: `SlidersHorizontal`, `Filter`, `ListFilter`. The implementor must visually compare and select the best match. **Recommend selecting before TASK-004 is executed.**

### OQ-003 — Bundle size baseline
AC-007 requires a before/after bundle size comparison. A baseline build must be run before TASK-001 (package installation) to capture the pre-evolution bundle size. If no baseline is captured, the delta cannot be verified. **The implementor must run `npm run build` before starting TASK-001 and record the output.**

### OQ-004 — `aria-label` strings in Navbar are in French
The current `Navbar.jsx` uses `'Fermer le menu'` and `'Ouvrir le menu'` as `aria-label` values. These are French strings in an otherwise English-language codebase. This is out of scope for EVO-012 but is flagged here for a future i18n or accessibility review.
