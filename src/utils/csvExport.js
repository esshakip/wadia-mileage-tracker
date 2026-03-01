import { formatDate } from './calculations';

function escapeField(value) {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

export function exportTripsToCSV(trips) {
  const headers = ['Date', 'Start', 'End', 'Distance (mi)', 'Purpose', 'Type', 'Deduction ($)'];
  const rows = trips.map((t) => [
    formatDate(t.date),
    t.start,
    t.end,
    t.distance,
    t.purpose,
    t.type,
    t.deduction,
  ]);

  const csvContent =
    [headers, ...rows].map((row) => row.map(escapeField).join(',')).join('\r\n') + '\r\n';

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const today = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `mileage_${today}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
