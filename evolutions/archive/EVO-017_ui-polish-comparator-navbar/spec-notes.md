# Spec Notes — EVO-017

## PRD interpretations

### FR-001 — Hero stat line rendered once

The Hero section (`Hero.jsx`) does not render a duplicate stat line internally. The paragraph text contains "15 road wheels, 13 filter axes" in prose form, and there is also a numeric stats grid below the CTAs with individual values (15, `getFilterableProperties().length`, 3). These are two separate UI regions — the paragraph is a prose description, the grid is a structured metric block. The PRD acceptance criterion references the text "15 road wheels · 13 filter axes" (with `·` separator) which does not literally appear anywhere in the current DOM; the prose paragraph uses a comma separator ("15 road wheels, 13 filter axes"). This suggests the stat line that must appear exactly once is the structured numeric grid (the "15 / 13 / 3" block), and the issue being fixed is a duplicate rendering of that block somewhere. However, reading the code carefully, there is no second render of the stats grid in `Hero.jsx` itself. The duplication must come from `Landing.jsx` or from the Hero being mounted twice — or from a literal copy-paste in the JSX that was not visible in the current file but existed in a previous version. **Interpretation chosen:** the task is to audit and confirm the Hero stat line is rendered exactly once. The stat grid (the 3-column numeric block starting at line 24 of `Hero.jsx`) is the canonical location of the "15 road wheels · 13 filter axes" count. If the current code already shows only one instance, the task reduces to adding an automated assertion that guards against future regression. The task file will describe both the audit step and the test.

### FR-002 — FilterPanel / ComparisonTable vertical alignment

