import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { AUTH_API_PREFIX } from '@/lib/api-config';
import { apiFetch } from '@/lib/api-client';
import type { AuthUser } from '@/lib/auth-api';
import { clearTokens, getAccessToken } from '@/lib/auth-storage';
import type { UserRole } from '@/lib/owner-types';

const USER_KEY = '@truckq_auth_user';

type ProfilePatch = {
  full_name?: string;
  phone?: string;
  city?: string;
  company?: string;
};

type ContextValue = {
  user: AuthUser | null;
  ready: boolean;
  refreshUser: () => Promise<void>;
  setUserLocal: (user: AuthUser) => Promise<void>;
  updateProfile: (patch: ProfilePatch) => Promise<AuthUser>;
  uploadAvatar: (uri: string, mimeType?: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  displayAvatar: string | null;
  roleLabel: string;
};

const AuthUserContext = createContext<ContextValue | null>(null);

export function AuthUserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  const persistUser = useCallback(async (next: AuthUser | null) => {
    setUser(next);
    if (next) {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(next));
    } else {
      await AsyncStorage.removeItem(USER_KEY);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const token = await getAccessToken();
    if (!token) {
      await persistUser(null);
      return;
    }
    try {
      const me = await apiFetch<AuthUser>('/me/');
      await persistUser(me);
    } catch {
      await clearTokens();
      await persistUser(null);
    }
  }, [persistUser]);

  useEffect(() => {
    void (async () => {
      try {
        const raw = await AsyncStorage.getItem(USER_KEY);
        if (raw) setUser(JSON.parse(raw) as AuthUser);
        await refreshUser();
      } finally {
        setReady(true);
      }
    })();
  }, [refreshUser]);

  const setUserLocal = useCallback(
    async (next: AuthUser) => {
      await persistUser(next);
    },
    [persistUser]
  );

  const updateProfile = useCallback(
    async (patch: ProfilePatch) => {
      const updated = await apiFetch<AuthUser>('/me/', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      await persistUser(updated);
      return updated;
    },
    [persistUser]
  );

  const uploadAvatar = useCallback(
    async (uri: string, mimeType = 'image/jpeg') => {
      const token = await getAccessToken();
      const form = new FormData();
      form.append('avatar', {
        uri,
        name: 'avatar.jpg',
        type: mimeType,
      } as unknown as Blob);

      const res = await fetch(`${AUTH_API_PREFIX}/me/avatar/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: form,
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((body as { detail?: string }).detail ?? 'Upload failed.');
      }
      const updated = body as AuthUser;
      await persistUser(updated);
      return updated;
    },
    [persistUser]
  );

  const logout = useCallback(async () => {
    await clearTokens();
    await persistUser(null);
  }, [persistUser]);

  const displayAvatar = user?.avatar_url ?? null;
  const roleLabel =
    user?.role_label ?? (user?.role === 'driver' ? 'Truck owner' : 'Cargo client');

  const value = useMemo(
    () => ({
      user,
      ready,
      refreshUser,
      setUserLocal,
      updateProfile,
      uploadAvatar,
      logout,
      displayAvatar,
      roleLabel,
    }),
    [user, ready, refreshUser, setUserLocal, updateProfile, uploadAvatar, logout, displayAvatar, roleLabel]
  );

  return <AuthUserContext.Provider value={value}>{children}</AuthUserContext.Provider>;
}

export function useAuthUser() {
  const ctx = useContext(AuthUserContext);
  if (!ctx) throw new Error('useAuthUser must be used within AuthUserProvider');
  return ctx;
}

export function roleToUserRole(role: UserRole | undefined): UserRole {
  return role === 'driver' ? 'driver' : 'cargo';
}
