import { useTranslation } from 'react-i18next';

const WheelDetailPanel = ({ wheel }) => {
  const { t } = useTranslation();
  const { affiliateLinks, image, brand, model } = wheel;
  const manufacturer = affiliateLinks?.manufacturer;
  const retailers = affiliateLinks?.retailers ?? [];
  const hasManufacturer = !!manufacturer;
  const hasRetailers = retailers.length > 0;
  const hasNoLinks = !hasManufacturer && !hasRetailers;

  const sortedRetailers = [...retailers].sort((a, b) => a.price_eur - b.price_eur);

  return (
    <div className="flex items-center gap-5 px-5 py-3 bg-paper-2/60 border-t border-t-ink-3 border-b border-b-ink-4">
      <img
        src={image}
        alt={model}
        className="w-[140px] h-[140px] flex-shrink-0 object-contain rounded-xs"
      />

      <div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-[140px] py-0.5">
        {hasNoLinks ? (
          <p className="text-xs text-ink-6 italic">{t('wheelDetail.noLinks')}</p>
        ) : (
          <>
            {hasManufacturer && (
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-ink-6 mb-1">
                  {t('wheelDetail.manufacturer')}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-ink-11">{brand}</span>
                  <span className="flex items-center gap-3 flex-shrink-0">
                    {manufacturer.price_eur != null && (
                      <span className="flex flex-col items-end">
                        <span className="font-semibold text-ink-11 font-mono tabular-nums">
                          {manufacturer.price_eur.toLocaleString('fr-FR')} &euro;
                        </span>
                        <span className="t-annotation">{t('wheelDetail.priceAnnotation')}</span>
                      </span>
                    )}
                    <a
                      href={manufacturer.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-brass-8 hover:underline"
                    >
                      {t('wheelDetail.buyLink')}
                    </a>
                  </span>
                </div>
              </div>
            )}

            {hasRetailers && (
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-ink-6 mb-1">
                  {t('wheelDetail.whereToBuy')}
                </p>
                <ul className="space-y-1">
                  {sortedRetailers.map((r, i) => (
                    <li key={i} className="flex items-center justify-between text-sm">
                      <span className="text-ink-11">{r.name}</span>
                      <span className="flex items-center gap-3 flex-shrink-0">
                        <span className="flex flex-col items-end">
                          <span className="font-semibold text-ink-11 font-mono tabular-nums">
                            {r.price_eur.toLocaleString('fr-FR')} &euro;
                          </span>
                          <span className="t-annotation">{t('wheelDetail.priceAnnotation')}</span>
                        </span>
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-brass-8 hover:underline"
                        >
                          {t('wheelDetail.buyLink')}
                        </a>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WheelDetailPanel;
