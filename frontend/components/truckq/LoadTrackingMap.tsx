import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';
import MapView, { type MapStyleElement, Marker, Polyline } from 'react-native-maps';
import type { LatLng } from 'react-native-maps';

import { MapFallback } from '@/components/truckq/MapFallback';
import { TQ } from '@/constants/truckq-design';
import { lightMapStyle } from '@/lib/light-map-style';

type Props = {
  pickup: LatLng;
  destination: LatLng;
  truck?: LatLng | null;
  routePolyline?: LatLng[];
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  fullScreen?: boolean;
  height?: number;
  style?: ViewStyle;
};

export function LoadTrackingMap({
  pickup,
  destination,
  truck,
  routePolyline,
  region,
  fullScreen = false,
  height = 240,
  style,
}: Props) {
  const mapStyle = useMemo((): MapStyleElement[] | undefined => {
    if (Platform.OS !== 'android') return undefined;
    return [...lightMapStyle] as unknown as MapStyleElement[];
  }, []);

  const truckPoint = truck ?? pickup;
  const lineCoords = routePolyline?.length
    ? routePolyline
    : [pickup, truckPoint, destination];

  const slotStyle = [styles.slot, fullScreen ? styles.slotFull : { height }, style];

  if (Platform.OS === 'web') {
    return (
      <View style={slotStyle}>
        <MapFallback />
      </View>
    );
  }

  return (
    <View style={slotStyle}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={region}
        mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'standard'}
        customMapStyle={mapStyle}
        rotateEnabled={false}
        pitchEnabled={false}
      >
        {lineCoords.length >= 2 ? (
          <Polyline
            coordinates={lineCoords}
            strokeColor={TQ.yellowDeep}
            strokeWidth={5}
            lineCap="round"
            lineJoin="round"
          />
        ) : null}
        <Marker coordinate={pickup} anchor={{ x: 0.5, y: 1 }}>
          <View style={styles.markerPickup}>
            <Ionicons name="navigate" size={18} color={TQ.white} />
          </View>
        </Marker>
        {truck ? (
          <Marker coordinate={truck} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.markerTruck}>
              <MaterialCommunityIcons name="truck" size={20} color={TQ.black} />
            </View>
          </Marker>
        ) : null}
        <Marker coordinate={destination} anchor={{ x: 0.5, y: 1 }}>
          <View style={styles.markerDrop}>
            <Feather name="home" size={18} color={TQ.black} />
          </View>
        </Marker>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  slot: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: TQ.gray100,
  },
  slotFull: {
    flex: 1,
    borderRadius: 0,
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
  },
  markerTruck: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: TQ.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: TQ.black,
  },
  markerDrop: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: TQ.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: TQ.black,
  },
});
