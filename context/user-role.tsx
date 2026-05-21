import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { UserRole } from '@/lib/owner-types';

const KEY = '@truckq_user_role';

type ContextValue = {
  role: UserRole | null;
  ready: boolean;
  setRole: (role: UserRole) => Promise<void>;
  clearRole: () => Promise<void>;
};

const UserRoleContext = createContext<ContextValue | null>(null);

export function UserRoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const v = await AsyncStorage.getItem(KEY);
        if (v === 'cargo' || v === 'driver') setRoleState(v);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const setRole = useCallback(async (r: UserRole) => {
    await AsyncStorage.setItem(KEY, r);
    setRoleState(r);
  }, []);

  const clearRole = useCallback(async () => {
    await AsyncStorage.removeItem(KEY);
    setRoleState(null);
  }, []);

  const value = useMemo(
    () => ({ role, ready, setRole, clearRole }),
    [role, ready, setRole, clearRole]
  );

  return <UserRoleContext.Provider value={value}>{children}</UserRoleContext.Provider>;
}

export function useUserRole() {
  const ctx = useContext(UserRoleContext);
  if (!ctx) throw new Error('useUserRole must be used within UserRoleProvider');
  return ctx;
}
