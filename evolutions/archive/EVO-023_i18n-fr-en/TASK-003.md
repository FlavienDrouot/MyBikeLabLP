# TASK-003 — Create `public/locales/fr.json` with complete French translations

## Objective

Create the French translation file `frontend/public/locales/fr.json`. This file has the same structure as `en.json` (TASK-002). Every key must have a complete, natural French translation — no placeholders, no empty strings, no English fallback values. Translations are AI-produced.

## Required context

- **File to create**: `frontend/public/locales/fr.json`
- **Structure**: identical to `public/locales/en.json` — same keys, same nesting, same array lengths and shapes
- **Language-neutral content** (do not translate, carry over as-is): wheel model names, brand names, numeric specs, price values, the `2025-Q2` date stamp, the `→` arrow symbol, email addresses
- **Interpolation placeholders** (`{{name}}`, `{{email}}`, `{{year}}`, `{{lang}}`, `{{label}}`) must be preserved exactly as-is — they are not translated
- **Tone**: informative, direct, no marketing fluff. Cycling-literate audience.
- **Forbidden in translated copy**: em-dash `—` and en-dash `–` as text punctuation in prose (see UI Guidelines). Use a comma, colon, or parentheses instead. The `—` range separator in sort labels (e.g., `"light → heavy"`) is a visual separator, not prose punctuation, so it is allowed in that context.

## Potentially impacted files

- `public/locales/fr.json` (new file)

## Inputs

The English file `public/locales/en.json` (created in TASK-002) is the structural reference.

## Expected outputs

### `public/locales/fr.json`

```json
{
  "nav": {
    "tool": "Outil",
    "roadmap": "Roadmap",
    "partnerships": "Partenariats",
    "contact": "Contact",
    "openMenu": "Ouvrir le menu",
    "closeMenu": "Fermer le menu",
    "lang": {
      "en": "EN",
      "fr": "FR",
      "switchTo": "Passer en {{lang}}"
    }
  },
  "hero": {
    "title": "Des roues mesurées, pas marketées.",
    "subtitle": "Comparez par poids, profil de jante, compatibilité hookless, marque de moyeu, prix et bien plus. Tout dans un seul tableau.",
    "ctaPrimary": "Ouvrir le comparateur →",
    "ctaSecondary": "Voir la roadmap →",
    "stats": {
      "wheels": "Roues",
      "filterAxes": "Axes de filtres",
      "phasesPlanned": "Phases prévues"
    }
  },
  "comparator": {
    "sectionIndex": "COMPARATEUR",
    "title": "Roues route : filtrer et comparer",
    "subtitle": "Filtrez et triez par marque, poids, profil de jante, prix et bien plus.",
    "filtersButton": "Filtres",
    "filtersDrawerLabel": "Filtres",
    "footerNote": "Jeu de données d'exemple · Prix réels et partenaires bientôt disponibles"
  },
  "filterPanel": {
    "heading": "Filtres",
    "reset": "Réinitialiser",
    "sortBy": "Trier par",
    "searchPlaceholder": "Rechercher…",
    "noResults": "Aucun résultat",
    "enableFilter": "Activer le filtre {{label}}"
  },
  "columnSelector": {
    "button": "Colonnes"
  },
  "table": {
    "heading": "Roues",
    "emptyState": "Aucune roue ne correspond à vos filtres. Essayez de les réinitialiser."
  },
  "wheelDetail": {
    "manufacturer": "Fabricant",
    "whereToBuy": "Où acheter",
    "buyLink": "Acheter →",
    "noLinks": "Aucun lien affilié disponible pour cette roue.",
    "priceAnnotation": "prix indicatif, source 2025-Q2"
  },
  "badges": {
    "hookless": "Hookless",
    "hooked": "Avec crochet"
  },
  "roadmap": {
    "sectionIndex": "ROADMAP",
    "title": "Trois phases",
    "subtitle": "La comparaison d'abord. La simulation d'impact ensuite. Le configurateur complet à l'horizon.",
    "phases": [
      {
        "tag": "Phase 1",
        "status": "En cours",
        "title": "Comparaison de composants",
        "description": "Les roues d'abord, puis les transmissions, freins et pneus. Des specs structurées, des décisions côte à côte.",
        "points": ["MVP roues disponible", "Transmissions à venir", "Freins et pneus ensuite"]
      },
      {
        "tag": "Phase 2",
        "status": "Suivant",
        "title": "Simulateur d'impact",
        "description": "Visualisez comment chaque pièce change votre montée : poids, aérodynamique, coût total, performance estimée.",
        "points": ["Delta de poids", "Gains aéro", "Coût par watt"]
      },
      {
        "tag": "Phase 3",
        "status": "Vision",
        "title": "Configurateur vélo complet",
        "description": "Construisez le vélo de vos rêves depuis le cadre, simulez le setup complet, puis achetez.",
        "points": ["Du cadre à la finition", "Aperçu des performances", "Prêt pour l'affiliation"]
      }
    ]
  },
  "benefits": {
    "sectionIndex": "AVANTAGES",
    "title": "Conçu pour les cyclistes sérieux",
    "items": [
      {
        "title": "De meilleures décisions",
        "description": "Fini de comparer des PDFs et des fils de forum. Filtrez sur les specs qui comptent vraiment pour votre pratique."
      },
      {
        "title": "Basé sur les données",
        "description": "Chaque spec est sourcée et structurée. Pas de communication marketing, juste des chiffres vérifiables."
      },
      {
        "title": "Orienté communauté",
        "description": "Construit avec des cyclistes, des fabricants et des revendeurs. Données ouvertes, affiliations transparentes."
      }
    ]
  },
  "partnership": {
    "sectionIndex": "PARTENARIAT",
    "title": "Travaillez avec nous",
    "intro": "MyBikeLab connecte les cyclistes à des données composants structurées. Si vous fournissez ou vendez des composants vélo route, vos données ont leur place ici.",
    "audiences": [
      {
        "title": "Fabricants",
        "description": "Mettez en valeur vos specs dans un format structuré, prêt pour la comparaison."
      },
      {
        "title": "Revendeurs",
        "description": "Intégrez un tunnel de comparaison à haute intention d'achat, conçu pour les cyclistes route."
      }
    ]
  },
  "contact": {
    "namePlaceholder": "Nom",
    "emailPlaceholder": "Email",
    "companyPlaceholder": "Entreprise (facultatif)",
    "messagePlaceholder": "Message",
    "submit": "Envoyer le message",
    "errors": {
      "nameRequired": "Le nom est requis",
      "emailRequired": "L'email est requis",
      "messageRequired": "Le message est requis"
    },
    "success": {
      "title": "Merci, {{name}} !",
      "body": "Nous vous répondrons à {{email}} très prochainement."
    }
  },
  "footer": {
    "copyright": "© {{year}} MyBikeLab. Tous droits réservés.",
    "nav": {
      "tool": "Outil",
      "roadmap": "Roadmap",
      "partnerships": "Partenariats",
      "contact": "Contact"
    }
  },
  "properties": {
    "groups": {
      "general": "Caractéristiques générales",
      "rims": "Jantes",
      "subs": "Sous-composants"
    },
    "image": { "label": "Image" },
    "model": { "label": "Modèle" },
    "brand": { "label": "Marque" },
    "weight": { "label": "Poids" },
    "price": { "label": "Prix" },
    "diameter": { "label": "Diamètre" },
    "rimMaterial": { "label": "Matériau de jante" },
    "hookless": { "label": "Hookless" },
    "depth": { "label": "Profil" },
    "rimWidth": { "label": "Largeur de jante" },
    "hub": { "label": "Moyeu" },
    "hubBrand": { "label": "Marque de moyeu" },
    "hubModel": { "label": "Modèle de moyeu" },
    "spokes": { "label": "Rayons" },
    "spokesBrand": { "label": "Marque de rayons" },
    "spokesModel": { "label": "Modèle de rayons" },
    "spokeMaterial": { "label": "Matériau des rayons" }
  },
  "sorts": {
    "name": "Nom (A → Z)",
    "weight_asc": "Poids (léger → lourd)",
    "weight_desc": "Poids (lourd → léger)",
    "price_asc": "Prix (croissant)",
    "price_desc": "Prix (décroissant)",
    "depth_asc": "Profil (faible → élevé)",
    "depth_desc": "Profil (élevé → faible)",
    "rimWidth_asc": "Largeur de jante (étroite → large)",
    "rimWidth_desc": "Largeur de jante (large → étroite)"
  },
  "filters": {
    "hookless": {
      "all": "Tous",
      "hookless": "Hookless",
      "hooked": "Avec crochet"
    }
  }
}
```

