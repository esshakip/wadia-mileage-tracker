export function formatMiles(miles) {
  return Number(miles).toFixed(1);
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function computeDeduction(distance, rate) {
  return parseFloat((distance * rate).toFixed(2));
}

export function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function getCurrentYear() {
  return new Date().getFullYear();
}

export function getCurrentMonth() {
  const now = new Date();
  return { month: now.getMonth(), year: now.getFullYear() };
}

export function filterCurrentYear(trips) {
  const year = getCurrentYear();
  return trips.filter((t) => {
    const d = new Date(t.date + 'T00:00:00');
    return d.getFullYear() === year;
  });
}

export function filterCurrentMonth(trips) {
  const { month, year } = getCurrentMonth();
  return trips.filter((t) => {
    const d = new Date(t.date + 'T00:00:00');
    return d.getMonth() === month && d.getFullYear() === year;
  });
}
