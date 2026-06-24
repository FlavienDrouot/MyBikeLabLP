# Technical Specifications

## 1. General Information

- **Evolution ID:** EVO-002
- **PRD reference:** `prd.md`
- **Author:** Flavien Drouot
- **Date:** 2026-05-25

---

## 2. Technical Context

### Technical objective

Extend `tailwind.config.js` with the three color tokens currently missing from the theme but used in first-party components (`ink-200`, `ink-400`, `brand-200`), and produce a token naming convention document that makes the full vocabulary unambiguous for developers and AI agents.

The codebase already contains no arbitrary color, typography, or spacing values (no `[...]` Tailwind syntax for design values). The migration work is therefore additive to `tailwind.config.js`, not a sweep of component files.

### Affected architecture

- `frontend/tailwind.config.js` — receives 3 new color token definitions
- `frontend/src/components/MiniComparator/FilterPanel.module.css` — acknowledged exception: hardcoded hex values for CSS pseudo-element targeting (no Tailwind class equivalent possible); documented as accepted exception
- New convention document: `MyBikeLab/evolutions/EVO-002_design-token-refactoring/token-convention.md`

### Impacted modules

- `tailwind.config.js` (new token definitions)
- None of the JSX/TSX/CSS component files require modification

---

## 3. Technical Constraints

- Tailwind CSS 3 must not be replaced or removed.
- All existing token definitions in `tailwind.config.js` (`brand-*`, `ink-*`, `fontFamily.sans`) must be preserved and extended consistently.
- Color token values must maintain visual continuity with the existing scale (brand-* follows Tailwind's `blue` scale, ink-* follows Tailwind's `slate` scale).
- The `.module.css` file may not use Tailwind `@apply` inside pseudo-element rules — raw CSS hex values remain as the only viable approach there.
- No component logic, layout, or JSX structure may be altered.

---

## 4. Architecture Decisions

### AD-001 — Extend colors only; typography and spacing require no new tokens

#### Description
Only the `colors` section of `tailwind.config.js` receives new entries. No `fontSize`, `spacing`, or other extension keys are added.

#### Motivation
Audit of all first-party `src/` files found zero instances of arbitrary Tailwind typography values (`text-[14px]`, `leading-[1.6]`, etc.) or arbitrary spacing values (`p-[24px]`, `gap-[1.5rem]`, etc.). All typography classes in use (`text-sm`, `text-base`, `font-semibold`, `tracking-tight`, etc.) are Tailwind's built-in named classes, which already satisfy FR-002 and FR-003. Adding custom tokens for values already covered by the default scale would require renaming every class reference across all components — a change far exceeding the PRD scope with no compliance benefit.

#### Rejected alternatives
- Defining a full custom typography scale (`font-size-sm`, `font-size-base`, etc.) and replacing all built-in references: rejected because (a) it modifies component files unnecessarily, (b) the PRD's acceptance criteria target only `[...]` syntax, and (c) Tailwind's default named classes already satisfy the "no arbitrary values" requirement.

---

### AD-002 — FilterPanel.module.css hex values are an accepted exception

#### Description
`FilterPanel.module.css` contains three raw hex values targeting CSS pseudo-elements (`::-webkit-slider-thumb`, `::-moz-range-thumb`, `.track`, `.range`). These are not modified as part of this evolution.

#### Motivation
Tailwind utility classes cannot target CSS pseudo-elements. The file's opening comment (`/* Tailwind cannot target pseudo-elements of range inputs */`) documents this constraint. The PRD's FR-001 prohibition targets "arbitrary color notation" in Tailwind class strings — raw CSS properties in `.module.css` files fall outside this scope. The acceptance criteria (AC-001) specifies a grep search for `bg-[`, `text-[`, etc., which would not match plain CSS hex declarations. Adding CSS custom properties or a JS-injected style approach would introduce scope and complexity beyond the PRD.

Each hex value in the file corresponds to a token:
- `#2563eb` → `brand-600`
- `#e2e8f0` → `ink-200` (added by TASK-001)

These correspondences are documented inline via code comments (added in TASK-001).

#### Rejected alternatives
- CSS custom properties (`var(--color-brand-600)`): requires a new CSS variable layer and a build-time injection mechanism — out of scope.
- Moving pseudo-element styles to a PostCSS plugin: overly complex for 4 declarations.

