# PRD — Product Requirements Document

## 1. General Information

- Evolution ID: EVO-040
- Title: Design system — Navbar + Footer
- Author: Flavien Drouot
- Date: 2026-06-03
- Version: 1.0
- Needs Assessment reference: `evolutions/EVO-040_design-system-navbar-footer/needs-assessment.md`

---

## 2. Functional Objective

After this evolution, the Navbar and Footer present a visual identity fully consistent with the design system token layer established by EVO-039. Both components use only design system tokens for color, typography, spacing, and interactive states. No legacy `brand-*` scale or arbitrary color values remain in either component. Every visitor to the application — on desktop or mobile, in English or French — sees shell components that match the overall design language of the page.

---

## 3. Target Behavior

### General description

The Navbar is a sticky shell component fixed at the top of every page. It carries the brand mark, primary navigation links, a language toggle, and a contact CTA. On small viewports it collapses to a hamburger-triggered mobile menu. Its background is translucent with a backdrop blur so content beneath it remains partially visible while scrolling.

The Footer is a full-width closing band at the bottom of every page. It uses a dark inverse surface (deep ink background, light text) to visually close the page. It carries the brand mark, a copyright line, and a secondary navigation row mirroring the Navbar links.

Both components are the reference implementations defined in `design-system/ui_kits/landing/Navbar.jsx` and `design-system/ui_kits/landing/Footer.jsx`, adapted for the production React/i18n wiring already in place.

---

## 4. Functional Rules

### FR-001 — Navbar sticky positioning and background treatment

The Navbar is positioned sticky at the top of the viewport (`position: sticky; top: 0`), layered above page content. Its background uses a translucent paper surface with backdrop blur. This treatment is expressed exclusively via design system tokens. No other component in the application uses this background treatment.

### FR-002 — Navbar brand mark

The Navbar displays the MyBikeLab brand mark (LogoMark SVG inline component) paired with the wordmark "MyBikeLab" as a text label. The combination is a single interactive element linking to the top of the page. Colors are expressed via `currentColor` so they inherit the surrounding foreground token.

### FR-003 — Navbar primary navigation links

The Navbar contains three primary navigation links: Comparator, Roadmap, Partnerships. Each link is rendered using the design system's ghost button or nav-link pattern. The resting color uses the ink token for primary text. On hover the color transitions to the brass accent token. The active state (current section in view) is also expressed via the brass token. No Tailwind blue classes (`text-blue-*`, `hover:text-blue-*`) remain.

### FR-004 — Navbar contact CTA

The Navbar contains a single CTA button linking to the contact section. It uses the design system's primary button token (brass accent fill, paper text). The button is always visible alongside the navigation links at desktop breakpoint.

### FR-005 — Navbar language toggle

The Navbar contains a language toggle allowing the user to switch between EN and FR. The active language is indicated using the brass accent fill. The inactive language uses the ink muted token. The toggle is visible at all breakpoints (desktop row and mobile menu panel).

### FR-006 — Navbar mobile menu

On viewports below the `md` breakpoint the primary navigation links are hidden. A hamburger icon button reveals a mobile menu panel below the Navbar bar. The panel displays the three navigation links and the language toggle. Tapping a link closes the panel. The icon and panel states are expressed via design system tokens; no legacy or Tailwind blue classes remain.

### FR-007 — Navbar height CSS variable

The Navbar measures its own rendered height on mount and on resize, and writes the value to the `--navbar-height` CSS custom property on `:root`. Consumers of this variable (scroll-padding-top, MiniComparator panel height formula) must continue to receive an accurate value after the migration.

### FR-008 — Footer inverse surface

The Footer uses the design system's dark inverse card surface token (`var(--bg-inverse)`, resolved to `ink-12` near-black) as its background. Text elements use the paper-side foreground token for legible contrast. No legacy `brand-*` or Tailwind blue classes remain.

### FR-009 — Footer brand mark and copyright line

The Footer displays the LogoMark SVG inline component alongside the wordmark "MyBikeLab". Beneath or beside it appears a copyright line including the current year and a tagline. On the inverse surface the mark inherits the light paper token via `currentColor`.

### FR-010 — Footer navigation links

The Footer contains four navigation links: Comparator, Roadmap, Partnerships, Contact. Each link uses the paper-side muted token at rest; on hover the color transitions to the brass accent token. No Tailwind blue classes remain.

### FR-011 — Responsive layout

At desktop breakpoints both components display their content in a single horizontal row within the max-width container. At mobile breakpoints the Footer reflowed to a column stack (brand block above, navigation links below). The Navbar collapses as described in FR-006.

### FR-012 — i18n label correctness

All user-visible text strings in both components are sourced from the i18n translation layer (`useTranslation`). FR and EN labels must render correctly after the migration. The migration must not remove, rename, or break any existing translation keys consumed by Navbar or Footer.

