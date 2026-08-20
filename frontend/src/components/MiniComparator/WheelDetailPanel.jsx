import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import WheelImageCarousel from './WheelImageCarousel';
import { convert, formatPrice, isSupportedCurrency } from '../../lib/currency';

const STACKED_PANEL_BREAKPOINT_PX = 1040;
const hasKnownPrice = (entry) => Number.isFinite(entry.amount) && isSupportedCurrency(entry.currency);
// Ledger prices follow the active display currency (TASK-004); converted rows
// carry an `≈` hint when their source currency differs from the display one.
const entryPriceIn = (entry, displayCurrency) => convert(entry.amount, entry.currency, displayCurrency);

const buildLedgerEntries = (wheel, displayCurrency) => {
  const manufacturer = wheel.affiliateLinks?.manufacturer;
  const retailers = wheel.affiliateLinks?.retailers ?? [];
  const entries = [
    ...(manufacturer ? [{ ...manufacturer, name: wheel.brand, isOfficial: true }] : []),
    ...retailers.map((retailer) => ({ ...retailer, isOfficial: false })),
  ]
    .filter((entry) => entry.url)
    .sort((a, b) => {
      if (hasKnownPrice(a) && hasKnownPrice(b)) {
        return entryPriceIn(a, displayCurrency) - entryPriceIn(b, displayCurrency);
      }
      if (hasKnownPrice(a)) return -1;
      if (hasKnownPrice(b)) return 1;
      return 0;
    });

  const minPrice = entries
    .filter(hasKnownPrice)
    .map((entry) => entryPriceIn(entry, displayCurrency))
    .sort((a, b) => a - b)[0];

  return entries.map((entry) => {
    const priceInDisplay = hasKnownPrice(entry) ? entryPriceIn(entry, displayCurrency) : null;
    return {
      ...entry,
      priceInDisplay,
      approx: priceInDisplay != null && entry.currency !== displayCurrency,
      isBestPrice: minPrice != null && priceInDisplay != null && priceInDisplay === minPrice,
      delta: minPrice == null || priceInDisplay == null ? null : priceInDisplay - minPrice,
    };
  });
};

const EntryMeta = ({ entry }) => {
  const parts = [entry.region, entry.stock].filter(Boolean);

  if (parts.length === 0) return null;

  return (
    <div className="mt-1 text-[10px] uppercase tracking-[0.1em] text-ink-6">
      {parts.join(' \u00b7 ')}
    </div>
  );
};

