import { useSelector } from 'react-redux';
import { selectFilteredWheels } from '../../store/selectors/wheelsSelectors';
import { getColumnProperties } from '../../config/wheelProperties';

// Helpers — provide default render/className when the registry doesn't specify them.
// A new property added as displayable column can thus simply provide an `accessor`
// + a `unit` (typical for ranges).
const renderCellFor = (property) =>
  property.column?.renderCell ??
  ((w) => `${property.accessor(w)}${property.unit ?? ''}`);
const cellClassFor = (property) =>
  property.column?.cellClassName ?? 'px-4 py-3 text-ink-700';
const headClassFor = (property) =>
  property.column?.headClassName ?? 'px-4 py-3 font-semibold';

const ComparisonTable = ({ visibility }) => {
  const wheels = useSelector(selectFilteredWheels);
  const total = useSelector((state) => state.wheels.items.length);

  // Displayed columns: required or checked by user via ColumnSelector.
  const cols = getColumnProperties().filter(
    (p) => p.column?.required || visibility[p.id]
  );

  return (
    <div className="card overflow-hidden w-fit max-w-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100">
        <h3 className="text-base font-semibold text-ink-900">
          Wheels{' '}
          <span className="text-ink-500 font-normal">
            — {wheels.length} of {total}
          </span>
        </h3>
      </div>

      {wheels.length === 0 ? (
        <div className="p-10 text-center text-ink-500 text-sm">
          No wheels match your filters. Try resetting them.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-max text-sm">
            <thead className="bg-ink-100/60 text-ink-700">
              <tr className="text-left">
                {cols.map((p) => (
                  <th key={p.id} className={headClassFor(p)}>
                    {p.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {wheels.map((w) => (
                <tr
                  key={w.id}
                  className="hover:bg-brand-50/40 transition-colors"
                >
                  {cols.map((p) => (
                    <td key={p.id} className={cellClassFor(p)}>
                      {renderCellFor(p)(w)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ComparisonTable;
