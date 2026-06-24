# Spec Notes — EVO-009

## PRD interpretations

### ContactForm has no section heading
The PRD lists `ContactForm` as a component whose section heading must be changed to `.t-h1`. On reading the file, `ContactForm.jsx` contains no heading element serving a section heading role — it is a form card embedded inside `PartnershipSection`. The only heading in `ContactForm` is a confirmation message (`<h3>`) shown after submission, which is not a section heading role. The PRD's intent is fully satisfied by updating the H2 in `PartnershipSection.jsx`, which is the actual section heading for the contact block. `ContactForm.jsx` requires no change.

### "Section heading role" inside `MiniComparator`
The PRD mentions `MiniComparator` as a component with a section heading. Reading the code, the section heading in `MiniComparator.jsx` is the H2 with `className="section-title mt-2"` — it is not inside `ComparisonTable`, `FilterPanel`, or any sub-component. It is the top-level heading of the `MiniComparator` section block. TASK-002 (updating `.section-title`) covers this change without any JSX modification.

### Responsive size ramp removal
The PRD is silent on whether the existing responsive size ramps (`sm:text-4xl`, `sm:text-5xl`, `lg:text-6xl`) should be removed. They cannot coexist with the DS classes without causing cascade conflicts (Tailwind utilities outrank CSS classes from `@layer components` or unscoped CSS at the responsive breakpoints). The decision to remove them is required for correctness and is within the spirit of FR-005 ("DS classes are the exclusive source of display and section heading styles"). This is not a regression — the DS defines authoritative sizes. Documented as AD-003.

### `.t-h1` font-size vs. Tailwind `text-3xl`
The DS token `--text-3xl` resolves to 44 px. Tailwind's built-in `text-3xl` is 1.875 rem (30 px at 16 px base). These are different values. After the change, section headings will render at 44 px (DS value) rather than the current Tailwind responsive ramp. At `sm+`, they previously reached `text-4xl` (2.25 rem ≈ 36 px). The DS value of 44 px is larger across all viewports. This is intentional — the DS size is the specification. Flagged as a risk in tech-specs.md for visual confirmation.

### `.t-display-1` font-size vs. current Hero H1 size
The DS token `--text-6xl` = 128 px. The current H1 has `lg:text-6xl` (Tailwind: 3.75 rem ≈ 60 px). After the change, the Hero H1 will render at 128 px on all viewports (no responsive override). This is a significant size increase from the current treatment. The PRD does not explicitly call this out, but it is a direct consequence of faithfully applying `.t-display-1`. Flagged as a risk in tech-specs.md and flagged here as an open question.

---

## Architecture decision rationale

### Why inline `.t-h1` properties in `.section-title` instead of using `@apply t-h1`
Tailwind's `@apply` directive only works with Tailwind utility classes. `.t-h1` is a plain CSS class defined in an imported stylesheet, not a Tailwind utility. Attempting `@apply t-h1` would produce a build error. The correct approach is to inline the four CSS properties of `.t-h1` directly into the `.section-title` block. This achieves semantic equivalence without build tooling issues.

### Why `font-feature-settings` must be in `@layer base`, not in `design-tokens.css`
`design-tokens.css` already contains `font-feature-settings: 'ss01', 'ss02', 'cv11'` on `body` (lines 226–227 of the DS file). However, `index.css` redefines `body` inside `@layer base` using Tailwind. CSS layers give `@layer base` precedence over unscoped (non-layered) rules from imported files. The DS body rule is therefore effectively overridden and `font-feature-settings` never reaches the computed style. The fix must be in `index.css`. `design-tokens.css` is explicitly marked "DO NOT EDIT" and must not be modified.

### Why `PartnershipSection` is not refactored to use `.section-title`
`.section-title` carries `text-ink-10` (dark ink). The `PartnershipSection` renders on a near-black background (`bg-ink-12`) where `ink-10` would produce very low contrast. The H2 in `PartnershipSection` intentionally has no explicit color class and inherits `text-paper-1` from the parent section. Forcing it through `.section-title` would require either overriding the color (unnecessary complexity) or removing `text-ink-10` from `.section-title` (breaking the other three consumers). Treating it as a direct `.t-h1` application in JSX is simpler and correct.

---

## Tradeoffs

### Inlining `.t-h1` properties vs. keeping a reference to the class
Inlining the four properties of `.t-h1` into `.section-title` means that if `.t-h1` changes in the DS, `.section-title` will not automatically inherit the change. This is a mild coupling tradeoff. The alternative — using `.section-title` as a JSX alias that references `.t-h1` directly — would require all three JSX consumers to add `t-h1` to their class lists, defeating the point of `.section-title` as a shared abstraction. For now, inlining is the correct tradeoff. If the DS update frequency becomes a concern in the future, a build-time CSS composition step (e.g., PostCSS `@extend`) could address it.

### Removing responsive size ramp from section headings
Dropping `sm:text-4xl` means section headings no longer scale down at small viewports. The DS `--text-3xl` (44 px) is already larger than the `sm:text-4xl` Tailwind value (≈ 36 px), so this is not a regression in maximum size. On very small screens, 44 px is large but manageable for a section heading. The PRD explicitly states "no responsive variant is applied to weight or tracking" and out-of-scope includes "no typography sizing changes" — this removal is a necessary consequence of DS adoption, not a new typographic decision.

---

## Open questions

### OQ-001 — Hero H1 size at 128 px: confirm product acceptance
`.t-display-1` sets font-size to `--text-6xl` = 128 px, fixed on all viewports. The current Hero H1 tops out at ≈ 60 px (Tailwind `lg:text-6xl`). This is more than double the current maximum size and there is no responsive downscaling. The PRD is silent on whether this dramatic size increase on small screens is intentional or an oversight. **Confirm with product owner before TASK-003 is implemented.**

If the 128 px size is judged too large for mobile: the PRD would need to be updated with a responsive strategy for display-1 sizes, which is currently out of scope. The simplest resolution may be to apply `.t-display-1` for weight and tracking only (without adopting its font-size) — but this would require a separate class or an override, which conflicts with FR-005.

### OQ-002 — Section heading size jump: confirm acceptance
After TASK-002, section headings switch from Tailwind's `text-3xl` (30 px) / `sm:text-4xl` (36 px) to the DS `--text-3xl` (44 px). This is a visible size increase. Confirm this is the intended DS specification and acceptable on all viewports.
