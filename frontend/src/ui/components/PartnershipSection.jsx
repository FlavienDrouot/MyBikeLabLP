import { useTranslation } from 'react-i18next';
import ContactForm from './ContactForm';

const PartnershipSection = () => {
  const { t } = useTranslation();

  return (
    <section
      id="partnerships"
      className="section-spaced partnership-section"
      aria-labelledby="partnership-title"
    >
      <div className="container-page partner-grid">
        <div className="partner-copy">
          <h2 id="partnership-title">{t('partnership.title')}</h2>
          <p className="partner-intro">{t('partnership.intro')}</p>

          <p className="partner-intro">{t('partnership.benefit')}</p>
        </div>

        <ContactForm />
      </div>
    </section>
  );
};

export default PartnershipSection;
