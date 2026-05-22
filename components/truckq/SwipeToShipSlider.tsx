import { Feather, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useCallback } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  clamp,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { TQ, TQFonts, TQRadii } from '@/constants/truckq-design';

const THUMB = 52;
const PAD = 6;

type Props = {
  label?: string;
  onComplete: () => void;
  swipeEnabled?: boolean;
};

export function SwipeToShipSlider({
  label = 'Swipe To Shipping',
  onComplete,
  swipeEnabled = true,
}: Props) {
  const trackWidth = useSharedValue(0);
  const thumbX = useSharedValue(PAD);
  const startX = useSharedValue(PAD);
  const maxX = useSharedValue(PAD);

  const triggerComplete = useCallback(() => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onComplete();
  }, [onComplete]);

  const onTrackLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const w = e.nativeEvent.layout.width;
      trackWidth.value = w;
      const m = Math.max(PAD, w - THUMB - PAD * 2);
      maxX.value = m;
      thumbX.value = Math.min(thumbX.value, m);
    },
    [maxX, thumbX, trackWidth],
  );

  const pan = Gesture.Pan()
    .enabled(swipeEnabled)
    .onBegin(() => {
      startX.value = thumbX.value;
    })
    .onUpdate((ev) => {
      const next = startX.value + ev.translationX;
      thumbX.value = clamp(next, PAD, maxX.value);
    })
    .onEnd(() => {
      const threshold = PAD + (maxX.value - PAD) * 0.72;
      if (thumbX.value >= threshold) {
        thumbX.value = withSpring(maxX.value, { damping: 18, stiffness: 220 }, (finished) => {
          if (finished) runOnJS(triggerComplete)();
        });
      } else {
        thumbX.value = withSpring(PAD, { damping: 20, stiffness: 280 });
      }
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbX.value }],
  }));

  const hintStyle = useAnimatedStyle(() => {
    const p = maxX.value > PAD ? (thumbX.value - PAD) / (maxX.value - PAD) : 0;
    return { opacity: 1 - p * 0.85 };
  });

  return (
    <GestureDetector gesture={pan}>
      <View style={styles.wrap} accessibilityRole="adjustable" accessibilityLabel={label}>
        <View style={styles.track} onLayout={onTrackLayout}>
          <Animated.View style={[styles.hintRow, hintStyle]}>
            <Text style={styles.hintText}>{label}</Text>
            <View style={styles.chev}>
              <Ionicons name="chevron-forward" size={16} color={TQ.gray400} />
              <Ionicons name="chevron-forward" size={16} color={TQ.gray400} style={{ marginLeft: -10 }} />
              <Ionicons name="chevron-forward" size={16} color={TQ.gray400} style={{ marginLeft: -10 }} />
            </View>
          </Animated.View>
          <Animated.View style={[styles.thumb, thumbStyle]}>
            <View style={styles.thumbInner}>
              <Feather name="package" size={24} color={TQ.black} />
            </View>
          </Animated.View>
        </View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  track: {
    height: THUMB + PAD * 2,
    borderRadius: TQRadii.pill,
    backgroundColor: TQ.white,
    justifyContent: 'center',
    paddingHorizontal: PAD,
    shadowColor: TQ.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  hintRow: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: THUMB + 8,
    paddingRight: 16,
  },
  hintText: {
    fontFamily: TQFonts.semiBold,
    fontSize: 15,
    color: TQ.gray600,
    letterSpacing: 0.2,
  },
  chev: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  thumb: {
    position: 'absolute',
    left: PAD,
    top: PAD,
    width: THUMB,
    height: THUMB,
    borderRadius: TQRadii.pill,
    backgroundColor: TQ.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: TQ.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  thumbInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
