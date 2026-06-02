import * as Location from 'expo-location';
import { useEffect, useRef } from 'react';

import { assignDriverToLoad, postTruckLocation } from '@/lib/loads-api';
import { openLoadTrackingSocket, sendLocationUpdate } from '@/lib/tracking-websocket';

/**
 * Streams driver GPS to the backend (WebSocket + REST fallback) for a load.
 */
export function useDriverLocationBroadcast(loadId: string | null, enabled: boolean) {
  const wsRef = useRef<WebSocket | null>(null);
  const lastRestRef = useRef(0);

  useEffect(() => {
    if (!enabled || !loadId) return;

    let subscription: Location.LocationSubscription | null = null;
    let cancelled = false;

    void (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted' || cancelled) return;

        await assignDriverToLoad(loadId).catch(() => undefined);

        const ws = openLoadTrackingSocket(loadId, () => undefined);
        wsRef.current = ws;

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: 25,
            timeInterval: 8000,
          },
          (position) => {
            const { latitude, longitude, heading } = position.coords;
            sendLocationUpdate(ws, latitude, longitude, heading ?? undefined);

            const now = Date.now();
            if (now - lastRestRef.current > 15000) {
              lastRestRef.current = now;
              void postTruckLocation(loadId, latitude, longitude, heading ?? undefined).catch(
                () => undefined
              );
            }
          }
        );
      } catch {
        /* location unavailable */
      }
    })();

    return () => {
      cancelled = true;
      subscription?.remove();
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [loadId, enabled]);
}
