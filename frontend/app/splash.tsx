import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandWordmark } from '@/components/truckq/BrandWordmark';
import { TQ, TQFonts } from '@/constants/truckq-design';

const LOGO = require('@/assets/images/logo.png');

const MIN_MS = 2400;

export default function SplashScreen() {
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(0.82);
  const opacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 14, stiffness: 120 });
    opacity.value = withTiming(1, { duration: 500 });
    textOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));

    const t = setTimeout(() => {
      router.replace('/onboarding');
    }, MIN_MS);

    return () => clearTimeout(t);
  }, [opacity, scale, textOpacity]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom + 32 }]}>
      <Animated.View style={[styles.logoWrap, logoStyle]}>
        <Image source={LOGO} style={styles.logo} contentFit="contain" />
      </Animated.View>

      <Animated.View style={[styles.textBlock, textStyle]}>
        <BrandWordmark size="lg" />
        <Text style={styles.caption}>Taking your business on the fast lane</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: TQ.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logoWrap: {
    marginBottom: 28,
  },
  logo: {
    width: 200,
    height: 200,
  },
  textBlock: {
    alignItems: 'center',
    gap: 10,
  },
  caption: {
    marginTop: 6,
    fontFamily: TQFonts.medium,
    fontSize: 15,
    color: TQ.gray600,
    textAlign: 'center',
    letterSpacing: 0.2,
    fontStyle: 'italic',
  },
});
