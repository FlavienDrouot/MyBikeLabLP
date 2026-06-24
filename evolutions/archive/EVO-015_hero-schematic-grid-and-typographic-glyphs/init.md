# EVO-015 — Hero schematic grid and typographic glyphs

## Origine

Issue de l'audit [`2026-05-26_design-system-frontend-audit.md`](../2026-05-26_design-system-frontend-audit.md), points **P2-9** et **P3-3**.

## Problème

Le design system spécifie deux signatures visuelles supplémentaires absentes du frontend :

1. **Grille schématique du Hero.** « Schematic grid (16-px or 32-px ruled grid in `ink-2`) — the *one* decorative background, used on the hero only. Evokes drafting paper / engineering blueprint. » Cf. [`design-system/README.md`](../../design-system/README.md) section « Backgrounds & patterns ». Le hero actuel ([`Hero.jsx`](../../frontend/src/components/Hero.jsx)) est plat.

2. **Glyphes typographiques.** Le DS recommande d'utiliser `→`, `↓ ↑`, `·`, `№`, `Ø`, `±`, `≈` plutôt que des icônes en UI compacte. Aucun usage dans la copy live ; l'UI kit landing en fait usage exemplaire (cf. [`design-system/ui_kits/landing/Hero.jsx:69-72`](../../design-system/ui_kits/landing/Hero.jsx#L69-L72), `Open comparator →`). Pour les données du comparator, des glyphes (`Ø 700C`, `± 2 g`) renforceraient la voice technique.

## Objectif

Ajouter la grille schématique en arrière-plan du Hero et adopter les glyphes typographiques dans la copy et les données affichées.

## Périmètre

**Inclus :**
- **Schematic grid Hero** : implémenter le pattern en CSS (`background-image: linear-gradient(...)` ou SVG répété) à 16 ou 32 px, en `ink-2` (≈ `#e4e2d6`). Visible uniquement sur le Hero. Veiller à la performance (pas de SVG lourd).
- **Glyphes CTAs** : tous les liens CTA portent leur arrow (`Open comparator →`, `See the roadmap →`). Pris en charge en partie par EVO-008 ; ici on étend aux CTAs hors Hero (BenefitsGrid → MiniComparator, RoadmapSection, etc.).
- **Glyphes data** : dans la ComparisonTable et le WheelDetailPanel, afficher les diamètres en `Ø 700C`, les depths en `33 mm` (déjà ok mais penser au prefix `Ø` si depth visualisée comme diameter), les tolerances éventuelles en `± N g`.
- **Glyphes dans wheelsData (lecture seule)** : décider si les unités du dataset doivent inclure des glyphes (`Ø`, `±`) ou si la mise en forme reste côté composant (recommandé : composant).

**Exclus :**
- Pas de changement de la structure du Hero (layout, sections) au-delà du fond.
- Pas de schematic SVG complet (wheel diagram) sur le Hero — la spec le réserve à la page wheel-detail.
- Pas de refonte de la copy elle-même (EVO-008).

## Fichiers connus à examiner

- [`design-system/README.md`](../../design-system/README.md) sections « Backgrounds & patterns » et « Iconography » (paragraphe « Typographic glyphs preferred over icons »)
- [`design-system/ui_kits/landing/landing.css`](../../design-system/ui_kits/landing/landing.css) — implémentation de référence de la grille (si présente)
- [`design-system/ui_kits/landing/Hero.jsx`](../../design-system/ui_kits/landing/Hero.jsx) — usage des glyphes (`→`, `Ø 700C`, `depth 33mm`)
- [`frontend/src/components/Hero.jsx`](../../frontend/src/components/Hero.jsx) — section à enrichir
- [`frontend/src/components/MiniComparator/ComparisonTable.jsx`](../../frontend/src/components/MiniComparator/ComparisonTable.jsx) — affichage des unités
- [`frontend/src/components/MiniComparator/WheelDetailPanel.jsx`](../../frontend/src/components/MiniComparator/WheelDetailPanel.jsx) — affichage des unités
- [`frontend/src/config/wheelProperties.jsx`](../../frontend/src/config/wheelProperties.jsx) — `renderCell` accessor (point d'extension naturel pour les glyphes)

## Critères d'acceptation (esquisse)

- [ ] Le Hero rend une grille subtile (16 ou 32 px) en `ink-2` visible à l'œil mais non distractrice.
- [ ] La grille n'apparaît que sur le Hero, pas sur les autres sections.
- [ ] Les CTAs principaux affichent un `→` final.
- [ ] Le diamètre des roues est rendu sous forme `Ø 700C` (ou équivalent) dans la table et le détail.
- [ ] Les unités numériques restent en `font-mono tabular-nums` (déjà en place).
- [ ] Lighthouse : pas de régression Performance / CLS sur le Hero (la grille n'introduit pas de layout shift).

## Dépendances / ordre

**Dépend d'EVO-007** (tokens) et **EVO-008** (copy refondue, eyebrow `№ 01`).

Possible à lancer après ces deux évolutions, indépendant de toutes les autres.

## Notes

- La grille peut être implémentée en CSS pur via `background-image: linear-gradient(to right, var(--ink-2) 1px, transparent 1px), linear-gradient(to bottom, var(--ink-2) 1px, transparent 1px); background-size: 32px 32px;` — simple, performant, accessible aux user-agents.
- Penser au mode mobile : la grille doit se réduire ou s'adoucir pour éviter de surcharger les écrans étroits.
- Les glyphes Unicode `→ Ø ± ≈ №` rendent en Inter sans problème (déjà chargé).
