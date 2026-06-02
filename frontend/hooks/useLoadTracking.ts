import { useCallback, useEffect, useRef, useState } from 'react';
import type { LatLng } from 'react-native-maps';

import {
  fetchShipmentLoad,
  fetchShipmentRoute,
  regionFromPoints,
  type RouteResponse,
  type ShipmentLoad,
} from '@/lib/loads-api';
import { openLoadTrackingSocket, type LocationMessage } from '@/lib/tracking-websocket';

type State = {
  load: ShipmentLoad | null;
  route: RouteResponse | null;
  truck: LatLng | null;
  region: ReturnType<typeof regionFromPoints> | null;
  loading: boolean;
  error: string | null;
};

export function useLoadTracking(loadId: string | null | undefined, subscribeLive = true) {
  const enabled = Boolean(loadId?.trim());

  const [state, setState] = useState<State>({
    load: null,
    route: null,
    truck: null,
    region: null,
    loading: true,
    error: null,
  });
  const wsRef = useRef<WebSocket | null>(null);

  const applyTruck = useCallback((lat: number, lng: number) => {
    setState((prev) => {
      const truck = { latitude: lat, longitude: lng };
      const points: LatLng[] = [];
      if (prev.route) {
        points.push(truck, prev.route.pickup, prev.route.destination);
      }
      return {
        ...prev,
        truck,
        region: points.length ? regionFromPoints(points) : prev.region,
      };
    });
  }, []);

  const refresh = useCallback(async () => {
    if (!enabled || !loadId) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const [load, routeRes] = await Promise.all([
        fetchShipmentLoad(loadId),
        fetchShipmentRoute(loadId),
      ]);

      const truck =
        routeRes.truck ??
        (load.truck_lat != null && load.truck_lng != null
          ? { latitude: load.truck_lat, longitude: load.truck_lng }
          : null);

      const points: LatLng[] = [routeRes.pickup, routeRes.destination];
      if (truck) points.unshift(truck);

      setState({
        load,
        route: routeRes,
        truck,
        region: regionFromPoints(points),
        loading: false,
        error: null,
      });
    } catch (e) {
      setState((s) => ({
        ...s,
        loading: false,
        error: e instanceof Error ? e.message : 'Could not load tracking.',
      }));
    }
  }, [loadId, enabled]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!enabled || !subscribeLive || !loadId) return;

    const ws = openLoadTrackingSocket(loadId, (msg: LocationMessage) => {
      applyTruck(msg.lat, msg.lng);
    });
    wsRef.current = ws;

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [loadId, subscribeLive, applyTruck]);

  return {
    ...state,
    refresh,
    ws: wsRef,
    applyTruck,
  };
}
