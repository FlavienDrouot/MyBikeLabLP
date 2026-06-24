# Spec Notes — EVO-018

---

## PRD interpretations

### Hero badge element excluded from this evolution

The `<span>` badge in `Hero.jsx` (line 11) currently reads `№ 01 · MVP v0.1 · Road wheels`. It contains both a `№` prefix (banned by FR-002) and `MVP v0.1` (banned by FR-003). However, PRD §8 explicitly excludes the Hero badge element from EVO-018, stating that its structural suppression is handled in EVO-019. TASK-001 therefore instructs the implementation agent not to touch this element. The badge text violations will persist until EVO-019 ships.

### Hero "section eyebrow" not present in Hero.jsx

The PRD lists `Hero.jsx` as having a section eyebrow in §7. Reading the actual source, `Hero.jsx` does not contain a `<p className="t-section-index">` eyebrow element — the badge `<span>` is a distinct structural element excluded from this evolution. TASK-001 therefore covers only the body paragraph em-dash fix. No eyebrow change is needed in `Hero.jsx` because no eyebrow element exists there.

### MiniComparator footer note: partial removal of version string

The footer note (line 103) reads: `MVP v0.1 · Sample dataset · Real prices & partners coming soon`. Only the `MVP v0.1 · ` segment is removed per FR-003. The remainder of the note (`Sample dataset · Real prices & partners coming soon`) is preserved unchanged, per FR-005. The `&amp;` HTML entity is preserved as-is; it is a JSX rendering concern, not copy.

### Sentence case for hyphenated card titles

`Data-Driven` and `Community-Focused` are hyphenated compounds. Sentence case for hyphenated words: only the letter immediately following the opening capitalisation rule applies — the first word of the title. `Data` is the first word (capitalised), `driven` is the second element (lowercase). Result: `Data-driven` and `Community-focused`. This interpretation follows standard sentence-case convention for hyphenated compounds.

### Eyebrow label text casing preserved as-is

The PRD (FR-002) and PRD §8 both state: "Eyebrow label wording beyond removing the `№ 0N ·` prefix is out of scope". The existing eyebrow labels use all-caps (`COMPARATOR`, `ROADMAP`, `BENEFITS`, `PARTNERSHIP`). These are retained exactly as they appear in the source; only the `№ 0N · ` prefix is stripped. No downcasing of eyebrow labels is performed.

---

## Architecture decision rationale

### AD-001 — One task per component

Five components, five independent files, five atomic tasks. There are no cross-component data dependencies for these text changes (all are inline string literals), so splitting by file maximises parallelism and isolates the blast radius of any agent error to a single component.

### AD-002 — Exact before/after strings

An implementation agent reading a task must not need to open the source file to know what to change. Providing verbatim before and after strings makes each task self-contained and makes validation a literal string comparison.

### AD-003 — Hero badge structural suppression deferred to EVO-019

Stated in the PRD. Noted here because an agent reviewing `Hero.jsx` will observe that the badge still violates FR-002 and FR-003 after EVO-018. This is expected and intentional. The note prevents a future agent from treating it as an oversight.

---

## Tradeoffs

### Single "all eyebrows" task vs. per-component tasks

A task that strips the `№ 0N ·` prefix from all five eyebrows at once would be minimal in scope but would require an agent to edit five separate files. If one edit fails or introduces an error, the entire task fails. Per-component tasks isolate failures and allow the passing tasks to be merged independently.

### Prose description vs. exact strings

Describing changes as "convert to sentence case" without specifying the exact resulting strings leaves the agent to apply its own sentence-case algorithm, which may produce edge-case disagreements (hyphenated words, acronyms). Exact strings eliminate that risk for these five cases.

---

## Open questions

### OQ-001 — Hero badge in EVO-019

When EVO-019 suppresses the Hero badge element structurally, will it completely remove the `<span>`, or hide it? If the element is hidden rather than removed, the `MVP v0.1` string will persist in the DOM. EVO-019 specs should confirm that the element is either removed or its text is also cleared.

### OQ-002 — Eyebrow casing convention

All current eyebrow labels use all-caps (`COMPARATOR`, `ROADMAP`, etc.). This is a design choice not documented in `ui-guidelines.md`. If the design system is updated to prefer title-case or sentence-case eyebrows, all five components will need a follow-up pass. No action required for EVO-018.
