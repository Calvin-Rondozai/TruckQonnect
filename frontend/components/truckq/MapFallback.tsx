/**
 * Web / dev fallback when native maps are unavailable — still matches app chrome.
 */
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { TQ, TQFonts, TQRadii } from '@/constants/truckq-design';

export function MapFallback() {
  return (
    <View style={styles.root}>
      <LinearGradient colors={['#E8EDF4', '#F5F7FA', '#EEF2F6']} style={StyleSheet.absoluteFill} />
      <View style={[styles.block, { top: '18%', left: '8%', width: '22%', height: '12%' }]} />
      <View style={[styles.block, { top: '42%', right: '12%', width: '28%', height: '9%' }]} />
      <View style={[styles.block, { bottom: '28%', left: '18%', width: '20%', height: '14%' }]} />
      <View style={styles.route}>
        <View style={[styles.line, styles.lineGreen]} />
        <View style={[styles.line, styles.lineYellow]} />
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Map preview</Text>
        <Text style={styles.badgeSub}>Full live map on iOS & Android</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
  },
  block: {
    position: 'absolute',
    borderRadius: TQRadii.sm,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(10,10,10,0.04)',
  },
  route: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    position: 'absolute',
    width: '70%',
    height: 5,
    borderRadius: 99,
    opacity: 0.85,
  },
  lineGreen: {
    backgroundColor: TQ.green,
    transform: [{ rotate: '-18deg' }, { translateY: -28 }],
  },
  lineYellow: {
    backgroundColor: TQ.yellowDeep,
    transform: [{ rotate: '12deg' }, { translateY: 36 }],
  },
  badge: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: TQRadii.md,
    borderWidth: 1,
    borderColor: TQ.gray200,
  },
  badgeText: {
    fontFamily: TQFonts.semiBold,
    fontSize: 13,
    color: TQ.ink,
    textAlign: 'center',
  },
  badgeSub: {
    marginTop: 2,
    fontFamily: TQFonts.regular,
    fontSize: 11,
    color: TQ.gray500,
    textAlign: 'center',
  },
});
