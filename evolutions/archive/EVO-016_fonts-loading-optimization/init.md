# EVO-016 — Fonts loading optimization

## Origine

Issue de l'audit [`2026-05-26_design-system-frontend-audit.md`](../2026-05-26_design-system-frontend-audit.md), points **P3-1**, **P3-2**, **P3-5**.

## Problème

Trois optimisations de chargement n'ont pas d'impact UX critique mais améliorent la perception de performance et la rigueur du code :

1. **Inter chargé en 7 poids** (300 → 900) dans [`index.css:1`](../../frontend/src/index.css#L1). Le design system n'en utilise réellement que 6 (300, 400, 500, 600, 700, 800) — le poids 900 est superflu.

2. **Fonts chargés via `@import`** au lieu de `<link rel="preconnect">` + `<link rel="stylesheet">` dans [`index.html`](../../frontend/index.html). L'`@import` bloque la découverte de la requête fonts et dégrade marginalement le LCP.

3. **`scroll-padding-top: 5rem` codé en dur** dans [`index.css:10`](../../frontend/src/index.css#L10). Lié à la hauteur de la navbar — devrait être tokenisé pour éviter la dérive si la navbar change.

## Objectif

Optimiser le chargement des fonts et tokeniser le scroll-padding lié à la navbar.

## Périmètre

**Inclus :**
- Réduire l'import Inter aux 6 poids réellement utilisés : 300, 400, 500, 600, 700, 800.
- Migrer l'import Google Fonts depuis `@import` dans `index.css` vers `<link rel="preconnect">` + `<link rel="stylesheet">` dans `index.html`. Ajouter `preconnect` à `fonts.googleapis.com` et `fonts.gstatic.com` (avec `crossorigin`).
- Exposer la hauteur navbar comme variable CSS (`--navbar-height: 5rem` par exemple) et l'utiliser dans `scroll-padding-top` ainsi que dans la sticky offset des composants concernés.
- Vérifier en DevTools (Network + Lighthouse) que les requêtes fonts partent plus tôt et que LCP s'améliore (ou au minimum ne régresse pas).

**Exclus :**
- Pas de self-hosting des fonts (woff2 dans `fonts/`) — le DS le mentionne comme option future si CSP / performance le requiert ; pas dans ce scope.
- Pas de réduction des sub-sets (latin-only, etc.) ; rester sur les sub-sets par défaut de Google Fonts.
- Pas de modifications visuelles.

## Fichiers connus à examiner

- [`frontend/src/index.css:1`](../../frontend/src/index.css#L1) — `@import` actuel
- [`frontend/src/index.css:9-11`](../../frontend/src/index.css#L9-L11) — `scroll-padding-top: 5rem`
- [`frontend/index.html`](../../frontend/index.html) — `<head>` à enrichir
- [`frontend/src/components/Navbar.jsx`](../../frontend/src/components/Navbar.jsx) — hauteur sticky / classes `top-*` éventuelles
- [`frontend/src/components/MiniComparator/FilterPanel.jsx`](../../frontend/src/components/MiniComparator/FilterPanel.jsx) — `sticky top-20` qui dépend de la hauteur navbar
- [`design-system/colors_and_type.css:204-210`](../../design-system/colors_and_type.css#L204-L210) — section LAYOUT (peut être enrichie d'un `--navbar-height` à l'occasion)

## Critères d'acceptation (esquisse)

- [ ] L'URL Google Fonts chargée contient `wght@300;400;500;600;700;800` (pas de 900).
- [ ] `index.html` contient les `<link rel="preconnect">` pour `fonts.googleapis.com` et `fonts.gstatic.com` (avec `crossorigin`).
- [ ] `index.css` n'importe plus les fonts via `@import`.
- [ ] Une variable CSS `--navbar-height` (ou équivalent token) est définie une seule fois et consommée par `scroll-padding-top` et les éléments sticky.
- [ ] Lighthouse Performance ≥ score actuel ; LCP au moins équivalent.
- [ ] Aucune régression visuelle.

## Dépendances / ordre

**Indépendant** : peut être lancé en parallèle de toutes les autres EVO. La hauteur navbar tokenisée peut entrer dans `colors_and_type.css` si EVO-007 est terminée, sinon être ajoutée localement.

## Notes

- Ce chantier est principalement « hygiène » : le gain UX est modeste mais la maintenabilité augmente.
- Si l'option self-hosting est retenue plus tard, ce sera une nouvelle EVO.
