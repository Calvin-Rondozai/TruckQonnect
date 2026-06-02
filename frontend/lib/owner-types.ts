export type UserRole = 'cargo' | 'driver';

export type OwnerLoad = {
  id: string;
  pickup: string;
  dropoff: string;
  cargoType: string;
  weight: string;
  distance: string;
  budget: number;
  suggestedPrice: number;
  currency: string;
  timePosted: string;
  deliveryDate: string;
  description: string;
  images: string[];
  customerName: string;
  customerCompany: string;
  customerPhone: string;
  customerAvatar?: string;
  customerRating: number;
  urgent?: boolean;
};

export type OwnerBid = {
  loadId: string;
  amount: number;
  etaHours: number;
};

export type ActiveDelivery = {
  id: string;
  loadId: string;
  pickup: string;
  dropoff: string;
  cargoType: string;
  customerName: string;
  customerPhone: string;
  customerAvatar: string;
  status: 'en_route_pickup' | 'at_pickup' | 'in_transit' | 'at_dropoff';
  eta: string;
  progress: number;
  earnings: number;
};

export type OwnerHistoryItem = {
  id: string;
  cargoType: string;
  pickup: string;
  dropoff: string;
  earnings: number;
  date: string;
  deliveryDate: string;
  customerCompany: string;
  customerRating: number;
  status: 'completed' | 'cancelled' | 'ongoing';
};

export type OwnerChatThread = {
  id: string;
  customerName: string;
  customerAvatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  loadRef: string;
};

export type OwnerChatMessage = {
  id: string;
  threadId: string;
  text: string;
  time: string;
  sender: 'driver' | 'customer';
};

export type OwnerProfile = {
  id: string;
  name: string;
  company: string;
  phone: string;
  avatar: string;
  rating: number;
  trips: number;
  verified: boolean;
  online: boolean;
  truck: OwnerTruck;
};

export type OwnerTruck = {
  plate: string;
  brand: string;
  size: string;
  type: string;
  image: string;
};

export type OwnerEarnings = {
  today: number;
  week: number;
  month: number;
  currency: string;
};
