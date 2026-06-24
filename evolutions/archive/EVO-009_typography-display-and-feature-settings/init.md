# EVO-009 — Display typography and font-feature-settings

## Origine

Issue de l'audit [`2026-05-26_design-system-frontend-audit.md`](../2026-05-26_design-system-frontend-audit.md), points **P0-3** et **P2-3**.

## Problème

La signature typographique du design system est une combinaison précise : `.t-display-1` = `font-weight: 800` + `letter-spacing: -0.045em` + `line-height: 0.9` ([`colors_and_type.css:241-247`](../../design-system/colors_and_type.css#L241-L247)). Le body active `font-feature-settings: 'ss01', 'ss02', 'cv11'` ([`colors_and_type.css:226`](../../design-system/colors_and_type.css#L226)) pour activer les alt glyphs d'Inter.

Or :
- Le Hero H1 utilise `font-bold` (700) + `tracking-tight` (Tailwind ≈ -0.025em) : poids 800 d'Inter chargé mais jamais utilisé en pratique. Cf. [`Hero.jsx:13`](../../frontend/src/components/Hero.jsx#L13).
- `.section-title` ([`index.css:36-38`](../../frontend/src/index.css#L36-L38)) idem.
- Aucune feature settings activée sur le body — les variants stylistiques d'Inter ne sont jamais utilisés.

Résultat : la « densité considérée, presque Apple » du DS est diluée en typo générique SaaS.

## Objectif

Appliquer fidèlement les poids et tracking des display headings spécifiés par le design system, et activer les font-feature-settings sur le body.

## Périmètre

**Inclus :**
- Hisser le Hero H1 à `font-weight: 800` + `letter-spacing: -0.045em` (équivalent `.t-display-1`).
- Définir les autres niveaux de heading (`.section-title`, h2/h3 de sections) selon `.t-h1` / `.t-h2` / `.t-h3` du DS.
- Activer `font-feature-settings: 'ss01', 'ss02', 'cv11'` sur le body.
- Étendre `tailwind.config.js` avec des `fontWeight.black: 800` accessibles et des tracking spec (`tracking-display-1: -0.045em`, etc.) — ou utiliser directement les classes sémantiques `.t-*` si EVO-007 les a exposées.
- Vérifier les rendus sur Chrome / Firefox / Safari.

**Exclus :**
- Pas de refonte de la grille typographique générale (sizes, leading) — l'audit ne signale pas d'écart majeur sur ce point.
- Pas de chargement de poids supplémentaires (déjà couvert par P3-1 / EVO-016).

## Fichiers connus à examiner

- [`design-system/colors_and_type.css:241-336`](../../design-system/colors_and_type.css#L241-L336) — classes `.t-display-1`, `.t-display-2`, `.t-h1`-`.t-h4`, `.t-mono`, `.t-numeric`
- [`design-system/colors_and_type.css:218-229`](../../design-system/colors_and_type.css#L218-L229) — règles body avec `font-feature-settings`
- [`frontend/src/index.css:12-15`](../../frontend/src/index.css#L12-L15) — body styles à enrichir
- [`frontend/src/index.css:36-38`](../../frontend/src/index.css#L36-L38) — `.section-title` à refondre
- [`frontend/src/components/Hero.jsx:13`](../../frontend/src/components/Hero.jsx#L13) — H1 à hisser
- Tous les composants utilisant `font-bold` ou `.section-title` : `Hero`, `BenefitsGrid`, `RoadmapSection`, `PartnershipSection`, `MiniComparator`, `ContactForm`.

## Critères d'acceptation (esquisse)

- [ ] Le H1 du Hero rend en `font-weight: 800` + `letter-spacing: -0.045em` (vérifiable dans DevTools).
- [ ] Le body applique `font-feature-settings: 'ss01', 'ss02', 'cv11'` (vérifiable dans DevTools).
- [ ] Les section titles utilisent une classe sémantique alignée sur `.t-h1` du DS (poids 500, tracking-tighter).
- [ ] Comparaison visuelle Hero avant/après : densité accrue, contre-forme tighter.
- [ ] Aucun composant ne reste sur l'ancien `font-bold + tracking-tight` quand le rôle est « display heading ».

## Dépendances / ordre

**Dépend d'EVO-007** : nécessite que les tokens / classes sémantiques du DS soient accessibles depuis le frontend (ou au minimum que `tailwind.config.js` ait été étendu avec les nouvelles valeurs de tracking et de fontWeight).

## Notes

- Le poids 800 d'Inter est déjà téléchargé via l'import Google Fonts actuel : aucun surcoût réseau.
- Sur les écrans très petits, le tracking -0.045em peut donner une lecture trop serrée : prévoir une variante responsive si la PRD le demande.
