export interface VenuePlaceSuggestion {
  address: string;
  latitude: number;
  longitude: number;
}

type PhotonFeature = {
  geometry?: { coordinates?: number[] };
  properties?: Record<string, unknown>;
};

function asText(properties: Record<string, unknown>, key: string): string {
  const value = properties[key];
  return typeof value === 'string' ? value.trim() : '';
}

function formatAddress(properties: Record<string, unknown>): string {
  const parts = [
    asText(properties, 'name'),
    [asText(properties, 'housenumber'), asText(properties, 'street')].filter(Boolean).join(' '),
    asText(properties, 'neighbourhood'),
    asText(properties, 'suburb'),
    asText(properties, 'locality'),
    asText(properties, 'city') || asText(properties, 'town') || asText(properties, 'village'),
    asText(properties, 'district') || asText(properties, 'county'),
    asText(properties, 'state'),
    asText(properties, 'postcode'),
    asText(properties, 'country'),
  ];
  const unique: string[] = [];
  for (const part of parts) {
    const normalized = part.toLocaleLowerCase();
    if (part && !unique.some((existing) => existing.toLocaleLowerCase() === normalized)) unique.push(part);
  }
  return unique.join(', ');
}

export async function searchVenuePlaces(query: string, signal?: AbortSignal): Promise<VenuePlaceSuggestion[]> {
  const term = query.trim();
  if (term.length < 3) return [];

  const url = new URL('https://photon.komoot.io/api/');
  url.searchParams.set('q', term);
  url.searchParams.set('limit', '8');
  url.searchParams.set('lang', 'en');
  // India bias matches the primary audience while still returning global results.
  url.searchParams.set('lat', '22.5');
  url.searchParams.set('lon', '79');
  url.searchParams.set('zoom', '5');

  const response = await fetch(url.toString(), { headers: { Accept: 'application/json' }, signal });
  if (!response.ok) throw new Error('Address search is temporarily unavailable. You can still paste a Google Maps link.');
  const payload = await response.json() as { features?: PhotonFeature[] };
  return (payload.features || []).flatMap((feature) => {
    const [longitude, latitude] = feature.geometry?.coordinates || [];
    const properties = feature.properties || {};
    const address = formatAddress(properties);
    if (!address || !Number.isFinite(latitude) || !Number.isFinite(longitude)) return [];
    return [{ address, latitude: latitude as number, longitude: longitude as number }];
  }).filter((place, index, places) => places.findIndex((candidate) =>
    candidate.address.toLocaleLowerCase() === place.address.toLocaleLowerCase(),
  ) === index);
}

export function makeGoogleMapsTarget(place: VenuePlaceSuggestion): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.latitude},${place.longitude}`)}`;
}

