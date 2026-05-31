import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { FilterChips, LoadCard, OwnerSearchBar, OwnerScreen } from '@/components/owner/OwnerUIKit';
import { OW, TQFonts } from '@/constants/owner-design';
import { AVAILABLE_LOADS } from '@/lib/owner-mock-data';

const FILTERS = ['All', 'Nearby', 'Urgent', 'High pay'];

export default function OwnerLoadsScreen() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const data = useMemo(() => {
    let list = AVAILABLE_LOADS;
    if (filter === 'Urgent') list = list.filter((l) => l.urgent);
    if (filter === 'High pay') list = list.filter((l) => l.budget >= 700);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (l) =>
          l.pickup.toLowerCase().includes(q) ||
          l.dropoff.toLowerCase().includes(q) ||
          l.cargoType.toLowerCase().includes(q)
      );
    }
    return list;
  }, [search, filter]);

  return (
    <OwnerScreen edges={['top']}>
      <View style={styles.head}>
        <Text style={styles.title}>Available Loads</Text>
        <Text style={styles.sub}>{data.length} loads near you</Text>
      </View>
      <OwnerSearchBar value={search} onChangeText={setSearch} />
      <FilterChips options={FILTERS} selected={filter} onSelect={setFilter} />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <LoadCard
            load={item}
            onDetails={() =>
              router.push({ pathname: '/owner/load/[id]', params: { id: item.id } })
            }
            onBid={() => router.push({ pathname: '/owner/bid/[id]', params: { id: item.id } })}
          />
        )}
      />
    </OwnerScreen>
  );
}

const styles = StyleSheet.create({
  head: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title: { fontFamily: TQFonts.bold, fontSize: 24, color: OW.black },
  sub: { fontFamily: TQFonts.regular, fontSize: 13, color: OW.gray500, marginTop: 4 },
  list: { paddingHorizontal: 20, paddingBottom: 24 },
});
