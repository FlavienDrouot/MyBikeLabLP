# Revue de code - `wheelsSelectors.js`

## Contexte

Fichier : `frontend/src/store/selectors/wheelsSelectors.js`
Stack : React 19, Redux Toolkit, Vite, Tailwind
Consommateur : `ComparisonTable` (re-render à chaque changement de filtre)

## Résumé

Les sélecteurs actuels sont **fonctionnels mais problématiques en termes de performance**. Ils ne sont pas mémoïsés, ce qui force `ComparisonTable` à recalculer la liste filtrée et à recevoir une nouvelle référence d'objet/tableau à chaque render, même quand rien d'utile n'a changé. Avec Redux Toolkit, la solution standard est `createSelector` (Reselect, déjà inclus dans RTK).

Ci-dessous les problèmes par ordre d'impact, puis une proposition de refactor.

---

## Problèmes identifiés

### 1. Absence de mémoïsation - **Impact perf : élevé**

`selectFilteredWheels` et `selectWheelStats` retournent un **nouveau tableau/objet à chaque appel**, même lorsque l'état n'a pas changé. Conséquence :

- `useSelector(selectFilteredWheels)` déclenchera un re-render à chaque dispatch d'action dans le store (pas seulement quand `wheels` ou `filters` changent), parce que la comparaison par défaut (`===`) échoue.
- Tout le travail (filter + map + sort) est ré-exécuté à chaque render.

C'est exactement le scénario que `createSelector` résout :

```js
import { createSelector } from '@reduxjs/toolkit';

const selectWheelsById = (state) => state.wheels.byId;
const selectFilters = (state) => state.filters;

export const selectFilteredWheels = createSelector(
  [selectWheelsById, selectFilters],
  (byId, filters) => {
    return Object.values(byId)
      .filter((w) => {
        if (filters.minDiameter && w.diameter < filters.minDiameter) return false;
        if (filters.maxDiameter && w.diameter > filters.maxDiameter) return false;
        if (filters.minPrice && w.price < filters.minPrice) return false;
        if (filters.maxPrice && w.price > filters.maxPrice) return false;
        if (filters.brand && w.brand !== filters.brand) return false;
        return true;
      })
      .map((w) => ({
        id: w.id,
        label: `${w.brand} ${w.name}`,
        diameter: w.diameter,
        price: w.price,
        pricePerInch: w.price / w.diameter,
      }))
      .sort((a, b) => a.price - b.price);
  }
);
```

### 2. Granularité des dépendances trop large - **Impact perf : moyen**

`selectFilters` retourne **l'objet `state.filters` entier**. Si tu ajoutes plus tard un filtre non pertinent pour les roues (ex. `filters.userPrefs`), le sélecteur sera invalidé à tort.

Recommandation : sélectionner uniquement les champs utilisés.

```js
const selectWheelFilters = createSelector(
  [(state) => state.filters],
  (f) => ({
    minDiameter: f.minDiameter,
    maxDiameter: f.maxDiameter,
    minPrice: f.minPrice,
    maxPrice: f.maxPrice,
    brand: f.brand,
  })
);
```

Ou, plus simple si la forme du slice est stable, utiliser des sélecteurs atomiques (`(s) => s.filters.brand`, etc.) puis combiner.

### 3. `selectWheelStats` - même problème + bug potentiel - **Impact : moyen**

```js
avgPrice: wheels.reduce((s, w) => s + w.price, 0) / wheels.length,
```

Si `wheels.length === 0`, `avgPrice` vaut `NaN`. À traiter explicitement :

```js
avgPrice: wheels.length ? wheels.reduce((s, w) => s + w.price, 0) / wheels.length : 0,
```

À mémoïser également via `createSelector`.

### 4. Tri couplé au filtrage - **Impact : faible/moyen**

`selectFilteredWheels` filtre, transforme **et** trie. Si `ComparisonTable` permet à l'utilisateur de changer la clé de tri (par prix, par diamètre, etc.), tu vas devoir invalider toute la chaîne pour un simple changement de tri. Découper :

```js
export const selectFilteredWheelsRaw = createSelector(...); // filter + map
export const selectSortedFilteredWheels = createSelector(
  [selectFilteredWheelsRaw, (state) => state.ui.sortKey],
  (wheels, sortKey) => [...wheels].sort(/* ... */)
);
```

Bénéfice : changer le tri ne re-filtre pas, changer un filtre ne casse pas la mémoïsation du tri si le résultat filtré est identique.

### 5. Filtres `min*` - bug subtil avec `0` - **Impact : correctness**

```js
if (filters.minDiameter && w.diameter < filters.minDiameter) return false;
```

Si `minDiameter === 0`, le filtre est ignoré (ce qui est probablement OK), mais si jamais une valeur valide `0` est utilisée pour un autre filtre ailleurs, le pattern est piégeux. Préfère un test explicite :

```js
if (filters.minDiameter != null && w.diameter < filters.minDiameter) return false;
```

C'est plus robuste si l'état permet `0` comme borne valide.

### 6. Création d'objets dans `.map` - **Impact : faible**

