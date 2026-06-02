import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OwnerLiveMap } from '@/components/owner/OwnerLiveMap';
import { LoadTrackingMap } from '@/components/truckq/LoadTrackingMap';
import { Avatar, OwnerButton } from '@/components/owner/OwnerUIKit';
import { OW, TQFonts, TQRadii } from '@/constants/owner-design';
import { useDriverLocationBroadcast } from '@/hooks/useDriverLocationBroadcast';
import { useLoadTracking } from '@/hooks/useLoadTracking';
import { isShipmentLoadId } from '@/lib/load-id';
import type { ActiveDelivery } from '@/lib/owner-types';
import { getRouteForLoad } from '@/lib/owner-routes';
import { normalizeLoadId } from '@/lib/loads-api';

type Props = {
  delivery: ActiveDelivery;
  showBack?: boolean;
  onBack?: () => void;
};

export function OwnerTrackNavigation({ delivery, showBack = false, onBack }: Props) {
  const insets = useSafeAreaInsets();
  const mockRoute = getRouteForLoad(delivery.loadId);
  const apiLoadId = isShipmentLoadId(delivery.loadId) ? normalizeLoadId(delivery.loadId) : null;
  const { route: apiRoute, truck, region, loading } = useLoadTracking(apiLoadId, true);
  useDriverLocationBroadcast(apiLoadId, Boolean(apiLoadId));

  const handleBack = () => {
    if (onBack) onBack();
    else router.back();
  };

  const useApiMap = Boolean(apiLoadId && apiRoute && region);

  return (
    <View style={styles.root}>
      {useApiMap ? (
        <LoadTrackingMap
          fullScreen
          pickup={apiRoute.pickup}
          destination={apiRoute.destination}
          truck={truck}
          routePolyline={apiRoute.route.polyline}
          region={region}
        />
      ) : (
        <OwnerLiveMap fullScreen route={mockRoute} />
      )}
      {apiLoadId && loading && !apiRoute ? (
        <View style={styles.mapOverlay}>
          <Text style={styles.mapOverlayText}>Loading route…</Text>
        </View>
      ) : null}

      <LinearGradient
        colors={['rgba(255,255,255,0.97)', 'rgba(255,255,255,0.85)', 'transparent']}
        style={[styles.headerFade, { height: insets.top + 56 }]}
        pointerEvents="none"
      />

      {showBack ? (
        <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
          <Pressable onPress={handleBack} style={styles.headerBtn} accessibilityLabel="Go back">
            <Ionicons name="chevron-back" size={26} color={OW.black} />
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Navigation
          </Text>
          <View style={{ width: 44 }} />
        </View>
      ) : (
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Text style={styles.headerTitle}>Track load</Text>
          <View style={styles.livePill}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live</Text>
          </View>
        </View>
      )}

      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.sheetHandle} />

        <View style={styles.etaRow}>
          <View>
            <Text style={styles.etaLabel}>ETA to dropoff</Text>
            <Text style={styles.etaVal}>{delivery.eta}</Text>
          </View>
          <View style={styles.earnBadge}>
            <Text style={styles.earnLabel}>Earnings</Text>
            <Text style={styles.earnVal}>${delivery.earnings}</Text>
          </View>
        </View>

        <View style={styles.routeCard}>
          <View style={styles.routeRow}>
            <View style={[styles.routeDot, styles.routeDotPickup]} />
            <View style={styles.routeText}>
              <Text style={styles.routeLabel}>Pickup load</Text>
              <Text style={styles.routeAddr}>{delivery.pickup}</Text>
            </View>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routeRow}>
            <View style={[styles.routeDot, styles.routeDotDrop]} />
            <View style={styles.routeText}>
              <Text style={styles.routeLabel}>Deliver to</Text>
              <Text style={styles.routeAddr}>{delivery.dropoff}</Text>
            </View>
          </View>
        </View>

        <View style={styles.customerRow}>
          <Avatar uri={delivery.customerAvatar} size={44} />
          <View style={{ flex: 1 }}>
            <Text style={styles.customerLabel}>Customer</Text>
            <Text style={styles.customerName}>{delivery.customerName}</Text>
            <Text style={styles.cargo}>{delivery.cargoType}</Text>
          </View>
          <Pressable
            style={styles.iconBtn}
            onPress={() => Alert.alert('Call', delivery.customerPhone)}
          >
            <Feather name="phone" size={18} color={OW.black} />
          </Pressable>
          <Pressable
            style={styles.iconBtn}
            onPress={() =>
              router.push({ pathname: '/owner/chat/[id]', params: { id: 'thread-1' } })
            }
          >
            <Feather name="message-circle" size={18} color={OW.black} />
          </Pressable>
        </View>

        <OwnerButton
          label="Open in device maps"
          variant="outline"
          onPress={() => void Linking.openURL('https://maps.google.com')}
        />
        <OwnerButton
          label="Delivery details"
          onPress={() =>
            router.push({
              pathname: '/owner/active-delivery/[id]',
              params: { id: delivery.id },
            })
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: OW.bg },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  mapOverlayText: { fontFamily: TQFonts.medium, fontSize: 14, color: OW.gray500 },
  headerFade: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: OW.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: OW.gray200,
  },
  headerTitle: {
    flex: 1,
    fontFamily: TQFonts.bold,
    fontSize: 18,
    color: OW.black,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: OW.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: OW.gray200,
  },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: OW.green },
  liveText: { fontFamily: TQFonts.semiBold, fontSize: 12, color: OW.black },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: OW.white,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 10,
    borderWidth: 1,
    borderColor: OW.gray200,
    shadowColor: OW.black,
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 12,
    gap: 12,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: OW.gray200,
    alignSelf: 'center',
    marginBottom: 4,
  },
  etaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  etaLabel: { fontFamily: TQFonts.regular, fontSize: 12, color: OW.gray500 },
  etaVal: { fontFamily: TQFonts.bold, fontSize: 26, color: OW.black },
  earnBadge: {
    backgroundColor: OW.yellowSoft,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: TQRadii.md,
    borderWidth: 1,
    borderColor: OW.yellow,
    alignItems: 'flex-end',
  },
  earnLabel: { fontFamily: TQFonts.regular, fontSize: 10, color: OW.gray500 },
  earnVal: { fontFamily: TQFonts.bold, fontSize: 16, color: OW.black },
  routeCard: {
    backgroundColor: OW.gray100,
    borderRadius: TQRadii.lg,
    padding: 14,
  },
  routeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  routeDot: { width: 12, height: 12, borderRadius: 6, marginTop: 4 },
  routeDotPickup: { backgroundColor: OW.green },
  routeDotDrop: { backgroundColor: OW.yellow },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: OW.gray200,
    marginLeft: 5,
    marginVertical: 4,
  },
  routeText: { flex: 1 },
  routeLabel: { fontFamily: TQFonts.semiBold, fontSize: 11, color: OW.gray500, textTransform: 'uppercase' },
  routeAddr: { fontFamily: TQFonts.semiBold, fontSize: 14, color: OW.black, marginTop: 2 },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  customerLabel: { fontFamily: TQFonts.regular, fontSize: 10, color: OW.gray500 },
  customerName: { fontFamily: TQFonts.bold, fontSize: 14, color: OW.black },
  cargo: { fontFamily: TQFonts.regular, fontSize: 12, color: OW.gray500 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: OW.yellowSoft,
    borderWidth: 1,
    borderColor: OW.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
