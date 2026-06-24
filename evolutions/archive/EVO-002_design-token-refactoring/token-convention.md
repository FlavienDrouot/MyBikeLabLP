## Change log
- **EVO-003 — Design System Migration** (2026-05-26): Replaced `ink-*` slate scale with 12-step warm-neutral; added `paper-*`, `brass-*`, `sage-*`, `font-mono`, `rounded-xs`; retired `brand-*` in components; updated CSS module hex values.

---

# Token Naming Convention

> **Authoritative reference.** This document is the single source of truth for all design token decisions in MyBikeLab. Any AI agent or developer adding Tailwind classes must consult this file first. No token-related decision should be made by inference from component files alone.

---

## 1. Purpose

This document defines the complete vocabulary of design tokens used across the MyBikeLab frontend. It specifies:

- Every custom token registered in `tailwind.config.js` (name, value, semantic role)
- Which Tailwind built-in class families are authoritative for typography and spacing
- The three accepted layout exceptions that use arbitrary values
- The one accepted CSS module exception that uses raw hex values
- The rules and process for introducing new tokens in future components

Any class that does not appear in this document — and is not one of the accepted exceptions — is a violation of the token convention and must be corrected before merge.

---

## 2. Colors

All custom colors are registered under semantic families defined in `tailwind.config.js` as `theme.extend.colors` and are available as Tailwind utility prefixes (`bg-`, `text-`, `border-`, `ring-`, `fill-`, `stroke-`, etc.).

### 2.1 `brand-*` — Retired

`brand-*` is retained in `tailwind.config.js` to avoid build warnings but must not be used in any component file.

| Token | Utility example | Hex value | Tailwind blue scale |
|---|---|---|---|
| `brand-50` | `bg-brand-50` | `#eff6ff` | blue-50 |
| `brand-100` | `bg-brand-100` | `#dbeafe` | blue-100 |
| `brand-200` | `bg-brand-200` | `#bfdbfe` | blue-200 |
| `brand-500` | `bg-brand-500` | `#3b82f6` | blue-500 |
| `brand-600` | `bg-brand-600` | `#2563eb` | blue-600 |
| `brand-700` | `bg-brand-700` | `#1d4ed8` | blue-700 |
| `brand-900` | `bg-brand-900` | `#0b1d3a` | blue-900 (darkened) |

### 2.2 `ink-*` — Warm-neutral text and borders

`ink` is a 12-step warm-neutral scale. Use for all text, borders, dividers, and non-interactive surfaces.

| Token | Hex | Semantic role |
|---|---|---|
| `ink-1` | `#efede2` | lightest fill |
| `ink-2` | `#e4e2d6` | soft fill |
| `ink-3` | `#d6d4c7` | subtle borders |
| `ink-4` | `#c2c0b3` | divider hairline (default border) |
| `ink-5` | `#a7a69b` | divider hairline strong |
| `ink-6` | `#8a8980` | placeholder / disabled |
| `ink-7` | `#6e6d65` | meta / labels |
| `ink-8` | `#555550` | secondary text |
| `ink-9` | `#3a3a35` | body emphasis |
| `ink-10` | `#2a2a26` | headings |
| `ink-11` | `#1a1a17` | primary text |
| `ink-12` | `#0e0f0c` | near-black; primary type, brand mark |

### 2.3 `paper-*` — Default surfaces

| Token | Hex | Semantic role |
|---|---|---|
| `paper-0` | `#fbfaf6` | lightest; large surfaces, hero |
| `paper-1` | `#f6f4ef` | default page background |
| `paper-2` | `#efebe2` | recessed panels, table headers |
| `paper-3` | `#e6e0d2` | dividers on paper, muted chips |

### 2.4 `brass-*` — Premium accent (use sparingly)

| Token | Hex | Semantic role |
|---|---|---|
| `brass-1` | `#fcf8ef` | lightest tint |
| `brass-2` | `#f8f1e4` | |
| `brass-3` | `#f3ead8` | icon container background |
| `brass-4` | `#ecdec2` | badge border |
| `brass-5` | `#e2cea4` | |
| `brass-6` | `#d6bb87` | |
| `brass-7` | `#c9a86a` | core brass — CTA fill, toggle active |
| `brass-8` | `#a88846` | deep brass — text on paper, focus ring |
| `brass-9` | `#8c6e35` | icon color on brass-3 |
| `brass-10` | `#6b5328` | |
| `brass-11` | `#4a3a1f` | |
| `brass-12` | `#2a2014` | darkest |

### 2.5 `sage-*` — Secondary support

