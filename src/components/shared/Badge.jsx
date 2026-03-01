import { Calendar, PenLine } from 'lucide-react';

export function Badge({ type }) {
  if (type === 'calendar') {
    return (
      <span className="badge badge-calendar">
        <Calendar size={10} />
        calendar
      </span>
    );
  }
  return (
    <span className="badge badge-manual">
      <PenLine size={10} />
      manual
    </span>
  );
}
