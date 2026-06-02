import { Feather, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LoadTrackingMap } from '@/components/truckq/LoadTrackingMap';
import { BoxImage } from '@/components/truckq/BoxImage';
import { SwipeToShipSlider } from '@/components/truckq/SwipeToShipSlider';
import { TQ, TQFonts, TQRadii } from '@/constants/truckq-design';
import { useLoadTracking } from '@/hooks/useLoadTracking';
import { normalizeLoadId } from '@/lib/loads-api';

const DRIVER_AVATAR =
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80';

const FALLBACK_REGION = {
  latitude: -17.91,
  longitude: 31.055,
  latitudeDelta: 0.22,
  longitudeDelta: 0.22,
};

export default function TrackingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const loadId = useMemo(() => {
    const raw = Array.isArray(id) ? id[0] : id;
    return raw ? normalizeLoadId(raw) : '';
  }, [id]);

  const { load, route, truck, region, loading, error } = useLoadTracking(loadId, true);

  const displayId = useMemo(() => {
    if (load?.load_id) return `#${load.load_id}`;
    if (!loadId) return '#—';
    return loadId.startsWith('#') ? loadId : `#${loadId}`;
  }, [load, loadId]);

  const openDial = () => {
    void Linking.openURL('tel:+263771000000');
  };
  const openChat = () => {
    void Haptics.selectionAsync();
  };

  const mapRegion = region ?? FALLBACK_REGION;
  const pickup = route?.pickup;
  const destination = route?.destination;
  const polyline = route?.route.polyline;

  return (
    <View style={styles.root}>
      <View style={styles.mapSlot}>
        {loading && !route ? (
          <View style={styles.mapLoading}>
            <ActivityIndicator size="large" color={TQ.yellowDeep} />
          </View>
        ) : error && !route ? (
          <View style={styles.mapLoading}>
            <Text style={styles.mapError}>{error}</Text>
          </View>
        ) : pickup && destination ? (
          <LoadTrackingMap
            fullScreen
            pickup={pickup}
            destination={destination}
            truck={truck}
            routePolyline={polyline}
            region={mapRegion}
          />
        ) : null}
      </View>

      <LinearGradient
        colors={['rgba(255,255,255,0.97)', 'rgba(255,255,255,0.88)', 'transparent']}
        style={[styles.headerFade, { height: insets.top + 56 }]}
        pointerEvents="none"
      />

      <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
        <Pressable
          onPress={() => router.back()}
          style={styles.headerBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={26} color={TQ.black} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Tracking Shipment
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <View style={styles.sheetHandle} />
        <View style={styles.driverRow}>
          <Image source={{ uri: DRIVER_AVATAR }} style={styles.driverAvatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.driverName}>Guy Hawkins</Text>
            <Text style={styles.driverRole}>Delivery partner</Text>
          </View>
          <Pressable style={styles.circleBtn} onPress={openChat} accessibilityLabel="Message driver">
            <Feather name="message-circle" size={20} color={TQ.black} />
          </Pressable>
          <Pressable style={styles.circleBtn} onPress={openDial} accessibilityLabel="Call driver">
            <Feather name="phone" size={20} color={TQ.black} />
          </Pressable>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaId}>{displayId}</Text>
          <Text style={styles.metaDate}>
            {load?.status ? load.status.replace(/_/g, ' ') : 'Live tracking'}
          </Text>
        </View>

        <View style={styles.timelineWrap}>
          <View style={styles.timeline}>
            <View style={styles.tDot} />
            <View style={styles.tLine} />
            <View style={[styles.tDot, styles.tDotEnd]} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tLabel}>Pickup</Text>
            <Text style={styles.tVal}>{load?.pickup_address ?? '—'}</Text>
            <View style={{ height: 16 }} />
            <Text style={styles.tLabel}>Deliver to</Text>
            <Text style={styles.tVal}>{load?.destination_address ?? '—'}</Text>
          </View>
          <BoxImage width={56} />
        </View>

        <SwipeToShipSlider
          label="Confirm delivery received"
          onComplete={() => {
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.push({
              pathname: '/delivery-done/[id]',
              params: { id: (load?.load_id ?? loadId).replace('#', '') },
            });
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: TQ.gray100,
  },
  mapSlot: {
    ...StyleSheet.absoluteFillObject,
  },
  mapLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TQ.gray100,
    padding: 24,
  },
  mapError: {
    fontFamily: TQFonts.medium,
    fontSize: 14,
    color: TQ.gray500,
    textAlign: 'center',
  },
  headerFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  headerBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: TQRadii.md,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: TQ.gray200,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: TQFonts.semiBold,
    fontSize: 16,
    color: TQ.ink,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: TQ.white,
    borderTopLeftRadius: TQRadii.xl,
    borderTopRightRadius: TQRadii.xl,
    paddingHorizontal: 20,
    paddingTop: 10,
    shadowColor: TQ.black,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: TQ.gray200,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 99,
    backgroundColor: TQ.gray200,
    marginBottom: 12,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  driverAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: TQ.white,
    backgroundColor: TQ.gray200,
  },
  driverName: {
    fontFamily: TQFonts.bold,
    fontSize: 18,
    color: TQ.ink,
  },
  driverRole: {
    marginTop: 2,
    fontFamily: TQFonts.medium,
    fontSize: 13,
    color: TQ.gray500,
  },
  circleBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: TQ.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: TQ.gray200,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metaId: {
    fontFamily: TQFonts.bold,
    fontSize: 16,
    color: TQ.ink,
  },
  metaDate: {
    fontFamily: TQFonts.medium,
    fontSize: 13,
    color: TQ.gray500,
    textTransform: 'capitalize',
  },
  timelineWrap: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 18,
    gap: 12,
  },
  timeline: {
    width: 14,
    alignItems: 'center',
    paddingTop: 4,
  },
  tDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: TQ.green,
    borderWidth: 2,
    borderColor: TQ.white,
    shadowColor: TQ.black,
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tDotEnd: {
    backgroundColor: TQ.yellow,
    borderColor: TQ.black,
  },
  tLine: {
    flex: 1,
    width: 2,
    marginVertical: 4,
    backgroundColor: TQ.gray300,
    borderRadius: 99,
    opacity: 0.65,
  },
  tLabel: {
    fontFamily: TQFonts.medium,
    fontSize: 12,
    color: TQ.gray500,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  tVal: {
    marginTop: 4,
    fontFamily: TQFonts.semiBold,
    fontSize: 14,
    color: TQ.ink,
    lineHeight: 20,
  },
});
