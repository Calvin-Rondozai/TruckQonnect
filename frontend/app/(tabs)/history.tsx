import { Feather } from '@expo/vector-icons';
import React from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TQ, TQFonts, TQRadii } from '@/constants/truckq-design';

type Item = { id: string; code: string; lane: string; amount: string; outcome: 'Delivered' | 'Cancelled' };

const SECTIONS: { title: string; data: Item[] }[] = [
  {
    title: 'May 2026',
    data: [
      { id: '1', code: '#P44L998201', lane: 'Mutare → Harare', amount: 'USD 420', outcome: 'Delivered' },
      { id: '2', code: '#Q88R112004', lane: 'Harare → Kadoma', amount: 'USD 310', outcome: 'Delivered' },
    ],
  },
  {
    title: 'April 2026',
    data: [
      { id: '3', code: '#L09K883201', lane: 'Bulawayo → Plumtree', amount: 'USD 190', outcome: 'Delivered' },
      { id: '4', code: '#C33M009221', lane: 'Masvingo → Harare', amount: '—', outcome: 'Cancelled' },
    ],
  },
];

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      <Text style={styles.title}>History</Text>
      <Text style={styles.sub}>Closed jobs stay here for your records and disputes window.</Text>

      <SectionList
        sections={SECTIONS}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingBottom: insets.bottom + 88 }}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.section}>{title}</Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.iconWrap}>
              <Feather name="package" size={20} color={TQ.gray600} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.code}>{item.code}</Text>
              <Text style={styles.lane}>{item.lane}</Text>
              <Text style={styles.amount}>{item.amount}</Text>
            </View>
            <View
              style={[
                styles.outcome,
                item.outcome === 'Cancelled' && { backgroundColor: TQ.gray200 },
              ]}
            >
              <Text
                style={[
                  styles.outcomeText,
                  item.outcome === 'Cancelled' && { color: TQ.gray600 },
                ]}
              >
                {item.outcome}
              </Text>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TQ.white,
    borderRadius: TQRadii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: TQ.gray200,
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: TQ.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  code: {
    fontFamily: TQFonts.bold,
    fontSize: 16,
    color: TQ.ink,
  },
  lane: {
    marginTop: 2,
    fontFamily: TQFonts.regular,
    fontSize: 13,
    color: TQ.gray600,
  },
  amount: {
    marginTop: 4,
    fontFamily: TQFonts.medium,
    fontSize: 13,
    color: TQ.gray500,
  },
  outcome: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: TQRadii.pill,
    backgroundColor: TQ.greenSoft,
  },
  outcomeText: {
    fontFamily: TQFonts.semiBold,
    fontSize: 11,
    color: TQ.green,
  },
});
