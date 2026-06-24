# TASK-003 — Add inline submit-time validation to ContactForm and fix success icon container radius

## Objective

In `ContactForm.jsx`:
1. Add an `errors` state variable that tracks per-field error messages for the three required fields (`name`, `email`, `message`).
2. On form submit, validate each required field (trimmed). If empty, block submission and display an error message below that field. If all fields are filled, proceed with the existing `mailto:` flow.
3. Remove the HTML `required` attribute from the three required inputs so that browser-native validation does not intercept the submit event.
4. Change the success state icon container from `rounded-full` to `rounded-none`.

## Required context

The contact form is implemented in `frontend/src/components/ContactForm.jsx`. It uses two `useState` hooks: `form` (field values) and `sent` (success flag).

**Current state of the file (complete):**

```jsx
import { useState } from 'react';
import { Check } from 'lucide-react';
import Icon from './ui/Icon';

const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [sent, setSent] = useState(false);

  const onChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Message from ${form.name}${form.company ? ` (${form.company})` : ''}`
    );
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}${form.company ? `\nCompany: ${form.company}` : ''}\n\n${form.message}`
    );
    window.open(`mailto:contact.mybikelab@gmail.com?subject=${subject}&body=${body}`);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="card p-6 text-center">
        <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-brass-3 text-brass-9">
          <Icon as={Check} size={20} aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-ink-11">Thanks, {form.name || 'there'}!</h3>
        <p className="mt-1 text-ink-8">
          We'll get back to you at <span className="font-medium">{form.email}</span> shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-ink-11">Name</label>
          <input
            id="name"
            name="name"
            maxLength={80}
            value={form.name}
            onChange={onChange}
            required
            className="mt-1 w-full rounded-xs border border-ink-4 bg-paper-0 px-3 py-2 text-sm focus:border-brass-8 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium text-ink-11">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            maxLength={320}
            value={form.email}
            onChange={onChange}
            required
            className="mt-1 w-full rounded-xs border border-ink-4 bg-paper-0 px-3 py-2 text-sm focus:border-brass-8 focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label htmlFor="company" className="text-sm font-medium text-ink-11">Company (optional)</label>
        <input
          id="company"
          name="company"
          maxLength={120}
          value={form.company}
          onChange={onChange}
          className="mt-1 w-full rounded-xs border border-ink-4 bg-paper-0 px-3 py-2 text-sm focus:border-brass-8 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="message" className="text-sm font-medium text-ink-11">Message</label>
        <textarea
          id="message"
          name="message"
          maxLength={1200}
          rows={4}
          value={form.message}
          onChange={onChange}
          required
          className="mt-1 w-full rounded-xs border border-ink-4 bg-paper-0 px-3 py-2 text-sm focus:border-brass-8 focus:outline-none"
        />
      </div>
      <button type="submit" className="btn-primary w-full sm:w-auto">Send message</button>
    </form>
  );
};

export default ContactForm;
```

**Design system tokens used by error messages:**
- Color: `text-signal-down` (existing token — verify it exists in `tailwind.config.js` before proceeding; if absent, flag and do not invent an alternative)
- Size: `t-body-sm` (existing utility class — verify it is defined in `src/index.css`; if absent, flag)

**UI guidelines applicable to this task:**

- Forms: label above input, error text below input — never use `placeholder` as a label substitute. Error messages are rendered as a `<p>` element immediately after the input/textarea they describe, inside the same wrapping `<div>`.
- Error state: inline for forms (confirmed by PRD). No toast.
- The `required` attribute is removed from inputs to allow custom validation to run — this is intentional, not an accessibility regression. The validation itself enforces the required constraint.

## Potentially impacted files

- `frontend/src/components/ContactForm.jsx` — only this file

## Inputs

See the full current file content in the "Required context" section above.

## Expected outputs

The complete rewritten file must implement the following:

### New state variable

```jsx
const [errors, setErrors] = useState({ name: '', email: '', message: '' });
```

### Updated `onSubmit`

```jsx
const onSubmit = (e) => {
  e.preventDefault();

  const newErrors = {
    name: form.name.trim() === '' ? 'Name is required' : '',
    email: form.email.trim() === '' ? 'Email is required' : '',
    message: form.message.trim() === '' ? 'Message is required' : '',
  };
  setErrors(newErrors);

  if (newErrors.name || newErrors.email || newErrors.message) {
    return;
  }

  const subject = encodeURIComponent(
    `Message from ${form.name}${form.company ? ` (${form.company})` : ''}`
  );
  const body = encodeURIComponent(
    `Name: ${form.name}\nEmail: ${form.email}${form.company ? `\nCompany: ${form.company}` : ''}\n\n${form.message}`
  );
  window.open(`mailto:contact.mybikelab@gmail.com?subject=${subject}&body=${body}`);
  setSent(true);
};
```

