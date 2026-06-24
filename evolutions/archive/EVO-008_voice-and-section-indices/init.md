# EVO-008 — Voice alignment and section indices

## Origine

Issue de l'audit [`2026-05-26_design-system-frontend-audit.md`](../2026-05-26_design-system-frontend-audit.md), points **P0-1** et **P0-4**.

## Problème

Le design system spécifie une voice « neutre, technique, slightly nerdy » (Wirecutter / DPReview), proscrivant explicitement les buzzwords marketing (« revolutionary », « game-changer », « future of », « intelligence »). Il prescrit aussi une signature visuelle forte : **chaque section ouverte par un index plat en JetBrains Mono** au format `№ 01 / 03 · COMPARATOR` (`.t-section-index`).

Or :
- Le Hero affiche *« The Future of Bike Component Intelligence »* — violation directe de la règle « no future of, no intelligence ». Cf. [`Hero.jsx:13-15`](../../frontend/src/components/Hero.jsx#L13-L15).
- Le CTA secondaire « See the Vision » est également hors voice.
- Aucune section de la Landing ne porte de numérotation `№ NN`.

Voir la copy de référence dans [`design-system/ui_kits/landing/Hero.jsx:58-67`](../../design-system/ui_kits/landing/Hero.jsx#L58-L67) (« Wheels, *measured.* Not marketed. »).

## Objectif

Aligner la copy de la Landing sur la voice du design system et introduire les indices de section comme signature transverse.

## Périmètre

**Inclus :**
- Réécriture de la copy : Hero (eyebrow, titre, lead, CTAs), Benefits, MiniComparator, Roadmap, Partnership, Footer.
- Eyebrow du Hero : remplacer la pill `rounded-full` par un texte plat type `№ 01 · MVP v0.1 · Road wheels` (la question du radius est traitée dans EVO-011 ; ici on traite le contenu).
- Indices de section ajoutés au sommet de chaque section : `№ 02 · COMPARATOR`, `№ 03 · ROADMAP`, etc.
- Remplacement des phrasings marketing par des formulations factuelles (« 15 wheels, 13 axes » plutôt que « ultimate comparison »).
- Adoption de glyphes typographiques pertinents dans la copy (`→` pour les CTAs liens, `·` pour séparer, `№` pour les index) — le scope « glyphes dans les data » est couvert par EVO-015.

**Exclus :**
- Pas de modification typographique structurelle (poids, tracking) — couverte par EVO-009.
- Pas de modification de radii / surfaces — couverte par EVO-011.
- Pas de modification de Mini-Comparator data (uniquement copy : titres, sous-titres, labels visibles).

## Fichiers connus à examiner

- [`frontend/src/components/Hero.jsx`](../../frontend/src/components/Hero.jsx) — H1 ligne 13-15, lead ligne 17-20, CTAs ligne 22-24, MVP badge ligne 10-12
- [`frontend/src/components/BenefitsGrid.jsx`](../../frontend/src/components/BenefitsGrid.jsx)
- [`frontend/src/components/RoadmapSection.jsx`](../../frontend/src/components/RoadmapSection.jsx)
- [`frontend/src/components/PartnershipSection.jsx`](../../frontend/src/components/PartnershipSection.jsx)
- [`frontend/src/components/MiniComparator/MiniComparator.jsx`](../../frontend/src/components/MiniComparator/MiniComparator.jsx) — titre et sous-titre de section
- [`frontend/src/components/Footer.jsx`](../../frontend/src/components/Footer.jsx)
- [`frontend/index.html`](../../frontend/index.html) — `<title>` et `<meta name="description">`
- [`design-system/README.md`](../../design-system/README.md) sections Voice + Examples — règles de voice à appliquer
- [`design-system/ui_kits/landing/Hero.jsx`](../../design-system/ui_kits/landing/Hero.jsx) — copy de référence

## Critères d'acceptation (esquisse)

- [ ] Aucune occurrence des mots interdits dans la copy visible : « future of », « intelligence », « revolutionary », « game-changer », « blazingly », « ultimate », emojis 🚴 ⚡ ✨.
- [ ] Aucun point d'exclamation dans les surfaces produit.
- [ ] Chaque section de la Landing débute par un index `№ NN · LABEL` rendu en `.t-section-index` (ou équivalent mono caps).
- [ ] Le Hero affiche un titre proche du modèle DS (« Wheels, measured. Not marketed. » ou variante validée en PRD).
- [ ] Les CTAs portent des libellés sentence case (« Open comparator », « See the roadmap »).
- [ ] Le `<title>` et la `<meta description>` du HTML reflètent la nouvelle voice.

## Dépendances / ordre

**Indépendant** — peut être lancé en parallèle d'EVO-007. La copy ne dépend pas de la plomberie tokens.

EVO-015 (grille schématique du hero) dépend en partie de cette évolution car elle s'appuie sur l'eyebrow refondu.

## Notes

- Cette évolution est principalement éditoriale : la phase Needs Assessment devrait inviter à valider les libellés un par un avec l'utilisateur avant Tech Specs.
- Penser à mettre à jour `MyBikeLab/product-overview.md` si certains termes y dérivent.
