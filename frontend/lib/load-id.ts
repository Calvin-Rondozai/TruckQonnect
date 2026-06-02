import { normalizeLoadId } from '@/lib/loads-api';

/** True when the id is a backend shipment reference (e.g. TQ123456). */
export function isShipmentLoadId(id: string | null | undefined): boolean {
  if (!id) return false;
  return /^TQ\d+/i.test(normalizeLoadId(id));
}
