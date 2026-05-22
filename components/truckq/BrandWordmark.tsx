import React from 'react';
import { StyleSheet, Text, TextStyle, View } from 'react-native';

import { TQ, TQFonts } from '@/constants/truckq-design';

type Props = {
  size?: 'lg' | 'md' | 'sm';
  style?: TextStyle;
};

const SIZES = {
  lg: { fontSize: 32, lineHeight: 38 },
  md: { fontSize: 26, lineHeight: 32 },
  sm: { fontSize: 20, lineHeight: 26 },
} as const;

/** TruckQonnect — the “Q” uses brand yellow */
export function BrandWordmark({ size = 'lg', style }: Props) {
  const s = SIZES[size];
  return (
    <View style={styles.row}>
      <Text style={[styles.text, s, style]}>
        Truck<Text style={styles.q}>Q</Text>onnect
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontFamily: TQFonts.bold,
    color: TQ.black,
    letterSpacing: -0.8,
  },
  q: {
    color: TQ.yellow,
  },
});
