# TASK-002 — Add opacity-40 entry to tailwind.config.js extend.opacity

## Objective

Add the `opacity-40` utility class to the Tailwind configuration by inserting `'40': '0.4'` into the `theme.extend.opacity` object. This makes `opacity-40` available for use in JSX class names and ensures it appears in the JIT-compiled CSS output.

## Required context

- The project uses Tailwind CSS with a JIT compiler, configured in `MyBikeLab/frontend/tailwind.config.js`.
- The config file uses ESM export syntax (`export default { ... }`).
- The current `theme.extend.opacity` object contains one entry: `'88': '0.88'`. The new entry `'40': '0.4'` must be added alongside it without removing or altering the existing entry.
- `opacity-40` is needed by TASK-003 (`FilterPanel.jsx`) to replace `opacity-50` on disabled filter containers.
- The full current `extend.opacity` block (lines 68–70):
  ```js
  opacity: {
    '88': '0.88',
  },
  ```

## Potentially impacted files

- `MyBikeLab/frontend/tailwind.config.js`

## Inputs

Current `extend.opacity` block:
```js
opacity: {
  '88': '0.88',
},
```

## Expected outputs

Updated `extend.opacity` block:
```js
opacity: {
  '88': '0.88',
  '40': '0.4',
},
```

The rest of `tailwind.config.js` is unchanged.

## Constraints

- Only the `extend.opacity` object is modified. No other section of the config is touched.
- The existing `'88': '0.88'` entry must not be removed or altered.
- The key must be the string `'40'` and the value must be the string `'0.4'` (not a number).
- After the change, running `npm run build` (or the project's equivalent Tailwind build command) must produce no warnings or errors.

## Dependencies

none

## Validation criteria

- [ ] The `extend.opacity` object in `tailwind.config.js` contains both `'88': '0.88'` and `'40': '0.4'`.
- [ ] No other entry in the config file has been modified or removed.
- [ ] The Tailwind build completes without warnings or errors.
- [ ] The class `opacity-40` appears in the generated CSS output (confirm via build artifact or DevTools).

## Tests to implement

### Unit
- None required (config-only change, no logic).

### Integration
- Run the Tailwind build (`npm run build` or `npx tailwindcss -i src/index.css -o dist/output.css`) and confirm exit code 0 with no warnings.
- Optionally: search the compiled CSS for `opacity: 0.4` to confirm the utility is generated.
