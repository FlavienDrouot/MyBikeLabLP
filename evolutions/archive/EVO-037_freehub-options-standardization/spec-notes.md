# Spec Notes — EVO-037

## PRD interpretations

- **FR-003 already satisfied:** The datascraping workflow (`workflows/datascraping/README.md`) was updated with the canonical table and alias mapping prior to this phase. No task is needed for that acceptance criterion.

- **`'Shimano HG Light'` handling (Mavic):** The PRD says aliases are absorbed into their canonical. In every Mavic array containing `'Shimano HG Light'`, `'Shimano HG'` is already present. Applying the rule naively would produce a duplicate. The correct interpretation is: drop the alias entry without adding another canonical. Documented explicitly in TASK-003.

- **`'SRAM/Shimano Road'` handling (Zipp):** The PRD says to split into `['SRAM XDR', 'Shimano HG']`. In every Zipp array, `'SRAM XDR'` is already present alongside `'SRAM/Shimano Road'`. The correct operation is: replace `'SRAM/Shimano Road'` with `'Shimano HG'` (one value, not two). Documented explicitly in TASK-004.

## Architecture decision rationale

- **AD-001 (one task per file):** The four files are entirely independent — no shared logic, no cross-file references in `freehub_options`. Splitting by file gives the smallest possible diff per task and allows parallel implementation.

- **AD-002 (drop alias when canonical already present):** The alternative — allowing duplicates and filtering them in the component — would add runtime logic to fix a data quality issue. That is the wrong layer. The fix belongs in the data.

## Tradeoffs

- **Script vs. manual edit:** A normalization script (Node.js) could be written and run once. Rejected because the total number of changes is small (~30 lines across 4 files), the files are readable JS, and a manual edit is faster to write and easier to review. A script would also need its own validation.

## Open questions

- None.
