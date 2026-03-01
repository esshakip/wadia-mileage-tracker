const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const OSRM_URL = 'https://router.project-osrm.org/route/v1/driving';
const USER_AGENT = 'wadia-mileage-tracker/1.0';

export async function geocodeAddress(address) {
  const url = `${NOMINATIM_URL}?q=${encodeURIComponent(address)}&format=json&limit=1`;
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error(`Geocoding request failed (${res.status})`);
  const data = await res.json();
  if (!data || data.length === 0) throw new Error(`No results found for address: "${address}"`);
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
}

export async function getDrivingDistanceMiles(startAddress, endAddress) {
  const [start, end] = await Promise.all([
    geocodeAddress(startAddress),
    geocodeAddress(endAddress),
  ]);

  const url = `${OSRM_URL}/${start.lon},${start.lat};${end.lon},${end.lat}?overview=false`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Routing request failed (${res.status})`);
  const data = await res.json();
  if (!data.routes || data.routes.length === 0) throw new Error('No route found between the two addresses.');

  const meters = data.routes[0].distance;
  return Math.round((meters / 1609.344) * 10) / 10;
}
