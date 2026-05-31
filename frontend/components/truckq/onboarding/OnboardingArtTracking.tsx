import { Image } from 'expo-image';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const TRACKING_IMAGE = require('@/assets/images/Tracking.png');

export function OnboardingArtTracking() {
  return (
    <View style={styles.wrap}>
      <Image source={TRACKING_IMAGE} style={styles.image} contentFit="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.52,  // takes up ~half the screen, adjust up/down as needed
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.52,
  },
});