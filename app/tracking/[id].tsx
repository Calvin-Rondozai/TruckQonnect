import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, { type MapStyleElement, Marker, Polyline } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MapFallback } from '@/components/truckq/MapFallback';
import { PackageStackIllustration } from '@/components/truckq/PackageStackIllustration';
import { SwipeToShipSlider } from '@/components/truckq/SwipeToShipSlider';
import { TQ, TQFonts, TQRadii } from '@/constants/truckq-design';
import { lightMapStyle } from '@/lib/light-map-style';

const DRIVER_AVATAR =
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80';

const ROUTE = {
  pickup: { latitude: -17.8252, longitude: 31.0518 },
  vehicle: { latitude: -17.893, longitude: 31.068 },
  dropoff: { latitude: -17.9939, longitude: 31.0481 },
};

const REGION = {
  latitude: -17.91,
  longitude: 31.055,
  latitudeDelta: 0.22,
  longitudeDelta: 0.22,
};

export default function TrackingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const displayId = useMemo(() => {
    const raw = Array.isArray(id) ? id[0] : id;
    if (!raw) return '#—';
    return raw.startsWith('#') ? raw : `#${raw}`;
  }, [id]);

  const openDial = () => {
    void Linking.openURL('tel:+263771000000');
  };
  const openChat = () => {
    void Haptics.selectionAsync();
  };

  const mapStyle = useMemo((): MapStyleElement[] | undefined => {
    if (Platform.OS !== 'android') return undefined;
    return [...lightMapStyle] as unknown as MapStyleElement[];
  }, []);

  return (
    <View style={styles.root}>
      <View style={styles.mapSlot}>
        {Platform.OS === 'web' ? (
          <MapFallback />
        ) : (
          <MapView
            style={StyleSheet.absoluteFill}
            initialRegion={REGION}
            mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'standard'}
            customMapStyle={mapStyle}
            rotateEnabled={false}
            pitchEnabled={false}
          >
            <Polyline
              coordinates={[ROUTE.pickup, ROUTE.vehicle]}
              strokeColor={TQ.green}
              strokeWidth={5}
              lineCap="round"
              lineJoin="round"
            />
            <Polyline
              coordinates={[ROUTE.vehicle, ROUTE.dropoff]}
              strokeColor={TQ.yellowDeep}
              strokeWidth={5}
              lineCap="round"
              lineJoin="round"
            />
            <Marker coordinate={ROUTE.pickup} anchor={{ x: 0.5, y: 1 }}>
              <View style={styles.markerPickup}>
                <Ionicons name="navigate" size={18} color={TQ.white} />
              </View>
            </Marker>
            <Marker coordinate={ROUTE.vehicle} anchor={{ x: 0.5, y: 0.5 }}>
              <View style={styles.markerTruck}>
                <MaterialCommunityIcons name="truck" size={20} color={TQ.black} />
              </View>
            </Marker>
            <Marker coordinate={ROUTE.dropoff} anchor={{ x: 0.5, y: 1 }}>
              <View style={styles.markerHome}>
                <Feather name="home" size={18} color={TQ.black} />
              </View>
            </Marker>
          </MapView>
        )}
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
          <Text style={styles.metaDate}>May 20 · ETA 15:10</Text>
        </View>

        <View style={styles.timelineWrap}>
          <View style={styles.timeline}>
            <View style={styles.tDot} />
            <View style={styles.tLine} />
            <View style={[styles.tDot, styles.tDotEnd]} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tLabel}>Pickup</Text>
            <Text style={styles.tVal}>11 Josiah Chinamano Ave, Harare</Text>
            <View style={{ height: 16 }} />
            <Text style={styles.tLabel}>Deliver to</Text>
            <Text style={styles.tVal}>Unit 4 · Zengeza 2, Chitungwiza</Text>
          </View>
          <PackageStackIllustration />
        </View>

        <SwipeToShipSlider
          label="Swipe for live updates"
          onComplete={() => {
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
  markerPickup: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: TQ.green,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: TQ.white,
    shadowColor: TQ.black,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  markerTruck: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: TQ.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: TQ.black,
    shadowColor: TQ.black,
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  markerHome: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: TQ.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: TQ.black,
    shadowColor: TQ.black,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
});
