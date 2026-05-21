import type { DriverProfile, LoadRequest, ShipmentTrack } from '@/lib/types';

export const DRIVERS: Record<string, DriverProfile> = {
  guy: {
    id: 'guy',
    name: 'Guy Hawkins',
    role: 'Delivery partner',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 4.9,
    trips: 312,
    truckType: '30-ton flatbed',
    plateNumber: 'AGZ 4521',
    yearsActive: 6,
    phone: '+263771234567',
    verified: true,
  },
  tinashe: {
    id: 'tinashe',
    name: 'Tinashe Moyo',
    role: 'Long-haul driver',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    rating: 4.7,
    trips: 189,
    truckType: '15-ton tautliner',
    plateNumber: 'BUL 9083',
    yearsActive: 4,
    phone: '+263772345678',
    verified: true,
  },
  grace: {
    id: 'grace',
    name: 'Grace Ndlovu',
    role: 'Regional hauler',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
    rating: 4.8,
    trips: 241,
    truckType: '20-ton refrigerated',
    plateNumber: 'MUT 2210',
    yearsActive: 5,
    phone: '+263773456789',
    verified: true,
  },
};

export const SHIPMENTS: ShipmentTrack[] = [
  {
    id: 'a',
    code: '#H62J568107',
    from: 'Harare CBD',
    to: 'Chitungwiza',
    eta: 'Today · 14:20',
    progress: 0.62,
    driverId: 'guy',
  },
  {
    id: 'b',
    code: '#K91M220441',
    from: 'Bulawayo',
    to: 'Gwanda',
    eta: 'Tomorrow · 09:00',
    progress: 0.28,
    driverId: 'tinashe',
  },
  {
    id: 'c',
    code: '#M77P003812',
    from: 'Mutare',
    to: 'Rusape',
    eta: 'May 21 · 11:40',
    progress: 0.08,
    driverId: 'grace',
  },
];

export const INITIAL_REQUESTS: LoadRequest[] = [
  {
    id: 'r1',
    driverName: 'Tinashe Moyo',
    driverAvatar: DRIVERS.tinashe.avatar,
    truckType: '15-ton tautliner',
    route: 'Harare → Bulawayo',
    loadSummary: '12 pallets · industrial parts',
    offeredPrice: 'USD 480',
    eta: 'Pickup today · 16:00',
    rating: 4.7,
  },
  {
    id: 'r2',
    driverName: 'Grace Ndlovu',
    driverAvatar: DRIVERS.grace.avatar,
    truckType: '20-ton refrigerated',
    route: 'Harare → Mutare',
    loadSummary: '8 crates · perishables',
    offeredPrice: 'USD 390',
    eta: 'Pickup tomorrow · 08:30',
    rating: 4.8,
  },
  {
    id: 'r3',
    driverName: 'Guy Hawkins',
    driverAvatar: DRIVERS.guy.avatar,
    truckType: '30-ton flatbed',
    route: 'Chitungwiza → Kadoma',
    loadSummary: 'Bulk cement · 18 tonnes',
    offeredPrice: 'USD 310',
    eta: 'Pickup May 21 · 07:00',
    rating: 4.9,
  },
];

export function getDriverForShipment(codeOrId: string): DriverProfile | null {
  const normalized = codeOrId.replace('#', '').toUpperCase();
  const shipment = SHIPMENTS.find(
    (s) => s.id === codeOrId || s.code.replace('#', '').toUpperCase() === normalized,
  );
  if (!shipment) return DRIVERS.guy;
  return DRIVERS[shipment.driverId] ?? null;
}

export function getShipmentByCode(codeOrId: string): ShipmentTrack | undefined {
  const normalized = codeOrId.replace('#', '').toUpperCase();
  return SHIPMENTS.find(
    (s) => s.id === codeOrId || s.code.replace('#', '').toUpperCase() === normalized,
  );
}
