import React from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ShipmentCard } from '@/components/truckq/ShipmentCard';
import { useAuthUser } from '@/context/auth-user';
import { TQ, TQFonts } from '@/constants/truckq-design';

type Item = {
  id: string;
  code: string;
  companyName: string;
  deliveryDate: string;
  route: string;
  amount: string;
  outcome: 'Delivered' | 'Cancelled';
};

const SECTIONS: { title: string; data: Item[] }[] = [
  {
    title: 'May 2026',
    data: [
      {
        id: '1',
        code: '#P44L998201',
        companyName: 'Hello C Technologies',
        deliveryDate: 'May 18, 2026',
        route: 'Mutare → Harare',
        amount: 'USD 420',
        outcome: 'Delivered',
      },
      {
        id: '2',
        code: '#Q88R112004',
        companyName: 'Hello C Technologies',
        deliveryDate: 'May 16, 2026',
        route: 'Harare → Kadoma',
        amount: 'USD 310',
        outcome: 'Delivered',
      },
    ],
  },
  {
    title: 'April 2026',
    data: [
      {
        id: '3',
        code: '#L09K883201',
        companyName: 'Hello C Technologies',
        deliveryDate: 'Apr 28, 2026',
        route: 'Bulawayo → Plumtree',
        amount: 'USD 190',
        outcome: 'Delivered',
      },
      {
        id: '4',
        code: '#C33M009221',
        companyName: 'Hello C Technologies',
        deliveryDate: 'Apr 22, 2026',
        route: 'Masvingo → Harare',
        amount: '—',
        outcome: 'Cancelled',
      },
    ],
  },
];

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthUser();
  const company = user?.company ?? 'Your company';

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      <Text style={styles.title}>History</Text>
      <Text style={styles.sub}>Closed jobs stay here for your records and disputes window.</Text>

      <SectionList
        sections={SECTIONS.map((s) => ({
          ...s,
          data: s.data.map((item) => ({
            ...item,
            companyName: item.companyName || company,
          })),
        }))}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingBottom: insets.bottom + 88 }}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.section}>{title}</Text>
        )}
        renderItem={({ item }) => (
          <ShipmentCard
            boxWidth={64}
            style={{ marginBottom: 10 }}
            data={{
              code: item.code,
              companyName: item.companyName,
              deliveryDate: item.deliveryDate,
              route: item.route,
              status: item.outcome,
              amount: item.amount,
            }}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
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
    marginBottom: 16,
  },
  section: {
    fontFamily: TQFonts.semiBold,
    fontSize: 13,
    color: TQ.gray500,
    marginTop: 18,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
});
