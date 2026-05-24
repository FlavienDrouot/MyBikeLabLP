# Evolution 001 — Initialisation du workspace AI

## Date

2026-05-21

## Objectif

Mettre en place l'architecture de workspace AI définie dans `FolderSystemInstructions.md` pour structurer l'environnement de travail du workspace Claude global et du projet MyBikeLab.

## Contexte

Le workspace `Claude/` contenait `MyBikeLab/` et `FolderSystemInstructions.md` sans structure de navigation formelle ni domaines séparés. Cette évolution pose les fondations de l'architecture cognitive.

## Actions réalisées

1. Création de `Claude/CLAUDE.md` — navigation racine du workspace, chargé automatiquement par Claude Code à chaque session
2. Création de `Claude/shared-knowledge/README.md` — domaine des références architecturales partagées
3. Création de `Claude/workflows/README.md` — domaine des workflows opérationnels
4. Création de `MyBikeLab/evolutions/` — traçabilité des évolutions du projet (ce dossier)

## Décisions

- **`evolutions/` dans les projets, pas à la racine** — les évolutions sont liées à l'histoire d'un projet spécifique, pas à celle du workspace global
- **`CLAUDE.md` plutôt que `README.md` à la racine** — chargé automatiquement par Claude Code, ce qui en fait un vrai point d'entrée opérationnel et non de la simple documentation
- **Structure additive** — aucun fichier existant n'a été modifié ou déplacé

## État

Terminée
