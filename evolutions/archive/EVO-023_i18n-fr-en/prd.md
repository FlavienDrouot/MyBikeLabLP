# PRD — Product Requirements Document

## 1. General Information

- Evolution ID: EVO-023
- Title: Internationalisation FR / EN
- Author: Flavien Drouot
- Date: 2026-05-28
- Version: 1.0
- Needs Assessment reference: `MyBikeLab/evolutions/EVO-023_i18n-fr-en/needs-assessment.md`

---

## 2. Functional Objective

The site must support two display languages — English and French — for all user-facing interface text. The active language is determined automatically on first visit and can be switched manually at any time via a toggle in the navigation bar. The choice is remembered across sessions.

---

## 3. Target Behavior

### General description

After this evolution, every user-facing string in the interface is available in both English and French. The site detects the visitor's browser language preference and applies the matching language on first load. A language toggle, always visible in the navigation bar, lets the visitor switch language instantly without reloading the page. The selected language is stored and restored on subsequent visits.

Content that is language-neutral — wheel model names, brand names, and numeric specifications — is never translated and remains identical in both languages.

---

## 4. Functional Rules

### FR-001 — Automatic language detection on first visit

On a visitor's first visit (no language preference stored), the site reads the browser's declared preferred language. If that language is French, the interface is displayed in French. If it is English or any other language, the interface is displayed in English. No error or notice is shown to the visitor in any case.

### FR-002 — Manual language toggle

A language selector labeled "EN" and "FR" is permanently displayed in the navigation bar, visible on all viewport sizes. Clicking a language option:
- switches the entire interface to that language immediately,
- requires no page reload,
- takes effect across all visible sections simultaneously.

### FR-003 — Language persistence across sessions

When a visitor selects a language manually, or when the language is auto-detected on first visit, that language preference is saved and restored on the next visit. If the stored preference is cleared or unavailable, the browser language is re-detected and the detection rule (FR-001) applies again.

### FR-004 — Scope of translated content

The following interface areas are fully translated in both languages:

- Navigation bar (all labels and controls)
- Hero section (all text content)
- Comparator section: filter labels, column headers, sort controls, button labels, empty state messages, and property labels displayed in the filter panel and column selector
- Roadmap section (all text content)
- Benefits section (all text content)
- Partnership section (all text content)
- Footer (all text content)

### FR-005 — Language-neutral content

The following content is identical in both languages and is never translated:

- Wheel model names
- Brand names
- Technical model numbers
- Numeric specifications (weight, price, rim depth, rim width, etc.)

### FR-006 — English version equivalence

The English version of the interface must be functionally and textually equivalent to the current site. No existing English copy is modified, added, or removed as part of this evolution.

### FR-007 — URL stability

The URL does not change when the visitor switches language. No language path prefix (such as `/fr/` or `/en/`) is introduced.

### FR-008 — Extensibility for future URL routing

The language system must be structured in a way that allows a future evolution to introduce URL-based language routing (e.g., `/fr/`, `/en/` path prefixes) without requiring a redesign of the translation system itself.

---

## 5. Detailed Use Cases

### UC-001 — English-speaking visitor on first visit

#### Preconditions
- The visitor has never visited the site before (no stored language preference).
- The visitor's browser is configured with English as the preferred language.

#### Steps
1. Visitor navigates to the site.
2. The site reads the browser language preference.
3. English is detected.
4. The interface is displayed in English.

#### Expected result
- All interface text is in English.
- No language prompt or notice is shown.
- The EN option in the toggle reflects the active state.

#### Error cases
- None.

---

### UC-002 — French-speaking visitor on first visit

#### Preconditions
- The visitor has never visited the site before (no stored language preference).
- The visitor's browser is configured with French as the preferred language.

#### Steps
1. Visitor navigates to the site.
2. The site reads the browser language preference.
3. French is detected.
4. The interface is displayed in French.