### FR-013 — Token-only color expression

After migration, neither component contains raw hex values, `#ffffff`, `#000000`, nor any class from the legacy `brand-*` scale. All colors are expressed via CSS custom properties defined in the design system token layer.

---

## 5. Detailed Use Cases

### UC-001 — Visitor views the page on desktop

#### Preconditions
- User opens the application in a desktop browser (viewport >= `md` breakpoint).

#### Steps
1. Page loads. The Navbar appears at the top, sticky.
2. User reads the brand mark, navigation links (Comparator, Roadmap, Partnerships), language toggle, and contact CTA in a single horizontal row.
3. User scrolls down. The Navbar remains visible at the top; its translucent paper background with backdrop blur is visible over scrolling content.
4. User hovers over a navigation link. The link color transitions to brass.
5. User clicks the contact CTA. The page scrolls to the contact section.
6. User reaches the bottom of the page. The Footer displays on a dark inverse surface with the brand mark, copyright line, and four navigation links.
7. User hovers over a Footer link. The link color transitions to brass.

#### Expected result
- All colors, states, and layout match the design system reference implementations.
- No legacy or blue-scale styling is visible.

#### Error cases
- None identified.

---

### UC-002 — Visitor views the page on mobile

#### Preconditions
- User opens the application in a mobile browser (viewport below `md` breakpoint).

#### Steps
1. Page loads. The Navbar appears at the top, sticky. Primary navigation links are hidden; a hamburger icon is visible.
2. User taps the hamburger icon. The mobile menu panel opens below the Navbar bar, showing the three navigation links and the language toggle.
3. User taps a navigation link. The panel closes and the page scrolls to the target section.
4. User reaches the bottom of the page. The Footer displays with the brand block stacked above the navigation links (column layout).

#### Expected result
- All design system tokens apply correctly at mobile breakpoints.
- Mobile menu open/close behavior is unchanged from the pre-migration state.

#### Error cases
- None identified.

---

### UC-003 — Visitor switches language

#### Preconditions
- User is on any breakpoint. Current language is EN (or FR).

#### Steps
1. User locates the language toggle in the Navbar (desktop row or mobile menu panel).
2. User taps the alternate language button.
3. All Navbar and Footer labels update to the selected language.

#### Expected result
- Both FR and EN translation keys render correctly.
- No label reverts to a raw key string (e.g., `nav.tool`) after migration.

#### Error cases
- None identified.

---

## 6. Acceptance Criteria

### AC-001
#### Description
The production Navbar structure and CSS class usage matches the reference in `design-system/ui_kits/landing/Navbar.jsx` for brand mark, navigation links, CTA, and layout.
#### Expected verification
Side-by-side visual comparison of the rendered Navbar against the ui_kit reference at desktop breakpoint. Structure and token usage reviewed in JSX source.
#### Type
- Manual

---

### AC-002
#### Description
The production Footer structure and CSS class usage matches the reference in `design-system/ui_kits/landing/Footer.jsx` for brand mark, copyright line, navigation links, and inverse surface.
#### Expected verification
Side-by-side visual comparison of the rendered Footer against the ui_kit reference. Structure and token usage reviewed in JSX source.
#### Type
- Manual

---

### AC-003
#### Description
The Navbar is sticky. It remains at the top of the viewport while the user scrolls through the full page.
#### Expected verification
Manual scroll test on desktop and mobile viewports. Navbar remains fixed at top throughout.
#### Type
- Manual

---

### AC-004
#### Description
The Navbar background uses a translucent paper surface with backdrop blur, expressed via design system tokens. No hardcoded rgba or blur values remain outside the token layer.
#### Expected verification
Inspect the `<header>` element's applied styles. Background and backdrop-filter values match the design system specification (`rgba(246,244,239,0.88)`, `blur(8px)` or equivalent token references). Confirm no raw hex outside the token definition.
#### Type
- Manual

---

### AC-005
#### Description
Navbar navigation links use the ink primary foreground token at rest and the brass accent token on hover and active states. No Tailwind blue classes (`text-blue-*`, `hover:text-blue-*`) remain in Navbar.jsx.
#### Expected verification
Source code search confirms zero occurrences of `text-blue-`, `hover:text-blue-`, `brand-` in `Navbar.jsx`. Manual hover test confirms brass color transition.
#### Type
- Automated (static analysis) + Manual

---

### AC-006
#### Description
The Footer background uses the ink inverse surface token. Text uses the paper-side foreground token. No legacy `brand-*` or Tailwind blue classes remain in Footer.jsx.
#### Expected verification
Source code search confirms zero occurrences of `brand-`, `text-blue-`, `hover:text-blue-` in `Footer.jsx`. Visual verification of dark inverse surface at runtime.
#### Type
- Automated (static analysis) + Manual

---

