# Spec Notes — EVO-002 Design Token Centralization

## PRD interpretations

### INT-001 — "Named token defined in tailwind.config.js" includes Tailwind's built-in default classes

The PRD states that all typography and spacing values "must reference a named token defined in `tailwind.config.js`". This was interpreted as: built-in Tailwind named classes (`text-sm`, `font-semibold`, `p-4`, etc.) are compliant — they are named tokens, simply defined by Tailwind's default theme rather than in our config file. The prohibition targets only arbitrary values (bracket syntax `[...]`). Rationale: adding custom tokens to replace every built-in class would require modifying all component files, which is explicitly excluded by FR-005 ("no functional modifications") and AC-005 ("only Tailwind class strings referencing design values may change"). No such replacements were needed since no arbitrary typography or spacing values exist.

### INT-002 — FilterPanel.module.css falls outside the Tailwind arbitrary value scope

The file uses plain CSS hex values (not Tailwind class strings) to style pseudo-elements. The PRD's FR-001 prohibits "arbitrary color notation" in "Tailwind utility classes". Raw CSS properties in a CSS module file are not Tailwind utility classes. AC-001's verification method (grep for `bg-[`, `text-[`, etc.) would not match CSS property declarations. Decision: accept the `.module.css` hex values as a permanent exception, document them with token-correspondence comments.

### INT-003 — "w-[" and "h-[" arbitrary values for layout are distinct from spacing-scale values

AC-003 qualifies: "when used for spacing-scale values". `max-w-[85vw]` and `max-w-[calc(100vw-1rem)]` use viewport-relative and calc expressions, which are not spacing-scale values. They are accepted as layout constraints. `lg:grid-cols-[320px_1fr]` involves `gridTemplateColumns`, explicitly out of scope per the PRD.

---

## Architecture decision rationale

### AD-001 rationale — Why not define a full custom typography scale

The temptation was to define `fontSize`, `fontWeight`, and `lineHeight` tokens in `tailwind.config.js` (e.g., `font-size-sm: '0.875rem'`) to ensure all typography values are "ours". Rejected because:
1. The PRD's ACs only test for absence of `[...]` syntax — not for the presence of custom definitions.
2. Tailwind's default named scale already satisfies the "no arbitrary values" requirement.
3. Implementation would require renaming every `text-sm`, `text-base`, etc. across all components — a large diff with no compliance benefit and high risk of introducing visual regressions.

### AD-004 rationale — Why a standalone document rather than only tailwind.config.js comments

A JavaScript config file is not the natural place for developer-facing convention documentation. A developer or AI agent following a link or searching for "token convention" should find a readable Markdown document. The config file receives a pointer comment to avoid requiring developers to know where to look.

---

## Tradeoffs

### Tradeoff — Minimal scope vs. proactive cleanup

EVO-002 could have been scoped to also:
- Extract the `FilterPanel.module.css` hex values into CSS custom properties driven by the Tailwind config
- Add `gridTemplateColumns` tokens for the sidebar width
- Define a custom spacing scale to replace Tailwind's defaults

All three were rejected as out of scope per the PRD. The minimal approach (add 3 tokens + write convention) keeps the diff small and the risk low while achieving the PRD's stated objectives.

### Tradeoff — Convention document location

Alternative: embed the convention as a comment block in `tailwind.config.js`. Rejected because: harder to maintain, not searchable as a document, would make the config file unwieldy. The document-first approach is more durable.

---

## Open questions

### OQ-001 — CSS custom properties for module.css (future consideration)

If future evolutions add more CSS module files with pseudo-element styling, the hardcoded hex approach will multiply. A future evolution could introduce CSS custom properties (e.g., `--color-brand-600: #2563eb`) populated from a shared source of truth, eliminating the manual token-comment approach. Not in scope for EVO-002.

### OQ-002 — Enforcement mechanism (deferred from EVO-001 Needs Assessment)

The Needs Assessment noted linting/CI enforcement as an open question. No Stylelint or ESLint rule enforces the absence of arbitrary Tailwind values at this time. TASK-003 provides a manual audit command. Automating this (e.g., as a pre-commit hook or CI step) is a candidate for a future evolution.

### OQ-003 — brand-900 consistency

`brand-900` is defined as `#0b1d3a`, which differs from Tailwind's `blue-900` (`#1e3a5f`). This appears to be an intentional custom value (darker, more dramatic background for the Partnership section). It should be noted in the token convention document to avoid future "correction" that would alter the design.
