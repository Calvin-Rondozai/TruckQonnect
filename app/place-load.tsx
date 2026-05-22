import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePostedLoads } from '@/context/posted-loads';
import { useShipperProfile } from '@/context/shipper-profile';
import { TQ, TQFonts, TQRadii } from '@/constants/truckq-design';

const TRUCK_OPTIONS = ['Any truck', '15-ton tautliner', '20-ton refrigerated', '30-ton flatbed'];

export default function PlaceLoadScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile } = useShipperProfile();
  const { postLoad } = usePostedLoads();

  const [pickup, setPickup] = useState(profile.city);
  const [delivery, setDelivery] = useState('');
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState('');
  const [truckType, setTruckType] = useState(TRUCK_OPTIONS[0]);
  const [budget, setBudget] = useState('');
  const [pickupWhen, setPickupWhen] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!pickup.trim() || !delivery.trim() || !description.trim()) {
      Alert.alert('Missing details', 'Add pickup, delivery, and what you are shipping.');
      return;
    }

    setSubmitting(true);
    try {
      const load = await postLoad({
        pickup: pickup.trim(),
        delivery: delivery.trim(),
        description: description.trim(),
        weight: weight.trim() || 'Not specified',
        truckType,
        budget: budget.trim() ? (budget.trim().startsWith('USD') ? budget.trim() : `USD ${budget.trim()}`) : 'Open to offers',
        pickupWhen: pickupWhen.trim() || 'Flexible',
      });

      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Alert.alert(
        'Load posted',
        `${load.code} is live. Drivers across Zimbabwe can bid — check Requests for incoming offers.`,
        [
          { text: 'View requests', onPress: () => router.replace('/(tabs)/requests' as const) },
          { text: 'Back home', onPress: () => router.back() },
        ],
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <Feather name="chevron-left" size={26} color={TQ.black} />
        </Pressable>
        <Text style={styles.headerTitle}>Place a load</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.banner}>
          <MaterialCommunityIcons name="truck-outline" size={28} color={TQ.black} />
          <Text style={styles.bannerText}>
            Post your shipment and let verified drivers bid — you stay in control until you accept.
          </Text>
        </View>

        <Field label="Pickup location" value={pickup} onChangeText={setPickup} placeholder="e.g. Harare CBD" />
        <Field label="Delivery location" value={delivery} onChangeText={setDelivery} placeholder="e.g. Bulawayo" />

        <Field
          label="What are you shipping?"
          value={description}
          onChangeText={setDescription}
          placeholder="Pallets, maize, equipment…"
          multiline
        />

        <Field label="Weight (optional)" value={weight} onChangeText={setWeight} placeholder="e.g. 12 tonnes" />

        <Text style={styles.label}>Truck type needed</Text>
        <View style={styles.chips}>
          {TRUCK_OPTIONS.map((opt) => (
            <Pressable
              key={opt}
              style={[styles.chip, truckType === opt && styles.chipActive]}
              onPress={() => setTruckType(opt)}
            >
              <Text style={[styles.chipText, truckType === opt && styles.chipTextActive]}>{opt}</Text>
            </Pressable>
          ))}
        </View>

        <Field label="Your budget (optional)" value={budget} onChangeText={setBudget} placeholder="e.g. 450" />
        <Field
          label="When to pick up"
          value={pickupWhen}
          onChangeText={setPickupWhen}
          placeholder="Today 14:00, tomorrow morning…"
        />

        <Pressable
          style={({ pressed }) => [styles.submitBtn, pressed && { opacity: 0.92 }, submitting && { opacity: 0.7 }]}
          onPress={submit}
          disabled={submitting}
        >
          <Feather name="send" size={20} color={TQ.black} />
          <Text style={styles.submitText}>{submitting ? 'Posting…' : 'Post load for drivers'}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  multiline?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={TQ.gray400}
        style={[styles.input, multiline && styles.inputMulti]}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: TQ.gray100 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 12,
    backgroundColor: TQ.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: TQ.gray200,
  },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: TQFonts.semiBold, fontSize: 17, color: TQ.ink },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: TQ.yellow,
    borderRadius: TQRadii.lg,
    padding: 16,
    marginTop: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  bannerText: {
    flex: 1,
    fontFamily: TQFonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: TQ.gray700,
  },
  field: { marginBottom: 16 },
  label: {
    fontFamily: TQFonts.medium,
    fontSize: 13,
    color: TQ.gray600,
    marginBottom: 8,
  },
  input: {
    backgroundColor: TQ.white,
    borderRadius: TQRadii.md,
    borderWidth: 1,
    borderColor: TQ.gray200,
    paddingHorizontal: 14,
    minHeight: 50,
    fontFamily: TQFonts.medium,
    fontSize: 15,
    color: TQ.ink,
  },
  inputMulti: {
    minHeight: 88,
    paddingTop: 12,
    paddingBottom: 12,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: TQRadii.pill,
    backgroundColor: TQ.white,
    borderWidth: 1,
    borderColor: TQ.gray200,
  },
  chipActive: {
    backgroundColor: TQ.yellow,
    borderColor: TQ.black,
  },
  chipText: {
    fontFamily: TQFonts.medium,
    fontSize: 12,
    color: TQ.gray600,
  },
  chipTextActive: {
    fontFamily: TQFonts.semiBold,
    color: TQ.black,
  },
  submitBtn: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: TQ.yellow,
    borderRadius: TQRadii.lg,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  submitText: {
    fontFamily: TQFonts.bold,
    fontSize: 16,
    color: TQ.black,
  },
});
