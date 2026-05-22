import React, { createContext, useContext, useMemo, useState } from 'react';

import { OWNER_PROFILE } from '@/lib/owner-mock-data';
import type { OwnerProfile } from '@/lib/owner-types';

type ContextValue = {
  profile: OwnerProfile;
  setOnline: (online: boolean) => void;
  updateTruck: (patch: Partial<OwnerProfile['truck']>) => void;
};

const OwnerProfileContext = createContext<ContextValue | null>(null);

export function OwnerProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<OwnerProfile>(OWNER_PROFILE);

  const setOnline = (online: boolean) => {
    setProfile((p) => ({ ...p, online }));
  };

  const updateTruck = (patch: Partial<OwnerProfile['truck']>) => {
    setProfile((p) => ({ ...p, truck: { ...p.truck, ...patch } }));
  };

  const value = useMemo(
    () => ({ profile, setOnline, updateTruck }),
    [profile]
  );

  return (
    <OwnerProfileContext.Provider value={value}>{children}</OwnerProfileContext.Provider>
  );
}

export function useOwnerProfile() {
  const ctx = useContext(OwnerProfileContext);
  if (!ctx) throw new Error('useOwnerProfile must be used within OwnerProfileProvider');
  return ctx;
}
