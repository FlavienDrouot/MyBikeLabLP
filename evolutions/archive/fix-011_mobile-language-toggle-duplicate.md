# Fix: Mobile language toggle duplicate

- **ID:** fix-011
- **Date:** 2026-06-03
- **Status:** Done

---

## Context & Need

The navbar renders the language toggle in the main header and again inside the mobile menu. On mobile, opening the menu shows the language choice twice, which makes the navigation feel duplicated. The preferred behavior is to keep the always-visible navbar toggle and remove the duplicate from the opened mobile menu.

---

## Acceptance Criteria

- [x] On mobile, the language toggle remains visible in the main navbar.
- [x] On mobile, opening the menu does not show a second language toggle.
- [x] Desktop navbar behavior is unchanged.

---

## Technical Tasks

### Task 1 - Remove duplicate mobile menu language toggle

**Files:** `frontend/src/components/Navbar.jsx`
**What to do:** Keep the `LanguageToggle` rendered in the main navbar controls and remove the `LanguageToggle` block from the mobile menu content.
**Validation:** Inspect the JSX and run the frontend build to confirm the navbar compiles.

---

## Implementation Notes

### Task 1
- Removed the duplicate `LanguageToggle` block from the mobile menu content.
- Kept the existing `LanguageToggle` in the main navbar controls, so it remains visible on mobile and desktop.
- Validation: `npm.cmd run build` completed successfully.
