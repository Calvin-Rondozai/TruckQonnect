import type { LatLng } from 'react-native-maps';

import { apiV1Fetch } from '@/lib/api-client';

export type ShipmentLoad = {
  id: string;
  load_id: string;
  pickup_address: string;
  pickup_lat: number;
  pickup_lng: number;
  destination_address: string;
  destination_lat: number;
  destination_lng: number;
  description: string;
  weight: string;
  truck_type: string;
  budget: string;
  pickup_when: string;
  distance_km: number | null;
  status: string;
  truck_lat: number | null;
  truck_lng: number | null;
  truck_heading: number | null;
  truck_updated_at: string | null;
  created_at: string;
  updated_at: string;
  driver: string | null;
};

export type CreateLoadInput = {
  pickup_address: string;
  destination_address: string;
  pickup_lat?: number;
  pickup_lng?: number;
  destination_lat?: number;
  destination_lng?: number;
  distance_km?: number;
  description?: string;
  weight?: string;
  truck_type?: string;
  budget?: string;
  pickup_when?: string;
};

export type RouteResponse = {
  load_id: string;
  pickup: LatLng;
  destination: LatLng;
  truck: LatLng | null;
  route: {
    distance_m: number;
    duration_s: number;
    polyline: LatLng[];
    legs: { distance_m: number; duration_s: number }[];
  };
};

export function normalizeLoadId(id: string): string {
  return id.replace(/^#/, '').trim();
}

export function createShipmentLoad(payload: CreateLoadInput): Promise<ShipmentLoad> {
  return apiV1Fetch<ShipmentLoad>('/loads/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function fetchShipmentLoad(loadId: string): Promise<ShipmentLoad> {
  return apiV1Fetch<ShipmentLoad>(`/loads/${normalizeLoadId(loadId)}/`);
}

export function fetchShipmentRoute(loadId: string): Promise<RouteResponse> {
  return apiV1Fetch<RouteResponse>(`/loads/${normalizeLoadId(loadId)}/route/`);
}

export function postTruckLocation(
  loadId: string,
  lat: number,
  lng: number,
  heading?: number
): Promise<ShipmentLoad> {
  return apiV1Fetch<ShipmentLoad>(`/loads/${normalizeLoadId(loadId)}/location/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lat, lng, heading }),
  });
}

export function assignDriverToLoad(loadId: string): Promise<ShipmentLoad> {
  return apiV1Fetch<ShipmentLoad>(`/loads/${normalizeLoadId(loadId)}/assign/`, {
    method: 'POST',
  });
}

export function regionFromPoints(points: LatLng[], padding = 0.08) {
  const lats = points.map((p) => p.latitude);
  const lngs = points.map((p) => p.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max(maxLat - minLat + padding, 0.12),
    longitudeDelta: Math.max(maxLng - minLng + padding, 0.12),
  };
}
