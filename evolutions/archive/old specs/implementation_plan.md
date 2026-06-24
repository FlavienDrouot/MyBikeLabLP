# Plan d'Implémentation MyBikeLab
## Stack: React + Node.js + PostgreSQL

### Context
MyBikeLab est une plateforme de comparaison et d'analyse de composants vélo. Le projet démarre de zéro avec une première phase MVP centrée sur les roues de vélo de route.

**Phase 1 (Ce plan)**: Landing page crédibilisante avec un comparateur de roues **intégré en frontend uniquement** (données génériques hardcodées). Cible: présentation B2B + démonstration du concept.

**Phase Future**: Backend Node.js + PostgreSQL pour intégration données réelles.

Stack Phase 1: **React (Vite) + TailwindCSS** | Stack Future: **Node.js + PostgreSQL**

---

## Phase 1: Architecture & Configuration Initiale

### 1.1 Structure des dossiers (Phase 1)

```text
MyBikeLab/
├── frontend/                 # App React (Phase 1 focus)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── MiniComparator/
│   │   │   │   ├── WheelSelector.jsx
│   │   │   │   ├── ComparisonTable.jsx
│   │   │   │   └── FilterPanel.jsx
│   │   │   ├── ContactForm.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Testimonials.jsx
│   │   ├── pages/
│   │   │   └── Landing.jsx
│   │   ├── data/
│   │   │   └── wheelsData.js     # Données test génériques
│   │   ├── store/
│   │   │   ├── index.js
│   │   │   ├── slices/
│   │   │   │   ├── wheelsSlice.js
│   │   │   │   └── filtersSlice.js
│   │   │   └── selectors/
│   │   │       └── wheelsSelectors.js
│   │   ├── App.jsx
│   │   └── index.css (Tailwind)
│   ├── package.json
│   └── vite.config.js
├── backend/                  # FUTURE - pour plus tard
├── specifications/           # Ce dossier
└── CLAUDE.md, CONTEXT.md
```

### 1.2 Stack Frontend (Phase 1)
- **Build tool**: Vite (rapide, zéro config)
- **Framework**: React 18
- **UI**: Tailwind CSS (classes utility)
- **State Management**: Redux Toolkit (store centralisé pour filtres, données)
- **Port**: 5173 (défaut Vite)
- **No API calls** - données locales en JS

### 1.3 Redux Store Architecture

```text
store/
├── index.js              # configureStore
├── slices/
│   ├── wheelsSlice.js    # state: { items: wheelsData[], loading, error }
│   └── filtersSlice.js   # state (voir détail ci-dessous)
└── selectors/
    └── wheelsSelectors.js # selectFilteredWheels (voir Phase 4)
```

**filtersSlice — état complet aligné sur la structure de données:**

```text
filters: {
  // Identité
  brands: string[]            → filtre sur wheel.brand

  // Jante
  rimMaterials: string[]      → filtre sur wheel.rim.material ("Carbon" | "Alloy")
  hookless: boolean | null    → filtre sur wheel.rim.hookless (null = tous)
  minDepth: number            → filtre sur wheel.rim.depth_mm
  maxDepth: number            → filtre sur wheel.rim.depth_mm

  // Specs
  minWeight: number           → filtre sur wheel.weight_grams
  maxWeight: number           → filtre sur wheel.weight_grams

  // Prix
  minPrice: number            → filtre sur min(wheel.prices[].price_eur)
  maxPrice: number            → filtre sur min(wheel.prices[].price_eur)

  // Tri
  sortBy: string              → 'name' | 'weight_asc' | 'weight_desc'
                                  'price_asc' | 'price_desc'
                                  'depth_asc' | 'depth_desc'
}
```

**Avantages Redux**:
- État centralisé et prévisible
- Prêt à scale vers backend API (remplacer wheelsData par thunk async)
- Time-travel debugging avec Redux DevTools
- Facile d'ajouter des slices futures (favorites, comparisons, auth)

---

## Phase 2: Données Génériques Frontend (wheelsData.js)

### 2.1 Structure données
```javascript
// src/data/wheelsData.js
export const wheelsData = [
  {
    // Identité
    id: 1,
    model: "Alpinist CLX II",
    brand: "Roval",

    // Specs principales
    weight_grams: 1225,
    diameter_mm: 700,

    // Jante
    rim: {
      material: "Carbon",       // "Carbon" | "Alloy"
      hookless: false,           // true = hookless, false = hooked
      depth_mm: 33,
      externalWidth_mm: 25.5,
    },

    // Rayons
    spokes: {
      model: "Sapim CX-Ray",
      brand: "Sapim",
      material: "Stainless Steel", // "Stainless Steel" | "Carbon" | "Aluminum"
    },

    // Moyeu
    hub: {
      model: "DT 240",
      brand: "DT Swiss",
    },

    // Prix (plusieurs revendeurs possibles)
    prices: [
      { price_eur: 1299, url: "https://example-shop.com/roval-alpinist-clx" },
      { price_eur: 1349, url: "https://another-shop.com/roval-alpinist-clx" },
    ],

    // Image
    image: "/images/wheel-placeholder.jpg",
  },
  // ... 12-15 roues d'exemple
];
```

