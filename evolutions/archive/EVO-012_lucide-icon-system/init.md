# EVO-012 — Lucide as the canonical icon system

## Origine

Issue de l'audit [`2026-05-26_design-system-frontend-audit.md`](../2026-05-26_design-system-frontend-audit.md), point **P1-5**.

## Problème

Le design system prescrit **Lucide** comme système d'icônes unique, avec un style technique précis : `stroke-width: 1.4`, `stroke-linecap: square`, `stroke-linejoin: miter`. Cette esthétique « drafting / technical » est volontaire — elle évite les icônes friendly-rounded incompatibles avec la voice. Cf. [`design-system/README.md`](../../design-system/README.md) section Iconography.

Or, le frontend **ne dispose d'aucun système d'icônes** : chaque composant inline ses propres SVGs ad-hoc (hamburger dans Navbar, chevrons dans FilterPanel et ComparisonTable, check dans MultiSelect, croix dans le drawer, etc.). Les valeurs de stroke, les caps, et la taille varient d'un composant à l'autre. La maintenabilité est mauvaise (changer un chevron exige de toucher plusieurs fichiers).

## Objectif

Adopter Lucide comme bibliothèque unique d'icônes du frontend, avec un wrapper qui force les conventions DS (stroke 1.4, square caps, miter joins, `currentColor`).

## Périmètre

**Inclus :**
- Installer Lucide (recommandé : `lucide-react` via npm).
- Définir un wrapper / preset `<Icon name="..."/>` ou conventions communes pour chaque usage (taille 14 / 16 / 20 px selon le contexte, stroke 1.4, color: currentColor).
- Inventorier toutes les icônes inline du frontend.
- Remplacer chaque SVG inline par son équivalent Lucide :
  - hamburger / menu (Navbar)
  - chevron up/down (FilterPanel sections, sort indicator, dropdowns)
  - check (multi-select, ColumnSelector)
  - X / close (drawer mobile)
  - chevron-right / arrow-right pour les liens CTA (« → »)
- Décider du mode de chargement : tree-shaken via `lucide-react` (recommandé) vs CDN (déconseillé pour la bundle stability).

**Exclus :**
- Pas d'illustrations schématiques (wheel SVG dans `assets/wheel-schematic.svg`) : celles-ci restent en SVG dédié, ce ne sont pas des icônes.
- Pas de brand icons (X, GitHub, etc.) qui doivent garder leur stroke d'origine.
- Pas de refonte des composants au-delà de l'icône (pas de changement de layout).

## Fichiers connus à examiner

- [`frontend/src/components/Navbar.jsx`](../../frontend/src/components/Navbar.jsx) — hamburger
- [`frontend/src/components/MiniComparator/MiniComparator.jsx`](../../frontend/src/components/MiniComparator/MiniComparator.jsx) — bouton mobile Filters, close drawer
- [`frontend/src/components/MiniComparator/FilterPanel.jsx`](../../frontend/src/components/MiniComparator/FilterPanel.jsx) — chevrons d'accordéon, check de multi-select
- [`frontend/src/components/MiniComparator/ComparisonTable.jsx`](../../frontend/src/components/MiniComparator/ComparisonTable.jsx) — chevron expand row, indicateur de tri
- [`frontend/src/components/MiniComparator/ColumnSelector.jsx`](../../frontend/src/components/MiniComparator/ColumnSelector.jsx) — chevron toggle
- [`frontend/src/components/ContactForm.jsx`](../../frontend/src/components/ContactForm.jsx) — check success state
- [`frontend/src/components/Footer.jsx`](../../frontend/src/components/Footer.jsx) — éventuels social icons
- [`frontend/package.json`](../../frontend/package.json) — pour ajouter `lucide-react`
- [`design-system/README.md`](../../design-system/README.md) section Iconography — règles

## Critères d'acceptation (esquisse)

- [ ] `lucide-react` (ou équivalent) installé en dépendance.
- [ ] Aucun `<svg>` inline ad-hoc ne subsiste dans `src/components/` pour les icônes UI (hamburger, chevron, check, close, arrow).
- [ ] Toutes les icônes UI rendent avec `stroke-width="1.4"`, `stroke-linecap="square"`, `stroke-linejoin="miter"`.
- [ ] Toutes les icônes héritent de la couleur via `currentColor`.
- [ ] Bundle size : l'ajout reste tree-shaken (vérifier le bundle final, attendu < 15 KB d'icônes).
- [ ] Pas de régression visuelle hors style d'icône (la disposition reste identique).

## Dépendances / ordre

**Indépendant** : peut être lancé en parallèle d'EVO-007. Le wrapper peut référencer directement les classes Tailwind sans dépendre des tokens DS.

## Notes

- Le DS mentionne « ⚠️ This is a substitution flagged for the user » : confirmer en Needs Assessment si Lucide est validé ou si l'utilisateur préfère Phosphor / Tabler.
- Penser à inclure des tests visuels (avant/après) sur les composants les plus visibles (Navbar, MiniComparator).
