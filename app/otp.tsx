import { router, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';

import { OtpScreen } from '@/components/truckq/auth/OtpScreen';

export default function OtpRoute() {
  const { phone, role } = useLocalSearchParams<{ phone?: string; role?: string }>();
  const phoneStr = typeof phone === 'string' ? phone : Array.isArray(phone) ? phone[0] : undefined;
  const isDriver = role === 'driver';

  const goApp = useCallback(() => {
    if (isDriver) {
      router.replace('/(owner-tabs)' as never);
    } else {
      router.replace('/(tabs)');
    }
  }, [isDriver]);

  const onChangeNumber = useCallback(() => {
    router.replace({ pathname: '/login', params: { role: role ?? 'cargo' } });
  }, [role]);

  return (
    <OtpScreen
      phone={phoneStr}
      onVerified={goApp}
      onChangeNumber={onChangeNumber}
      onSkip={goApp}
    />
  );
}
