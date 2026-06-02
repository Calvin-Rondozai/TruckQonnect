import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BoxImage } from '@/components/truckq/BoxImage';
import { HomeAppBar } from '@/components/truckq/HomeAppBar';
import { NotificationsPanel } from '@/components/truckq/NotificationsPanel';
import { ShipmentCard } from '@/components/truckq/ShipmentCard';
import { ProgressWithTruck } from '@/components/truckq/ProgressWithTruck';
import { useAuthUser } from '@/context/auth-user';
import { MOCK_NOTIFICATIONS } from '@/lib/shipper-mock-data';
import { usePostedLoads } from '@/context/posted-loads';
import { TQ, TQFonts, TQRadii } from '@/constants/truckq-design';

const RECENT = [
  {
    id: '1',
    code: '#K91M220441',
    companyName: 'Hello C Technologies',
    deliveryDate: 'May 18, 2026',
    route: 'Harare → Bulawayo',
    status: 'In Transit' as const,
  },
  {
    id: '2',
    code: '#P44L998201',
    companyName: 'Hello C Technologies',
    deliveryDate: 'May 12, 2026',
    route: 'Mutare → Harare',
    status: 'Delivered' as const,
  },
  {
    id: '3',
    code: '#T09Q112903',
    companyName: 'Hello C Technologies',
    deliveryDate: 'May 09, 2026',
    route: 'Harare → Kadoma',
    status: 'Scheduled' as const,
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuthUser();
  const { loads: postedLoads } = usePostedLoads();
  const companyLabel = user?.company ?? 'Your company';
  const openLoads = postedLoads.filter((l) => l.status === 'open');
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8 }]}>
      <NotificationsPanel visible={notifOpen} onClose={() => setNotifOpen(false)} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        <HomeAppBar unreadCount={unreadCount} onNotificationsPress={() => setNotifOpen(true)} />

        <Pressable
          style={({ pressed }) => [styles.search, pressed && { opacity: 0.92 }]}
          onPress={() => router.push('/(tabs)/track')}
          accessibilityRole="button"
          accessibilityLabel="Search loads and drivers"
        >
          <Feather name="search" size={18} color={TQ.gray400} style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Search loads & drivers"
            placeholderTextColor={TQ.gray400}
            style={styles.searchInput}
            editable={false}
            pointerEvents="none"
          />
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.placeLoadCard, pressed && { transform: [{ scale: 0.99 }] }]}
          onPress={() => router.push('/place-load' as const)}
          accessibilityRole="button"
          accessibilityLabel="Place a new load"
        >
          <View style={styles.placeLoadIcon}>
            <Feather name="plus" size={22} color={TQ.black} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.placeLoadTitle}>Place a load</Text>
            <Text style={styles.placeLoadSub}>
              Post pickup & delivery — drivers bid on your shipment
            </Text>
          </View>
          <Feather name="chevron-right" size={22} color={TQ.black} />
        </Pressable>

        {openLoads.length > 0 ? (
          <>
            <Text style={[styles.sectionLabel, { marginTop: 6 }]}>Your open loads</Text>
            {openLoads.slice(0, 3).map((load) => (
              <ShipmentCard
                key={load.id}
                boxWidth={64}
                style={{ marginBottom: 10 }}
                data={{
                  code: load.code,
                  companyName: companyLabel,
                  deliveryDate: load.pickupWhen || new Date(load.postedAt).toLocaleDateString(),
                  route: `${load.pickup} → ${load.delivery}`,
                  status: 'Awaiting bids',
                  subtitle: `${load.description} · ${load.budget}`,
                }}
                onPress={() =>
                  load.shipmentLoadId
                    ? router.push({
                        pathname: '/tracking/[id]',
                        params: { id: load.shipmentLoadId },
                      })
                    : router.push('/(tabs)/requests' as const)
                }
              />
            ))}
          </>
        ) : null}

        <Text style={styles.sectionLabel}>Active shipment</Text>

        <Pressable
          style={({ pressed }) => [styles.heroCard, pressed && { transform: [{ scale: 0.988 }] }]}
          onPress={() =>
            router.push({ pathname: '/driver/[id]', params: { id: 'H62J568107' } })
          }
        >
          <View style={styles.fastBadge}>
            <Ionicons name="flash" size={14} color={TQ.black} />
            <Text style={styles.fastText}>Fast</Text>
          </View>
          <View style={styles.heroTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.trackId}>#H62J568107</Text>
              <Text style={styles.heroCompany}>{companyLabel}</Text>
              <Text style={styles.heroDate}>Delivery · May 20, 2026</Text>
              <Text style={styles.heroLoc}>Harare → Chitungwiza</Text>
              <View style={styles.statusPill}>
                <View style={styles.dot} />
                <Text style={styles.statusText}>In transit</Text>
              </View>
            </View>
            <BoxImage width={76} />
          </View>
          <ProgressWithTruck progress={0.62} />
        </Pressable>

        <View style={styles.sectionHead}>
          <Text style={styles.sectionLabelFlat}>Recent shipping</Text>
          <Pressable hitSlop={8}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>

        {RECENT.map((item) => (
          <ShipmentCard
            key={item.id}
            boxWidth={64}
            style={{ marginBottom: 10 }}
            data={{
              code: item.code,
              companyName: item.companyName,
              deliveryDate: item.deliveryDate,
              route: item.route,
              status: item.status,
            }}
            onPress={() =>
              router.push({
                pathname: '/driver/[id]',
                params: { id: item.code.replace('#', '') },
              })
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: TQ.gray100,
    paddingHorizontal: 20,
  },
  heroCompany: {
    marginTop: 4,
    fontFamily: TQFonts.medium,
    fontSize: 13,
    color: TQ.gray600,
  },
  heroDate: {
    marginTop: 2,
    fontFamily: TQFonts.regular,
    fontSize: 12,
    color: TQ.gray500,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TQ.white,
    borderRadius: TQRadii.lg,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: TQ.gray200,
  },
  searchInput: {
    flex: 1,
    fontFamily: TQFonts.medium,
    fontSize: 15,
    color: TQ.ink,
    paddingVertical: 0,
  },
  placeLoadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: TQ.yellow,
    borderRadius: TQRadii.xl,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    shadowColor: TQ.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 6,
  },
  placeLoadIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: TQ.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeLoadTitle: {
    fontFamily: TQFonts.bold,
    fontSize: 17,
    color: TQ.black,
  },
  placeLoadSub: {
    marginTop: 4,
    fontFamily: TQFonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: TQ.gray700,
  },
  openLoadCard: {
    backgroundColor: TQ.white,
    borderRadius: TQRadii.lg,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: TQ.gray200,
    borderLeftWidth: 4,
    borderLeftColor: TQ.yellowDeep,
  },
  openLoadTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  openLoadCode: {
    fontFamily: TQFonts.bold,
    fontSize: 15,
    color: TQ.ink,
  },
  awaitingBadge: {
    backgroundColor: TQ.yellowSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: TQRadii.sm,
  },
  awaitingText: {
    fontFamily: TQFonts.semiBold,
    fontSize: 10,
    color: TQ.gray700,
  },
  openLoadRoute: {
    fontFamily: TQFonts.semiBold,
    fontSize: 14,
    color: TQ.ink,
  },
  openLoadMeta: {
    marginTop: 4,
    fontFamily: TQFonts.regular,
    fontSize: 12,
    color: TQ.gray500,
  },
  sectionLabel: {
    fontFamily: TQFonts.semiBold,
    fontSize: 15,
    color: TQ.gray700,
    marginBottom: 10,
  },
  sectionLabelFlat: {
    fontFamily: TQFonts.semiBold,
    fontSize: 15,
    color: TQ.gray700,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 12,
  },
  seeAll: {
    fontFamily: TQFonts.medium,
    fontSize: 13,
    color: TQ.gray500,
  },
  heroCard: {
    backgroundColor: TQ.yellow,
    borderRadius: TQRadii.xl,
    padding: 20,
    marginBottom: 8,
    overflow: 'hidden',
    shadowColor: TQ.black,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 10,
  },
  fastBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: TQ.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: TQRadii.pill,
    transform: [{ rotate: '8deg' }],
    shadowColor: TQ.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 2,
  },
  fastText: {
    fontFamily: TQFonts.bold,
    fontSize: 12,
    color: TQ.black,
    letterSpacing: 0.5,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingRight: 4,
  },
  trackId: {
    fontFamily: TQFonts.bold,
    fontSize: 20,
    color: TQ.black,
    letterSpacing: -0.3,
  },
  heroLoc: {
    marginTop: 6,
    fontFamily: TQFonts.medium,
    fontSize: 13,
    color: TQ.gray700,
    opacity: 0.95,
  },
  statusPill: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: TQRadii.pill,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: TQ.green,
  },
  statusText: {
    fontFamily: TQFonts.semiBold,
    fontSize: 12,
    color: TQ.black,
    textTransform: 'capitalize',
  },
  listCard: {
    backgroundColor: TQ.white,
    borderRadius: TQRadii.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: TQ.gray200,
    shadowColor: TQ.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  miniBadge: {
    alignSelf: 'flex-start',
    backgroundColor: TQ.yellowSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: TQRadii.sm,
    marginBottom: 8,
  },
  miniBadgeText: {
    fontFamily: TQFonts.semiBold,
    fontSize: 11,
    color: TQ.gray700,
  },
  listCode: {
    fontFamily: TQFonts.bold,
    fontSize: 16,
    color: TQ.ink,
  },
  listDate: {
    marginTop: 4,
    fontFamily: TQFonts.regular,
    fontSize: 13,
    color: TQ.gray500,
  },
});
