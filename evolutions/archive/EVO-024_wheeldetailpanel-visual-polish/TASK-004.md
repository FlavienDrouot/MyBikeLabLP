# TASK-004 — Wire carousel into `WheelDetailPanel` and constrain the affiliate links column

## Objective

Modify `WheelDetailPanel.jsx` to:
1. Replace the static `<img>` with the `<WheelImageCarousel>` component.
2. Remove the `max-h-[140px]` cap on the affiliate links column.
3. Constrain the affiliate links column to a maximum width of 450 px, horizontally centred in the space to the right of the carousel.

This is the only task that modifies `WheelDetailPanel.jsx`.

## Required context

### Current file: `WheelDetailPanel.jsx`

Full current source (read before editing):

```jsx
import { useTranslation } from 'react-i18next';

const WheelDetailPanel = ({ wheel }) => {
  const { t } = useTranslation();
  const { affiliateLinks, image, brand, model } = wheel;
  const manufacturer = affiliateLinks?.manufacturer;
  const retailers = affiliateLinks?.retailers ?? [];
  const hasManufacturer = !!manufacturer;
  const hasRetailers = retailers.length > 0;
  const hasNoLinks = !hasManufacturer && !hasRetailers;

  const sortedRetailers = [...retailers].sort((a, b) => a.price_eur - b.price_eur);

  return (
    <div className="flex items-center gap-5 px-5 py-3 bg-paper-2/60 border-t border-t-ink-3 border-b border-b-ink-4">
      <img
        src={image}
        alt={model}
        className="w-[140px] h-[140px] flex-shrink-0 object-contain rounded-xs"
      />

      <div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-[140px] py-0.5">
        {/* ... affiliate links content ... */}
      </div>
    </div>
  );
};

export default WheelDetailPanel;
```

### What changes

#### 1. Import `WheelImageCarousel`
Add at the top of the file:
```js
import WheelImageCarousel from './WheelImageCarousel';
```

#### 2. Replace the static `<img>` block
Remove:
```jsx
<img
  src={image}
  alt={model}
  className="w-[140px] h-[140px] flex-shrink-0 object-contain rounded-xs"
/>
```
Replace with:
```jsx
<WheelImageCarousel wheel={wheel} />
```

The `wheel` prop passed to `WheelDetailPanel` is passed through directly. `WheelImageCarousel` reads `wheel.image`, `wheel.images`, `wheel.brand`, and `wheel.model` internally.

#### 3. Update the destructuring at the top of the component
The variables `image` and `model` are no longer used directly in `WheelDetailPanel` after removing the `<img>` tag. Remove them from the destructuring if they are not referenced elsewhere in the component. Keep `affiliateLinks`, `brand`, and the derived variables.

Revised destructuring:
```js
const { affiliateLinks, brand } = wheel;
```

Verify that `model` and `image` are not referenced anywhere else in `WheelDetailPanel.jsx` before removing them from the destructuring.

#### 4. Update the affiliate links column div

Current:
```jsx
<div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-[140px] py-0.5">
```

Updated:
```jsx
<div className="flex-1 flex items-start justify-center">
  <div className="w-full max-w-[450px] flex flex-col gap-2 overflow-y-auto py-0.5">
```

Close the extra wrapper `</div>` after the existing closing `</div>` of the affiliate links content.

Explanation:
- The outer `flex-1` wrapper becomes a flex container that centres its child (`items-start justify-center` — `items-start` keeps vertical alignment at the top, `justify-center` centres horizontally).
- The inner `max-w-[450px]` wrapper constrains the column width and lets it grow to fill available space up to 450 px.
- `max-h-[140px]` is removed — the panel height is no longer capped at 140 px. The carousel's 220 px slides are now the natural height driver.

#### 5. Outer container alignment
The outermost `<div>` currently uses `items-center`. Change to `items-start` so the carousel and the links column align to the top rather than the vertical centre (the carousel has its own internal vertical centering via the slide dimensions; `items-center` may cause odd alignment with the taller carousel):
```jsx
<div className="flex items-start gap-5 px-5 py-3 bg-paper-2/60 border-t border-t-ink-3 border-b border-b-ink-4">
```

### UI guidelines applicable to this task

- The panel layout change is structural, not animated. No animation rules apply to this task.
- The affiliate links content (URLs, prices, "Buy →" label, markup) must not be changed — this task only restructures the wrapper divs.
- Use Tailwind utility classes for max-width, flex, alignment — do not use inline style for this task's layout changes.

## Potentially impacted files

- `src/components/MiniComparator/WheelDetailPanel.jsx` — **modified** by this task (the only existing file modified by EVO-024).

## Inputs

- `WheelDetailPanel.jsx` — current source (reproduced above).
- `WheelImageCarousel.jsx` — must already exist (produced by TASK-001; full functionality from TASK-003 is not required for this task to work, but TASK-001 must be complete).

## Expected outputs

An updated `WheelDetailPanel.jsx` where:
1. `WheelImageCarousel` is imported from `'./WheelImageCarousel'`.
2. The static `<img>` is replaced by `<WheelImageCarousel wheel={wheel} />`.
3. The `image` and `model` variables are removed from the destructuring (if not used elsewhere — verify first).
4. The affiliate links column is wrapped in a `max-w-[450px]` inner div, centred horizontally by its parent.
5. The `max-h-[140px]` class is removed from the column.
6. The outer container uses `items-start` instead of `items-center`.
7. All affiliate links content (markup, translation keys, href values) is unchanged.

## Constraints

- Do not modify the affiliate links content or behaviour.
- Do not add any new logic or state to `WheelDetailPanel.jsx`.
- Do not modify any file other than `WheelDetailPanel.jsx`.
- `WheelImageCarousel.jsx` must exist before this task can be validated end-to-end (depends on TASK-001 at minimum).

## Dependencies

TASK-001

## Validation criteria

- [ ] The `<img>` element is no longer present in `WheelDetailPanel.jsx`.
- [ ] `<WheelImageCarousel wheel={wheel} />` is rendered in its place.
- [ ] `import WheelImageCarousel from './WheelImageCarousel'` is present at the top of the file.
- [ ] The affiliate links column container has `max-width: 450px` (inspect computed style).
- [ ] The affiliate links column is horizontally centred within the space to the right of the carousel.
- [ ] The `max-h-[140px]` class is absent from the column.
- [ ] All affiliate links still render: manufacturer section, retailer list sorted by price, "Buy →" links, price annotations.
- [ ] All affiliate link hrefs are unchanged (open the same URLs as before the evolution).
- [ ] No console errors when the panel renders with a single-image wheel.
- [ ] No console errors when the panel renders with a multi-image wheel (if test data is available).

## Tests to implement

### Unit
- None required.

### Integration
- None required.
