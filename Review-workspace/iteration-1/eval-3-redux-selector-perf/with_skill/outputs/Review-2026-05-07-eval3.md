# Revue de code — Sélecteurs Redux `wheelsSelectors.js`

**Date :** 2026-05-07 14:30
**Périmètre :** `frontend/src/store/selectors/wheelsSelectors.js` (utilisé par `ComparisonTable`)
**Verdict :** 🔴 bloquants à corriger

## Résumé

Les sélecteurs `selectFilteredWheels` et `selectWheelStats` retournent systématiquement un nouvel objet/tableau à chaque appel (nouveau résultat de `Object.values`, nouveau `.map`, nouveau `Set`, etc.). Branchés sur `useSelector`, ils déclenchent un re-render de `ComparisonTable` à **chaque** dispatch Redux du store, même quand ni `state.wheels.byId` ni `state.filters` n'ont changé. C'est exactement le piège que `createSelector` (Reselect, livré avec Redux Toolkit) est fait pour résoudre. À cela s'ajoute un bug de division par zéro dans `selectWheelStats` quand le catalogue est vide, et des comparaisons de filtres falsy-incorrectes (un filtre à `0` est ignoré). Une fois ces trois points corrigés, le module est prêt.

## Findings

### 🔴 Bloquants

**Sélecteurs non mémoïsés → re-render à chaque dispatch**
- 📍 `frontend/src/store/selectors/wheelsSelectors.js:7-28` et `30-37`
- **Problème :** `selectFilteredWheels` et `selectWheelStats` recalculent et retournent un nouveau tableau / nouvel objet à chaque appel. Avec `useSelector(selectFilteredWheels)`, l'égalité de référence par défaut (`===`) échoue toujours, donc `ComparisonTable` re-render à chaque dispatch sur **n'importe quelle** slice (pas seulement `wheels`/`filters`). C'est cohérent avec le symptôme rapporté ("re-render à chaque changement de filtre" — en réalité c'est encore pire : à chaque changement n'importe où dans le store).
- **Impact :** Performance dégradée sur la page de comparaison ; chaque frappe dans un input contrôlé ailleurs dans l'app peut redéclencher tri + map sur tout le catalogue. Sur un catalogue qui grandit, ça devient visible (jank au scroll, latence sur les sliders de filtres).
- **Correction :** Mémoïser avec `createSelector` de Redux Toolkit.
  ```js
  import { createSelector } from '@reduxjs/toolkit';

  export const selectAllWheels = (state) => state.wheels.byId;
  export const selectFilters = (state) => state.filters;

  export const selectFilteredWheels = createSelector(
    [selectAllWheels, selectFilters],
    (byId, filters) =>
      Object.values(byId)
        .filter((w) => {
          if (filters.minDiameter != null && w.diameter < filters.minDiameter) return false;
          if (filters.maxDiameter != null && w.diameter > filters.maxDiameter) return false;
          if (filters.minPrice != null && w.price < filters.minPrice) return false;
          if (filters.maxPrice != null && w.price > filters.maxPrice) return false;
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
        .sort((a, b) => a.price - b.price),
  );

  export const selectWheelStats = createSelector(
    [selectAllWheels],
    (byId) => {
      const wheels = Object.values(byId);
      if (wheels.length === 0) {
        return { count: 0, avgPrice: 0, brands: [] };
      }
      return {
        count: wheels.length,
        avgPrice: wheels.reduce((s, w) => s + w.price, 0) / wheels.length,
        brands: [...new Set(wheels.map((w) => w.brand))],
      };
    },
  );
  ```

