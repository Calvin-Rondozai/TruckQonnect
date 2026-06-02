import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
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

import { MapLocationPicker } from '@/components/truckq/MapLocationPicker';
import { usePostedLoads } from '@/context/posted-loads';
import { TQ, TQFonts, TQRadii } from '@/constants/truckq-design';
import { createShipmentLoad } from '@/lib/loads-api';
import { ApiError } from '@/lib/auth-api';
import { distanceKm, formatDistanceKm } from '@/lib/geo';
import type { MapLocation } from '@/lib/map-location';

const TRUCK_OPTIONS = ['Any truck', '15-ton tautliner', '20-ton refrigerated', '30-ton flatbed'];

export default function PlaceLoadScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { postLoad } = usePostedLoads();

  const [pickupLoc, setPickupLoc] = useState<MapLocation | null>(null);
  const [deliveryLoc, setDeliveryLoc] = useState<MapLocation | null>(null);
  const [pickerMode, setPickerMode] = useState<'pickup' | 'delivery' | null>(null);
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState('');
  const [truckType, setTruckType] = useState(TRUCK_OPTIONS[0]);
  const [budget, setBudget] = useState('');
  const [pickupWhen, setPickupWhen] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const routeKm = useMemo(() => {
    if (!pickupLoc || !deliveryLoc) return null;
    return distanceKm(pickupLoc, deliveryLoc);
  }, [pickupLoc, deliveryLoc]);

  const submit = async () => {
    if (!pickupLoc || !deliveryLoc) {
      Alert.alert('Pick locations', 'Set pickup and delivery points on the map.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Missing details', 'Describe what you are shipping.');
      return;
    }

    setSubmitting(true);
    try {
      const budgetStr = budget.trim()
        ? budget.trim().startsWith('USD')
          ? budget.trim()
          : `USD ${budget.trim()}`
        : 'Open to offers';

      const apiLoad = await createShipmentLoad({
        pickup_address: pickupLoc.address,
        destination_address: deliveryLoc.address,
        pickup_lat: pickupLoc.latitude,
        pickup_lng: pickupLoc.longitude,
        destination_lat: deliveryLoc.latitude,
        destination_lng: deliveryLoc.longitude,
        distance_km: routeKm ?? undefined,
        description: description.trim(),
        weight: weight.trim() || 'Not specified',
        truck_type: truckType,
        budget: budgetStr,
        pickup_when: pickupWhen.trim() || 'Flexible',
      });

      await postLoad(
        {
          pickup: pickupLoc.address,
          delivery: deliveryLoc.address,
          description: description.trim(),
          weight: weight.trim() || 'Not specified',
          truckType,
          budget: budgetStr,
          pickupWhen: pickupWhen.trim() || 'Flexible',
          distanceKm: routeKm ?? undefined,
        },
        { code: `#${apiLoad.load_id}`, shipmentLoadId: apiLoad.load_id }
      );

      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      const code = `#${apiLoad.load_id}`;
      Alert.alert(
        'Load posted',
        `${code} is live (${formatDistanceKm(routeKm ?? 0)}). Drivers can bid — track it anytime from Home.`,
        [
          {
            text: 'Track on map',
            onPress: () =>
              router.push({
                pathname: '/tracking/[id]',
                params: { id: apiLoad.load_id },
              }),
          },
          { text: 'View requests', onPress: () => router.replace('/(tabs)/requests' as const) },
          { text: 'Back home', onPress: () => router.back() },
        ],
      );
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : 'Could not post load. Check your connection.';
      Alert.alert('Post failed', msg);
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
            Pin exact pickup and delivery on the map — distance is calculated automatically.
          </Text>
        </View>

        <MapLocationField
          label="Pickup location"
          location={pickupLoc}
          onPress={() => setPickerMode('pickup')}
        />
        <MapLocationField
          label="Delivery location"
          location={deliveryLoc}
          onPress={() => setPickerMode('delivery')}
        />

        {routeKm != null ? (
          <View style={styles.distanceBanner}>
            <Feather name="navigation" size={18} color={TQ.black} />
            <Text style={styles.distanceText}>Route distance: {formatDistanceKm(routeKm)}</Text>
          </View>
        ) : null}

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

      <MapLocationPicker
        visible={pickerMode === 'pickup'}
        title="Pickup point"
        initial={pickupLoc}
        onClose={() => setPickerMode(null)}
        onConfirm={(loc) => {
          setPickupLoc(loc);
          setPickerMode(null);
        }}
      />
      <MapLocationPicker
        visible={pickerMode === 'delivery'}
        title="Delivery point"
        initial={deliveryLoc}
        onClose={() => setPickerMode(null)}
        onConfirm={(loc) => {
          setDeliveryLoc(loc);
          setPickerMode(null);
        }}
      />
    </KeyboardAvoidingView>
  );
}

function MapLocationField({
  label,
  location,
  onPress,
}: {
  label: string;
  location: MapLocation | null;
  onPress: () => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={({ pressed }) => [styles.mapField, pressed && { opacity: 0.92 }]} onPress={onPress}>
        <View style={styles.mapFieldIcon}>
          <Feather name="map-pin" size={18} color={TQ.black} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={location ? styles.mapFieldValue : styles.mapFieldPlaceholder} numberOfLines={2}>
            {location?.address ?? 'Tap to pick on map'}
          </Text>
          {location ? (
            <Text style={styles.mapFieldCoords}>
              {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </Text>
          ) : null}
        </View>
        <Feather name="chevron-right" size={20} color={TQ.gray400} />
      </Pressable>
    </View>
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
  mapField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: TQ.white,
    borderRadius: TQRadii.md,
    borderWidth: 1,
    borderColor: TQ.gray200,
    padding: 12,
    minHeight: 56,
  },
  mapFieldIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: TQ.yellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapFieldPlaceholder: {
    fontFamily: TQFonts.medium,
    fontSize: 15,
    color: TQ.gray400,
  },
  mapFieldValue: {
    fontFamily: TQFonts.medium,
    fontSize: 14,
    color: TQ.ink,
    lineHeight: 20,
  },
  mapFieldCoords: {
    marginTop: 4,
    fontFamily: TQFonts.regular,
    fontSize: 11,
    color: TQ.gray500,
  },
  distanceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: TQ.greenSoft,
    borderRadius: TQRadii.md,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: TQ.green,
  },
  distanceText: {
    fontFamily: TQFonts.semiBold,
    fontSize: 15,
    color: TQ.ink,
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
