import { Feather, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
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

import { NotificationsPanel } from '@/components/truckq/NotificationsPanel';
import { PackageStackIllustration } from '@/components/truckq/PackageStackIllustration';
import { ProgressWithTruck } from '@/components/truckq/ProgressWithTruck';
import { MOCK_NOTIFICATIONS } from '@/lib/shipper-mock-data';
import { usePostedLoads } from '@/context/posted-loads';
import { useShipperProfile } from '@/context/shipper-profile';
import { TQ, TQFonts, TQRadii } from '@/constants/truckq-design';

const AVATAR =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80';

const RECENT = [
  { id: '1', code: '#K91M220441', date: 'May 18 · Bulawayo', status: 'In Transit' as const },
  { id: '2', code: '#P44L998201', date: 'May 12 · Mutare', status: 'Delivered' as const },
  { id: '3', code: '#T09Q112903', date: 'May 09 · Harare', status: 'Scheduled' as const },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile } = useShipperProfile();
  const { loads: postedLoads } = usePostedLoads();
  const firstName = profile.name.split(' ')[0] ?? profile.name;
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
        <View style={styles.topRow}>
          <Pressable
            style={({ pressed }) => [styles.profileBlock, pressed && { opacity: 0.88 }]}
            onPress={() => router.push('/profile' as const)}
            accessibilityRole="button"
            accessibilityLabel="Edit your profile"
          >
            <Image source={{ uri: AVATAR }} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.hey}>Hey {firstName}</Text>
              <View style={styles.locRow}>
                <Feather name="map-pin" size={14} color={TQ.gray500} />
                <Text style={styles.loc}>{profile.city}</Text>
              </View>
              {profile.company ? (
                <Text style={styles.company} numberOfLines={1}>
                  {profile.company}
                </Text>
              ) : null}
            </View>
            <Feather name="chevron-right" size={20} color={TQ.gray400} />
          </Pressable>
          <Pressable
            style={styles.notif}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            onPress={() => setNotifOpen(true)}
          >
            <Feather name="bell" size={20} color={TQ.black} />
            {unreadCount > 0 ? (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>{unreadCount}</Text>
              </View>
            ) : null}
          </Pressable>
        </View>

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
              <Pressable
                key={load.id}
                style={({ pressed }) => [styles.openLoadCard, pressed && { opacity: 0.92 }]}
                onPress={() => router.push('/(tabs)/requests' as const)}
              >
                <View style={styles.openLoadTop}>
                  <Text style={styles.openLoadCode}>{load.code}</Text>
                  <View style={styles.awaitingBadge}>
                    <Text style={styles.awaitingText}>Awaiting bids</Text>
                  </View>
                </View>
                <Text style={styles.openLoadRoute}>
                  {load.pickup} → {load.delivery}
                </Text>
                <Text style={styles.openLoadMeta} numberOfLines={1}>
                  {load.description} · {load.budget}
                </Text>
              </Pressable>
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
              <Text style={styles.heroLoc}>En route · Harare → Chitungwiza</Text>
              <View style={styles.statusPill}>
                <View style={styles.dot} />
                <Text style={styles.statusText}>In transit</Text>
              </View>
            </View>
            <PackageStackIllustration />
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
          <Pressable
            key={item.id}
            style={({ pressed }) => [styles.listCard, pressed && { opacity: 0.92 }]}
            onPress={() =>
              router.push({
                pathname: '/driver/[id]',
                params: { id: item.code.replace('#', '') },
              })
            }
          >
            <View style={styles.listRow}>
              <View style={{ flex: 1 }}>
                <View
                  style={[
                    styles.miniBadge,
                    item.status === 'Delivered' && { backgroundColor: TQ.greenSoft },
                  ]}
                >
                  <Text
                    style={[
                      styles.miniBadgeText,
                      item.status === 'Delivered' && { color: TQ.green },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
                <Text style={styles.listCode}>{item.code}</Text>
                <Text style={styles.listDate}>{item.date}</Text>
              </View>
              <PackageStackIllustration size="sm" />
            </View>
          </Pressable>
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  profileBlock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginRight: 10,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: TQ.white,
    backgroundColor: TQ.gray200,
  },
  hey: {
    fontFamily: TQFonts.semiBold,
    fontSize: 18,
    color: TQ.ink,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  loc: {
    fontFamily: TQFonts.medium,
    fontSize: 13,
    color: TQ.gray500,
  },
  company: {
    marginTop: 2,
    fontFamily: TQFonts.regular,
    fontSize: 12,
    color: TQ.gray400,
  },
  notif: {
    width: 48,
    height: 48,
    borderRadius: TQRadii.md,
    backgroundColor: TQ.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: TQ.gray200,
    shadowColor: TQ.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  notifBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: TQ.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: TQ.white,
  },
  notifBadgeText: {
    fontFamily: TQFonts.bold,
    fontSize: 10,
    color: TQ.black,
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
