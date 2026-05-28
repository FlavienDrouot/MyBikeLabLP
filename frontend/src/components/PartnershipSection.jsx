import { useTranslation } from 'react-i18next';
import ContactForm from './ContactForm';

const PartnershipSection = () => {
  const { t } = useTranslation();
  const audiences = t('partnership.audiences', { returnObjects: true });

  return (
    <section id="partnerships" className="section bg-ink-12 text-paper-1">
      <div className="container-page grid gap-10 lg:grid-cols-2 lg:gap-16 items-start">
        <div>
          <p className="t-section-index">{t('partnership.sectionIndex')}</p>
          <h2 className="mt-2 t-h1">
            {t('partnership.title')}
          </h2>
          <p className="mt-3 text-lg text-paper-2 max-w-xl">
            {t('partnership.intro')}
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

export default PartnershipSection;
