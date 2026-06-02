import { wsBaseUrl } from '@/lib/api-config';
import { normalizeLoadId } from '@/lib/loads-api';

export type LocationMessage = {
  type: 'location';
  load_id: string;
  lat: number;
  lng: number;
  heading?: number | null;
  status?: string;
};

export function openLoadTrackingSocket(
  loadId: string,
  onMessage: (msg: LocationMessage) => void,
  onError?: (err: Event) => void
): WebSocket {
  const id = normalizeLoadId(loadId);
  const ws = new WebSocket(`${wsBaseUrl()}/ws/tracking/${id}/`);

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(String(event.data)) as LocationMessage;
      if (data.type === 'location') {
        onMessage(data);
      }
    } catch {
      /* ignore malformed */
    }
  };

  ws.onerror = (e) => onError?.(e);

  return ws;
}

export function sendLocationUpdate(
  ws: WebSocket,
  lat: number,
  lng: number,
  heading?: number
): void {
  if (ws.readyState !== WebSocket.OPEN) return;
  ws.send(JSON.stringify({ type: 'location', lat, lng, heading }));
}
