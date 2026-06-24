# WheelDetailPanel — intégration repo

Remplace `frontend/src/components/MiniComparator/WheelDetailPanel.jsx` par le fichier
`WheelDetailPanel.jsx` de ce dossier. Deux points à compléter ci-dessous.

---

## 1. Clés i18n à ajouter (namespace `wheelDetail`)

Les clés existantes réutilisées : `manufacturer`, `buyLink`, `noLinks`.
Nouvelles clés à ajouter dans tes fichiers de traduction :

```jsonc
// fr
"wheelDetail": {
  "manufacturer": "Fabricant",
  "officialStore": "boutique officielle",
  "official": "Officiel",
  "retailers": "Revendeurs",
  "cheapestFirst": "{{count}} · du moins cher",
  "bestPrice": "Meilleur prix",
  "lowest": "le plus bas",
  "buyLink": "Voir l'offre",
  "noLinks": "Aucun lien d'achat disponible pour le moment.",
  "noManufacturer": "Pas de lien fabricant.",
  "noRetailers": "Pas encore de revendeur référencé."
}

// en
"wheelDetail": {
  "manufacturer": "Manufacturer",
  "officialStore": "official store",
  "official": "Official",
  "retailers": "Retailers",
  "cheapestFirst": "{{count}} · cheapest first",
  "bestPrice": "Best price",
  "lowest": "lowest",
  "buyLink": "Visit retailer",
  "noLinks": "No purchase links available yet.",
  "noManufacturer": "No manufacturer link.",
  "noRetailers": "No retailers listed yet."
}
```

`region` / `stock` sont **optionnels** : la ligne meta (ex. « EU · DE · In stock »)
ne s'affiche que si ces champs existent dans `affiliateLinks`. Rien à faire si tu
ne les fournis pas.

---

## 2. Agrandir l'image (`WheelImageCarousel.jsx`)

Le carrousel est en taille fixe. Pour retrouver la photo agrandie de la maquette,
bumpe ces valeurs (mêmes formules, juste plus grandes) :

| Avant | Après |
|-------|-------|
| container `width: '360px'` | `width: '460px'` |
| slide `width/height: '220px'` (×3 occurrences) | `'288px'` |
| `translateX = -(activeIndex * 230 - 70)` | `-(activeIndex * 300 - 86)` |
| boutons `left/right: '54px'` | `'70px'` |

> `300 = 288 + 12 (gap)` · `86 = (460 − 288) / 2` (recentre la vignette active).

Variante recommandée : passer ces tailles en props (`size = 288`, etc.) pour piloter
la dimension depuis le panneau plutôt qu'en dur.

---

## Notes de design

- **Pas de ligne en tête** (ni specs ni bandeau best-price) — on entre direct dans les offres.
- **Deux sections** *Fabricant* / *Revendeurs*, mêmes colonnes → les prix s'alignent verticalement.
- **Moins cher (toutes sources confondues)** = filet laiton à gauche + prix en vert
  (`--signal-up`, fallback `#2f6b3a`) + CTA laiton plein. Les autres : CTA outline.
- **Delta** affiché vs le prix le plus bas (`+50 €`, ou « le plus bas »).
- **Pleine largeur** : contenu plafonné à `max-w-[1080px]` et centré → bande propre,
  pas de vide même quand le tableau est très large.
- **Mobile** (`panelWidth < 870`) : image empilée au-dessus, rang masqué, CTA pleine largeur.
