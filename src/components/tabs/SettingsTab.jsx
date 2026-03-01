import { useState } from 'react';
import { Save, Calendar, CheckCircle2, Unlink } from 'lucide-react';
import { initTokenClient } from '../../utils/googleCalendar';

export function SettingsTab({ settings, onSave, gcalToken, onGcalConnect, onGcalDisconnect }) {
  const [form, setForm] = useState({
    officeLocation: settings.officeLocation,
    mileageRate: settings.mileageRate,
    gcalClientId: settings.gcalClientId || '',
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [gcalError, setGcalError] = useState('');
  const [connecting, setConnecting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.officeLocation.trim()) errs.officeLocation = 'Office location is required.';
    const rate = parseFloat(form.mileageRate);
    if (isNaN(rate) || rate <= 0 || rate > 5)
      errs.mileageRate = 'Enter a valid rate between $0.01 and $5.00.';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSave({
      officeLocation: form.officeLocation.trim(),
      mileageRate: parseFloat(parseFloat(form.mileageRate).toFixed(4)),
      gcalClientId: form.gcalClientId.trim(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleConnect() {
    setGcalError('');
    if (!form.gcalClientId.trim()) {
      setGcalError('Enter your Client ID and save Settings first.');
      return;
    }
    setConnecting(true);
    const client = initTokenClient(
      form.gcalClientId.trim(),
      (token) => {
        onGcalConnect(token);
        setConnecting(false);
      },
      (err) => {
        setGcalError(err);
        setConnecting(false);
      }
    );
    if (client) client.requestAccessToken();
  }

  function handleDisconnect() {
    onGcalDisconnect();
    setGcalError('');
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Settings</h2>
      </div>
      <div className="settings-section">
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="officeLocation">
                Office / Start Location
              </label>
              <input
                id="officeLocation"
                name="officeLocation"
                type="text"
                className={`form-input ${errors.officeLocation ? 'error' : ''}`}
                value={form.officeLocation}
                onChange={handleChange}
                placeholder="123 Office Plaza, San Francisco, CA"
              />
              {errors.officeLocation && (
                <span className="form-error">{errors.officeLocation}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="mileageRate">
                IRS Mileage Rate ($ per mile)
              </label>
              <input
                id="mileageRate"
                name="mileageRate"
                type="number"
                min="0.01"
                max="5"
                step="0.001"
                className={`form-input ${errors.mileageRate ? 'error' : ''}`}
                value={form.mileageRate}
                onChange={handleChange}
              />
              {errors.mileageRate && (
                <span className="form-error">{errors.mileageRate}</span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button type="submit" className="btn btn-primary">
                <Save size={15} />
                Save Settings
              </button>
              {saved && (
                <span style={{ color: '#16a34a', fontSize: '0.85rem', fontWeight: 500 }}>
                  Settings saved!
                </span>
              )}
            </div>
          </div>
        </form>

        <div className="settings-info">
          <strong>Note:</strong> The IRS standard mileage rate for 2026 is <strong>$0.70/mile</strong> for
          business travel. Changing the rate will recalculate deductions for all existing trips.
          Always verify the current rate at <strong>irs.gov</strong> before filing.
        </div>

        {/* ── Google Calendar ── */}
        <div className="gcal-section">
          <div className="gcal-section-title">
            <Calendar size={15} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
            Google Calendar
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="gcalClientId">
              OAuth Client ID
            </label>
            <input
              id="gcalClientId"
              name="gcalClientId"
              type="text"
              className="form-input"
              value={form.gcalClientId}
              onChange={handleChange}
              placeholder="xxxxxx.apps.googleusercontent.com"
              spellCheck={false}
            />
            <span className="calc-status-hint">
              From Google Cloud Console → APIs &amp; Services → Credentials
            </span>
          </div>

          <div className="gcal-status-row">
            {gcalToken ? (
              <>
                <span className="gcal-status-connected">
                  <CheckCircle2 size={14} />
                  Connected
                </span>
                <button className="btn btn-secondary" onClick={handleDisconnect}>
                  <Unlink size={13} />
                  Disconnect
                </button>
              </>
            ) : (
              <button
                className="btn btn-primary"
                onClick={handleConnect}
                disabled={connecting}
              >
                <Calendar size={14} />
                {connecting ? 'Connecting…' : 'Connect Google Calendar'}
              </button>
            )}
          </div>
          {gcalError && <span className="form-error" style={{ display: 'block', marginTop: 8 }}>{gcalError}</span>}
        </div>
      </div>
    </div>
  );
}
