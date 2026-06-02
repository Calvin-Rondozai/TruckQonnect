import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { OwnerScreen } from '@/components/owner/OwnerUIKit';
import { ShipmentCard } from '@/components/truckq/ShipmentCard';
import { OW, TQFonts, TQRadii } from '@/constants/owner-design';
import { OWNER_HISTORY } from '@/lib/owner-mock-data';
import type { OwnerHistoryItem } from '@/lib/owner-types';

const TABS = ['Completed', 'Cancelled', 'Ongoing'] as const;

export default function OwnerHistoryScreen() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Completed');

  const data = useMemo(() => {
    const map = { Completed: 'completed', Cancelled: 'cancelled', Ongoing: 'ongoing' } as const;
    return OWNER_HISTORY.filter((h) => h.status === map[tab]);
  }, [tab]);

  return (
    <OwnerScreen edges={['top']}>
      <View style={styles.head}>
        <Text style={styles.title}>History</Text>
      </View>
      <View style={styles.tabs}>
        {TABS.map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.tabOn]}>
            <Text style={[styles.tabText, tab === t && styles.tabTextOn]}>{t}</Text>
          </Pressable>
        ))}
      </View>
      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No {tab.toLowerCase()} trips yet</Text>}
        renderItem={({ item }) => <HistoryCard item={item} />}
      />
    </OwnerScreen>
  );
}

function HistoryCard({ item }: { item: OwnerHistoryItem }) {
  const statusLabel =
    item.status === 'completed' ? 'Delivered' : item.status === 'cancelled' ? 'Cancelled' : 'Ongoing';

  return (
    <ShipmentCard
      boxWidth={64}
      style={{ marginBottom: 12 }}
      data={{
        code: `#${item.id.toUpperCase()}`,
        companyName: item.customerCompany,
        deliveryDate: item.deliveryDate,
        route: `${item.pickup} → ${item.dropoff}`,
        status: statusLabel,
        subtitle: item.cargoType,
        amount: `$${item.earnings}`,
      }}
      footer={
        item.status === 'ongoing' ? (
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/owner/active-delivery/[id]',
                params: { id: 'delivery-1' },
              })
            }
          >
            <Text style={styles.track}>Track delivery →</Text>
          </Pressable>
        ) : item.status === 'completed' ? (
          <Pressable
            onPress={() =>
              router.push({ pathname: '/owner/completed/[id]', params: { id: item.id } })
            }
          >
            <Text style={styles.track}>View summary →</Text>
          </Pressable>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  head: { padding: 20 },
  title: { fontFamily: TQFonts.bold, fontSize: 24, color: OW.black },
  tabs: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 12 },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: TQRadii.pill,
    backgroundColor: OW.white,
    borderWidth: 1,
    borderColor: OW.gray200,
  },
  tabOn: { backgroundColor: OW.yellow, borderColor: OW.yellow },
  tabText: { fontFamily: TQFonts.medium, fontSize: 13, color: OW.gray500 },
  tabTextOn: { fontFamily: TQFonts.bold, color: OW.black },
  list: { paddingHorizontal: 20, paddingBottom: 24 },
  empty: { textAlign: 'center', fontFamily: TQFonts.regular, color: OW.gray500, marginTop: 40 },
  track: { fontFamily: TQFonts.semiBold, fontSize: 13, color: OW.yellowDeep, marginTop: 4 },
});
