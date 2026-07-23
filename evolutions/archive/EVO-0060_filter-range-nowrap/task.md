# Inline Task

## Status
Done

## Request
Changer la disposition du filtre range pour avoir une ligne pour le libelle et une ligne en dessous pour les annotations.

## Mini Plan
1. Identifier le bloc range rendu par `FilterPanel`.
2. Separer le libelle et l'annotation sur deux lignes.
3. Verifier le rendu dans le navigateur local.

## Requirement And Validation
- Requirement: le libelle du filtre doit etre sur sa propre ligne et l'annotation sur la ligne suivante.
- Acceptance criteria: le titre du filtre et la plage ne partagent plus la meme ligne.
- Test strategy: verification Vitest en mode summary et controle du DOM si le runtime navigateur est disponible.
- Edge cases: panneau plus etroit, valeurs longues, activite du filtre desactivee.

## Technical Steps
- Passer le header de range en layout vertical.
- Garder le label en premiere ligne.
- Afficher l'annotation de plage en dessous avec un separateur ASCII.
- Conserver la largeur du panneau a 288px sur desktop.

## Validation
- Baseline: Vitest summary avant la derniere retouche, 25 files passes, 0 failed, 341 tests passes, exit code 0.
- Checks run: verification du bloc JSX dans le fichier, Vitest summary apres la retouche d'encodage.
- Regression: Vitest summary apres la retouche d'encodage, 25 files passes, 341 tests passes, exit code 0.
- Manual checks: le fichier source affiche maintenant `0 mm - 105 mm` au lieu de la forme mojibake.

## Final Notes
- Changes: `FilterPanel` renders the range annotation with a safe ASCII hyphen instead of the broken mojibake dash; the two-line label/annotation layout remains in place.
- Risks: low. The change is text-only and layout-only.
- Closure: Done and archived on 2026-07-23 based on the recorded Vitest summary and validation notes; no unresolved findings or blockers are recorded.
