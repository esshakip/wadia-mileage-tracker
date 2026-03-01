import { useState, useEffect } from 'react';
import { X, MapPin } from 'lucide-react';
import { getDrivingDistanceMiles } from '../../utils/distanceCalculator';

export function LogTripModal({ event, officeLocation, onConfirm, onClose }) {
  const [distance, setDistance] = useState('');
  const [error, setError] = useState('');
  const [calcLoading, setCalcLoading] = useState(false);
  const [calcError, setCalcError] = useState('');

  useEffect(() => {
    if (!officeLocation || !event.location) return;

    let cancelled = false;
    setCalcLoading(true);
    setCalcError('');

    // Delay prevents React StrictMode's double-invoke from firing two
    // simultaneous Nominatim requests (which triggers a 429 rate-limit).
    // StrictMode cleanup clears the timer before it fires on the first pass;
    // only the second pass actually reaches the API.
    const timer = setTimeout(() => {
      getDrivingDistanceMiles(officeLocation, event.location)
        .then((miles) => {
          if (cancelled) return;
          setDistance(String(miles));
          setCalcLoading(false);
        })
        .catch(() => {
          if (cancelled) return;
          setCalcError('Could not calculate distance. Enter manually.');
          setCalcLoading(false);
        });
    }, 300);

    return () => { cancelled = true; clearTimeout(timer); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleConfirm() {
    const val = parseFloat(distance);
    if (!distance || isNaN(val) || val <= 0) {
      setError('Enter a valid distance greater than 0.');
      return;
    }
    onConfirm(val);
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose} onKeyDown={handleKeyDown}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Log Trip</span>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-info-row">
            <span className="modal-info-label">Event</span>
            <span className="modal-info-value" style={{ fontWeight: 600 }}>{event.title}</span>
          </div>

          <div className="modal-info-row">
            <span className="modal-info-label">
              <MapPin size={11} style={{ display: 'inline', marginRight: 3 }} />
              From
            </span>
            <span className="modal-info-value">{officeLocation}</span>
          </div>

          <div className="modal-info-row">
            <span className="modal-info-label">
              <MapPin size={11} style={{ display: 'inline', marginRight: 3 }} />
              To
            </span>
            <span className="modal-info-value">{event.location}</span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="log-distance">
              Distance (miles)
            </label>
            <input
              id="log-distance"
              type="number"
              min="0.1"
              step="0.1"
              className={`form-input ${error ? 'error' : ''}`}
              placeholder={calcLoading ? 'Calculating…' : 'e.g. 14.2'}
              value={distance}
              disabled={calcLoading}
              onChange={(e) => {
                setDistance(e.target.value);
                if (error) setError('');
              }}
              autoFocus={!calcLoading}
            />
            {calcLoading && <span className="calc-status-hint">Calculating driving distance…</span>}
            {calcError && <span className="form-error">{calcError}</span>}
            {error && <span className="form-error">{error}</span>}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleConfirm} disabled={calcLoading}>
            Log Trip
          </button>
        </div>
      </div>
    </div>
  );
}
