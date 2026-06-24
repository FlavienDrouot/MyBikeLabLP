# TASK-012 — Translate `PartnershipSection.jsx` and `ContactForm.jsx`

## Objective

Replace all hardcoded strings in `src/components/PartnershipSection.jsx` and `src/components/ContactForm.jsx` with `useTranslation` calls. The `audiences` array in `PartnershipSection` is retrieved via `returnObjects`. `ContactForm` includes form validation error messages and a dynamic success state.

## Required context

- **Files**: `src/components/PartnershipSection.jsx` and `src/components/ContactForm.jsx`
- **i18n**: TASK-001. Use `useTranslation` from `react-i18next`.
- **returnObjects**: used for `partnership.audiences` (same pattern as TASK-010 and TASK-011).
- **ContactForm dynamic strings**: the success state shows `"Thanks, {{name}}!"` and `"We'll get back to you at {{email}} shortly."`. These use i18next interpolation. Call `t('contact.success.title', { name: form.name || 'there' })` and `t('contact.success.body', { email: form.email })`.
- **ContactForm validation errors**: error strings (`"Name is required"`, etc.) are set in state as strings. After this task, they are set as translation key strings and resolved at render time, OR they are resolved eagerly at the time of validation using `t()`. Recommended approach: resolve at validation time using `t()` (set the translated string directly into state), so the error display `<p>{errors.name}</p>` does not change.

  ```js
  // At validation time inside onSubmit:
  const newErrors = {
    name: form.name.trim() === '' ? t('contact.errors.nameRequired') : '',
    email: form.email.trim() === '' ? t('contact.errors.emailRequired') : '',
    message: form.message.trim() === '' ? t('contact.errors.messageRequired') : '',
  };
  ```
  This means if the user switches language while an error is displayed, the error remains in the language it was set in (until resubmit). This is acceptable — the form is not a high-frequency interaction, and re-validating on language change is unnecessary complexity.

- **`ContactForm` `mailto` subject and body**: the `subject` and `body` strings in the `mailto` link are internal (not user-visible UI). They are sent to an email client and should remain in a consistent language. Leave them in English (do not translate the `mailto` template). This is not a UI string.

### Strings to translate

**`PartnershipSection.jsx`**

| Location | Current string | Key |
|---|---|---|
| Section index | `"PARTNERSHIP"` | `partnership.sectionIndex` |
| Heading `<h2>` | `"Work with us"` | `partnership.title` |
| Intro `<p>` | `"MyBikeLab connects cyclists with structured component data. If you supply or sell road bike components, your product data belongs here."` | `partnership.intro` |
| Audiences data | hardcoded `audiences` array | `t('partnership.audiences', { returnObjects: true })` |

**`ContactForm.jsx`**

| Location | Current string | Key |
|---|---|---|
| Name label | `"Name"` | `contact.namePlaceholder` |
| Email label | `"Email"` | `contact.emailPlaceholder` |
| Company label | `"Company (optional)"` | `contact.companyPlaceholder` |
| Message label | `"Message"` | `contact.messagePlaceholder` |
| Submit button | `"Send message"` | `contact.submit` |
| Validation: name error | `"Name is required"` | `contact.errors.nameRequired` |
| Validation: email error | `"Email is required"` | `contact.errors.emailRequired` |
| Validation: message error | `"Message is required"` | `contact.errors.messageRequired` |
| Success title | `"Thanks, {form.name}!"` | `contact.success.title` with `{{name}}` |
| Success body | `"We'll get back to you at {form.email} shortly."` | `contact.success.body` with `{{email}}` |

Note: field `label` elements use the `for` attribute matching `input` IDs. Label text is the display text, not the HTML `for` attribute — translate the label text only.

## Potentially impacted files

- `src/components/PartnershipSection.jsx`
- `src/components/ContactForm.jsx`

## Inputs

Current `PartnershipSection.jsx`:
```jsx
import ContactForm from './ContactForm';

const audiences = [
  { title: 'Manufacturers', description: 'Showcase your specs in a structured, comparison-ready format.' },
  { title: 'Resellers', description: 'Plug into a high-intent comparison funnel built for road cyclists.' },
];

const PartnershipSection = () => {
  return (
    <section id="partnerships" className="section bg-ink-12 text-paper-1">
      <div className="container-page grid gap-10 lg:grid-cols-2 lg:gap-16 items-start">
        <div>
          <p className="t-section-index">PARTNERSHIP</p>
          <h2 className="mt-2 t-h1">Work with us</h2>
          <p className="mt-3 text-lg text-paper-2 max-w-xl">
            MyBikeLab connects cyclists with structured component data. If you supply or sell road bike components, your product data belongs here.
          </p>
          <div className="mt-8 space-y-4">
            {audiences.map((a) => (
              <div key={a.title} className="rounded-none border border-sage-4/40 bg-sage-1/10 p-4">
                <h3 className="font-semibold">{a.title}</h3>
                <p className="text-sm text-paper-2/80 mt-1">{a.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div id="contact" className="text-ink-11">
          <div className="lg:hidden border-t border-sage-3/30 mb-8" />
          <ContactForm />
        </div>
      </div>
    </section>
  );
};
```

