import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';

import { ForgotPasswordScreen } from '@/components/truckq/auth/ForgotPasswordScreen';
import type { UserRole } from '@/lib/owner-types';

function parseRole(value: string | string[] | undefined): UserRole {
  const r = Array.isArray(value) ? value[0] : value;
  return r === 'driver' || r === 'cargo' ? r : 'cargo';
}

export default function ForgotPasswordRoute() {
  const { role: roleParam } = useLocalSearchParams<{ role?: string }>();
  const role = useMemo(() => parseRole(roleParam), [roleParam]);
  return <ForgotPasswordScreen role={role} />;
}
