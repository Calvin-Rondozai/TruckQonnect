import { Feather } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HighlightTitle } from '@/components/truckq/HighlightTitle';
import { OnboardingArtCargo } from '@/components/truckq/onboarding/OnboardingArtCargo';
import { OnboardingArtSafe } from '@/components/truckq/onboarding/OnboardingArtSafe';
import { OnboardingArtTracking } from '@/components/truckq/onboarding/OnboardingArtTracking';
import { TQ, TQFonts, TQRadii } from '@/constants/truckq-design';

const { width: SCREEN_W } = Dimensions.get('window');

type Slide = {
  id: string;
  Art: React.ComponentType;
  title: React.ComponentProps<typeof HighlightTitle>['parts'];
  subtitle: string;
  cta: string;
};

const SLIDES: Slide[] = [
  {
    id: '1',
    Art: OnboardingArtCargo,
    title: [
      { text: 'Your ' },
      { text: 'Cargo', highlight: true },
      { text: ', Our Priority' },
    ],
    subtitle: 'Choose from a variety of trucks and reliable drivers for any delivery need.',
    cta: 'Next',
  },
  {
    id: '2',
    Art: OnboardingArtTracking,
    title: [
      { text: 'Track Every Move in ' },
      { text: 'Real Time', highlight: true },
    ],
    subtitle: 'Live tracking keeps you updated from pickup to delivery.',
    cta: 'Next',
  },
  {
    id: '3',
    Art: OnboardingArtSafe,
    title: [
      { text: 'Safe Delivery, ' },
      { text: 'Every Time', highlight: true },
    ],
    subtitle: 'Verified drivers, secure handling, and on-time delivery you can count on.',
    cta: 'Get Started',
  },
];

type Props = {
  onComplete: () => void;
  onSkip: () => void;
};

export function IntroOnboardingScreen({ onComplete, onSkip }: Props) {
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
    setIndex(i);
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0]?.index != null) setIndex(viewableItems[0].index);
  }).current;

  const goNext = () => {
    if (index >= SLIDES.length - 1) {
      onComplete();
      return;
    }
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  };

  const slide = SLIDES[index];

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <Pressable style={[styles.skip, { top: insets.top + 8 }]} onPress={onSkip} hitSlop={12}>
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => {
          const Art = item.Art;
          return (
            <View style={[styles.page, { width: SCREEN_W }]}>
              <View style={styles.art}>
                <Art />
              </View>
            </View>
          );
        }}
      />

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
        <HighlightTitle parts={slide.title} />
        <Text style={styles.subtitle}>{slide.subtitle}</Text>

        <View style={styles.dots}>
          {SLIDES.map((s, i) => (
            <View key={s.id} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [styles.cta, pressed && { opacity: 0.92 }]}
          onPress={goNext}
        >
          <Text style={styles.ctaText}>{slide.cta}</Text>
          {index < SLIDES.length - 1 ? (
            <Feather name="arrow-right" size={20} color={TQ.black} style={{ marginLeft: 8 }} />
          ) : null}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: TQ.white,
  },
  skip: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  skipText: {
    fontFamily: TQFonts.semiBold,
    fontSize: 15,
    color: TQ.gray600,
  },
  page: {
    flex: 1,
  },
  art: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 48,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 8,
    backgroundColor: TQ.white,
    marginBottom: '15%',
  },
  subtitle: {
    marginTop: 12,
    fontFamily: TQFonts.regular,
    fontSize: 16,
    lineHeight: 22,
    color: TQ.gray600,
    marginBottom: 30,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: TQ.gray300,
  },
  dotActive: {
    width: 24,
    backgroundColor: TQ.yellow,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TQ.yellow,
    borderRadius: TQRadii.pill,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    shadowColor: TQ.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  ctaText: {
    fontFamily: TQFonts.bold,
    fontSize: 17,
    color: TQ.black,
  },
});
