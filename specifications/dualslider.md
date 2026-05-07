# Plan — Dual-range sliders dans FilterPanel.jsx

## Context

Dans [FilterPanel.jsx](../frontend/src/components/MiniComparator/FilterPanel.jsx), chaque propriete numerique (poids, profondeur, prix) est actuellement controlee par **deux sliders separes** (un pour le min, un pour le max), via le helper `RangeRow`. L'experience utilisateur est mediocre : il faut bouger deux curseurs pour cadrer une plage, et rien n'empeche de mettre `min > max` (ce qui casse silencieusement le filtrage cote selecteurs).

L'objectif est de remplacer chaque paire min/max par **un seul slider a deux poignees**, avec deux **champs de saisie numeriques** juste au-dessus, en s'inspirant de `RangeFilter.jsx` du projet Wheelcomp-react (`C:\Users\Flavien\Google Drive\VisualStudioCode\Wheelcomp-react\src\components\InputFilters\RangeFilter.jsx`).

## Approche

### 1. Nouveau helper `DualRangeRow` inline dans FilterPanel.jsx

Remplace `RangeRow` (lignes 21-40 de FilterPanel.jsx) par un nouveau helper `DualRangeRow` qui prend :

```js
{ label, unit, min, max, step, valueLow, valueHigh, onChangeLow, onChangeHigh }
```

Le helper rend :
- Une ligne d'entete avec le `label`
- Deux `<input type="number">` cote a cote (sequence : min input  —  separateur  —  max input)
- Un conteneur `relative` contenant : deux `<input type="range">` superposes en `absolute` (un par poignee), une piste de fond, et une barre de plage active positionnee en `%` calcule a partir de `valueLow` / `valueHigh`.

Source d'inspiration directe : RangeFilter.jsx lignes 21-58 — meme architecture (deux inputs range absolus + track + range visuels), adaptee a Tailwind/brand-600.

### 2. Clamping + rounding stable (cote helper, pas dans le slice)

Tout le clamping/rounding se fait dans `DualRangeRow`. Le slice [filtersSlice.js](../frontend/src/store/slices/filtersSlice.js) reste **inchange** — on continue de dispatcher `setMinWeight` / `setMaxWeight` etc., simplement avec des valeurs deja validees et arrondies.

Pour eviter les artefacts flottants type `12.300000000000001` ou `4.999999999999999` (qui surgissent des qu'on calcule `(max - min) / 50 = 0.1` puis qu'on additionne ou compare des multiples), on extrait une **fonction pure** dans un fichier dedie :

**Nouveau fichier** : `frontend/src/components/MiniComparator/rangeMath.js`

```js
// Arrondit `value` au multiple de `step` le plus proche, en eliminant
// les artefacts flottants (.000000001 / .999999999).
export function roundToStep(value, step) {
  if (!Number.isFinite(value) || !Number.isFinite(step) || step <= 0) return value;
  const decimals = (String(step).split('.')[1] || '').length;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

// Clamp + arrondit une borne basse de plage.
export function clampLow({ raw, min, valueHigh, step, minDiff }) {
  const n = Number(raw);
  if (!Number.isFinite(n)) return min;
  const upper = roundToStep(valueHigh - minDiff, step);
  return roundToStep(Math.max(min, Math.min(n, upper)), step);
}

// Clamp + arrondit une borne haute de plage.
export function clampHigh({ raw, max, valueLow, step, minDiff }) {
  const n = Number(raw);
  if (!Number.isFinite(n)) return max;
  const lower = roundToStep(valueLow + minDiff, step);
  return roundToStep(Math.min(max, Math.max(n, lower)), step);
}
```

Logique de step et `minDiff` (reprise de RangeFilter.jsx lignes 8-10 mais nettoyee) :

```js
// Dans DualRangeRow :
const computedStep = (max - min) / 50 > 1 ? 1 : 0.1;
const effectiveStep = step ?? computedStep;
const minDiff = effectiveStep; // ecart minimum = un cran de step
```

