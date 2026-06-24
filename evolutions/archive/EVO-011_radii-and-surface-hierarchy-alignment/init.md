# EVO-011 — Radii semantics and surface hierarchy

## Origine

Issue de l'audit [`2026-05-26_design-system-frontend-audit.md`](../2026-05-26_design-system-frontend-audit.md), points **P1-4**, **P1-6**, **P2-1**.

## Problème

Le design system codifie une grammaire stricte des surfaces et des radii :
- **Radius :** `0` pour cards / panels / tables, `2px` pour inputs / buttons (`radius-xs`), `999px` (`radius-pill`) **réservé aux pill badges de statut uniquement**.
- **Surfaces :** `--bg-page = paper-1` ; `paper-0` réservé aux **cards élevées** ; `paper-2` pour les recessed wells (table headers, filter wells).
- **Navbar :** `rgba(246,244,239,0.88) + blur(8px)` — paper-1 à 88 % d'opacité.

Or :
- Filter pills multi-select, MVP badge du Hero ([`Hero.jsx:10-12`](../../frontend/src/components/Hero.jsx#L10-L12)), boutons d'icônes (close drawer) utilisent `rounded-full` alors qu'il ne s'agit pas de status badges. La distinction sémantique entre « pill statut » et « pill filtre » est perdue.
- Le Hero force `bg-paper-0` ([`Hero.jsx:7`](../../frontend/src/components/Hero.jsx#L7)) au lieu de laisser `bg-paper-1` (l'élévation est inversée : la page paraît surélevée par rapport au reste).
- La Navbar utilise `bg-paper-0/80 backdrop-blur` : paper-0 au lieu de paper-1, 0.80 au lieu de 0.88.

## Objectif

Restaurer la grammaire des radii (square par défaut, pill seulement pour les statuts) et la hiérarchie de surfaces (paper-1 = page, paper-0 = card élevée).

## Périmètre

**Inclus :**
- Identifier tous les usages de `rounded-full` dans `frontend/src/components/` et trier :
  - **Conserver :** status badges (HookBadge, ex. « Hookless / Hooked »), avatar logos circulaires si pertinent.
  - **Changer en `rounded-xs`** : filter pills multi-select, MVP badge du Hero, boutons icônes.
- Retirer `bg-paper-0` du Hero, laisser hériter `bg-paper-1` du body.
- Aligner la Navbar : `bg-paper-1/88 backdrop-blur-[8px]` (ou équivalent inline via classe Tailwind / arbitrary value).
- Vérifier que les cards continuent d'utiliser `bg-paper-0` (élévation correcte) — c'est déjà le cas dans `.card` de [`index.css:42-44`](../../frontend/src/index.css#L42-L44).

**Exclus :**
- Pas de modification de la palette elle-même (couvert par EVO-007).
- Pas de refonte des composants concernés au-delà du radius/surface ; pas de restyling des contenus.
- Le HookBadge reste circulaire (statut légitime).

## Fichiers connus à examiner

- [`design-system/colors_and_type.css:126-130`](../../design-system/colors_and_type.css#L126-L130) — tokens radii
- [`design-system/colors_and_type.css:79-83`](../../design-system/colors_and_type.css#L79-L83) — tokens surfaces (`--bg-page`, `--bg-elevated`, etc.)
- [`design-system/README.md`](../../design-system/README.md) sections « Borders, shadows, transparency » et « Cards »
- [`frontend/src/components/Hero.jsx:7,10-12`](../../frontend/src/components/Hero.jsx#L7) — `bg-paper-0` et MVP badge
- [`frontend/src/components/Navbar.jsx`](../../frontend/src/components/Navbar.jsx) — `bg-paper-0/80 backdrop-blur`
- [`frontend/src/components/MiniComparator/FilterPanel.jsx`](../../frontend/src/components/MiniComparator/FilterPanel.jsx) — pills multi-select
- [`frontend/src/components/MiniComparator/MiniComparator.jsx`](../../frontend/src/components/MiniComparator/MiniComparator.jsx) — bouton close `rounded-full hover:bg-ink-2`
- [`frontend/src/components/MiniComparator/badges.jsx`](../../frontend/src/components/MiniComparator/badges.jsx) — HookBadge (à conserver en pill)

## Critères d'acceptation (esquisse)

- [ ] Inventaire des `rounded-full` documenté : chaque usage est soit conservé (status badge), soit refondu en `rounded-xs`.
- [ ] Le Hero rend sur `bg-paper-1` (mêmes octets RGB que le reste de la page).
- [ ] La Navbar rend sur `rgba(246,244,239,0.88)` avec blur 8px.
- [ ] Test A/B visuel sur la Landing : la hiérarchie est préservée (cards visibles comme « élevées »).
- [ ] Pas de régression d'accessibilité (contraste maintenu sur les filtres après refonte).

## Dépendances / ordre

**Dépend d'EVO-007** pour la cohérence des classes / valeurs Tailwind. Indépendant des autres.

## Notes

- Le scope « MVP badge » du Hero recoupe en partie EVO-008 (qui en réécrit le contenu en `№ 01 · MVP v0.1`). Coordination : EVO-008 traite le **contenu**, EVO-011 traite le **radius/surface**. Lancer dans cet ordre permet d'éviter les conflits de merge.
