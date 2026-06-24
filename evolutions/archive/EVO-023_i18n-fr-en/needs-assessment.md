# Needs Assessment

## 1. General Information

- Evolution ID: EVO-023
- Title: Internationalisation FR / EN
- Author: Flavien Drouot
- Date: 2026-05-28
- Status: Draft
- Priority: Independent — no dependency on any active evolution

---

## 2. Context

### Current situation

The site is a single-page React application written entirely in English. All user-facing strings are hardcoded in JSX components and in the central property registry (`wheelProperties.jsx`). There is no i18n infrastructure.

### Identified problem

The site has no French version, which prevents capturing French-speaking organic traffic and limits credibility with French-speaking partners (brands, retailers).

### Business motivation

- Capture French organic search traffic (SEO FR)
- Strengthen the brand's credibility with French-speaking manufacturers and retailers — part of the B2B partnership outreach strategy described in `product-overview.md`

---

## 3. Business Objective

Add a French translation of the full site interface, with automatic language detection and a manual toggle, while keeping the architecture open for future URL-based routing (required for full SEO multilingue).

---

## 4. Scope

### Included

- All static section text: Hero, Navbar, Footer, Roadmap, Benefits, Partnership
- All Comparator UI text: filter labels, column headers, sort controls, empty states, button labels
- Property labels defined in `wheelProperties.jsx` (displayed in filter panel and column selector)
- Language toggle visible in the Navbar (EN / FR)
- Auto-detection of browser preferred language on first visit
- Persistence of selected language in `localStorage`

### Excluded

- Wheel names, brand names, technical model numbers (brand-defined, language-neutral)
- Numeric specs (weight, price, dimensions)
- URL-based routing — no `/fr/` or `/en/` path prefix in this evolution
- SEO metadata (hreflang tags, per-language meta titles) — reserved for a future SEO evolution
- Languages beyond French and English
- Backend or server-side rendering

---

## 5. Constraints

### Business constraints

- Translations are delegated to an AI — no human translator involved
- English translations = current hardcoded strings (no new English copy required)

### Known technical constraints

- Frontend-only project (React 19 + Vite) — no server-side language negotiation
- Library: `react-i18next` (industry standard, compatible with Vite and React 19)
- Translation files: one JSON per language (`locales/en.json`, `locales/fr.json`), with structured dot-notation keys (e.g. `comparator.weight.label`, `landing.hero.title`)
- Architecture must remain extensible for future URL-prefix routing (React Router language-aware routes) without requiring an i18n rewrite

### Regulatory / security constraints

- None

---

## 6. Use Cases

### Nominal case

As an English-speaking cyclist,  
I visit the site with an English browser,  
so that I see all content in English without any action on my part.

### Alternative cases

- As a French-speaking cyclist, I visit the site with a French browser → I see all content in French automatically.
- As any visitor, I click the FR / EN toggle in the navbar → the interface switches language instantly, without page reload, and my choice is remembered on future visits.
- As a visitor whose browser language is neither FR nor EN → the site defaults to English.
- As a returning visitor whose localStorage was cleared → the browser language is re-detected and applied.

### Known error cases

- Browser language detection returns an unsupported locale (e.g. `de`, `es`) → fallback to EN, no error shown to the user.

---

## 7. Acceptance Criteria

- [ ] On first visit, the site detects the browser's preferred language and displays EN or FR accordingly
- [ ] When the detected language is neither FR nor EN, the site displays EN by default
- [ ] A language toggle (EN / FR) is visible in the Navbar on all viewport sizes
- [ ] Clicking the toggle switches the interface language instantly — no page reload
- [ ] The selected language is persisted in `localStorage` and restored on the next visit
- [ ] All user-facing strings in every section (Hero, Navbar, Footer, Roadmap, Benefits, Partnership, Comparator) are translated into French
- [ ] Property labels in the filter panel and column selector are translated
- [ ] Wheel names, brand names, and numeric specs are NOT translated
- [ ] The URL does not change when switching language
- [ ] The English version is functionally identical to the current site (no copy regression)

---

## 8. Open Questions

- None. All scope and architectural decisions have been resolved prior to this assessment.

---

## 9. Assumptions

- `wheelsData.js` contains no translatable text — only model names, brand names, and numeric specs
- The Navbar toggle will be a minimal text switcher ("EN" / "FR") — visual design to be specified in the PRD
- The EN translation file is produced by extracting the current hardcoded strings — no new English copy is required
- `wheelProperties.jsx` labels are the canonical source for filter and column display names; they will be replaced by translation key lookups
