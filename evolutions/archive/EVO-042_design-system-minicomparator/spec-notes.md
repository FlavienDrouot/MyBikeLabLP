# Spec Notes — EVO-042 Design System MiniComparator

---

## PRD interpretations

### FilterChips.jsx does not exist in production

The PRD lists `FilterChips.jsx` as a file in scope and the needs assessment explicitly adds it to scope. The production codebase contains no such file in `frontend/src/components/MiniComparator/`. The design system reference (`design-system/ui_kits/comparator/FilterChips.jsx`) defines the active chip row as a component that reads filter state and renders removable brass-tinted chips.

Decision: TASK-005 creates `FilterChips.jsx` from scratch and wires it into `ComparisonTable.jsx` between the toolbar row and the scrollable table area. Redux selectors used will be identical to those already used in `FilterPanel.jsx` (`s.filters.filters`, `setFilterValue`, `resetFilters`).

---

### Pill shape for multi-select chips vs. active filter chips

The PRD (FR-003) specifies `paper-1` background and `ink-4` border for default multi-select filter chips but does not explicitly specify their shape. The design system reference (`comparator.css`, `.chip` rule) uses `border-radius: 999px` (pill shape) for the chip buttons. The current production `Pill` component in `FilterPanel.jsx` uses `rounded-xs` (2px). This is a divergence from the design system target.

Decision: correct to `rounded-full` (`radius-pill`) for multi-select chips in TASK-002, matching the design system reference. Active filter chips in `FilterChips.jsx` use `rounded-xs` (2px) per FR-004. This distinction is intentional and documented in AD-004.

---

### Range slider thumb size: 20px (production) vs. 14px (design system)

The current `FilterPanel.module.css` thumb size is 20x20px. The design system reference (`comparator.css`, `.range-thumb`) defines 14x14px. The PRD (FR-005) specifies 14x14px.

Decision: TASK-001 corrects to 14x14px. The thumb hover scale transform (`scale(1.2)`) from the current CSS is removed — the design system reference has no scale hover on the thumb. The `cursor: grab` is preserved.

---

### Range slider visual track: 6px height (production) vs. 2px (design system)

The current `FilterPanel.module.css` `.track` and `.range` are 6px height. The design system reference specifies 2px height for `.range-track` and `.range-fill`. The PRD (FR-005) specifies 2px.

Decision: TASK-001 corrects to 2px. `border-radius` on the track is removed (design system reference has no `border-radius` on the track or fill).

---

### Range slider approach: CSS module pseudo-element vs. custom visual layer

The current implementation uses `input[type=range]` with CSS module pseudo-element styling for the visible thumb. The design system reference uses a separate visual layer (`div.range-thumb`) positioned absolutely on top of invisible native range inputs.

Decision: keep the current CSS module pseudo-element approach (production code uses `.thumb` class on the input). This avoids refactoring the `DualRangeRow` logic. The focus ring via `:focus-visible` pseudo-element on the native input is preserved and corrected. Only token values change.

---

### thead sticky background: `bg-paper-2` (production) vs. `paper-1` (design system)

The current `ComparisonTable.jsx` uses `bg-paper-2` on sticky `<th>` cells. The design system reference (`comparator.css`, `cmp-table thead`) specifies `background: var(--paper-1)`. The PRD (FR-008, AC-011) specifies `paper-1`.

Decision: TASK-006 corrects to `bg-paper-1`. The sticky `z-10` behavior is preserved.

---

### ComparisonTable outer wrapper: `card` class (production) vs. `paper-0` + `ink-10` border (design system)

The current `ComparisonTable.jsx` uses the `card` utility class on the outer wrapper. The design system reference (`comparator.css`, `.table-wrap`) specifies `background: var(--paper-0)` and `border: 1px solid var(--ink-10)`. The PRD (FR-007) specifies `paper-0` background + `ink-10` border. The `card` utility class likely applies a different border or shadow.

Decision: TASK-006 replaces the `card` class on the outer wrapper with explicit token classes (`bg-paper-0 border border-ink-10`). No shadow. The `overflow-hidden` and flex column layout are preserved. The IMPLEMENTATION-GUIDE confirms: "Cards are square, hairline border (`1px solid var(--border-default)`), no drop shadow" — the table-wrap uses `border-strong` (`ink-10`), not `border-default` (`ink-4`), which is consistent with it being the table area wrapper rather than a floating card.

---

### FilterPanel outer wrapper: `card` class (production) vs. `.filter` styles (design system)

The current `FilterPanel.jsx` uses `card p-5 lg:p-6` on the `<aside>`. The design system reference specifies `paper-0` background, `1px solid ink-4` border, `20px` padding, no shadow.

Decision: TASK-002 replaces `card` with explicit token classes (`bg-paper-0 border border-ink-4 p-5`). The `lg:p-6` padding variant may be dropped in favor of consistent 20px (`p-5`) matching the design system reference exactly. The `h-fit` and overflow classes are preserved.

---

### HookBadge: colors are inverted in production vs. design system

