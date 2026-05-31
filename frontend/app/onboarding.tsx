import { router } from 'expo-router';
import { useCallback } from 'react';

import { IntroOnboardingScreen } from '@/components/truckq/IntroOnboardingScreen';

export default function OnboardingScreen() {
  const finish = useCallback(() => {
    router.replace('/welcome');
  }, []);

  const skip = useCallback(() => {
    router.replace('/welcome');
  }, []);

  return <IntroOnboardingScreen onComplete={finish} onSkip={skip} />;
}