| Token | Hex | Semantic role |
|---|---|---|
| `sage-1` | `#eef0ea` | lightest |
| `sage-2` | `#e2e5dc` | |
| `sage-3` | `#d2d6cb` | |
| `sage-4` | `#bbc1b4` | |
| `sage-5` | `#a0a797` | |
| `sage-6` | `#858d7c` | |
| `sage-7` | `#6b7361` | core sage token |
| `sage-8` | `#525c54` | |
| `sage-9` | `#3e4742` | |
| `sage-10` | `#2d3530` | |
| `sage-11` | `#1f2522` | |
| `sage-12` | `#14181a` | darkest |

### 2.6 Colors outside the vocabulary

Raw hex values (e.g., `bg-[#3b82f6]`) and Tailwind's built-in color names (e.g., `bg-blue-500`, `bg-slate-700`) are **not permitted** in component files. The sole exception is documented in section 6.

---

## 3. Typography

No custom `fontSize`, `fontWeight`, `lineHeight`, or `letterSpacing` tokens exist in `tailwind.config.js`. Tailwind's built-in named classes are authoritative. Components must use only the classes listed below.

### 3.1 Font family

| Token | Class | Resolved value |
|---|---|---|
| Custom `sans` | `font-sans` | Inter, system-ui, sans-serif |
| Custom mono | `font-mono` | JetBrains Mono, IBM Plex Mono, SF Mono, Menlo, Consolas, monospace |

`Inter` is loaded via the project's font stack. `font-sans` is the default authorized font family class.

Numeric data in `ComparisonTable` and key metric values in `Hero` use `font-mono tabular-nums`.

### 3.2 Font size — authorized classes

| Class | Approximate size |
|---|---|
| `text-xs` | 0.75rem / 12px |
| `text-sm` | 0.875rem / 14px |
| `text-base` | 1rem / 16px |
| `text-lg` | 1.125rem / 18px |
| `text-xl` | 1.25rem / 20px |
| `text-2xl` | 1.5rem / 24px |
| `text-4xl` | 2.25rem / 36px |
| `text-6xl` | 3.75rem / 60px |

No arbitrary font size values (e.g., `text-[17px]`) are permitted.

### 3.3 Font weight — authorized classes

| Class | CSS value |
|---|---|
| `font-medium` | 500 |
| `font-semibold` | 600 |
| `font-bold` | 700 |

### 3.4 Letter spacing — authorized classes

| Class | CSS value |
|---|---|
| `tracking-tight` | -0.025em |
| `tracking-wide` | 0.025em |
| `tracking-wider` | 0.05em |

---

## 4. Spacing

No custom spacing tokens exist in `tailwind.config.js`. Tailwind's **default spacing scale** is authoritative. Components must use only named spacing classes from that scale — no arbitrary spacing values (e.g., `p-[18px]`, `gap-[7px]`) are permitted.

### 4.1 Commonly used spacing classes

The following classes appear across the codebase and are the expected vocabulary for padding, margin, and gap:

| Category | Authorized classes |
|---|---|
| Padding (all sides) | `p-2`, `p-3`, `p-4`, `p-6`, `p-8` |
| Padding (horizontal) | `px-4`, `px-6` |
| Padding (vertical) | `py-2`, `py-3` |
| Gap (flex/grid) | `gap-2`, `gap-3`, `gap-4`, `gap-6` |
| Horizontal spacing | `space-x-2` |

This list reflects current usage. Any spacing step from Tailwind's default scale (multiples of 0.25rem, i.e., `p-1`, `p-5`, `p-10`, etc.) may be used without requiring a new token — as long as it exists in the default scale.

---

## 5. Layout arbitrary values — accepted exceptions

The following three arbitrary values are accepted because they cannot be expressed as a fixed token. They are out of scope for the token convention and must not be flagged by compliance audits.

| File | Arbitrary value | Reason it cannot be tokenized |
|---|---|---|
| `src/components/MiniComparator.jsx` (line 38) | `lg:grid-cols-[320px_1fr]` | `gridTemplateColumns` with a mixed `px + fr` unit is explicitly excluded from the PRD; no Tailwind token can express a mixed fixed/fractional template. |
| `src/components/MiniComparator.jsx` (line 71) | `max-w-[85vw]` | Viewport-relative unit (`vw`). Tailwind's `max-w` scale uses fixed rem values; a viewport percentage cannot be expressed as a static token. |
| `src/components/ColumnSelector.jsx` (line 46) | `max-w-[calc(100vw-1rem)]` | CSS `calc()` expression combining viewport and rem units. Cannot be reduced to a fixed token. |

These three entries are permanently excluded from audit findings. Do not add similar viewport-relative or `calc()` arbitrary values without a documented exception in this section.

---

## 6. CSS module exception — `FilterPanel.module.css`

