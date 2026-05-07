# Plan : Toggle d'activation par filtre dans `FilterPanel.jsx`

## Context

Aujourd'hui, chaque filtre du `FilterPanel` (Brand, Weight, Price, Rim material, Hookless, Depth) est toujours appliqué : pour ne pas filtrer sur une propriété, l'utilisateur doit ramener manuellement les valeurs aux extrémités (ou vider la sélection des pills). C'est lourd, et on perd les valeurs précédentes si on veut juste « ignorer » temporairement un filtre.

L'objectif est d'ajouter un toggle (case/switch) à gauche du nom de chaque filtre. Quand le toggle est désactivé, le filtre n'est pas appliqué au tableau, peu importe la valeur courante des contrôles. Les contrôles deviennent visuellement grisés et inactifs (non-cliquables) pour rendre l'état évident.

## Approche retenue

Ajouter un flag booléen `enabled` par filtre dans le slice Redux (par défaut `true` → comportement actuel préservé), gater chaque filtre côté sélecteur sur ce flag, et exposer une petite case à cocher dans `FilterPanel.jsx` à gauche du label de chaque filtre.

## Fichiers à modifier

### 1. `frontend/src/store/slices/filtersSlice.js`

- Ajouter au `initialFiltersState` 6 nouveaux booléens, tous à `true` :
  - `brandsEnabled`, `weightEnabled`, `priceEnabled`, `rimMaterialsEnabled`, `hooklessEnabled`, `depthEnabled`
- Ajouter 6 reducers correspondants (`setBrandsEnabled`, `setWeightEnabled`, …) qui assignent `action.payload`.
- Exporter ces nouvelles actions.
- `resetFilters` retournant déjà `initialFiltersState`, le reset remettra automatiquement tous les toggles à `true`.

### 2. `frontend/src/store/selectors/wheelsSelectors.js`

Dans `selectFilteredWheels`, encapsuler chaque condition de filtre dans un OR avec le flag d'enabled correspondant. Schéma :

- `(!filters.brandsEnabled) || filters.brands.length === 0 || filters.brands.includes(wheel.brand)`
- `(!filters.rimMaterialsEnabled) || filters.rimMaterials.length === 0 || filters.rimMaterials.includes(wheel.rim.material)`
- `(!filters.hooklessEnabled) || filters.hookless === null || wheel.rim.hookless === filters.hookless`
- `(!filters.weightEnabled) || (wheel.weight_grams >= filters.minWeight && wheel.weight_grams <= filters.maxWeight)`
- `(!filters.depthEnabled) || (wheel.rim.depth_mm >= filters.minDepth && wheel.rim.depth_mm <= filters.maxDepth)`
- `(!filters.priceEnabled) || (price >= filters.minPrice && price <= filters.maxPrice)`

Le tri (`sortBy`) n'est pas concerné — pas un filtre.

### 3. `frontend/src/components/MiniComparator/FilterPanel.jsx`

#### a. Nouveau sous-composant `FilterToggle`

Petite case à cocher stylée Tailwind, à placer à gauche du label :
- input `type="checkbox"` accessible (avec `aria-label`)
- styles cohérents avec le reste du panel (bordure ink, accent brand-600)
- événement `onChange` qui dispatche le setter `setXxxEnabled`

#### b. Étendre `DualRangeRow`

Ajouter deux props : `enabled` et `onToggleEnabled`.
- Rendre la `FilterToggle` à gauche de `{label}` dans la ligne d'en-tête.
- Quand `enabled === false` :
  - wrapper externe reçoit `opacity-50`
  - chaque `<input>` reçoit `disabled` (les deux number inputs et les deux range inputs)
  - les sliders restent visibles mais non-interactifs (le navigateur gère le `disabled` natif)

Pas besoin de changer les valeurs courantes — elles restent en l'état pour quand on réactive le filtre.

#### c. Étendre les blocs « pills » (Brand, Rim material, Hookless)

Pour chacun des 3 blocs :
- ligne label transformée en `flex items-center gap-2` avec la `FilterToggle` à gauche du `<span>`
- conteneur des pills reçoit `opacity-50 pointer-events-none` quand le filtre est désactivé

Structure type :

```jsx
<div className="space-y-2">
  <div className="flex items-center gap-2">
    <FilterToggle enabled={filters.brandsEnabled} onChange={(v) => dispatch(setBrandsEnabled(v))} ariaLabel="Enable brand filter" />
    <span className="text-sm font-medium text-ink-700">Brand</span>
  </div>
  <div className={`flex flex-wrap gap-1.5 ${!filters.brandsEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
    {allBrands.map(...)}
  </div>
</div>
```

Pour `DualRangeRow`, la toggle est rendue à l'intérieur du composant (plus propre).

## Composants/utilitaires existants à réutiliser

- `Pill` : utilisé tel quel; le wrapping `pointer-events-none` du parent suffit à désactiver le clic.
- `Section` : inchangé.
- `DualRangeRow` : étendu avec les 2 nouvelles props.
- `roundToStep`, `clampLow`, `clampHigh` : inchangés.

## État par défaut & rétrocompatibilité

Tous les flags à `true` par défaut → comportement strictement identique à aujourd'hui pour qui ne touche pas aux toggles. `resetFilters` remet aussi les toggles à `true`. Pas de persistance Redux dans le projet, donc pas de migration à prévoir.

## Vérification

1. Lancer le dev server frontend (`npm run dev` dans `frontend/`).
2. Ouvrir le MiniComparator et vérifier qu'au chargement initial le tableau est filtré comme avant.
3. Pour chaque filtre :
   - Régler des valeurs restrictives qui réduisent visiblement la liste.
   - Désactiver le toggle → la liste s'élargit comme si ce filtre n'existait pas, **sans perdre les valeurs des contrôles**.
   - Réactiver le toggle → la liste redevient filtrée selon les valeurs précédentes.
4. Vérifier que les contrôles désactivés sont visuellement grisés et non-cliquables.
5. Cliquer sur « Reset » → tous les toggles repassent à `true`, valeurs aux défauts.
6. Accessibilité : chaque toggle a un `aria-label` clair.
