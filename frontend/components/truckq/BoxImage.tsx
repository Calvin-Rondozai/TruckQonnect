import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

type Props = {
  /** Card width — height scales to keep aspect ratio */
  width: number;
  style?: ViewStyle;
};

/** Real box asset (`box.png`), sized to fit shipment cards. */
export function BoxImage({ width, style }: Props) {
  const height = Math.round(width * 0.82);

  return (
    <View style={[styles.wrap, { width, height }, style]}>
      <Image
        source={require('@/assets/images/box.png')}
        style={{ width, height }}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
