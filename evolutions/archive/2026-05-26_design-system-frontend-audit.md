# Audit — Design system ↔ Frontend

- **Date :** 2026-05-26
- **Auteur :** Flavien Drouot (analyse assistée par Claude)
- **Périmètre :** comparaison entre la spécification `MyBikeLab/design-system/` et le code React en production `MyBikeLab/frontend/`
- **Statut :** rapport préparatoire — sert d'origine aux évolutions EVO-007 à EVO-016

---

## 1. Contexte

Le dossier [`design-system/`](../design-system/) a été produit comme spécification de référence (tokens, UI kits, preview, voice). Le code [`frontend/`](../frontend/) est l'application React 19 + Vite + Tailwind 3 en production. Ce rapport identifie les écarts entre les deux et propose dix chantiers d'amélioration, classés par criticité.

**Sources lues :**
- [`design-system/README.md`](../design-system/README.md), [`design-system/colors_and_type.css`](../design-system/colors_and_type.css)
- [`design-system/ui_kits/landing/Hero.jsx`](../design-system/ui_kits/landing/Hero.jsx) (référence voice + typographie)
- [`frontend/tailwind.config.js`](../frontend/tailwind.config.js), [`frontend/src/index.css`](../frontend/src/index.css), [`frontend/index.html`](../frontend/index.html)
- Composants `Navbar`, `Hero`, `BenefitsGrid`, `MiniComparator/*`, `RoadmapSection`, `PartnershipSection`, `ContactForm`, `Footer`, `Landing.jsx`
- [`frontend/src/config/wheelProperties.jsx`](../frontend/src/config/wheelProperties.jsx)

**Méthode :** lecture de la spec, puis deux agents `Explore` lancés en parallèle (un sur le design system, un sur le frontend), puis recoupements ligne à ligne sur les fichiers sensibles.

---

## 2. Synthèse

| Niveau | Code | Nombre |
|---|---|---:|
| P0 — Critique : identité de marque | P0-1 à P0-4 | 4 |
| P1 — Important : règles structurelles | P1-1 à P1-6 | 6 |
| P2 — Notable : finitions et fidélité | P2-1 à P2-9 | 9 |
| P3 — Faible : optimisations | P3-1 à P3-5 | 5 |
| **Total** | | **24** |

Les 24 écarts sont regroupés en **10 chantiers** (EVO-007 à EVO-016) — un dossier d'évolution par chantier, avec son propre `init.md`.

---

## 3. P0 — Critique : violations de l'identité de marque

Ces écarts sont visibles dès le premier scroll et trahissent directement la voice / les fondations visuelles.

