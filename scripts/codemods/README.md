# Codemods

Reusable migration scripts for catalog schema changes.

## PROJ-001 other_specs promotion

Run the shared harness from the product root:

```powershell
node scripts/codemods/other-specs-promote.mjs --concept foundation --dry-run
```

The harness scans every `frontend/src/data/wheelsData_*.js` module and reports whether a concept migration would change it.

EVO-048 promotes hub bearing and material fields:

```powershell
node scripts/codemods/other-specs-promote.mjs --concept hub-bearing-material --dry-run
node scripts/codemods/other-specs-promote.mjs --concept hub-bearing-material --write
```

EVO-049 promotes spoke count fields:

```powershell
node scripts/codemods/other-specs-promote.mjs --concept spokes-count --dry-run
node scripts/codemods/other-specs-promote.mjs --concept spokes-count --write
```

EVO-050 promotes spoke detail fields:

```powershell
node scripts/codemods/other-specs-promote.mjs --concept spokes-detail --dry-run
node scripts/codemods/other-specs-promote.mjs --concept spokes-detail --write
```

EVO-051 promotes rim material/construction fields:

```powershell
node scripts/codemods/other-specs-promote.mjs --concept rim-material-construction --dry-run
node scripts/codemods/other-specs-promote.mjs --concept rim-material-construction --write
EVO-052 promotes rim max tire pressure fields:

```powershell
node scripts/codemods/other-specs-promote.mjs --concept rim-max-tire-pressure --dry-run
node scripts/codemods/other-specs-promote.mjs --concept rim-max-tire-pressure --write
```

EVO-053 promotes warranty fields:

```powershell
node scripts/codemods/other-specs-promote.mjs --concept warranty --dry-run
node scripts/codemods/other-specs-promote.mjs --concept warranty --write
```

EVO-055 promotes weight tolerance fields:

```bash
node scripts/codemods/other-specs-promote.mjs --concept weight-tolerance --dry-run
node scripts/codemods/other-specs-promote.mjs --concept weight-tolerance --write
```

Rules for later PROJ-001 child evolutions:

- Add one concept migration at a time.
- Read source synonym keys from `other_specs`.
- Write the promoted value into the canonical sub-object (`rim`, `hub`, `spokes`, etc.).
- Remove consumed source keys from `other_specs`.
- Keep `--dry-run` as the default verification mode before writing.
- Update `workflows/datascraping/wheel-format.json`, `scripts/DatascrapingPrompt.md`, and `workflows/datascraping/README.md` in the same EVO.
