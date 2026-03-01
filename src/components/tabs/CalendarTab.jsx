import { useState, useEffect } from 'react';
import { RefreshCw, MapPin, Clock, Calendar } from 'lucide-react';
import { fetchCalendarEvents, initTokenClient } from '../../utils/googleCalendar';

function getDay(dateStr) {
  return new Date(dateStr + 'T00:00:00').getDate();
}

function getMonthAbbr(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleString('en-US', { month: 'short' });
}

export function CalendarTab({ loggedEventIds, onLogTrip, gcalToken, gcalClientId, onGcalConnect }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (!gcalToken) return;
    loadEvents(gcalToken);
  }, [gcalToken]);

  async function loadEvents(token) {
    setLoading(true);
    setError('');
    try {
      const evts = await fetchCalendarEvents(token);
      setEvents(evts);
    } catch (e) {
      if (e.message === 'AUTH_EXPIRED') {
        setError('Session expired. Go to Settings and reconnect Google Calendar.');
      } else {
        setError('Failed to load calendar events. Try refreshing.');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleConnect() {
    setError('');
    setConnecting(true);
    const client = initTokenClient(
      gcalClientId,
      (token) => {
        onGcalConnect(token);
        setConnecting(false);
      },
      (err) => {
        setError(err);
        setConnecting(false);
      }
    );
    if (client) client.requestAccessToken();
  }

  // ── Not connected ──
  if (!gcalToken) {
    return (
      <div className="panel">
        <div className="calendar-header">
          <div>
            <h2 className="panel-title">Calendar Events</h2>
          </div>
        </div>
        <div className="calendar-empty">
          <Calendar size={40} />
          {gcalClientId ? (
            <>
              <p>Connect your Google Calendar to automatically see meetings with a location.</p>
              <button className="btn btn-primary" onClick={handleConnect} disabled={connecting}>
                <Calendar size={14} />
                {connecting ? 'Connecting…' : 'Connect Google Calendar'}
              </button>
              {error && <span className="form-error">{error}</span>}
            </>
          ) : (
            <p>Add your Google OAuth Client ID in <strong>Settings</strong> to connect your calendar.</p>
          )}
        </div>
      </div>
    );
  }

  // ── Connected ──
  return (
    <div className="panel">
      <div className="calendar-header">
        <div>
          <h2 className="panel-title">Calendar Events</h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
            {loading
              ? 'Loading…'
              : events.length > 0
              ? `${events.length} upcoming event${events.length !== 1 ? 's' : ''} with a location`
              : 'No upcoming events with a location'}
          </p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => loadEvents(gcalToken)}
          disabled={loading}
        >
          <span className={loading ? 'sync-spinner' : ''}>
            <RefreshCw size={14} />
          </span>
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      {error && <div className="calendar-error">{error}</div>}

      {!loading && !error && events.length === 0 && (
        <div className="calendar-empty">
          <Calendar size={40} />
          <p>No upcoming events with a location found in the next 60 days.</p>
        </div>
      )}

      <div className="calendar-events">
        {events.map((event) => {
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
                  {event.time && (
                    <span style={{ marginLeft: 10, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      <Clock size={11} /> {event.time}{event.duration ? ` · ${event.duration}` : ''}
                    </span>
                  )}
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
