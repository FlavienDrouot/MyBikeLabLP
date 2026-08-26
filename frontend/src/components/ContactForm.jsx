import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import Icon from './ui/Icon';

const ContactForm = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });

  const onChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      name: form.name.trim() === '' ? t('contact.errors.nameRequired') : '',
      email: form.email.trim() === '' ? t('contact.errors.emailRequired') : '',
      message: form.message.trim() === '' ? t('contact.errors.messageRequired') : '',
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

  if (sent) {
    return (
      <div className="card p-6 text-center">
        <div className="mx-auto grid h-10 w-10 place-items-center rounded-none bg-accent-wash text-accent">
          <Icon as={Check} size={20} aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-content-primary">
          {t('contact.success.title', { name: form.name || t('contact.successFallbackName') })}
        </h3>
        <p className="mt-1 text-content-secondary">
          {t('contact.success.body', { email: form.email })}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-content-primary">{t('contact.namePlaceholder')}</label>
          <input
            id="name"
            name="name"
            maxLength={80}
            value={form.name}
            onChange={onChange}
            className="wave5-input mt-1 px-3 py-2 text-sm"
          />
          {errors.name && (
            <p className="mt-1 t-body-sm text-signal-down">{errors.name}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium text-content-primary">{t('contact.emailPlaceholder')}</label>
          <input
            id="email"
            name="email"
            type="email"
            maxLength={320}
            value={form.email}
            onChange={onChange}
            className="wave5-input mt-1 px-3 py-2 text-sm"
          />
          {errors.email && (
            <p className="mt-1 t-body-sm text-signal-down">{errors.email}</p>
          )}
        </div>
      </div>
      <div>
        <label htmlFor="company" className="text-sm font-medium text-content-primary">{t('contact.companyPlaceholder')}</label>
        <input
          id="company"
          name="company"
          maxLength={120}
          value={form.company}
          onChange={onChange}
          className="wave5-input mt-1 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="message" className="text-sm font-medium text-content-primary">{t('contact.messagePlaceholder')}</label>
        <textarea
          id="message"
          name="message"
          maxLength={1200}
          rows={4}
          value={form.message}
          onChange={onChange}
          className="wave5-input mt-1 px-3 py-2 text-sm"
        />
        {errors.message && (
          <p className="mt-1 t-body-sm text-signal-down">{errors.message}</p>
        )}
      </div>
      <button type="submit" className="btn-primary w-full sm:w-auto">{t('contact.submit')}</button>
    </form>
  );
};

export default ContactForm;