In `MiniComparator.jsx`, the grid column for ComparisonTable has a child structure: a `div.min-w-0` wrapping a `div.flex.justify-end.mb-3` (the ColumnSelector row) above `ComparisonTable`. The `mb-3` (12px margin-bottom) on the ColumnSelector row pushes `ComparisonTable` down by 12px relative to the top of the grid cell. `FilterPanel` sits in the adjacent grid cell with no similar top offset. The fix is to align both columns to the same top edge. The chosen approach is to apply `self-start` to both grid children (so they align to the grid cell's top rather than stretching), and absorb the ColumnSelector button's vertical space without shifting the ComparisonTable down. The mechanism: wrap the ComparisonTable column content so that the ColumnSelector button does not consume layout space that affects the ComparisonTable's top position. Concretely, position the ColumnSelector button absolutely within its column, or give the ComparisonTable column a `flex-col` structure where the ColumnSelector occupies a fixed-height header row that is exactly matched by padding on the FilterPanel column.

**Decision (AD-002):** Add a top padding to the FilterPanel card equal to the height consumed by the ColumnSelector row in the ComparisonTable column, so both columns have their content start at the same visual top edge. Padding value: the ColumnSelector row is `py-2` (8px top + 8px bottom) + button height ~36px + `mb-3` (12px) = ~56px total. This approach introduces a magic number. Alternative: use a shared alignment technique via CSS. **Revised decision:** Use CSS grid alignment. The `lg:grid-cols-[320px_1fr]` grid in MiniComparator currently has no explicit `items` alignment. Adding `items-start` to the grid wrapper ensures both columns align to the grid top. Then, to compensate for the ColumnSelector row above the table, place the ColumnSelector button inside a `flex` wrapper that spans both columns, or — simpler — add a matching `pt` (padding-top) to the FilterPanel container that equals the total height of the ColumnSelector row. The cleanest approach is: make the ColumnSelector row into a sticky header bar spanning only its column (the right column), and simultaneously give the FilterPanel the same top padding. **Final decision:** The FilterPanel's `aside` already has `lg:sticky` with `top: var(--navbar-height)`. The grid container gap is `gap-6` (24px). The task is to add `items-start` to the grid wrapper and add a `pt-[56px]` (or the exact measured height) to the FilterPanel, OR to move the ColumnSelector outside the grid right column. The cleanest architectural fix is to give the `div.min-w-0` (right column) a `flex flex-col` structure and pull the ColumnSelector row height from the layout by giving the FilterPanel the same top offset. **Settled final decision for TASK-002:** Add `items-start` to the grid wrapper class, and add padding-top to the FilterPanel outer wrapper (`div.px-4.py-4.lg:p-0`) in `MiniComparator.jsx` to match the ColumnSelector row height. The ColumnSelector button is `py-2 text-sm` = ~36px height + `mb-3` = 12px = 48px total. Use `lg:pt-[48px]` on the FilterPanel wrapper div. This is a direct layout fix — no structural refactor. The exact value will be determined by measuring in implementation, but the mechanism is specified.

### FR-003 — ColumnSelector button hover transition

In `ColumnSelector.jsx`, the button already has `hover:bg-ink-2/60 transition-colors` in its className. The `transition-colors` class applies a CSS transition to color properties. However, comparing with `btn-primary`, `btn-ghost`, and `btn-outline` in `index.css`, those classes use an explicit `transition` property listing `color`, `background-color`, and `border-color` with `var(--duration-quick) var(--ease-standard)`. The ColumnSelector button's `transition-colors` uses Tailwind's default transition duration (150ms) and a cubic-bezier that differs from `var(--ease-standard)`. The fix is to replace `transition-colors` with the explicit transition style matching the design system, using either a `style` prop or adding a utility class.

**Decision (AD-003):** Replace `transition-colors` on the ColumnSelector button with an inline `style` prop:
```
style={{ transition: 'color var(--duration-quick) var(--ease-standard), background-color var(--duration-quick) var(--ease-standard), border-color var(--duration-quick) var(--ease-standard)' }}
```
This is consistent with how `btn-primary`, `btn-ghost`, and `btn-outline` are implemented in `index.css`. Alternatively, apply the `btn-outline` class and remove the duplicate Tailwind classes. However, the ColumnSelector button has specific sizing (`px-3 py-2`) and doesn't map 1:1 to `btn-outline` (`px-5 py-2.5`). The inline style approach is the minimal targeted fix.

### FR-004 — Wheel detail drawer bottom separator

In `ComparisonTable.jsx`, each row is a `<tr>` with `style={{ borderBottom: '1px solid var(--rule-faint)' }}`. When `expandedId === w.id`, a detail row is inserted immediately after. The detail panel (`WheelDetailPanel.jsx`) has `border-t border-ink-3` on its outer div, which creates a top separator on the drawer. There is currently no visual separator at the **bottom** of the open drawer. The next wheel card row in the table will have its standard `border-bottom` which functions as a separator, but the WheelDetailPanel itself has no `border-bottom`. The fix is to add a `border-b border-ink-4` (or equivalent DS token) to the `WheelDetailPanel` outer div, or to the `<td>` wrapping it. This creates a clear visual bottom boundary of the drawer.

**Decision (AD-004):** Add `border-b border-ink-4` to the `WheelDetailPanel` outer div (`className` in `WheelDetailPanel.jsx`). This uses an existing DS token. No new pattern is introduced. The last wheel in the list will also get a bottom border, but this is acceptable since the card ends visually there regardless.

### FR-005 & FR-006 — Logo SVG assets in Navbar and Footer

**Navbar (`Navbar.jsx`):** The logo is currently produced by hardcoded markup: a `div` with a brass background and the letter "M", plus a `<span>` with "My**Bike**Lab" text. The fix is to replace this with an `<img>` tag referencing `logo-wordmark.svg`. The asset lives at `design-system/assets/logo-wordmark.svg`. In Vite, static assets in `public/` are served at the root path. Assets outside `public/` must be imported. Since the design system assets are at `MyBikeLab/design-system/assets/`, they are not under the frontend `public/` folder. **Decision:** Import the SVG as a module using Vite's asset import (`import logoWordmark from '../../../design-system/assets/logo-wordmark.svg'`), then render `<img src={logoWordmark} alt="MyBikeLab" />`. This is consistent with Vite's static asset handling and does not require copying files.

**Footer (`Footer.jsx`):** Same approach. Import `logo-mark.svg` and replace the hardcoded `div + span` logo markup with `<img src={logoMark} alt="MyBikeLab" />`.

**Decision (AD-005):** Both Navbar and Footer import their respective SVGs via Vite module import. The `alt` text for the wordmark logo is "MyBikeLab" (accessible name). The `alt` text for the mark logo is "MyBikeLab" (same brand identity; the mark is decorative in the footer but still needs an alt for accessibility). The `<img>` element sizing will use the existing `h-7`/`h-8` class to constrain height while `w-auto` preserves aspect ratio.

---

## Architecture decision rationale

### AD-001 — No shared logo component

The Navbar uses `logo-wordmark.svg` and the Footer uses `logo-mark.svg`. These are different assets with different use contexts. A shared `<Logo>` component would require a `variant` prop to select between them. Given there are only two callsites and the assets differ, a shared component adds abstraction with no reuse benefit. Each component imports its own asset directly.

### AD-002 — Layout fix via padding compensation on FilterPanel

Using `items-start` on the grid wrapper alone would misalign the cards because FilterPanel uses `h-fit lg:sticky`. A purely CSS-flexbox approach (matching a header row height via padding) is chosen over absolute positioning of the ColumnSelector, which would require the column to have `relative` positioning and could interfere with the dropdown z-index. The padding-top approach is explicit and auditable.

### AD-003 — Inline style for ColumnSelector transition

Tailwind's `transition-colors` resolves to `transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms`. This diverges from `var(--ease-standard)` (cubic-bezier(0.2, 0.0, 0.0, 1.0)) and `var(--duration-quick)` (140ms). The existing design system buttons in `index.css` all use inline `style` props for this transition, so using the same inline style is the consistent approach.

### AD-004 — Border-b on WheelDetailPanel

The alternative was to add a bottom border on the `<tr>` that wraps `WheelDetailPanel`. This was rejected because `<tr>` border-bottom applies to the `<tr>` element, not to the visual bottom of the panel's content. Adding it directly to the panel's outer div is the semantically correct location and ensures the border is always rendered at the visual bottom of the expanded content, regardless of table row structure.

### AD-005 — Vitest-only test environment (no @testing-library)

The project's test setup (`vitest` in `node` environment) does not include `@testing-library/react` or `@testing-library/dom`. The vite config confirms a `node` test environment. Automated tests for DOM-level assertions (AC-001 — stat line count, AC-005 — Navbar logo src, AC-006 — Footer logo src) cannot use DOM rendering. These tests will be written as **unit tests that assert against the JSX structure statically** (e.g., inspecting component output using React's test renderer or asserting against component source patterns). For AC-002 (pixel alignment), the PRD marks this as also "Manual" — only a manual test is required, no automated test is specified for the pixel measurement in the current tooling. If `@testing-library/react` is added in the future, these tests should be upgraded.