#### Expected result
- All interface text is in French.
- No language prompt or notice is shown.
- The FR option in the toggle reflects the active state.

#### Error cases
- None.

---

### UC-003 — Visitor with unsupported browser language

#### Preconditions
- The visitor has never visited the site before (no stored language preference).
- The visitor's browser is configured with a language other than English or French (e.g., German, Spanish).

#### Steps
1. Visitor navigates to the site.
2. The site reads the browser language preference.
3. The language is neither English nor French.
4. The site defaults to English.

#### Expected result
- All interface text is in English.
- No error or notice is shown to the visitor.
- The EN option in the toggle reflects the active state.

#### Error cases
- None visible to the visitor.

---

### UC-004 — Visitor switches language using the toggle

#### Preconditions
- The visitor is on the site in any language.
- The language toggle (EN / FR) is visible in the navigation bar.

#### Steps
1. Visitor clicks the toggle option for the other language (e.g., clicks "FR" while in English, or "EN" while in French).
2. The interface language switches immediately.

#### Expected result
- All interface text updates to the selected language without a page reload.
- The URL does not change.
- The selected toggle option reflects the active state.
- The preference is saved for future visits.

#### Error cases
- None.

---

### UC-005 — Returning visitor with a stored language preference

#### Preconditions
- The visitor has previously selected or auto-detected a language preference, which was saved.

#### Steps
1. Visitor returns to the site.
2. The site reads the stored preference.
3. The interface is displayed in the stored language.

#### Expected result
- The interface is displayed in the previously selected language.
- No re-detection occurs.

#### Error cases
- If the stored preference is unavailable or cleared, the browser language is re-detected per UC-001, UC-002, or UC-003.

---

### UC-006 — Returning visitor whose stored preference was cleared

#### Preconditions
- The visitor previously used the site, but the stored language preference has since been cleared (e.g., browser data cleared).

#### Steps
1. Visitor returns to the site.
2. No stored preference is found.
3. The browser language is re-detected.
4. The detection rules from UC-001, UC-002, or UC-003 apply.

#### Expected result
- The interface is displayed based on the browser language, as on a first visit.
- The detected preference is saved again.

#### Error cases
- None.

---

## 6. Acceptance Criteria

### AC-001
#### Description
On first visit with a browser configured in English, the interface is displayed in English.
#### Expected verification
Open the site with no stored language preference and an English browser locale. Verify all visible interface text is in English.
#### Type
- Manual

---

### AC-002
#### Description
On first visit with a browser configured in French, the interface is displayed in French.
#### Expected verification
Open the site with no stored language preference and a French browser locale. Verify all visible interface text is in French.
#### Type
- Manual

---

### AC-003
#### Description
On first visit with a browser configured in an unsupported language, the interface defaults to English.
#### Expected verification
Open the site with no stored language preference and a browser locale set to a language other than EN or FR (e.g., `de`). Verify all visible interface text is in English and no error is displayed.
#### Type
- Manual

---

### AC-004
#### Description
The language toggle (EN / FR) is visible in the navigation bar on all viewport sizes.
#### Expected verification
Load the site at desktop, tablet, and mobile viewport widths. Verify the EN / FR toggle is visible and accessible at each size.
#### Type
- Manual

---

### AC-005
#### Description
Clicking the toggle switches the interface language without a page reload.
#### Expected verification
With the site open in one language, click the toggle for the other language. Verify all interface text updates and the URL does not change, with no full page reload.
#### Type
- Manual

---

### AC-006
#### Description
All sections are translated: Hero, Navbar, Footer, Roadmap, Benefits, Partnership, and all Comparator UI text.
#### Expected verification
Switch to French. Read through every section and every Comparator control (filter labels, column headers, sort controls, button labels, empty states). Verify no English string remains untranslated.
#### Type
- Manual

---

