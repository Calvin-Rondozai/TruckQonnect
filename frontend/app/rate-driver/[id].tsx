import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TQ, TQFonts, TQRadii } from '@/constants/truckq-design';

const DRIVER_AVATAR =
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80';

export default function RateDriverScreen() {
  const { id, driver } = useLocalSearchParams<{ id: string; driver?: string }>();
  const insets = useSafeAreaInsets();
  const driverName = typeof driver === 'string' ? driver : 'Your driver';
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const submit = () => {
    if (rating < 1) {
      Alert.alert('Rating required', 'Please select at least one star.');
      return;
    }
    Alert.alert('Thank you!', 'Your rating has been submitted.', [
      { text: 'OK', onPress: () => router.replace('/(tabs)') },
    ]);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }]}>
      <Pressable style={styles.back} onPress={() => router.back()}>
        <Feather name="chevron-left" size={24} color={TQ.black} />
      </Pressable>

      <Text style={styles.title}>Rate your driver</Text>
      <Text style={styles.sub}>How was your delivery experience?</Text>

      <Image source={{ uri: DRIVER_AVATAR }} style={styles.avatar} />
      <Text style={styles.driverName}>{driverName}</Text>
      <Text style={styles.shipment}>
        Shipment {Array.isArray(id) ? id[0] : id ?? '—'}
      </Text>

      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Pressable key={star} onPress={() => setRating(star)} hitSlop={8}>
            <Feather
              name="star"
              size={36}
              color={star <= rating ? TQ.yellow : TQ.gray300}
              style={star <= rating ? styles.starFilled : undefined}
            />
          </Pressable>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Add a comment (optional)"
        placeholderTextColor={TQ.gray400}
        value={comment}
        onChangeText={setComment}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <Pressable style={styles.submitBtn} onPress={submit}>
        <Text style={styles.submitText}>Submit rating</Text>
      </Pressable>

      <Pressable onPress={() => router.replace('/(tabs)')}>
        <Text style={styles.skip}>Skip for now</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: TQ.white, paddingHorizontal: 24 },
  back: { width: 44, height: 44, justifyContent: 'center' },
  title: { fontFamily: TQFonts.bold, fontSize: 24, color: TQ.ink, textAlign: 'center', marginTop: 8 },
  sub: { fontFamily: TQFonts.regular, fontSize: 14, color: TQ.gray500, textAlign: 'center', marginTop: 6 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginTop: 24,
    borderWidth: 3,
    borderColor: TQ.yellow,
  },
  driverName: { fontFamily: TQFonts.bold, fontSize: 18, color: TQ.ink, textAlign: 'center', marginTop: 12 },
  shipment: { fontFamily: TQFonts.regular, fontSize: 13, color: TQ.gray500, textAlign: 'center', marginTop: 4 },
  stars: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 24, marginBottom: 20 },
  starFilled: {},
  input: {
    backgroundColor: TQ.gray100,
    borderRadius: TQRadii.md,
    borderWidth: 1,
    borderColor: TQ.gray200,
    padding: 14,
    minHeight: 100,
    fontFamily: TQFonts.regular,
    fontSize: 15,
    color: TQ.ink,
  },
  submitBtn: {
    marginTop: 20,
    backgroundColor: TQ.yellow,
    borderRadius: TQRadii.lg,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitText: { fontFamily: TQFonts.bold, fontSize: 16, color: TQ.black },
  skip: {
    fontFamily: TQFonts.semiBold,
    fontSize: 14,
    color: TQ.gray500,
    textAlign: 'center',
    marginTop: 16,
  },
});
