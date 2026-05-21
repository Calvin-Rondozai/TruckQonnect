import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { OwnerScreen, StatusBadge } from '@/components/owner/OwnerUIKit';
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
  const tone = item.status === 'completed' ? 'green' : item.status === 'cancelled' ? 'red' : 'yellow';
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Text style={styles.cargo}>{item.cargoType}</Text>
        <StatusBadge label={item.status} tone={tone} />
      </View>
      <Text style={styles.route}>{item.pickup} → {item.dropoff}</Text>
      <View style={styles.cardFoot}>
        <Text style={styles.earn}>${item.earnings}</Text>
        <Text style={styles.date}>{item.date}</Text>
        <Text style={styles.rating}>★ {item.customerRating}</Text>
      </View>
      {item.status === 'ongoing' ? (
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
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  head: { padding: 20 },
  title: { fontFamily: TQFonts.bold, fontSize: 24, color: OW.black },
  tabs: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 12 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: TQRadii.pill, backgroundColor: OW.white, borderWidth: 1, borderColor: OW.gray200 },
  tabOn: { backgroundColor: OW.yellow, borderColor: OW.yellow },
  tabText: { fontFamily: TQFonts.medium, fontSize: 13, color: OW.gray500 },
  tabTextOn: { fontFamily: TQFonts.bold, color: OW.black },
  list: { paddingHorizontal: 20, paddingBottom: 24 },
  empty: { textAlign: 'center', fontFamily: TQFonts.regular, color: OW.gray500, marginTop: 40 },
  card: { backgroundColor: OW.white, borderRadius: TQRadii.lg, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: OW.gray200 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  cargo: { fontFamily: TQFonts.bold, fontSize: 15, color: OW.black },
  route: { fontFamily: TQFonts.regular, fontSize: 13, color: OW.gray500 },
  cardFoot: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 10 },
  earn: { fontFamily: TQFonts.bold, fontSize: 18, color: OW.black },
  date: { fontFamily: TQFonts.regular, fontSize: 12, color: OW.gray500, flex: 1 },
  rating: { fontFamily: TQFonts.semiBold, fontSize: 12, color: OW.yellowDeep },
  track: { fontFamily: TQFonts.semiBold, fontSize: 13, color: OW.yellowDeep, marginTop: 10 },
});