### 2.2 Résumé des champs
| Groupe | Champ | Type | Notes |
| --- | --- | --- | --- |
| Identité | id | number | unique |
| Identité | model | string | nom du modèle |
| Identité | brand | string | marque du wheelset |
| Specs | weight_grams | number | poids total en g |
| Specs | diameter_mm | number | 700 ou 650 |
| Jante | rim.material | string | "Carbon" / "Alloy" |
| Jante | rim.hookless | boolean | true = hookless |
| Jante | rim.depth_mm | number | hauteur du profil |
| Jante | rim.externalWidth_mm | number | largeur ext. en mm |
| Rayons | spokes.model | string | modèle rayon |
| Rayons | spokes.brand | string | marque rayon |
| Rayons | spokes.material | string | matériau rayon |
| Moyeu | hub.model | string | modèle moyeu |
| Moyeu | hub.brand | string | marque moyeu |
| Prix | prices[] | array | liste {price_eur, url} |
| Image | image | string | URL placeholder |

### 2.3 Implications pour les filtres Redux
Filtres à adapter à cette structure :
- `brands` → filtrer sur `wheel.brand`
- `minWeight / maxWeight` → filtrer sur `wheel.weight_grams`
- `rimMaterials` → filtrer sur `wheel.rim.material`
- `hookless` → filtrer sur `wheel.rim.hookless`
- `minDepth / maxDepth` → filtrer sur `wheel.rim.depth_mm`
- `minPrice / maxPrice` → filtrer sur `Math.min(...wheel.prices.map(p => p.price_eur))`
- `sortBy` → tri sur weight, depth, ou prix min

---

## Phase 3: Landing Page - Layout & Sections

### 3.1 Structure page complète avec vision future

```text
┌─────────────────────────────────────────────────────┐
│ Navbar (logo MyBikeLab + lien "Tool" + CTA Contact) │
├─────────────────────────────────────────────────────┤
│                                                     │
│  SECTION 1: HERO + Vision                          │
│  ┌─────────────────────────────────────────────┐   │
│  │ "The Future of Bike Component Intelligence" │   │
│  │ Tagline: "Compare, Simulate, Optimize"      │   │
│  │ Subheader: "MVP: Wheel Comparison Tool"     │   │
│  │ CTA: "Try Comparator" → scroll              │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  SECTION 2: MVP LIVE DEMO (Mini Comparator)        │
│  Titre: "Start with Wheels - Explore Components"  │
│  ┌─────────────────────────────────────────────┐   │
│  │ Left: FilterPanel                           │   │
│  │ Right: ComparisonTable                      │   │
│  └─────────────────────────────────────────────┘   │
│  Sous-titre: "MVP v0.1: Road Bike Wheels"         │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  SECTION 3: THE VISION (Roadmap)                   │
│  "What's Coming"                                   │
│  ┌─────────────────────────────────────────────┐   │
│  │ Timeline Cards (3 phases):                  │   │
│  │ • Phase 1: Components Comparison            │   │
│  │   (Wheels → Drivetrains → Brakes)          │   │
│  │                                             │   │
│  │ • Phase 2: Impact Simulator                │   │
│  │   (Weight, Aero, Cost analysis)            │   │
│  │                                             │   │
│  │ • Phase 3: Full Bike Configurator          │   │
│  │   (Build your dream bike, simulate perf.)  │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  SECTION 4: Why MyBikeLab                          │
│  3 columns: Better Decisions | Data-Driven |       │
│             Community-Focused                      │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  SECTION 5: B2B PARTNERSHIPS                       │
│  "Join the Platform"                              │
│  For: Manufacturers • Resellers • Affiliates      │
│  CTA: "Get in Touch"                              │
│                                                     │
├─────────────────────────────────────────────────────┤
│  Footer (Links, copyright, contact)                │
└─────────────────────────────────────────────────────┘
```

### 3.2 Composants à créer
| Section | Composant | Responsabilité |
| --- | --- | --- |
| **Header** | Navbar | Logo, lien Tool, CTA Contact |
| **Hero** | Hero | Titre vision, subheader, CTA scroll |
| **Demo** | FilterPanel, ComparisonTable | MVP en action, connectés Redux |
| **Roadmap** | RoadmapSection, PhaseCard | Timeline visuelle 3 phases |
| **Benefits** | BenefitsGrid | 3 colonnes propositions de valeur |
| **B2B** | PartnershipSection | Info partenaires + formulaire contact |
| **Footer** | Footer | Links, copyright |

