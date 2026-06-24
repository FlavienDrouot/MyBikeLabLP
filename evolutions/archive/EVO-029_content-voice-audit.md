# EVO-029 — Content voice audit

- **Date :** 2026-05-29
- **Auteur :** Flavien Drouot (analyse assistée par Claude)
- **Périmètre :** `public/locales/en.json` et `public/locales/fr.json`
- **Statut :** Terminé — corrections appliquées

---

## Contexte

Audit de cohérence entre les textes visibles du site (fichiers i18n) et la voice & tone définie dans `design-system/README.md` § Content Fundamentals. L'audit couvre les deux langues (EN + FR) sur l'ensemble des clés de traduction.

---

## Violations corrigées

### V1 — Exclamation mark dans la confirmation contact (P0)

**Règle DS :** « No exclamation marks in product surfaces. Period. »

| Fichier | Clé | Avant | Après |
|---|---|---|---|
| `en.json` | `contact.success.title` | `"Thanks, {{name}}!"` | `"Thanks, {{name}}."` |
| `fr.json` | `contact.success.title` | `"Merci, {{name}} !"` | `"Merci, {{name}}."` |

---

### V2 — "your dream bike" — marketing fluff (P1)

**Règle DS :** « No marketing fluff. »

| Fichier | Clé | Avant | Après |
|---|---|---|---|
| `en.json` | `roadmap.phases[2].description` | `"Build your dream bike from the frame up…"` | `"Build a complete bike from the frame up…"` |
| `fr.json` | idem | `"Construisez le vélo de vos rêves…"` | `"Construisez un vélo complet…"` |

Note FR : "setup" (anglicisme) remplacé par "configuration complète" dans la même phrase.

---

### V3 — "high-intent comparison funnel" — jargon marketing B2B (P1)

**Règle DS :** voice neutre, factuelle, pas de terminologie marketing.

| Fichier | Clé | Avant | Après |
|---|---|---|---|
| `en.json` | `partnership.audiences[1].description` | `"Plug into a high-intent comparison funnel built for road cyclists."` | `"Reach cyclists who are actively comparing before they buy."` |
| `fr.json` | idem | `"Intégrez un tunnel de comparaison à haute intention d'achat…"` | `"Touchez des cyclistes qui comparent activement avant d'acheter."` |

---

### T1 — "source 2025-Q2" — forme nominale ambiguë (P1 — FR seulement)

| Fichier | Clé | Avant | Après |
|---|---|---|---|
| `fr.json` | `wheelDetail.priceAnnotation` | `"prix indicatif, source 2025-Q2"` | `"prix indicatif, sourcé en 2025-Q2"` |

L'EN utilisait le participe passé "sourced" ; le FR utilisait le nom "source" (ambigu). Alignement sur la structure grammaticale de l'EN.

---

### T2 — "votre montée" — faux-ami cycliste (P1 — FR seulement)

| Fichier | Clé | Avant | Après |
|---|---|---|---|
| `fr.json` | `roadmap.phases[1].description` | `"change votre montée"` | `"change votre machine"` |

"Montée" désigne spécifiquement une ascension. L'EN dit "your ride" (général). Corrigé en "machine" — terme technique cycliste-insider, aligné avec la voice lab/blueprint du DS.

---

## Ce qui n'a pas été modifié

- `benefits.title` (`"Built for serious cyclists"` / `"Conçu pour les cyclistes sérieux"`) — légèrement marketing mais jugé acceptable pour une section avantages ; non modifié.
- Tous les labels navigation, tris, filtres, colonnes — conformes.
- `wheelDetail.priceAnnotation` EN — déjà exact par rapport à l'exemple du DS (`"indicative price, sourced 2025-Q2"`).
- Utilisation des glyphes typographiques `→`, `·` — conforme.
- Section indices en ALL CAPS — conforme.

---

## Fichiers modifiés

- `MyBikeLab/frontend/public/locales/en.json` — 3 clés
- `MyBikeLab/frontend/public/locales/fr.json` — 5 clés
