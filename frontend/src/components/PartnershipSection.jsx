import { useTranslation } from 'react-i18next';
import ContactForm from './ContactForm';

const PartnershipSection = () => {
  const { t } = useTranslation();
  const audiences = t('partnership.audiences', { returnObjects: true });

  return (
    <section id="partnerships" className="section bg-bg-inverse text-content-on-inverse">
      <div className="container-page grid gap-10 lg:grid-cols-2 lg:gap-16 items-start">
        <div>
          <p className="t-eyebrow text-accent">{t('partnership.sectionIndex')}</p>
          <h2 className="mt-2 t-h1">
            {t('partnership.title')}
          </h2>
          <p className="mt-3 text-lg text-content-on-inverse max-w-xl">
            {t('partnership.intro')}
          </p>

          <div className="mt-8">
            {audiences.map((a) => (
              <div key={a.title} className="audience-tile">
                <div className="audience-tile-title">{a.title}</div>
                <div className="audience-tile-desc">{a.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div id="contact">
          <div className="lg:hidden border-t border-border-strong mb-8" />
          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default PartnershipSection;
