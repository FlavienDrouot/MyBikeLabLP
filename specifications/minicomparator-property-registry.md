# Refonte MiniComparator — Registry de propriétés roues

## Contexte

Le composant `MiniComparator` est aujourd'hui un prototype fonctionnel mais fortement **couplé** : ajouter une nouvelle propriété roue (ex. ETRTO width, modèle de rayons, type de freinage…) oblige à toucher **3-4 fichiers** et **6 emplacements** distincts :

| Fichier | Modification requise |
|---|---|
| `store/slices/filtersSlice.js` | Ajouter `min*`, `max*` et `*Enabled` à l'`initialState` |
| `store/selectors/wheelsSelectors.js` | Ajouter un prédicat `xxxMatch` ET un `case` dans le switch de tri |
| `components/MiniComparator/FilterPanel.jsx` | Ajouter un `<DualRangeRow>` ou `<Pill>` ET une `<option>` dans le `<select>` de tri |
| `components/MiniComparator/columnsConfig.jsx` | Ajouter une entrée dans `COLUMNS` |

Comme MiniComparator doit servir de base pour la solution finale et accueillir **de nombreuses propriétés** (poids de jante, ETRTO, tubeless ready, freinage, axes, corps de roue libre, prix unitaires moyeu/rayons, etc.), cette friction doit être éliminée maintenant. **Cible : ajouter une propriété = 1 entrée dans 1 fichier.**

Bonne nouvelle : `columnsConfig.jsx` montre déjà la voie (config déclarative consommée par `ComparisonTable` et `ColumnSelector`). Il s'agit de généraliser ce pattern à l'ensemble de la chaîne data → filtre → tri → colonne.

## Approche retenue

Une **registry unique** `frontend/src/config/wheelProperties.jsx` qui déclare, pour chaque propriété roue, tout ce dont la chaîne complète a besoin : accesseur, spec de filtre, options de tri, définition de colonne. Tous les autres fichiers consomment cette registry sans rien hardcoder.

Choix validés avec l'utilisateur :
- **Fusion totale** : la registry porte aussi les classNames CSS et les `renderCell` JSX (extension `.jsx`). Une seule source de vérité.
- **Migration big bang** en un commit (codebase ~560 lignes, pas de Redux persisté).
- **Pas de tests automatisés** pour cette itération — vérification manuelle dans le navigateur.

## Schéma d'une entrée de registry

```js
/**
 * @typedef {Object} WheelProperty
 * @property {string} id            Identifiant unique (clé Redux + colonne).
 * @property {string} label         Libellé affiché (filtre + colonne + tri).
 * @property {string} group         'general' | 'rims' | 'subs' (groupe d'affichage).
 * @property {(w) => any} accessor  Toujours une fonction (gère les cas calculés comme prix min).
 * @property {string} [unit]        ' g', ' mm', ' €' — utilisé pour rendu cellule par défaut.
 * @property {FilterSpec} [filter]  Absent => propriété non filtrable.
 * @property {SortSpec[]} [sorts]   Absent => non triable.
 * @property {ColumnSpec} [column]  Surcharge d'affichage tableau.
 */

// FilterSpec :
//   { type: 'range', min, max, step? }
//   { type: 'multiSelect' }                          // options dérivées des données
//   { type: 'triState', labels: [string, string, string] }  // [null, true, false]

// SortSpec :
//   { id: 'weight_asc', label: 'Weight (light → heavy)', direction: 'asc' | 'desc' | 'localeCompare', accessor? }

// ColumnSpec :
//   { required?: boolean, headClassName?, cellClassName?, renderCell?: (w) => ReactNode, hidden?: boolean }
//   Si renderCell absent => `${accessor(w)}${unit ?? ''}` par défaut.
```

## Fichiers à créer / modifier

### 1. CRÉER `frontend/src/config/wheelProperties.jsx`

Registry contenant les 7 propriétés actuelles + le `COLUMN_GROUPS`. Helpers exportés :
- `getFilterableProperties()` → `WHEEL_PROPERTIES.filter(p => p.filter)`
- `getColumnProperties()` → `WHEEL_PROPERTIES.filter(p => !p.column?.hidden)`
- `getAllSorts()` → tableau aplati `{ id, label, propertyId, direction, accessor }`
- `getDefaultSortId()` → premier sort déclaré (= `'name'`)

### 2. MODIFIER `frontend/src/store/slices/filtersSlice.js`