### AC-007
#### Description
Property labels in the filter panel and column selector are translated into French.
#### Expected verification
Switch to French. Open the filter panel and the column selector. Verify all property labels are displayed in French.
#### Type
- Manual

---

### AC-008
#### Description
Wheel model names, brand names, and numeric specifications are not translated.
#### Expected verification
In French mode, verify that model names, brand names, and all numeric values (weight, price, dimensions) are identical to the English version.
#### Type
- Manual

---

### AC-009
#### Description
The selected language is persisted and restored on the next visit.
#### Expected verification
Select French using the toggle. Close and reopen the browser. Navigate to the site. Verify the interface is displayed in French without any re-detection.
#### Type
- Manual

---

### AC-010
#### Description
When the stored language preference is cleared, browser language is re-detected on the next visit.
#### Expected verification
Select French, then clear stored data. Reopen the site with a browser configured in English. Verify the interface is displayed in English.
#### Type
- Manual

---

### AC-011
#### Description
The English version is functionally and textually identical to the current site — no copy regression.
#### Expected verification
Display the site in English and compare each section text against the pre-evolution content. Verify no string has been modified, added, or removed.
#### Type
- Manual

---

## 7. Functional Impacts

### Impacted components

- **Navbar**: must include the language toggle (EN / FR) and render in the active language.
- **Hero section**: all text content must be language-aware.
- **Wheel Comparator**: filter labels, column headers, sort controls, button labels, empty state messages must be language-aware.
- **Filter panel**: property labels must be language-aware.
- **Column selector**: property labels must be language-aware.
- **Roadmap section**: all text content must be language-aware.
- **Benefits section**: all text content must be language-aware.
- **Partnership section**: all text content must be language-aware.
- **Footer**: all text content must be language-aware.
- **Property registry** (`wheelProperties.jsx`): property labels must be resolved through the translation system rather than being hardcoded strings.

### Impacted data

- **All hardcoded user-facing strings** across all components listed above must be externalized into the translation system.
- **Language preference**: stored across sessions (FR-003). The storage mechanism is an implementation detail.
- **French translation content**: a complete French translation of all interface strings must be produced.

### Impacted APIs

- None. This evolution is entirely frontend-only; no backend or server-side API is involved.

### Impacted permissions / roles

- None.

---

## 8. Out of Scope

- Wheel names, brand names, technical model numbers
- Numeric specifications (weight, price, dimensions)
- URL-based routing — no `/fr/` or `/en/` path prefix
- SEO metadata (hreflang tags, per-language meta titles)
- Languages beyond French and English
- Backend or server-side rendering
- Human translation review — translations are produced by AI

---

## 9. Constraints

- English translations correspond exactly to the current hardcoded strings — no new English copy is required.
- Translations are delegated to AI; no human translator is involved.
- The language system must remain extensible for future URL-prefix routing without requiring an i18n rewrite.
- The site is a frontend-only application; no server-side language negotiation is available.

---

## 10. Test Plan

### Automated tests expected

- None identified for this evolution. The acceptance criteria are best verified manually given the nature of the feature (UI text, browser locale detection, toggle behavior).

### Manual tests expected

- AC-001 through AC-011 as defined above.
- Verify the toggle is accessible by keyboard (tab focus, activation).
- Verify no layout breaks occur in either language (particularly for French strings that may be longer than their English equivalents).

### Edge cases

- Browser language returns a regional variant (e.g., `fr-CA`, `fr-BE`, `en-GB`, `en-US`) — verify French variants resolve to FR, English variants resolve to EN.
- Browser language header returns an empty or malformed value — verify fallback to English with no visible error.
- Rapid successive toggle clicks — verify the interface remains consistent and does not produce visual glitches or state inconsistencies.

### Non-regression

- The English interface must be functionally and textually identical to the current site at every section. This must be verified explicitly before the evolution is considered complete (AC-011).
- The Comparator interactive features (filtering, sorting, column show/hide) must work identically in both languages.
