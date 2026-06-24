# EVO-013 — Sage palette decision and retired brand cleanup

## Origine

Issue de l'audit [`2026-05-26_design-system-frontend-audit.md`](../2026-05-26_design-system-frontend-audit.md), points **P2-4** et **P2-5**.

## Problème

Deux palettes secondaires sont en suspens dans le frontend :

1. **`sage-*` déclarée mais inutilisée.** La palette `sage` est définie dans [`tailwind.config.js:55-68`](../../frontend/tailwind.config.js#L55-L68) et dans le DS comme « quiet secondary neutral with a green cast » destinée aux dividers, à la partnership section, et aux status mutés. Aucun composant React ne s'y réfère.

2. **`brand-*` retraitée mais toujours déclarée.** La palette bleue d'origine est marquée « do not use » dans [`tailwind.config.js:11-20`](../../frontend/tailwind.config.js#L11-L20). Elle a été retirée des composants par EVO-003 (cf. archive) et EVO-006 (HookBadge). Elle reste en place « pour éviter les build warnings », mais c'est du code mort.

## Objectif

Trancher l'usage de Sage (appliquer ou retirer) et nettoyer définitivement la palette `brand-*` retraitée du frontend.

## Périmètre

**Inclus :**
- **Décision Sage :** soit
  - **(A) Appliquer** : usage ciblé selon le DS — dividers, accents subtils de la PartnershipSection, badges « status muté ». Définir un mini-guide d'usage (dans une note de PRD).
  - **(B) Retirer** : supprimer `sage` de `tailwind.config.js` et noter l'absence dans `frontend/README.md`.
- **Cleanup brand-* :**
  - Vérifier par grep que **aucun composant** n'utilise `brand-*` (le commentaire « RETIRED » date d'EVO-003 mais une revue récente n'a pas été faite).
  - Si grep clean : supprimer la déclaration `brand-*` de `tailwind.config.js`.
  - Si une référence persiste : ouvrir un EVO follow-up dédié plutôt que tout faire ici.

**Exclus :**
- Pas de refonte des composants concernés au-delà de l'application Sage (si option A).
- Pas de toucher aux palettes paper / ink / brass.

## Fichiers connus à examiner

- [`frontend/tailwind.config.js:11-20`](../../frontend/tailwind.config.js#L11-L20) — `brand-*` retired
- [`frontend/tailwind.config.js:55-68`](../../frontend/tailwind.config.js#L55-L68) — `sage-*`
- [`design-system/README.md`](../../design-system/README.md) section Color (Sage)
- [`design-system/colors_and_type.css:55-67`](../../design-system/colors_and_type.css#L55-L67) — tokens sage
- [`frontend/src/components/PartnershipSection.jsx`](../../frontend/src/components/PartnershipSection.jsx) — candidat principal pour sage si option A
- Tous fichiers de `src/components/` et `src/pages/` — grep `brand-` pour confirmer

## Critères d'acceptation (esquisse)

- [ ] **Soit** la palette `sage-*` est utilisée dans au moins un composant (avec justification documentée dans la PRD), **soit** elle est retirée de `tailwind.config.js`.
- [ ] Aucun `brand-50/100/200/500/600/700/900` n'est référencé dans `src/`.
- [ ] La déclaration `brand-*` est supprimée de `tailwind.config.js` (et la note « RETIRED » avec).
- [ ] Le build passe sans warning Tailwind.
- [ ] Pas de régression visuelle.

## Dépendances / ordre

**Dépend d'EVO-007** : il est plus simple de toucher à `tailwind.config.js` une fois que la stratégie source-of-truth est posée (pour éviter de retoucher deux fois).

Indépendant des autres EVO.

## Notes

- Si l'option A (appliquer Sage) est choisie, prévoir une revue de PartnershipSection : c'est l'endroit le plus naturel selon le DS.
- L'utilisateur a déjà fait quatre évolutions de cleanup tokens (EVO-002, 003, 005, 006) — la maintenance des palettes est un sujet récurrent. Ce chantier peut clore le cycle.
