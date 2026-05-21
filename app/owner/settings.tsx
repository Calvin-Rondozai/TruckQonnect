import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { OwnerHeader, OwnerScreen } from '@/components/owner/OwnerUIKit';
import { OW, TQFonts, TQRadii } from '@/constants/owner-design';

export default function OwnerSettingsScreen() {
  return (
    <OwnerScreen>
      <OwnerHeader title="Settings" onBack={() => router.back()} />
      <View style={styles.body}>
        <Row label="Push notifications" />
        <Row label="SMS alerts" />
        <Pressable style={styles.row} onPress={() => router.push('/choose-role')}>
          <Text style={styles.rowLabel}>Switch role</Text>
          <Text style={styles.rowVal}>→</Text>
        </Pressable>
        <Pressable style={styles.row}>
          <Text style={styles.rowLabel}>Privacy Policy</Text>
        </Pressable>
        <Pressable style={styles.row}>
          <Text style={styles.rowLabel}>Terms of Service</Text>
        </Pressable>
      </View>
    </OwnerScreen>
  );
}

function Row({ label }: { label: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch value trackColor={{ true: OW.yellow }} thumbColor={OW.white} />
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: 20, gap: 10 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: OW.white,
    padding: 16,
    borderRadius: TQRadii.md,
    borderWidth: 1,
    borderColor: OW.gray200,
  },
  rowLabel: { fontFamily: TQFonts.semiBold, fontSize: 15, color: OW.black },
  rowVal: { fontFamily: TQFonts.regular, fontSize: 16, color: OW.gray500 },
});