In production `badges.jsx`, `hookless=true` renders `bg-ink-2 text-ink-8` (a muted grey style), and `hookless=false` (hooked) renders `bg-brass-3 text-brass-10` (the brass style). The design system reference and PRD (FR-012) specify the opposite: hookless badges use `brass-2` fill, `brass-6` border, `brass-10` text; hooked badges use `ink-4` border, `ink-9` text, no fill.

Decision: TASK-003 corrects both cases. Hookless = brass-tinted pill; hooked = borderless/ink pill. This is a direct token correction, not a behavioral change.

---

### TubelessBadge: also inverted in production

Same inversion pattern as `HookBadge`. Tubeless=true currently renders brass, tubeless=false renders ink. The design system reference does not have a TubelessBadge equivalent — the PRD covers hookless badges only (FR-012). Based on the design system's semantic logic, tubeless=true (a positive/premium feature) maps to brass; tubeless=false (clincher, standard) maps to the hooked/neutral ink style.

Decision: `TubelessBadge` is kept as-is relative to its current token usage direction (tubeless → brass, clincher → ink), but its exact token values are corrected to match the `pill.hookless` pattern from the design system (brass-2/brass-6/brass-10 for the positive state, ink-4 border/ink-9 text for the neutral state). TASK-003 covers both badges.

---

### ColumnSelector popover: `border-ink-4` (production) vs. `border-ink-10` (design system)

The current `ColumnSelector.jsx` popover uses `border-ink-4`. The design system reference (`comparator.css`, `.popover`) specifies `border: 1px solid var(--ink-10)`. The PRD (FR-013, AC-005) specifies `ink-10` border.

Decision: TASK-004 corrects to `border-ink-10`. The trigger button retains `border-ink-4` (matching the `cbtn` class definition).

---

### LargeMultiSelectFilter: selected tag style uses `bg-brass-7 text-ink-12`

The production `LargeMultiSelectFilter` sub-component in `FilterPanel.jsx` renders selected items as small inline badges with `bg-brass-7 text-ink-12`. Per FR-003, selected state uses `ink-12` fill with `paper-1` text. `brass-7` is not the correct active fill.

Decision: TASK-002 corrects to `bg-ink-12 text-paper-1 border-ink-12` (same as the main `Pill` active state). The `×` remove control keeps `text-paper-1/60` (opacity-reduced paper for the subtle dismissal affordance).

---

## Architecture decision rationale

### AD-001 — FilterChips as standalone component

The design system reference already defines it as a component boundary. Creating it separately avoids merge conflicts with `ComparisonTable.jsx` and makes TASK-005 independently testable. The Redux wiring (dispatch `setFilterValue` with empty array / `resetFilters`) is already established in `FilterPanel.jsx`.

### AD-002 — Replace FilterPanel.module.css wholesale

With only two classes (`.thumb`, `.track`, `.range`) and pseudo-element rules, a full replacement is cleaner than patch edits. The file is small and self-contained.

### AD-003 — Tailwind for all token styles

The tailwind.config.js already maps the token ramp after EVO-039. Using Tailwind classes keeps the diff reviewable (class lists on JSX nodes) and avoids leaking `var()` references into JSX `style` props.

### AD-004 — Pill shape distinction

This is the hardest shape decision. The design system is consistent: `radius-pill` for `.chip` (multi-select), `radius-xs` for `.active-chip` (removable active chips) and `.tri` (tri-state toggle). The production code uses `rounded-xs` for both. The correction makes the UI more expressive: pill shape signals "this is a filter option you can activate", while the rectangular chip signals "this is an active filter you can remove".

### AD-005 — Chip row in ComparisonTable

The chip row reads Redux state and dispatches Redux actions — same as `FilterPanel.jsx`. Placing it in `ComparisonTable.jsx` keeps all table-area-adjacent UI together without requiring changes to `MiniComparator.jsx`'s outer grid.

---

## Tradeoffs

### Keeping CSS module pseudo-element approach vs. custom visual layer

Tradeoff: the design system reference uses a custom visual layer (div overlay) for the slider thumb, which gives full CSS control. The production code uses the native input's pseudo-element via the CSS module. Staying with the pseudo-element approach avoids refactoring `DualRangeRow` logic (which manages the dual-thumb z-index and positioning). The visual result is equivalent. Risk: Firefox and Safari pseudo-element support is well-established for `appearance: none` range inputs; no cross-browser concern.

### `card` class removal

Removing the `card` utility class from both `FilterPanel.jsx` and `ComparisonTable.jsx` is necessary to apply the correct token values. This assumes the `card` class applies styling not matching the design system target (specifically shadow and/or incorrect border color). If `card` is already a zero-shadow, `ink-4`-bordered utility that matches, the FilterPanel migration still applies because the `border-ink-10` requirement for the table wrapper differs from a generic `card`. The explicit class replacement is safer than relying on the `card` definition.

---

## Open questions

None. All token corrections were resolved during the Needs Assessment phase. The only structural question (FilterChips.jsx as new file vs. inline) is resolved by AD-001.
