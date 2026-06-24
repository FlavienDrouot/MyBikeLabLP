# TASK-008 — Translate `ComparisonTable.jsx`, `ColumnSelector.jsx`, `badges.jsx`, and `WheelDetailPanel.jsx`

## Objective

Update the four remaining MiniComparator sub-files to resolve all user-facing strings via `useTranslation`. After TASK-004, property labels and group labels in these files are translation key strings — they must be passed through `t()`.

## Required context

- **Files**: `ComparisonTable.jsx`, `ColumnSelector.jsx`, `badges.jsx`, `WheelDetailPanel.jsx`
- **i18n**: TASK-001. Use `useTranslation` from `react-i18next`.
- **Dependency on TASK-004**: `p.label` (property label) and `group.label` (group label) are now translation key strings.
- **`badges.jsx`**: currently exports `HookBadge`, a function component that renders `'Hookless'` or `'Hooked'` as a hardcoded string. It must use `useTranslation` to resolve `badges.hookless` and `badges.hooked`.
- **`ComparisonTable.jsx`**: uses `p.label` as the `<th>` column header text. After TASK-004, this is a key and must be resolved with `t(p.label)`.
- **`ColumnSelector.jsx`**: uses `group.label` as section headers and `p.label` as checkbox labels. Both are now keys.
- **`WheelDetailPanel.jsx`**: contains multiple hardcoded English strings in section labels and link text.

### Strings to translate per file

**`ComparisonTable.jsx`**

| Location | Current string | Key |
|---|---|---|
| Table heading | `"Wheels"` (in `"Wheels — X of Y"`) | `table.heading` |
| Empty state | `"No wheels match your filters. Try resetting them."` | `table.emptyState` |
| Column header `<th>` | `{p.label}` (now a key after TASK-004) | `t(p.label)` |

Note: the `"— X of Y"` part in the heading is a range separator (not prose punctuation), rendered as:
```jsx
<span>— {wheels.length} of {total}</span>
```
The `—` here is allowed (it is a visual separator in a non-prose UI context per UI guidelines). The word `"of"` is not a standalone translation target — it is part of the count display. Translate the full pattern: store `"of"` inline or as a key `table.countOf`. Simplest approach: render `t('table.heading')` separately from the count part:
```jsx
{t('table.heading')}{' '}
<span className="text-ink-7 font-normal">
  — {wheels.length} {t('table.of')} {total}
</span>
```
Add `table.of: "of"` / `table.of: "sur"` to `en.json` / `fr.json`.

**`ColumnSelector.jsx`**

| Location | Current string | Key |
|---|---|---|
| Button label | `"Columns"` | `columnSelector.button` |
| Group header | `{group.label}` (now a key) | `t(group.label)` |
| Column checkbox label | `{p.label}` (now a key) | `t(p.label)` |

**`badges.jsx`**

| Location | Current string | Key |
|---|---|---|
| Hookless badge text | `'Hookless'` | `badges.hookless` |
| Hooked badge text | `'Hooked'` | `badges.hooked` |

**`WheelDetailPanel.jsx`**

| Location | Current string | Key |
|---|---|---|
| Manufacturer section label | `"Manufacturer"` | `wheelDetail.manufacturer` |
| Where to buy section label | `"Where to buy"` | `wheelDetail.whereToBuy` |
| Buy link text | `"Buy →"` | `wheelDetail.buyLink` |
| No links message | `"No affiliate links available for this wheel."` | `wheelDetail.noLinks` |
| Price annotation | `"indicative price, sourced 2025-Q2"` | `wheelDetail.priceAnnotation` |

Note: the price annotation also appears in `wheelProperties.jsx` inside the `price` property's `renderCell` function. That `renderCell` is JSX but defined in a non-React module. The cleanest fix: move the price annotation string out of `wheelProperties.jsx` into a separate small React component (e.g., a `PriceAnnotation` component), or use a global `i18next.t()` call (not a hook) inside `renderCell`. Use `import i18next from 'i18next';` and call `i18next.t('wheelDetail.priceAnnotation')` directly — this is the non-hook access pattern, valid for non-component contexts. Apply this change to the `renderCell` inside `wheelProperties.jsx` for the `price` property.

## Potentially impacted files

- `src/components/MiniComparator/ComparisonTable.jsx`
- `src/components/MiniComparator/ColumnSelector.jsx`
- `src/components/MiniComparator/badges.jsx`
- `src/components/MiniComparator/WheelDetailPanel.jsx`
- `src/config/wheelProperties.jsx` (price `renderCell` annotation only)
- `public/locales/en.json` (add `table.of: "of"`)
- `public/locales/fr.json` (add `table.of: "sur"`)

## Inputs

Key current code snippets:

