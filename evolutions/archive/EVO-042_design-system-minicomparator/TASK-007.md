# TASK-007 — Migrate MiniComparator.jsx and perform final legacy-style audit

## Objective

Apply any remaining token corrections to `MiniComparator.jsx` (the outer wrapper), then run a full legacy-style audit across all six migrated files and the CSS module to verify zero remaining legacy styling. This is the final task for EVO-042 and must not be started until TASK-002 and TASK-006 are complete.

## Required context

**File location:** `frontend/src/components/MiniComparator/MiniComparator.jsx`

**Current state of MiniComparator.jsx:**
- Section wrapper: `className="section bg-paper-2"` — `bg-paper-2` is the correct page background for the comparator section (it is a `--bg-recessed` surface, consistent with the design system). No change.
- Outer grid: `className="mt-12 grid gap-x-6 lg:grid-cols-[320px_1fr] w-fit mx-auto items-start"` — the design system specifies `grid-template-columns: 280px 1fr` and `gap: 24px`. The production code uses `320px`. Review against FR-014: "280px filter panel, 1fr table area, 24px gap". Correct to `lg:grid-cols-[280px_1fr] gap-x-6` (gap-x-6 = 24px, correct). The `320px` must be narrowed to `280px`.
- Filter drawer `<div>`: `className="fixed inset-y-0 left-0 z-50 flex w-80 ..."` — `w-80` is 320px, matching the mobile drawer width. This mobile-only drawer width is acceptable as a maximum (it uses `max-w-[85vw]` and is off-canvas on mobile). The desktop column is separately controlled by the grid — this class only affects the mobile slide-in. However, `w-80` is the mobile drawer intrinsic width. The PRD specifies 280px for the desktop sidebar column. Adjust the grid column only; leave the mobile drawer `w-80` as-is (different context).
- Background classes on filter drawer: `bg-paper-2` for the mobile drawer background — this is correct (the drawer sits on a warm recessed surface).
- `bg-transparent` on desktop sidebar: correct (the sidebar shows the card background from `FilterPanel.jsx`).

**Summary of changes needed:**
1. Change the grid column from `lg:grid-cols-[320px_1fr]` to `lg:grid-cols-[280px_1fr]` — this is the only styling correction in `MiniComparator.jsx`.
2. All other classes in this file are already token-correct.

**Design system reference:** `comparator.css` `.cmp-page { grid-template-columns: 280px 1fr; gap: 24px; }`

**PRD reference:** FR-014

## Potentially impacted files

- `frontend/src/components/MiniComparator/MiniComparator.jsx` — one targeted edit (grid column width)

## Inputs

- `frontend/src/components/MiniComparator/MiniComparator.jsx` (read before editing)
- All six migrated files for the legacy-style audit (TASK-002 through TASK-006 must be complete)

## Expected outputs

### Grid column correction

Replace:
```jsx
className="mt-12 grid gap-x-6 lg:grid-cols-[320px_1fr] w-fit mx-auto items-start"
```
With:
```jsx
className="mt-12 grid gap-x-6 lg:grid-cols-[280px_1fr] w-fit mx-auto items-start"
```

### Legacy-style audit

After applying the above change, perform a static scan of all seven files listed below. All scans must return zero matches.

**Files to scan:**
1. `frontend/src/components/MiniComparator/FilterPanel.jsx`
2. `frontend/src/components/MiniComparator/FilterPanel.module.css`
3. `frontend/src/components/MiniComparator/ComparisonTable.jsx`
4. `frontend/src/components/MiniComparator/ColumnSelector.jsx`
5. `frontend/src/components/MiniComparator/badges.jsx`
6. `frontend/src/components/MiniComparator/FilterChips.jsx`
7. `frontend/src/components/MiniComparator/MiniComparator.jsx`

**Patterns to search for (AC-012):**
- `brand-` — legacy brand-prefixed color classes
- `blue-` — legacy Tailwind blue scale
- `#[0-9a-fA-F]{3,8}` — raw hex color values (note: `rgba(14,15,12,0.18)` is an acceptable exception if present as part of the `shadow-menu` fallback in `ColumnSelector.jsx`)
- `style=.*color` — inline `style` attributes containing color (the allowed inline styles are: `popupStyle` in ColumnSelector, `pct()` positioning in DualRangeRow, `zIndex` in DualRangeRow, `transition` strings using only `var(--*)` tokens, `position: sticky; left: 0` on the WheelDetailPanel anchor)

If any scan returns matches, report them as failing items rather than silently fixing them — the corresponding upstream task has a defect to correct.

## Constraints

- No change to state logic (`filtersOpen`, `visibility`, `handleToggle`)
- No change to the mobile drawer open/close behavior or `aria-modal` attributes
- No change to `FilterPanel`, `ComparisonTable`, `Icon` imports
- The mobile drawer `w-80` (320px) is intentionally kept — it is the drawer slide-in width, not the desktop grid column
- `bg-paper-2` on the section wrapper is correct and untouched

## Dependencies

TASK-002 (FilterPanel.jsx must be migrated), TASK-006 (ComparisonTable.jsx must be migrated)

## Validation criteria

- [ ] Desktop grid renders the filter panel at 280px (not 320px) wide (FR-014)
- [ ] Layout gap is 24px (`gap-x-6`) between filter panel and table (FR-014)
- [ ] Static scan: zero matches for `brand-`, `blue-`, raw hex values across all 7 files (AC-012)
- [ ] Static scan: no unauthorized `style` attributes with color/typography values
- [ ] Both FR and EN locales render without layout breakage (AC-014)
- [ ] No layout shift or visual regression on landing sections outside the MiniComparator surface

## Tests to implement

### Unit (automated — AC-012)
Run the following PowerShell commands from the project root to confirm zero legacy matches:
```powershell
$files = @(
  'frontend/src/components/MiniComparator/FilterPanel.jsx',
  'frontend/src/components/MiniComparator/FilterPanel.module.css',
  'frontend/src/components/MiniComparator/ComparisonTable.jsx',
  'frontend/src/components/MiniComparator/ColumnSelector.jsx',
  'frontend/src/components/MiniComparator/badges.jsx',
  'frontend/src/components/MiniComparator/FilterChips.jsx',
  'frontend/src/components/MiniComparator/MiniComparator.jsx'
)
foreach ($f in $files) {
  $hits = Select-String -Path $f -Pattern 'brand-|blue-|#[0-9a-fA-F]{3}' | Where-Object { $_ -notmatch '\/\/' }
  if ($hits) { Write-Host "FAIL $f"; $hits } else { Write-Host "PASS $f" }
}
```
All files must output `PASS`.

### Integration
- Switch locale to FR, visually inspect all six component surfaces — no layout breakage, no untranslated keys visible
- Switch to EN, repeat
- Apply a brand filter, sort by weight, hide a column — verify Redux DevTools action types and state shape are identical to pre-migration (AC-013)
- Verify the filter panel is 280px wide at desktop breakpoint (lg+) via browser devtools layout inspector
