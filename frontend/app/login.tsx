import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';

import { AuthLoginScreen } from '@/components/truckq/auth/AuthLoginScreen';
import { useAuthUser } from '@/context/auth-user';
import { useUserRole } from '@/context/user-role';
import type { LoginResponse } from '@/lib/auth-api';
import { saveTokens } from '@/lib/auth-storage';
import type { UserRole } from '@/lib/owner-types';

function parseRole(value: string | string[] | undefined): UserRole | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === 'cargo' || raw === 'driver') return raw;
  return null;
}

export default function LoginRoute() {
  const { role: roleParam } = useLocalSearchParams<{ role?: string }>();
  const { role: storedRole, setRole } = useUserRole();
  const { setUserLocal } = useAuthUser();

  const role = useMemo(
    () => parseRole(roleParam) ?? storedRole ?? 'cargo',
    [roleParam, storedRole]
  );

  const onLoginSuccess = useCallback(
    async (result: LoginResponse) => {
      await saveTokens(result.tokens.access, result.tokens.refresh);
      await setUserLocal(result.user);
      await setRole(result.user.role);

      if (result.user.role === 'driver') {
        router.replace('/(owner-tabs)' as never);
      } else {
        router.replace('/(tabs)');
      }
    },
    [setRole, setUserLocal]
  );

  return <AuthLoginScreen role={role} onLoginSuccess={onLoginSuccess} />;
}
