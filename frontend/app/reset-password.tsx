import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo } from 'react';

import { ResetPasswordScreen } from '@/components/truckq/auth/ResetPasswordScreen';
import type { UserRole } from '@/lib/owner-types';

function parseRole(value: string | string[] | undefined): UserRole {
  const r = Array.isArray(value) ? value[0] : value;
  return r === 'driver' || r === 'cargo' ? r : 'cargo';
}

function parseParam(value: string | string[] | undefined): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value[0] ?? '';
  return '';
}

export default function ResetPasswordRoute() {
  const { email, resetToken, role: roleParam } = useLocalSearchParams<{
    email?: string;
    resetToken?: string;
    role?: string;
  }>();

  const emailStr = parseParam(email);
  const resetTokenStr = parseParam(resetToken);
  const role = useMemo(() => parseRole(roleParam), [roleParam]);

  useEffect(() => {
    if (!emailStr || !resetTokenStr) {
      router.replace({ pathname: '/forgot-password', params: { role } });
    }
  }, [emailStr, resetTokenStr, role]);

  if (!emailStr || !resetTokenStr) return null;

  return (
    <ResetPasswordScreen role={role} email={emailStr} resetToken={resetTokenStr} />
  );
}