**`selectWheelStats` divise par zéro quand le catalogue est vide**
- 📍 `frontend/src/store/selectors/wheelsSelectors.js:34`
- **Problème :** Si `state.wheels.byId` est `{}` (état initial avant chargement, ou erreur de fetch), `wheels.reduce(...) / wheels.length` vaut `0 / 0` = `NaN`. Toute UI qui formate `avgPrice` (ex : `avgPrice.toFixed(2)` ou `${avgPrice} €`) affichera `NaN €` à l'utilisateur.
- **Impact :** Bug visible côté UI dès que la page s'affiche avant que les données soient en mémoire, ou si la liste est vide après filtrage applicatif.
- **Correction :** Voir le code ci-dessus — court-circuit quand `wheels.length === 0` pour retourner une stat neutre. Bonus : ça permet aussi de retirer `brands` qui serait `[]` proprement plutôt que reposer sur le `Set` vide.

### 🟠 Importants

**Filtres ignorés quand la valeur vaut `0`**
- 📍 `frontend/src/store/selectors/wheelsSelectors.js:13-16`
- **Problème :** `if (filters.minPrice && ...)` est falsy pour `0`. Si l'utilisateur règle `minPrice = 0` (cas légitime sur un slider qui commence à 0), le filtre est purement et simplement sauté. Idem `minDiameter`, `maxDiameter`, `maxPrice`. En pratique, `maxPrice = 0` ne filtrerait rien alors que sémantiquement ça devrait ne rien retourner (ou être traité comme "pas de borne").
- **Impact :** Comportement incohérent du panneau de filtres ; bug subtil qui ne saute aux yeux que sur certaines valeurs limites.
- **Correction :** Tester explicitement `!= null` (ou `!== undefined` selon ce que la slice peut produire) au lieu d'un check truthy. Voir l'extrait corrigé ci-dessus. Si la convention projet est qu'un filtre absent vaut `null`, garder cette convention dans la slice et l'aligner ici.

### 🟡 Suggestions

**`selectWheelStats` ne dépend pas des filtres — vérifier l'intention**
- 📍 `frontend/src/store/selectors/wheelsSelectors.js:30-37`
- **Problème :** Les stats sont calculées sur **tout** le catalogue, pas sur les wheels filtrées. Si `ComparisonTable` affiche "X résultats, prix moyen Y €" sous le tableau filtré, l'utilisateur s'attend à des stats cohérentes avec ce qu'il voit. À l'inverse, si c'est volontaire (stats "globales" du catalogue affichées à part), c'est très bien — mais ça mérite un nom plus explicite.
- **Correction :** Soit baser sur `selectFilteredWheels` (et renommer en `selectFilteredWheelStats` si on garde aussi une version globale), soit garder tel quel et renommer en `selectCatalogStats` pour lever l'ambiguïté. Voir Questions ouvertes.

**`pricePerInch` calculé à chaque sélecteur, jamais utilisé pour trier**
- 📍 `frontend/src/store/selectors/wheelsSelectors.js:25, 27`
- **Problème :** Le champ `pricePerInch` est ajouté à chaque entrée, mais le tri se fait sur `a.price - b.price`. Si l'intention est juste d'exposer la valeur à la table, OK. Si le but était de trier par rapport prix/diamètre, le tri n'utilise pas le champ. À clarifier — sinon c'est du calcul inutile à chaque entrée.

### ⚪ Nits

- `selectAllWheels` retourne `state.wheels.byId` (un map), mais le nom suggère un tableau. `selectWheelsById` serait plus juste, et un `selectAllWheelsArray` mémoïsé pourrait servir si plusieurs sélecteurs ont besoin du tableau brut.

## Questions ouvertes

- **Stats filtrées ou globales ?** `selectWheelStats` doit-il refléter le catalogue complet ou la sélection courante après filtres ? La réponse change la dépendance du sélecteur et son nom.
- **Forme attendue des filtres dans la slice :** est-ce que `filters.minPrice` peut valoir `0`, `null`, `undefined`, ou une chaîne vide ? La correction du finding 🟠 dépend de cette convention. Si la slice normalise déjà à `null` quand le filtre est désactivé, le check `!= null` est suffisant ; sinon il faut être plus défensif.
- **Volume du catalogue :** combien de wheels en pratique ? Si on dépasse quelques milliers, il faudra aussi regarder du côté de la virtualisation de `ComparisonTable` — hors scope de ce fichier mais lié au symptôme.