## Constraints

- The JSON structure (all keys, nesting depth, array lengths) must be identical to `en.json`
- All interpolation placeholders (`{{name}}`, `{{email}}`, `{{year}}`, `{{lang}}`, `{{label}}`) must be preserved exactly — do not translate them
- `"hookless"` in `badges.hookless` and `filters.hookless.hookless` stays `"Hookless"` — it is the established technical term used by the cycling industry in French as well
- `"Roadmap"` in `nav.roadmap`, `roadmap.sectionIndex`, and `footer.nav.roadmap` stays `"Roadmap"` — it is used as-is in French cycling/startup contexts
- `"Phase 1"`, `"Phase 2"`, `"Phase 3"` in phase tags are language-neutral
- The arrow symbol `→` is preserved in CTAs and sort labels
- No em-dash `—` or en-dash `–` in prose strings; use commas, colons, or parentheses
- The file must be valid JSON

## Dependencies

TASK-002

## Validation criteria

- [ ] File is valid JSON
- [ ] File has the exact same key structure and array shapes as `en.json`
- [ ] No key has an empty string value or an English fallback (every key has a genuine French translation)
- [ ] All interpolation placeholders are intact in the French values
- [ ] `roadmap.phases` array has 3 items; `benefits.items` has 3; `partnership.audiences` has 2
- [ ] No em-dash or en-dash in any prose string value
- [ ] After the full evolution is deployed, switching to French shows no untranslated strings in any section (AC-006)
- [ ] Wheel names, brand names, and numeric values are not translated (AC-008) — these are in `wheelsData.js`, not in this file; no action needed here

## Tests to implement

### Unit
- None

### Integration
- After the full evolution is complete: switch to French, read through every section and every comparator control, verify no English string remains (AC-006)
- Verify French strings do not cause layout overflow in Navbar, buttons, or table headers (manual visual check)
