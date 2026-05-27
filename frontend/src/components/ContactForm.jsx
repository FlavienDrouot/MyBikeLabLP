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
