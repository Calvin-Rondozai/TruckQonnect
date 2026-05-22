import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';
import MapView, { type MapStyleElement, Marker, Polyline } from 'react-native-maps';

import { MapFallback } from '@/components/truckq/MapFallback';
import { OW } from '@/constants/owner-design';
import { DEFAULT_OWNER_ROUTE, type OwnerMapRoute } from '@/lib/owner-routes';
import { lightMapStyle } from '@/lib/light-map-style';

type Props = {
  height?: number;
  fullScreen?: boolean;
  route?: OwnerMapRoute;
  style?: ViewStyle;
};

export function OwnerLiveMap({
  height = 240,
  fullScreen = false,
  route = DEFAULT_OWNER_ROUTE,
  style,
}: Props) {
  const mapStyle = useMemo((): MapStyleElement[] | undefined => {
    if (Platform.OS !== 'android') return undefined;
    return [...lightMapStyle] as unknown as MapStyleElement[];
  }, []);

  const slotStyle = [
    styles.slot,
    fullScreen ? styles.slotFull : { height },
    style,
  ];

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
        initialRegion={route.region}
        mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'standard'}
        customMapStyle={mapStyle}
        rotateEnabled={false}
        pitchEnabled={false}
      >
        <Polyline
          coordinates={[route.pickup, route.vehicle]}
          strokeColor={OW.green}
          strokeWidth={5}
          lineCap="round"
          lineJoin="round"
        />
        <Polyline
          coordinates={[route.vehicle, route.dropoff]}
          strokeColor={OW.yellowDeep}
          strokeWidth={5}
          lineCap="round"
          lineJoin="round"
        />
        <Marker coordinate={route.pickup} anchor={{ x: 0.5, y: 1 }}>
          <View style={styles.markerPickup}>
            <Ionicons name="navigate" size={18} color="#fff" />
          </View>
        </Marker>
        <Marker coordinate={route.vehicle} anchor={{ x: 0.5, y: 0.5 }}>
          <View style={styles.markerTruck}>
            <MaterialCommunityIcons name="truck" size={20} color={OW.black} />
          </View>
        </Marker>
        <Marker coordinate={route.dropoff} anchor={{ x: 0.5, y: 1 }}>
          <View style={styles.markerDrop}>
            <Feather name="flag" size={18} color={OW.black} />
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
    backgroundColor: OW.gray100,
  },
  slotFull: {
    flex: 1,
    borderRadius: 0,
  },
  markerPickup: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: OW.green,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  markerTruck: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: OW.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: OW.black,
  },
  markerDrop: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: OW.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: OW.black,
  },
});
