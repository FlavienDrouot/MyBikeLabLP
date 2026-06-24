# TASK-001 — Create shared LogoMark inline SVG component

## Objective

Create a new `LogoMark.jsx` file at `frontend/src/components/ui/LogoMark.jsx` containing a React JSX component that renders the MyBikeLab brand mark as an inline SVG. The component must use `currentColor` for all stroke values so it inherits the surrounding text color from its container. This component will be imported by both `Navbar.jsx` and `Footer.jsx` in subsequent tasks.

## Required context

The ui_kit reference component is at `design-system/ui_kits/landing/Navbar.jsx` (lines 4-15). It defines the `LogoMark` JSX function with the following SVG structure:

```jsx
function LogoMark({ size = 28 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true">
      <rect x="0.5" y="0.5" width="31" height="31" stroke="currentColor" strokeWidth="1" />
      <line x1="16" y1="0" x2="16" y2="3" stroke="currentColor" strokeWidth="1" />
      <line x1="16" y1="29" x2="16" y2="32" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="16" x2="3" y2="16" stroke="currentColor" strokeWidth="1" />
      <line x1="29" y1="16" x2="32" y2="16" stroke="currentColor" strokeWidth="1" />
      <path d="M 7 23 L 7 9 L 16 17.5 L 25 9 L 25 23" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
    </svg>
  );
}
```

This SVG must be reproduced exactly as a named ES module export in production code. The `aria-hidden="true"` attribute is required because the mark is decorative — the surrounding link or container provides the accessible label.

Design system iconography rules (from `design-system/README.md`): icons use `stroke: currentColor`, `stroke-width: 1.4` for standard Lucide icons. The LogoMark has its own prescribed stroke widths (1.0 and 1.6) from the ui_kit — keep those exact values, do not normalize to 1.4.

## Potentially impacted files

- `frontend/src/components/ui/LogoMark.jsx` (new file)

## Inputs

- `design-system/ui_kits/landing/Navbar.jsx` — SVG source (lines 4-15)
- `frontend/src/components/ui/` — confirm the directory exists and follow its file naming convention

## Expected outputs

A new file `frontend/src/components/ui/LogoMark.jsx` that:
- Exports a default React component named `LogoMark`
- Accepts a single prop `size` (number, default `28`)
- Renders the SVG exactly as defined in the ui_kit reference, using `currentColor` for all strokes
- Has `aria-hidden="true"` on the `<svg>` element
- Has no hardcoded hex color values anywhere in the file

## Constraints

**Design system rules (applicable to this task):**
- All icon strokes must use `currentColor` — never hardcode hex
- No raw hex values (`#[0-9a-fA-F]{3,6}`) anywhere in the file
- No `#ffffff`, `#000000`, or any `brand-*` reference

**Code style:**
- Use standard ES module syntax: `export default function LogoMark({ size = 28 }) { ... }`
- No PropTypes import required — the prop type is inferred
- Do not add CSS classes or inline styles to the `<svg>` — callers control color via `currentColor` and size via the `size` prop

## Dependencies

none

## Validation criteria

- [ ] File exists at `frontend/src/components/ui/LogoMark.jsx`
- [ ] `export default` function named `LogoMark` with `size` prop defaulting to `28`
- [ ] SVG renders the exact same mark as the ui_kit reference (outer square, four crosshair ticks, the M-path)
- [ ] All stroke attributes use `currentColor` — static grep confirms zero hex values in the file
- [ ] `aria-hidden="true"` is present on the `<svg>` element
- [ ] `import LogoMark from '../ui/LogoMark'` works from `Navbar.jsx` and `Footer.jsx` without build errors

## Tests to implement

### Unit

No new test file is required for this task. The LogoMark is a pure presentational component with no state or side effects. Its rendering will be covered indirectly by the updated Navbar and Footer tests in TASK-004.

### Integration

- Run `npm run build` — no build error on the new file
- Confirm the component renders in a browser (can be verified as part of TASK-002 or TASK-003 manual testing)