Current `ContactForm.jsx` (key excerpts):
```jsx
const [errors, setErrors] = useState({ name: '', email: '', message: '' });

// In onSubmit:
const newErrors = {
  name: form.name.trim() === '' ? 'Name is required' : '',
  email: form.email.trim() === '' ? 'Email is required' : '',
  message: form.message.trim() === '' ? 'Message is required' : '',
};

// Success state:
<h3>Thanks, {form.name || 'there'}!</h3>
<p>We'll get back to you at <span>{form.email}</span> shortly.</p>

// Form fields:
<label>Name</label>
<label>Email</label>
<label>Company (optional)</label>
<label>Message</label>
<button type="submit">Send message</button>
```

## Expected outputs

### `PartnershipSection.jsx`
- Add `import { useTranslation } from 'react-i18next';`
- Inside component: `const { t } = useTranslation();`
- `const audiences = t('partnership.audiences', { returnObjects: true });`
- Remove hardcoded `audiences` constant
- Replace all static strings with `t()` calls

### `ContactForm.jsx`
- Add `import { useTranslation } from 'react-i18next';`
- Inside component: `const { t } = useTranslation();`
- Replace label texts with `t()`
- Replace submit button text with `t('contact.submit')`
- Replace validation error strings with `t()` calls at validation time (inside `onSubmit`):
  ```js
  const newErrors = {
    name: form.name.trim() === '' ? t('contact.errors.nameRequired') : '',
    email: form.email.trim() === '' ? t('contact.errors.emailRequired') : '',
    message: form.message.trim() === '' ? t('contact.errors.messageRequired') : '',
  };
  ```
- Replace success state strings:
  ```jsx
  <h3>{t('contact.success.title', { name: form.name || t('contact.successFallbackName') })}</h3>
  ```
  Wait — the English fallback for `form.name || 'there'` in French should be `'là'` or simply omitted. Simpler: add a key `contact.successFallbackName: "there"` / `"vous"` to handle the empty-name case:
  - `en.json`: `"contact": { ..., "successFallbackName": "there" }`
  - `fr.json`: `"contact": { ..., "successFallbackName": "vous" }`
  Then: `t('contact.success.title', { name: form.name || t('contact.successFallbackName') })`
- Replace success body: use the `{{email}}` interpolation pattern:
  ```jsx
  <p>{t('contact.success.body', { email: form.email })}</p>
  ```
  Remove the wrapping `<span className="font-medium">` around the email — the translation string includes no inline HTML; the email is interpolated as plain text. If the `font-medium` styling is important, use `<Trans>` component or accept the style loss. Given the functional priority of this evolution, omitting the inner `<span>` is acceptable.

  Note: Add `contact.successFallbackName` to `en.json` and `fr.json`.

- The `mailto` template strings (`subject`, `body`) inside `onSubmit` are not translated — leave them in English.

## Constraints (from UI Guidelines — visible surface)

- Form labels must remain above their inputs (label above input, per UI guidelines) — do not change the layout
- Error messages remain below their inputs — do not change error positioning
- Do not use `placeholder` as a label substitute — the existing structure (label elements above inputs) is already compliant; preserve it
- The submit button text in French is `"Envoyer le message"` — verify it fits on one line at desktop width on the `btn-primary w-full sm:w-auto` button; at `sm:w-auto` the button expands to fit its content, so overflow is not a risk

## Dependencies

TASK-001, TASK-002, TASK-003

## Validation criteria

- [ ] In French mode: Partnership section index, heading, and intro paragraph display in French
- [ ] In French mode: audience cards ("Fabricants", "Revendeurs") display in French
- [ ] In French mode: all ContactForm labels display in French ("Nom", "Email", "Entreprise (facultatif)", "Message")
- [ ] In French mode: the submit button displays "Envoyer le message"
- [ ] In French mode: validation errors display in French ("Le nom est requis", etc.)
- [ ] In French mode: the success state displays "Merci, [name] !" and the French success body
- [ ] Submitting the form (triggering the mailto client) still works correctly in both languages
- [ ] `npm run build` passes

## Tests to implement

### Unit
- None

### Integration
- Switch to French; scroll to the Partnership section; verify all static strings are in French
- Submit the contact form with empty required fields; verify French error messages appear
- Fill in the form and submit; verify the French success state is shown
