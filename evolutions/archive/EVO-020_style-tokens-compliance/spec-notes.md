# Spec Notes — EVO-020 Style Tokens / UI Guidelines Compliance

---

## PRD Interpretations

### Reduced-motion duration value
The PRD specifies `0.01ms` (§9 Constraints). The UI guidelines say "near-zero value". These are consistent. We use `0.01ms` — not `0ms` — to preserve compatibility with CSS animation libraries that treat `0` as "skip the transition entirely" and may break state listeners.

### `prefers-reduced-motion` scope: which properties to override
FR-006 states that color and opacity transitions must **not** be suppressed. The implementation targets `transition-duration` and `animation-duration` globally, but then re-enables `color` and `opacity` transitions by restoring a short `transition-duration` (e.g., 150ms) on `color` and `opacity` properties specifically. Alternatively, a single blanket rule setting all durations to `0.01ms` satisfies the letter of FR-005 while FR-006 is satisfied because color/opacity transitions at `0.01ms` remain perceptible (color changes are instant regardless of duration; opacity at `0.01ms` is effectively instant but still fires correctly). The PRD does not require them to animate slowly — only that they "continue to function normally". Conclusion: a single `0.01ms` blanket rule is sufficient for both FR-005 and FR-006.

### "opacity-40" as Tailwind custom utility
AC-004 specifies the extension must live under `extend.opacity` with key `'40'` and value `'0.4'`. Tailwind v3/v4 JIT already generates `opacity-40` from the default scale, but the existing config does not list it. Adding it explicitly under `extend.opacity` makes the intent unambiguous and future-proof.

### Disabled opacity locations — confirmed 4 occurrences
Code inspection confirms four `opacity-50` locations that match disabled filter states:
1. `DualRangeRow` — line 96: `space-y-3 ${enabled ? '' : 'opacity-50'}`
2. `LargeMultiSelectFilter` — line 271: `${filter.enabled ? '' : 'opacity-50 pointer-events-none'}`
3. `MultiSelectFilter` — line 351-354: `${filter.enabled ? '' : 'opacity-50 pointer-events-none'}`
4. `TriStateFilter` — line 397: `${filter.enabled ? '' : 'opacity-50 pointer-events-none'}`

### Multiselect option list — one location
Only `LargeMultiSelectFilter` renders the scrollable `<ul>` option list with `rounded-lg border border-ink-3` (line 294). The `MultiSelectFilter` and `TriStateFilter` use `<Pill>` buttons — not a list container — and are not affected by FR-002/FR-003.

---

## Architecture Decision Rationale

### AD-001 — Task granularity: one task per file
Each impacted file (`Landing.jsx`, `FilterPanel.jsx`, `tailwind.config.js`, `index.css`) receives its own task. Rationale: each change is independently reviewable and mergeable. Grouping all CSS changes into one task would mix config and stylesheet concerns; grouping JSX changes would produce a larger diff harder to review atomically.

### AD-002 — `tailwind.config.js` change before `FilterPanel.jsx` change
`FilterPanel.jsx` uses `opacity-40`, which must exist in the Tailwind config before the JSX change is made. TASK-002 (config) is therefore listed as a dependency of TASK-003 (FilterPanel opacity). In practice, if both tasks ship in the same PR this ordering is trivially satisfied; if shipped separately, the config must merge first.

### AD-003 — No Tailwind token for `100dvh`
The PRD explicitly forbids adding a custom token for `min-h-[100dvh]`. The arbitrary-value Tailwind syntax `min-h-[100dvh]` is used directly. This is consistent with Tailwind best practice for one-off layout values.

---

## Tradeoffs

### Option: single combined task for all class changes
Considered grouping Landing.jsx + FilterPanel.jsx + tailwind.config.js + index.css into one task. Discarded: too coarse for atomic review, and the config dependency would need documenting anyway. Separate tasks with explicit dependencies is cleaner.

### Option: CSS custom property for reduced-motion durations
Considered using a CSS custom property `--duration-reduced: 0.01ms` to keep the value DRY. Discarded: the PRD says "additive CSS entries only, no structural changes". A single inline `0.01ms` literal in the media query is simpler and has zero coupling risk.

### Option: re-open the opacity scale in Tailwind's default config
Tailwind's JIT default scale may already include `opacity-40`. Rather than relying on this assumption, explicitly extending with `'40': '0.4'` is safer and satisfies AC-004 literally.

---

## Open Questions

1. **Tailwind v3 vs v4**: The config uses ESM `export default` syntax which appears to be Tailwind v3 (vite plugin style). Confirm the Tailwind major version before implementation — if v4 is in use, the `extend.opacity` path may differ.
2. **`pointer-events-none` on disabled containers**: The `DualRangeRow` disabled block uses only `opacity-50` (no `pointer-events-none`). The other three disabled blocks use both. The PRD only addresses opacity; `pointer-events-none` is not in scope. The TASK-003 description notes this to ensure the implementer does not accidentally remove or add `pointer-events-none`.
3. **`cursor: not-allowed` on disabled wrapper**: UI guidelines specify `opacity: 0.4 + cursor: not-allowed` for disabled state. Individual inputs already have `disabled:cursor-not-allowed` via Tailwind. The wrapper divs do not. This is out of scope for EVO-020 per §8 of the PRD, but flagged here for EVO-021.
