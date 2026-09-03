import { useTranslation } from 'react-i18next';
import ContactForm from './ContactForm';

const PartnershipSection = () => {
  const { t } = useTranslation();
  const audiences = t('partnership.audiences', { returnObjects: true });

  return (
    <section
      id="partnerships"
      className="section-spaced partnership-section"
      aria-labelledby="partnership-title"
    >
      <div className="container-page partner-grid">
        <div className="partner-copy">
          <p className="t-eyebrow">{t('partnership.sectionIndex')}</p>
          <h2 id="partnership-title">{t('partnership.title')}</h2>
          <p className="partner-intro">{t('partnership.intro')}</p>

          <div className="audience-list">
            {audiences.map((a) => (
              <article key={a.title} className="audience">
                <h3>{a.title}</h3>
                <p>{a.description}</p>
              </article>
            ))}
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
};

export default PartnershipSection;
