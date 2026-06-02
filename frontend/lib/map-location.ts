import * as Location from 'expo-location';

const NOMINATIM_SEARCH = 'https://nominatim.openstreetmap.org/search';

export type MapLocation = {
  latitude: number;
  longitude: number;
  address: string;
};

export type PlaceSearchResult = {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
};

/** Search places by name/address (Nominatim / OpenStreetMap). */
export async function searchPlaces(query: string): Promise<PlaceSearchResult[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const params = new URLSearchParams({
    q,
    format: 'json',
    limit: '6',
    addressdetails: '1',
    countrycodes: 'zw',
  });

  try {
    const res = await fetch(`${NOMINATIM_SEARCH}?${params.toString()}`, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'TruckQonnect/1.0 (mobile logistics app)',
      },
    });
    if (!res.ok) return [];

    const rows = (await res.json()) as {
      place_id: number;
      lat: string;
      lon: string;
      display_name: string;
    }[];

    return rows.map((row) => ({
      id: String(row.place_id),
      label: row.display_name,
      latitude: parseFloat(row.lat),
      longitude: parseFloat(row.lon),
    }));
  } catch {
    return [];
  }
}

/** Fallback when Nominatim returns nothing — device geocoder. */
export async function searchPlacesLocal(query: string): Promise<PlaceSearchResult[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  try {
    const rows = await Location.geocodeAsync(q);
    return rows.slice(0, 5).map((row, i) => {
      const parts = [row.name, row.street, row.city, row.region, row.country].filter(Boolean);
      return {
        id: `local-${i}`,
        label: parts.join(', ') || q,
        latitude: row.latitude,
        longitude: row.longitude,
      };
    });
  } catch {
    return [];
  }
}

export async function searchPlacesWithFallback(query: string): Promise<PlaceSearchResult[]> {
  const primary = await searchPlaces(query);
  if (primary.length > 0) return primary;
  return searchPlacesLocal(query);
}

export async function reverseGeocode(latitude: number, longitude: number): Promise<string> {
  try {
    const rows = await Location.reverseGeocodeAsync({ latitude, longitude });
    const row = rows[0];
    if (!row) {
      return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
    }
    const parts = [row.name, row.street, row.city, row.region, row.country].filter(Boolean);
    return parts.join(', ') || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
  } catch {
    return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
  }
}
