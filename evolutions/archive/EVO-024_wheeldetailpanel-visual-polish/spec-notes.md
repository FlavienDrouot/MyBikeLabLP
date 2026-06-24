# Spec Notes — EVO-024

## PRD interpretations

### Outer container vertical alignment
The PRD and needs-assessment are silent on whether the outer container uses `items-center` or `items-start`. The current code uses `items-center`. With a 220 px carousel (which has its own internal vertical layout) and a variable-height links column, `items-center` risks odd vertical gaps. Decision: switch to `items-start` so both zones align to the top. This is recorded in TASK-004.

### Arrow button disabled state vs. hidden state
The PRD (UC-001, step 2) says "The prev arrow is not active (or absent) on the first slide". "Not active" was interpreted as **disabled with visual dimming** rather than hidden, because hiding an interactive element removes its affordance and can cause layout shifts. The UI guidelines rule "disabled: `opacity: 0.4` + `cursor: not-allowed` — never `display: none`" reinforces this interpretation. Implemented in TASK-003.

### Dot active state differentiation
The PRD requires the active dot to be "visually highlighted (distinct from inactive dots)" but does not specify the exact visual treatment. A pill-expansion pattern (active dot widens from 6 px to 18 px) was specified in TASK-003 as a concrete suggestion; the implementing agent may use a simpler opacity or size difference as long as the active state is clearly perceptible.

### `model` and `image` destructuring in `WheelDetailPanel`
After replacing the static `<img>` with `<WheelImageCarousel wheel={wheel} />`, neither `image` nor `model` are directly used in `WheelDetailPanel`. TASK-004 specifies removing them, but includes a "verify first" guard to prevent accidental breakage if those variables are referenced elsewhere in the component (e.g. future additions). Safe removal is the intended outcome.

### `items-center` vs `items-start` for the links wrapper
The links wrapper previously had no explicit vertical alignment. With the carousel potentially being taller than the links content, `items-start` on the flex container is the correct choice to prevent the links from floating mid-panel.

---

## Architecture decision rationale

### AD-001 — Sibling file vs. inline sub-component
The carousel could have been a `const WheelImageCarousel = ...` function declared inside `WheelDetailPanel.jsx`. This was rejected because React re-creates inner component definitions on every parent render, which causes unnecessary unmount/remount cycles and loses state. A sibling file avoids this entirely and makes the component independently inspectable.

A separate sub-folder (`Carousel/`) was considered and rejected as over-engineered: there is only one new file, no barrel export, and the co-location with `WheelDetailPanel` makes the relationship obvious.

### AD-003 — Inline style for geometry
Tailwind arbitrary values like `w-[220px]` and `translate-x-[70px]` are static. The translateX value is not static — it is `-(activeIndex * 230 - 70)`. Expressing a computed value in a Tailwind class requires either `style={{ ... }}` or a CSS custom property, both of which defeat the point of Tailwind classes. The decision was to use inline style for all the carousel geometry values so the formula remains readable in one place.

### AD-004 — Local state, not Redux
The carousel index is local, transient, and panel-specific. It resets correctly when the user closes a detail panel and opens another (since `WheelDetailPanel` unmounts and remounts). Redux is appropriate for state that must survive component unmounts or be shared across unrelated components — neither applies here.

---

## Tradeoffs

### Task decomposition — 4 tasks vs. 2 tasks
An alternative breakdown would have been: TASK-A (entire carousel), TASK-B (wire into panel). This was rejected because a single carousel task would be ~150 lines and hard to validate incrementally. The chosen decomposition (static skeleton → animation → controls → wiring) allows each task to be verified with a specific, bounded set of acceptance criteria.

### prefers-reduced-motion implementation
Two options were considered:
1. A React `useState` that reads `window.matchMedia` on mount (can respond to runtime changes via `addEventListener`).
2. A one-time read at the top of the component with a plain variable (simpler, does not respond to runtime toggle).

Option 2 was chosen. Responding to a runtime `prefers-reduced-motion` change is not a realistic use case during a normal browsing session. The simpler implementation reduces surface area.

---

## Open questions

None. The PRD was produced from a validated prototype session and the needs-assessment explicitly states "No open questions — spec fully validated during the prototype session."
