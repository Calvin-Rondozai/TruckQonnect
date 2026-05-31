import { router } from 'expo-router';
import { useCallback } from 'react';

import { WelcomeScreen } from '@/components/truckq/WelcomeScreen';

export default function WelcomeRoute() {
  const finish = useCallback(() => {
    router.replace('/choose-role');
  }, []);

  return <WelcomeScreen onComplete={finish} swipeEnabled />;
}
