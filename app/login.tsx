import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';

import { AuthLoginScreen } from '@/components/truckq/auth/AuthLoginScreen';
import { useUserRole } from '@/context/user-role';
import type { UserRole } from '@/lib/owner-types';

function parseRole(value: string | string[] | undefined): UserRole {
  const r = Array.isArray(value) ? value[0] : value;
  return r === 'driver' || r === 'cargo' ? r : 'cargo';
}

export default function LoginRoute() {
  const { role: roleParam } = useLocalSearchParams<{ role?: string }>();
  const { role: storedRole, setRole } = useUserRole();

  const role = useMemo(
    () => parseRole(roleParam) ?? storedRole ?? 'cargo',
    [roleParam, storedRole]
  );

  const onAuthenticated = useCallback(
    async (phone: string, userType: UserRole) => {
      await setRole(userType);
      router.replace({
        pathname: '/otp',
        params: { phone, role: userType },
      });
    },
    [setRole]
  );

  return <AuthLoginScreen role={role} onAuthenticated={onAuthenticated} />;
}