### 3.3 Messaging clé
- **Hero**: "The platform for intelligent bike component decisions"
- **Vision**: Évolution roues → all components → configurateur complet
- **MVP**: "Start here with wheels - more coming soon"
- **B2B**: "Help shape the future - data partnerships available"

---

## Phase 4: Redux State Management

### 4.1 wheelsSlice
```javascript
// store/slices/wheelsSlice.js
const wheelsSlice = createSlice({
  name: 'wheels',
  initialState: {
    items: wheelsData,
    loading: false,
    error: null
  }
});
```

### 4.2 filtersSlice
```javascript
// store/slices/filtersSlice.js
const filtersSlice = createSlice({
  name: 'filters',
  initialState: {
    brands: [],                  // string[] - filtrer sur wheel.brand
    rimMaterials: [],            // string[] - "Carbon" | "Alloy"
    hookless: null,              // null = tous | true | false
    minWeight: 700,
    maxWeight: 2000,
    minDepth: 20,
    maxDepth: 80,
    minPrice: 200,
    maxPrice: 5000,
    sortBy: 'name'               // 'name' | 'weight_asc' | 'weight_desc'
                                 // 'price_asc' | 'price_desc'
                                 // 'depth_asc' | 'depth_desc'
  },
  reducers: {
    setBrands:       (state, action) => { state.brands = action.payload; },
    setRimMaterials: (state, action) => { state.rimMaterials = action.payload; },
    setHookless:     (state, action) => { state.hookless = action.payload; },
    setMinWeight:    (state, action) => { state.minWeight = action.payload; },
    setMaxWeight:    (state, action) => { state.maxWeight = action.payload; },
    setMinDepth:     (state, action) => { state.minDepth = action.payload; },
    setMaxDepth:     (state, action) => { state.maxDepth = action.payload; },
    setMinPrice:     (state, action) => { state.minPrice = action.payload; },
    setMaxPrice:     (state, action) => { state.maxPrice = action.payload; },
    setSortBy:       (state, action) => { state.sortBy = action.payload; },
    resetFilters:    () => { /* retour à l'initialState */ }
  }
});
```

### 4.3 selectFilteredWheels
```javascript
// store/selectors/wheelsSelectors.js
const minPrice = (wheel) => Math.min(...wheel.prices.map(p => p.price_eur));

export const selectFilteredWheels = (state) => {
  const { wheels, filters } = state;
  return wheels.items
    .filter(wheel => {
      const brand_match    = filters.brands.length === 0       || filters.brands.includes(wheel.brand);
      const mat_match      = filters.rimMaterials.length === 0 || filters.rimMaterials.includes(wheel.rim.material);
      const hookless_match = filters.hookless === null          || wheel.rim.hookless === filters.hookless;
      const weight_match   = wheel.weight_grams >= filters.minWeight && wheel.weight_grams <= filters.maxWeight;
      const depth_match    = wheel.rim.depth_mm >= filters.minDepth  && wheel.rim.depth_mm <= filters.maxDepth;
      const price_match    = minPrice(wheel) >= filters.minPrice      && minPrice(wheel) <= filters.maxPrice;
      return brand_match && mat_match && hookless_match && weight_match && depth_match && price_match;
    })
    .sort((a, b) => {
      switch(filters.sortBy) {
        case 'weight_asc':  return a.weight_grams - b.weight_grams;
        case 'weight_desc': return b.weight_grams - a.weight_grams;
        case 'price_asc':   return minPrice(a) - minPrice(b);
        case 'price_desc':  return minPrice(b) - minPrice(a);
        case 'depth_asc':   return a.rim.depth_mm - b.rim.depth_mm;
        case 'depth_desc':  return b.rim.depth_mm - a.rim.depth_mm;
        default:            return a.model.localeCompare(b.model);
      }
    });
};
```

### 4.4 Intégration dans les composants
```javascript
// FilterPanel.jsx — dispatch les actions
const FilterPanel = () => {
  const dispatch = useDispatch();
  const filters = useSelector(state => state.filters);
  const allBrands = useSelector(state => [...new Set(state.wheels.items.map(w => w.brand))]);
  // ...
};

// ComparisonTable.jsx — lit le résultat filtré
const ComparisonTable = () => {
  const filteredWheels = useSelector(selectFilteredWheels);
  // ...
};
```

---

## Phase 5: Plan d'Implémentation

