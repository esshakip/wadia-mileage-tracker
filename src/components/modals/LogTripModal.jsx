import { useState } from 'react';
import { X, MapPin } from 'lucide-react';

export function LogTripModal({ event, officeLocation, onConfirm, onClose }) {
  const [distance, setDistance] = useState('');
  const [error, setError] = useState('');

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
              placeholder="e.g. 14.2"
              value={distance}
              onChange={(e) => {
                setDistance(e.target.value);
                if (error) setError('');
              }}
              autoFocus
            />
            {error && <span className="form-error">{error}</span>}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleConfirm}>
            Log Trip
          </button>
        </div>
      </div>
    </div>
  );
}
