# Spécification — Restyler `FilterToggle` en interrupteur (toggle switch)

## Contexte

Dans `frontend/src/components/MiniComparator/FilterPanel.jsx`, le composant interne
`FilterToggle` est aujourd'hui une simple `<input type="checkbox">`. On veut qu'il
**ressemble visuellement** au composant
`Wheelcomp-react/src/components/Toggles/ToggleSwitch.jsx` :
une pastille à fond bleu/gris avec un petit cercle blanc qui glisse à droite
quand le toggle est activé.

Objectif : aligner uniquement l'apparence. On garde l'API actuelle
(`enabled`, `onChange(boolean)`, `ariaLabel`) pour ne pas toucher aux quatre
points d'utilisation du composant dans le même fichier (lignes 73, 226, 274,
303). On améliore aussi l'accessibilité par rapport au `ToggleSwitch` source,
qui utilise un `<div onClick>` non navigable au clavier.

## Décisions de design

- **Élément racine** : `<button type="button" role="switch" aria-checked={enabled}>`
  plutôt que le `<div onClick>` de la source. Le bouton est clavier-accessible
  par défaut (Espace/Entrée), supporte `aria-label` et `disabled`, et préserve
  le contrat d'origine du `FilterToggle`.
- **Couleur active** : `bg-brand-600` (= `#2563eb`, la même valeur que
  `blue-600` du composant source ; confirmé dans `frontend/tailwind.config.js`).
  Cela garde la cohérence avec le reste de `FilterPanel.jsx`.
- **Couleur inactive** : `bg-ink-300` (équivalent `gray-300` du composant
  source, déjà utilisé ailleurs dans `FilterPanel.jsx`).
- **Pastille intérieure** : `<span>` de `w-4 h-4 rounded-full bg-white`,
  positionnée par `flex` + `justify-end` quand `enabled`. Une légère
  `transition-all` pour rendre le glissement fluide.
- **Dimensions** : `w-9 h-5` pour rester proche de la taille d'une checkbox
  (`h-4 w-4`) afin de ne pas casser la mise en page existante des sections
  Brand / Rim material / Hookless / DualRangeRow. La proportion reste celle
  du `ToggleSwitch` source (~2:1, pastille ≈ moitié de la largeur).
- **Focus visible** : `focus:outline-none focus:ring-2 focus:ring-brand-600
  focus:ring-offset-1` pour accessibilité clavier.

## Fichier modifié

- `frontend/src/components/MiniComparator/FilterPanel.jsx`
  — remplacer uniquement la définition de `FilterToggle` (lignes 30–39).
  Aucun autre changement (API et call sites inchangés).

## Forme finale du composant

```jsx
// Interrupteur visuel placé à gauche de chaque label de filtre. Lorsqu'il est
// désactivé, le bloc parent grise ses contrôles et le sélecteur ignore le filtre.
const FilterToggle = ({ enabled, onChange, ariaLabel }) => (
  <button
    type="button"
    role="switch"
    aria-checked={enabled}
    aria-label={ariaLabel}
    onClick={() => onChange(!enabled)}
    className={`flex h-5 w-9 items-center rounded-full p-0.5 transition-colors
      focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-1
      ${enabled ? 'bg-brand-600 justify-end' : 'bg-ink-300 justify-start'}`}
  >
    <span className="h-4 w-4 rounded-full bg-white shadow-sm transition-transform" />
  </button>
);
```

## Vérification

1. `cd frontend && npm run dev` puis ouvrir le MiniComparator.
2. Pour chacun des toggles (Brand, Weight, Price, Rim material,
   Hookless, Depth) :
   - cliquer doit activer/désactiver le filtre (la zone associée doit
     s'opaciser/se réactiver, comme aujourd'hui) ;
   - le focus clavier (Tab) doit afficher un anneau visible ;
   - Espace et Entrée doivent basculer l'état ;
   - le lecteur d'écran doit annoncer le bon `ariaLabel` et l'état coché.
3. Vérifier qu'aucune régression visuelle sur la mise en page des lignes
   `DualRangeRow` (la hauteur du toggle reste compatible avec
   `items-baseline`/`items-center`).