### Step 1: Initialisation Projet (45 min)
```bash
cd MyBikeLab
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install @reduxjs/toolkit react-redux
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Step 2: Données & Store Redux (1-2h)
1. Créer `src/data/wheelsData.js` avec ~15 roues d'exemple
2. Créer `src/store/` (index, slices, selectors)
3. Setup Tailwind config + `index.css`
4. Wrapper `<Provider store={store}>` dans `main.jsx`

### Step 3: Composants Core (5-6h)
1. **Navbar.jsx** - logo + "Try Tool" + "Contact" CTA
2. **Hero.jsx** - titre vision + subheader MVP + CTA scroll
3. **MiniComparator/FilterPanel.jsx** - checkboxes, sliders, sort (Redux)
4. **MiniComparator/ComparisonTable.jsx** - tableau dynamique (selectFilteredWheels)
5. **RoadmapSection.jsx** - timeline 3 phases visuelles
6. **BenefitsGrid.jsx** - 3 colonnes valeur
7. **PartnershipSection.jsx** - B2B info + ContactForm
8. **Footer.jsx** - links, copyright

### Step 4: Styling & Responsive (2-3h)
1. Tailwind CSS sur tous les composants
2. Design responsif mobile-first
3. Colors, typography, spacing cohérents

### Step 5: Polish & Déploiement (1h)
1. Favicon + meta tags SEO
2. `npm run build` → vérifier /dist
3. Déployer Vercel/Netlify

**Total estimé**: 10-13h

---

## Phase 6: Données MVP (~15 roues)

| Marque | Modèle | Poids | Profil | Mat. | Hookless | Prix min (€) |
| --- | --- | --- | --- | --- | --- | --- |
| Roval | Alpinist CLX II | 1225g | 33mm | Carbon | No | 1299 |
| Zipp | 303 Firecrest | 1510g | 45mm | Carbon | Yes | 1750 |
| DT Swiss | ARC 1100 62 | 1510g | 62mm | Carbon | No | 1990 |
| Fulcrum | Racing Zero Carbon | 1390g | 40mm | Carbon | No | 1200 |
| Shimano | Dura-Ace WH-R9270 | 1492g | 50mm | Carbon | No | 1600 |
| Hunt | 60 Limitless | 1620g | 60mm | Carbon | Yes | 899 |
| Campagnolo | Bora Ultra WTO 45 | 1349g | 45mm | Carbon | No | 2200 |
| Mavic | Cosmic Pro Carbon SL | 1610g | 40mm | Carbon | No | 1099 |
| Bontrager | Aeolus RSL 37 | 1314g | 37mm | Carbon | Yes | 2000 |
| Giant | SLR 0 36mm | 1375g | 36mm | Carbon | Yes | 1800 |
| Enve | SES 4.5 AR | 1470g | 45mm | Carbon | Yes | 2800 |
| Vittoria | Elusion 45 | 1580g | 45mm | Carbon | Yes | 750 |
| Reynolds | AR 58 | 1520g | 58mm | Carbon | Yes | 1650 |
| Boyd | Altamont 60 | 1620g | 60mm | Carbon | Yes | 850 |
| Princeton | CarbonWorks GRIT 4540 | 1480g | 40mm | Carbon | Yes | 2300 |

**Phase Future**: Vous fournirez données réelles → migration via seed PostgreSQL

---

## Vérification & Testing (Checklist)

### Frontend MVP
- [ ] `npm run dev` → page charge sur http://localhost:5173
- [ ] **Navbar**: logo + liens visibles
- [ ] **Hero**: titre vision + CTA scroll fonctionnel
- [ ] **FilterPanel**:
  - [ ] Checkboxes marques → filtrage immédiat
  - [ ] Sliders poids/profil/prix → filtrage immédiat
  - [ ] Dropdown tri → ordre change
  - [ ] Reset filtres → retour liste complète
- [ ] **ComparisonTable**:
  - [ ] Affiche ~15 roues par défaut
  - [ ] Colonnes: modèle, marque, poids, profil (mm), matériau, hooked/hookless, moyeu, prix min (€)
  - [ ] Liste se réduit dynamiquement avec les filtres
- [ ] **RoadmapSection**: 3 phases visibles
- [ ] **PartnershipSection**: formulaire contact visible
- [ ] **Responsive**: mobile (375px), tablette (768px), desktop (1280px)
- [ ] **Build**: `npm run build` sans erreurs, /dist généré

### Données
- [ ] wheelsData.js contient ~15 roues
- [ ] Chaque roue a: id, model, brand, weight_grams, diameter_mm, rim{}, spokes{}, hub{}, prices[], image
- [ ] Pas d'erreurs console

---

## Next Steps Après MVP Landing

1. **Collecte données réelles** — Vous fournirez structure + CSV
2. **Backend Node + PostgreSQL** — API /wheels avec filtrage côté serveur
3. **Connexion API** — Remplacer wheelsData.js par thunk async `fetchWheels()`
4. **Auth optionnelle** — Sauvegarde de comparaisons favorites
5. **Déploiement production** — Vercel (frontend) + Railway/Render (backend)
