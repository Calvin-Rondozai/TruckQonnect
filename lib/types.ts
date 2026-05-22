export type ShipperProfile = {
  name: string;
  city: string;
  phone: string;
  company: string;
  email: string;
};

export type DriverProfile = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  trips: number;
  truckType: string;
  plateNumber: string;
  yearsActive: number;
  phone: string;
  verified: boolean;
};

export type ShipmentTrack = {
  id: string;
  code: string;
  from: string;
  to: string;
  eta: string;
  progress: number;
  driverId: string;
};

export type LoadRequest = {
  id: string;
  driverName: string;
  driverAvatar: string;
  truckType: string;
  route: string;
  loadSummary: string;
  offeredPrice: string;
  eta: string;
  rating: number;
};

export type PostedLoad = {
  id: string;
  code: string;
  pickup: string;
  delivery: string;
  description: string;
  weight: string;
  truckType: string;
  budget: string;
  pickupWhen: string;
  status: 'open' | 'matched';
  postedAt: string;
};

export type PlaceLoadDraft = {
  pickup: string;
  delivery: string;
  description: string;
  weight: string;
  truckType: string;
  budget: string;
  pickupWhen: string;
};
