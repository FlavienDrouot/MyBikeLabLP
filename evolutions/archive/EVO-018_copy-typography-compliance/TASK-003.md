# TASK-003 — RoadmapSection.jsx: fix eyebrow, sentence-case phase titles

## Objective

Edit `RoadmapSection.jsx` to apply two text-only changes: (1) remove the `№ 03 ·` numeric prefix from the section eyebrow, (2) convert the three roadmap phase `title` strings in the `phases` data array from title case to sentence case. No other text in this file is changed.

## Required context

- File path: `MyBikeLab/frontend/src/components/RoadmapSection.jsx`
- The `phases` array is a module-level constant (lines 1–26). Its `title` field is rendered inside `<h3>` elements in the component's JSX.
- The `t-section-index` CSS class on the eyebrow `<p>` element must be preserved; only the text content changes.
- FR-002 prohibits the `№ 0N ·` numeric prefix on section eyebrows.
- FR-004 requires sentence case for all roadmap phase titles: only the first word and proper nouns are capitalised. No word beyond the first should be capitalised unless it is a proper noun.
- The `tag` field (`Phase 1`, `Phase 2`, `Phase 3`), `status` field, `description` field, and `points` array items are **not in scope** — do not modify them.

## Potentially impacted files

- `MyBikeLab/frontend/src/components/RoadmapSection.jsx` (only)

## Inputs

Text nodes to change:

**Change 1 — Section eyebrow (line 33):**
```
№ 03 · ROADMAP
```
becomes:
```
ROADMAP
```

**Change 2 — Phase 1 title (line 6):**
```
Components Comparison
```
becomes:
```
Components comparison
```

**Change 3 — Phase 2 title (line 13):**
```
Impact Simulator
```
becomes:
```
Impact simulator
```

**Change 4 — Phase 3 title (line 21):**
```
Full Bike Configurator
```
becomes:
```
Full bike configurator
```

## Expected outputs

After the edit:

- Eyebrow `<p className="t-section-index">` contains exactly: `ROADMAP`
- `phases[0].title` is exactly: `Components comparison`
- `phases[1].title` is exactly: `Impact simulator`
- `phases[2].title` is exactly: `Full bike configurator`

No other field in the `phases` array changes. All surrounding markup, classNames, imports, and logic are preserved exactly.

## Constraints

- The `t-section-index` class is retained on the eyebrow element.
- Sentence case rule: first word capitalised, all subsequent words lowercase unless they are proper nouns. "Components", "Impact", "Full", "Bike", "Configurator", "Simulator" are common nouns — they are lowercased.
- The `tag`, `status`, `description`, and `points` fields in each phase object are not modified.
- The section `<h2>` (`Three phases`) and `section-subtitle` paragraph are not modified.
- No markup, className, import, or logic change is permitted.
- UI guideline (Forbidden Patterns): section-index numeric prefix banned. Title case for card/phase headings banned per FR-004.

## Dependencies

none

## Validation criteria

- [ ] The eyebrow `<p className="t-section-index">` reads exactly: `ROADMAP`
- [ ] `phases[0].title` reads exactly: `Components comparison`
- [ ] `phases[1].title` reads exactly: `Impact simulator`
- [ ] `phases[2].title` reads exactly: `Full bike configurator`
- [ ] The `t-section-index` class is still present on the eyebrow element.
- [ ] All `tag`, `status`, `description`, and `points` fields are unchanged.
- [ ] The `<h2>` (`Three phases`) and subtitle paragraph are unchanged.
- [ ] No markup, class, import, or logic has changed.
- [ ] Rendered phase titles display in sentence case on both desktop and mobile viewports without unexpected wrapping.

## Tests to implement

### Unit
- None required (static data, no logic).

### Integration
- None required (no data flow affected).
