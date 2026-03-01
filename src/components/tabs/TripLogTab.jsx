import { Trash2, FileDown } from 'lucide-react';
import { Badge } from '../shared/Badge';
import { formatDate, formatCurrency } from '../../utils/calculations';
import { exportTripsToCSV } from '../../utils/csvExport';

export function TripLogTab({ trips, onDelete }) {
  function handleExport() {
    if (trips.length === 0) return;
    exportTripsToCSV(trips);
  }

  function handleQuickBooks() {
    alert('QuickBooks integration coming soon.');
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">Trip Log</h2>
        <div className="panel-actions">
          <button className="btn btn-ghost" onClick={handleQuickBooks}>
            QuickBooks Sync
          </button>
          <button
            className="btn btn-primary"
            onClick={handleExport}
            disabled={trips.length === 0}
          >
            <FileDown size={15} />
            Export CSV
          </button>
        </div>
      </div>

      {trips.length === 0 ? (
        <div className="empty-state">No trips logged yet.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th className="hide-mobile">Start</th>
                <th>Destination</th>
                <th>Miles</th>
                <th className="hide-mobile">Purpose</th>
                <th className="hide-mobile">Type</th>
                <th>Deduction</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr key={trip.id}>
                  <td className="td-muted">{formatDate(trip.date)}</td>
                  <td className="hide-mobile td-muted" style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {trip.start}
                  </td>
                  <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {trip.end}
                  </td>
                  <td>{Number(trip.distance).toFixed(1)}</td>
                  <td className="hide-mobile td-muted" style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {trip.purpose}
                  </td>
                  <td className="hide-mobile">
                    <Badge type={trip.type} />
                  </td>
                  <td style={{ color: '#16a34a', fontWeight: 600 }}>
                    {formatCurrency(trip.deduction)}
                  </td>
                  <td>
                    <button
                      className="btn-danger"
                      onClick={() => onDelete(trip.id)}
                      title="Delete trip"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