Les handlers du composant appellent `clampLow` / `clampHigh` puis dispatchent. Comme `roundToStep` ramene toujours la valeur a `Math.round(v * 10^d) / 10^d`, on est garanti :
- Aucune valeur sortie du helper ne contient plus de `decimals` decimales
- `1.1 + 0.2` → `1.3` (pas `1.3000000000000003`)
- L'affichage dans `<input type="number">` et dans le label reste propre

### 3. Test unitaire de `roundToStep` / `clampLow` / `clampHigh`

Le projet n'a **aucun framework de tests** installe (frontend/package.json lignes 18-31). On installe **Vitest** (le choix naturel sous Vite, zero conf) :

```bash
cd MyBikeLab/frontend
npm install --save-dev vitest
```

Ajouter dans `package.json` :

```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest"
}
```

**Nouveau fichier** : `frontend/src/components/MiniComparator/rangeMath.test.js`

Cas de test cibles :

```js
import { describe, it, expect } from 'vitest';
import { roundToStep, clampLow, clampHigh } from './rangeMath';

describe('roundToStep', () => {
  it('elimine les artefacts flottants additifs', () => {
    expect(roundToStep(0.1 + 0.2, 0.1)).toBe(0.3);            // pas 0.30000000000000004
    expect(roundToStep(1.1 + 2.2, 0.1)).toBe(3.3);
  });
  it('arrondit au multiple de step le plus proche', () => {
    expect(roundToStep(723, 10)).toBe(720);
    expect(roundToStep(727, 10)).toBe(730);
    expect(roundToStep(50.04, 0.1)).toBe(50);
  });
  it('renvoie la valeur intacte pour entree non-finie ou step invalide', () => {
    expect(roundToStep(NaN, 1)).toBeNaN();
    expect(roundToStep(5, 0)).toBe(5);
  });
});

describe('clampLow', () => {
  it('respecte la borne min', () => {
    expect(clampLow({ raw: 100, min: 700, valueHigh: 2000, step: 10, minDiff: 10 })).toBe(700);
  });
  it('ne franchit pas valueHigh - minDiff', () => {
    expect(clampLow({ raw: 1995, min: 700, valueHigh: 2000, step: 10, minDiff: 10 })).toBe(1990);
  });
  it('arrondit au step le plus proche', () => {
    expect(clampLow({ raw: 1234, min: 700, valueHigh: 2000, step: 10, minDiff: 10 })).toBe(1230);
  });
  it("renvoie min pour entree non-numerique (ex: '' apres effacement de l'input)", () => {
    expect(clampLow({ raw: '', min: 700, valueHigh: 2000, step: 10, minDiff: 10 })).toBe(700);
  });
});

describe('clampHigh', () => {
  it('respecte la borne max', () => {
    expect(clampHigh({ raw: 9999, max: 5000, valueLow: 200, step: 50, minDiff: 50 })).toBe(5000);
  });
  it('ne descend pas sous valueLow + minDiff', () => {
    expect(clampHigh({ raw: 100, max: 5000, valueLow: 200, step: 50, minDiff: 50 })).toBe(250);
  });
  it('arrondit au step le plus proche', () => {
    expect(clampHigh({ raw: 1234, max: 5000, valueLow: 200, step: 50, minDiff: 50 })).toBe(1250);
  });
});
```

Lancement : `npm test` dans `MyBikeLab/frontend/`. Pas besoin de jsdom : on teste uniquement des fonctions pures.

### 4. Styling — CSS Module colocalise

Tailwind ne peut pas cibler les pseudo-elements `::-webkit-slider-thumb` et `::-moz-range-thumb`. On cree un **CSS Module** :

**Nouveau fichier** : `frontend/src/components/MiniComparator/FilterPanel.module.css`

Classes a definir (adaptees de InputFilters.css lignes 1-64 du projet Wheelcomp-react, couleurs alignees sur le token `brand-600` du `tailwind.config.js` de MyBikeLab) :

