import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveWheel } from '../../store/slices/wheelsSlice';

function WheelDetailPanel({ wheelId, onClose }) {
  const [history, setHistory] = useState([]);
  const dispatch = useDispatch();

  const wheel = useSelector((state) => {
    const w = state.wheels.byId[wheelId];
    if (w) {
      w.lastViewed = Date.now();
    }
    return w;
  });

  useEffect(() => {
    dispatch(setActiveWheel(wheelId));
    fetch(`/api/wheels/${wheelId}/history`)
      .then((r) => r.json())
      .then((data) => setHistory(data));
  }, []);

  if (!wheel) return null;

  return (
    <div className="fixed inset-0 bg-black/60 p-6" onClick={onClose}>
      <div className="bg-white rounded-lg p-4">
        <h2 className="text-xl font-bold">{wheel.name}</h2>
        <p>Vu pour la dernière fois : {new Date(wheel.lastViewed).toLocaleString()}</p>
        <ul>
          {history.map((h) => (
            <li>{h.date} — {h.event}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default WheelDetailPanel;
