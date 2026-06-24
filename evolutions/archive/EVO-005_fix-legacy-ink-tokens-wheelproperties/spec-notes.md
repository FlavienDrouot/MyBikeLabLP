# Spec Notes — EVO-005

## PRD interpretations

### headClassName — no action required (deviation from PRD assumption)

FR-002 states: "Any `headClassName` value must not contain legacy `ink-N00` tokens." The PRD and the preceding needs assessment both assumed some `headClassName` entries might need updating.

Direct inspection of `wheelProperties.jsx` shows that no `headClassName` value contains any `ink-N00` token. Every `headClassName` in the file is composed exclusively of standard Tailwind spacing and typography utilities: `px-4`, `py-3`, `font-semibold`, `text-right`. FR-002 is already satisfied by the current state of the file. No edit to `headClassName` is needed.

Decision: document this as AD-002 in tech-specs.md and state it explicitly as a constraint (TC-002) so the implementation agent does not waste time searching for non-existent issues or accidentally introducing changes.

### renderCell inline className values are out of scope

Three properties — `model`, `hub`, `spokes` — include `renderCell` callbacks that render a `<span className="text-ink-500 ...">` for the brand sub-label. `text-ink-500` is a current-format token (one digit, not `N00`), so it is not a legacy token. More importantly, these are `className` attributes inside JSX expressions, not `cellClassName` field values. The PRD scope (FR-001, FR-002) is explicitly limited to `cellClassName` and `headClassName` property fields. These inline tokens are out of scope regardless of their format.

Decision: called out as TC-003 in tech-specs.md and included in VC-003 as a guard condition.

### "Property definition count unchanged" (AC-004)

The PRD requires property count to be unchanged as a guard against accidental deletion. The current file has 17 entries in `WHEEL_PROPERTIES`. The grep-based check in VC-004 uses `id:` occurrences as a proxy; this is sufficient because each property entry opens with `id:` and the file contains no other `id:` keys outside those entries.

---

## Architecture decision rationale

### Single task (AD-001)

The 10 replacements are mechanically identical (one token string → another token string, all in the same file, no logic involved). Splitting them across tasks would require each task to describe partial state of the same file, which creates more complexity than it eliminates. A single atomic task matches a single atomic `git diff` and a single reviewer pass.

### No safelist change (AD-003)

Token availability in Tailwind is a build-time concern. The needs assessment confirmed `text-ink-11` is already used in the codebase, which means it is either defined in the Tailwind config or in a CSS custom property already picked up by the build. No config change is required. If this assumption turns out to be wrong, AC-006 (manual visual check) will catch it immediately.

---

## Tradeoffs

### Exact string matching vs. regex replacement

The implementation table in TASK-001 lists exact before/after strings rather than a find-replace regex. This makes the spec unambiguous: the implementer knows exactly which 10 strings to change and exactly what they become. A regex like `s/text-ink-[79]00/text-ink-11/g` would also work but requires the implementer to reason about whether it could match unintended locations. Exact strings are safer for a spec document.

### No automated test added

The change has no behavioral effect — it only affects CSS class names applied to table cells. There is no existing unit test for `wheelProperties.jsx` that would be broken, and adding a snapshot or regex test for token format would be brittle (it would fail on any future intentional token change). The grep-based validation criteria (VC-001 through VC-004) and the git diff check (VC-006) are sufficient for a change of this nature. The manual visual check (AC-006) covers the rendering outcome.

---

## Open questions

None. The scope, the affected strings, and the replacement values are fully determined by direct inspection of the source file and the PRD. No ambiguity remains.
