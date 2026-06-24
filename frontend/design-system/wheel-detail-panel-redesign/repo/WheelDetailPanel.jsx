import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from 'lucide-react';
import Icon from '../ui/Icon';
import WheelImageCarousel from './WheelImageCarousel';

/* ----------------------------------------------------------------------------
   Price formatting — keeps the mono / tabular-nums numeral treatment.
---------------------------------------------------------------------------- */
const eur = (n) => `${n.toLocaleString('fr-FR')} €`;

const tagBase =
  'text-[9px] font-bold uppercase tracking-[0.14em] px-1.5 py-0.5 rounded-xs leading-none whitespace-nowrap';
const ctaBase =
  'inline-flex items-center justify-center gap-1.5 text-sm font-semibold rounded-xs px-3.5 py-2 transition-colors whitespace-nowrap';
const ctaPrimary = `${ctaBase} bg-brass-7 text-ink-12 border border-brass-7 hover:bg-brass-8 hover:border-brass-8`;
const ctaGhost = `${ctaBase} border border-ink-4 text-ink-11 hover:border-brass-8 hover:text-brass-8`;

/* ----------------------------------------------------------------------------
   A single price-ledger row. Shared grid keeps prices aligned across both
   the Manufacturer and Retailers groups. The cheapest source overall is
   flagged `best` (brass keyline + accent price + filled CTA).
---------------------------------------------------------------------------- */
const LinkRow = ({ entry, rank, isMobile, t }) => {
  const { name, price_eur, url, region, stock, official, best, delta } = entry;
  const meta = [region, stock].filter(Boolean).join(' · ');

  return (
    <div
      className={[
        'relative items-center border-b border-ink-3 last:border-b-0 py-2.5 grid gap-x-4',
        isMobile ? 'grid-cols-[1fr_auto] gap-y-2.5' : 'grid-cols-[1.75rem_1fr_auto_auto]',
        best ? 'pl-4' : '',
      ].join(' ')}
    >
      {best && (
        <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-brass-8" aria-hidden="true" />
      )}

      {/* Rank — retailers only, desktop only. '—' for the manufacturer. */}
      {!isMobile && (
        <span className={`font-mono text-[13px] ${rank == null ? 'text-ink-5' : 'text-ink-6'}`}>
          {rank == null ? '—' : String(rank).padStart(2, '0')}
        </span>
      )}

      {/* Who */}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-ink-11 truncate">{name}</span>
          {official && (
            <span className={`${tagBase} bg-ink-2 text-ink-8 border border-ink-4`}>
              {t('wheelDetail.official')}
            </span>
          )}
          {best && (
            <span className={`${tagBase} bg-brass-8 text-paper-0`}>{t('wheelDetail.bestPrice')}</span>
          )}
        </div>
        {meta && (
          <div className="mt-0.5 text-[10px] uppercase tracking-[0.1em] text-ink-6">{meta}</div>
        )}
      </div>

      {/* Price + delta-to-cheapest */}
      <div className="text-right">
        <span
          className="font-mono tabular-nums text-[19px] font-medium text-ink-11"
          style={best ? { color: 'var(--signal-up, #2f6b3a)' } : undefined}
        >
          {eur(price_eur)}
        </span>
        <span
          className="block font-mono text-[11px] mt-0.5 text-ink-6"
          style={best ? { color: 'var(--signal-up, #2f6b3a)' } : undefined}
        >
          {delta === 0 ? t('wheelDetail.lowest') : `+${eur(delta)}`}
        </span>
      </div>

      {/* CTA — full-width on mobile (spans both columns) */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${best ? ctaPrimary : ctaGhost} ${isMobile ? 'col-span-2 w-full' : ''}`}
      >
        {t('wheelDetail.buyLink')}
        <Icon as={ArrowUpRight} size={15} aria-hidden="true" />
      </a>
    </div>
  );
};

const GroupHeader = ({ title, note }) => (
  <div className="flex items-baseline justify-between pb-2.5 mb-0.5 border-b border-ink-10">
    <h4 className="text-base font-semibold text-ink-11">{title}</h4>
    {note && (
      <span className="text-[10px] font-medium uppercase tracking-widest text-ink-7">{note}</span>
    )}
  </div>
);

/* ============================================================================
   WheelDetailPanel — expanded row content under the comparison table.
   Enlarged image on the left; price ledger split into Manufacturer / Retailers
   on the right. Cheapest source overall is highlighted in brass.
   ============================================================================ */
const WheelDetailPanel = ({ wheel, panelWidth }) => {
  const isMobile = panelWidth < 870;
  const { t } = useTranslation();
  const { affiliateLinks, brand } = wheel;

  const manufacturer = affiliateLinks?.manufacturer;
  const retailers = affiliateLinks?.retailers ?? [];
  const hasManufacturer = !!manufacturer;
  const hasRetailers = retailers.length > 0;
  const hasNoLinks = !hasManufacturer && !hasRetailers;

  // Cheapest price across ALL sources → drives the best-price flag and deltas.
  const allPrices = [
    ...(hasManufacturer && manufacturer.price_eur != null ? [manufacturer.price_eur] : []),
    ...retailers.map((r) => r.price_eur),
  ];
  const minPrice = allPrices.length ? Math.min(...allPrices) : null;

  const decorate = (e) => ({
    ...e,
    delta: minPrice == null ? 0 : e.price_eur - minPrice,
    best: minPrice != null && e.price_eur === minPrice,
  });

  const manufacturerEntry = hasManufacturer
    ? decorate({ ...manufacturer, name: brand, official: true })
    : null;
  const retailerEntries = [...retailers]
    .sort((a, b) => a.price_eur - b.price_eur)
    .map(decorate);

  return (
    <div className="bg-paper-2/60 border-t border-t-ink-3 border-b border-b-ink-4">
      <div
        className={`mx-auto max-w-[1080px] flex gap-10 px-7 py-6 ${
          isMobile ? 'flex-col items-center' : 'flex-row items-start'
        }`}
      >
        {/* Enlarged image */}
        <div className={isMobile ? '' : 'flex-shrink-0'}>
          <WheelImageCarousel wheel={wheel} />
        </div>

        {/* Price ledger */}
        <div className={`flex flex-col gap-5 ${isMobile ? 'w-full' : 'flex-1 min-w-0'}`}>
          {hasNoLinks ? (
            <p className="t-annotation">{t('wheelDetail.noLinks')}</p>
          ) : (
            <>
              <section>
                <GroupHeader
                  title={t('wheelDetail.manufacturer')}
                  note={t('wheelDetail.officialStore')}
                />
                {manufacturerEntry ? (
                  <LinkRow entry={manufacturerEntry} rank={null} isMobile={isMobile} t={t} />
                ) : (
                  <p className="t-annotation py-3">{t('wheelDetail.noManufacturer')}</p>
                )}
              </section>

              <section>
                <GroupHeader
                  title={t('wheelDetail.retailers')}
                  note={
                    hasRetailers
                      ? t('wheelDetail.cheapestFirst', { count: retailerEntries.length })
                      : null
                  }
                />
                {hasRetailers ? (
                  retailerEntries.map((e, i) => (
                    <LinkRow key={`${e.name}-${i}`} entry={e} rank={i + 1} isMobile={isMobile} t={t} />
                  ))
                ) : (
                  <p className="t-annotation py-3">{t('wheelDetail.noRetailers')}</p>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WheelDetailPanel;