### Error message element (rendered below the corresponding input/textarea)

```jsx
{errors.name && (
  <p className="mt-1 t-body-sm text-signal-down">{errors.name}</p>
)}
```

Apply the same pattern for `errors.email` and `errors.message`.

### Name field wrapper (after changes)

```jsx
<div>
  <label htmlFor="name" className="text-sm font-medium text-ink-11">Name</label>
  <input
    id="name"
    name="name"
    maxLength={80}
    value={form.name}
    onChange={onChange}
    className="mt-1 w-full rounded-xs border border-ink-4 bg-paper-0 px-3 py-2 text-sm focus:border-brass-8 focus:outline-none"
  />
  {errors.name && (
    <p className="mt-1 t-body-sm text-signal-down">{errors.name}</p>
  )}
</div>
```

### Email field wrapper (after changes)

```jsx
<div>
  <label htmlFor="email" className="text-sm font-medium text-ink-11">Email</label>
  <input
    id="email"
    name="email"
    type="email"
    maxLength={320}
    value={form.email}
    onChange={onChange}
    className="mt-1 w-full rounded-xs border border-ink-4 bg-paper-0 px-3 py-2 text-sm focus:border-brass-8 focus:outline-none"
  />
  {errors.email && (
    <p className="mt-1 t-body-sm text-signal-down">{errors.email}</p>
  )}
</div>
```

### Message field wrapper (after changes)

```jsx
<div>
  <label htmlFor="message" className="text-sm font-medium text-ink-11">Message</label>
  <textarea
    id="message"
    name="message"
    maxLength={1200}
    rows={4}
    value={form.message}
    onChange={onChange}
    className="mt-1 w-full rounded-xs border border-ink-4 bg-paper-0 px-3 py-2 text-sm focus:border-brass-8 focus:outline-none"
  />
  {errors.message && (
    <p className="mt-1 t-body-sm text-signal-down">{errors.message}</p>
  )}
</div>
```

### Success state icon container (after changes)

Change `rounded-full` to `rounded-none`:

```jsx
<div className="mx-auto grid h-10 w-10 place-items-center rounded-none bg-brass-3 text-brass-9">
  <Icon as={Check} size={20} aria-hidden="true" />
</div>
```

### `onChange` handler — unchanged

The `onChange` handler must not be modified. Errors are never triggered by input change.

### Company field — unchanged

The company field is optional and requires no validation or error message.

## Constraints

- The `required` attribute must be removed from the `name` input, `email` input, and `message` textarea. Do not remove it from the company field (it has none already).
- Error messages must use `text-signal-down` (color) and `t-body-sm` (size) — no other color or size class.
- Error messages must be rendered as `<p>` elements placed immediately after their corresponding input/textarea, inside the same `<div>` wrapper.
- Error messages must not appear on blur or on input change — only when `onSubmit` fires.
- Whitespace-only field values must be treated as empty: use `.trim() === ''` for validation checks.
- The `mailto:` URL, subject, and body encoding must not be modified.
- The `sent` flag behavior must not be modified.
- Do not modify any other file.

## Dependencies

none

## Validation criteria

- [ ] AC-005: Submitting with empty `name` shows an error below the `name` field only.
- [ ] AC-006: Submitting with empty `email` shows an error below the `email` field only.
- [ ] AC-007: Submitting with empty `message` shows an error below the `message` field only.
- [ ] AC-008: Submitting with all three fields empty shows three simultaneous error messages, one below each field.
- [ ] AC-009: Typing in a field (without submitting) shows no error. Leaving a field (blur) shows no error.
- [ ] AC-010: Submitting with all fields filled triggers the existing mailto flow and shows no errors.
- [ ] AC-011: The success state icon container carries `rounded-none` and does not carry `rounded-full`.
- [ ] AC-012: Error messages disappear (for the corrected field) when the form is successfully submitted after a prior failed attempt.
- [ ] A field containing only spaces is treated as empty — an error is shown for it on submit.
- [ ] The company field (optional) never shows an error message.
- [ ] No other section of the landing page is affected.

## Tests to implement

### Unit
None required for this evolution.

### Integration
None required for this evolution.
