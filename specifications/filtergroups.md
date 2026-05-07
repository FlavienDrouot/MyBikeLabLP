# Grouper les filtres en catégories dépliables

## Contexte

Le `FilterPanel` actuel affiche tous les filtres à plat (marque, matériau de jante, hookless, poids, profondeur, prix, tri). On veut les regrouper par catégories dépliables pour clarifier l'UI à mesure que de nouveaux filtres seront ajoutés.

Décisions validées avec l'utilisateur :
- Seules **2 catégories** sont créées pour l'instant (« General specs » et « Rims »). Les catégories « Rayons » et « Moyeux » sont **ignorées** tant qu'aucun filtre Redux n'existe pour elles — pas de section vide.
- **General specs** (dépliée par défaut) : Marque, Poids, Prix.
- **Rims** (repliée par défaut) : Matériau, Hookless, Profondeur.
- Le sélecteur **Sort by** et le bouton **Reset** restent **en dehors** des catégories, en haut, comme aujourd'hui.
- Aucune lib d'icônes n'est installée → on utilise un SVG chevron inline.

## Fichier modifié

- `frontend/src/components/MiniComparator/FilterPanel.jsx` (seul fichier touché)

Aucune modification du store Redux ni des sélecteurs n'est nécessaire — la liste des filtres ne change pas, seul leur regroupement visuel évolue.

## Approche d'implémentation

### 1. Nouveau composant local `Section`

Ajouter dans le même fichier (au-dessus de `FilterPanel`), un petit composant interne :

```jsx
const Section = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-ink-100 pt-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-ink-900">{title}</span>
        <svg
          className={`h-4 w-4 text-ink-500 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>
      {open && <div className="mt-4 space-y-5">{children}</div>}
    </div>
  );
};
```

- Importer `useState` de React (n'est pas encore importé dans ce fichier).
- L'état est local par section : chaque catégorie s'ouvre/ferme indépendamment.
- `aria-expanded` pour l'accessibilité.
- La bordure haute (`border-t border-ink-100 pt-4`) remplace le `pt-2 border-t` actuel autour des sliders : la séparation visuelle reste cohérente.

### 2. Restructuration du JSX retourné

Conserver l'en-tête (titre + Reset) et le « Sort by » tels quels. Remplacer les blocs de filtres existants par deux `<Section>` :

```jsx
<aside className="card p-5 lg:p-6 space-y-6 h-fit lg:sticky lg:top-20">
  {/* Header + Reset (inchangé) */}
  {/* Sort by (inchangé) */}

  <Section title="General specs" defaultOpen={true}>
    {/* Brand pills (existant) */}
    <DualRangeRow label="Weight" unit=" g" min={700} max={2000} step={10} ... />
    <DualRangeRow label="Price" unit=" €" min={200} max={5000} step={50} ... />
  </Section>

  <Section title="Rims" defaultOpen={false}>
    {/* Rim material pills (existant) */}
    {/* Hookless pills (existant) */}
    <DualRangeRow label="Depth" unit=" mm" min={20} max={80} ... />
  </Section>
</aside>
```

- Les blocs `space-y-2` actuels (pills marque / matériau / hookless) et les `<DualRangeRow>` sont **déplacés tels quels** comme enfants des `<Section>`. Aucune logique Redux n'est touchée.
- Le bloc englobant `<div className="space-y-4 pt-2 border-t border-ink-100">` autour des trois sliders est supprimé : la séparation est désormais portée par `Section`, et les sliders sont éclatés entre les deux catégories.

### 3. Réutilisation existante

- `DualRangeRow` et `Pill` (déjà définis dans le fichier) sont réutilisés sans changement.
- `roundToStep`, `clampLow`, `clampHigh` (depuis `rangeMath.js`) restent utilisés via `DualRangeRow`.
- Aucun fichier CSS modifié — tout passe par Tailwind. `FilterPanel.module.css` reste inchangé.

## Vérification

1. Lancer le frontend (`npm run dev` depuis `MyBikeLab/frontend/`) et ouvrir la page contenant `MiniComparator`.
2. Vérifier que :
   - **General specs** est dépliée au chargement et contient Marque, Weight, Price.
   - **Rims** est repliée au chargement et contient Rim material, Hookless, Depth.
   - Cliquer sur l'en-tête de chaque section l'ouvre/ferme indépendamment ; le chevron pivote.
   - Aucune section « Rayons » ni « Moyeux » n'est affichée.
   - Le **Sort by** et **Reset** restent visibles en permanence en haut.
   - Tous les filtres fonctionnent toujours (modifier une marque / un slider met bien à jour la liste de roues).
3. Vérifier le focus clavier : Tab atteint chaque en-tête de section, Espace/Entrée toggle l'état.
