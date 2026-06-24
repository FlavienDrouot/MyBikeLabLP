# TASK-001 — Add `hero.eyebrow` i18n key to EN and FR locale files

## Objective

Add a new translation key `hero.eyebrow` to both locale files (`en.json` and `fr.json`). This key will be consumed by `Hero.jsx` in TASK-002 to render the eyebrow label above the hero headline. The eyebrow must be a descriptive verb-noun label — not a numeric section index.

## Required context

- Translation files live at `frontend/public/locales/en.json` and `frontend/public/locales/fr.json`.
- The existing `hero` object in both files contains: `titleBefore`, `titleEmphasis`, `titleAfter`, `subtitle`, `ctaPrimary`, `ctaSecondary`, `stats`.
- The new key `hero.eyebrow` must be inserted inside the existing `"hero"` object.
- Design system rule (from `shared-knowledge/ui-guidelines.md`): eyebrow labels must be descriptive verb-noun text — no numeric patterns like `01 / 03`, `№ 01`, or `Step 01` are permitted.
- Design system rule: no exclamation marks, no em-dashes, no en-dashes as separators in any copy.

## Potentially impacted files

- `frontend/public/locales/en.json`
- `frontend/public/locales/fr.json`

## Inputs

- EN eyebrow value: `"Compare road wheels"` (matches the design system landing kit reference in `design-system/ui_kits/landing/Hero.jsx`)
- FR eyebrow value: `"Comparez les roues route"`

## Expected outputs

- `en.json`: the `"hero"` object contains a new entry `"eyebrow": "Compare road wheels"`
- `fr.json`: the `"hero"` object contains a new entry `"eyebrow": "Comparez les roues route"`
- Both files remain valid JSON.
- No other keys in either file are modified.

## Constraints

- Insert the new key immediately after `"titleAfter"` and before `"subtitle"` in the `"hero"` object, to keep the logical order of keys consistent between files.
- The key name is exactly `eyebrow` (no prefix, no suffix).
- Voice rules: sentence case for the eyebrow value is acceptable here (the `.t-eyebrow` CSS class applies `text-transform: uppercase` at render time). The stored string should be in sentence case: `"Compare road wheels"`, not `"COMPARE ROAD WHEELS"`.

## Dependencies

none

## Validation criteria

- [ ] `en.json` is valid JSON (parseable by `JSON.parse`).
- [ ] `fr.json` is valid JSON (parseable by `JSON.parse`).
- [ ] `t('hero.eyebrow')` returns `"Compare road wheels"` when the active locale is `en`.
- [ ] `t('hero.eyebrow')` returns `"Comparez les roues route"` when the active locale is `fr`.
- [ ] The new key contains no em-dash, en-dash, or exclamation mark.
- [ ] The new key does not contain any numeric index pattern.

## Tests to implement

### Unit
- None required (JSON key addition; validated by JSON.parse and visual inspection).

### Integration
- After TASK-002 is complete: load the landing page in EN locale and confirm the Hero eyebrow renders "COMPARE ROAD WHEELS" (uppercase via CSS). Load in FR locale and confirm "COMPAREZ LES ROUES ROUTE".
