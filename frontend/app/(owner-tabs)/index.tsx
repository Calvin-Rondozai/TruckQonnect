import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { LoadCard, OwnerScreen, StatusBadge } from '@/components/owner/OwnerUIKit';
import { HomeAppBar } from '@/components/truckq/HomeAppBar';
import { NotificationsPanel } from '@/components/truckq/NotificationsPanel';
import { useAuthUser } from '@/context/auth-user';
import { useOwnerActiveJob } from '@/context/owner-active-job';
import { useOwnerProfile } from '@/context/owner-profile';
import { OW, TQFonts, TQRadii } from '@/constants/owner-design';
import { AVAILABLE_LOADS, OWNER_EARNINGS, OWNER_MOCK_NOTIFICATIONS } from '@/lib/owner-mock-data';

export default function OwnerDashboard() {
  const { user } = useAuthUser();
  const { profile } = useOwnerProfile();
  const { activeDelivery } = useOwnerActiveJob();
  const nearby = AVAILABLE_LOADS.slice(0, 2);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(OWNER_MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <OwnerScreen edges={['top']}>
      <NotificationsPanel
        visible={notifOpen}
        onClose={() => setNotifOpen(false)}
        notifications={notifications}
        onItemsChange={setNotifications}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.topWrap}>
          <HomeAppBar
            variant="owner"
            companyName={user?.company ?? profile.company}
            unreadCount={unreadCount}
            onNotificationsPress={() => setNotifOpen(true)}
          />
        </View>

        <View style={styles.earnCard}>
          <Text style={styles.earnLabel}>Today&apos;s earnings</Text>
          <Text style={styles.earnVal}>${OWNER_EARNINGS.today}</Text>
          <View style={styles.earnRow}>
            <Text style={styles.earnSub}>Week ${OWNER_EARNINGS.week}</Text>
            <Text style={styles.earnSub}>Month ${OWNER_EARNINGS.month}</Text>
          </View>
        </View>

        {activeDelivery ? (
          <Pressable
            style={styles.activeCard}
            onPress={() => router.push('/(owner-tabs)/track' as '/(owner-tabs)/track')}
          >
            <View style={styles.activeRow}>
              <View style={styles.activeBody}>
                <View style={styles.activeHead}>
                  <StatusBadge label="Active delivery" tone="yellow" />
                  <Text style={styles.eta}>ETA {activeDelivery.eta}</Text>
                </View>
                <Text style={styles.activeRoute}>
                  {activeDelivery.pickup} → {activeDelivery.dropoff}
                </Text>
                <View style={styles.progressBg}>
                  <View
                    style={[styles.progressFill, { width: `${activeDelivery.progress}%` }]}
                  />
                </View>
                <Text style={styles.activeEarn}>${activeDelivery.earnings} estimated</Text>
              </View>
              <Feather name="chevron-right" size={22} color={OW.gray500} />
            </View>
          </Pressable>
        ) : null}

        <View style={styles.stats}>
          {[
            { label: 'Trips', val: String(profile.trips) },
            { label: 'Rating', val: profile.rating.toFixed(1) },
            { label: 'Nearby', val: String(AVAILABLE_LOADS.length) },
          ].map((s) => (
            <View key={s.label} style={styles.stat}>
              <Text style={styles.statVal}>{s.val}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Nearby loads</Text>
          <Pressable onPress={() => router.push('/(owner-tabs)/loads')}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>

        <View style={styles.loadsWrap}>
          {nearby.map((load) => (
            <LoadCard
              key={load.id}
              load={load}
              compact
              onDetails={() =>
                router.push({ pathname: '/owner/load/[id]', params: { id: load.id } })
              }
              onBid={() => router.push({ pathname: '/owner/bid/[id]', params: { id: load.id } })}
            />
          ))}
        </View>
      </ScrollView>
    </OwnerScreen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 24 },
  topWrap: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  earnCard: {
    marginHorizontal: 20,
    backgroundColor: OW.black,
    borderRadius: TQRadii.lg,
    padding: 20,
    marginBottom: 16,
    marginTop: 16,
  },
  earnLabel: { fontFamily: TQFonts.regular, fontSize: 13, color: OW.gray400 },
  earnVal: { fontFamily: TQFonts.bold, fontSize: 36, color: OW.yellow, marginVertical: 4 },
  earnRow: { flexDirection: 'row', gap: 16 },
  earnSub: { fontFamily: TQFonts.medium, fontSize: 12, color: OW.gray400 },
  activeCard: {
    marginHorizontal: 20,
    backgroundColor: OW.white,
    borderRadius: TQRadii.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: OW.yellow,
  },
  activeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  activeBody: { flex: 1, minWidth: 0 },
  activeHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  eta: { fontFamily: TQFonts.semiBold, fontSize: 12, color: OW.gray500 },
  activeRoute: { fontFamily: TQFonts.semiBold, fontSize: 14, color: OW.black, marginBottom: 10 },
  progressBg: { height: 6, backgroundColor: OW.gray100, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: OW.yellow, borderRadius: 3 },
  activeEarn: { fontFamily: TQFonts.medium, fontSize: 12, color: OW.gray500, marginTop: 8 },
  stats: { flexDirection: 'row', marginHorizontal: 20, gap: 10, marginBottom: 20 },
  stat: {
    flex: 1,
    backgroundColor: OW.white,
    borderRadius: TQRadii.md,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: OW.gray200,
  },
  statVal: { fontFamily: TQFonts.bold, fontSize: 18, color: OW.black },
  statLabel: { fontFamily: TQFonts.regular, fontSize: 11, color: OW.gray500, marginTop: 2 },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: { fontFamily: TQFonts.bold, fontSize: 18, color: OW.black },
  seeAll: { fontFamily: TQFonts.semiBold, fontSize: 13, color: OW.yellowDeep },
  loadsWrap: {
    paddingHorizontal: 20,
    width: '100%',
    alignSelf: 'stretch',
  },
});