État généré dynamiquement, 3 reducers génériques : `setFilterValue`, `setFilterEnabled`, `setSortBy`, `resetFilters`. Suppression des reducers spécifiques (`setBrands`, `setRimMaterials`, `setHookless`, `setRange`, `setEnabled`).

### 3. MODIFIER `frontend/src/store/selectors/wheelsSelectors.js`

Boucle générique `every()` sur la registry, prédicats polymorphes `matchers[type]`. Tri dérivé de `getAllSorts()`. `selectAllBrands` / `selectAllRimMaterials` remplacés par un selector paramétré `makeSelectOptionsFor(propertyId)`.

### 4. MODIFIER `frontend/src/components/MiniComparator/FilterPanel.jsx`

- **Conserver** les primitives saines : `FilterToggle`, `Section`, `Pill`, `DualRangeRow`.
- **Créer 3 adapteurs typés** : `<RangeFilter>`, `<MultiSelectFilter>`, `<TriStateFilter>`.
- **Créer un dispatcher** `<FilterField property={p} />`.
- **Le panel itère** sur `COLUMN_GROUPS` × `getFilterableProperties()`.
- **Le `<select>` de tri** est généré depuis `getAllSorts()`.

### 5. MODIFIER `frontend/src/components/MiniComparator/ComparisonTable.jsx` & `ColumnSelector.jsx`

Consomment `WHEEL_PROPERTIES` au lieu de `COLUMNS`. Helpers locaux `renderCellFor`, `cellClassFor`, `headClassFor` avec defaults.

### 6. SUPPRIMER `frontend/src/components/MiniComparator/columnsConfig.jsx`

`HookBadge` extrait vers `frontend/src/components/MiniComparator/badges.jsx`.

### Périmètre intouché

- `frontend/src/components/MiniComparator/MiniComparator.jsx`
- `frontend/src/components/MiniComparator/rangeMath.js`
- `frontend/src/components/MiniComparator/FilterPanel.module.css`
- `frontend/src/data/wheelsData.js`

## Bénéfice démontré

**Ajout d'une propriété "ETRTO width"** — **1 fichier, 4 lignes** :
```jsx
{ id: 'etrto', label: 'ETRTO width', group: 'rims', unit: ' mm',
  accessor: w => w.rim.externalWidth_mm,
  filter: { type: 'range', min: 19, max: 35 },
  sorts: [{ id: 'etrto_asc', label: 'ETRTO (narrow → wide)', direction: 'asc' }] }
```

**Ajout d'une propriété "Spoke material"** — **1 fichier, 2 lignes** :
```jsx
{ id: 'spokeMaterial', label: 'Spoke material', group: 'subs',
  accessor: w => w.spokes.material, filter: { type: 'multiSelect' } }
```

Avant la refonte : 6 emplacements dans 4 fichiers à chaque fois.

## Vérification end-to-end

1. **Build & démarrage** : `npm run dev` dans `frontend/`.
2. **Smoke filtres** : 6 filtres présents et fonctionnels.
3. **Toggles enable** : valeurs conservées quand on désactive.
4. **Tri** : 7 options testées.
5. **Colonnes** : masquage/affichage, "Model" reste required.
6. **Reset** : retour à l'état initial.
7. **Test d'extensibilité** : ajouter une 8ème entrée et vérifier qu'aucun autre fichier n'est touché.
8. **Drawer mobile** : ouverture/fermeture correctes.

## Pièges connus

- `resetFilters` importe la registry — couplage explicite, pas de cycle.
- Options dynamiques (brand, material) restent calculées par selector, pas dans la registry.
- Accessibilité : propager `aria-label` formé depuis `property.label`.
- Performance : `every()` sur ~10 propriétés × N roues négligeable tant que N < 10⁴.

## Fichiers critiques

- `frontend/src/config/wheelProperties.jsx` *(à créer)*
- `frontend/src/components/MiniComparator/badges.jsx` *(à créer)*
- `frontend/src/store/slices/filtersSlice.js`
- `frontend/src/store/selectors/wheelsSelectors.js`
- `frontend/src/components/MiniComparator/FilterPanel.jsx`
- `frontend/src/components/MiniComparator/ComparisonTable.jsx`
- `frontend/src/components/MiniComparator/ColumnSelector.jsx`
- `frontend/src/components/MiniComparator/columnsConfig.jsx` *(à supprimer)*
