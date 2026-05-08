# Spec — Skill `frontend-code-review`

> Plan accepté le 2026-05-07. Spec persistée selon convention CLAUDE.md.
> Plan source : `C:\Users\Flavien\.claude\plans\tu-es-un-expert-silly-starlight.md`

## Objectif

Transformer le prompt de revue de code frontend (conçu en conversation) en skill Claude Code invoquable au besoin. Déclencher une revue rigoureuse à chaque demande de review/audit, sans recopier le prompt.

## Stack ciblé (MyBikeLab actuel)

- React 19 + JSX (pas de TypeScript)
- Vite, Tailwind CSS + CSS Modules ponctuels
- Redux Toolkit (`store/slices/`, `store/selectors/`)
- ESLint flat config + react-hooks plugin
- Pas de framework de test installé
- CSP via meta tag dans `frontend/index.html`

## Livrables

```
Review/
├── SKILL.md                              # le skill (frontmatter + corps)
├── evals/
│   ├── evals.json                        # 3 prompts + assertions
│   └── fixtures/
│       ├── eval-1/Component.jsx          # useEffect manquant dep + mutation Redux
│       ├── eval-2/ContactForm.jsx        # XSS + a11y + UX
│       └── eval-3/selectors.js           # sélecteur non mémoïsé
└── Review-YYYY-MM-DD-HHhMM.md            # rapports générés au runtime
```

## Décisions de design

1. **Description "pushy"** dans le frontmatter — couvre formulations indirectes ("regarde mon code", "tu en penses quoi") en plus des termes explicites ("review", "audit").
2. **Bloc contexte projet** en tête du SKILL.md — fige le stack pour que la grille soit alignée dès le début.
3. **Axes adaptés** :
   - Type safety → "Robustesse runtime" (validation aux frontières, défense contre `undefined`).
   - Tests : ne pas reprocher l'absence (projet sans framework), suggérer 🟡 si cas critique.
   - Sécurité : insister sur CSP + `dangerouslySetInnerHTML` + validation formulaires.
   - Performance : pièges Redux Toolkit (sélecteurs non mémoïsés, mutations) et React 19 (`use()`).
4. **Règles d'exclusion** :
   - Ne pas dupliquer ce qu'ESLint signale déjà (`exhaustive-deps`).
   - Jamais proposer TypeScript comme correction.
5. **Sauvegarde du rapport** : `Review-YYYY-MM-DD-HHhMM.md` (séparateur `h` au lieu de `:` interdit sur Windows).

## Hors scope v1

- Pas de description optimization (`run_loop.py`).
- Pas de packaging `.skill`.
- Pas de bundled resources (a11y checklist, antipatterns, template).
- Pas de support backend (n'existe pas encore).

## Vérification end-to-end

1. Frontmatter valide (`name`, `description`).
2. Test manuel : "review ce composant : [paste]" déclenche le skill, produit un rapport, sauvegarde dans `Review/`.
3. Évals : sur 3 fixtures, with-skill détecte les findings critiques attendus, baseline en rate au moins un.
4. Pas de bruit sur du code propre.