const LedgerRow = ({ entry, rank, ctaLabel, bestLabel, displayCurrency }) => (
  <div
    data-testid="wheel-detail-ledger-row"
    className={`relative grid grid-cols-[30px_minmax(0,1fr)_auto_150px] items-center gap-[18px] border-b border-ink-3 py-3 last:border-b-0 ${
      entry.isBestPrice ? 'pl-4 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:bg-brass-8' : ''
    }`}
  >
    <span className={`t-numeric text-[13px] ${rank == null ? 'text-ink-5' : 'text-ink-6'}`}>
      {rank == null ? '-' : String(rank).padStart(2, '0')}
    </span>
    <div className="min-w-0">
      <div className="flex min-w-0 items-center gap-2">
        <b className="min-w-0 truncate text-base font-semibold text-ink-11">{entry.name}</b>
      </div>
      <EntryMeta entry={entry} />
    </div>
    <div className="text-right">
      <span className={`t-numeric text-[19px] font-medium tracking-normal ${entry.isBestPrice ? 'text-signal-up' : 'text-ink-11'}`}>
        {entry.priceInDisplay != null
          ? formatPrice(entry.priceInDisplay, displayCurrency, { approx: entry.approx })
          : '-'}
      </span>
      {entry.delta != null && (
        <span className={`t-numeric mt-0.5 block text-[11px] ${entry.isBestPrice ? 'text-signal-up' : 'text-ink-6'}`}>
          {entry.delta === 0 ? bestLabel : `+${formatPrice(entry.delta, displayCurrency)}`}
        </span>
      )}
    </div>
    <a
      href={entry.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xs border px-3.5 py-2 text-sm font-semibold leading-none no-underline transition-colors duration-quick ease-standard focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-8 ${
        entry.isBestPrice
          ? 'border-brass-7 bg-brass-7 text-ink-12 hover:border-brass-8 hover:bg-brass-8'
          : 'border-ink-4 bg-transparent text-ink-11 hover:border-brass-8 hover:text-brass-8'
      }`}
    >
      {ctaLabel}
    </a>
  </div>
);

const WheelDetailPanel = ({ wheel, panelWidth }) => {
  const isStacked = panelWidth < STACKED_PANEL_BREAKPOINT_PX;
  const { t } = useTranslation();
  const displayCurrency = useSelector((s) => s.currency.displayCurrency);
  const entries = buildLedgerEntries(wheel, displayCurrency);
  const official = entries.find((entry) => entry.isOfficial);
  const retailers = entries.filter((entry) => !entry.isOfficial);
  const hasNoLinks = entries.length === 0;

  return (
    <div
      className="bg-paper-2 border-y border-ink-4 px-7 py-[26px]"
      role="region"
      aria-label={t('wheelDetail.panelLabel', { brand: wheel.brand, model: wheel.model })}
    >
      <div className={`mx-auto grid max-w-[1100px] items-start gap-12 ${isStacked ? 'grid-cols-1' : 'grid-cols-[380px_minmax(0,1fr)]'}`}>
        <div className="mb-5 self-start border border-ink-4 bg-paper-0">
          <div className="flex items-center justify-between border-b border-ink-3 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-7">
            <span>{`FIG. 01 \u00b7 WHEEL`}</span>
            <span>SCALE 1:1</span>
          </div>
          <div data-testid="wheel-detail-plate-image" className="h-[340px] p-6 text-ink-9">
            <WheelImageCarousel wheel={wheel} />
          </div>
        </div>

        <div data-testid="wheel-detail-ledger" className="min-w-0">
          {wheel.variant && (
            <div className="mb-5 border-l border-brass-7 pl-3">
              <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-7">
                {t('wheelDetail.variant')}
              </p>
              <p className="m-0 mt-1 text-sm font-semibold text-ink-11">{t(`variant.${wheel.variant}`)}</p>
            </div>
          )}

          {hasNoLinks ? (
            <div className="border-t border-ink-10 py-4">
              <p className="text-sm italic text-ink-6">{t('wheelDetail.noLinks')}</p>
            </div>
          ) : (
            <>
              {official && (
                <div>
                  <div className="mb-0.5 flex items-baseline justify-between border-b border-ink-10 pb-2.5">
                    <h4 className="m-0 text-base font-semibold text-ink-11">
                      {t('wheelDetail.manufacturer')}
                    </h4>
                    <span className="t-eyebrow text-ink-7">{t('wheelDetail.priceAnnotation')}</span>
                  </div>
                  <LedgerRow
                    entry={official}
                    rank={null}
                    ctaLabel={t('wheelDetail.buyLink')}
                    bestLabel={t('wheelDetail.priceAnnotation')}
                    displayCurrency={displayCurrency}
                  />
                </div>
              )}

              {retailers.length > 0 && (
                <div className={official ? 'mt-5' : ''}>
                  <div className="mb-0.5 flex items-baseline justify-between border-b border-ink-10 pb-2.5">
                    <h4 className="m-0 text-base font-semibold text-ink-11">
                      {t('wheelDetail.whereToBuy')}
                    </h4>
                    <span className="t-eyebrow text-ink-7">{retailers.length}</span>
                  </div>
                  {retailers.map((entry, index) => (
                    <LedgerRow
                      key={`${entry.name}-${entry.url}`}
                      entry={entry}
                      rank={index + 1}
                      ctaLabel={t('wheelDetail.buyLink')}
                      bestLabel={t('wheelDetail.priceAnnotation')}
                      displayCurrency={displayCurrency}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WheelDetailPanel;
