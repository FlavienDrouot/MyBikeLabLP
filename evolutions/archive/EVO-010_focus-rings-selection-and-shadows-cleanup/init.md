# EVO-010 — Focus rings, text selection, shadow cleanup

## Origine

Issue de l'audit [`2026-05-26_design-system-frontend-audit.md`](../2026-05-26_design-system-frontend-audit.md), points **P1-1**, **P1-2**, **P2-2**.

## Problème

Le design system codifie un système d'états très précis :
- **Focus :** `outline: 2px solid var(--brass-8); outline-offset: 2px` global ([`colors_and_type.css:408-412`](../../design-system/colors_and_type.css#L408-L412)).
- **Sélection texte :** `::selection { background: var(--brass-5); color: var(--ink-12); }` ([`colors_and_type.css:403-406`](../../design-system/colors_and_type.css#L403-L406)).
- **Ombres :** *« Almost never. Permitted only for floating menus »* (popovers, column-selector). Cartes, drawers et boutons en sont exclus.

Or :
- Aucune règle `:focus-visible` globale dans le frontend. La plupart des inputs n'ont que `focus:border-brass-8` (changement de bordure seul, sans outline). Accessibilité dégradée pour utilisateurs clavier.
- Aucune règle `::selection` : la sélection texte tombe sur le bleu système.
- Ombres non conformes présentes : `shadow-xl` sur le drawer mobile filtres, `shadow-sm` sur le bouton mobile « Filters » et le menu ColumnSelector, `box-shadow: 0 1px 3px rgba(0,0,0,0.25)` sur les thumbs des range sliders dans [`FilterPanel.module.css`](../../frontend/src/components/MiniComparator/FilterPanel.module.css).

## Objectif

Harmoniser focus / selection / shadows avec le design system : focus ring brass uniforme, sélection brass, ombres bannies sauf sur les menus flottants stricts.

## Périmètre

**Inclus :**
- Ajouter une règle `:focus-visible` globale (idéalement dans `index.css`) reprenant le DS.
- Ajouter une règle `::selection` globale.
- Supprimer `shadow-xl` du drawer mobile filtres et le remplacer par une bordure 1px hairline ou un keyline.
- Supprimer `shadow-sm` du bouton mobile « Filters ».
- Décider du sort de l'ombre du menu ColumnSelector : la conserver (autorisée par le DS comme « floating menu ») mais en aligner les valeurs sur `--shadow-menu` du DS (`0 1px 0 0 var(--ink-10), 0 8px 24px -12px rgba(14, 15, 12, 0.18)`).
- Supprimer le `box-shadow` des thumbs des range sliders et le remplacer par une bordure ink hairline.

**Exclus :**
- Pas de refonte des composants concernés au-delà des règles d'état (pas de restyling des inputs / boutons hors focus).
- Pas de gestion du focus à la souris (`:focus` non visible) — seul `:focus-visible` est dans le scope.

## Fichiers connus à examiner

- [`design-system/colors_and_type.css:135-145`](../../design-system/colors_and_type.css#L135-L145) — `--shadow-menu`, `--shadow-focus`
- [`design-system/colors_and_type.css:403-412`](../../design-system/colors_and_type.css#L403-L412) — `::selection` et `:focus-visible` de référence
- [`frontend/src/index.css`](../../frontend/src/index.css) — endroit naturel pour les règles globales
- [`frontend/src/components/MiniComparator/MiniComparator.jsx`](../../frontend/src/components/MiniComparator/MiniComparator.jsx) — drawer (`shadow-xl`), bouton mobile (`shadow-sm`)
- [`frontend/src/components/MiniComparator/ColumnSelector.jsx`](../../frontend/src/components/MiniComparator/ColumnSelector.jsx) — menu flottant
- [`frontend/src/components/MiniComparator/FilterPanel.module.css`](../../frontend/src/components/MiniComparator/FilterPanel.module.css) — `box-shadow` des thumbs
- [`frontend/src/components/MiniComparator/FilterPanel.jsx`](../../frontend/src/components/MiniComparator/FilterPanel.jsx) — focus sur inputs

## Critères d'acceptation (esquisse)

- [ ] Naviguer au clavier (Tab) affiche un outline `brass-8` 2 px avec 2 px d'offset autour de tout élément focusable.
- [ ] Sélectionner du texte produit un fond `brass-5` et un texte `ink-12`.
- [ ] Aucune occurrence de `shadow-xl`, `shadow-lg`, `shadow-md`, `shadow-sm` dans le code frontend, sauf justifiée par le DS (menu flottant).
- [ ] Le menu ColumnSelector utilise `var(--shadow-menu)` (ou son équivalent Tailwind).
- [ ] Les thumbs des range sliders n'ont plus de `box-shadow` ; ils restent visuellement détectables (bordure / contraste).
- [ ] Pas de régression mobile sur l'ouverture du drawer filtres.

## Dépendances / ordre

**Dépend d'EVO-007** : la règle globale `:focus-visible` est plus propre si elle peut référencer `var(--brass-8)` venant du DS.

Indépendant des EVO-008, 009, 011-016.

## Notes

- `:focus-visible` est désormais supporté largement (Chrome 86+, Firefox 85+, Safari 15.4+).
- Les ombres ont souvent été ajoutées pour gérer le contraste mobile (drawer flottant sur paper) : prévoir une alternative (overlay paper-2 + bordure ink-10) si la PRD le demande.
