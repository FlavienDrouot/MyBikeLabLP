# Technical Specifications

## 1. General Information

- Evolution ID: EVO-012
- PRD reference: `MyBikeLab/evolutions/EVO-012_lucide-icon-system/prd.md`
- Author: Flavien Drouot
- Date: 2026-05-27

---

## 2. Technical Context

### Technical objective

Install `lucide-react` as a production dependency, introduce a shared `Icon` wrapper component that enforces DS stroke defaults (strokeWidth 1.4, strokeLinecap square, strokeLinejoin miter, color currentColor) in a single place, then replace every ad-hoc inline SVG used as a UI icon across the seven affected components with the appropriate Lucide icon rendered through that wrapper.

### Affected architecture

- Frontend React application (`MyBikeLab/frontend/`)
- No backend, no Redux store, no data layer is affected

### Impacted modules

- `package.json` — new runtime dependency
- `src/components/ui/Icon.jsx` — new shared wrapper (to be created)
- `src/components/Navbar.jsx` — 2 inline SVGs replaced
- `src/components/MiniComparator/MiniComparator.jsx` — 2 inline SVGs replaced
- `src/components/MiniComparator/FilterPanel.jsx` — 1 inline SVG replaced
- `src/components/MiniComparator/ComparisonTable.jsx` — 1 local SVG component replaced
- `src/components/MiniComparator/ColumnSelector.jsx` — 1 inline SVG replaced
- `src/components/ContactForm.jsx` — 1 inline SVG replaced
- `src/components/Footer.jsx` — audited, no SVG icons present; no change required

---

## 3. Technical Constraints

- `lucide-react` must be imported tree-shaken: only named icon imports are permitted; no wildcard `import * from 'lucide-react'`
- DS stroke defaults (`strokeWidth: 1.4`, `strokeLinecap: 'square'`, `strokeLinejoin: 'miter'`) must be defined in exactly one place: `src/components/ui/Icon.jsx`
- No inline `<svg>` may remain in `src/components/` for any UI icon after this evolution
- `assets/wheel-schematic.svg` and any other illustration file must not be modified
- No layout regression is acceptable in any affected component — icon replacement must not shift surrounding element positions, sizes, or spacing
- Bundle size addition from the icon library must remain below 15 KB (tree-shaken production build delta)
- `lucide-react` must be added to `dependencies`, not `devDependencies`
- Icon size may be specified at the call site; size override must not affect DS stroke defaults
- `fill="none"` is always set on Lucide icons; no `fill` override is permitted

---

## 4. Architecture Decisions

### AD-001 — Shared `Icon` wrapper component as the single DS configuration point

#### Description
A thin React wrapper component `src/components/ui/Icon.jsx` accepts a Lucide icon component via an `as` prop and an optional `size` prop. It forwards all DS stroke defaults as fixed props to the Lucide component and passes `size` through. All icon uses across the codebase import `Icon` and pass the desired Lucide component — they never import and render Lucide components directly.

Signature:
```jsx
// src/components/ui/Icon.jsx
import { forwardRef } from 'react';

const DS_PROPS = {
  strokeWidth: 1.4,
  strokeLinecap: 'square',
  strokeLinejoin: 'miter',
  color: 'currentColor',
};

const Icon = forwardRef(({ as: LucideIcon, size = 16, ...rest }, ref) => (
  <LucideIcon ref={ref} size={size} {...DS_PROPS} {...rest} />
));

Icon.displayName = 'Icon';
export default Icon;
```

#### Motivation
FR-003 mandates a single configuration point. The wrapper is that point. Changing any DS stroke value in the future requires editing `Icon.jsx` only — all icons inherit the change automatically.

#### Rejected alternatives
- Global CSS SVG selector: would affect illustrations and brand icons, violating FR-005 and FR-006.
- Lucide context provider: does not exist in `lucide-react` as of the current version; would apply unconditionally without the ability to exclude brand icons.
- Per-use prop repetition: violates FR-003 directly.

---

### AD-002 — `as` prop pattern to preserve tree-shaking

#### Description
`Icon` accepts the Lucide component class as the `as` prop, not an icon name string. Call sites import only the icons they need from `lucide-react` and pass them to `Icon`.

Example:
```jsx
import { ChevronDown } from 'lucide-react';
import Icon from '../ui/Icon';
// ...
<Icon as={ChevronDown} size={16} />
```

#### Motivation
Tree-shaking operates on named imports. Passing component references preserves tree-shaking: only imported icons enter the bundle. A string-based registry would require a central map importing all icons, defeating bundle optimization and risking AC-007 failure.

