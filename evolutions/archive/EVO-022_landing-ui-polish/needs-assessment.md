# Needs Assessment

## 1. General Information

- Evolution ID: EVO-022
- Title: Landing UI Polish — Section Backgrounds, Hero Typography, Favicon
- Author: Flavien Drouot
- Date: 2026-05-28
- Status: Draft
- Priority: Low

---

## 2. Context

### Current situation

The MyBikeLab landing page has several minor visual inconsistencies:
- Some consecutive sections share the same background color, creating a lack of visual rhythm and no clear demarcation between sections.
- The word "measured" in the Hero section's main title does not have the font/color treatment defined in the design system (as specified in `design-system/preview/direction-comparison.html`, NoteBook section).
- The browser tab displays a generic favicon instead of the MyBikeLab brand icon.

### Identified problem

Three independent visual regressions or oversights reduce the perceived polish of the landing page.

### Business motivation

The landing page serves as the main B2B credibility tool for brand and retailer outreach. Visual consistency and brand identity reinforce credibility.

---

## 3. Business Objective

Fix three visual inconsistencies to improve the overall polish of the landing page:
- Establish clear visual rhythm between all sections
- Ensure the Hero title reflects the intended design system typography
- Display the MyBikeLab brand icon in the browser tab

---

## 4. Scope

### Included

- Review and correct background colors of all landing page sections so no two consecutive sections share the same background
- Apply the correct font/color to the word "measured" in the Hero section main title, as defined in the design system
- Replace the current favicon with the existing MyBikeLab logo/icon asset

### Excluded

- Changes to section content, layout, or structure
- Creating a new favicon or logo
- Changes to any page other than the landing page
- Changes to the design system preview files

---

## 5. Constraints

### Business constraints

- The visual changes must remain consistent with the existing design system tokens (`paper-*`, `ink-*`, `brass-*`, `sage-*`)

### Known technical constraints

- None identified at this stage

### Regulatory / security constraints

- None

---

## 6. Use Cases

### Nominal case

As a visitor landing on MyBikeLab,  
I want to see clearly distinct sections and a recognizable browser tab icon,  
So that the page feels polished and brand-consistent.

### Alternative cases

- None

### Known error cases

- None

---

## 7. Acceptance Criteria

- [ ] No two consecutive sections on the landing page share the same background color
- [ ] The word "measured" in the Hero main title has the font style and color defined in the design system (NoteBook section of `direction-comparison.html`)
- [ ] The browser tab displays the MyBikeLab brand icon (not the default browser favicon)

---

## 8. Open Questions

- None

---

## 9. Assumptions

- A MyBikeLab logo/icon asset already exists in the project and can be used directly as a favicon
- The correct style for "measured" is unambiguously defined in `design-system/preview/direction-comparison.html`
