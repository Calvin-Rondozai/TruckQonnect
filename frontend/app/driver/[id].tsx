import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getDriverForShipment, getShipmentByCode } from '@/lib/mock-data';
import { TQ, TQFonts, TQRadii } from '@/constants/truckq-design';

export default function DriverProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const shipmentId = Array.isArray(id) ? id[0] : id ?? '';
  const driver = useMemo(() => getDriverForShipment(shipmentId), [shipmentId]);
  const shipment = useMemo(() => getShipmentByCode(shipmentId), [shipmentId]);

  if (!driver) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Driver not found</Text>
      </View>
    );
  }

  const trackingCode = shipment?.code.replace('#', '') ?? shipmentId;

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <Feather name="chevron-left" size={26} color={TQ.black} />
        </Pressable>
        <Text style={styles.headerTitle}>Your driver</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 24 }}
      >
        <View style={styles.heroCard}>
          <Image source={{ uri: driver.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{driver.name}</Text>
          <Text style={styles.role}>{driver.role}</Text>
          {driver.verified ? (
            <View style={styles.verified}>
              <Ionicons name="shield-checkmark" size={14} color={TQ.green} />
              <Text style={styles.verifiedText}>Verified on TruckQonnect</Text>
            </View>
          ) : null}

          <View style={styles.actions}>
            <Pressable
              style={styles.actionBtn}
              onPress={() => void Linking.openURL(`tel:${driver.phone.replace(/\s/g, '')}`)}
            >
              <Feather name="phone" size={20} color={TQ.black} />
              <Text style={styles.actionLabel}>Call</Text>
            </Pressable>
            <Pressable style={styles.actionBtn}>
              <Feather name="message-circle" size={20} color={TQ.black} />
              <Text style={styles.actionLabel}>Message</Text>
            </Pressable>
          </View>
        </View>

        {shipment ? (
          <View style={styles.shipmentCard}>
            <Text style={styles.sectionTitle}>Carrying your load</Text>
            <Text style={styles.shipCode}>{shipment.code}</Text>
            <Text style={styles.shipRoute}>
              {shipment.from} → {shipment.to}
            </Text>
            <Text style={styles.shipEta}>{shipment.eta}</Text>
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>Driver details</Text>
        <DetailRow icon="star" label="Rating" value={`${driver.rating} · ${driver.trips} trips`} />
        <DetailRow icon="package" label="Truck" value={driver.truckType} />
        <DetailRow icon="hash" label="Plate" value={driver.plateNumber} />
        <DetailRow icon="clock" label="Experience" value={`${driver.yearsActive} years active`} />
        <DetailRow icon="phone" label="Phone" value={driver.phone} />

        <Pressable
          style={({ pressed }) => [styles.trackBtn, pressed && { opacity: 0.92 }]}
          onPress={() =>
            router.push({ pathname: '/tracking/[id]', params: { id: trackingCode } })
          }
        >
          <MaterialCommunityIcons name="map-marker-path" size={22} color={TQ.black} />
          <Text style={styles.trackBtnText}>Live map tracking</Text>
          <Feather name="chevron-right" size={20} color={TQ.black} />
        </Pressable>
      </ScrollView>
    </View>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  value: string;
}) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}>
        <Feather name={icon} size={18} color={TQ.gray600} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: TQ.gray100 },
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
  heroCard: {
    marginTop: 16,
    backgroundColor: TQ.white,
    borderRadius: TQRadii.xl,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: TQ.gray200,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: TQ.yellow,
  },
  name: {
    marginTop: 14,
    fontFamily: TQFonts.bold,
    fontSize: 22,
    color: TQ.ink,
  },
  role: {
    marginTop: 4,
    fontFamily: TQFonts.medium,
    fontSize: 14,
    color: TQ.gray500,
  },
  verified: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  verifiedText: {
    fontFamily: TQFonts.medium,
    fontSize: 13,
    color: TQ.green,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    width: '100%',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: TQ.gray100,
    paddingVertical: 12,
    borderRadius: TQRadii.md,
    borderWidth: 1,
    borderColor: TQ.gray200,
  },
  actionLabel: { fontFamily: TQFonts.semiBold, fontSize: 14, color: TQ.ink },
  shipmentCard: {
    marginTop: 14,
    backgroundColor: TQ.yellow,
    borderRadius: TQRadii.lg,
    padding: 16,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
    fontFamily: TQFonts.semiBold,
    fontSize: 13,
    color: TQ.gray500,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  shipCode: { fontFamily: TQFonts.bold, fontSize: 18, color: TQ.black },
  shipRoute: {
    marginTop: 6,
    fontFamily: TQFonts.medium,
    fontSize: 14,
    color: TQ.gray700,
  },
  shipEta: {
    marginTop: 4,
    fontFamily: TQFonts.regular,
    fontSize: 13,
    color: TQ.gray700,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: TQ.white,
    borderRadius: TQRadii.md,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: TQ.gray200,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: TQ.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailLabel: { fontFamily: TQFonts.medium, fontSize: 12, color: TQ.gray500 },
  detailValue: {
    marginTop: 2,
    fontFamily: TQFonts.semiBold,
    fontSize: 15,
    color: TQ.ink,
  },
  trackBtn: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: TQ.yellow,
    borderRadius: TQRadii.lg,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  trackBtnText: {
    flex: 1,
    fontFamily: TQFonts.bold,
    fontSize: 16,
    color: TQ.black,
    textAlign: 'center',
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontFamily: TQFonts.medium, fontSize: 16, color: TQ.gray500 },
});
