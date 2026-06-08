# Codemods

Reusable migration scripts for catalog schema changes.

## PROJ-001 other_specs promotion

Run the shared harness from the product root:

```powershell
node scripts/codemods/other-specs-promote.mjs --concept foundation --dry-run
```

The harness scans every `frontend/src/data/wheelsData_*.js` module and reports whether a concept migration would change it.

Rules for later PROJ-001 child evolutions:

- Add one concept migration at a time.
- Read source synonym keys from `other_specs`.
- Write the promoted value into the canonical sub-object (`rim`, `hub`, `spokes`, etc.).
- Remove consumed source keys from `other_specs`.
- Keep `--dry-run` as the default verification mode before writing.
- Update `workflows/datascraping/wheel-format.json`, `scripts/DatascrapingPrompt.md`, and `workflows/datascraping/README.md` in the same EVO.
