import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { OwnerLiveMap } from '@/components/owner/OwnerLiveMap';
import { Avatar, OwnerButton, OwnerHeader, OwnerScreen } from '@/components/owner/OwnerUIKit';
import { OW, TQFonts, TQRadii } from '@/constants/owner-design';
import { useOwnerActiveJob } from '@/context/owner-active-job';
import { ACTIVE_DELIVERY } from '@/lib/owner-mock-data';
import { getRouteForLoad } from '@/lib/owner-routes';

const STEPS = ['En route to pickup', 'At pickup', 'In transit', 'At dropoff', 'Completed'];

export default function ActiveDeliveryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { activeDelivery } = useOwnerActiveJob();
  const d = activeDelivery ?? ACTIVE_DELIVERY;
  const mapRoute = getRouteForLoad(d.loadId);

  return (
    <OwnerScreen>
      <OwnerHeader title="Active Delivery" subtitle={`#${id ?? d.id}`} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.push('/(owner-tabs)/track' as '/(owner-tabs)/track')}>
          <OwnerLiveMap height={240} route={mapRoute} />
        </Pressable>

        <View style={styles.etaCard}>
          <Text style={styles.etaLabel}>ETA</Text>
          <Text style={styles.etaVal}>{d.eta}</Text>
        </View>

        <View style={styles.timeline}>
          {STEPS.map((step, i) => (
            <View key={step} style={styles.step}>
              <View style={[styles.stepDot, i <= 2 && styles.stepDotDone]} />
              <Text style={[styles.stepText, i <= 2 && styles.stepTextDone]}>{step}</Text>
            </View>
          ))}
        </View>

        <View style={styles.customerCard}>
          <Avatar uri={d.customerAvatar} size={48} />
          <View style={styles.customerText}>
            <Text style={styles.customerLabel}>Customer</Text>
            <Text style={styles.customerName}>{d.customerName}</Text>
            <Text style={styles.customerSub}>{d.cargoType}</Text>
          </View>
          <View style={styles.customerActions}>
            <Pressable
              style={styles.iconBtn}
              onPress={() => Alert.alert('Call', d.customerPhone)}
              accessibilityLabel="Call customer"
            >
              <Feather name="phone" size={20} color={OW.black} />
            </Pressable>
            <Pressable
              style={styles.iconBtn}
              onPress={() =>
                router.push({ pathname: '/owner/chat/[id]', params: { id: 'thread-1' } })
              }
              accessibilityLabel="Chat with customer"
            >
              <Feather name="message-circle" size={20} color={OW.black} />
            </Pressable>
          </View>
        </View>

        <OwnerButton
          label="Complete Delivery"
          onPress={() =>
            router.push({ pathname: '/owner/completed/[id]', params: { id: d.id } })
          }
        />
      </ScrollView>
    </OwnerScreen>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 40, gap: 14 },
  etaCard: { backgroundColor: OW.black, borderRadius: TQRadii.lg, padding: 16, alignItems: 'center' },
  etaLabel: { fontFamily: TQFonts.regular, fontSize: 12, color: OW.gray400 },
  etaVal: { fontFamily: TQFonts.bold, fontSize: 28, color: OW.yellow },
  timeline: {
    backgroundColor: OW.white,
    borderRadius: TQRadii.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: OW.gray200,
  },
  step: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  stepDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: OW.gray200 },
  stepDotDone: { backgroundColor: OW.yellow },
  stepText: { fontFamily: TQFonts.regular, fontSize: 13, color: OW.gray500 },
  stepTextDone: { fontFamily: TQFonts.semiBold, color: OW.black },
  customerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: OW.white,
    padding: 14,
    borderRadius: TQRadii.lg,
    borderWidth: 1,
    borderColor: OW.gray200,
  },
  customerText: { flex: 1 },
  customerLabel: { fontFamily: TQFonts.regular, fontSize: 11, color: OW.gray500 },
  customerName: { fontFamily: TQFonts.bold, fontSize: 15, color: OW.black },
  customerSub: { fontFamily: TQFonts.regular, fontSize: 12, color: OW.gray500, marginTop: 2 },
  customerActions: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: OW.yellowSoft,
    borderWidth: 1,
    borderColor: OW.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
