# Wave 5 - Background refinement

Wave 5 is a focused continuation of the consolidated direction from PR #42.
It exists as a stacked follow-up PR so the approved Wave 4 baseline stays
reviewable independently.

## Review target

Open `index.html` or use the GitHub Pages preview published by this branch.
The page is a single continuous landing with the comparator embedded.

This wave changes only visual treatment:

- removes the hero grid entirely;
- replaces the off-centre CSS wheel motif with a large centred wheel drawing;
- keeps the wheel atmospheric, low-contrast and unmistakably decorative;
- adds restrained wheel/rim/airflow-inspired background details lower on the
  page so the visual language continues beyond the hero;
- preserves the Light / Cream / Dark theme model;
- preserves the comparator layout, content model and filter interactions from
  the validated direction.

## Comparator constraints

The comparator still uses a left filter rail and right result table. Brand
keeps a dedicated search field plus a fixed-height scrollable list. Filter
families retain visible enable/disable switches.

No comparison feature or data model is added in this wave.

## Files

| File | Role |
|---|---|
| `index.html` | Full-page prototype with embedded comparator and three themes |
| `_system.css` | Theme tokens, wheel hero, background motifs and component styling |
| `INTENT.md` | Visual rationale and implementation boundary |
