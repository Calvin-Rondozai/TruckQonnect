import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { TQ, TQRadii } from '@/constants/truckq-design';

type Props = {
  size?: 'sm' | 'md';
};

/** Lightweight “3D box” stack — no bitmaps, reads intentional on any DPI */
export function PackageStackIllustration({ size = 'md' }: Props) {
  const s = size === 'sm' ? 0.72 : 1;
  const w = 56 * s;
  const h = 44 * s;

  return (
    <View style={[styles.stack, { width: w + 12, height: h + 18 }]}>
      <View style={[styles.boxBack, { width: w * 0.92, height: h * 0.88, borderRadius: TQRadii.sm * s }]}>
        <LinearGradient
          colors={['#C4A574', '#9E7B4F']}
          style={[StyleSheet.absoluteFill, { borderRadius: TQRadii.sm * s }]}
        />
      </View>
      <View style={[styles.boxFront, { width: w, height: h, borderRadius: TQRadii.md * s }]}>
        <LinearGradient
          colors={['#E8D4B0', '#C9A66B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius: TQRadii.md * s }]}
        />
        <View style={[styles.tape, { top: h * 0.38, opacity: 0.35 }]} />
        <View
          style={[
            styles.edge,
            {
              width: w * 0.22,
              height: h,
              borderTopRightRadius: TQRadii.md * s,
              borderBottomRightRadius: TQRadii.md * s,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  boxBack: {
    position: 'absolute',
    bottom: 4,
    transform: [{ rotate: '-8deg' }, { translateX: -6 }],
    opacity: 0.95,
    shadowColor: TQ.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  boxFront: {
    overflow: 'hidden',
    shadowColor: TQ.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 8,
  },
  tape: {
    position: 'absolute',
    left: '12%',
    right: '12%',
    height: 10,
    backgroundColor: TQ.white,
    borderRadius: 2,
  },
  edge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
});