#### Rejected alternatives
- String icon name registry: kills tree-shaking.

---

### AD-003 — `lucide-react` in production dependencies

#### Description
`lucide-react` is added to `dependencies` in `package.json`, not `devDependencies`.

#### Motivation
The library renders icons at runtime in JSX. It is a runtime dependency. Placing it in `devDependencies` would be semantically incorrect and could cause deployment failures depending on the hosting environment.

#### Rejected alternatives
- CDN delivery (`unpkg.com/lucide@latest`): explicitly excluded by PRD section 9.

---

## 5. Task Breakdown

---

# TASK-001 — Install lucide-react dependency

## Objective
Add `lucide-react` to the frontend's production dependencies so it can be imported in all subsequent tasks.

## Required context
- Working directory for npm commands: `MyBikeLab/frontend/`
- `lucide-react` must be installed as a runtime dependency (not devDependency)
- The project uses npm as its package manager (package.json is present; no yarn.lock or pnpm-lock.yaml observed)
- After installation, `package.json` and `package-lock.json` will be modified

## Potentially impacted files
- `MyBikeLab/frontend/package.json`
- `MyBikeLab/frontend/package-lock.json`

## Inputs
- Current `package.json` — no `lucide-react` entry in dependencies or devDependencies

## Expected outputs
- `lucide-react` appears in the `dependencies` section of `package.json`
- `package-lock.json` updated accordingly
- `node_modules/lucide-react` is present and importable

## Constraints
- Use `npm install lucide-react` (not `--save-dev`)
- Do not modify any source file in this task
- Do not modify any other dependency

## Dependencies
none

## Validation criteria
- [ ] `package.json` contains `"lucide-react"` in the `dependencies` object
- [ ] Running `npm run build` from `MyBikeLab/frontend/` succeeds without error
- [ ] `import { ChevronDown } from 'lucide-react'` resolves without error in a test file

## Tests to implement
### Unit
- none
### Integration
- none

---

# TASK-002 — Create the shared Icon wrapper component

## Objective
Create `src/components/ui/Icon.jsx` — the single configuration point for DS icon stroke defaults. This component wraps any Lucide icon component and applies the DS-mandated stroke properties unconditionally.

## Required context
- DS stroke defaults (from PRD FR-002 and design-system README Iconography section):
  - `strokeWidth: 1.4`
  - `strokeLinecap: 'square'`
  - `strokeLinejoin: 'miter'`
  - `color: 'currentColor'`
- The wrapper uses an `as` prop to receive the Lucide icon component (not a string name)
- The `size` prop is optional; default is `16` (matches DS "16px standard" from design-system README)
- All other props passed to `Icon` are forwarded to the Lucide component
- The `ui/` subfolder does not yet exist and must be created alongside the file
- `lucide-react` must already be installed (depends on TASK-001)

## Potentially impacted files
- `MyBikeLab/frontend/src/components/ui/Icon.jsx` (new file)

## Inputs
- None — this task creates a new file from scratch

## Expected outputs
A file at `src/components/ui/Icon.jsx` with the following exact implementation:

```jsx
import { forwardRef } from 'react';

const DS_PROPS = {
  strokeWidth: 1.4,
  strokeLinecap: 'square',
  strokeLinejoin: 'miter',
  color: 'currentColor',
};

const Icon = forwardRef(({ as: LucideIcon, size = 16, ...rest }, ref) => (
  <LucideIcon ref={ref} size={size} {...DS_PROPS} {...rest} />
));

Icon.displayName = 'Icon';
export default Icon;
```

## Constraints
- DS stroke values (`1.4`, `'square'`, `'miter'`, `'currentColor'`) must appear only in this file — not duplicated anywhere else
- No Lucide icon is imported in this file; `LucideIcon` is received as a prop
- `forwardRef` is used to allow ref forwarding if needed by parent components
- Do not add PropTypes validation in this file — the codebase does not use PropTypes

## Dependencies
TASK-001

## Validation criteria
- [ ] File exists at `src/components/ui/Icon.jsx`
- [ ] The file contains exactly one definition of `strokeWidth: 1.4` (codebase search must confirm no other occurrence)
- [ ] The file contains exactly one definition of `strokeLinecap: 'square'` (same check)
- [ ] The file contains exactly one definition of `strokeLinejoin: 'miter'` (same check)
- [ ] Rendering `<Icon as={ChevronDown} size={20} />` produces an SVG with `stroke-width="1.4"`, `stroke-linecap="square"`, `stroke-linejoin="miter"`
- [ ] Rendering `<Icon as={ChevronDown} />` (no size) produces an SVG with `width="16"` and `height="16"`
- [ ] Rendering `<Icon as={ChevronDown} size={20} />` produces an SVG with `width="20"` and `height="20"`

