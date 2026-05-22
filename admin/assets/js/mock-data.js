/**
 * TruckQonnect Admin — mock operations data
 */
window.TQMock = {
  kpis: {
    totalUsers: 12847,
    activeDrivers: 1842,
    activeLoads: 326,
    revenue: 284650,
    ongoingTrips: 89,
    pendingVerifications: 24,
    openDisputes: 7,
  },
  users: [
    { id: 'U-10241', name: 'Rudo Chikwanha', phone: '+263 78 111 2233', email: 'rudo@cargolink.co.zw', role: 'Cargo Owner', status: 'active', joined: '2025-11-02' },
    { id: 'U-10242', name: 'Tinashe Moyo', phone: '+263 77 234 5678', email: 'tinashe.m@mail.zw', role: 'Driver', status: 'active', joined: '2025-10-18' },
    { id: 'U-10243', name: 'Farai Ndlovu', phone: '+263 77 444 5566', email: 'farai.ndlovu@gmail.com', role: 'Cargo Owner', status: 'active', joined: '2026-01-05' },
    { id: 'U-10244', name: 'Blessing Chuma', phone: '+263 71 555 8899', email: 'b.chuma@haul.zw', role: 'Driver', status: 'pending', joined: '2026-02-28' },
    { id: 'U-10245', name: 'Chipo Sithole', phone: '+263 78 222 3344', email: 'chipo@retail.zw', role: 'Cargo Owner', status: 'suspended', joined: '2025-08-14' },
    { id: 'U-10246', name: 'James Mupfumi', phone: '+263 71 888 9900', email: 'james.m@mines.zw', role: 'Cargo Owner', status: 'active', joined: '2026-03-01' },
  ],
  drivers: [
    { id: 'D-4401', name: 'Tinashe Moyo', truck: 'ABC 1234 ZW · Volvo 15T', rating: 4.9, trips: 186, earnings: 11250, verified: true, status: 'on_trip' },
    { id: 'D-4402', name: 'Blessing Chuma', truck: 'DEF 5678 ZW · Isuzu 10T', rating: 4.6, trips: 42, earnings: 3280, verified: false, status: 'available' },
    { id: 'D-4403', name: 'Peter Muzenda', truck: 'GHI 9012 ZW · Mercedes 30T', rating: 4.8, trips: 210, earnings: 18400, verified: true, status: 'available' },
  ],
  cargoOwners: [
    { id: 'C-301', name: 'Rudo Chikwanha', company: 'CargoLink ZW', loads: 48, spent: 42000, rating: 4.8, status: 'active' },
    { id: 'C-302', name: 'Farai Ndlovu', company: 'AgriMove', loads: 22, spent: 18500, rating: 4.6, status: 'active' },
    { id: 'C-303', name: 'James Mupfumi', company: 'MineHaul Ltd', loads: 15, spent: 52000, rating: 4.9, status: 'active' },
  ],
  loads: [
    { id: 'L-9001', route: 'Harare → Bulawayo', cargo: 'Building Materials', weight: '12 Ton', budget: 850, status: 'in_transit', posted: 'May 20' },
    { id: 'L-9002', route: 'Mutare → Harare', cargo: 'Produce', weight: '8 Ton', budget: 520, status: 'open', posted: 'May 20' },
    { id: 'L-9003', route: 'Gweru → Kwekwe', cargo: 'Mining Equipment', weight: '18 Ton', budget: 280, status: 'assigned', posted: 'May 19' },
  ],
  trips: [
    { id: 'T-551', driver: 'Tinashe Moyo', route: 'Harare → Bulawayo', eta: '4h 20m', progress: 62, status: 'in_transit' },
    { id: 'T-552', driver: 'Peter Muzenda', route: 'Mutare → Harare', eta: '2h 10m', progress: 35, status: 'pickup' },
  ],
  payments: [
    { id: 'P-7781', user: 'Rudo Chikwanha', type: 'Load payment', amount: 920, status: 'completed', date: 'May 20, 09:14' },
    { id: 'P-7782', user: 'Tinashe Moyo', type: 'Driver payout', amount: 780, status: 'pending', date: 'May 20, 08:02' },
    { id: 'P-7783', user: 'Farai Ndlovu', type: 'Refund', amount: 120, status: 'processing', date: 'May 19, 16:44' },
  ],
  disputes: [
    { id: 'DP-101', parties: 'Rudo / Blessing', issue: 'Late pickup', status: 'investigating', priority: 'high' },
    { id: 'DP-102', parties: 'Chipo / Peter', issue: 'Damaged goods', status: 'open', priority: 'medium' },
  ],
  trucks: [
    { id: 'TR-88', plate: 'ABC 1234 ZW', brand: 'Volvo', type: 'Flatbed', capacity: '15 Ton', driver: 'Tinashe Moyo', status: 'active' },
    { id: 'TR-89', plate: 'DEF 5678 ZW', brand: 'Isuzu', type: 'Box', capacity: '10 Ton', driver: 'Blessing Chuma', status: 'pending' },
  ],
  verifications: [
    { id: 'V-12', name: 'Blessing Chuma', doc: 'Driver license', submitted: 'May 19', status: 'pending' },
    { id: 'V-13', name: 'DEF 5678 ZW', doc: 'Truck registration', submitted: 'May 18', status: 'pending' },
  ],
  fraudAlerts: [
    { id: 'F-01', user: 'Unknown #8821', risk: 'High', reason: 'Multiple failed OTP attempts', time: '12 min ago' },
    { id: 'F-02', user: 'Chipo Sithole', risk: 'Medium', reason: 'Unusual payout pattern', time: '2 hrs ago' },
  ],
  activities: [
    { icon: 'truck', type: 'trip', text: 'Trip T-551 departed Harare depot', time: '2 min ago', tone: 'yellow' },
    { icon: 'person-check', type: 'user', text: 'Driver Peter Muzenda verified', time: '18 min ago', tone: 'green' },
    { icon: 'cash', type: 'payment', text: 'Payout P-7782 queued for review', time: '34 min ago', tone: 'blue' },
    { icon: 'exclamation', type: 'dispute', text: 'Dispute DP-101 escalated', time: '1 hr ago', tone: 'red' },
  ],
};
