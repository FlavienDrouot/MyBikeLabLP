# EVO-007 — Wire design tokens as the single source of truth

## Origine

Issue de l'audit [`2026-05-26_design-system-frontend-audit.md`](../2026-05-26_design-system-frontend-audit.md), points **P0-2** et **P1-3**.

## Problème

Aujourd'hui, le fichier [`design-system/colors_and_type.css`](../../design-system/colors_and_type.css) déclare ~150 variables CSS (palettes 12 paliers, spacing, radii, elevation, typography, motion) ainsi que des classes sémantiques (`.t-display-1`, `.t-h1`, `.t-label`, `.t-mono`, `.t-annotation`, `.t-section-index`, `.rule`, `.rule-strong`, `.rule-double`). Or :
- Ce fichier **n'est jamais importé** par le frontend.
- [`frontend/tailwind.config.js:21-68`](../../frontend/tailwind.config.js#L21-L68) ré-déclare manuellement les palettes paper / ink / brass / sage.
- Le token `--tracking-widest: 0.18em` du DS est trahi par Tailwind dont `tracking-widest = 0.1em` (sous-trackage de 45 % sur tous les labels caps).
- Les classes sémantiques du DS sont **inaccessibles** depuis les composants React.

## Objectif

Établir [`design-system/colors_and_type.css`](../../design-system/colors_and_type.css) comme **source unique de vérité** des tokens, et exposer ses valeurs (et idéalement ses classes sémantiques) au frontend React via Tailwind.

## Périmètre

**Inclus :**
- Importer ou inliner `colors_and_type.css` dans le pipeline Vite/Tailwind du frontend.
- Refactorer `tailwind.config.js` pour consommer les variables CSS du DS (`var(--paper-1)`, etc.) plutôt que de dupliquer les valeurs hex.
- Étendre `tailwind.config.js` avec : `letterSpacing.widest = '0.18em'`, accès aux familles `--font-display` / `--font-sans` / `--font-mono`.
- Rendre les classes sémantiques (`.t-display-1`, `.t-h1`, `.t-label`, `.t-mono`, `.t-annotation`, `.t-section-index`, `.rule`, `.rule-strong`) utilisables dans les composants (soit via import direct du CSS, soit via plugin Tailwind, soit en les portant en `@layer components`).
- Décider de la stratégie : import direct du fichier source-of-truth versus copie générée. Documenter le choix.

**Exclus :**
- Aucun refactor visuel sur les composants existants (couvert par les EVO suivantes).
- Aucun changement dans `design-system/` (read-only depuis le frontend).
- Adoption progressive des classes sémantiques : ne pas réécrire tous les composants dans cette évolution.

## Fichiers connus à examiner

- [`design-system/colors_and_type.css`](../../design-system/colors_and_type.css) — toute la spec tokens
- [`frontend/tailwind.config.js`](../../frontend/tailwind.config.js) — palettes dupliquées (lignes 21-68), `borderRadius.xs` (74-76), `fontFamily` (70-73)
- [`frontend/src/index.css`](../../frontend/src/index.css) — import Google Fonts (ligne 1), `@layer base` body styles (12-15), `@layer components` (17-45)
- [`frontend/vite.config.js`](../../frontend/vite.config.js) — pour gérer l'import inter-dossier
- [`frontend/postcss.config.js`](../../frontend/postcss.config.js)

## Critères d'acceptation (esquisse)

- [ ] Les valeurs hex des palettes paper / ink / brass / sage n'apparaissent **qu'à un seul endroit** dans le repo (le fichier DS).
- [ ] Modifier `--brass-7` dans `colors_and_type.css` change immédiatement la couleur des CTA primaires en dev (HMR).
- [ ] `class="tracking-widest"` produit 0.18em en CSS calculé.
- [ ] Au moins une classe sémantique (`.t-label` par exemple) est utilisable dans un composant React et rend correctement.
- [ ] La palette `brand-*` retraitée est supprimée si plus aucun composant ne s'y réfère (vérification par grep).
- [ ] Pas de régression visuelle sur la page Landing (capture avant/après identique).

## Dépendances / ordre

**Fondation** — à traiter en premier. EVO-009, EVO-010, EVO-011, EVO-013, EVO-014, EVO-015 dépendent de ce socle.

## Notes

- Cette évolution est de nature « plomberie » : faible impact visuel direct, fort impact sur la maintenabilité de toutes les suivantes.
- Le choix d'architecture (import direct vs copie générée) mérite une PRD courte avant tech-specs — la lecture cross-folder dans Vite peut nécessiter un alias.
