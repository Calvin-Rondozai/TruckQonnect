import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect } from 'react';

import { OtpScreen } from '@/components/truckq/auth/OtpScreen';
import {
  resendPasswordResetOtp,
  verifyPasswordResetOtp,
  type PasswordResetOtpResponse,
} from '@/lib/auth-api';
import type { UserRole } from '@/lib/owner-types';

function parseRole(value: string | string[] | undefined): UserRole {
  const r = Array.isArray(value) ? value[0] : value;
  return r === 'driver' || r === 'cargo' ? r : 'cargo';
}

export default function ResetPasswordOtpRoute() {
  const { email, emailMasked, devOtp, role: roleParam } = useLocalSearchParams<{
    email?: string;
    emailMasked?: string;
    devOtp?: string;
    role?: string;
  }>();

  const emailStr = typeof email === 'string' ? email : Array.isArray(email) ? email[0] : '';
  const emailMaskedStr =
    typeof emailMasked === 'string'
      ? emailMasked
      : Array.isArray(emailMasked)
        ? emailMasked[0]
        : undefined;
  const devOtpStr =
    typeof devOtp === 'string' ? devOtp : Array.isArray(devOtp) ? devOtp[0] : undefined;
  const role = parseRole(roleParam);

  useEffect(() => {
    if (!emailStr) router.replace({ pathname: '/forgot-password', params: { role } });
  }, [emailStr, role]);

  const onVerified = useCallback(
    async (result: PasswordResetOtpResponse) => {
      router.push({
        pathname: '/reset-password',
        params: {
          email: result.email,
          resetToken: result.reset_token,
          role,
        },
      });
    },
    [role]
  );

  const onChangeEmail = useCallback(() => {
    router.replace({ pathname: '/forgot-password', params: { role } });
  }, [role]);

  if (!emailStr) return null;

  return (
    <OtpScreen<PasswordResetOtpResponse>
      email={emailStr}
      emailMasked={emailMaskedStr}
      title="Reset password"
      verifyButtonText="Verify code"
      verifyFn={verifyPasswordResetOtp}
      resendFn={resendPasswordResetOtp}
      devOtp={devOtpStr}
      onVerified={onVerified}
      onChangeEmail={onChangeEmail}
    />
  );
}
