import { useState } from 'react';

const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [sent, setSent] = useState(false);

  const onChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Message de ${form.name}${form.company ? ` (${form.company})` : ''}`
    );
    const body = encodeURIComponent(
      `Nom : ${form.name}\nEmail : ${form.email}${form.company ? `\nEntreprise : ${form.company}` : ''}\n\n${form.message}`
    );
    window.open(`mailto:contact.mybikelab@gmail.com?subject=${subject}&body=${body}`);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="card p-6 text-center">
        <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-700">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-ink-900">Thanks, {form.name || 'there'}!</h3>
        <p className="mt-1 text-ink-500">
          We'll get back to you at <span className="font-medium">{form.email}</span> shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-ink-700">Name</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={onChange}
            required
            className="mt-1 w-full rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm focus:border-brand-600 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium text-ink-700">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            required
            className="mt-1 w-full rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm focus:border-brand-600 focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label htmlFor="company" className="text-sm font-medium text-ink-700">Company (optional)</label>
        <input
          id="company"
          name="company"
          value={form.company}
          onChange={onChange}
          className="mt-1 w-full rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm focus:border-brand-600 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="message" className="text-sm font-medium text-ink-700">Message</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={form.message}
          onChange={onChange}
          required
          className="mt-1 w-full rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm focus:border-brand-600 focus:outline-none"
        />
      </div>
      <button type="submit" className="btn-primary w-full sm:w-auto">Send message</button>
    </form>
  );
};

export default ContactForm;
