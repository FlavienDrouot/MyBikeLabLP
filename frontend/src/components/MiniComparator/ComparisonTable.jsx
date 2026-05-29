import React, { useState, useRef, useLayoutEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { selectFilteredWheels } from '../../store/selectors/wheelsSelectors';
import { getColumnProperties } from '../../config/wheelProperties';
import WheelDetailPanel from './WheelDetailPanel';
import Icon from '../ui/Icon';

const renderCellFor = (property) =>
  property.column?.renderCell ??
  ((w) => `${property.accessor(w)}${property.unit ?? ''}`);
const cellClassFor = (property) => {
  const base = property.column?.cellClassName ?? `px-4 py-3 text-ink-11`;
  return property.unit !== undefined ? `${base} font-mono tabular-nums` : base;
};

const ComparisonTable = ({ visibility }) => {
  const { t } = useTranslation();
  const wheels = useSelector(selectFilteredWheels);
  const total = useSelector((state) => state.wheels.items.length);
  const [expandedId, setExpandedId] = useState(null);

  const scrollRef = useRef(null);
  const panelRef = useRef(null);

  // Called when the panel div mounts or unmounts — sets width immediately on mount.
  const setPanelRef = useCallback((el) => {
    panelRef.current = el;
    if (el && scrollRef.current) {
      el.style.width = `${scrollRef.current.clientWidth}px`;
    }
  }, []);

  // Keep width correct when the scroll container is resized.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (panelRef.current) panelRef.current.style.width = `${el.clientWidth}px`;
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cols = getColumnProperties().filter(
    (p) => p.column?.required || visibility[p.id]
  );

  const toggleExpanded = (id) =>
    setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="card overflow-hidden w-fit max-w-full lg:flex lg:flex-col lg:max-h-[calc(100vh-var(--navbar-height)-12px)] lg:overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4">
        <h3 className="text-base font-semibold text-ink-11">
          {t('table.heading')}{' '}
          <span className="text-ink-7 font-normal">
            — {wheels.length} {t('table.of')} {total}
          </span>
        </h3>
      </div>
      <hr className="rule" />

      {wheels.length === 0 ? (
        <div className="p-10 text-center text-ink-7 text-sm">
          {t('table.emptyState')}
        </div>
      ) : (
        <div className="overflow-x-auto lg:overflow-y-auto lg:min-h-0 lg:[scrollbar-gutter:stable]" ref={scrollRef}>
          <table className="w-max text-sm">
            <thead className="bg-paper-2 text-ink-7 sticky top-0 z-10">
              <tr className="text-left">
                {cols.map((p) => (
                  <th key={p.id} className="px-4 py-3 text-xs font-medium uppercase tracking-widest text-ink-7">
                    {t(p.label)}
                  </th>
                ))}
                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>
            <tbody>
              {wheels.map((w) => (
                <React.Fragment key={w.id}>
                  <tr
                    className="hover:bg-paper-2 cursor-pointer"
                    style={{ borderBottom: '1px solid var(--rule-faint)', transition: 'background-color var(--duration-quick) var(--ease-standard)' }}
                    onClick={() => toggleExpanded(w.id)}
                  >
                    {cols.map((p) => (
                      <td key={p.id} className={cellClassFor(p)}>
                        {renderCellFor(p)(w)}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-ink-6">
                      <Icon
                        as={ChevronDown}
                        size={16}
                        aria-hidden="true"
                        className={`transition-transform duration-150 ${expandedId === w.id ? 'rotate-180' : ''}`}
                      />
                    </td>
                  </tr>
                  {expandedId === w.id && (
                    <tr>
                      <td colSpan={cols.length + 1} className="p-0">
                        <div
                          ref={setPanelRef}
                          style={{ position: 'sticky', left: 0 }}
                        >
                          <WheelDetailPanel wheel={w} />
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ComparisonTable;
