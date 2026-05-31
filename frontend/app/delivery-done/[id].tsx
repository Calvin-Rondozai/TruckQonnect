import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PackageStackIllustration } from '@/components/truckq/PackageStackIllustration';
import { TQ, TQFonts, TQRadii } from '@/constants/truckq-design';

export default function DeliveryDoneScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const shipmentId = Array.isArray(id) ? id[0] : id ?? '—';

  return (
    <View style={[styles.root, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      <View style={styles.iconWrap}>
        <Feather name="check-circle" size={72} color={TQ.green} />
      </View>
      <Text style={styles.title}>Delivery complete!</Text>
      <Text style={styles.sub}>
        Shipment {shipmentId.startsWith('#') ? shipmentId : `#${shipmentId}`} has been delivered
        successfully.
      </Text>

      <PackageStackIllustration />

      <View style={styles.card}>
        <Row label="Status" value="Delivered" />
        <Row label="Payment" value="Processing" />
      </View>

      <Pressable
        style={styles.primaryBtn}
        onPress={() =>
          router.replace({
            pathname: '/rate-driver/[id]',
            params: { id: shipmentId, driver: 'Guy Hawkins' },
          })
        }
      >
        <Text style={styles.primaryText}>Rate your driver</Text>
      </Pressable>

      <Pressable style={styles.secondaryBtn} onPress={() => router.replace('/(tabs)')}>
        <Text style={styles.secondaryText}>Back to home</Text>
      </Pressable>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: TQ.white, paddingHorizontal: 24, alignItems: 'center' },
  iconWrap: { marginBottom: 16 },
  title: { fontFamily: TQFonts.bold, fontSize: 26, color: TQ.ink, textAlign: 'center' },
  sub: {
    fontFamily: TQFonts.regular,
    fontSize: 15,
    color: TQ.gray500,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 20,
  },
  card: {
    width: '100%',
    backgroundColor: TQ.gray100,
    borderRadius: TQRadii.lg,
    padding: 18,
    gap: 12,
    marginVertical: 20,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  rowLabel: { fontFamily: TQFonts.regular, fontSize: 14, color: TQ.gray600 },
  rowValue: { fontFamily: TQFonts.semiBold, fontSize: 14, color: TQ.ink },
  primaryBtn: {
    width: '100%',
    backgroundColor: TQ.yellow,
    borderRadius: TQRadii.lg,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryText: { fontFamily: TQFonts.bold, fontSize: 16, color: TQ.black },
  secondaryBtn: { paddingVertical: 12 },
  secondaryText: { fontFamily: TQFonts.semiBold, fontSize: 15, color: TQ.gray600 },
});
