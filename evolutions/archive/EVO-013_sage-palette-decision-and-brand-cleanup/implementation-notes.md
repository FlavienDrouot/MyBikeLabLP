# Implementation Notes — EVO-013

---

## TASK-001 — Grep confirmation: brand-* status

**Result:** Zero `brand-` matches across all 30 source files in `frontend/src/` (`.js`, `.jsx`, `.ts`, `.tsx`, `.css`, `.html`). TASK-002 proceeded unconditionally.

**Finding:** `tailwind.config.js` itself contained no `brand-*` block — the palette had already been removed from the config prior to this evolution. The init.md audit referenced an older state of the file. No code change was required in TASK-002 for the config itself.

---

## TASK-002 — Delete brand-* from tailwind.config.js

**tailwind.config.js:** No change required — the `brand-*` block and "RETIRED" comment were already absent.

**README.md (OQ-001 fix):**
- Before: `` - Tailwind tokens: `brand-*` (blue), `ink-*` (neutral); shared classes in `src/index.css` ``
- After: `` - Tailwind tokens: `paper-*`, `ink-*`, `brass-*`, `sage-*`; shared classes in `src/index.css` ``

Location: `MyBikeLab/README.md`, conventions section.

---

## TASK-003 — Apply sage tokens in PartnershipSection

**File modified:** `frontend/src/components/PartnershipSection.jsx`

**Change 1 — Audience tile borders and background:**
- `border border-paper-1/10 bg-paper-1/5` → `border border-sage-4/40 bg-sage-1/10`
- Tile border replaced (not supplemented) with `border-sage-4/40` — supplementing would produce a dead class since only one border-color utility wins.
- `bg-paper-1/5` replaced by `bg-sage-1/10` — opacity raised slightly from `/5` to `/10` because `sage-1` needs more presence than `paper-1` to register on the near-black `ink-12` background.

**Change 2 — Mobile separator above contact form:**
- Added: `<div className="lg:hidden border-t border-sage-3/30 mb-8" />`
- Renders only on mobile (`lg:hidden`) where vertical stacking removes inherent column separation.
- `sage-3/30` — lighter than the tile border to communicate structure without competing with content.

**Opacity values:** Not prescribed by spec — judgment call. `/40` on tile border is strong enough to read as intentional; `/10` on tile fill is subordinate to the border; `/30` on the rule is a hairline.

**Deviations:** None.

---

## TASK-004 — UC-002 Vacancy Note

No muted-status badge component exists in the current codebase.

UC-002 is vacuous: the use case describes applying sage muted-status color to a badge component that does not exist.

AC-001 is satisfied by the PartnershipSection sage application (TASK-003) alone.

Creating a muted-status badge component is out of scope for EVO-013. If such a component is introduced in a future evolution, sage muted-status tokens should be applied at that time.

---

## Build check

`npm run build` in `frontend/` — exit code 0, no Tailwind warnings, 948ms. All sage classes resolved correctly.
