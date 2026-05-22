import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SAFE_IMAGE = require('@/assets/images/Safe.png');

export function OnboardingArtSafe() {
  return (
    <View style={styles.wrap}>
      <Image source={SAFE_IMAGE} style={styles.image} contentFit="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    backgroundColor: '#fff',
    marginTop: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});