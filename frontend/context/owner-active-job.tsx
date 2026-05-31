import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { ACTIVE_DELIVERY, getLoadById } from '@/lib/owner-mock-data';
import type { ActiveDelivery } from '@/lib/owner-types';

type OwnerActiveJobContextValue = {
  activeDelivery: ActiveDelivery | null;
  acceptLoad: (loadId: string, bidAmount: number, etaHours: number) => void;
  clearActiveJob: () => void;
};

const OwnerActiveJobContext = createContext<OwnerActiveJobContextValue | null>(null);

export function OwnerActiveJobProvider({ children }: { children: React.ReactNode }) {
  const [activeDelivery, setActiveDelivery] = useState<ActiveDelivery | null>(ACTIVE_DELIVERY);

  const acceptLoad = useCallback((loadId: string, bidAmount: number, etaHours: number) => {
    const load = getLoadById(loadId);
    if (!load) return;

    setActiveDelivery({
      id: `delivery-${loadId}`,
      loadId,
      pickup: load.pickup,
      dropoff: load.dropoff,
      cargoType: load.cargoType,
      customerName: load.customerName,
      customerPhone: load.customerPhone,
      customerAvatar:
        load.customerAvatar ??
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      status: 'en_route_pickup',
      eta: `${etaHours}h`,
      progress: 8,
      earnings: bidAmount,
    });
  }, []);

  const clearActiveJob = useCallback(() => setActiveDelivery(null), []);

  const value = useMemo(
    () => ({ activeDelivery, acceptLoad, clearActiveJob }),
    [activeDelivery, acceptLoad, clearActiveJob]
  );

  return (
    <OwnerActiveJobContext.Provider value={value}>{children}</OwnerActiveJobContext.Provider>
  );
}

export function useOwnerActiveJob() {
  const ctx = useContext(OwnerActiveJobContext);
  if (!ctx) throw new Error('useOwnerActiveJob must be used within OwnerActiveJobProvider');
  return ctx;
}
