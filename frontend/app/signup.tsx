import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';

import type { AuthOtpParams } from '@/components/truckq/auth/AuthLoginScreen';
import { AuthSignupScreen } from '@/components/truckq/auth/AuthSignupScreen';
import { useUserRole } from '@/context/user-role';
import type { UserRole } from '@/lib/owner-types';

function parseRole(value: string | string[] | undefined): UserRole | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === 'cargo' || raw === 'driver') return raw;
  return null;
}

export default function SignupRoute() {
  const { role: roleParam } = useLocalSearchParams<{ role?: string }>();
  const { role: storedRole, setRole } = useUserRole();

  const role = useMemo(
    () => parseRole(roleParam) ?? storedRole ?? 'cargo',
    [roleParam, storedRole]
  );

  const onOtpRequired = useCallback(
    async ({ email, emailMasked, role: userType, devOtp }: AuthOtpParams) => {
      await setRole(userType);
      router.replace({
        pathname: '/otp',
        params: {
          email,
          emailMasked,
          role: userType,
          devOtp: devOtp ?? '',
        },
      });
    },
    [setRole]
  );

  return <AuthSignupScreen role={role} onOtpRequired={onOtpRequired} />;
}
