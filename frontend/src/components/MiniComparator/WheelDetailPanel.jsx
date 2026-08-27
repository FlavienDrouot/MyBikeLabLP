import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import WheelImageCarousel from './WheelImageCarousel';
import { convert, formatPrice, isSupportedCurrency } from '../../lib/currency';

// The result surface is narrower than the full page because the Wave 5 shell
// reserves a 282px filter rail. Keep the ledger beside the plate when the
// remaining surface is usable, then stack it before the mobile layout starts.
const STACKED_PANEL_BREAKPOINT_PX = 900;
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
    <div className="comparator-detail-entry-meta mt-1 text-[10px] uppercase tracking-[0.1em] text-content-faint">
      {parts.join(' \u00b7 ')}
    </div>
  );
};

const LedgerRow = ({ entry, rank, ctaLabel, bestLabel, displayCurrency }) => (
  <div
    data-testid="wheel-detail-ledger-row"
    className={`comparator-detail-ledger-row relative grid grid-cols-[30px_minmax(0,1fr)_auto_150px] items-center gap-[18px] border-b border-border-subtle py-3 last:border-b-0 ${
      entry.isBestPrice ? 'pl-4 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:bg-accent' : ''
    }`}
  >
    <span className={`t-numeric text-[13px] ${rank == null ? 'text-content-faint' : 'text-content-faint'}`}>
      {rank == null ? '-' : String(rank).padStart(2, '0')}
    </span>
    <div className="min-w-0">
      <div className="flex min-w-0 items-center gap-2">
        <b className="min-w-0 truncate text-base font-semibold text-content-primary">{entry.name}</b>
      </div>
      <EntryMeta entry={entry} />
    </div>
    <div className="text-right">
      <span className={`t-numeric text-[19px] font-medium tracking-normal ${entry.isBestPrice ? 'text-signal-up' : 'text-content-primary'}`}>
        {entry.priceInDisplay != null
          ? formatPrice(entry.priceInDisplay, displayCurrency, { approx: entry.approx })
          : '-'}
      </span>
      {entry.delta != null && (
        <span className={`t-numeric mt-0.5 block text-[11px] ${entry.isBestPrice ? 'text-signal-up' : 'text-content-faint'}`}>
          {entry.delta === 0 ? bestLabel : `+${formatPrice(entry.delta, displayCurrency)}`}
        </span>
      )}
    </div>
    <a
      href={entry.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xs border px-3.5 py-2 text-sm font-semibold leading-none no-underline transition-colors duration-quick ease-standard focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        entry.isBestPrice
          ? 'border-accent bg-accent text-accent-fg-on hover:border-accent hover:bg-accent'
          : 'border-border-default bg-transparent text-content-primary hover:border-accent hover:text-accent'
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
      className="comparator-detail-panel bg-surface-well border-y border-border-default"
      role="region"
      aria-label={t('wheelDetail.panelLabel', { brand: wheel.brand, model: wheel.model })}
    >
      <div className={`mx-auto grid max-w-[1100px] items-start gap-12 ${isStacked ? 'grid-cols-1' : 'grid-cols-[380px_minmax(0,1fr)]'}`}>
        <div className="comparator-detail-plate mb-5 self-start border border-border-default bg-surface-panel">
          <div className="comparator-detail-plate-header flex items-center justify-between border-b border-border-subtle px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-content-muted">
            <span>{`FIG. 01 \u00b7 WHEEL`}</span>
            <span>SCALE 1:1</span>
          </div>
          <div data-testid="wheel-detail-plate-image" className="comparator-detail-image h-[340px] p-6 text-content-secondary">
            <WheelImageCarousel wheel={wheel} />
          </div>
        </div>

        <div data-testid="wheel-detail-ledger" className="comparator-detail-ledger min-w-0">
          {wheel.variant && (
            <div className="comparator-detail-variant mb-5 border-l border-accent pl-3">
              <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-content-muted">
                {t('wheelDetail.variant')}
              </p>
              <p className="m-0 mt-1 text-sm font-semibold text-content-primary">{t(`variant.${wheel.variant}`)}</p>
            </div>
          )}

          {hasNoLinks ? (
            <div className="border-t border-border-strong py-4">
              <p className="text-sm italic text-content-faint">{t('wheelDetail.noLinks')}</p>
            </div>
          ) : (
            <>
              {official && (
                <div>
                  <div className="comparator-detail-section-head mb-0.5 flex items-baseline justify-between border-b border-border-strong pb-2.5">
                    <h4 className="m-0 text-base font-semibold text-content-primary">
                      {t('wheelDetail.manufacturer')}
                    </h4>
                    <span className="t-eyebrow text-content-muted">{t('wheelDetail.priceAnnotation')}</span>
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
                <div className={`comparator-detail-retailers ${official ? 'mt-5' : ''}`}>
                  <div className="comparator-detail-section-head mb-0.5 flex items-baseline justify-between border-b border-border-strong pb-2.5">
                    <h4 className="m-0 text-base font-semibold text-content-primary">
                      {t('wheelDetail.whereToBuy')}
                    </h4>
                    <span className="t-eyebrow text-content-muted">{retailers.length}</span>
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
