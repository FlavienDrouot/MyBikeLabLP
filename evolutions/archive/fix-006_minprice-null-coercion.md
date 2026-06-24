# Fix: minPrice null coercion

- **ID:** fix-006
- **Date:** 2026-06-02
- **Status:** Done

---

## Context & Need

`minPrice` calcule le prix minimum d'une roue via `Math.min(...prices.map(p => p.price_eur))`. Quand `price_eur` vaut `null` (prix inconnu), JavaScript coerce `null` en `0`, ce qui fait retourner `0` à `minPrice`. Toutes les autres propriétés numériques retournent `null` quand la donnée est absente, activant la règle "null-pass" du filtre range (une roue avec une valeur non-finie passe toujours). Le prix est le seul accesseur range qui rompt cette règle : une roue sans prix apparaît à `0 €` dans les bornes du range et peut être exclue par le filtre si l'utilisateur définit un minimum supérieur à 0.

---

## Acceptance Criteria

- [ ] `minPrice(wheel)` retourne `null` quand tous les `price_eur` du tableau `prices` sont `null`
- [ ] `minPrice(wheel)` retourne la valeur minimale valide quand au moins un `price_eur` est un nombre fini
- [ ] Une roue avec `price_eur: null` n'est pas exclue par le filtre range sur le prix (null-pass)
- [ ] Les bornes du range prix (`makeSelectRangeBoundsFor`) n'incluent pas `0` comme minimum artificiel
- [ ] La colonne prix affiche "N/A" pour les roues sans prix (comportement inchangé)

---

## Technical Tasks

### Task 1 — Corriger `minPrice` dans `wheelProperties.jsx`

**Files:** `frontend/src/config/wheelProperties.jsx`

**What to do:** Remplacer la fonction `minPrice` (ligne 39) :

```js
// avant
export const minPrice = (wheel) => Math.min(...wheel.prices.map((p) => p.price_eur));

// après
export const minPrice = (wheel) => {
  const valid = wheel.prices.map((p) => p.price_eur).filter(Number.isFinite);
  return valid.length > 0 ? Math.min(...valid) : null;
};
```

**Validation:** `minPrice({ prices: [{ price_eur: null }] })` retourne `null`. `minPrice({ prices: [{ price_eur: 1299 }, { price_eur: null }] })` retourne `1299`.

---

## Implementation Notes

### Task 1
- Remplacé `Math.min(...prices.map(p => p.price_eur))` par un filtre `Number.isFinite` avant le `Math.min`
- Retourne `null` quand aucun prix valide — aligné sur le comportement de tous les autres accesseurs range
