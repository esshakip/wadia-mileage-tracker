import { useState } from 'react';
import { PlusCircle } from 'lucide-react';

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

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }));
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
              placeholder="e.g. 12.5"
              value={form.distance}
              onChange={handleChange}
            />
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
