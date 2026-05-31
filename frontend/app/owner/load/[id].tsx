import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { OwnerLiveMap } from '@/components/owner/OwnerLiveMap';
import { Avatar, OwnerButton, OwnerHeader, OwnerScreen } from '@/components/owner/OwnerUIKit';
import { OW, TQFonts, TQRadii } from '@/constants/owner-design';
import { getLoadById } from '@/lib/owner-mock-data';

const { width: SCREEN_W } = Dimensions.get('window');
const CARGO_IMG = Math.min(140, SCREEN_W * 0.38);

export default function LoadDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const load = getLoadById(id ?? '');

  if (!load) {
    return (
      <OwnerScreen>
        <OwnerHeader title="Load" onBack={() => router.back()} />
        <Text style={styles.miss}>Load not found</Text>
      </OwnerScreen>
    );
  }

  const customerAvatar =
    load.customerAvatar ??
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80';

  return (
    <OwnerScreen>
      <OwnerHeader title="Load Details" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <OwnerLiveMap height={220} />

        <View style={styles.cargoSection}>
          <Text style={styles.sectionLabel}>Cargo to carry</Text>
          <View style={styles.cargoRow}>
            {load.images.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cargoScroll}
              >
                {load.images.map((uri, i) => (
                  <Image
                    key={`${uri}-${i}`}
                    source={{ uri }}
                    style={styles.cargoImage}
                    contentFit="cover"
                  />
                ))}
              </ScrollView>
            ) : (
              <View style={[styles.cargoImage, styles.cargoPlaceholder]}>
                <Feather name="image" size={32} color={OW.gray400} />
              </View>
            )}
            <View style={styles.cargoInfo}>
              <Text style={styles.cargo}>{load.cargoType}</Text>
              <Text style={styles.desc}>{load.description}</Text>
            </View>
          </View>
        </View>

        <View style={styles.grid}>
          <Info label="Weight" val={load.weight} />
          <Info label="Distance" val={load.distance} />
          <Info label="Budget" val={`$${load.budget}`} />
          <Info label="Suggested" val={`$${load.suggestedPrice}`} />
        </View>

        <View style={styles.customerCard}>
          <Avatar uri={customerAvatar} size={48} />
          <View style={styles.custText}>
            <Text style={styles.custLabel}>Customer</Text>
            <Text style={styles.custName}>{load.customerName}</Text>
            <Text style={styles.custRate}>★ {load.customerRating}</Text>
          </View>
          <View style={styles.customerActions}>
            <Pressable
              style={styles.iconBtn}
              onPress={() => Alert.alert('Call', load.customerPhone)}
            >
              <Feather name="phone" size={20} color={OW.black} />
            </Pressable>
            <Pressable
              style={styles.iconBtn}
              onPress={() =>
                router.push({ pathname: '/owner/chat/[id]', params: { id: 'thread-1' } })
              }
            >
              <Feather name="message-circle" size={20} color={OW.black} />
            </Pressable>
          </View>
        </View>

        <OwnerButton
          label="Place Bid"
          onPress={() => router.push({ pathname: '/owner/bid/[id]', params: { id: load.id } })}
        />
      </ScrollView>
    </OwnerScreen>
  );
}

function Info({ label, val }: { label: string; val: string }) {
  return (
    <View style={styles.info}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoVal}>{val}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 40, gap: 14 },
  miss: { textAlign: 'center', marginTop: 40, fontFamily: TQFonts.regular, color: OW.gray500 },
  cargoSection: {
    backgroundColor: OW.white,
    borderRadius: TQRadii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: OW.gray200,
  },
  sectionLabel: {
    fontFamily: TQFonts.semiBold,
    fontSize: 12,
    color: OW.gray500,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  cargoRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  cargoScroll: { gap: 10, paddingRight: 8 },
  cargoImage: {
    width: CARGO_IMG,
    height: CARGO_IMG,
    borderRadius: TQRadii.md,
    backgroundColor: OW.gray100,
  },
  cargoPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  cargoInfo: { flex: 1, minWidth: 0 },
  cargo: { fontFamily: TQFonts.bold, fontSize: 18, color: OW.black },
  desc: {
    fontFamily: TQFonts.regular,
    fontSize: 13,
    color: OW.gray500,
    lineHeight: 20,
    marginTop: 6,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  info: {
    width: '47%',
    backgroundColor: OW.white,
    padding: 12,
    borderRadius: TQRadii.md,
    borderWidth: 1,
    borderColor: OW.gray200,
  },
  infoLabel: { fontFamily: TQFonts.regular, fontSize: 11, color: OW.gray500 },
  infoVal: { fontFamily: TQFonts.bold, fontSize: 15, color: OW.black, marginTop: 4 },
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
  custText: { flex: 1 },
  custLabel: { fontFamily: TQFonts.regular, fontSize: 11, color: OW.gray500 },
  custName: { fontFamily: TQFonts.bold, fontSize: 15, color: OW.black },
  custRate: { fontFamily: TQFonts.regular, fontSize: 12, color: OW.gray500, marginTop: 2 },
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