## Tests to implement
### Unit
- none (visual output; no logic to unit test)
### Integration
- none

---

# TASK-003 — Migrate Navbar icons to Icon wrapper

## Objective
Replace the two ad-hoc inline SVG icons in `Navbar.jsx` (hamburger open and X close) with their Lucide equivalents rendered through the shared `Icon` wrapper. Preserve all existing behavior, accessibility attributes, and layout exactly.

## Required context
- File to modify: `MyBikeLab/frontend/src/components/Navbar.jsx`
- Current icons:
  - **Open state (hamburger):** Three horizontal lines — Lucide replacement: `Menu`
  - **Closed state (X/close):** Two diagonal crossing lines — Lucide replacement: `X`
- Both inline SVGs currently have `stroke="currentColor"`, `strokeWidth="2"`, `strokeLinecap="round"`, `strokeLinejoin="round"`, `aria-hidden="true"`, `width="24"`, `height="24"`
- After replacement: `strokeWidth`, `strokeLinecap`, `strokeLinejoin` must come from the `Icon` wrapper (DS defaults); only `size` and `aria-hidden` are passed at the call site
- The button already has `aria-label` — the `aria-hidden="true"` must be preserved on the icon itself
- The `Icon` wrapper component is at `src/components/ui/Icon.jsx` (created in TASK-002)
- Import path from `Navbar.jsx` to `Icon.jsx`: `../ui/Icon` (relative, since Navbar is at `src/components/Navbar.jsx`)
- Import path for Lucide icons: `lucide-react`

## Potentially impacted files
- `MyBikeLab/frontend/src/components/Navbar.jsx`

## Inputs
Current icon JSX in the button toggle:
```jsx
{isOpen ? (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
) : (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)}
```

## Expected outputs
```jsx
import { Menu, X } from 'lucide-react';
import Icon from '../ui/Icon';
// ...
{isOpen ? (
  <Icon as={X} size={24} aria-hidden="true" />
) : (
  <Icon as={Menu} size={24} aria-hidden="true" />
)}
```
- No inline `<svg>` remains in the file
- Existing imports (`useState`) are preserved
- All other JSX in the file is unchanged

## Constraints
- Do not modify any className, aria-label, onClick, or other prop on the parent `<button>`
- Do not alter mobile menu behavior or state logic
- DS stroke props (`strokeWidth`, `strokeLinecap`, `strokeLinejoin`) must NOT be specified at the call site — they come from the wrapper

## Dependencies
TASK-002

## Validation criteria
- [ ] No inline `<svg>` tag remains in `Navbar.jsx`
- [ ] `Menu` and `X` are imported from `lucide-react`
- [ ] `Icon` is imported from `../ui/Icon`
- [ ] Rendered hamburger SVG has `stroke-width="1.4"`, `stroke-linecap="square"`, `stroke-linejoin="miter"` in the DOM
- [ ] Rendered X SVG has `stroke-width="1.4"`, `stroke-linecap="square"`, `stroke-linejoin="miter"` in the DOM
- [ ] The navbar layout (height, icon position, button bounding box) is visually identical before and after the change
- [ ] Clicking the burger button opens the mobile menu; clicking again closes it

## Tests to implement
### Unit
- none
### Integration
- none

---

# TASK-004 — Migrate MiniComparator icons to Icon wrapper

## Objective
Replace the two ad-hoc inline SVG icons in `MiniComparator.jsx` (mobile filter trigger and mobile drawer close) with their Lucide equivalents rendered through the shared `Icon` wrapper.

## Required context
- File to modify: `MyBikeLab/frontend/src/components/MiniComparator/MiniComparator.jsx`
- Current icons:
  - **Filter trigger button:** A filled funnel/filter path (`fill="currentColor"`, `viewBox="0 0 20 20"`, `h-4 w-4`). Lucide replacement: `SlidersHorizontal` (preferred) or `Filter` — implementor must visually confirm the best match before proceeding (see OQ-002 in spec-notes.md).
  - **Drawer close button (X):** A filled X path (`fill="currentColor"`, `viewBox="0 0 20 20"`, `h-5 w-5`). Lucide replacement: `X`