---

### AD-003 — Layout arbitrary values are explicitly out of scope

#### Description
Three Tailwind arbitrary value occurrences are present in the codebase but are **not** addressed by this evolution:

| File | Value | Reason out of scope |
|---|---|---|
| `MiniComparator.jsx:38` | `lg:grid-cols-[320px_1fr]` | `gridTemplateColumns` key excluded by PRD |
| `MiniComparator.jsx:71` | `max-w-[85vw]` | Viewport-relative — cannot be a fixed token |
| `ColumnSelector.jsx:46` | `max-w-[calc(100vw-1rem)]` | `calc()` expression — cannot be a fixed token |

#### Motivation
The PRD explicitly limits the scope to `colors`, `fontSize`, `fontWeight`, `lineHeight`, `fontFamily`, and `spacing` keys in `tailwind.config.js`. `gridTemplateColumns` is excluded. The `85vw` and `calc(100vw-1rem)` values are responsive by nature and do not belong to a spacing scale.

---

### AD-004 — Token naming convention as a standalone document

#### Description
The token naming convention (FR-007) is produced as `token-convention.md` in the evolution folder, not as inline comments in `tailwind.config.js` alone. `tailwind.config.js` receives a reference comment pointing to the document.

#### Motivation
A standalone document can be read, linked, and consulted independently of the config file. Developers and AI agents can access it without opening a JavaScript file. The PRD allows either "a document or annotated section in tailwind.config.js" — this choice satisfies both by doing both (document + reference comment).

---

## 5. Task Breakdown

---

# TASK-001 — Add missing color tokens to tailwind.config.js

## Objective
Add three color token definitions to `tailwind.config.js` (`ink-200`, `ink-400`, `brand-200`) and annotate `FilterPanel.module.css` with token-correspondence comments.

## Required context
- `tailwind.config.js` currently defines `brand` (50, 100, 500, 600, 700, 900) and `ink` (100, 300, 500, 700, 900).
- brand-* mirrors Tailwind's `blue` scale; ink-* mirrors Tailwind's `slate` scale.
- Missing tokens used in component files: `ink-200` (ColumnSelector, FilterPanel.module.css track), `ink-400` (FilterPanel range separator), `brand-200` (FilterPanel active badge × icon).
- `FilterPanel.module.css` cannot use Tailwind classes for pseudo-elements — hex values stay; only add inline comments.

## Potentially impacted files
- `frontend/tailwind.config.js`
- `frontend/src/components/MiniComparator/FilterPanel.module.css`

## Inputs
- Current `tailwind.config.js` token definitions
- Hex values derived from Tailwind's blue/slate scales (consistent with existing token values)

## Expected outputs

### tailwind.config.js — colors section after change:
```js
colors: {
  brand: {
    50:  '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',  // ← new
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    900: '#0b1d3a',
  },
  ink: {
    100: '#f1f5f9',
    200: '#e2e8f0',  // ← new
    300: '#cbd5e1',
    400: '#94a3b8',  // ← new
    500: '#64748b',
    700: '#334155',
    900: '#0f172a',
  },
},
```

### FilterPanel.module.css — add token-reference comments:
Each hardcoded hex gains an inline comment identifying its token equivalent:
- `background: #2563eb; /* brand-600 */` (already present for webkit thumb)
- `background: #2563eb; /* brand-600 */` (moz thumb — add comment)
- `background: #e2e8f0; /* ink-200 */` (track — add comment)
- `background: #2563eb; /* brand-600 */` (range — add comment)

## Constraints
- Token order in each color group must remain numerically ascending.
- No component JSX/TSX files may be modified.
- Values must exactly match the Tailwind blue/slate scale to preserve visual continuity.

## Dependencies
None.

