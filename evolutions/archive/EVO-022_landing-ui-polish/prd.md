# PRD — Product Requirements Document

## 1. General Information

- Evolution ID: EVO-022
- Title: Landing UI Polish — Section Backgrounds, Hero Typography, Favicon
- Author: Flavien Drouot
- Date: 2026-05-28
- Version: 1.0
- Needs Assessment reference: `MyBikeLab/evolutions/EVO-022_landing-ui-polish/needs-assessment.md`

---

## 2. Functional Objective

After this evolution, the MyBikeLab landing page must present a visually consistent and brand-compliant appearance across three specific areas: alternating section backgrounds that create clear visual rhythm, Hero title typography that matches the NoteBook design direction, and a MyBikeLab brand favicon in the browser tab.

---

## 3. Target Behavior

### General description

A visitor arriving on the landing page sees:

- Visually distinct sections — no two adjacent sections share the same background color, so the page scans naturally from top to bottom.
- A Hero section whose main title renders the word "measured" with italic style and `var(--brass-8)` color, exactly as specified for the `.hero-title em` element in the NoteBook direction of `design-system/preview/direction-comparison.html`.
- A browser tab that displays the MyBikeLab brand icon instead of the generic browser default.

No section content, layout, copy, or interactive behavior changes.

---

## 4. Functional Rules

### FR-001 — Section background alternation

Every landing page section must have a background color that differs from the background color of the section immediately preceding it. The colors used must come exclusively from the existing design system token palette (`paper-*`, `ink-*`, `brass-*`, `sage-*`). This rule applies to all sections: Hero, Wheel Comparator, Roadmap, Benefits, Partnership, and Footer.

### FR-002 — Hero title "measured" typography

The word "measured" inside the Hero section's main title heading must be rendered with:
- `font-style: italic`
- `color: var(--brass-8)`
- `font-weight: 300`
- `letter-spacing: -0.05em`

These values are the NoteBook-direction override defined for `.hero-title em` in `design-system/preview/direction-comparison.html` (line ~158). No other words in the title are affected.

### FR-003 — Brand favicon in browser tab

The browser tab must display the MyBikeLab brand icon. The asset used must be the existing project logo/icon; no new asset is to be created. The favicon must be declared via a `<link rel="icon">` element in the landing page `<head>`.

---

## 5. Detailed Use Cases

### UC-001 — Visitor scans the landing page

#### Preconditions
- The visitor opens the MyBikeLab landing page in any modern browser.

#### Steps
1. The page loads fully.
2. The visitor scrolls from top to bottom, passing through all sections (Hero → Wheel Comparator → Roadmap → Benefits → Partnership → Footer).

#### Expected result
- Each section is visually distinct from the one above it; no two consecutive sections share the same background color.
- The visitor can identify each section boundary without relying solely on content or headings.

#### Error cases
- None applicable (purely visual, no interaction).

---

### UC-002 — Visitor reads the Hero title

#### Preconditions
- The visitor is on the landing page with the Hero section visible.

#### Steps
1. The visitor reads the main Hero heading.

#### Expected result
- The word "measured" appears in italic, colored `var(--brass-8)`, visually distinct from the surrounding bold dark title text.
- All other words in the heading retain their standard treatment (font-weight 800, color `var(--ink-12)`).

#### Error cases
- None applicable.

---

### UC-003 — Visitor identifies the page in a browser tab

#### Preconditions
- The visitor has the MyBikeLab landing page open in any modern browser.

#### Steps
1. The visitor looks at the browser tab (or bookmark bar).

#### Expected result
- The MyBikeLab brand icon is displayed in the tab, replacing the browser default favicon.

#### Error cases
- If the favicon asset cannot be resolved, the browser falls back to its default — this is an implementation concern, not a functional divergence from the rule.

---

## 6. Acceptance Criteria

### AC-001
#### Description
No two consecutive sections on the landing page share the same background color.

#### Expected verification
Open the landing page. Visually inspect the boundary between each pair of adjacent sections (Hero/Comparator, Comparator/Roadmap, Roadmap/Benefits, Benefits/Partnership, Partnership/Footer). Each transition must show a color change.

#### Type
- Manual

---

### AC-002
#### Description
The background colors applied to sections use only tokens from the design system palette (`paper-*`, `ink-*`, `brass-*`, `sage-*`).

#### Expected verification
Inspect the CSS or inline styles applied to each section. Confirm no raw hex/rgb values outside the token set are introduced.

#### Type
- Manual (code review)

---

### AC-003
#### Description
The word "measured" in the Hero main title is rendered italic and in `var(--brass-8)`.

#### Expected verification
Open the landing page. Inspect the Hero heading. Confirm "measured" is italic and visually gold/brass-colored, distinct from the surrounding dark bold text. Optionally confirm via browser DevTools that `font-style: italic` and `color: var(--brass-8)` are applied to the corresponding `<em>` element.

#### Type
- Manual

---

### AC-004
#### Description
The browser tab displays the MyBikeLab brand icon.

#### Expected verification
Open the landing page in a modern browser. Observe the favicon in the browser tab. Confirm it shows the MyBikeLab brand icon and not a generic browser default.

#### Type
- Manual

---

## 7. Functional Impacts

### Impacted components
- Landing page HTML (`<head>` for favicon declaration)
- Landing page section markup or CSS (background color assignments for all sections)
- Hero section heading markup (the `<em>` wrapper on "measured" and/or its CSS rule)

### Impacted data
- None

### Impacted APIs
- None

### Impacted permissions / roles
- None

---

## 8. Out of Scope

- Changes to section content, copy, layout, or structure
- Creating a new favicon or logo asset
- Changes to any page other than the landing page
- Changes to `design-system/preview/direction-comparison.html` or any other design system preview file
- Changes to the Wheel Comparator interactive behavior or data

---

## 9. Constraints

- All background colors introduced must use existing design system tokens (`paper-*`, `ink-*`, `brass-*`, `sage-*`); no raw color values outside the token palette.
- The favicon asset must be an existing project asset; no new asset is to be created or commissioned.
- The "measured" typography treatment must exactly match the NoteBook-direction spec in `design-system/preview/direction-comparison.html`: `font-style: italic`, `color: var(--brass-8)`, `font-weight: 300`, `letter-spacing: -0.05em`.

---

## 10. Test Plan

### Automated tests expected
- None — all three changes are purely visual and do not affect application logic, data, or interactive behavior.

### Manual tests expected
- Open the landing page and scroll through all sections: confirm background color alternation at every section boundary.
- Inspect the Hero heading: confirm "measured" is italic and brass-colored; confirm all other words are unaffected.
- Open the page in a browser: confirm the favicon in the tab is the MyBikeLab brand icon.
- Inspect the HTML `<head>`: confirm a `<link rel="icon">` element pointing to the brand asset is present.

### Edge cases
- Verify behavior in both light-mode and dark-mode browser settings if the site supports OS-level color scheme.
- Confirm the favicon displays correctly at small tab sizes (16×16 px effective rendering).

### Non-regression
- Confirm no section content, layout, spacing, or interactive behavior has changed.
- Confirm the Wheel Comparator remains fully functional after the changes.
- Confirm no other heading or text element on the landing page has been unintentionally restyled.