- The `Icon` wrapper is at `src/components/ui/Icon.jsx`
- Import path from `MiniComparator.jsx` to `Icon.jsx`: `../../components/ui/Icon` — wait, `MiniComparator.jsx` is at `src/components/MiniComparator/MiniComparator.jsx`, so the correct relative import is `../ui/Icon`
- The filter trigger button uses `className="h-4 w-4"` on the SVG. After replacement, size is passed as `size={16}` to `Icon` (and the `className` on the SVG is removed — sizing is handled by Lucide's `size` prop, which sets both `width` and `height`)
- The drawer close button uses `className="h-5 w-5"` on the SVG. After replacement: `size={20}`
- Both existing SVGs have `aria-hidden="true"` — preserve on the `Icon` call

## Potentially impacted files
- `MyBikeLab/frontend/src/components/MiniComparator/MiniComparator.jsx`

## Inputs
Filter trigger icon (current):
```jsx
<svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm2 5a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm3 5a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
</svg>
```
Drawer close icon (current):
```jsx
<svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
  <path fillRule="evenodd" d="M4.28 3.22a.75.75 0 00-1.06 1.06L8.94 10l-5.72 5.72a.75.75 0 101.06 1.06L10 11.06l5.72 5.72a.75.75 0 101.06-1.06L11.06 10l5.72-5.72a.75.75 0 00-1.06-1.06L10 8.94 4.28 3.22z" clipRule="evenodd" />
</svg>
```

## Expected outputs
```jsx
import { X, SlidersHorizontal } from 'lucide-react'; // or Filter — confirm per OQ-002
import Icon from '../ui/Icon';
// Filter trigger:
<Icon as={SlidersHorizontal} size={16} aria-hidden="true" />
// Drawer close:
<Icon as={X} size={20} aria-hidden="true" />
```
- No inline `<svg>` remains in the file
- All existing button classNames, aria props, onClick handlers, and state logic are unchanged

## Constraints
- Do not modify any prop on parent `<button>` elements
- Do not alter drawer open/close behavior or backdrop logic
- DS stroke props must NOT be specified at the call site
- Confirm visually that the chosen filter icon matches the original intent before committing (OQ-002)

## Dependencies
TASK-002

## Validation criteria
- [ ] No inline `<svg>` tag remains in `MiniComparator.jsx`
- [ ] Both Lucide icons and `Icon` are imported at the top of the file
- [ ] Filter trigger button renders an icon at 16×16 px with DS stroke defaults in the DOM
- [ ] Drawer close button renders an icon at 20×20 px with DS stroke defaults in the DOM
- [ ] Mobile filter drawer opens when the trigger is clicked
- [ ] Mobile filter drawer closes when the X button is clicked
- [ ] No layout shift in the trigger button or drawer header

## Tests to implement
### Unit
- none
### Integration
- none

---

# TASK-005 — Migrate FilterPanel Section accordion chevron to Icon wrapper

## Objective
Replace the inline SVG chevron used in the `Section` accordion component inside `FilterPanel.jsx` with its Lucide equivalent rendered through the `Icon` wrapper. Preserve the rotate-180 animation class behavior for open/closed state.

## Required context
- File to modify: `MyBikeLab/frontend/src/components/MiniComparator/FilterPanel.jsx`
- The `Section` component (lines 158–187 in the current file) contains one inline SVG — a chevron-down used to indicate accordion open/closed state
- Current SVG: `fill="currentColor"`, `viewBox="0 0 20 20"`, `h-4 w-4`, animated with `className` containing `rotate-180` when open
- Lucide replacement: `ChevronDown`
- The `rotate-180` animation is applied via Tailwind class on the element: `className={\`h-4 w-4 text-ink-6 transition-transform \${open ? 'rotate-180' : ''}\`}`. After replacement, this `className` must be passed to `Icon` so it is forwarded to the rendered SVG element.
- Import path from `FilterPanel.jsx` to `Icon.jsx`: `../../components/ui/Icon` — incorrect. `FilterPanel.jsx` is at `src/components/MiniComparator/FilterPanel.jsx`, so the correct relative path is `../ui/Icon`
- The existing SVG uses `fill="currentColor"` with no `stroke`. After replacement with `Icon`, the Lucide stroke-based chevron is used instead — this is the intended DS behavior (stroke icons, not fill icons)

## Potentially impacted files
- `MyBikeLab/frontend/src/components/MiniComparator/FilterPanel.jsx`

## Inputs
Current Section chevron JSX:
```jsx
<svg
  className={`h-4 w-4 text-ink-6 transition-transform ${
    open ? 'rotate-180' : ''
  }`}
  viewBox="0 0 20 20"
  fill="currentColor"
  aria-hidden="true"
>
  <path
    fillRule="evenodd"
    d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
    clipRule="evenodd"
  />
</svg>
```

## Expected outputs
```jsx
import { ChevronDown } from 'lucide-react';
import Icon from '../ui/Icon';
// ...
<Icon
  as={ChevronDown}
  size={16}
  aria-hidden="true"
  className={`text-ink-6 transition-transform ${open ? 'rotate-180' : ''}`}
/>
```
- No inline `<svg>` remains in `FilterPanel.jsx` for this icon
- The accordion expand/collapse animation (rotate-180) continues to function

## Constraints
- The `h-4 w-4` sizing classes are removed — size is controlled by `size={16}` on the `Icon` wrapper
- `text-ink-6` and transition classes must be preserved and passed via `className`
- DS stroke props must NOT appear at the call site
- All other FilterPanel JSX (range sliders, pills, toggles, selects) is unchanged

## Dependencies
TASK-002

## Validation criteria
- [ ] No inline `<svg>` tag remains in `FilterPanel.jsx`
- [ ] `ChevronDown` is imported from `lucide-react`; `Icon` is imported from `../ui/Icon`
- [ ] The Section chevron renders at 16×16 px with DS stroke defaults in the DOM
- [ ] Clicking a Section header rotates the chevron 180 degrees (accordion open/close visual works)
- [ ] No layout shift in any Section header or filter group

## Tests to implement
### Unit
- none
### Integration
- none

---

# TASK-006 — Migrate ComparisonTable ChevronIcon to Icon wrapper

## Objective
Replace the local `ChevronIcon` component defined inside `ComparisonTable.jsx` with the `Icon` wrapper using the Lucide `ChevronDown` icon. Preserve the rotate-180 expand/collapse animation.

## Required context
- File to modify: `MyBikeLab/frontend/src/components/MiniComparator/ComparisonTable.jsx`
- The file defines a local `ChevronIcon` component at lines 17–26 (current codebase):
  ```jsx
  const ChevronIcon = ({ expanded }) => (
    <svg
      className={`w-4 h-4 transition-transform duration-150 ${expanded ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
  ```
- `ChevronIcon` is used once in the table body: `<ChevronIcon expanded={expandedId === w.id} />`
- After migration, the local `ChevronIcon` component is removed entirely and replaced inline with `<Icon>`
- Import path: `ComparisonTable.jsx` is at `src/components/MiniComparator/ComparisonTable.jsx` — import `Icon` from `../ui/Icon`
- The existing `strokeWidth={2}` is replaced by the DS default of `1.4` from the wrapper

## Potentially impacted files
- `MyBikeLab/frontend/src/components/MiniComparator/ComparisonTable.jsx`

## Inputs
Current `ChevronIcon` component (lines 17–26) and its usage (line 81):
```jsx
const ChevronIcon = ({ expanded }) => (
  <svg
    className={`w-4 h-4 transition-transform duration-150 ${expanded ? 'rotate-180' : ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);
// usage:
<ChevronIcon expanded={expandedId === w.id} />
```

## Expected outputs
- The `ChevronIcon` local component is deleted
- Imports at top of file:
  ```jsx
  import { ChevronDown } from 'lucide-react';
  import Icon from '../ui/Icon';
  ```
- Usage site becomes:
  ```jsx
  <Icon
    as={ChevronDown}
    size={16}
    aria-hidden="true"
    className={`transition-transform duration-150 ${expandedId === w.id ? 'rotate-180' : ''}`}
  />
  ```
- No inline `<svg>` or local SVG component remains in `ComparisonTable.jsx`

## Constraints
- The `w-4 h-4` sizing classes are removed — size is controlled by `size={16}`
- `transition-transform duration-150` and `rotate-180` classes must be preserved via `className`
- DS stroke props must NOT appear at the call site
- All other ComparisonTable JSX (table, thead, tbody, WheelDetailPanel) is unchanged

## Dependencies
TASK-002

## Validation criteria
- [ ] The `ChevronIcon` local component no longer exists in `ComparisonTable.jsx`
- [ ] No inline `<svg>` tag remains in the file
- [ ] `ChevronDown` is imported from `lucide-react`; `Icon` is imported from `../ui/Icon`
- [ ] Clicking a table row expands the detail panel and rotates the chevron 180 degrees
- [ ] Clicking the same row again collapses the panel and resets the chevron
- [ ] No layout shift in any table row or the expand chevron column

## Tests to implement
### Unit
- none
### Integration
- none

---

# TASK-007 — Migrate ColumnSelector icon to Icon wrapper

## Objective
Replace the inline SVG in the `ColumnSelector` button with its Lucide equivalent rendered through the `Icon` wrapper. The existing icon is a two-column layout/grid icon; confirm the Lucide replacement before implementing (see OQ-001 in spec-notes.md).

## Required context
- File to modify: `MyBikeLab/frontend/src/components/MiniComparator/ColumnSelector.jsx`
- Current icon: an inline SVG with `fill="currentColor"`, `viewBox="0 0 20 20"`, `className="h-4 w-4 text-ink-7"`, rendering a two-column layout grid path
- Lucide candidate replacements: `Columns2` (most visually similar — two vertical columns), `LayoutList`, or `TableProperties`. The implementor must visually compare and select the best match before replacing.
- The SVG currently uses `fill="currentColor"` with no stroke. Replacing with a Lucide stroke icon changes the rendering style — this is the intended DS behavior.
- Import path from `ColumnSelector.jsx`: `../ui/Icon`
- The `text-ink-7` color class must be preserved on the `Icon` element — pass it via `className`
- `h-4 w-4` sizing is removed; use `size={16}`

## Potentially impacted files
- `MyBikeLab/frontend/src/components/MiniComparator/ColumnSelector.jsx`

## Inputs
Current icon JSX in the button:
```jsx
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 20 20"
  fill="currentColor"
  className="h-4 w-4 text-ink-7"
  aria-hidden="true"
>
  <path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h11A1.5 1.5 0 0 1 17 4.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 15.5v-11Zm4 0v11h2v-11H7Zm4 0v11h2v-11h-2Z" />
</svg>
```

## Expected outputs
```jsx
import { Columns2 } from 'lucide-react'; // or confirmed alternative
import Icon from '../ui/Icon';
// ...
<Icon as={Columns2} size={16} aria-hidden="true" className="text-ink-7" />
```
- No inline `<svg>` remains in `ColumnSelector.jsx`
- The button text "Columns" and all other button props are unchanged
- The dropdown menu JSX and click-outside logic are unchanged

## Constraints
- Confirm the Lucide icon selection visually before implementation (OQ-001)
- `text-ink-7` must be preserved via `className` on the `Icon` call
- DS stroke props must NOT appear at the call site
- No change to the dropdown menu behavior, checkbox items, or COLUMN_GROUPS logic

## Dependencies
TASK-002

## Validation criteria
- [ ] No inline `<svg>` tag remains in `ColumnSelector.jsx`
- [ ] The chosen Lucide icon and `Icon` are imported at the top of the file
- [ ] The button renders with a 16×16 icon with DS stroke defaults in the DOM
- [ ] The icon color is `text-ink-7` (visually the same muted color as before)
- [ ] Clicking the button opens the column selector dropdown; clicking again or clicking outside closes it
- [ ] No layout shift in the button or the dropdown panel

## Tests to implement
### Unit
- none
### Integration
- none

---

# TASK-008 — Migrate ContactForm success checkmark to Icon wrapper

## Objective
Replace the inline SVG checkmark in `ContactForm.jsx`'s success state with its Lucide equivalent rendered through the `Icon` wrapper.

## Required context
- File to modify: `MyBikeLab/frontend/src/components/ContactForm.jsx`
- The checkmark appears only in the `sent === true` branch (the success state after form submission)
- Current icon: `fill="none"`, `stroke="currentColor"`, `strokeWidth="2"`, `strokeLinecap="round"`, `strokeLinejoin="round"`, `className="h-5 w-5"`, path: `M5 13l4 4L19 7` (checkmark)
- Lucide replacement: `Check`
- Import path from `ContactForm.jsx`: `../ui/Icon`
- The icon is wrapped in a `<div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-brass-3 text-brass-9">` — the icon inherits `text-brass-9` via `currentColor`. This inheritance must continue to work after replacement.
- `h-5 w-5` sizing classes are removed; use `size={20}`

## Potentially impacted files
- `MyBikeLab/frontend/src/components/ContactForm.jsx`

## Inputs
Current success state icon:
```jsx
<div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-brass-3 text-brass-9">
  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
</div>
```

## Expected outputs
```jsx
import { Check } from 'lucide-react';
import Icon from '../ui/Icon';
// ...
<div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-brass-3 text-brass-9">
  <Icon as={Check} size={20} aria-hidden="true" />
</div>
```
- No inline `<svg>` remains in `ContactForm.jsx`
- The parent `<div>` className is unchanged
- The form, inputs, onSubmit, onChange handlers, and all other JSX are unchanged

## Constraints
- DS stroke props must NOT appear at the call site
- The icon must inherit `text-brass-9` from the parent container via `currentColor` — do not hardcode a color
- Do not alter any form behavior or validation logic

## Dependencies
TASK-002

## Validation criteria
- [ ] No inline `<svg>` tag remains in `ContactForm.jsx`
- [ ] `Check` is imported from `lucide-react`; `Icon` is imported from `../ui/Icon`
- [ ] After form submission (simulated by setting `sent = true`), the checkmark icon renders at 20×20 px with DS stroke defaults
- [ ] The checkmark color is visually brass/gold (inheriting `text-brass-9` from the parent container)
- [ ] No layout shift in the success card

## Tests to implement
### Unit
- none
### Integration
- none

---

# TASK-009 — Audit Footer and verify no inline SVG icons remain

## Objective
Confirm that `Footer.jsx` contains no inline SVG UI icons (and therefore requires no migration), and perform a final codebase-wide audit confirming that no ad-hoc inline `<svg>` elements used as UI icons remain anywhere in `src/components/`.

## Required context
- `Footer.jsx` at `src/components/Footer.jsx` — current implementation uses only text navigation links and no SVG icons
- The audit scope is the entire `src/components/` directory (all `.jsx` files)
- Files that are legitimately allowed to contain SVGs after this evolution:
  - `assets/wheel-schematic.svg` — schematic illustration, excluded from this evolution
  - Any file that uses the shared `Icon` wrapper (which renders a Lucide SVG internally — these are acceptable)
  - Any file where SVG is used for a non-UI-icon purpose (e.g., a brand logo with its own stroke style)
- The audit must confirm AC-001 (no ad-hoc inline `<svg>` for UI icons) and AC-004 (DS stroke defaults defined in exactly one place)

## Potentially impacted files
- `MyBikeLab/frontend/src/components/Footer.jsx` — confirmed no change needed
- All files in `src/components/**/*.jsx` — read for audit

## Inputs
- All `.jsx` files in `src/components/` after TASK-003 through TASK-008 are complete

## Expected outputs
- Confirmation that no `<svg` tag with inline path data for a UI icon remains in any file in `src/components/`
- Confirmation that `strokeWidth: 1.4`, `strokeLinecap: 'square'`, `strokeLinejoin: 'miter'` appear only in `src/components/ui/Icon.jsx`
- A brief written note (added as a comment to this task's completion, or logged by the implementor) confirming the audit result

## Constraints
- If any unexpected inline SVG UI icon is found, it must be migrated to the `Icon` wrapper before this task is marked complete
- Do not modify `assets/wheel-schematic.svg` under any circumstances
- Do not modify `Footer.jsx` unless an inline SVG is unexpectedly found there

## Dependencies
TASK-003, TASK-004, TASK-005, TASK-006, TASK-007, TASK-008

## Validation criteria
- [ ] A grep/search for `<svg` in `src/components/` returns no results attributable to UI icons (i.e., returns only internal Lucide SVG from Icon renders, if any)
- [ ] A grep/search for `strokeWidth: 1.4` in `src/` returns exactly one result: `src/components/ui/Icon.jsx`
- [ ] A grep/search for `strokeLinecap: 'square'` in `src/` returns exactly one result: `src/components/ui/Icon.jsx`
- [ ] A grep/search for `strokeLinejoin: 'miter'` in `src/` returns exactly one result: `src/components/ui/Icon.jsx`
- [ ] `assets/wheel-schematic.svg` is byte-for-byte identical to its pre-evolution state

## Tests to implement
### Unit
- none
### Integration
- none

---

# TASK-010 — Verify bundle size delta is below 15 KB

## Objective
Run a production build and confirm that the bundle size increase attributable to `lucide-react` (tree-shaken) is below 15 KB, satisfying AC-007.

## Required context
- Build command: `npm run build` from `MyBikeLab/frontend/`
- A baseline build (pre-evolution, before TASK-001) must have been run and its output recorded. If no baseline exists, one must be constructed by temporarily reverting to the pre-TASK-001 state, running the build, recording total bundle sizes, then re-applying the evolution.
- Vite outputs build stats to the terminal (file sizes for each chunk). Compare the total JS bundle size before and after.
- Only the delta attributable to icons is measured — general bundle growth from other sources is not part of this check
- The icon set used by this evolution: `Menu`, `X`, `SlidersHorizontal` (or `Filter`), `ChevronDown`, `Columns2` (or confirmed alternative), `Check` — approximately 7 distinct Lucide icons. Lucide icons are individually small (~0.5–1.5 KB minified+gzip each); 7 icons should be well within the 15 KB limit.

## Potentially impacted files
- None — this is a read-only verification task

## Inputs
- Baseline bundle size (recorded before TASK-001)
- Post-evolution bundle size (output of `npm run build` after all migration tasks are complete)

## Expected outputs
- Confirmation that the delta is below 15 KB
- If the delta exceeds 15 KB: identify which chunk grew and investigate whether a wildcard import inadvertently imported all Lucide icons

## Constraints
- Use the production build (`npm run build`), not the dev server
- Compare total JS bundle size (all chunks combined) or, if Vite outputs per-chunk sizes, compare the relevant vendor chunk

## Dependencies
TASK-001, TASK-003, TASK-004, TASK-005, TASK-006, TASK-007, TASK-008

## Validation criteria
- [ ] Production build completes without error
- [ ] Total JS bundle size delta (post minus baseline) is below 15 KB
- [ ] No `import * from 'lucide-react'` appears anywhere in `src/`

## Tests to implement
### Unit
- none
### Integration
- none

---

## 6. Global Validation Strategy

### Unit validation
No unit tests are implemented for this evolution. All DS compliance and visual properties require runtime DOM inspection or visual comparison.

### Integration validation
No integration tests are implemented. The test suite (`vitest run`) must continue to pass without regression after all tasks are complete.

### Functional validation
Each affected component (Navbar, MiniComparator, FilterPanel, ComparisonTable, ColumnSelector, ContactForm) is rendered in the browser and verified:
- Icons display with DS stroke defaults: `stroke-width="1.4"`, `stroke-linecap="square"`, `stroke-linejoin="miter"` (inspected via browser DevTools on the rendered SVG element)
- Icons inherit color from surrounding element via `currentColor` (verified by changing parent text-color in DevTools and observing icon color update)
- Interactive behaviors (drawer open/close, accordion expand/collapse, row expand/collapse, column selector dropdown) work identically to pre-evolution

### Functional validation — Footer
`Footer.jsx` is confirmed to have no UI icons; no migration is required.

### Non-regression validation
- Layout of each affected component is visually compared before and after replacement — no element shift is acceptable
- `vitest run` passes with no new failures
- `assets/wheel-schematic.svg` is byte-identical to its pre-evolution state
- DS stroke defaults appear in exactly one file: `src/components/ui/Icon.jsx`

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Lucide icon visual does not match original ad-hoc SVG | Minor visual regression on a specific surface | Visually compare before/after in the browser for each replaced icon; consult OQ-001 and OQ-002 before implementing TASK-004 and TASK-007 |
| `Icon` wrapper's `{...rest}` spread allows accidental DS prop override at call site | DS defaults silently overridden | Document in `Icon.jsx` JSDoc that DS props must not be passed at the call site; enforce in code review |
| Wildcard Lucide import accidentally included | Bundle size exceeds 15 KB threshold (AC-007 failure) | TASK-010 explicitly checks for wildcard imports; build diff is measured |
| `rotate-180` Tailwind class lost during icon migration | Chevron animation regression in FilterPanel and ComparisonTable | Explicitly specified in TASK-005 and TASK-006 expected outputs |
| `currentColor` inheritance broken if a fixed color prop is passed to Icon | Color inheritance regression (AC-003 failure) | DS_PROPS in Icon.jsx sets `color: 'currentColor'`; call sites must not override it |
| No baseline build captured before TASK-001 | AC-007 cannot be verified | OQ-003 in spec-notes.md flags this; implementor must capture baseline before starting |

---

## 8. Rollback Plan

- All changes are isolated to `src/components/` files and `package.json`
- Each task corresponds to one or two files — rollback is a per-file revert
- To roll back the entire evolution: revert `package.json` to remove `lucide-react`, delete `src/components/ui/Icon.jsx`, and revert each modified component file to its pre-evolution state
- Git history provides the per-file baseline for revert; each task should be committed independently to enable surgical rollback
- `assets/wheel-schematic.svg` is never modified and requires no rollback consideration
