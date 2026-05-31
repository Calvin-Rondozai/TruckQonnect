import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SwipeToShipSlider } from '@/components/truckq/SwipeToShipSlider';
import { TQ, TQFonts } from '@/constants/truckq-design';

const WELCOME_IMAGE = require('@/assets/images/home.png');

type Props = {
  onComplete: () => void;
  swipeEnabled?: boolean;
};

export function WelcomeScreen({ onComplete, swipeEnabled = true }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <Image
        source={WELCOME_IMAGE}
        style={styles.heroImage}
        contentFit="cover"
        contentPosition={{ top: '22%', left: '50%' }}
        transition={300}
      />

      <LinearGradient
        colors={['transparent', 'rgba(245,212,0,0.25)', TQ.yellow, TQ.yellow]}
        locations={[0.48, 0.62, 0.76, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + 12,
            paddingBottom: Math.max(insets.bottom, 20) + 12,
          },
        ]}
      >
        <Text style={styles.title}>Easy Shipping, Smarter Business</Text>
        <Text style={styles.sub}>
          Smart shipping saves time, cuts costs, and grows businesses faster.
        </Text>

        <View style={styles.sliderWrap}>
          <SwipeToShipSlider onComplete={onComplete} swipeEnabled={swipeEnabled} />
        </View>

        {Platform.OS === 'web' && swipeEnabled ? (
          <Text style={styles.webHint}>Drag the package icon to the right to continue.</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: TQ.yellow,
    overflow: 'hidden',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    top: -48,
    height: '112%',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    marginBottom: '10%',
  },
  title: {
    fontFamily: TQFonts.bold,
    fontSize: 30,
    lineHeight: 36,
    color: TQ.black,
    letterSpacing: -0.6,
  },
  sub: {
    marginTop: 12,
    marginBottom: 28,
    fontFamily: TQFonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: TQ.gray700,
    maxWidth: 320,
  },
  sliderWrap: {
    width: '100%',
  },
  webHint: {
    marginTop: 14,
    fontFamily: TQFonts.medium,
    fontSize: 12,
    color: TQ.gray600,
    textAlign: 'center',
  },
});