**Open question OQ-001:** Should `@testing-library/react` be added as a dev dependency to enable proper DOM assertions? This is not in scope for EVO-017 — the test tasks are scoped to what is achievable with the current Vitest node environment.

---

## Tradeoffs

### Stat line duplication (FR-001)

Tradeoff: remove the prose paragraph referencing the counts vs. removing the stat grid block. The stat grid is the more prominent and user-meaningful element. The prose paragraph provides context for new visitors. The stat grid is the "stat line" referenced in the PRD ("15 road wheels · 13 filter axes"). If the implementation shows the current code only has one instance, the task scope is reduced to adding a non-regression test and auditing the rendered output.

### Logo SVG import strategy

Alternative 1: Copy SVG files to `frontend/public/` and reference via root-relative path. Rejected: introduces a maintenance concern (two copies of the assets to keep in sync).

Alternative 2: Inline SVG content directly in JSX. Rejected: this is "hardcoded markup", which the PRD explicitly prohibits.

Alternative 3: Use Vite's `?raw` import to inline at build time. Rejected: the `?raw` import returns a string, requiring `dangerouslySetInnerHTML` or an SVG wrapper component. More complex than a simple `<img>` with no benefit at this scale.

### ColumnSelector hover fix

Alternative: add `.btn-outline` class and adjust padding separately. Rejected because the button's padding (`px-3 py-2`) is smaller than `btn-outline` (`px-5 py-2.5`) and resizing it would be a layout change beyond the scope of the transition fix.

---

## Open questions

### OQ-001 — Testing library
No `@testing-library/react` is installed. Automated tests for AC-001, AC-005, AC-006 that require DOM rendering must either use React's `react-dom/test-utils` or be written as snapshot/static analysis tests. The implementation agent should document which approach is used and note that these tests should be upgraded when `@testing-library/react` is added.

### OQ-002 — FilterPanel top padding exact value
The ColumnSelector row height in `MiniComparator.jsx` is `mb-3` (12px) + button height. The button is `py-2` (8px top + 8px bottom) + text height (~20px for `text-sm` at 1.25 line height) = ~36px button height. Total: 12px + 36px = 48px. The implementation agent should measure the actual rendered height of the ColumnSelector row and use the exact pixel value via `lg:pt-[Npx]` on the FilterPanel wrapper.

### OQ-003 — Last wheel drawer bottom separator
The PRD states no separator is required when the drawer belongs to the last wheel. Since `border-b border-ink-4` on the panel will always render, it will appear even for the last wheel. This is visually harmless (the table has its own bottom border from the `.card` class's `border`), but if the designer considers it incorrect, the implementation should conditionally apply the border. The PRD error case states "no separator below the drawer is required" — the word "required" is permissive, meaning the separator may still appear without being incorrect. **Interpretation:** adding `border-b` unconditionally is acceptable.

### OQ-004 — Logo sizing
The Navbar's current hardcoded logo uses `h-8 w-8` for the mark box and a `text-lg font-semibold` span. `logo-wordmark.svg` will replace both elements. The correct height class for the `<img>` should be determined by the designer — `h-8` (32px) is the proposed default. Similarly, the Footer mark currently uses `h-7 w-7`. The `<img>` should use `h-7` with `w-auto`.
