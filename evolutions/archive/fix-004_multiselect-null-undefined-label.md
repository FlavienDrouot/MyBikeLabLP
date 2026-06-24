# Fix: Multiselect filter label for null/undefined values

- **ID:** fix-004
- **Date:** 2026-06-02
- **Status:** Done

---

## Context & Need

Dans les filtres multi-select, les options représentant des roues sans valeur définie (`null`, `undefined`, ou `""`) affichent soit un libellé vide `(N)`, soit une clé de traduction cassée (ex. `spokeMaterial.undefined (N)`). La clé `common.notAvailable` existe déjà dans les fichiers i18n mais vaut "N/A" en anglais — incohérent avec le libellé souhaité. Le comportement doit être unifié pour tous les filtres multi-select.

---

## Acceptance Criteria

- [ ] Toute option multi-select dont la valeur est `null`, `undefined` ou `""` affiche "Unknown" (EN) / "Inconnu" (FR)
- [ ] Ce libellé passe par la clé i18n `common.notAvailable`, partagée avec les cellules du tableau
- [ ] La valeur EN de `common.notAvailable` passe de "N/A" à "Unknown"
- [ ] Le comportement est identique dans `LargeMultiSelectFilter` et `MultiSelectFilter`

---

## Technical Tasks

### Task 1 — Correction du calcul de optLabel dans FilterPanel.jsx

**Files:** `frontend/src/components/MiniComparator/FilterPanel.jsx`

**What to do:** Aux lignes 310 et 374, remplacer le calcul de `optLabel` pour intercepter les valeurs absentes (`null`, `undefined`, `""`) avant d'appeler `t()` ou `String()`, et retourner `t('common.notAvailable')` à la place.

Nouveau calcul (identique dans les deux composants) :
```js
const isAbsent = opt === null || opt === undefined || opt === '';
const optLabel = isAbsent
  ? t('common.notAvailable')
  : property.translatable
  ? t(`${property.id}.${opt}`)
  : String(opt);
```

**Validation:** Une option sans valeur affiche "Unknown (N)" en EN et "Inconnu (N)" en FR, sans clé cassée.

---

### Task 2 — Mise à jour de la traduction EN

**Files:** `frontend/public/locales/en.json`

**What to do:** Changer `"notAvailable": "N/A"` → `"notAvailable": "Unknown"`.

**Validation:** Les filtres et les cellules de tableau affichent "Unknown" en EN, "Inconnu" en FR.

---

## Implementation Notes

### Task 1
- Ajout de `isAbsent` (guard sur `null`, `undefined`, `""`) dans `LargeMultiSelectFilter` (l. 310) et `MultiSelectFilter` (l. 374)
- `optLabel` retourne `t('common.notAvailable')` pour toute valeur absente, avant de tenter `t()` ou `String()`

### Task 2
- `en.json` : `"notAvailable": "N/A"` → `"notAvailable": "Unknown"`
- `fr.json` était déjà `"Inconnu"` — aucune modification
