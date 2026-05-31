import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { OwnerTrackNavigation } from '@/components/owner/OwnerTrackNavigation';
import { OwnerButton, OwnerScreen } from '@/components/owner/OwnerUIKit';
import { useOwnerActiveJob } from '@/context/owner-active-job';
import { OW, TQFonts } from '@/constants/owner-design';

export default function OwnerTrackTab() {
  const { activeDelivery } = useOwnerActiveJob();

  if (!activeDelivery) {
    return (
      <OwnerScreen edges={['top']}>
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Feather name="navigation" size={40} color={OW.gray400} />
          </View>
          <Text style={styles.emptyTitle}>No active route</Text>
          <Text style={styles.emptySub}>
            When your bid is accepted, the map here will show pickup and delivery locations for
            your load.
          </Text>
          <OwnerButton
            label="Browse loads"
            onPress={() => router.push('/(owner-tabs)/loads' as '/(owner-tabs)/loads')}
          />
        </View>
      </OwnerScreen>
    );
  }

  return <OwnerTrackNavigation delivery={activeDelivery} />;
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    padding: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: OW.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontFamily: TQFonts.bold,
    fontSize: 22,
    color: OW.black,
    textAlign: 'center',
  },
  emptySub: {
    fontFamily: TQFonts.regular,
    fontSize: 14,
    color: OW.gray500,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 24,
  },
});
