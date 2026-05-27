import React, { useState } from 'react';
import { useSelector } from 'react-redux';
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
const headClassFor = (property) =>
  property.column?.headClassName ?? 'px-4 py-3 font-semibold';


const ComparisonTable = ({ visibility }) => {
  const wheels = useSelector(selectFilteredWheels);
  const total = useSelector((state) => state.wheels.items.length);
  const [expandedId, setExpandedId] = useState(null);

  const cols = getColumnProperties().filter(
    (p) => p.column?.required || visibility[p.id]
  );

  const toggleExpanded = (id) =>
    setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="card overflow-hidden w-fit max-w-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-ink-3">
        <h3 className="text-base font-semibold text-ink-11">
          Wheels{' '}
          <span className="text-ink-7 font-normal">
            — {wheels.length} of {total}
          </span>
        </h3>
      </div>

      {wheels.length === 0 ? (
        <div className="p-10 text-center text-ink-7 text-sm">
          No wheels match your filters. Try resetting them.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-max text-sm">
            <thead className="bg-paper-2 text-ink-7">
              <tr className="text-left">
                {cols.map((p) => (
                  <th key={p.id} className="px-4 py-3 text-xs font-medium uppercase tracking-widest text-ink-7">
                    {p.label}
                  </th>
                ))}
                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-3">
              {wheels.map((w) => (
                <React.Fragment key={w.id}>
                  <tr
                    className="hover:bg-paper-2 transition-colors cursor-pointer"
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
                        <WheelDetailPanel wheel={w} />
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
