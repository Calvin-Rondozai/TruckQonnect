import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { OwnerTrackNavigation } from '@/components/owner/OwnerTrackNavigation';
import { OwnerScreen } from '@/components/owner/OwnerUIKit';
import { useOwnerActiveJob } from '@/context/owner-active-job';
import { ACTIVE_DELIVERY } from '@/lib/owner-mock-data';
import { OW, TQFonts } from '@/constants/owner-design';

export default function NavigationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { activeDelivery } = useOwnerActiveJob();
  const delivery = activeDelivery ?? ACTIVE_DELIVERY;

  if (!delivery) {
    return (
      <OwnerScreen>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No active delivery to navigate.</Text>
        </View>
      </OwnerScreen>
    );
  }

  return (
    <OwnerTrackNavigation
      delivery={delivery}
      showBack
      onBack={() => router.back()}
    />
  );
}

const styles = StyleSheet.create({
  empty: { flex: 1, padding: 24, justifyContent: 'center' },
  emptyText: { fontFamily: TQFonts.medium, fontSize: 15, color: OW.gray500, textAlign: 'center' },
});