`FilterPanel.module.css` is the **one accepted file** where raw hex values may appear in the codebase. This exception exists for a structural reason: Tailwind utility classes cannot target CSS pseudo-elements such as `::-webkit-slider-thumb` and `::-moz-range-thumb`. Only plain CSS rules inside a `.module.css` file can reach these selectors.

Each raw hex value in `FilterPanel.module.css` is annotated with a comment identifying its token equivalent, so future maintainers can keep values in sync if the token palette changes.

### Declarations and their token equivalents

| CSS declaration location | Raw hex value | Token equivalent |
|---|---|---|
| `.track` background | `#c2c0b3` | `ink-4` |
| `.range` background | `#a88846` | `brass-8` |
| `::-webkit-slider-thumb` background | `#a88846` | `brass-8` |
| `::-webkit-slider-thumb` border | `#fbfaf6` | `paper-0` |
| `::-moz-range-thumb` background | `#a88846` | `brass-8` |

**Rule:** If any token palette changes, `FilterPanel.module.css` must be updated manually to keep these raw values synchronized with the token definitions in `tailwind.config.js`.

No other file is permitted to contain raw hex values. Any new pseudo-element styling need must be documented here as an additional exception before implementation.

---

## 7. Rules for new components

### 7.1 Prohibited practices

The following are **never permitted** in any component file:

- Arbitrary color values: `bg-[#...]`, `text-[#...]`, `border-[#...]`, etc.
- Arbitrary font sizes: `text-[14px]`, `text-[1.1rem]`, etc.
- Arbitrary font weights or tracking: `font-[550]`, `tracking-[0.03em]`, etc.
- Arbitrary spacing: `p-[18px]`, `gap-[7px]`, `m-[3rem]`, etc.
- Tailwind built-in color names in component files: `bg-blue-500`, `bg-slate-700`, etc.
- Raw hex values in JSX or TSX files.
- `brand-*` tokens in component files (retired family — kept only in `tailwind.config.js` to avoid build warnings).

Violations must be corrected before merge, with the sole exceptions listed in sections 5 and 6.

### 7.2 Process when a token is missing

If a new component requires a value that is not covered by the current token vocabulary:

1. **Do not use an arbitrary value.** Using `bg-[#...]` or `p-[18px]` is not a valid workaround.
2. **Open a new evolution** (e.g., `EVO-004_...`) or add a sub-task to the current evolution.
3. **Add the new token** to `tailwind.config.js` under the appropriate family (`ink`, `paper`, `brass`, `sage`, or a new semantic family if warranted).
4. **Update this document** (`token-convention.md`) with the new token's name, hex value, scale position, and semantic usage.
5. Only then use the token in the component.

### 7.3 This document is authoritative

This file supersedes any other source of token information (component files, README files, inline comments). If there is a conflict between this document and a component file, the component file must be corrected to match this document.

---

## 8. Compliance audit commands

Run the following PowerShell commands from the `frontend/` directory to detect unauthorized arbitrary values:

```powershell
# AC-001: arbitrary colors
Select-String -Path "src/**/*.jsx","src/**/*.tsx","src/**/*.css" -Pattern "(bg|text|border|fill|stroke|ring)-\[" -Recurse

# AC-002: arbitrary typography
Select-String -Path "src/**/*.jsx","src/**/*.tsx","src/**/*.css" -Pattern "(text|leading|tracking|font)-\[" -Recurse

# AC-003: arbitrary spacing
Select-String -Path "src/**/*.jsx","src/**/*.tsx","src/**/*.css" -Pattern "(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|space-x|space-y)-\[" -Recurse

# AC-004: legacy brand- classes in components (zero matches expected)
Select-String -Path "src/**/*.jsx","src/**/*.tsx","src/**/*.css" -Pattern "brand-" -Recurse

# AC-005: bg-white in components (zero matches expected)
Select-String -Path "src/**/*.jsx","src/**/*.tsx","src/**/*.css" -Pattern "bg-white" -Recurse
```

**Interpreting results:**

- Any match in `FilterPanel.module.css` for AC-001 through AC-003 — cross-reference section 6. If the value matches a listed declaration, it is an accepted exception. `FilterPanel.module.css` is the sole file permitted to have raw hex values.
- Any match in `MiniComparator.jsx` or `ColumnSelector.jsx` for the values listed in section 5 — accepted exceptions.
- For AC-004 (`brand-`): `tailwind.config.js` is excluded from the search scope (it retains `brand-*` intentionally to avoid build warnings). Any match in a component file is a violation.
- All other matches are violations and must be resolved by replacing the arbitrary value with the appropriate token from sections 2, 3, or 4.
