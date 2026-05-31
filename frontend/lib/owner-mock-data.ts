import type { AppNotification } from '@/lib/shipper-mock-data';
import type {
  ActiveDelivery,
  OwnerChatMessage,
  OwnerChatThread,
  OwnerEarnings,
  OwnerHistoryItem,
  OwnerLoad,
  OwnerProfile,
} from '@/lib/owner-types';

export const OWNER_EARNINGS: OwnerEarnings = {
  today: 420,
  week: 2840,
  month: 11250,
  currency: 'USD',
};

export const OWNER_PROFILE: OwnerProfile = {
  id: 'owner-1',
  name: 'Tinashe Moyo',
  phone: '+263 77 234 5678',
  avatar:
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  rating: 4.9,
  trips: 186,
  verified: true,
  online: true,
  truck: {
    plate: 'ABC 1234 ZW',
    brand: 'Volvo',
    size: '15 Ton',
    type: 'Flatbed',
    image:
      'https://images.unsplash.com/photo-1601584115929-48c62445b8f6?auto=format&fit=crop&w=400&q=80',
  },
};

export const AVAILABLE_LOADS: OwnerLoad[] = [
  {
    id: 'load-1',
    pickup: 'Harare, Workington',
    dropoff: 'Bulawayo, CBD',
    cargoType: 'Building Materials',
    weight: '12 Ton',
    distance: '439 km',
    budget: 850,
    suggestedPrice: 920,
    currency: 'USD',
    timePosted: '12 min ago',
    description: 'Cement bags and steel rods, covered tarp required.',
    images: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80',
    ],
    customerName: 'Rudo Chikwanha',
    customerPhone: '+263 78 111 2233',
    customerAvatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    customerRating: 4.8,
    urgent: true,
  },
  {
    id: 'load-2',
    pickup: 'Mutare, Industrial',
    dropoff: 'Harare, Msasa',
    cargoType: 'Agricultural Produce',
    weight: '8 Ton',
    distance: '263 km',
    budget: 520,
    suggestedPrice: 580,
    currency: 'USD',
    timePosted: '34 min ago',
    description: 'Fresh produce — refrigerated truck preferred.',
    images: [
      'https://images.unsplash.com/photo-1566576721346-2c2c8f3e1c1a?auto=format&fit=crop&w=400&q=80',
    ],
    customerName: 'Farai Ndlovu',
    customerPhone: '+263 77 444 5566',
    customerAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    customerRating: 4.6,
  },
  {
    id: 'load-3',
    pickup: 'Gweru, City Centre',
    dropoff: 'Kwekwe, Mines',
    cargoType: 'Mining Equipment',
    weight: '18 Ton',
    distance: '54 km',
    budget: 280,
    suggestedPrice: 310,
    currency: 'USD',
    timePosted: '1 hr ago',
    description: 'Heavy machinery parts, lowbed or flatbed.',
    images: [
      'https://images.unsplash.com/photo-1519003722824-7e7298e799f2?auto=format&fit=crop&w=400&q=80',
    ],
    customerName: 'James Mupfumi',
    customerPhone: '+263 71 888 9900',
    customerRating: 4.9,
  },
  {
    id: 'load-4',
    pickup: 'Chitungwiza',
    dropoff: 'Victoria Falls',
    cargoType: 'Retail Goods',
    weight: '5 Ton',
    distance: '871 km',
    budget: 1400,
    suggestedPrice: 1550,
    currency: 'USD',
    timePosted: '2 hrs ago',
    description: 'Boxed retail stock, secure load required.',
    images: [
      'https://images.unsplash.com/photo-1607083206869-4c6915a58f8f?auto=format&fit=crop&w=400&q=80',
    ],
    customerName: 'Chipo Sithole',
    customerPhone: '+263 78 222 3344',
    customerRating: 5.0,
  },
];

