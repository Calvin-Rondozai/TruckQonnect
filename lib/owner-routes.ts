import type { LatLng } from 'react-native-maps';

export type OwnerMapRoute = {
  pickup: LatLng;
  vehicle: LatLng;
  dropoff: LatLng;
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
};

/** Mock coordinates — Harare pickup → en route → Bulawayo dropoff */
export const DEFAULT_OWNER_ROUTE: OwnerMapRoute = {
  pickup: { latitude: -17.8252, longitude: 31.0518 },
  vehicle: { latitude: -17.893, longitude: 31.068 },
  dropoff: { latitude: -20.152, longitude: 28.581 },
  region: {
    latitude: -18.98,
    longitude: 29.82,
    latitudeDelta: 3.2,
    longitudeDelta: 3.2,
  },
};

const ROUTES_BY_LOAD: Record<string, OwnerMapRoute> = {
  'load-1': DEFAULT_OWNER_ROUTE,
  'load-2': {
    pickup: { latitude: -18.97, longitude: 32.67 },
    vehicle: { latitude: -18.5, longitude: 32.1 },
    dropoff: { latitude: -17.8252, longitude: 31.0518 },
    region: {
      latitude: -18.4,
      longitude: 31.85,
      latitudeDelta: 1.8,
      longitudeDelta: 1.8,
    },
  },
};

export function getRouteForLoad(loadId: string): OwnerMapRoute {
  return ROUTES_BY_LOAD[loadId] ?? DEFAULT_OWNER_ROUTE;
}