Chaque appel reconstruit des objets (`{ id, label, diameter, price, pricePerInch }`). Avec la mémoïsation, ce n'est plus un problème. Sans mémoïsation, c'était une source de pression GC sur grandes listes.

À noter : `pricePerInch: w.price / w.diameter` divise par `w.diameter` - si une roue a `diameter === 0` (mauvaise donnée), tu obtiens `Infinity`. Un garde-fou ne fait pas de mal.

### 7. Convention de nommage / réutilisation

- `selectAllWheels` retourne `state.wheels.byId` (un objet, pas un tableau). Le nom est trompeur : `selectWheelsById` serait plus clair, et un `selectAllWheels` qui fait `Object.values(byId)` (mémoïsé) serait utile pour éviter de répéter ce calcul partout.

```js
export const selectWheelsById = (state) => state.wheels.byId;

export const selectAllWheels = createSelector(
  [selectWheelsById],
  (byId) => Object.values(byId)
);
```

### 8. Sélecteurs paramétrés (si besoin futur)

Si `ComparisonTable` doit un jour filtrer par un paramètre passé en prop (ex. catégorie spécifique au composant), `createSelector` standard ne suffit pas - une instance partagée serait invalidée en boucle entre composants. Utilise alors `createSelector` par instance via `useMemo`, ou `re-reselect` / `createSelectorCreator` avec une cache LRU. Pas urgent ici, mais à garder en tête.

---

## Refactor proposé (version complète)

```js
// frontend/src/store/selectors/wheelsSelectors.js
import { createSelector } from '@reduxjs/toolkit';

// --- sélecteurs racine ---
const selectWheelsById = (state) => state.wheels.byId;
const selectFiltersSlice = (state) => state.filters;

// --- dérivés mémoïsés ---
export const selectAllWheels = createSelector(
  [selectWheelsById],
  (byId) => Object.values(byId)
);

export const selectWheelFilters = createSelector(
  [selectFiltersSlice],
  ({ minDiameter, maxDiameter, minPrice, maxPrice, brand }) => ({
    minDiameter,
    maxDiameter,
    minPrice,
    maxPrice,
    brand,
  })
);

export const selectFilteredWheels = createSelector(
  [selectAllWheels, selectWheelFilters],
  (wheels, f) =>
    wheels
      .filter((w) => {
        if (f.minDiameter != null && w.diameter < f.minDiameter) return false;
        if (f.maxDiameter != null && w.diameter > f.maxDiameter) return false;
        if (f.minPrice != null && w.price < f.minPrice) return false;
        if (f.maxPrice != null && w.price > f.maxPrice) return false;
        if (f.brand && w.brand !== f.brand) return false;
        return true;
      })
      .map((w) => ({
        id: w.id,
        label: `${w.brand} ${w.name}`,
        diameter: w.diameter,
        price: w.price,
        pricePerInch: w.diameter ? w.price / w.diameter : 0,
      }))
);

export const selectSortedFilteredWheels = createSelector(
  [selectFilteredWheels],
  (wheels) => [...wheels].sort((a, b) => a.price - b.price)
);

export const selectWheelStats = createSelector(
  [selectAllWheels],
  (wheels) => ({
    count: wheels.length,
    avgPrice: wheels.length
      ? wheels.reduce((s, w) => s + w.price, 0) / wheels.length
      : 0,
    brands: [...new Set(wheels.map((w) => w.brand))],
  })
);
```

---

## Côté `ComparisonTable`

Quelques rappels qui amplifient l'effet du refactor :

- `useSelector(selectSortedFilteredWheels)` ne re-renderera plus que quand le résultat change réellement.
- Si tu rends une ligne par roue, mémoïse les rangées (`React.memo`) et passe une `key` stable (`wheel.id`).
- Évite de créer des callbacks inline non mémoïsés (`onClick={() => ...}`) si les rangées sont memoïsées.

---

## Tests à ajouter

- Test unitaire vérifiant qu'appeler `selectFilteredWheels` deux fois avec le même `state` retourne la **même référence** (preuve que la mémoïsation fonctionne).
- Test pour le cas `wheels.length === 0` dans `selectWheelStats` (`avgPrice` ne doit pas être `NaN`).
- Test pour les bornes `0` (`minPrice: 0` doit être traité comme une borne valide, pas ignoré).

---

## TL;DR

| Problème | Sévérité | Action |
|---|---|---|
| Pas de mémoïsation | Élevée | Passer à `createSelector` |
| `avgPrice` = `NaN` si liste vide | Moyenne | Garde sur `length` |
| `filters.minX && ...` ignore `0` | Moyenne | Utiliser `!= null` |
| Tri couplé au filtre | Faible/Moyenne | Découper en deux sélecteurs |
| `selectAllWheels` mal nommé | Faible | Renommer + dérivé mémoïsé |
| Division par zéro `pricePerInch` | Faible | Garde-fou |

Le gain principal vient de la mémoïsation : pour `ComparisonTable`, tu devrais voir les re-renders inutiles disparaître complètement dès que les filtres ne changent pas.