- `.thumb` — `<input type="range">` en position absolue, `pointer-events: none`, `width: 100%`, `z-index: 3`, `appearance: none`, `background: transparent`
- `.thumb::-webkit-slider-thumb` — pastille 18-20px, `background: var(--brand-600)`, bordure blanche, `pointer-events: all`, transition de scale au hover
- `.thumb::-moz-range-thumb` — equivalent Firefox
- `.track` — barre de fond gris clair, hauteur 6px, `width: 100%`, `z-index: 1`
- `.range` — barre active brand-600, hauteur 6px, position et width pilotees en `style={{ left, width }}` inline depuis le JSX, `z-index: 2`

Vite (utilise par MyBikeLab) supporte les CSS Modules nativement via le suffixe `.module.css` — import :

```js
import styles from './FilterPanel.module.css';
// usage : className={styles.thumb}
```

### 5. Remplacement des trois groupes dans le JSX

Dans le bloc actuellement en FilterPanel.jsx lignes 156-209, remplacer les 6 `<RangeRow>` par 3 `<DualRangeRow>` :

```jsx
<DualRangeRow
  label="Weight"  unit=" g"  min={700}  max={2000}  step={10}
  valueLow={filters.minWeight}  valueHigh={filters.maxWeight}
  onChangeLow={(v) => dispatch(setMinWeight(v))}
  onChangeHigh={(v) => dispatch(setMaxWeight(v))}
/>
<DualRangeRow label="Depth" unit=" mm" min={20}   max={80}   /* ... */ />
<DualRangeRow label="Price" unit=" €"  min={200}  max={5000} step={50} /* ... */ />
```

Le helper `RangeRow` (lignes 21-40) peut etre **supprime** — il n'est plus utilise.

## Fichiers touches

| Fichier | Action |
|---|---|
| `frontend/src/components/MiniComparator/FilterPanel.jsx` | Modifier : remplacer `RangeRow` par `DualRangeRow`, importer le CSS module + `clampLow`/`clampHigh`, remplacer les 6 RangeRow par 3 DualRangeRow |
| `frontend/src/components/MiniComparator/FilterPanel.module.css` | **Creer** : classes `.thumb`, `.track`, `.range` |
| `frontend/src/components/MiniComparator/rangeMath.js` | **Creer** : `roundToStep`, `clampLow`, `clampHigh` (fonctions pures) |
| `frontend/src/components/MiniComparator/rangeMath.test.js` | **Creer** : tests unitaires Vitest |
| `frontend/package.json` | Modifier : ajouter `vitest` en devDependency + scripts `test` / `test:watch` |
| `frontend/src/store/slices/filtersSlice.js` | **Inchange** |

## Verification

1. **Lancer les tests unitaires** : `npm test` dans `MyBikeLab/frontend/` — tous les cas de `rangeMath.test.js` doivent passer (notamment ceux qui verifient l'absence d'artefacts flottants type `.0000001` / `.9999999`)
2. **Lancer le frontend** : `npm run dev` dans `MyBikeLab/frontend/`
3. **Ouvrir la page MiniComparator** dans le navigateur
4. **Tester chaque slider** :
   - Bouger la poignee gauche : la valeur basse change, la barre active suit
   - Bouger la poignee droite : la valeur haute change, la barre active suit
   - Tenter de croiser les poignees : verifier que `valueLow` reste `<= valueHigh - minDiff`
   - Saisir une valeur dans le champ numerique min : verifier la mise a jour du slider et le clamp
   - Saisir une valeur hors-plage (ex: 999999 dans Max price) : verifier qu'elle est clampee a `max`
   - Verifier visuellement qu'aucune valeur affichee ne contient de decimales parasites
5. **Verifier le filtrage** : la liste des roues doit toujours se filtrer en temps reel selon la plage selectionnee (selecteurs dans `frontend/src/store/selectors/wheelsSelectors.js`, inchanges)
6. **Bouton Reset** : verifier qu'il remet les 3 plages a leurs valeurs initiales (700-2000, 20-80, 200-5000)
7. **Responsive** : verifier sur largeur etroite (sidebar empilee) que les inputs et le slider restent lisibles
