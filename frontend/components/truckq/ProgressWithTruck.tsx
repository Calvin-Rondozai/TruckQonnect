import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { TQ } from '@/constants/truckq-design';

type Props = {
  progress: number; // 0–1
  animate?: boolean;
  height?: number;
};

export function ProgressWithTruck({ progress, animate = true, height = 6 }: Props) {
  const barW = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (!animate) return;
    pulse.value = withRepeat(
      withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [animate, pulse]);

  const truckStyle = useAnimatedStyle(() => {
    const w = barW.value;
    const p = Math.min(1, Math.max(0, progress));
    const x = w > 24 ? (w - 24) * p : 0;
    const bob = animate ? Math.sin(pulse.value * Math.PI) * 1.5 : 0;
    return {
      transform: [{ translateX: x }, { translateY: bob }],
    };
  });

  const onBarLayout = (e: LayoutChangeEvent) => {
    barW.value = e.nativeEvent.layout.width;
  };

  return (
    <View style={styles.row}>
      <View style={[styles.track, { height }]} onLayout={onBarLayout}>
        <View style={[styles.fill, { width: `${Math.round(progress * 100)}%`, height }]} />
        <Animated.View style={[styles.truck, truckStyle]}>
          <View style={styles.truckBubble}>
            <MaterialCommunityIcons name="truck" size={14} color={TQ.black} />
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
  },
  track: {
    width: '100%',
    borderRadius: 99,
    backgroundColor: 'rgba(10,10,10,0.12)',
    overflow: 'visible',
  },
  fill: {
    borderRadius: 99,
    backgroundColor: TQ.black,
  },
  truck: {
    position: 'absolute',
    left: 0,
    top: -13,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  truckBubble: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: TQ.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: TQ.black,
    shadowColor: TQ.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
});
