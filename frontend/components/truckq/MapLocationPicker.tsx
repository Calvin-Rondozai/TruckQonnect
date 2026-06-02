import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MapFallback } from '@/components/truckq/MapFallback';
import { TQ, TQFonts, TQRadii } from '@/constants/truckq-design';
import type { MapLocation, PlaceSearchResult } from '@/lib/map-location';
import { reverseGeocode, searchPlacesWithFallback } from '@/lib/map-location';

const DEFAULT_REGION: Region = {
  latitude: -17.8252,
  longitude: 31.0518,
  latitudeDelta: 0.45,
  longitudeDelta: 0.45,
};

const PIN_REGION_DELTA = 0.045;

type Props = {
  visible: boolean;
  title: string;
  initial?: MapLocation | null;
  onClose: () => void;
  onConfirm: (location: MapLocation) => void;
};

export function MapLocationPicker({ visible, title, initial, onClose, onConfirm }: Props) {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [pin, setPin] = useState<MapLocation | null>(initial ?? null);
  const [resolving, setResolving] = useState(false);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<PlaceSearchResult[]>([]);
  const [region, setRegion] = useState<Region>(
    initial
      ? {
          latitude: initial.latitude,
          longitude: initial.longitude,
          latitudeDelta: PIN_REGION_DELTA,
          longitudeDelta: PIN_REGION_DELTA,
        }
      : DEFAULT_REGION
  );

  useEffect(() => {
    if (!visible) return;
    setPin(initial ?? null);
    setQuery(initial?.address ?? '');
    setResults([]);
    setRegion(
      initial
        ? {
            latitude: initial.latitude,
            longitude: initial.longitude,
            latitudeDelta: PIN_REGION_DELTA,
            longitudeDelta: PIN_REGION_DELTA,
          }
        : DEFAULT_REGION
    );
  }, [visible, initial]);

  const focusOn = useCallback((latitude: number, longitude: number, address: string) => {
    const next: Region = {
      latitude,
      longitude,
      latitudeDelta: PIN_REGION_DELTA,
      longitudeDelta: PIN_REGION_DELTA,
    };
    setRegion(next);
    mapRef.current?.animateToRegion(next, 450);
    setPin({ latitude, longitude, address });
  }, []);

  const pickAt = useCallback(
    async (latitude: number, longitude: number) => {
      setResolving(true);
      setResults([]);
      Keyboard.dismiss();
      const address = await reverseGeocode(latitude, longitude);
      focusOn(latitude, longitude, address);
      setQuery(address);
      setResolving(false);
    },
    [focusOn]
  );

  const runSearch = useCallback((text: string) => {
    setQuery(text);
    if (searchTimer.current) clearTimeout(searchTimer.current);

    if (text.trim().length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    searchTimer.current = setTimeout(() => {
      void (async () => {
        const found = await searchPlacesWithFallback(text);
        setResults(found);
        setSearching(false);
      })();
    }, 400);
  }, []);

  const selectResult = (item: PlaceSearchResult) => {
    Keyboard.dismiss();
    setResults([]);
    setQuery(item.label);
    focusOn(item.latitude, item.longitude, item.label);
  };

  const useMyLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    setResults([]);
    const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    const { latitude, longitude } = pos.coords;
    await pickAt(latitude, longitude);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable onPress={onClose} hitSlop={12} style={styles.headerBtn}>
            <Feather name="x" size={24} color={TQ.black} />
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
          <Pressable
            onPress={() => pin && onConfirm(pin)}
            disabled={!pin}
            style={[styles.doneBtn, !pin && styles.doneBtnDisabled]}
          >
            <Text style={[styles.doneText, !pin && styles.doneTextDisabled]}>Done</Text>
          </Pressable>
        </View>

        <View style={styles.searchWrap}>
          <Feather name="search" size={18} color={TQ.gray500} style={styles.searchIcon} />
          <TextInput
            value={query}
            onChangeText={runSearch}
            placeholder="Search address or place…"
            placeholderTextColor={TQ.gray400}
            style={styles.searchInput}
            returnKeyType="search"
            onFocus={() => {
              if (query.trim().length >= 2) void runSearch(query);
            }}
          />
          {searching ? (
            <ActivityIndicator size="small" color={TQ.gray500} style={styles.searchSpinner} />
          ) : query.length > 0 ? (
            <Pressable
              onPress={() => {
                setQuery('');
                setResults([]);
              }}
              hitSlop={8}
              style={styles.clearBtn}
            >
              <Feather name="x-circle" size={18} color={TQ.gray400} />
            </Pressable>
          ) : null}
        </View>

        {results.length > 0 ? (
          <View style={styles.resultsList}>
            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [styles.resultRow, pressed && { backgroundColor: TQ.gray100 }]}
                  onPress={() => selectResult(item)}
                >
                  <Feather name="map-pin" size={16} color={TQ.yellowDeep} />
                  <Text style={styles.resultText} numberOfLines={2}>
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        ) : null}

        <Text style={styles.hint}>Search above, or tap the map to fine-tune the exact point.</Text>

        <View style={styles.mapWrap}>
          {Platform.OS === 'web' ? (
            <MapFallback />
          ) : (
            <MapView
              ref={mapRef}
              style={StyleSheet.absoluteFill}
              region={region}
              onRegionChangeComplete={setRegion}
              onPress={(e) =>
                void pickAt(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)
              }
            >
              {pin ? (
                <Marker
                  coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
                  draggable
                  onDragEnd={(e) =>
                    void pickAt(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)
                  }
                />
              ) : null}
            </MapView>
          )}
          {resolving ? (
            <View style={styles.resolving}>
              <ActivityIndicator color={TQ.yellowDeep} />
            </View>
          ) : null}
        </View>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Pressable style={styles.gpsBtn} onPress={() => void useMyLocation()}>
            <Feather name="navigation" size={18} color={TQ.black} />
            <Text style={styles.gpsText}>Use my location</Text>
          </Pressable>
          <Text style={styles.address} numberOfLines={3}>
            {pin?.address ?? 'Search or tap the map to choose a point'}
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: TQ.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 8,
  },
  headerBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: {
    flex: 1,
    fontFamily: TQFonts.semiBold,
    fontSize: 17,
    color: TQ.ink,
    textAlign: 'center',
  },
  doneBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: TQRadii.pill,
    backgroundColor: TQ.yellow,
  },
  doneBtnDisabled: { backgroundColor: TQ.gray200 },
  doneText: { fontFamily: TQFonts.bold, fontSize: 14, color: TQ.black },
  doneTextDisabled: { color: TQ.gray400 },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: TQ.gray100,
    borderRadius: TQRadii.lg,
    borderWidth: 1,
    borderColor: TQ.gray200,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    fontFamily: TQFonts.medium,
    fontSize: 15,
    color: TQ.ink,
    paddingVertical: 10,
  },
  searchSpinner: { marginLeft: 8 },
  clearBtn: { marginLeft: 8, padding: 4 },
  resultsList: {
    marginHorizontal: 16,
    marginBottom: 8,
    maxHeight: 180,
    backgroundColor: TQ.white,
    borderRadius: TQRadii.md,
    borderWidth: 1,
    borderColor: TQ.gray200,
    overflow: 'hidden',
    shadowColor: TQ.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: TQ.gray200,
  },
  resultText: {
    flex: 1,
    fontFamily: TQFonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: TQ.ink,
  },
  hint: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    fontFamily: TQFonts.regular,
    fontSize: 12,
    color: TQ.gray600,
  },
  mapWrap: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: TQRadii.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: TQ.gray200,
  },
  resolving: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    gap: 10,
  },
  gpsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: TQRadii.md,
    backgroundColor: TQ.gray100,
    borderWidth: 1,
    borderColor: TQ.gray200,
  },
  gpsText: { fontFamily: TQFonts.semiBold, fontSize: 14, color: TQ.black },
  address: {
    fontFamily: TQFonts.medium,
    fontSize: 14,
    lineHeight: 20,
    color: TQ.ink,
    minHeight: 44,
  },
});
