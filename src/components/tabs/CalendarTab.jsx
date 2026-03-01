import { useState } from 'react';
import { RefreshCw, MapPin, Clock } from 'lucide-react';
import { demoEvents } from '../../data/demoEvents';

function getDay(dateStr) {
  return new Date(dateStr + 'T00:00:00').getDate();
}

function getMonthAbbr(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleString('en-US', { month: 'short' });
}

export function CalendarTab({ loggedEventIds, onLogTrip }) {
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);

  function handleSync() {
    setSyncing(true);
    setSynced(false);
    setTimeout(() => {
      setSyncing(false);
      setSynced(true);
    }, 1500);
  }

  return (
    <div className="panel">
      <div className="calendar-header">
        <div>
          <h2 className="panel-title">Calendar Events</h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
            Demo events — March 2026
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {synced && (
            <span style={{ fontSize: '0.78rem', color: 'var(--color-teal)', fontWeight: 600 }}>
              Calendar synced!
            </span>
          )}
          <button className="btn btn-secondary" onClick={handleSync} disabled={syncing}>
            <span className={syncing ? 'sync-spinner' : ''}>
              <RefreshCw size={14} />
            </span>
            {syncing ? 'Syncing…' : 'Sync Calendar'}
          </button>
        </div>
      </div>

      <div className="calendar-events">
        {demoEvents.map((event) => {
          const isLogged = loggedEventIds.has(event.title + '|' + event.date);
          return (
            <div key={event.id} className="event-card">
              <div className="event-date-badge">
                <span className="event-date-day">{getDay(event.date)}</span>
                <span className="event-date-month">{getMonthAbbr(event.date)}</span>
              </div>

              <div className="event-info">
                <div className="event-title">{event.title}</div>
                <div className="event-meta">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                    <MapPin size={11} /> {event.location}
                  </span>
                  <span style={{ marginLeft: 10, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                    <Clock size={11} /> {event.time} · {event.duration}
                  </span>
                </div>
              </div>

              <div className="event-actions">
                {isLogged ? (
                  <span className="mileage-badge">Logged</span>
                ) : (
                  <button className="btn btn-primary" onClick={() => onLogTrip(event)}>
                    Log Trip
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
