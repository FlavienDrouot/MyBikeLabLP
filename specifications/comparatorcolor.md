# Ajouter du contraste à la section MiniComparator

## Contexte

La section MiniComparator (`#tool`) sur la landing page de MyBikeLab apparaît actuellement entièrement blanche : la section elle-même hérite du `bg-white` du `body`, et ses deux cartes enfants (`FilterPanel` et `ComparisonTable`) utilisent la classe `.card` qui est aussi `bg-white`. Résultat : aucune séparation visuelle entre la page et les cartes, ce qui donne un effet « blanc sur blanc » trop plat.

L'objectif : ajouter un fond subtilement contrasté à la section pour que les cartes blanches ressortent et que la section se détache visuellement de Hero (au-dessus) et RoadmapSection (en-dessous).

## Approche recommandée

Ajouter une classe de fond gris très clair à la balise `<section>` de `MiniComparator.jsx`. La palette Tailwind du projet contient déjà `ink-100` (`#f1f5f9`), un gris ardoise très clair déjà utilisé pour les bordures des cartes — l'utiliser comme fond garde la cohérence chromatique.

**Changement unique :**

Fichier : [frontend/src/components/MiniComparator/MiniComparator.jsx](../frontend/src/components/MiniComparator/MiniComparator.jsx)

Ligne 6 :
```jsx
// Avant
<section id="tool" className="section">

// Après
<section id="tool" className="section bg-ink-100/60">
```

L'opacité `/60` adoucit encore le gris pour rester « un peu de contraste » et non un changement marqué. Si après visualisation le contraste est trop faible, on pourra passer à `bg-ink-100` (pleine opacité) ou tester `bg-brand-50/40` (très léger bleu, dans la continuité du dégradé du Hero).

## Alternatives envisagées (non retenues par défaut)

- `bg-brand-50` (bleu très clair `#eff6ff`) — cohérent avec le Hero mais ajoute une teinte colorée plutôt qu'un simple contraste neutre.
- Dégradé doux `bg-gradient-to-b from-ink-100/60 to-white` — plus sophistiqué mais plus lourd à régler.

Je peux basculer vers une de ces options si l'effet gris uni n'est pas satisfaisant.

## Fichiers concernés

- [frontend/src/components/MiniComparator/MiniComparator.jsx](../frontend/src/components/MiniComparator/MiniComparator.jsx) — une seule ligne modifiée

Aucun autre fichier (ni `index.css`, ni `tailwind.config.js`, ni les composants enfants) n'a besoin d'être touché : `ink-100` existe déjà dans la palette.

## Vérification

1. Lancer le dev server frontend (`npm run dev` depuis `MyBikeLab/frontend`).
2. Ouvrir la landing page dans le navigateur.
3. Scroller jusqu'à la section « Start with Wheels — Explore Components ».
4. Vérifier visuellement :
   - Le fond de la section est légèrement gris (vs blanc pur du Hero au-dessus).
   - Les cartes `FilterPanel` et `ComparisonTable` ressortent désormais avec leur fond blanc et leur ombre `shadow-sm`.
   - La transition vers `RoadmapSection` (en-dessous) reste fluide.
5. Tester en responsive (mobile + desktop) pour s'assurer que le contraste fonctionne aux deux breakpoints.