```jsx
// ComparisonTable.jsx — table heading
<h3 className="text-base font-semibold text-ink-11">
  Wheels{' '}
  <span className="text-ink-7 font-normal">
    — {wheels.length} of {total}
  </span>
</h3>

// ComparisonTable.jsx — empty state
<div className="p-10 text-center text-ink-7 text-sm">
  No wheels match your filters. Try resetting them.
</div>

// ComparisonTable.jsx — column header
<th key={p.id} className="...">
  {p.label}   {/* now a translation key after TASK-004 */}
</th>

// ColumnSelector.jsx — button
<button>
  <Icon as={Columns2} size={16} />
  Columns
</button>

// ColumnSelector.jsx — group header
<div>{group.label}</div>  {/* now a translation key */}

// ColumnSelector.jsx — column label
{p.label}  {/* now a translation key */}

// badges.jsx
{hookless ? 'Hookless' : 'Hooked'}

// WheelDetailPanel.jsx
<p>Manufacturer</p>
<p>Where to buy</p>
<a>Buy &rarr;</a>
<p>No affiliate links available for this wheel.</p>
<span className="t-annotation">indicative price, sourced 2025-Q2</span>

// wheelProperties.jsx — price renderCell (annotation)
<span className="t-annotation block">indicative price, sourced 2025-Q2</span>
```

## Expected outputs

### `ComparisonTable.jsx`
- Add `import { useTranslation } from 'react-i18next';`
- Inside component: `const { t } = useTranslation();`
- Replace heading: `{t('table.heading')} <span>— {wheels.length} {t('table.of')} {total}</span>`
- Replace empty state: `{t('table.emptyState')}`
- Replace column header: `{t(p.label)}`

### `ColumnSelector.jsx`
- Add `import { useTranslation } from 'react-i18next';`
- Inside component: `const { t } = useTranslation();`
- Replace button label: `{t('columnSelector.button')}`
- Replace group header: `{t(group.label)}`
- Replace column checkbox label: `{t(p.label)}`

### `badges.jsx`
- Add `import { useTranslation } from 'react-i18next';`
- Inside `HookBadge`: `const { t } = useTranslation();`
- Replace: `{hookless ? t('badges.hookless') : t('badges.hooked')}`

### `WheelDetailPanel.jsx`
- Add `import { useTranslation } from 'react-i18next';`
- Inside component: `const { t } = useTranslation();`
- Replace all five strings with corresponding `t()` calls (see table above)
- The `&rarr;` HTML entity for `→` stays as-is in JSX; the surrounding text changes to `{t('wheelDetail.buyLink')}` which includes the arrow in the translation value.

### `wheelProperties.jsx` — price `renderCell`
- Add `import i18next from 'i18next';` at the top of the file (alongside existing imports)
- Replace the hardcoded string in `renderCell`:
  ```jsx
  <span className="t-annotation block">{i18next.t('wheelDetail.priceAnnotation')}</span>
  ```
  Note: `i18next.t()` is the non-hook synchronous call. It works at render time because i18next is initialized before React renders (TASK-001).

### `en.json` and `fr.json`
Add under `table`:
```json
// en.json
"table": {
  "heading": "Wheels",
  "of": "of",
  "emptyState": "No wheels match your filters. Try resetting them."
}
// fr.json
"table": {
  "heading": "Roues",
  "of": "sur",
  "emptyState": "Aucune roue ne correspond à vos filtres. Essayez de les réinitialiser."
}
```

## Constraints

- Do not change any column rendering logic, visibility logic, or table structure in `ComparisonTable.jsx`
- Do not change the `HookBadge` component's visual design (className) — only the text content changes
- Do not change the `WheelDetailPanel` layout or the buy link `href` logic
- The `i18next.t()` call in `wheelProperties.jsx` must not be imported as a hook — use the direct import `import i18next from 'i18next'`
- The `—` separator in the table heading count display remains as-is (visual separator, not prose punctuation — allowed per UI guidelines)

## Dependencies

TASK-001, TASK-002, TASK-003, TASK-004

## Validation criteria

- [ ] In French mode: column headers display in French ("Poids", "Prix", "Profil", etc.)
- [ ] In French mode: "Columns" button displays as "Colonnes"
- [ ] In French mode: column selector group headers display in French
- [ ] In French mode: column selector checkbox labels display in French
- [ ] In French mode: table heading displays "Roues — X sur Y"
- [ ] In French mode: empty state displays as "Aucune roue ne correspond à vos filtres. Essayez de les réinitialiser."
- [ ] In French mode: `HookBadge` renders "Avec crochet" for hooked wheels and "Hookless" for hookless wheels
- [ ] In French mode: WheelDetailPanel section labels, buy link, no-links message, and price annotation display in French
- [ ] In French mode: the price annotation in the comparison table's price cell ("prix indicatif, source 2025-Q2") displays in French
- [ ] All comparator interactive features work identically in both languages
- [ ] `npm run build` passes

## Tests to implement

### Unit
- None

### Integration
- Switch to French; expand a wheel row in the comparison table; verify the detail panel shows all strings in French
- Open the column selector dropdown in French; verify group labels and column labels are in French
- Verify the table heading count reads correctly in French format
