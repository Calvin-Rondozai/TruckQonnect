import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { TQ, TQFonts, TQRadii } from '@/constants/truckq-design';

export default function CargoSettingsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <Feather name="chevron-left" size={24} color={TQ.black} />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.backBtn} />
      </View>
      <View style={styles.body}>
        <Row label="Push notifications" />
        <Row label="SMS alerts" />
        <Pressable style={styles.row} onPress={() => router.push('/choose-role')}>
          <Text style={styles.rowLabel}>Switch role</Text>
          <Feather name="chevron-right" size={20} color={TQ.gray400} />
        </Pressable>
        <Pressable style={styles.row}>
          <Text style={styles.rowLabel}>Privacy Policy</Text>
        </Pressable>
        <Pressable style={styles.row}>
          <Text style={styles.rowLabel}>Terms of Service</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Row({ label }: { label: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch value trackColor={{ true: TQ.yellow }} thumbColor={TQ.white} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: TQ.gray100 },
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
  body: { padding: 20, gap: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: TQ.white,
    padding: 16,
    borderRadius: TQRadii.md,
    borderWidth: 1,
    borderColor: TQ.gray200,
  },
  rowLabel: { fontFamily: TQFonts.medium, fontSize: 15, color: TQ.ink },
});
