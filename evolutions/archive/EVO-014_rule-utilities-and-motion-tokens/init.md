# EVO-014 — Rule utilities, motion tokens, annotation style

## Origine

Issue de l'audit [`2026-05-26_design-system-frontend-audit.md`](../2026-05-26_design-system-frontend-audit.md), points **P2-6**, **P2-7**, **P2-8**.

## Problème

Trois primitives du design system sont absentes du frontend :

1. **Utilitaires `.rule`, `.rule-strong`, `.rule-faint`, `.rule-double`** ([`colors_and_type.css:384-400`](../../design-system/colors_and_type.css#L384-L400)) — les dividers hairline qui doivent porter la hiérarchie « keylines do the work ». Aujourd'hui chaque divider est codé en `border-b border-ink-3` ou `border-ink-4` au cas par cas, sans cohérence.

2. **Tokens motion** — durations (`--duration-instant: 80ms`, `--duration-quick: 140ms`, `--duration-base: 220ms`, `--duration-slow: 400ms`) et easings (`--ease-standard: cubic-bezier(0.2, 0, 0, 1)`, `--ease-emphasized: cubic-bezier(0.32, 0.72, 0, 1)`) du DS ([`colors_and_type.css:196-201`](../../design-system/colors_and_type.css#L196-L201)). Le frontend n'utilise que `transition-colors` Tailwind par défaut (150 ms ease-out).

3. **Classe `.t-annotation`** ([`colors_and_type.css:360-367`](../../design-system/colors_and_type.css#L360-L367)) — italique Inter pour les disclaimers (« *indicative price, sourced 2025-Q2* »). Aucun composant ne l'utilise alors que `wheelsData.js` contient des prix indicatifs qui devraient porter cette annotation.

## Objectif

Exposer ces trois primitives au frontend et les appliquer là où elles ont du sens, sans refonte des composants.

## Périmètre

**Inclus :**
- **Rule utilities :** rendre `.rule`, `.rule-strong`, `.rule-faint`, `.rule-double` utilisables dans les composants React (via `@layer components` dans `index.css` ou import direct de `colors_and_type.css` — dépend d'EVO-007). Remplacer les dividers manuels dans les composants clés (Footer, Roadmap, Partnership, MiniComparator header) par ces classes.
- **Motion tokens :** étendre `tailwind.config.js` avec :
  - `transitionDuration: { instant: '80ms', quick: '140ms', base: '220ms', slow: '400ms' }`
  - `transitionTimingFunction: { 'ds-standard': 'cubic-bezier(0.2, 0, 0, 1)', 'ds-emphasized': 'cubic-bezier(0.32, 0.72, 0, 1)' }`
  Remplacer dans les composants les `transition-colors` (durée par défaut) par les nouveaux tokens (probablement `duration-quick` + `ease-ds-standard` pour les hovers, `duration-base` pour les états plus marqués).
- **`.t-annotation` :** exposer la classe et l'appliquer là où une donnée indicative est affichée — au minimum sur les prix dans la ComparisonTable (footer de cellule, tooltip, ou ligne « source ») et dans le WheelDetailPanel.

**Exclus :**
- Pas de refonte des composants au-delà des dividers / transitions / annotations.
- Pas d'ajout d'animations (slide-ins, fades) non présentes aujourd'hui.

## Fichiers connus à examiner

- [`design-system/colors_and_type.css:196-201`](../../design-system/colors_and_type.css#L196-L201) — motion tokens
- [`design-system/colors_and_type.css:360-367`](../../design-system/colors_and_type.css#L360-L367) — `.t-annotation`
- [`design-system/colors_and_type.css:384-400`](../../design-system/colors_and_type.css#L384-L400) — rule classes
- [`frontend/tailwind.config.js`](../../frontend/tailwind.config.js) — extension `transitionDuration` et `transitionTimingFunction`
- [`frontend/src/index.css`](../../frontend/src/index.css) — `@layer components` pour les rule classes si import indirect
- [`frontend/src/components/Footer.jsx`](../../frontend/src/components/Footer.jsx) — divider candidat
- [`frontend/src/components/RoadmapSection.jsx`](../../frontend/src/components/RoadmapSection.jsx) — dividers entre phases
- [`frontend/src/components/MiniComparator/ComparisonTable.jsx`](../../frontend/src/components/MiniComparator/ComparisonTable.jsx) — `divide-y divide-ink-3`, header `border-b border-ink-3` (candidats pour `.rule`)
- [`frontend/src/data/wheelsData.js`](../../frontend/src/data/wheelsData.js) — prix indicatifs à annoter

## Critères d'acceptation (esquisse)

- [ ] Au moins 3 composants utilisent une classe `.rule*` à la place d'un `border-*` ad-hoc.
- [ ] Les transitions hover (Navbar, boutons, table rows) utilisent les nouveaux tokens (`duration-quick` ou `duration-base` + `ease-ds-standard`).
- [ ] La ComparisonTable (ou le WheelDetailPanel) affiche au moins une annotation italique « *indicative price, sourced 2025-Q2* » via `.t-annotation`.
- [ ] Aucun composant ne perd de fonctionnalité.
- [ ] Pas de régression de timing perceptible (les durées 140-220 ms restent dans la plage UX attendue).

## Dépendances / ordre

**Dépend d'EVO-007** pour l'accès aux tokens DS (motion + classes `.rule*` et `.t-annotation`).

Indépendant des autres EVO.

## Notes

- Ce chantier est principalement « expose & wire » — peu de refonte visuelle, beaucoup de remplacement cosmétique.
- Bien noter que les transitions Tailwind par défaut sont `transition: all 150ms ease`, soit ≈ `duration-quick` mais avec un easing différent (`ease` ≈ `cubic-bezier(0.25, 0.1, 0.25, 1)`, plus mou que `0.2, 0, 0, 1`). Le changement reste subtil.
- Les annotations doivent rester discrètes — penser à les afficher seulement au survol ou en sous-texte pour ne pas alourdir la table.