### P0-1. Voice du Hero hors-charte
- **Spec :** « Wheels, measured. Not marketed. » — voice neutre, technique, anti-marketing. Le design system interdit explicitement « revolutionary », « game-changer », « future of », « intelligence » comme marketing buzzwords. Cf. [`design-system/README.md`](../design-system/README.md) sections Voice et Examples.
- **Code :** [`Hero.jsx:13-15`](../frontend/src/components/Hero.jsx#L13-L15) — *« The Future of Bike Component Intelligence »*. CTA *« See the Vision »* également off-voice.
- **Impact :** première lecture du site, contradiction frontale avec la promesse éditoriale du design system.

### P0-2. Tokens dupliqués, pas de source de vérité
- **Spec :** [`colors_and_type.css`](../design-system/colors_and_type.css) déclare ~150 variables CSS (palettes 12 paliers, spacing, radii, elevation, typography, motion) ainsi que des classes sémantiques (`.t-display-1`, `.t-h1`, `.t-label`, `.t-mono`, `.t-annotation`, `.t-section-index`, `.rule`, `.rule-strong`, `.rule-double`).
- **Code :** [`tailwind.config.js:21-68`](../frontend/tailwind.config.js#L21-L68) ré-déclare manuellement les palettes paper / ink / brass / sage. [`index.css`](../frontend/src/index.css) n'importe jamais `colors_and_type.css`. Toute évolution de token doit donc être faite deux fois ; les classes sémantiques sont **inaccessibles** depuis le frontend.
- **Impact :** dérive structurelle inévitable. Tous les autres P0-P2 découlent en partie de cette duplication.

### P0-3. Display headings sous-pondérés
- **Spec :** `.t-display-1` = `font-weight: 800` + `letter-spacing: -0.045em` + `line-height: 0.9`. Signature « précision considérée, presque Apple » (cf. [`colors_and_type.css:241-247`](../design-system/colors_and_type.css#L241-L247)).
- **Code :** Hero H1 ([`Hero.jsx:13`](../frontend/src/components/Hero.jsx#L13)) = `font-bold` (700) + `tracking-tight` (Tailwind ≈ -0.025em). Section titles ([`.section-title` dans `index.css:36-38`](../frontend/src/index.css#L36-L38)) = idem. Le poids 800 d'Inter est chargé mais jamais utilisé en pratique.
- **Impact :** la « densité considérée » du DS est diluée en typo générique SaaS.

### P0-4. Pas d'indices de section ni d'eyebrows mono
- **Spec :** signature « № 01 / 03 · COMPARATOR » en JetBrains Mono via `.t-section-index` ([`colors_and_type.css:370-377`](../design-system/colors_and_type.css#L370-L377)). Référence visuelle : [`ui_kits/landing/Hero.jsx:58`](../design-system/ui_kits/landing/Hero.jsx#L58) (`№ 01 · MVP v0.1 · Road wheels`).
- **Code :** aucune section du frontend ne porte de numérotation. Le hero a un badge `rounded-full` « MVP v0.1 — Road Bike Wheels » au lieu d'un index plat mono.

---

## 4. P1 — Important : règles structurelles violées

### P1-1. Ombres présentes là où le DS les interdit
- **Spec :** « Shadows. Almost never. Permitted only for floating menus » (popovers `<select>`, column-selector menu).
- **Code :**
  - `shadow-xl` sur le drawer mobile filtres dans [`MiniComparator.jsx`](../frontend/src/components/MiniComparator/MiniComparator.jsx)
  - `shadow-sm` sur le bouton mobile « Filters » et sur le menu de [`ColumnSelector.jsx`](../frontend/src/components/MiniComparator/ColumnSelector.jsx)
  - `box-shadow: 0 1px 3px rgba(0,0,0,0.25)` sur les thumbs des range sliders dans [`FilterPanel.module.css`](../frontend/src/components/MiniComparator/FilterPanel.module.css)

### P1-2. Focus ring non conforme
- **Spec :** focus globaux = `outline: 2px solid var(--brass-8); outline-offset: 2px` (cf. [`colors_and_type.css:408-412`](../design-system/colors_and_type.css#L408-L412)). Visible sur paper sans rivaliser avec le contenu.
- **Code :** la plupart des inputs n'ont que `focus:border-brass-8` (changement de bordure uniquement). Aucune règle `:focus-visible` globale. Accessibilité dégradée.

### P1-3. Tracking-widest incorrect
- **Spec :** all-caps micro labels = `letter-spacing: 0.18em` (`--tracking-widest`).
- **Code :** Tailwind `tracking-widest` = `0.1em`. Tous les labels caps du frontend (`uppercase tracking-widest text-ink-7`) sont **sous-trackés ≈45 %**. Solution : `theme.extend.letterSpacing.widest = '0.18em'` dans `tailwind.config.js`.

### P1-4. Pills mal utilisés
- **Spec :** `border-radius: 999px` réservé aux **pill badges de statut uniquement**. Boutons & inputs = `radius-xs (2px)`. Cartes = `0`.
- **Code :** filter pills multi-select, MVP badge du Hero ([`Hero.jsx:10-12`](../frontend/src/components/Hero.jsx#L10-L12)), boutons d'icônes (close drawer, etc.) utilisent `rounded-full`. Sémantique brouillée — un statut « actif » ne se distingue plus d'un filtre.

### P1-5. Iconographie hand-rolled au lieu de Lucide
- **Spec :** Lucide à `stroke-width: 1.4`, square caps, miter joins — esthétique « drafting / technical » (cf. README.md section Iconography).
- **Code :** SVGs inline ad-hoc dans chaque composant (hamburger, chevron, check). Pas de système unifié, ni `currentColor` systématique. La spec recommande Lucide via CDN ou paquet npm.

### P1-6. Bg-page incohérent
- **Spec :** `--bg-page = paper-1 (#f6f4ef)` ; `paper-0` réservé aux **cards élevées**.
- **Code :** body = `bg-paper-1` ✅. Mais le Hero force `bg-paper-0` ([`Hero.jsx:7`](../frontend/src/components/Hero.jsx#L7)), inversant la hiérarchie surface / élévation. La Navbar fait de même (cf. P2-1).

---

## 5. P2 — Notable : finitions et fidélité

### P2-1. Backdrop blur du Navbar
- **Spec :** `rgba(246,244,239,0.88) + blur(8px)`.
- **Code :** [`Navbar.jsx`](../frontend/src/components/Navbar.jsx) — `bg-paper-0/80 backdrop-blur` → paper-0 (mauvais palier), opacité 0.80 au lieu de 0.88.

### P2-2. Sélection texte non thématisée
- **Spec :** `::selection { background: var(--brass-5); color: var(--ink-12); }` ([`colors_and_type.css:403-406`](../design-system/colors_and_type.css#L403-L406)).
- **Code :** aucune règle ; sélection système (bleu par défaut sur Windows / Chrome).

### P2-3. Aplats `font-feature-settings` absents
- **Spec :** body active `'ss01', 'ss02', 'cv11'` (alt glyphs Inter) — [`colors_and_type.css:226`](../design-system/colors_and_type.css#L226).
- **Code :** [`index.css:12-14`](../frontend/src/index.css#L12-L14) ne définit aucune feature settings. `font-variant-numeric: tabular-nums` appliqué uniquement ad-hoc dans les composants.

### P2-4. Palette `brand-*` retraitée mais toujours présente
- **Code :** [`tailwind.config.js:11-20`](../frontend/tailwind.config.js#L11-L20) — bleu retraité, commentaire « do not use ». Code mort à supprimer après scan final pour s'assurer qu'aucun composant ne s'y réfère.

### P2-5. Sage déclaré mais inutilisé
- **Spec :** sage = quiet secondary pour dividers, partnership section, status muté.
- **Code :** palette `sage-*` ajoutée à [`tailwind.config.js:55-68`](../frontend/tailwind.config.js#L55-L68), **zéro usage** dans les composants. Décision à prendre : appliquer (Partnership ?) ou retirer.

### P2-6. Pas d'utilitaires `.rule`, `.rule-strong`, `.rule-double`
- **Spec :** définis dans [`colors_and_type.css:384-400`](../design-system/colors_and_type.css#L384-L400) comme primitives hairline.
- **Code :** chaque divider est codé en `border-b border-ink-3` ou `border-ink-4` au cas par cas. Inconsistance entre composants.

### P2-7. Tokens motion absents
- **Spec :** durations 80 / 140 / 220 / 400 ms, easings `cubic-bezier(0.2, 0, 0, 1)` et `cubic-bezier(0.32, 0.72, 0, 1)`.
- **Code :** uniquement `transition-colors` par défaut Tailwind (150 ms ease-out). Aucun token motion exposé.

### P2-8. Pas d'`.t-annotation` pour les disclaimers
- **Spec :** italique Inter pour « *indicative price, sourced 2025-Q2* » ([`colors_and_type.css:360-367`](../design-system/colors_and_type.css#L360-L367)).
- **Code :** aucun composant n'affiche ce style — alors que [`wheelsData.js`](../frontend/src/data/wheelsData.js) contient des prix indicatifs.

### P2-9. Grille schématique du hero non implémentée
- **Spec :** « Schematic grid (16-px or 32-px ruled grid in `ink-2`) — the *one* decorative background, used on the hero only. »
- **Code :** [`Hero.jsx`](../frontend/src/components/Hero.jsx) est plat. Élément distinctif manquant.

---

## 6. P3 — Faible : optimisations et confort

### P3-1. Inter chargé en 7 poids
- **Code :** [`index.css:1`](../frontend/src/index.css#L1) charge 300 → 900. Le DS n'en utilise réellement que 6 (300, 400, 500, 600, 700, 800).

### P3-2. Fonts via `@import`
- **Code :** `@import url('https://fonts.googleapis.com/…')` dans `index.css` au lieu de `<link rel="preconnect">` dans `index.html`. Impact LCP marginal mais améliorable.

### P3-3. Pas de glyphes typographiques dans la copy
- **Spec :** `→ · — № Ø ± ≈` privilégiés sur les icônes en UI compacte. Aucun usage dans la copy live ; le design system kit en fait usage.

### P3-4. Spacing scale Tailwind par défaut
- Pas de violation stricte (les pas se croisent), mais les tokens DS (`--space-1` à `--space-32`) ne sont pas exposés à Tailwind.

### P3-5. `scroll-padding-top: 5rem` codé en dur
- [`index.css:10`](../frontend/src/index.css#L10) — à tokeniser si la hauteur de navbar devient configurable.

---

## 7. Plan de chantiers (EVO-007 → EVO-016)

| EVO | Slug | Couvre | Dépend de |
|---|---|---|---|
| EVO-007 | `wire-design-tokens-source-of-truth` | P0-2, P1-3 | — (fondation, à faire en 1er) |
| EVO-008 | `voice-and-section-indices` | P0-1, P0-4 | — (indépendant, contenu pur) |
| EVO-009 | `typography-display-and-feature-settings` | P0-3, P2-3 | EVO-007 |
| EVO-010 | `focus-rings-selection-and-shadows-cleanup` | P1-1, P1-2, P2-2 | EVO-007 |
| EVO-011 | `radii-and-surface-hierarchy-alignment` | P1-4, P1-6, P2-1 | EVO-007 |
| EVO-012 | `lucide-icon-system` | P1-5 | — |
| EVO-013 | `sage-palette-decision-and-brand-cleanup` | P2-4, P2-5 | EVO-007 |
| EVO-014 | `rule-utilities-and-motion-tokens` | P2-6, P2-7, P2-8 | EVO-007 |
| EVO-015 | `hero-schematic-grid-and-typographic-glyphs` | P2-9, P3-3 | EVO-007, EVO-008 |
| EVO-016 | `fonts-loading-optimization` | P3-1, P3-2, P3-5 | — |

Chaque dossier `EVO-NNN_slug/init.md` fournit la fiche d'amorce à passer au workflow [`ai-dev-process`](../../workflows/ai-dev-process/) — ce dernier produira `needs-assessment.md` → `prd.md` → `tech-specs.md`.

**Ordre suggéré de lancement :** EVO-007 d'abord (fondation tokens). EVO-008, EVO-012, EVO-016 peuvent être traités indépendamment en parallèle. Les autres dépendent d'EVO-007.

---

## 8. Vérification

- Chaque entrée P0/P1 est sourcée avec un chemin de fichier et un numéro de ligne vérifiable.
- Les classes sémantiques mentionnées (`.t-display-1`, `.t-label`, `.rule`, etc.) existent toutes dans `colors_and_type.css`.
- L'ordre des chantiers respecte les dépendances (EVO-007 = pré-requis pour 9/10/11/13/14/15).
- Aucune action sur le code n'a été effectuée. Frontend et design system restent inchangés.
