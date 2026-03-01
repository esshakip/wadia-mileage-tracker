import { useState, useEffect, useRef } from 'react';
import { PlusCircle } from 'lucide-react';
import { getDrivingDistanceMiles } from '../../utils/distanceCalculator';

const TODAY = new Date().toISOString().slice(0, 10);

function initialForm(officeLocation) {
  return {
    date: TODAY,
    start: officeLocation,
    end: '',
    distance: '',
    purpose: '',
  };
}

export function ManualTab({ officeLocation, onAddTrip }) {
  const [form, setForm] = useState(() => initialForm(officeLocation));
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [calcLoading, setCalcLoading] = useState(false);
  const [calcError, setCalcError] = useState('');
  const debounceTimer = useRef(null);

  useEffect(() => {
    clearTimeout(debounceTimer.current);

    if (!form.start.trim() || !form.end.trim()) {
      setCalcLoading(false);
      setCalcError('');
      return;
    }

    setCalcLoading(true);
    setCalcError('');

    debounceTimer.current = setTimeout(() => {
      getDrivingDistanceMiles(form.start, form.end)
        .then((miles) => {
          setForm((f) => ({ ...f, distance: String(miles) }));
          setCalcLoading(false);
        })
        .catch(() => {
          setCalcError('Could not calculate distance. Enter manually.');
          setCalcLoading(false);
        });
    }, 800);

    return () => clearTimeout(debounceTimer.current);
  }, [form.start, form.end]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }));
    if (name === 'distance' && calcError) setCalcError('');
  }

  function validate() {
    const errs = {};
    if (!form.start.trim()) errs.start = 'Start location is required.';
    if (!form.end.trim()) errs.end = 'Destination is required.';
    if (!form.distance || isNaN(form.distance) || Number(form.distance) <= 0)
      errs.distance = 'Distance must be a positive number.';
    if (!form.purpose.trim()) errs.purpose = 'Purpose is required.';
    if (!form.date) errs.date = 'Date is required.';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onAddTrip({
      date: form.date,
      start: form.start.trim(),
      end: form.end.trim(),
      distance: parseFloat(form.distance),
      purpose: form.purpose.trim(),
      type: 'manual',
    });
    setForm(initialForm(officeLocation));
    setErrors({});
    setCalcError('');
    setCalcLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Log a Manual Trip</h2>
      </div>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="date">Date</label>
            <input
              id="date"
              name="date"
              type="date"
              className={`form-input ${errors.date ? 'error' : ''}`}
              value={form.date}
              onChange={handleChange}
            />
            {errors.date && <span className="form-error">{errors.date}</span>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="distance">Distance (miles)</label>
            <input
              id="distance"
              name="distance"
              type="number"
              min="0.1"
              step="0.1"
              className={`form-input ${errors.distance ? 'error' : ''}`}
              placeholder={calcLoading ? 'Calculating…' : 'e.g. 12.5'}
              value={form.distance}
              disabled={calcLoading}
              onChange={handleChange}
            />
            {calcLoading && <span className="calc-status-hint">Calculating driving distance…</span>}
            {calcError && <span className="form-error">{calcError}</span>}
            {errors.distance && <span className="form-error">{errors.distance}</span>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="start">Start Location</label>
          <input
            id="start"
            name="start"
            type="text"
            className={`form-input ${errors.start ? 'error' : ''}`}
            placeholder="Start address"
            value={form.start}
            onChange={handleChange}
          />
          {errors.start && <span className="form-error">{errors.start}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="end">Destination</label>
          <input
            id="end"
            name="end"
            type="text"
            className={`form-input ${errors.end ? 'error' : ''}`}
            placeholder="Destination address"
            value={form.end}
            onChange={handleChange}
          />
          {errors.end && <span className="form-error">{errors.end}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="purpose">Purpose</label>
          <input
            id="purpose"
            name="purpose"
            type="text"
            className={`form-input ${errors.purpose ? 'error' : ''}`}
            placeholder="e.g. Client meeting, site visit…"
            value={form.purpose}
            onChange={handleChange}
          />
          {errors.purpose && <span className="form-error">{errors.purpose}</span>}
        </div>

        <div className="form-footer">
          {success && (
            <span style={{ color: '#16a34a', fontSize: '0.85rem', alignSelf: 'center' }}>
              Trip added!
            </span>
          )}
          <button type="submit" className="btn btn-primary">
            <PlusCircle size={15} />
            Add Trip
          </button>
        </div>
      </form>
    </div>
  );
}
