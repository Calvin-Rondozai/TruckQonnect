import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { OwnerButton, OwnerScreen } from '@/components/owner/OwnerUIKit';
import { OW, TQFonts, TQRadii } from '@/constants/owner-design';
import { ACTIVE_DELIVERY } from '@/lib/owner-mock-data';

export default function CompletedLoadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <OwnerScreen edges={['top', 'bottom']}>
      <View style={styles.center}>
        <View style={styles.check}>
          <Feather name="check" size={48} color={OW.white} />
        </View>
        <Text style={styles.title}>Delivery Complete!</Text>
        <Text style={styles.sub}>Great job — payment will reflect shortly</Text>
        <View style={styles.card}>
          <Row label="Earnings" val={`$${ACTIVE_DELIVERY.earnings}`} bold />
          <Row label="Route" val={`${ACTIVE_DELIVERY.pickup} → ${ACTIVE_DELIVERY.dropoff}`} />
          <Row label="Customer rating" val="★ 4.9" />
          <Row label="Trip ID" val={id ?? ACTIVE_DELIVERY.id} />
        </View>
        <OwnerButton label="Done" onPress={() => router.replace('/(owner-tabs)' as never)} />
        <OwnerButton
          label="Return Home"
          variant="outline"
          onPress={() => router.replace('/(owner-tabs)' as never)}
        />
      </View>
    </OwnerScreen>
  );
}

function Row({ label, val, bold }: { label: string; val: string; bold?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowVal, bold && styles.rowValBold]}>{val}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', padding: 24, gap: 14 },
  check: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: OW.green,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: { fontFamily: TQFonts.bold, fontSize: 26, color: OW.black, textAlign: 'center' },
  sub: { fontFamily: TQFonts.regular, fontSize: 14, color: OW.gray500, textAlign: 'center' },
  card: { backgroundColor: OW.white, borderRadius: TQRadii.lg, padding: 18, borderWidth: 1, borderColor: OW.gray200, gap: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  rowLabel: { fontFamily: TQFonts.regular, fontSize: 13, color: OW.gray500 },
  rowVal: { fontFamily: TQFonts.medium, fontSize: 13, color: OW.black, maxWidth: '55%', textAlign: 'right' },
  rowValBold: { fontFamily: TQFonts.bold, fontSize: 18, color: OW.yellowDeep },
});
