import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ShipmentCard } from '@/components/truckq/ShipmentCard';
import { ProgressWithTruck } from '@/components/truckq/ProgressWithTruck';
import { DRIVERS, SHIPMENTS } from '@/lib/mock-data';
import { TQ, TQFonts, TQRadii } from '@/constants/truckq-design';

export default function TrackTabScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return SHIPMENTS;
    return SHIPMENTS.filter(
      (r) =>
        r.code.toLowerCase().includes(s) ||
        r.from.toLowerCase().includes(s) ||
        r.companyName.toLowerCase().includes(s) ||
        DRIVERS[r.driverId]?.name.toLowerCase().includes(s),
    );
  }, [q]);

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      <Text style={styles.title}>Track</Text>
      <Text style={styles.sub}>
        Tap a shipment to view the driver carrying your goods — call, message, or open live map.
      </Text>

      <View style={styles.search}>
        <Feather name="search" size={18} color={TQ.gray400} style={{ marginRight: 10 }} />
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search by ID, city, or driver"
          placeholderTextColor={TQ.gray400}
          style={styles.input}
        />
        {q.length > 0 ? (
          <Pressable onPress={() => setQ('')} hitSlop={10}>
            <Feather name="x" size={18} color={TQ.gray500} />
          </Pressable>
        ) : null}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingBottom: insets.bottom + 88, paddingTop: 8 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => {
          const driver = DRIVERS[item.driverId];
          return (
            <ShipmentCard
              boxWidth={68}
              data={{
                code: item.code,
                companyName: item.companyName,
                deliveryDate: item.deliveryDate,
                route: `${item.from} → ${item.to}`,
                status: 'In transit',
                subtitle: driver ? `Driver · ${driver.name}` : undefined,
              }}
              onPress={() =>
                router.push({
                  pathname: '/driver/[id]',
                  params: { id: item.code.replace('#', '') },
                })
              }
              footer={<ProgressWithTruck progress={item.progress} />}
            />
          );
        }}
        ListEmptyComponent={
          <Text style={styles.empty}>No matches — try another ID or corridor.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: TQ.gray100,
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: TQFonts.bold,
    fontSize: 28,
    color: TQ.ink,
    letterSpacing: -0.4,
  },
  sub: {
    marginTop: 8,
    fontFamily: TQFonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: TQ.gray600,
    marginBottom: 14,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TQ.white,
    borderRadius: TQRadii.lg,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: TQ.gray200,
  },
  input: {
    flex: 1,
    fontFamily: TQFonts.medium,
    fontSize: 15,
    color: TQ.ink,
    paddingVertical: 0,
  },
  empty: {
    textAlign: 'center',
    marginTop: 32,
    fontFamily: TQFonts.regular,
    fontSize: 14,
    color: TQ.gray500,
  },
});
