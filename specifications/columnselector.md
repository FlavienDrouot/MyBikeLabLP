# Plan : Sélecteur de colonnes pour MiniComparator

## Context

Le `ComparisonTable` du MiniComparator affiche actuellement 7 colonnes codées en dur dans le JSX (Model, Weight, Depth, Material, Type, Hub, Price). Pour permettre à l'utilisateur de personnaliser sa vue, on ajoute un bouton "Columns" au-dessus du tableau qui ouvre un popover avec trois groupes de cases à cocher :

- **General specs** : Weight, Price
- **Rims** : Depth, Material, Type
- **Subcomponents** : Hub

La colonne **Model** est toujours affichée dans le tableau et **n'apparaît pas dans le sélecteur** (elle porte l'identité de la ligne — brand + model).

Choix retenus (validés) : popover déclenché par bouton, Model non listée dans le sélecteur, **état local React** dans MiniComparator (pas de Redux, pas de persistance entre rechargements).

## Approche

1. **Configuration des colonnes data-driven** : remplacer les `<th>`/`<td>` codés en dur par un map sur un tableau `COLUMNS` partagé entre le tableau et le sélecteur. Source unique pour les groupes et le rendu.
2. **État local dans MiniComparator** : `useState` initialisé avec toutes les colonnes toggleables à `true`. Passé en props à `ColumnSelector` (avec un setter) et à `ComparisonTable` (en lecture seule).
3. **Composant `ColumnSelector`** : bouton + popover flottant. Ferme sur clic extérieur (`useRef` + `mousedown` listener). Trois sections groupées avec checkboxes natives stylées Tailwind. Liste **seulement** les colonnes toggleables (Model exclue).
4. **Refactor `ComparisonTable`** : reçoit `visibility` en prop, filtre `COLUMNS` et map en deux passes (thead, tbody). Model étant marquée `required: true` dans la config, elle est toujours rendue indépendamment de l'objet `visibility`. Garde le chrome de carte et l'état vide intacts.

## Fichiers à créer

- **`frontend/src/components/MiniComparator/columnsConfig.js`**
  Exporte :
  - `COLUMNS` : tableau de `{ id, label, group, align?, required?, renderCell(w) }` pour les 7 colonnes. Model a `required: true` et `group: 'general'`.
  - `COLUMN_GROUPS` : `[{ id: 'general', label: 'General specs' }, { id: 'rims', label: 'Rims' }, { id: 'subs', label: 'Subcomponents' }]` — fixe l'ordre d'affichage dans le popover.
  - `DEFAULT_VISIBILITY` : objet `{ weight: true, price: true, depth: true, material: true, type: true, hub: true }` (Model non incluse — toujours visible, jamais toggle).
  - Déplace `HookBadge` ici (utilisé par le `renderCell` de la colonne `type`).
  - Importe `minPrice` depuis `../../store/selectors/wheelsSelectors` pour la colonne `price`.

- **`frontend/src/components/MiniComparator/ColumnSelector.jsx`**
  - Props : `visibility` (objet), `onToggle(id)` (callback).
  - Bouton "Columns" qui ouvre/ferme un popover positionné en `absolute`.
  - Popover : pour chaque groupe dans `COLUMN_GROUPS`, lister `COLUMNS.filter(c => c.group === group.id && !c.required)`. Chaque ligne = checkbox + label, dispatch `onToggle(c.id)` au changement.
  - Fermeture sur clic extérieur via `useRef` + `useEffect` qui attache un listener `mousedown` au document.

## Fichiers à modifier

- **`frontend/src/components/MiniComparator/MiniComparator.jsx`**
  - Ajouter `useState` initialisé avec `DEFAULT_VISIBILITY`.
  - Dans la cellule droite de la grille (actuellement `<ComparisonTable />` seul), insérer un wrapper flex-col :
    ```
    <div className="flex justify-end mb-3">
      <ColumnSelector visibility={visibility} onToggle={(id) => setVisibility(v => ({ ...v, [id]: !v[id] }))} />
    </div>
    <ComparisonTable visibility={visibility} />
    ```

- **`frontend/src/components/MiniComparator/ComparisonTable.jsx`**
  - Importer `COLUMNS` depuis `./columnsConfig`.
  - Accepter `visibility` en prop.
  - Calculer `cols = COLUMNS.filter(c => c.required || visibility[c.id])`.
  - Remplacer les `<th>` codés en dur (lignes 43-49) par `cols.map(c => <th key={c.id} className={...c.align==='right'?'text-right':''}>{c.label}</th>)`.
  - Remplacer les `<td>` codés en dur (lignes 55-75) par `cols.map(c => <td key={c.id} className={...}>{c.renderCell(w)}</td>)`.
  - Supprimer la définition locale de `HookBadge` (lignes 7-17) — déplacée dans `columnsConfig.js`.
  - Supprimer l'import direct de `minPrice` (utilisé maintenant via `columnsConfig.js`).

## Réutilisation

- **`HookBadge`** : déplacé dans `columnsConfig.js` (devient le `renderCell` de la colonne `type`).
- **`minPrice`** : sélecteur existant dans `wheelsSelectors.js`, utilisé par `renderCell` de la colonne `price`.
- **Patterns FilterPanel (Pill, Section)** : non extraits — non triviaux à généraliser, et `ColumnSelector` utilise des checkboxes (pas des pills). Petit groupement local de ~10 lignes dans `ColumnSelector.jsx`.

## Vérification

1. `npm run dev` dans `frontend/` et ouvrir la page MiniComparator. Le tableau affiche les 7 colonnes par défaut.
2. Cliquer sur le bouton "Columns" au-dessus du tableau → popover apparaît avec 3 sections : General specs (Weight, Price — **Model n'apparaît pas**), Rims (Depth, Material, Type), Subcomponents (Hub). Au total 6 cases à cocher.
3. Décocher **Weight** → la colonne Weight disparaît du header et de toutes les lignes ; Model reste visible ; le layout se réorganise sans casser l'alignement.
4. Décocher Depth, Material, Type → toutes les colonnes Rims disparaissent ; Model + colonnes restantes s'alignent correctement.
5. Cliquer en dehors du popover → il se ferme.
6. Appliquer un filtre dans FilterPanel (ex. cocher une marque) → les lignes filtrées respectent toujours la visibilité des colonnes choisie.
7. Recharger la page (F5) → toutes les colonnes redeviennent visibles (pas de persistance, comportement attendu).

## Fichiers critiques

- `MyBikeLab/frontend/src/components/MiniComparator/MiniComparator.jsx` (modifier)
- `MyBikeLab/frontend/src/components/MiniComparator/ComparisonTable.jsx` (modifier)
- `MyBikeLab/frontend/src/components/MiniComparator/ColumnSelector.jsx` (créer)
- `MyBikeLab/frontend/src/components/MiniComparator/columnsConfig.js` (créer)
