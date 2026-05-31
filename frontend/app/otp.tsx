import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect } from 'react';

import { OtpScreen } from '@/components/truckq/auth/OtpScreen';
import { useAuthUser } from '@/context/auth-user';
import { useUserRole } from '@/context/user-role';
import { saveTokens } from '@/lib/auth-storage';
import type { VerifyOtpResponse } from '@/lib/auth-api';
import { consumePendingSignupAvatar } from '@/lib/pending-signup-avatar';
import type { UserRole } from '@/lib/owner-types';

export default function OtpRoute() {
  const { email, emailMasked, role, devOtp } = useLocalSearchParams<{
    email?: string;
    emailMasked?: string;
    role?: string;
    devOtp?: string;
  }>();
  const { setRole } = useUserRole();
  const { setUserLocal, uploadAvatar } = useAuthUser();

  const emailStr = typeof email === 'string' ? email : Array.isArray(email) ? email[0] : '';
  const emailMaskedStr =
    typeof emailMasked === 'string' ? emailMasked : Array.isArray(emailMasked) ? emailMasked[0] : undefined;
  const roleStr = (typeof role === 'string' ? role : Array.isArray(role) ? role[0] : 'cargo') as UserRole;
  const devOtpStr =
    typeof devOtp === 'string' ? devOtp : Array.isArray(devOtp) ? devOtp[0] : undefined;

  useEffect(() => {
    if (!emailStr) router.replace('/login');
  }, [emailStr]);

  const onVerified = useCallback(
    async (result: VerifyOtpResponse) => {
      await saveTokens(result.tokens.access, result.tokens.refresh);
      await setUserLocal(result.user);
      await setRole(result.user.role);

      const pendingAvatar = await consumePendingSignupAvatar();
      if (pendingAvatar) {
        try {
          await uploadAvatar(pendingAvatar.uri, pendingAvatar.mimeType);
        } catch {
          // Avatar upload is optional; user can add later from profile.
        }
      }

      if (result.user.role === 'driver') {
        router.replace('/(owner-tabs)' as never);
      } else {
        router.replace('/(tabs)');
      }
    },
    [setRole, setUserLocal, uploadAvatar]
  );

  const onChangeEmail = useCallback(() => {
    router.replace({ pathname: '/signup', params: { role: roleStr ?? 'cargo' } });
  }, [roleStr]);

  if (!emailStr) return null;

  return (
    <OtpScreen
      email={emailStr}
      emailMasked={emailMaskedStr}
      devOtp={devOtpStr}
      onVerified={onVerified}
      onChangeEmail={onChangeEmail}
    />
  );
}
