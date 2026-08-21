---
name: mybikelab-test
description: Run and write MyBikeLab tests. Use when executing lint, Vitest, or Playwright suites, or when deciding where a new test belongs.
---

# MyBikeLab tests

All commands run from `frontend/`. Prerequisites: Node 24, then `npm ci`.

## Commands

| Command | Runs |
| --- | --- |
| `npm run lint` | ESLint over the frontend |
| `npm run test` | Vitest summary |
| `npm run test:full` | Full Vitest output |
| `npm run test:e2e` | Playwright Chromium suite; starts Vite itself on the public `/MyBikeLabLP/` base path |

The e2e suite uses the real static catalog, resets locale, currency and storage for every test, and replaces external catalog images with an inert response.

## Where a test belongs

- **Vitest** — deterministic contracts: pure logic, registry and schema rules, data integrity, selectors, reducers, currency and i18n transformations, deterministic component branches and state transitions.
- **Playwright** — real-browser journeys: layout and responsive breakpoints, scrolling and sticky positioning, keyboard and focus behavior, visible i18n, links and browser APIs.
- **Manual validation** — purely visual qualities with no stable assertion: typography, composition, spacing, contrast across browsers, image quality, perceived motion.

A browser test must protect a concrete user risk; never mirror existing unit assertions into Playwright.

## Writing rules

- Assert observable product contracts — returned values, Redux state, accessible attributes, user-visible text — not Tailwind utility classes or private DOM nesting.
- Prefer role-based locators with an accessible name (`getByRole`); use `data-testid` only for repeated non-semantic structures such as ledger rows.
- Use web-first expectations (`await expect(locator)`); no arbitrary sleeps, no dependence on DOM depth.
- Reset locale, currency, filters, viewport and storage for every browser test.
- Chromium is the only engine in V1; add another browser only after a demonstrated compatibility problem.
