import { Image } from 'expo-image';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CARGO_IMAGE = require('@/assets/images/cargo.png');

export function OnboardingArtCargo() {
  return (
    <View style={styles.wrap}>
      <Image source={CARGO_IMAGE} style={styles.image} contentFit="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    backgroundColor: '#fff',
    marginTop: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});