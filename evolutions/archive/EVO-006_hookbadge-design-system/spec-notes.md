# Spec Notes — EVO-006 HookBadge Design System Migration

---

## PRD Interpretations

### Hookless state: "equivalent semantic weight to the former brand-* blue palette"

The PRD asks for a color combination that carries the same semantic prominence as the retired `brand-*` blue, but does not prescribe which family to use. The brass family was chosen because:
1. It is already the primary accent/action color in the current design system — active pills, toggle switches, focus rings, and interactive buttons in `FilterPanel.jsx` all use `brass-7`/`brass-8`.
2. A light swatch (`brass-3`) paired with a dark swatch (`brass-10`) produces a warm, elevated appearance that reads as "notable" without being aggressive.
3. No other family in the current palette offers a comparable accent reading: `sage` is greenish-neutral, `ink` is explicitly neutral, `paper` is used for surfaces.

### Hooked state: "visually neutral relative to the Hookless state"

The PRD does not specify which neutral token to use. `ink-2` was chosen as the background because it is the lowest-step ink swatch that still distinguishes the pill shape from a light table-cell background (`paper-0`/`paper-1`). Using `paper-*` as a badge background was explicitly rejected — paper tokens are surface tokens, not component tokens.

### "No other file is changed"

The PRD is unambiguous on this point (FR-006, AC-009). This constraint was taken at face value: `tailwind.config.js`, `wheelProperties.jsx`, and every consuming component are all read-only for this evolution. No comment updates, no import additions, no ancillary edits.

---

## Architecture Decision Rationale

### AD-001 — Hookless state: `bg-brass-3 text-brass-10`

**Why `brass-3` as background:** The lightest usable brass swatch that is warm enough to read as "elevated" against surrounding neutral cells. `brass-1` and `brass-2` are very close to paper tones and would lose the badge definition. `brass-4` and above start to feel heavy as a static badge background.

**Why `brass-10` as text:** Provides a contrast ratio sufficient for `text-xs` text on a `brass-3` background. `brass-9` would also work; `brass-10` was preferred for a slightly crisper reading. `brass-12` was not chosen — it would make the badge feel very dark and heavy.

**Why not `brass-7`/`brass-8` as background:** Those steps are used for interactive states (active pill background, toggle on-state) — using them for a static label would blur the semantic boundary between "selected/active" and "informational".

### AD-002 — Hooked state: `bg-ink-2 text-ink-8`

**Why `ink-2` as background:** Lightest non-paper neutral. `ink-1` is too close to `paper-0` — the badge would dissolve against light card backgrounds. `ink-3` is also acceptable but `ink-2` is the minimal step and avoids over-darkening.

**Why `ink-8` as text:** Mid-dark neutral, readable on `ink-2` at small size, without adding visual weight. `ink-7` (used in `FilterPanel` section labels) would also work; `ink-8` was chosen to ensure legibility at `text-xs`. `ink-11`/`ink-12` would create a badge that reads as too heavy.

---

## Tradeoffs

### Brass vs. sage for the Hookless state

Sage was considered as an alternative accent (it has a color identity distinct from ink). It was discarded because:
- Sage is not used as an accent in any existing component — there is no established semantic precedent for it as a "notable attribute" marker.
- The cool greenish tone of sage does not carry the same sense of prominence as the warm brass.
- Brass is already the accent scale for the application; using it here maintains internal consistency.

### Using `paper-*` for the Hooked state background

`paper-1` or `paper-2` as background for the Hooked badge would make the token choice semantically clean. It was discarded because paper tokens are defined as surface tokens (page background, card background) — applying them to an inline badge blurs the token semantic and risks the pill shape dissolving against card surfaces.

### Single-task vs. multi-task breakdown

The evolution touches a single file with a two-line change. Splitting into multiple tasks (e.g., TASK-001 for Hookless, TASK-002 for Hooked) would introduce artificial dependency management with no benefit. A single atomic task maps directly to a single reviewable commit.

---

## Open Questions

None at this stage. All PRD ambiguities have been resolved by the decisions above. The implementation can begin immediately upon validation of these specs.

If the visual review step reveals that `brass-3`/`brass-10` or `ink-2`/`ink-8` do not render as expected on the actual application background, the token selection can be adjusted within the same families (e.g., shifting one step up or down on either scale) without requiring a new spec cycle — the architectural decisions (brass for Hookless, ink-neutral for Hooked) remain fixed.
