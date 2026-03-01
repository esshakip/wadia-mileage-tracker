/**
 * Initialises a Google Identity Services token client and returns it.
 * Call client.requestAccessToken() to open the OAuth popup.
 */
export function initTokenClient(clientId, onToken, onError) {
  if (!window.google?.accounts?.oauth2) {
    onError('Google Identity Services not loaded. Please refresh the page and try again.');
    return null;
  }
  const client = window.google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: 'https://www.googleapis.com/auth/calendar.readonly',
    callback: (response) => {
      if (response.error) {
        onError('Authorization failed: ' + response.error);
        return;
      }
      onToken(response.access_token);
    },
  });
  return client;
}

/**
 * Fetches upcoming events from the user's primary Google Calendar.
 * Only returns events that have both a summary (title) and a location.
 * Throws 'AUTH_EXPIRED' error if the token is no longer valid.
 */
export async function fetchCalendarEvents(accessToken) {
  const now = new Date().toISOString();
  const sixtyDaysLater = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();

  const params = new URLSearchParams({
    timeMin: now,
    timeMax: sixtyDaysLater,
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: '100',
  });

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) {
    if (res.status === 401) throw new Error('AUTH_EXPIRED');
    throw new Error(`Calendar API error (${res.status})`);
  }

  const data = await res.json();
  return (data.items || [])
    .filter((e) => e.summary && e.location)
    .map(normalizeEvent);
}

function normalizeEvent(e) {
  const isAllDay = Boolean(e.start.date);
  const startStr = isAllDay ? e.start.date : e.start.dateTime;
  const date = startStr.slice(0, 10);

  let time = '';
  let duration = '';

  if (!isAllDay && e.start.dateTime && e.end.dateTime) {
    const start = new Date(e.start.dateTime);
    const end = new Date(e.end.dateTime);
    time = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    const mins = Math.round((end - start) / 60000);
    if (mins < 60) {
      duration = `${mins} min`;
    } else {
      const hours = mins / 60;
      duration = `${Number.isInteger(hours) ? hours : hours.toFixed(1)} hr`;
    }
  }

  return { id: e.id, title: e.summary, location: e.location, date, time, duration };
}
