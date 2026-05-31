import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type { ShipperProfile } from '@/lib/types';

const KEY = '@truckq_shipper_profile';

const DEFAULT_PROFILE: ShipperProfile = {
  name: 'Leslie Chikwanha',
  city: 'Harare',
  phone: '+263771000000',
  company: 'Chikwanha Logistics',
  email: 'leslie@example.com',
};

type ContextValue = {
  profile: ShipperProfile;
  loaded: boolean;
  updateProfile: (patch: Partial<ShipperProfile>) => Promise<void>;
};

const ShipperProfileContext = createContext<ContextValue | null>(null);

export function ShipperProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ShipperProfile>(DEFAULT_PROFILE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(raw) });
        }
      } catch {
        /* keep defaults */
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const updateProfile = useCallback(async (patch: Partial<ShipperProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...patch };
      void AsyncStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ profile, loaded, updateProfile }),
    [profile, loaded, updateProfile],
  );

  return (
    <ShipperProfileContext.Provider value={value}>{children}</ShipperProfileContext.Provider>
  );
}

export function useShipperProfile() {
  const ctx = useContext(ShipperProfileContext);
  if (!ctx) throw new Error('useShipperProfile must be used within ShipperProfileProvider');
  return ctx;
}
