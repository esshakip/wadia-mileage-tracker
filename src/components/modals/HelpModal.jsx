import { X, Car, FileText, Calendar, Settings } from 'lucide-react';

export function HelpModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal help-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Help &amp; Guide</span>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <div className="help-section">
            <div className="help-section-title">
              <Car size={15} />
              IRS Standard Mileage Rate
            </div>
            <p>
              The IRS standard mileage rate for <span className="help-highlight">2026</span> is{' '}
              <span className="help-highlight">$0.70 per mile</span> for business travel.
              This rate is used to calculate your estimated tax deduction. Verify the current
              rate at <strong>irs.gov</strong> before filing your taxes.
            </p>
          </div>

          <div className="help-section">
            <div className="help-section-title">
              <FileText size={15} />
              Logging Trips
            </div>
            <ul>
              <li>Use the <strong>Add Trip</strong> tab to manually enter any business trip.</li>
              <li>Use the <strong>Calendar</strong> tab to log trips from your calendar events.</li>
              <li>All trips are saved automatically in your browser (localStorage).</li>
              <li>Trips are never sent to any server — your data stays on your device.</li>
            </ul>
          </div>

          <div className="help-section">
            <div className="help-section-title">
              <Calendar size={15} />
              Calendar Sync
            </div>
            <p>
              The calendar tab shows demo events for illustration. Click{' '}
              <strong>Log Trip</strong> on any event to enter the mileage and add it to your
              trip log. Logged events display a <strong>Logged</strong> badge.
            </p>
          </div>

          <div className="help-section">
            <div className="help-section-title">
              <Settings size={15} />
              Settings
            </div>
            <ul>
              <li>Set your <strong>office / start location</strong> to pre-fill the start address when adding trips.</li>
              <li>Update the <strong>mileage rate</strong> if the IRS rate changes — all deductions will recalculate automatically.</li>
            </ul>
          </div>

          <div className="help-section">
            <div className="help-section-title">
              <FileText size={15} />
              Exporting Data
            </div>
            <p>
              Click <strong>Export CSV</strong> in the Trip Log tab to download your trips as a
              spreadsheet. The CSV is Excel-compatible and includes all trip details and deductions.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
