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
      <div id="contact" className="wave5-panel form-card contact-success">
        <div className="contact-success-icon">
          <Icon as={Check} size={20} aria-hidden="true" />
        </div>
        <h3>
          {t('contact.success.title', { name: form.name || t('contact.successFallbackName') })}
        </h3>
        <p>
          {t('contact.success.body', { email: form.email })}
        </p>
      </div>
    );
  }

  return (
    <form id="contact" onSubmit={onSubmit} className="wave5-panel form-card contact-form">
      <p className="t-eyebrow">{t('contact.eyebrow')}</p>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="name">{t('contact.namePlaceholder')}</label>
          <input
            id="name"
            name="name"
            type="text"
            maxLength={80}
            value={form.name}
            onChange={onChange}
            placeholder={t('contact.namePlaceholder')}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            className="wave5-input"
          />
          {errors.name && (
            <p id="contact-name-error" className="field-error" role="alert">{errors.name}</p>
          )}
        </div>
        <div className="field">
          <label htmlFor="email">{t('contact.emailPlaceholder')}</label>
          <input
            id="email"
            name="email"
            type="email"
            maxLength={320}
            value={form.email}
            onChange={onChange}
            placeholder={t('contact.emailPlaceholder')}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            className="wave5-input"
          />
          {errors.email && (
            <p id="contact-email-error" className="field-error" role="alert">{errors.email}</p>
          )}
        </div>
        <div className="field full">
          <label htmlFor="company">{t('contact.companyLabel')}</label>
          <input
            id="company"
            name="company"
            type="text"
            maxLength={120}
            value={form.company}
            onChange={onChange}
            placeholder={t('contact.companyPlaceholder')}
            className="wave5-input"
          />
        </div>
        <div className="field full">
          <label htmlFor="message">{t('contact.messagePlaceholder')}</label>
          <textarea
            id="message"
            name="message"
            maxLength={1200}
            value={form.message}
            onChange={onChange}
            placeholder={t('contact.messagePlaceholder')}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'contact-message-error' : undefined}
            className="wave5-input"
          />
          {errors.message && (
            <p id="contact-message-error" className="field-error" role="alert">{errors.message}</p>
          )}
        </div>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn-primary">{t('contact.submit')}</button>
      </div>
    </form>
  );
};

export default ContactForm;
