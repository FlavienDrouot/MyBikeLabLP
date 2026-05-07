import { useSelector } from 'react-redux';
import { selectFilteredWheels } from '../../store/selectors/wheelsSelectors';
import { COLUMNS } from './columnsConfig';

const ComparisonTable = ({ visibility }) => {
  const wheels = useSelector(selectFilteredWheels);
  const total = useSelector((state) => state.wheels.items.length);

  const cols = COLUMNS.filter((c) => c.required || visibility[c.id]);

  return (
    <div className="card overflow-hidden">
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
          <table className="w-full text-sm">
            <thead className="bg-ink-100/60 text-ink-700">
              <tr className="text-left">
                {cols.map((c) => (
                  <th key={c.id} className={c.headClassName}>
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {wheels.map((w) => (
                <tr key={w.id} className="hover:bg-brand-50/40 transition-colors">
                  {cols.map((c) => (
                    <td key={c.id} className={c.cellClassName}>
                      {c.renderCell(w)}
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