### AC-007
#### Description
Both components are correctly styled and functional on mobile viewports (below `md` breakpoint). Navbar mobile menu opens and closes. Footer reflowes to column layout.
#### Expected verification
Manual test on a 375px viewport (or browser devtools mobile simulation). Mobile menu toggle works. Footer layout is single-column stack.
#### Type
- Manual

---

### AC-008
#### Description
FR and EN labels render correctly in Navbar and Footer after migration. No translation key is missing or broken.
#### Expected verification
Manual test: switch language toggle between EN and FR. All visible labels in both components update to the correct translation. No raw key string (e.g., `nav.tool`) appears.
#### Type
- Manual

---

### AC-009
#### Description
The `--navbar-height` CSS custom property on `:root` is set to the actual rendered height of the Navbar on load and updated on resize.
#### Expected verification
Open browser devtools console. After page load, confirm `getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')` returns a non-zero pixel value matching the Navbar's `offsetHeight`. Resize the window and confirm the value updates.
#### Type
- Manual

---

### AC-010
#### Description
No raw hex values, `#ffffff`, `#000000`, or `brand-*` class names appear in either `Navbar.jsx` or `Footer.jsx` after migration.
#### Expected verification
Static grep of both files for: raw hex patterns (`#[0-9a-fA-F]{3,6}`), `brand-`, `#fff`, `#000`.
#### Type
- Automated (static analysis)

---

## 7. Functional Impacts

### Impacted components
- `frontend/src/components/Navbar.jsx` — primary target, full token migration and structural alignment
- `frontend/src/components/Footer.jsx` — primary target, full token migration and structural alignment
- `frontend/src/components/__tests__/Navbar.test.jsx` — test file must remain consistent with migrated structure
- `frontend/src/components/__tests__/Footer.test.jsx` — test file must remain consistent with migrated structure
- Any component that reads `--navbar-height` (e.g., `MiniComparator`) — must continue to receive correct values; no change to their own code expected

### Impacted data
- i18n translation files (FR/EN) — existing keys consumed by Navbar and Footer must not be removed or renamed. No new translation keys are introduced unless required to cover currently hardcoded strings that should be translated.

### Impacted APIs
- None.

### Impacted permissions / roles
- None.

---

## 8. Out of Scope

- All other components and page sections (Hero, Wheel Comparator, Roadmap, Benefits, Partnership section)
- Adding new navigation links or sections not currently present in either component
- Any new features (animated transitions beyond existing motion system, mega-menus, notification badges, etc.)
- Changes to the design system token definitions themselves (those are established by EVO-039)
- Backend, routing, or data layer changes

---

## 9. Constraints

- EVO-039 (foundation tokens) must be complete and merged before this evolution begins. The Tailwind config must expose the full token layer that the migrated components will consume.
- The reference implementations in `design-system/ui_kits/landing/` are the single source of truth for token usage, layout, and structure. The production components are brought in line with the ui_kit, not the other way around.
- Existing i18n keys in Navbar and Footer must continue to work. No translation regressions are acceptable.
- The `--navbar-height` CSS variable write behavior (FR-007) must be preserved. Consumers of this variable must not break.
- No raw hex values, `#ffffff`, `#000000`, or legacy `brand-*` classes may remain in either component after migration.

---

## 10. Test Plan

### Automated tests expected
- Static analysis: grep `Navbar.jsx` and `Footer.jsx` for forbidden patterns (`brand-`, `text-blue-`, `hover:text-blue-`, raw hex `#[0-9a-fA-F]`, `#fff`, `#000`). Expect zero matches.
- Existing unit tests in `Navbar.test.jsx` and `Footer.test.jsx` must pass without modification to test logic (only structural updates if element selectors change).

### Manual tests expected
- Desktop viewport: full visual comparison of Navbar and Footer against ui_kit reference screenshots.
- Desktop viewport: hover states on all navigation links (Navbar and Footer) confirm brass accent transition.
- Desktop viewport: contact CTA click scrolls to contact section.
- Mobile viewport (375px): Navbar hamburger opens and closes mobile menu; all links close the menu on tap.
- Mobile viewport (375px): Footer displays in column layout.
- Language toggle: switch EN to FR and back. All Navbar and Footer labels update correctly. No raw key strings visible.
- Scroll test: confirm Navbar remains sticky at the top of the viewport while scrolling the full page length.
- Backdrop blur: confirm translucent paper background is visible over page content while scrolling.

### Edge cases
- Resize the browser window across the `md` breakpoint while the mobile menu is open: menu state resets correctly.
- Language switched while mobile menu is open: labels in the open menu update immediately.

### Non-regression
- `--navbar-height` value is present and accurate after load. Resize observer updates the value when window is resized.
- MiniComparator (or any other consumer of `--navbar-height`) renders correctly and is not broken by the Navbar migration.
- No visual regression on sections between Navbar and Footer (Hero, Comparator, Roadmap, Benefits, Partnership) — these are untouched by this evolution.
