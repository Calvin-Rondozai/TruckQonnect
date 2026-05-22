export type ShipperChatThread = {
  id: string;
  driverName: string;
  driverAvatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  loadRef: string;
};

export type ShipperChatMessage = {
  id: string;
  threadId: string;
  text: string;
  time: string;
  sender: 'shipper' | 'driver';
};

export const SHIPPER_CHAT_THREADS: ShipperChatThread[] = [
  {
    id: 's-thread-1',
    driverName: 'Tinashe Moyo',
    driverAvatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    lastMessage: 'On my way to pickup — ETA 25 min.',
    time: '5m',
    unread: 1,
    loadRef: '#H62J568107',
  },
  {
    id: 's-thread-2',
    driverName: 'Blessing Chuma',
    driverAvatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    lastMessage: 'Bid submitted for your Bulawayo load.',
    time: '2h',
    unread: 0,
    loadRef: '#K91M220441',
  },
];

export const SHIPPER_CHAT_MESSAGES: ShipperChatMessage[] = [
  {
    id: 'sm-1',
    threadId: 's-thread-1',
    text: 'Hi, can you confirm pickup at Workington?',
    time: '08:40',
    sender: 'shipper',
  },
  {
    id: 'sm-2',
    threadId: 's-thread-1',
    text: 'Yes, I will be there in 25 minutes.',
    time: '08:42',
    sender: 'driver',
  },
  {
    id: 'sm-3',
    threadId: 's-thread-1',
    text: 'On my way to pickup — ETA 25 min.',
    time: '09:01',
    sender: 'driver',
  },
];

export function getShipperThreadById(id: string): ShipperChatThread | undefined {
  return SHIPPER_CHAT_THREADS.find((t) => t.id === id);
}

export function getShipperMessagesForThread(threadId: string): ShipperChatMessage[] {
  return SHIPPER_CHAT_MESSAGES.filter((m) => m.threadId === threadId);
}

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  type: 'bid' | 'delivery' | 'system';
};

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'New bid on your load',
    body: 'Tinashe Moyo bid $920 on Harare → Bulawayo.',
    time: '12 min ago',
    read: false,
    type: 'bid',
  },
  {
    id: 'n2',
    title: 'Shipment in transit',
    body: '#H62J568107 left Harare depot.',
    time: '1 hr ago',
    read: false,
    type: 'delivery',
  },
  {
    id: 'n3',
    title: 'Delivery completed',
    body: '#P44L998201 was marked delivered.',
    time: 'Yesterday',
    read: true,
    type: 'delivery',
  },
  {
    id: 'n4',
    title: 'Welcome to TruckQonnect',
    body: 'Post your first load to receive driver bids.',
    time: '2 days ago',
    read: true,
    type: 'system',
  },
];