export const ACTIVE_DELIVERY: ActiveDelivery = {
  id: 'delivery-1',
  loadId: 'load-1',
  pickup: 'Harare, Workington',
  dropoff: 'Bulawayo, CBD',
  cargoType: 'Building Materials',
  customerName: 'Rudo Chikwanha',
  customerPhone: '+263 78 111 2233',
  customerAvatar:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  status: 'in_transit',
  eta: '4h 20m',
  progress: 62,
  earnings: 920,
};

export const OWNER_HISTORY: OwnerHistoryItem[] = [
  {
    id: 'h-1',
    cargoType: 'Furniture',
    pickup: 'Harare',
    dropoff: 'Mutare',
    earnings: 380,
    date: 'May 18, 2026',
    customerRating: 5,
    status: 'completed',
  },
  {
    id: 'h-2',
    cargoType: 'Electronics',
    pickup: 'Bulawayo',
    dropoff: 'Harare',
    earnings: 720,
    date: 'May 16, 2026',
    customerRating: 4.8,
    status: 'completed',
  },
  {
    id: 'h-3',
    cargoType: 'Grain',
    pickup: 'Masvingo',
    dropoff: 'Harare',
    earnings: 450,
    date: 'May 14, 2026',
    customerRating: 4.5,
    status: 'cancelled',
  },
  {
    id: 'h-4',
    cargoType: 'Building Materials',
    pickup: 'Harare',
    dropoff: 'Bulawayo',
    earnings: 920,
    date: 'May 20, 2026',
    customerRating: 4.8,
    status: 'ongoing',
  },
];

export const CHAT_THREADS: OwnerChatThread[] = [
  {
    id: 'thread-1',
    customerName: 'Rudo Chikwanha',
    customerAvatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    lastMessage: 'I am at the pickup gate now.',
    time: '2m',
    unread: 2,
    loadRef: 'load-1',
  },
  {
    id: 'thread-2',
    customerName: 'Farai Ndlovu',
    customerAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    lastMessage: 'Thanks for the quick quote!',
    time: '1h',
    unread: 0,
    loadRef: 'load-2',
  },
];

export const CHAT_MESSAGES: OwnerChatMessage[] = [
  {
    id: 'm-1',
    threadId: 'thread-1',
    text: 'Hi, are you available for pickup today?',
    time: '09:12',
    sender: 'customer',
  },
  {
    id: 'm-2',
    threadId: 'thread-1',
    text: 'Yes, I can be there in 45 minutes.',
    time: '09:14',
    sender: 'driver',
  },
  {
    id: 'm-3',
    threadId: 'thread-1',
    text: 'Perfect. Gate 3 at Workington depot.',
    time: '09:15',
    sender: 'customer',
  },
  {
    id: 'm-4',
    threadId: 'thread-1',
    text: 'I am at the pickup gate now.',
    time: '10:02',
    sender: 'customer',
  },
];

export const OWNER_MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'on1',
    title: 'New load near you',
    body: 'Harare → Bulawayo · 12 tonnes · posted 8 min ago.',
    time: '8 min ago',
    read: false,
    type: 'bid',
  },
  {
    id: 'on2',
    title: 'Bid accepted',
    body: 'Your bid on Mutare → Harare was accepted. Tap to view job.',
    time: '45 min ago',
    read: false,
    type: 'delivery',
  },
  {
    id: 'on3',
    title: 'Payment received',
    body: '$420 credited for completed delivery #D88K201.',
    time: '3 hr ago',
    read: true,
    type: 'system',
  },
  {
    id: 'on4',
    title: 'Route reminder',
    body: 'Active delivery ETA updated — arrive Bulawayo by 16:00.',
    time: 'Yesterday',
    read: true,
    type: 'delivery',
  },
];

export function getLoadById(id: string): OwnerLoad | undefined {
  return AVAILABLE_LOADS.find((l) => l.id === id);
}

export function getThreadById(id: string): OwnerChatThread | undefined {
  return CHAT_THREADS.find((t) => t.id === id);
}

export function getMessagesForThread(threadId: string): OwnerChatMessage[] {
  return CHAT_MESSAGES.filter((m) => m.threadId === threadId);
}
