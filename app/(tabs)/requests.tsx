import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { INITIAL_REQUESTS } from '@/lib/mock-data';
import type { LoadRequest } from '@/lib/types';
import { TQ, TQFonts, TQRadii } from '@/constants/truckq-design';

export default function RequestsScreen() {
  const insets = useSafeAreaInsets();
  const [requests, setRequests] = useState<LoadRequest[]>(INITIAL_REQUESTS);

  const respond = (id: string, accept: boolean) => {
    const item = requests.find((r) => r.id === id);
    if (!item) return;

    void Haptics.notificationAsync(
      accept
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Warning,
    );

    setRequests((prev) => prev.filter((r) => r.id !== id));

    Alert.alert(
      accept ? 'Request accepted' : 'Request declined',
      accept
        ? `${item.driverName} can pick up your load. You'll see them under Track once they start.`
        : `${item.driverName} was notified. Other drivers can still bid.`,
    );
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      <Text style={styles.title}>Requests</Text>
      <Text style={styles.sub}>
        Drivers bidding to carry your load — accept to book or decline to keep looking.
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100, gap: 14 }}
      >
        {requests.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="inbox" size={40} color={TQ.gray400} />
            <Text style={styles.emptyTitle}>No pending requests</Text>
            <Text style={styles.emptySub}>
              When drivers bid on your posted loads, they'll show up here for you to review.
            </Text>
          </View>
        ) : (
          requests.map((req) => (
            <View key={req.id} style={styles.card}>
              <View style={styles.cardHead}>
                <Image source={{ uri: req.driverAvatar }} style={styles.avatar} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.driverName}>{req.driverName}</Text>
                  <View style={styles.ratingRow}>
                    <Feather name="star" size={14} color={TQ.yellowDeep} />
                    <Text style={styles.rating}>{req.rating}</Text>
                    <Text style={styles.truck}>{req.truckType}</Text>
                  </View>
                </View>
                <Text style={styles.price}>{req.offeredPrice}</Text>
              </View>

              <View style={styles.meta}>
                <MetaLine icon="map-pin" text={req.route} />
                <MetaLine icon="package" text={req.loadSummary} />
                <MetaLine icon="clock" text={req.eta} />
              </View>

              <View style={styles.actions}>
                <Pressable
                  style={({ pressed }) => [styles.declineBtn, pressed && { opacity: 0.9 }]}
                  onPress={() => respond(req.id, false)}
                >
                  <Text style={styles.declineText}>Decline</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [styles.acceptBtn, pressed && { opacity: 0.9 }]}
                  onPress={() => respond(req.id, true)}
                >
                  <Text style={styles.acceptText}>Accept</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

function MetaLine({ icon, text }: { icon: React.ComponentProps<typeof Feather>['name']; text: string }) {
  return (
    <View style={styles.metaLine}>
      <Feather name={icon} size={14} color={TQ.gray500} />
      <Text style={styles.metaText}>{text}</Text>
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
    marginBottom: 18,
  },
  card: {
    backgroundColor: TQ.white,
    borderRadius: TQRadii.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: TQ.gray200,
    shadowColor: TQ.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: TQ.gray200,
  },
  driverName: {
    fontFamily: TQFonts.bold,
    fontSize: 17,
    color: TQ.ink,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  rating: {
    fontFamily: TQFonts.semiBold,
    fontSize: 13,
    color: TQ.gray700,
  },
  truck: {
    fontFamily: TQFonts.regular,
    fontSize: 12,
    color: TQ.gray500,
    marginLeft: 4,
  },
  price: {
    fontFamily: TQFonts.bold,
    fontSize: 16,
    color: TQ.black,
  },
  meta: { gap: 8, marginBottom: 16 },
  metaLine: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: {
    flex: 1,
    fontFamily: TQFonts.regular,
    fontSize: 14,
    color: TQ.gray600,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  declineBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: TQRadii.md,
    backgroundColor: TQ.gray100,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: TQ.gray200,
  },
  declineText: {
    fontFamily: TQFonts.semiBold,
    fontSize: 15,
    color: TQ.gray700,
  },
  acceptBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: TQRadii.md,
    backgroundColor: TQ.yellow,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  acceptText: {
    fontFamily: TQFonts.bold,
    fontSize: 15,
    color: TQ.black,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    marginTop: 16,
    fontFamily: TQFonts.bold,
    fontSize: 18,
    color: TQ.ink,
  },
  emptySub: {
    marginTop: 8,
    fontFamily: TQFonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: TQ.gray500,
    textAlign: 'center',
  },
});