## Validation criteria
- [ ] `tailwind.config.js` contains `brand-200`, `ink-200`, `ink-400`
- [ ] Hex values match Tailwind's blue-200, slate-200, slate-400 respectively
- [ ] All previously defined tokens are still present and unchanged
- [ ] `FilterPanel.module.css` has a `/* brand-600 */` comment on all three `#2563eb` declarations
- [ ] `FilterPanel.module.css` has a `/* ink-200 */` comment on the `#e2e8f0` track declaration
- [ ] Running the app renders identically to before (no visual change expected — tokens were already in use via Tailwind's JIT resolution as unknown classes falling back to nothing, or they were genuinely missing and will now work)

## Tests to implement
### Unit
None — this is a configuration change with no JavaScript logic.

### Integration
- Manual: build the app with `npm run build` and confirm no Tailwind compilation errors.
- Manual: open the app and verify the three affected UI elements render correctly:
  - ColumnSelector dropdown border (`border-ink-200`) — visible border on the dropdown panel
  - FilterPanel range separator (`text-ink-400`) — the "—" between range input values
  - FilterPanel active badge × icon (`text-brand-200`) — the × in selected filter chips

---

# TASK-002 — Write token naming convention document

## Objective
Produce `token-convention.md` — a self-sufficient reference for the full token vocabulary, naming rules, and usage expectations. Also add a reference comment to `tailwind.config.js`.

## Required context
- The PRD requires FR-007: "A naming convention document makes the token vocabulary unambiguous for developers and AI assistants creating future components."
- FR-008: "Named tokens are the authoritative standard for all future component development. No new first-party component may introduce arbitrary color, typography, or spacing values."
- Token categories in scope: colors, fontSize, fontWeight, lineHeight, fontFamily, spacing.
- Currently only colors and fontFamily are extended in `tailwind.config.js`. Typography (fontSize, fontWeight, lineHeight) and spacing use Tailwind's built-in default scale — this must be documented so developers know which classes are valid.

## Potentially impacted files
- `MyBikeLab/evolutions/EVO-002_design-token-refactoring/token-convention.md` (new file)
- `frontend/tailwind.config.js` (add reference comment only)

## Inputs
- Final `tailwind.config.js` after TASK-001
- Tailwind CSS 3 default scale reference (for documenting the built-in named classes that are authoritative)

## Expected outputs

`token-convention.md` must cover:

1. **Purpose** — why this document exists; that it is the authoritative reference
2. **Colors** — full token list for `brand-*` and `ink-*` with hex values, scale position, and intended semantic usage
3. **Typography** — which Tailwind built-in classes are authorized (font size: `text-xs` through `text-6xl`; font weight: `font-medium`, `font-semibold`, `font-bold`; tracking: `tracking-tight`, `tracking-wide`, `tracking-wider`; font family: `font-sans`)
4. **Spacing** — statement that Tailwind's default spacing scale is authoritative (no custom tokens); list of commonly used values in this codebase
5. **Layout arbitrary values — accepted exceptions** — document the three out-of-scope arbitrary values with rationale
6. **CSS module exception** — document `FilterPanel.module.css` as the one accepted case of raw hex values
7. **Rules for new components** — explicit prohibition on introducing arbitrary values; procedure when a missing token is needed (add to tailwind.config.js + update this document)

`tailwind.config.js` reference comment:
```js
// Token naming convention: evolutions/EVO-002_design-token-refactoring/token-convention.md
```

## Constraints
- The document must be usable without prior codebase knowledge.
- It must be written in English.
- It must be complete enough that an AI agent can apply all token names without ambiguity or inference.

## Dependencies
- TASK-001 must be complete (final token list is needed to document colors accurately).

## Validation criteria
- [ ] `token-convention.md` exists and covers all 7 sections listed above
- [ ] Every token in `tailwind.config.js` is listed with its hex value
- [ ] Typography and spacing sections clearly state which built-in Tailwind classes are authoritative
- [ ] The three layout exceptions are listed with their rationale
- [ ] The `FilterPanel.module.css` exception is documented
- [ ] The "rules for new components" section is unambiguous
- [ ] A reference comment appears in `tailwind.config.js`

## Tests to implement
### Unit
None.

### Integration
- Manual review: a person unfamiliar with the project can name the correct token for any color, typography, or spacing value used in an existing component, using only this document.

---

# TASK-003 — Compliance verification audit

## Objective
Run and document the grep-based audit that confirms zero arbitrary color, typography, and spacing values remain in `src/` after TASK-001. Produce the audit script as a reusable shell command.

## Required context
- PRD acceptance criteria AC-001, AC-002, AC-003 define the exact patterns to search.
- The current codebase is already clean — this task confirms compliance and creates a repeatable verification command.
- The audit must distinguish between in-scope arbitrary values (colors, typography, spacing) and accepted out-of-scope layout values.

## Potentially impacted files
- No source files are modified.
- A verification command is documented in `token-convention.md` (added to TASK-002's output).

## Inputs
- `src/` directory
- AC-001, AC-002, AC-003 pattern lists from `prd.md`

## Expected outputs

The following PowerShell command (or equivalent) is run from `frontend/` and must return zero matches for in-scope arbitrary values:

```powershell
# AC-001: arbitrary colors
Select-String -Path "src/**/*.jsx","src/**/*.tsx","src/**/*.css" -Pattern "(bg|text|border|fill|stroke|ring)-\[" -Recurse

# AC-002: arbitrary typography
Select-String -Path "src/**/*.jsx","src/**/*.tsx","src/**/*.css" -Pattern "(text|leading|tracking|font)-\[" -Recurse

# AC-003: arbitrary spacing
Select-String -Path "src/**/*.jsx","src/**/*.tsx","src/**/*.css" -Pattern "(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|space-x|space-y)-\[" -Recurse
```

Known accepted results that will appear (not violations):
- `max-w-[85vw]` in MiniComparator.jsx — out-of-scope layout value
- `max-w-[calc(100vw-1rem)]` in ColumnSelector.jsx — out-of-scope layout value
- `lg:grid-cols-[320px_1fr]` in MiniComparator.jsx — out-of-scope layout value

## Constraints
- Do not modify any source file to suppress audit matches — only layout/grid values should remain.
- Results must be interpreted against the known accepted exceptions list.

## Dependencies
- TASK-001 must be complete.

## Validation criteria
- [ ] Audit commands run without errors
- [ ] Zero matches for in-scope color arbitrary values
- [ ] Zero matches for in-scope typography arbitrary values
- [ ] Zero matches for in-scope spacing arbitrary values
- [ ] Remaining matches (if any) are exclusively the three accepted layout exceptions
- [ ] Audit command is documented in `token-convention.md`

## Tests to implement
### Unit
None.

### Integration
None beyond running the audit commands.

---

## 6. Global Validation Strategy

### Unit validation
No unit tests required — this evolution contains only configuration and documentation changes.

### Integration validation
- Build the application (`npm run build`) after TASK-001 and confirm no Tailwind compilation warnings or errors.
- Verify the three affected UI elements render correctly after adding the three missing tokens (see TASK-001 validation criteria).

### Functional validation
- AC-004: Side-by-side visual review of all landing page sections (Hero, MiniComparator, Roadmap, Benefits, Partnership, Footer) before and after TASK-001.
- AC-005: Diff review confirming only `tailwind.config.js` and `FilterPanel.module.css` (comments only) were modified.
- AC-006: `git diff --name-only` confirms only allowed files were touched.
- AC-007: Manual review of `token-convention.md` for completeness and self-sufficiency.

### Non-regression validation
- All Wheel Comparator interactions (filtering, sorting, column visibility) remain fully operational.
- Landing page renders correctly on desktop and mobile viewports.
- The existing `brand-*` and `ink-*` tokens are unchanged and continue to resolve correctly.

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| `ink-200`, `ink-400`, `brand-200` were silently failing (Tailwind JIT generating no CSS for undefined tokens) — adding them may change rendered output | Low | Visual review before/after is mandatory (AC-004). Expected result: the three elements become visible/correctly colored where they were previously invisible or fallback. |
| `tailwind.config.js` syntax error | High — breaks the entire build | Review the file after edit; run `npm run build` as first validation step. |
| Token convention document is incomplete for future AI agents | Medium — leads to new arbitrary values being introduced | Peer review of the document for ambiguity before closing the evolution. |

---

## 8. Rollback Plan

- TASK-001 is a pure addition to `tailwind.config.js`. Rollback = remove the three new token entries. No component files were modified, so no component-level rollback is needed.
- TASK-002 and TASK-003 produce only documentation files. Rollback = delete those files.
- Git: `git revert` on the commit(s) covering this evolution is sufficient.
